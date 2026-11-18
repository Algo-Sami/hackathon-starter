import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processIncomingMessage } from "@/lib/services/messageProcessingService";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Atomically claim up to 5 pending requests
    const { data: pendingRequests, error: fetchErr } = await supabase
      .from("ai_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(5);

    if (fetchErr || !pendingRequests || pendingRequests.length === 0) {
      return NextResponse.json({ processed: 0, message: "Queue is empty" }, { status: 200 });
    }

    const processedResults = [];

    for (const item of pendingRequests) {
      // Lock item to processing
      await supabase
        .from("ai_requests")
        .update({ status: "processing", updated_at: new Date().toISOString() })
        .eq("id", item.id);

      try {
        const payload = item.payload as {
          message?: string;
          userRole?: string;
          senderName?: string;
        } | null;

        const result = await processIncomingMessage({
          message: payload?.message || "",
          userRoleOverride: payload?.userRole || "Event Organizer",
          senderNameOverride: payload?.senderName || "Queue Worker",
          eventId: item.event_id,
        });

        await supabase
          .from("ai_requests")
          .update({
            status: "completed",
            response: result,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        processedResults.push({ id: item.id, success: true, result });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Processing error";
        const newAttempts = (item.attempts || 0) + 1;
        const finalStatus = newAttempts >= 3 ? "failed" : "pending";

        await supabase
          .from("ai_requests")
          .update({
            status: finalStatus,
            attempts: newAttempts,
            last_error: errMsg,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        processedResults.push({ id: item.id, success: false, error: errMsg });
      }
    }

    return NextResponse.json(
      { processed: processedResults.length, results: processedResults },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Queue worker failed";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: queueItems, error } = await supabase
      .from("ai_requests")
      .select("id, task_type, status, attempts, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ queue: [] }, { status: 200 });
    }

    return NextResponse.json({ queue: queueItems || [] }, { status: 200 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to inspect queue";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

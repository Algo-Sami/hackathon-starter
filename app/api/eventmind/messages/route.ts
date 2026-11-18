import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processIncomingMessage } from "@/lib/services/messageProcessingService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sourceType, userRole, senderName, eventId } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    const result = await processIncomingMessage({
      message: message.trim(),
      sourceType: sourceType || "text",
      userRoleOverride: userRole,
      senderNameOverride: senderName,
      eventId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("[EventMind Messages API Error]", errMessage);
    return NextResponse.json(
      { error: "Internal server error during message processing", details: errMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || "00000000-0000-0000-0000-000000000001";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] }, { status: 200 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch messages";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

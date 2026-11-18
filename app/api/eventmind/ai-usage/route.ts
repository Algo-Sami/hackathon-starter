import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || "00000000-0000-0000-0000-000000000001";

    const { data: logs, error } = await supabase
      .from("ai_usage_logs")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ logs: [] }, { status: 200 });
    }

    const totalTokens = (logs || []).reduce(
      (sum, item) => sum + (item.total_tokens || 0),
      0
    );

    return NextResponse.json(
      {
        totalCalls: logs?.length || 0,
        totalTokens,
        logs: logs || [],
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch usage";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

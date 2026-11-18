import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || "00000000-0000-0000-0000-000000000001";

    const { data: history, error } = await supabase
      .from("plan_change_history")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error || !history || history.length === 0) {
      return NextResponse.json({ history: [] }, { status: 200 });
    }

    const mapped = history.map((item) => ({
      id: item.id,
      timestamp: new Date(item.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      submittedBy: item.changed_by,
      role: item.changed_by_role,
      section: item.affected_section,
      rawMessage: item.change_reason,
      previousValue: item.previous_value || undefined,
      newValue: item.new_value || undefined,
      aiAction: item.change_reason,
      status: item.status,
    }));

    return NextResponse.json({ history: mapped }, { status: 200 });
  } catch {
    return NextResponse.json({ history: [] }, { status: 200 });
  }
}

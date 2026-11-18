import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initialEventPlanState } from "@/lib/eventmind/mockData";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || "00000000-0000-0000-0000-000000000001";
    const role = searchParams.get("role");

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (role) {
      query = query.eq("recipient_role", role);
    }

    const { data: notifs, error } = await query;

    if (error || !notifs || notifs.length === 0) {
      return NextResponse.json(
        { notifications: initialEventPlanState.notifications },
        { status: 200 }
      );
    }

    return NextResponse.json({ notifications: notifs }, { status: 200 });
  } catch {
    return NextResponse.json(
      { notifications: initialEventPlanState.notifications },
      { status: 200 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update notification";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

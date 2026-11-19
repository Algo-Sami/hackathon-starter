import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initialEventPlanState } from "@/lib/eventmind/mockData";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || "00000000-0000-0000-0000-000000000001";

    const { data: planRow, error } = await supabase
      .from("shared_event_plans")
      .select("*")
      .eq("event_id", eventId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ plan: initialEventPlanState }, { status: 200 });
    }

    if (!planRow) {
      return NextResponse.json({ plan: initialEventPlanState }, { status: 200 });
    }

    const catering = (planRow.catering_details as Record<string, unknown>) || {};
    const headcount = (catering.headcount as number) || (planRow.headcount as number) || 177;
    const studentCount =
      (catering.studentCount as number) ||
      (catering.students as number) ||
      (headcount > 27 ? headcount - 27 : 150);

    // Merge baseline structure with stored jsonb sections
    const mergedPlan = {
      ...initialEventPlanState,
      version: planRow.version || initialEventPlanState.version,
      isValid: planRow.is_valid,
      lastUpdated: planRow.last_updated_at || initialEventPlanState.lastUpdated,
      venue: {
        ...initialEventPlanState.venue,
        ...((planRow.venue_details as Record<string, unknown>) || {}),
        expectedAttendance: headcount,
        headcount,
        studentCount,
      },
      catering: { ...initialEventPlanState.food, ...catering, headcount, studentCount },
      food: { ...initialEventPlanState.food, ...catering, headcount, studentCount },
      budget: { ...initialEventPlanState.budget, ...((planRow.budget_details as Record<string, unknown>) || {}) },
      schedule: { ...initialEventPlanState.schedule, ...((planRow.schedule_details as Record<string, unknown>) || {}) },
      judging: { ...initialEventPlanState.judging, ...((planRow.judging_details as Record<string, unknown>) || {}) },
    };

    return NextResponse.json({ plan: mergedPlan }, { status: 200 });
  } catch {
    return NextResponse.json({ plan: initialEventPlanState }, { status: 200 });
  }
}

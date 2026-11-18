import { createClient } from "@/lib/supabase/server";
import { executeCentralizedAiTask } from "./aiProviderService";
import { validateProposedPlanChange } from "./eventValidationEngine";
import { applyIncrementalPlanUpdate } from "./planUpdateEngine";

export interface ProcessMessageRequest {
  message: string;
  sourceType?: "text" | "voice_transcription" | "document" | "system";
  eventId?: string;
  userRoleOverride?: string;
  senderNameOverride?: string;
}

export interface ProcessMessageResult {
  success: boolean;
  messageId: string;
  senderName: string;
  senderRole: string;
  rawText: string;
  classification: string;
  decisionStatus: "accepted" | "rejected" | "unresolved" | "pending";
  decisionReason: string;
  affectedAreas: string[];
  planVersion: number;
  aiProvider: string;
  aiModel: string;
  latencyMs: number;
}

const DEFAULT_EVENT_ID = "00000000-0000-0000-0000-000000000001";

/**
 * End-to-End Central Message Processing Service
 * Connects user input to AI fallback, deterministic validation, and shared event plan.
 */
export async function processIncomingMessage(
  req: ProcessMessageRequest
): Promise<ProcessMessageResult> {
  const supabase = await createClient();

  // 1. Authenticate user & retrieve actual role from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let authorName = req.senderNameOverride || "Event Contributor";
  let userRole = req.userRoleOverride || "Event Organizer";
  const userId = user?.id || null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      if (profile.full_name) authorName = profile.full_name;
      if (profile.role) userRole = profile.role;
    } else if (user.user_metadata?.role) {
      userRole = user.user_metadata.role;
      if (user.user_metadata.full_name) authorName = user.user_metadata.full_name;
    }
  }

  const eventId = req.eventId || DEFAULT_EVENT_ID;

  // 2. Fetch current event plan context
  let currentPlanContext = "Headcount: 177. Venue: Hall B (220 seats, Rs 180,000). Budget Ceiling: Rs 650,000. Food: 177 meals @ Rs 650. Schedule: 4 hours (01:00 PM - 05:00 PM with Asr prayer break).";
  const { data: planRow } = await supabase
    .from("shared_event_plans")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();

  if (planRow) {
    currentPlanContext = JSON.stringify({
      venue: planRow.venue_details,
      catering: planRow.catering_details,
      budget: planRow.budget_details,
      schedule: planRow.schedule_details,
      judging: planRow.judging_details,
    });
  }

  // 3. Persist incoming message to Supabase messages table
  const { data: msgRow } = await supabase
    .from("messages")
    .insert({
      event_id: eventId,
      user_id: userId,
      sender_name: authorName,
      sender_role: userRole,
      message_content: req.message,
      source_type: req.sourceType || "text",
      processing_status: "processing",
      language: /[a-zA-Z]/.test(req.message) && (req.message.includes("bhai") || req.message.includes("salam")) ? "roman_ur" : "en",
    })
    .select("id")
    .maybeSingle();

  const messageId = msgRow?.id || `MSG-${Date.now()}`;

  // 4. Centralized Multi-Provider AI Interpretation
  const aiResult = await executeCentralizedAiTask({
    task_type: "message_analysis",
    user_message: req.message,
    sender_role: userRole,
    current_plan_context: currentPlanContext,
    event_id: eventId,
    user_id: userId || undefined,
  });

  // 5. Deterministic Backend Validation
  const validation = validateProposedPlanChange(
    aiResult.data,
    req.message,
    userRole
  );

  // 6. Incremental Plan Update Engine
  const updateResult = await applyIncrementalPlanUpdate({
    eventId,
    messageId,
    authorName,
    authorRole: userRole,
    rawMessage: req.message,
    proposal: aiResult.data,
    validation,
    aiProvider: aiResult.provider,
    aiModel: aiResult.model,
  });

  const decisionStatus: ProcessMessageResult["decisionStatus"] =
    validation.action === "Accepted"
      ? "accepted"
      : validation.action === "Rejected"
      ? "rejected"
      : "unresolved";

  // 7. Update message status in Supabase
  if (msgRow?.id) {
    try {
      await supabase
        .from("messages")
        .update({
          processing_status: "completed",
          decision_status: decisionStatus,
          decision_reason: validation.reason,
          affected_sections: validation.affectedSections,
        })
        .eq("id", msgRow.id);
    } catch {
      // Ignore background logging error
    }
  }

  return {
    success: validation.isValid,
    messageId,
    senderName: authorName,
    senderRole: userRole,
    rawText: req.message,
    classification: aiResult.data.intent,
    decisionStatus,
    decisionReason: validation.reason,
    affectedAreas: validation.affectedSections,
    planVersion: updateResult.newVersion,
    aiProvider: aiResult.provider,
    aiModel: aiResult.model,
    latencyMs: aiResult.response_time_ms,
  };
}

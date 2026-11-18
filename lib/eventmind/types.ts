/**
 * EventMind AI Data Types
 * Aligned with PRD.md Section 1.0 & Section 9.0 (Five required planning areas)
 */

export type AreaTag = "reading" | "venue" | "schedule" | "food" | "judging" | "budget";

export type MessageClassification =
  | "confirmed_fact"
  | "hard_constraint"
  | "update"
  | "suggestion"
  | "irrelevant"
  | "outdated_superseded"
  | "conflict"
  | "invalid_proposal"
  | "unresolved";

export type DecisionStatus = "accepted" | "rejected" | "superseded" | "unresolved" | "pending";

export interface EventMessage {
  id: string;
  sequence: number;
  sender?: string;
  role?: string;
  timestamp: string;
  rawText: string;
  language: "en" | "roman_ur" | "mixed";
  classification: MessageClassification;
  decisionStatus: DecisionStatus;
  decisionReason?: string;
  affectedAreas: AreaTag[];
  isLatest?: boolean;
}

export interface VenuePlan {
  name: string;
  location: string;
  capacity: number;
  expectedAttendance: number;
  cost: number;
  selectionReason: string;
  sourceMessageId: string;
  operationalConstraints: string[];
  status: "approved" | "proposed" | "unresolved" | "rejected";
}

export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  title: string;
  type: "ceremony" | "activity" | "break" | "prayer" | "judging" | "awards";
  sourceMessageId: string;
  notes?: string;
}

export interface SchedulePlan {
  totalDurationHours: number;
  eventStartTime: string;
  eventEndTime: string;
  prayerBreakIncluded: boolean;
  activities: ScheduleItem[];
  status: "approved" | "proposed" | "unresolved" | "rejected";
}

export interface FoodPlan {
  headcount: number;
  studentCount: number;
  staffCount: number;
  judgeCount: number;
  requiredQuantity: number;
  itemDescription: string;
  unitPrice: number;
  deliveryCharges: number;
  totalCost: number;
  sourceMessageId: string;
  rejectedProposals?: Array<{
    proposal: string;
    reason: string;
    messageId: string;
  }>;
  status: "approved" | "proposed" | "unresolved" | "rejected";
}

export interface JudgingPlan {
  totalTeams: number;
  totalStudents: number;
  availableJudges: number;
  teamsPerJudge: number;
  minutesPerTeam: number;
  maxFeasibleCapacity: number;
  allocationStatus: "feasible" | "capacity_warning" | "infeasible";
  judgesList: Array<{
    name: string;
    domain: string;
    assignedTeams: number;
    arrivalStatus: string;
  }>;
  sourceMessageId: string;
  status: "approved" | "proposed" | "unresolved" | "rejected";
}

export interface BudgetItem {
  id: string;
  category: "venue" | "food" | "printing" | "swag_shields" | "logistics" | "unapproved_request";
  name: string;
  amount: number;
  type: "committed" | "planned" | "optional_unapproved";
  sourceMessageId: string;
  status: "approved" | "proposed" | "rejected";
  notes?: string;
}

export interface BudgetPlan {
  approvedTotal: number;
  totalCommitted: number;
  totalPlanned: number;
  remainingBalance: number;
  currency: string;
  items: BudgetItem[];
  status: "approved" | "proposed" | "unresolved" | "rejected";
}

export interface PlanValidationCheck {
  id: string;
  area: AreaTag | "global";
  name: string;
  description: string;
  passed: boolean;
  actualValue: string | number;
  thresholdOrRule: string | number;
  reason: string;
}

export interface ModelCallTrace {
  id: string;
  sequence: number;
  runId: string;
  timestamp: string;
  model: string;
  areaTag: AreaTag;
  inputPrompt: string;
  outputResponse: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
}

export interface EventPlanState {
  workspaceName: string;
  eventName: string;
  location: string;
  lastUpdated: string;
  version: number;
  isValid: boolean;
  venue: VenuePlan;
  schedule: SchedulePlan;
  food: FoodPlan;
  judging: JudgingPlan;
  budget: BudgetPlan;
  validations: PlanValidationCheck[];
  messages: EventMessage[];
  traces: ModelCallTrace[];
  totalTokensUsed: number;
}

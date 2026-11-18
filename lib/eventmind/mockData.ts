import { EventPlanState } from "./types";

export const initialEventPlanState: EventPlanState = {
  workspaceName: "Islamabad Hackathon 2026 Workspace",
  eventName: "Physical Hackathon Islamabad",
  location: "Islamabad, Pakistan",
  lastUpdated: "18 Nov 2026, 11:00 AM",
  version: 2,
  isValid: true,
  currentUserRole: "Event Organizer",
  currentUserName: "Organizer Admin",

  // ── Area 1: Venue ────────────────────────────────────────────────────────────
  venue: {
    name: "Islamabad Innovation Hall B (Pak-China Friendship Centre)",
    location: "Shakarparian, Islamabad",
    capacity: 220,
    expectedAttendance: 177,
    cost: 180000,
    selectionReason:
      "Sufficient capacity for 177 attendees (150 students, 10 staff, 17 judges/mentors) within approved budget limit. Includes high-speed LAN, stable power backup, and dedicated audio/visual setup.",
    sourceMessageId: "MSG-002",
    operationalConstraints: [
      "AC must remain operational throughout 4-hour session",
      "Setup entry permitted 1 hour prior to start (12:00 PM)",
      "Strict no-open-flame policy inside the main auditorium",
    ],
    status: "approved",
  },

  // ── Area 2: Schedule ─────────────────────────────────────────────────────────
  schedule: {
    totalDurationHours: 4.0,
    eventStartTime: "01:00 PM",
    eventEndTime: "05:00 PM",
    prayerBreakIncluded: true,
    status: "approved",
    activities: [
      {
        id: "SCH-001",
        startTime: "01:00 PM",
        endTime: "01:25 PM",
        durationMinutes: 25,
        title: "Registration & Opening Ceremony",
        type: "ceremony",
        sourceMessageId: "MSG-001",
        notes: "Welcome address, hackathon rules briefing, challenge release.",
      },
      {
        id: "SCH-002",
        startTime: "01:25 PM",
        endTime: "03:00 PM",
        durationMinutes: 95,
        title: "Sprint 1: Architecture, Core Development & Mentorship",
        type: "activity",
        sourceMessageId: "MSG-001",
        notes: "50 teams hacking simultaneously; mentor roving rounds.",
      },
      {
        id: "SCH-003",
        startTime: "03:00 PM",
        endTime: "03:20 PM",
        durationMinutes: 20,
        title: "Asr Prayer & Refreshment Break",
        type: "prayer",
        sourceMessageId: "MSG-003",
        notes: "Dedicated prayer hall on 1st floor; boxes served in cafeteria foyer.",
      },
      {
        id: "SCH-004",
        startTime: "03:20 PM",
        endTime: "04:35 PM",
        durationMinutes: 75,
        title: "Final Submissions & Parallel Judging Rounds",
        type: "judging",
        sourceMessageId: "MSG-007",
        notes:
          "Parallel evaluation across 17 judges (~3 teams per judge). Dr. Tariq joins group 3 at 03:30 PM without delaying total slot.",
      },
      {
        id: "SCH-005",
        startTime: "04:35 PM",
        endTime: "05:00 PM",
        durationMinutes: 25,
        title: "Closing Ceremony & Shields Distribution",
        type: "awards",
        sourceMessageId: "MSG-001",
        notes: "Announcement of top 3 teams, shields & swag distribution.",
      },
    ],
  },

  // ── Area 3: Food ─────────────────────────────────────────────────────────────
  food: {
    headcount: 177,
    studentCount: 150,
    staffCount: 10,
    judgeCount: 17,
    requiredQuantity: 177,
    itemDescription: "Individual Premium Chicken Biryani Box + Cold Drink / Mineral Water + Disposable Cutlery",
    unitPrice: 650,
    deliveryCharges: 5000,
    totalCost: 120050, // 177 * 650 + 5000 = 115050 + 5000 = 120050
    sourceMessageId: "MSG-003",
    status: "approved",
    rejectedProposals: [
      {
        proposal: "Bhai 100 boxes mangwa lo kafi hongay bachat ho jaye gi",
        reason:
          "Violates hard constraint: Total required food headcount is 177 (150 students in 50 teams + 10 organizers/staff + 17 judges/mentors). Reducing order to 100 boxes causes a critical shortage of 77 meals.",
        messageId: "MSG-004",
      },
    ],
  },

  // ── Area 4: Judging ──────────────────────────────────────────────────────────
  judging: {
    totalTeams: 50,
    totalStudents: 150,
    availableJudges: 17,
    teamsPerJudge: 3, // 50 / 17 = 2.94 max 3 teams
    minutesPerTeam: 8,
    maxFeasibleCapacity: 51,
    allocationStatus: "feasible",
    sourceMessageId: "MSG-001",
    status: "approved",
    judgesList: [
      { name: "Dr. Ayesha Malik", domain: "AI & Machine Learning", assignedTeams: 3, arrivalStatus: "Confirmed on-time" },
      { name: "Engr. Usman Qureshi", domain: "Full-Stack & Cloud Architecture", assignedTeams: 3, arrivalStatus: "Confirmed on-time" },
      { name: "Dr. Tariq Mahmood", domain: "Cybersecurity & Cryptography", assignedTeams: 3, arrivalStatus: "Noted 10-min traffic delay (Starts 03:30 PM)" },
      { name: "Zainab Farooq", domain: "Product Design & UX", assignedTeams: 3, arrivalStatus: "Confirmed on-time" },
      { name: "Bilal Ahmed", domain: "Fintech & Data Systems", assignedTeams: 3, arrivalStatus: "Confirmed on-time" },
      { name: "Hamza Siddiqui", domain: "Distributed Systems", assignedTeams: 3, arrivalStatus: "Confirmed on-time" },
      { name: "Sara Khan", domain: "NLP & Language Models", assignedTeams: 3, arrivalStatus: "Confirmed on-time" },
      { name: "10 Industry Mentors / Judges", domain: "Applied Software Engineering", assignedTeams: 29, arrivalStatus: "Confirmed on-time" },
    ],
  },

  // ── Area 5: Budget ───────────────────────────────────────────────────────────
  budget: {
    approvedTotal: 650000,
    totalCommitted: 400050,
    totalPlanned: 150000,
    remainingBalance: 99950,
    currency: "PKR (Rs)",
    status: "approved",
    items: [
      {
        id: "BUD-001",
        category: "venue",
        name: "Hall B Rental & Operational AV Facility",
        amount: 180000,
        type: "committed",
        sourceMessageId: "MSG-002",
        status: "approved",
        notes: "Pak-China Friendship Centre quotation invoice #4491.",
      },
      {
        id: "BUD-002",
        category: "food",
        name: "Catering: 177 Biryani Meal Boxes + Cold Drinks + Delivery",
        amount: 120050,
        type: "committed",
        sourceMessageId: "MSG-003",
        status: "approved",
        notes: "177 meals @ Rs 650 = Rs 115,050 + Rs 5,000 chilled delivery charge.",
      },
      {
        id: "BUD-003",
        category: "printing",
        name: "Flex Banners, Team Badges & Lanyards (Updated)",
        amount: 15000,
        type: "committed",
        sourceMessageId: "MSG-005",
        status: "approved",
        notes: "Updated from original Rs 10,000 estimate following vendor flex size adjustment.",
      },
      {
        id: "BUD-004",
        category: "swag_shields",
        name: "Winner Shields (1st, 2nd, 3rd) & Participant Certificates",
        amount: 85000,
        type: "committed",
        sourceMessageId: "MSG-001",
        status: "approved",
        notes: "3 Custom acrylic shields + 150 student certificates with embossed folders.",
      },
      {
        id: "BUD-005",
        category: "logistics",
        name: "Power Backup Extension Strips & High-Speed LAN Routers",
        amount: 150000,
        type: "planned",
        sourceMessageId: "MSG-001",
        status: "approved",
        notes: "Hardware rental and on-site technical standby team.",
      },
      {
        id: "BUD-006",
        category: "unapproved_request",
        name: "DJ & Live Sound Setup (Optional Request)",
        amount: 35000,
        type: "optional_unapproved",
        sourceMessageId: "MSG-006",
        status: "rejected",
        notes:
          "Rejected/Pending Approval: Request lacks patron sign-off and is non-essential for a physical coding competition.",
      },
    ],
  },

  // ── Deterministic Validation Checks ──────────────────────────────────────────
  validations: [
    {
      id: "VAL-001",
      area: "budget",
      name: "Budget Ceiling Compliance",
      description: "Total committed expenses must not exceed approved ceiling of Rs 650,000",
      passed: true,
      actualValue: "Rs 400,050",
      thresholdOrRule: "Rs 650,000",
      reason: "Committed spend (Rs 400,050) is safely within budget ceiling with Rs 99,950 unallocated cushion.",
    },
    {
      id: "VAL-002",
      area: "venue",
      name: "Venue Capacity vs Headcount",
      description: "Venue capacity must accommodate total attendance (students + staff + judges)",
      passed: true,
      actualValue: "220 seats",
      thresholdOrRule: "177 attendees",
      reason: "Hall B capacity (220) provides 43 excess seats over total attendance (177).",
    },
    {
      id: "VAL-003",
      area: "schedule",
      name: "Event Duration & Prayer Break",
      description: "Schedule must span exactly 4 hours (240 min) and include mandatory Asr prayer break",
      passed: true,
      actualValue: "4.0 hrs (20 min prayer)",
      thresholdOrRule: "4.0 hrs mandatory",
      reason: "Total duration is exactly 240 minutes (01:00 PM – 05:00 PM) with 20-min Asr break at 03:00 PM.",
    },
    {
      id: "VAL-004",
      area: "food",
      name: "Food Headcount Sufficiency",
      description: "Ordered food quantity must match 177 meals without unapproved reductions",
      passed: true,
      actualValue: "177 meals",
      thresholdOrRule: "177 meals",
      reason: "177 boxes confirmed. Invalid proposal of 100 boxes was explicitly rejected and blocked.",
    },
    {
      id: "VAL-005",
      area: "judging",
      name: "Judging Allocation Feasibility",
      description: "17 judges must evaluate 50 teams within allocated judging duration (<= 3 teams/judge)",
      passed: true,
      actualValue: "2.94 teams/judge",
      thresholdOrRule: "<= 3 teams/judge",
      reason: "17 judges across 50 teams yields ~2.94 teams per judge. 75-minute slot permits 8 mins per team.",
    },
    {
      id: "VAL-006",
      area: "global",
      name: "All 5 Planning Areas Completed",
      description: "Venue, Schedule, Food, Judging, and Budget plans must all be generated and valid",
      passed: true,
      actualValue: "5 / 5 areas complete",
      thresholdOrRule: "5 required",
      reason: "All 5 required areas generated, mathematically verified, and free of blocking errors.",
    },
  ],

  // ── Messages Ingestion & History (Starts Clean) ──────────────────────────────
  messages: [],

  // ── AI Model Call Trace Records ──────────────────────────────────────────────
  traces: [],

  // ── Plan Update History (Starts Clean) ───────────────────────────────────────
  updateHistory: [],

  // ── Notifications ────────────────────────────────────────────────────────────
  notifications: [],

  totalTokensUsed: 0,
};

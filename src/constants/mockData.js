// =============================================================================
// LEADFLOW DASHBOARD - MOCK DATA CONSTANTS
// =============================================================================

// -----------------------------------------------------------------------------
// Initial Lead Data
// -----------------------------------------------------------------------------

export const initialLeadData = {
  totalLeads: 847,
  callsMade: 342,
  meetingsScheduled: 67,
  lastUpdated: new Date().toLocaleString(),
};

// Backward compatibility alias for initialLeadData with zoo-themed property names
export const initialZooData = {
  population: initialLeadData.totalLeads,
  temperature: initialLeadData.callsMade,
  humidity: initialLeadData.meetingsScheduled,
  lastUpdated: initialLeadData.lastUpdated,
};

// -----------------------------------------------------------------------------
// Initial Notes
// -----------------------------------------------------------------------------

export const initialNotes = [
  {
    id: 1,
    content: "High-priority lead from TechCorp showing strong interest in enterprise plan - follow up by Friday",
    timestamp: new Date(Date.now() - 86400000).toLocaleString(),
  },
  {
    id: 2,
    content: "Q4 campaign performing well - conversion rate up 15% compared to last quarter",
    timestamp: new Date(Date.now() - 172800000).toLocaleString(),
  },
];

// -----------------------------------------------------------------------------
// Initial Alerts
// -----------------------------------------------------------------------------

export const ALERT_TYPES = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  SUCCESS: "success",
};

export const initialAlerts = [
  {
    id: 1,
    message: "High-value lead from FinanceX requires immediate follow-up",
    type: ALERT_TYPES.WARNING,
    time: "2 hours ago",
  },
  {
    id: 2,
    message: "Monthly sales targets achieved - great team performance",
    type: ALERT_TYPES.INFO,
    time: "1 day ago",
  },
  {
    id: 3,
    message: "5 leads pending outreach for more than 48 hours",
    type: ALERT_TYPES.WARNING,
    time: "3 days ago",
  },
];

// -----------------------------------------------------------------------------
// Alert Messages (Single source of truth for random alerts)
// -----------------------------------------------------------------------------

export const alertMessages = [
  // High Priority Leads
  "High-value lead from FinanceX requires immediate follow-up",
  "Enterprise prospect showing strong buying signals",
  "Decision maker scheduled demo for next Tuesday",
  "Hot lead from healthcare sector needs proposal by EOD",

  // Lead Management
  "5 leads pending outreach for more than 48 hours",
  "Lead qualification score updated for 12 prospects",
  "New leads assigned to sales team for follow-up",
  "Lead nurturing campaign completed for Q4 pipeline",

  // Performance & Metrics
  "Monthly sales targets achieved - great team performance",
  "Conversion rate improved by 8% this week",
  "Pipeline value increased by $50K this month",
  "Meeting-to-close ratio reached all-time high",

  // Activity & Outreach
  "Call campaign completed - 85% contact rate achieved",
  "Email sequence performing above industry average",
  "Follow-up reminders scheduled for 15 warm leads",
  "Outreach goals met for the week",

  // Opportunities & Deals
  "3 qualified opportunities moved to proposal stage",
  "Deal closed with RetailCo - $45K annual contract",
  "Negotiation in progress with 2 enterprise accounts",
  "Upsell opportunity identified with existing client",

  // General Updates
  "Weekly sales meeting scheduled for tomorrow at 10 AM",
  "New lead source integration completed successfully",
  "CRM data sync completed - all records up to date",
  "Team training session on new pitch deck available",
];

// -----------------------------------------------------------------------------
// Meeting Schedule Data
// -----------------------------------------------------------------------------

/**
 * Helper function to create date for specific month offset
 * @param {number} monthOffset - Number of months from current date
 * @param {number} day - Day of the month
 * @returns {string} ISO date string
 */
const createMeetingDate = (monthOffset, day) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthOffset);
  date.setDate(day);
  date.setHours(9, 0, 0, 0);
  return date.toISOString();
};

export const MEETING_TYPES = {
  CALL: "call",
  VIDEO: "video",
  IN_PERSON: "in-person",
  DEMO: "demo",
};

export const initialMeetings = [
  // ===== 3 MONTHS AGO =====
  {
    id: 101,
    title: "Initial Consultation",
    client: "Alpha Industries",
    date: createMeetingDate(-3, 5),
    time: "9:00 AM",
    duration: "1 hour",
    type: MEETING_TYPES.CALL,
  },
  {
    id: 102,
    title: "Product Demo",
    client: "Beta Corp",
    date: createMeetingDate(-3, 12),
    time: "2:00 PM",
    duration: "45 min",
    type: MEETING_TYPES.DEMO,
  },
  {
    id: 103,
    title: "Contract Review",
    client: "Gamma LLC",
    date: createMeetingDate(-3, 18),
    time: "11:00 AM",
    duration: "30 min",
    type: MEETING_TYPES.VIDEO,
  },
  {
    id: 104,
    title: "Quarterly Review",
    client: "Delta Systems",
    date: createMeetingDate(-3, 25),
    time: "3:00 PM",
    duration: "1.5 hours",
    type: MEETING_TYPES.IN_PERSON,
  },

  // ===== 2 MONTHS AGO =====
  {
    id: 201,
    title: "Discovery Call",
    client: "Epsilon Tech",
    date: createMeetingDate(-2, 3),
    time: "10:00 AM",
    duration: "45 min",
    type: MEETING_TYPES.CALL,
  },
  {
    id: 202,
    title: "Technical Assessment",
    client: "Zeta Holdings",
    date: createMeetingDate(-2, 8),
    time: "1:00 PM",
    duration: "1 hour",
    type: MEETING_TYPES.VIDEO,
  },
  {
    id: 203,
    title: "Proposal Presentation",
    client: "Eta Partners",
    date: createMeetingDate(-2, 15),
    time: "11:30 AM",
    duration: "1 hour",
    type: MEETING_TYPES.DEMO,
  },
  {
    id: 204,
    title: "Stakeholder Meeting",
    client: "Theta Group",
    date: createMeetingDate(-2, 22),
    time: "4:00 PM",
    duration: "2 hours",
    type: MEETING_TYPES.IN_PERSON,
  },
  {
    id: 205,
    title: "Follow-up Call",
    client: "Alpha Industries",
    date: createMeetingDate(-2, 28),
    time: "9:30 AM",
    duration: "30 min",
    type: MEETING_TYPES.CALL,
  },

  // ===== 1 MONTH AGO =====
  {
    id: 301,
    title: "Onboarding Session",
    client: "Iota Solutions",
    date: createMeetingDate(-1, 2),
    time: "10:00 AM",
    duration: "2 hours",
    type: MEETING_TYPES.VIDEO,
  },
  {
    id: 302,
    title: "Training Workshop",
    client: "Kappa Inc",
    date: createMeetingDate(-1, 7),
    time: "2:00 PM",
    duration: "3 hours",
    type: MEETING_TYPES.IN_PERSON,
  },
  {
    id: 303,
    title: "Sales Pitch",
    client: "Lambda Corp",
    date: createMeetingDate(-1, 12),
    time: "11:00 AM",
    duration: "1 hour",
    type: MEETING_TYPES.DEMO,
  },
  {
    id: 304,
    title: "Contract Negotiation",
    client: "Mu Enterprises",
    date: createMeetingDate(-1, 18),
    time: "3:30 PM",
    duration: "1.5 hours",
    type: MEETING_TYPES.IN_PERSON,
  },
  {
    id: 305,
    title: "Progress Review",
    client: "Beta Corp",
    date: createMeetingDate(-1, 24),
    time: "10:30 AM",
    duration: "45 min",
    type: MEETING_TYPES.VIDEO,
  },

  // ===== THIS MONTH =====
  {
    id: 401,
    title: "Strategy Session",
    client: "Nu Technologies",
    date: createMeetingDate(0, 1),
    time: "9:00 AM",
    duration: "1.5 hours",
    type: MEETING_TYPES.VIDEO,
  },
  {
    id: 402,
    title: "Product Roadmap Review",
    client: "Xi Global",
    date: createMeetingDate(0, 5),
    time: "2:00 PM",
    duration: "1 hour",
    type: MEETING_TYPES.VIDEO,
  },
  {
    id: 403,
    title: "Executive Briefing",
    client: "Omicron Ltd",
    date: createMeetingDate(0, 10),
    time: "11:00 AM",
    duration: "1 hour",
    type: MEETING_TYPES.IN_PERSON,
  },
  {
    id: 404,
    title: "Solution Architecture",
    client: "Pi Systems",
    date: createMeetingDate(0, 15),
    time: "10:00 AM",
    duration: "2 hours",
    type: MEETING_TYPES.DEMO,
  },
  {
    id: 405,
    title: "Partnership Discussion",
    client: "Rho Ventures",
    date: createMeetingDate(0, 20),
    time: "3:00 PM",
    duration: "1 hour",
    type: MEETING_TYPES.VIDEO,
  },
  {
    id: 406,
    title: "Renewal Meeting",
    client: "Gamma LLC",
    date: createMeetingDate(0, 25),
    time: "1:00 PM",
    duration: "45 min",
    type: MEETING_TYPES.CALL,
  },

  // ===== NEXT MONTH =====
  {
    id: 501,
    title: "Kickoff Meeting",
    client: "Sigma Corp",
    date: createMeetingDate(1, 3),
    time: "9:00 AM",
    duration: "2 hours",
    type: MEETING_TYPES.IN_PERSON,
  },
  {
    id: 502,
    title: "Integration Planning",
    client: "Tau Industries",
    date: createMeetingDate(1, 8),
    time: "11:00 AM",
    duration: "1.5 hours",
    type: MEETING_TYPES.VIDEO,
  },
  {
    id: 503,
    title: "Customer Success Check-in",
    client: "Delta Systems",
    date: createMeetingDate(1, 14),
    time: "2:30 PM",
    duration: "30 min",
    type: MEETING_TYPES.CALL,
  },
  {
    id: 504,
    title: "Feature Showcase",
    client: "Upsilon Tech",
    date: createMeetingDate(1, 20),
    time: "10:00 AM",
    duration: "1 hour",
    type: MEETING_TYPES.DEMO,
  },
  {
    id: 505,
    title: "Budget Review",
    client: "Phi Holdings",
    date: createMeetingDate(1, 26),
    time: "4:00 PM",
    duration: "1 hour",
    type: MEETING_TYPES.VIDEO,
  },

  // ===== 2 MONTHS OUT =====
  {
    id: 601,
    title: "Annual Planning",
    client: "Chi Group",
    date: createMeetingDate(2, 5),
    time: "9:00 AM",
    duration: "3 hours",
    type: MEETING_TYPES.IN_PERSON,
  },
  {
    id: 602,
    title: "New Product Launch",
    client: "Psi Networks",
    date: createMeetingDate(2, 12),
    time: "2:00 PM",
    duration: "1.5 hours",
    type: MEETING_TYPES.DEMO,
  },
  {
    id: 603,
    title: "Executive Summit",
    client: "Omega Enterprises",
    date: createMeetingDate(2, 19),
    time: "10:00 AM",
    duration: "4 hours",
    type: MEETING_TYPES.IN_PERSON,
  },
];

// -----------------------------------------------------------------------------
// Recent Lead Activities
// -----------------------------------------------------------------------------

export const ACTIVITY_TYPES = {
  CALL: "call",
  EMAIL: "email",
  MEETING: "meeting",
  NOTE: "note",
  DEAL: "deal",
  TASK: "task",
};

export const ACTIVITY_PRIORITIES = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

export const initialActivities = [
  {
    id: 1,
    type: ACTIVITY_TYPES.DEAL,
    title: "Deal Closed",
    description: "Successfully closed enterprise deal",
    leadName: "TechCorp Industries",
    timestamp: "2 hours ago",
    priority: ACTIVITY_PRIORITIES.HIGH,
    amount: "$125,000",
  },
  {
    id: 2,
    type: ACTIVITY_TYPES.CALL,
    title: "Discovery Call Completed",
    description: "Discussed requirements and timeline",
    leadName: "GlobalTech Solutions",
    timestamp: "3 hours ago",
    priority: ACTIVITY_PRIORITIES.MEDIUM,
  },
  {
    id: 3,
    type: ACTIVITY_TYPES.EMAIL,
    title: "Proposal Sent",
    description: "Sent customized pricing proposal",
    leadName: "InnovateCo",
    timestamp: "5 hours ago",
    priority: ACTIVITY_PRIORITIES.HIGH,
  },
  {
    id: 4,
    type: ACTIVITY_TYPES.MEETING,
    title: "Demo Scheduled",
    description: "Product demo scheduled for next week",
    leadName: "FutureTech Ltd",
    timestamp: "6 hours ago",
    priority: ACTIVITY_PRIORITIES.MEDIUM,
  },
  {
    id: 5,
    type: ACTIVITY_TYPES.NOTE,
    title: "Follow-up Required",
    description: "Decision maker returning from vacation Monday",
    leadName: "StartupX",
    timestamp: "8 hours ago",
    priority: ACTIVITY_PRIORITIES.LOW,
  },
  {
    id: 6,
    type: ACTIVITY_TYPES.CALL,
    title: "Qualification Call",
    description: "Qualified as high-potential enterprise lead",
    leadName: "MegaCorp Inc",
    timestamp: "1 day ago",
    priority: ACTIVITY_PRIORITIES.HIGH,
  },
  {
    id: 7,
    type: ACTIVITY_TYPES.EMAIL,
    title: "Follow-up Email Sent",
    description: "Sent case studies and testimonials",
    leadName: "DataDriven Co",
    timestamp: "1 day ago",
    priority: ACTIVITY_PRIORITIES.MEDIUM,
  },
  {
    id: 8,
    type: ACTIVITY_TYPES.TASK,
    title: "Contract Review",
    description: "Legal team reviewing contract terms",
    leadName: "SecureNet Systems",
    timestamp: "1 day ago",
    priority: ACTIVITY_PRIORITIES.HIGH,
  },
  {
    id: 9,
    type: ACTIVITY_TYPES.DEAL,
    title: "Deal in Negotiation",
    description: "Final pricing discussion scheduled",
    leadName: "CloudFirst Inc",
    timestamp: "2 days ago",
    priority: ACTIVITY_PRIORITIES.HIGH,
    amount: "$85,000",
  },
  {
    id: 10,
    type: ACTIVITY_TYPES.MEETING,
    title: "Stakeholder Presentation",
    description: "Presented to C-suite executives",
    leadName: "Enterprise Solutions",
    timestamp: "2 days ago",
    priority: ACTIVITY_PRIORITIES.HIGH,
  },
];

// =============================================================================
// LEADFLOW DASHBOARD - CONSTANTS
// =============================================================================

// -----------------------------------------------------------------------------
// Storage Keys
// -----------------------------------------------------------------------------

export const STORAGE_KEYS = {
  THEME: "leadflow-theme",
  NOTES: "leadflow-notes",
  SETTINGS: "leadflow-settings",
};

// -----------------------------------------------------------------------------
// Lead Activity Data
// -----------------------------------------------------------------------------

export const activityWeekData = [
  { name: "Mon", leads: 45, callsCompleted: 32 },
  { name: "Tue", leads: 52, callsCompleted: 38 },
  { name: "Wed", leads: 48, callsCompleted: 35 },
  { name: "Thu", leads: 58, callsCompleted: 42 },
  { name: "Fri", leads: 65, callsCompleted: 48 },
  { name: "Sat", leads: 40, callsCompleted: 28 },
  { name: "Sun", leads: 38, callsCompleted: 25 },
];

export const activityMonthData = [
  { name: "Week 1", leads: 180, callsCompleted: 125 },
  { name: "Week 2", leads: 210, callsCompleted: 145 },
  { name: "Week 3", leads: 240, callsCompleted: 170 },
  { name: "Week 4", leads: 280, callsCompleted: 195 },
];

export const activityYearData = [
  { name: "Jan", leads: 520, callsCompleted: 380 },
  { name: "Feb", leads: 580, callsCompleted: 420 },
  { name: "Mar", leads: 640, callsCompleted: 465 },
  { name: "Apr", leads: 720, callsCompleted: 520 },
  { name: "May", leads: 780, callsCompleted: 560 },
  { name: "Jun", leads: 850, callsCompleted: 620 },
  { name: "Jul", leads: 920, callsCompleted: 680 },
  { name: "Aug", leads: 890, callsCompleted: 650 },
  { name: "Sep", leads: 820, callsCompleted: 590 },
  { name: "Oct", leads: 760, callsCompleted: 540 },
  { name: "Nov", leads: 680, callsCompleted: 480 },
  { name: "Dec", leads: 620, callsCompleted: 440 },
];

// -----------------------------------------------------------------------------
// Conversion Rate Data
// -----------------------------------------------------------------------------

export const feedingWeekData = [
  { name: "Mon", efficiency: 28 },
  { name: "Tue", efficiency: 32 },
  { name: "Wed", efficiency: 30 },
  { name: "Thu", efficiency: 35 },
  { name: "Fri", efficiency: 38 },
  { name: "Sat", efficiency: 25 },
  { name: "Sun", efficiency: 22 },
];

export const feedingMonthData = [
  { name: "Week 1", efficiency: 28 },
  { name: "Week 2", efficiency: 31 },
  { name: "Week 3", efficiency: 34 },
  { name: "Week 4", efficiency: 36 },
];

export const feedingYearData = [
  { name: "Jan", efficiency: 22 },
  { name: "Feb", efficiency: 24 },
  { name: "Mar", efficiency: 26 },
  { name: "Apr", efficiency: 28 },
  { name: "May", efficiency: 30 },
  { name: "Jun", efficiency: 33 },
  { name: "Jul", efficiency: 36 },
  { name: "Aug", efficiency: 35 },
  { name: "Sep", efficiency: 33 },
  { name: "Oct", efficiency: 31 },
  { name: "Nov", efficiency: 28 },
  { name: "Dec", efficiency: 25 },
];

// -----------------------------------------------------------------------------
// Lead Source Distribution Data
// -----------------------------------------------------------------------------

export const dietWeekData = [
  { name: "Website", value: 35 },
  { name: "Referrals", value: 28 },
  { name: "Social Media", value: 22 },
  { name: "Cold Outreach", value: 15 },
];

export const dietMonthData = [
  { name: "Website", value: 32 },
  { name: "Referrals", value: 30 },
  { name: "Social Media", value: 25 },
  { name: "Cold Outreach", value: 13 },
];

export const dietYearData = [
  { name: "Website", value: 30 },
  { name: "Referrals", value: 28 },
  { name: "Social Media", value: 27 },
  { name: "Cold Outreach", value: 15 },
];

// -----------------------------------------------------------------------------
// Chart Colors
// -----------------------------------------------------------------------------

export const COLORS_DARK = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"];
export const COLORS_LIGHT = ["#2563eb", "#059669", "#d97706", "#dc2626"];

export const getColors = (darkMode) => (darkMode ? COLORS_DARK : COLORS_LIGHT);

// -----------------------------------------------------------------------------
// Animation Variants
// -----------------------------------------------------------------------------

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const dropdownVariants = {
  closed: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: { duration: 0.15, ease: "easeInOut" },
  },
  open: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.15, ease: "easeInOut" },
  },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// -----------------------------------------------------------------------------
// Initial Lead Data
// -----------------------------------------------------------------------------

export const initialLeadData = {
  totalLeads: 847,
  callsMade: 342,
  meetingsScheduled: 67,
  lastUpdated: new Date().toLocaleString(),
};

// Backward compatibility alias
export const initialZooData = initialLeadData;

// -----------------------------------------------------------------------------
// Initial Notes
// -----------------------------------------------------------------------------

export const initialNotes = [
  {
    id: 1,
    content:
      "High-priority lead from TechCorp showing strong interest in enterprise plan - follow up by Friday",
    timestamp: new Date(Date.now() - 86400000).toLocaleString(),
  },
  {
    id: 2,
    content:
      "Q4 campaign performing well - conversion rate up 15% compared to last quarter",
    timestamp: new Date(Date.now() - 172800000).toLocaleString(),
  },
];

// -----------------------------------------------------------------------------
// Initial Alerts
// -----------------------------------------------------------------------------

export const initialAlerts = [
  {
    id: 1,
    message: "High-value lead from FinanceX requires immediate follow-up",
    type: "warning",
    time: "2 hours ago",
  },
  {
    id: 2,
    message: "Monthly sales targets achieved - great team performance",
    type: "info",
    time: "1 day ago",
  },
  {
    id: 3,
    message: "5 leads pending outreach for more than 48 hours",
    type: "warning",
    time: "3 days ago",
  },
];

// -----------------------------------------------------------------------------
// Meeting Schedule Data
// -----------------------------------------------------------------------------

// Helper function to create date for specific month offset
const createMeetingDate = (monthOffset, day) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthOffset);
  date.setDate(day);
  date.setHours(9, 0, 0, 0);
  return date.toISOString();
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
    type: "video",
  },
  {
    id: 102,
    title: "Requirements Gathering",
    client: "Beta Corp",
    date: createMeetingDate(-3, 12),
    time: "2:00 PM",
    duration: "1.5 hours",
    type: "in-person",
  },
  {
    id: 103,
    title: "Technical Review",
    client: "Gamma Solutions",
    date: createMeetingDate(-3, 18),
    time: "11:00 AM",
    duration: "45 min",
    type: "phone",
  },
  {
    id: 104,
    title: "Budget Discussion",
    client: "Delta Systems",
    date: createMeetingDate(-3, 25),
    time: "3:30 PM",
    duration: "1 hour",
    type: "video",
  },

  // ===== 2 MONTHS AGO =====
  {
    id: 201,
    title: "Product Demo",
    client: "Epsilon Tech",
    date: createMeetingDate(-2, 3),
    time: "10:00 AM",
    duration: "45 min",
    type: "video",
  },
  {
    id: 202,
    title: "Partnership Meeting",
    client: "Zeta Ventures",
    date: createMeetingDate(-2, 8),
    time: "1:00 PM",
    duration: "1 hour",
    type: "in-person",
  },
  {
    id: 203,
    title: "Follow-up Discussion",
    client: "Eta Holdings",
    date: createMeetingDate(-2, 15),
    time: "4:00 PM",
    duration: "30 min",
    type: "phone",
  },
  {
    id: 204,
    title: "Contract Review",
    client: "Theta Group",
    date: createMeetingDate(-2, 15),
    time: "11:00 AM",
    duration: "1 hour",
    type: "video",
  },
  {
    id: 205,
    title: "Quarterly Planning",
    client: "Iota Corp",
    date: createMeetingDate(-2, 22),
    time: "9:30 AM",
    duration: "2 hours",
    type: "in-person",
  },
  {
    id: 206,
    title: "Strategy Session",
    client: "Kappa Industries",
    date: createMeetingDate(-2, 28),
    time: "2:30 PM",
    duration: "1.5 hours",
    type: "video",
  },

  // ===== 1 MONTH AGO =====
  {
    id: 301,
    title: "Sales Pitch",
    client: "Lambda Tech",
    date: createMeetingDate(-1, 2),
    time: "10:00 AM",
    duration: "45 min",
    type: "video",
  },
  {
    id: 302,
    title: "Client Onboarding",
    client: "Mu Systems",
    date: createMeetingDate(-1, 7),
    time: "11:30 AM",
    duration: "1.5 hours",
    type: "in-person",
  },
  {
    id: 303,
    title: "Feature Request Call",
    client: "Nu Solutions",
    date: createMeetingDate(-1, 9),
    time: "3:00 PM",
    duration: "30 min",
    type: "phone",
  },
  {
    id: 304,
    title: "Progress Review",
    client: "Xi Partners",
    date: createMeetingDate(-1, 14),
    time: "2:00 PM",
    duration: "1 hour",
    type: "video",
  },
  {
    id: 305,
    title: "Executive Briefing",
    client: "Omicron Ltd",
    date: createMeetingDate(-1, 19),
    time: "9:00 AM",
    duration: "1 hour",
    type: "in-person",
  },
  {
    id: 306,
    title: "Technical Support",
    client: "Pi Technologies",
    date: createMeetingDate(-1, 23),
    time: "4:30 PM",
    duration: "45 min",
    type: "phone",
  },
  {
    id: 307,
    title: "Renewal Discussion",
    client: "Rho Enterprises",
    date: createMeetingDate(-1, 27),
    time: "1:00 PM",
    duration: "30 min",
    type: "video",
  },

  // ===== CURRENT MONTH =====
  {
    id: 1,
    title: "Enterprise Plan Demo",
    client: "TechCorp Solutions",
    date: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
    time: "10:00 AM",
    duration: "45 min",
    type: "video",
  },
  {
    id: 2,
    title: "Follow-up Call",
    client: "FinanceX Group",
    date: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
    time: "2:30 PM",
    duration: "30 min",
    type: "phone",
  },
  {
    id: 3,
    title: "Proposal Discussion",
    client: "RetailHub Inc",
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days
    time: "11:00 AM",
    duration: "1 hour",
    type: "video",
  },
  {
    id: 4,
    title: "Contract Negotiation",
    client: "MediCare Systems",
    date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
    time: "3:00 PM",
    duration: "1.5 hours",
    type: "in-person",
  },
  {
    id: 5,
    title: "Product Walkthrough",
    client: "StartupX",
    date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days
    time: "9:00 AM",
    duration: "30 min",
    type: "video",
  },
  {
    id: 6,
    title: "Discovery Call",
    client: "EduTech Partners",
    date: new Date(Date.now() + 86400000 * 7).toISOString(), // 1 week
    time: "1:00 PM",
    duration: "45 min",
    type: "phone",
  },
  {
    id: 7,
    title: "Quarterly Review",
    client: "Global Logistics Co",
    date: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days
    time: "4:00 PM",
    duration: "1 hour",
    type: "video",
  },
  {
    id: 8,
    title: "Onboarding Session",
    client: "CloudServe Ltd",
    date: new Date(Date.now() + 86400000 * 14).toISOString(), // 2 weeks
    time: "10:30 AM",
    duration: "2 hours",
    type: "in-person",
  },
  {
    id: 9,
    title: "Strategy Alignment",
    client: "Sigma Corp",
    date: createMeetingDate(0, 9),
    time: "11:00 AM",
    duration: "1 hour",
    type: "video",
  },
  {
    id: 10,
    title: "Budget Review",
    client: "Tau Industries",
    date: createMeetingDate(0, 16),
    time: "2:00 PM",
    duration: "45 min",
    type: "phone",
  },
  {
    id: 11,
    title: "Team Sync",
    client: "Upsilon Tech",
    date: createMeetingDate(0, 21),
    time: "10:30 AM",
    duration: "30 min",
    type: "video",
  },

  // ===== 1 MONTH AHEAD =====
  {
    id: 401,
    title: "Annual Review",
    client: "Phi Holdings",
    date: createMeetingDate(1, 4),
    time: "9:00 AM",
    duration: "2 hours",
    type: "in-person",
  },
  {
    id: 402,
    title: "New Client Intro",
    client: "Chi Ventures",
    date: createMeetingDate(1, 4),
    time: "3:00 PM",
    duration: "45 min",
    type: "video",
  },
  {
    id: 403,
    title: "Product Training",
    client: "Psi Solutions",
    date: createMeetingDate(1, 11),
    time: "1:00 PM",
    duration: "1.5 hours",
    type: "video",
  },
  {
    id: 404,
    title: "Support Check-in",
    client: "Omega Systems",
    date: createMeetingDate(1, 15),
    time: "11:00 AM",
    duration: "30 min",
    type: "phone",
  },
  {
    id: 405,
    title: "Expansion Discussion",
    client: "Aurora Inc",
    date: createMeetingDate(1, 18),
    time: "2:30 PM",
    duration: "1 hour",
    type: "in-person",
  },
  {
    id: 406,
    title: "Feedback Session",
    client: "Nova Corp",
    date: createMeetingDate(1, 22),
    time: "4:00 PM",
    duration: "45 min",
    type: "video",
  },
  {
    id: 407,
    title: "Integration Planning",
    client: "Stellar Tech",
    date: createMeetingDate(1, 26),
    time: "10:00 AM",
    duration: "1 hour",
    type: "phone",
  },

  // ===== 2 MONTHS AHEAD =====
  {
    id: 501,
    title: "Kickoff Meeting",
    client: "Lunar Industries",
    date: createMeetingDate(2, 3),
    time: "9:30 AM",
    duration: "1.5 hours",
    type: "in-person",
  },
  {
    id: 502,
    title: "Roadmap Review",
    client: "Solar Systems",
    date: createMeetingDate(2, 7),
    time: "2:00 PM",
    duration: "1 hour",
    type: "video",
  },
  {
    id: 503,
    title: "Partnership Renewal",
    client: "Cosmos Ltd",
    date: createMeetingDate(2, 12),
    time: "11:30 AM",
    duration: "45 min",
    type: "phone",
  },
  {
    id: 504,
    title: "Executive Summit",
    client: "Galaxy Corp",
    date: createMeetingDate(2, 12),
    time: "3:00 PM",
    duration: "2 hours",
    type: "in-person",
  },
  {
    id: 505,
    title: "Compliance Review",
    client: "Nebula Tech",
    date: createMeetingDate(2, 19),
    time: "10:00 AM",
    duration: "1 hour",
    type: "video",
  },
  {
    id: 506,
    title: "Pricing Discussion",
    client: "Quasar Ventures",
    date: createMeetingDate(2, 24),
    time: "1:00 PM",
    duration: "30 min",
    type: "phone",
  },
  {
    id: 507,
    title: "End of Quarter Wrap",
    client: "Pulsar Partners",
    date: createMeetingDate(2, 28),
    time: "4:00 PM",
    duration: "1 hour",
    type: "video",
  },
];

// -----------------------------------------------------------------------------
// Recent Lead Activities Data
// -----------------------------------------------------------------------------

export const initialActivities = [
  {
    id: 1,
    type: "closed",
    title: "Deal Closed",
    description: "Successfully closed enterprise deal",
    leadName: "TechVision Corp",
    timestamp: "10 min ago",
    priority: "high",
    amount: "$85,000 ARR",
  },
  {
    id: 2,
    type: "call",
    title: "Follow-up Call Completed",
    description: "Discussed pricing and implementation timeline",
    leadName: "FinanceX Group",
    timestamp: "45 min ago",
    priority: "high",
  },
  {
    id: 3,
    type: "email",
    title: "Proposal Sent",
    description: "Custom proposal sent for review",
    leadName: "RetailHub Inc",
    timestamp: "1 hour ago",
    priority: "medium",
  },
  {
    id: 4,
    type: "meeting",
    title: "Demo Scheduled",
    description: "Product demo scheduled for next Tuesday",
    leadName: "HealthCore Systems",
    timestamp: "2 hours ago",
    priority: "medium",
  },
  {
    id: 5,
    type: "new",
    title: "New Lead Assigned",
    description: "Inbound lead from website form",
    leadName: "StartupX Technologies",
    timestamp: "3 hours ago",
    priority: "low",
  },
  {
    id: 6,
    type: "status",
    title: "Status Updated",
    description: "Moved to negotiation stage",
    leadName: "MediCare Solutions",
    timestamp: "4 hours ago",
    priority: "high",
  },
  {
    id: 7,
    type: "call",
    title: "Discovery Call",
    description: "Initial needs assessment completed",
    leadName: "EduTech Partners",
    timestamp: "5 hours ago",
    priority: "medium",
  },
  {
    id: 8,
    type: "note",
    title: "Note Added",
    description: "Decision maker wants to discuss integration options",
    leadName: "Global Logistics",
    timestamp: "6 hours ago",
    priority: "medium",
  },
  {
    id: 9,
    type: "proposal",
    title: "Proposal Approved",
    description: "Client approved proposal, moving to contract",
    leadName: "CloudServe Ltd",
    timestamp: "8 hours ago",
    priority: "high",
    amount: "$42,000 ARR",
  },
  {
    id: 10,
    type: "email",
    title: "Follow-up Email Sent",
    description: "Sent additional product information",
    leadName: "InnovateCo",
    timestamp: "12 hours ago",
    priority: "low",
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
// Alert Types
// -----------------------------------------------------------------------------

export const ALERT_TYPES = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  SUCCESS: "success",
};

// -----------------------------------------------------------------------------
// Typography
// -----------------------------------------------------------------------------

export const fontFamily = "'Manrope', sans-serif";
export const fontFamilyHeading = "'Poppins', sans-serif";

// -----------------------------------------------------------------------------
// Time Periods
// -----------------------------------------------------------------------------

export const TIME_PERIOD_OPTIONS = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

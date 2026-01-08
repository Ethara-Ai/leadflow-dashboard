// =============================================================================
// LEADFLOW DASHBOARD - CHART DATA CONSTANTS
// =============================================================================

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
// Conversion Rate Data (formerly Feeding Efficiency)
// -----------------------------------------------------------------------------

export const conversionWeekData = [
  { name: "Mon", efficiency: 28 },
  { name: "Tue", efficiency: 32 },
  { name: "Wed", efficiency: 30 },
  { name: "Thu", efficiency: 35 },
  { name: "Fri", efficiency: 38 },
  { name: "Sat", efficiency: 25 },
  { name: "Sun", efficiency: 22 },
];

export const conversionMonthData = [
  { name: "Week 1", efficiency: 28 },
  { name: "Week 2", efficiency: 31 },
  { name: "Week 3", efficiency: 34 },
  { name: "Week 4", efficiency: 36 },
];

export const conversionYearData = [
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

// Backward compatibility aliases
export const feedingWeekData = conversionWeekData;
export const feedingMonthData = conversionMonthData;
export const feedingYearData = conversionYearData;

// -----------------------------------------------------------------------------
// Lead Source Distribution Data (formerly Diet Distribution)
// -----------------------------------------------------------------------------

export const sourceWeekData = [
  { name: "Website", value: 35 },
  { name: "Referrals", value: 28 },
  { name: "Social Media", value: 22 },
  { name: "Cold Outreach", value: 15 },
];

export const sourceMonthData = [
  { name: "Website", value: 32 },
  { name: "Referrals", value: 30 },
  { name: "Social Media", value: 25 },
  { name: "Cold Outreach", value: 13 },
];

export const sourceYearData = [
  { name: "Website", value: 30 },
  { name: "Referrals", value: 28 },
  { name: "Social Media", value: 27 },
  { name: "Cold Outreach", value: 15 },
];

// Backward compatibility aliases
export const dietWeekData = sourceWeekData;
export const dietMonthData = sourceMonthData;
export const dietYearData = sourceYearData;

// -----------------------------------------------------------------------------
// Chart Colors
// -----------------------------------------------------------------------------

export const CHART_COLORS_DARK = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"];
export const CHART_COLORS_LIGHT = ["#2563eb", "#059669", "#d97706", "#dc2626"];

// Backward compatibility aliases
export const COLORS_DARK = CHART_COLORS_DARK;
export const COLORS_LIGHT = CHART_COLORS_LIGHT;

/**
 * Get chart colors based on theme
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {string[]} Array of color hex values
 */
export const getChartColors = (isDark) =>
  isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;

// Backward compatibility alias
export const getColors = getChartColors;

// -----------------------------------------------------------------------------
// Time Period Configuration
// -----------------------------------------------------------------------------

export const TIME_PERIODS = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

export const TIME_PERIOD_OPTIONS = [
  { value: TIME_PERIODS.WEEK, label: "Week" },
  { value: TIME_PERIODS.MONTH, label: "Month" },
  { value: TIME_PERIODS.YEAR, label: "Year" },
];

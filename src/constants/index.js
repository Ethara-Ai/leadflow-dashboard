// =============================================================================
// LEADFLOW DASHBOARD - CONSTANTS INDEX
// Central export point for all application constants
// =============================================================================

// -----------------------------------------------------------------------------
// Storage Constants
// -----------------------------------------------------------------------------
export { STORAGE_KEYS, STORAGE_EXPIRY } from './storage.js';

// -----------------------------------------------------------------------------
// Animation Constants
// -----------------------------------------------------------------------------
export {
  cardVariants,
  dropdownVariants,
  staggerContainerVariants,
  modalVariants,
  fadeVariants,
  slideUpVariants,
  scaleVariants,
  transitions,
} from './animations.js';

// -----------------------------------------------------------------------------
// Chart Data Constants
// -----------------------------------------------------------------------------
export {
  // Activity Data
  activityWeekData,
  activityMonthData,
  activityYearData,
  // Conversion Data
  conversionWeekData,
  conversionMonthData,
  conversionYearData,
  // Source Distribution Data
  sourceWeekData,
  sourceMonthData,
  sourceYearData,
  // Chart Colors
  CHART_COLORS_DARK,
  CHART_COLORS_LIGHT,
  getChartColors,
  // Time Periods
  TIME_PERIODS,
  TIME_PERIOD_OPTIONS,
} from './chartData.js';

// -----------------------------------------------------------------------------
// Mock Data Constants
// -----------------------------------------------------------------------------
export {
  // Lead Data
  initialLeadData,
  // Notes
  initialNotes,
  // Alerts
  ALERT_TYPES,
  initialAlerts,
  alertMessages,
  // Meetings
  MEETING_TYPES,
  initialMeetings,
  // Activities
  ACTIVITY_TYPES,
  ACTIVITY_PRIORITIES,
  initialActivities,
} from './mockData.js';

// -----------------------------------------------------------------------------
// Typography Constants
// -----------------------------------------------------------------------------
export const fontFamily = "'Manrope', sans-serif";
export const fontFamilyHeading = "'Poppins', sans-serif";

// -----------------------------------------------------------------------------
// Application Configuration Constants
// -----------------------------------------------------------------------------

/** Maximum loading time before force-showing content (ms) */
export const MAX_LOADING_TIME = 4000;

/** Minimum time to show loading screen for smooth UX (ms) */
export const MIN_LOADING_TIME = 1500;

/** Default refresh interval for data polling (ms) */
export const DEFAULT_REFRESH_INTERVAL = 30000;

/** Probability of generating an alert on refresh (0-1) */
export const ALERT_GENERATION_PROBABILITY = 0.3;

/** Maximum number of alerts to keep in state */
export const MAX_ALERTS = 5;

/** Maximum number of notes to keep in state */
export const MAX_NOTES = 100;

/** Maximum character length for notes */
export const MAX_NOTE_LENGTH = 1000;

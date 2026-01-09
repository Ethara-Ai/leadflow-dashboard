// =============================================================================
// LEADFLOW DASHBOARD - CONTEXT INDEX
// Central export point for all context providers
// =============================================================================

// -----------------------------------------------------------------------------
// Main Dashboard Context (Composed)
// -----------------------------------------------------------------------------
export {
  default as DashboardContext,
  DashboardProvider,
  useDashboardContext,
  // Re-exported focused context hooks
  useLeadDataContext,
  useAlertsContext,
  useNotesContext,
  useModalsContext,
  useChartPeriodsContext,
  useUIDataContext,
} from "./DashboardContext.jsx";

// -----------------------------------------------------------------------------
// Legacy Dashboard Hook (Backward Compatibility)
// -----------------------------------------------------------------------------
export { default as useDashboard } from "./useDashboard.js";

// -----------------------------------------------------------------------------
// Focused Contexts - Lead Data
// -----------------------------------------------------------------------------
export {
  default as LeadDataContext,
  LeadDataProvider,
  useLeadDataContext as useLeadData,
} from "./LeadDataContext.jsx";

// -----------------------------------------------------------------------------
// Focused Contexts - Alerts
// -----------------------------------------------------------------------------
export {
  default as AlertsContext,
  AlertsProvider,
  useAlertsContext as useAlerts,
} from "./AlertsContext.jsx";

// -----------------------------------------------------------------------------
// Focused Contexts - Notes
// -----------------------------------------------------------------------------
export {
  default as NotesContext,
  NotesProvider,
  useNotesContext as useNotes,
} from "./NotesContext.jsx";

// -----------------------------------------------------------------------------
// Focused Contexts - Modals
// -----------------------------------------------------------------------------
export {
  default as ModalsContext,
  ModalsProvider,
  useModalsContext as useModals,
} from "./ModalsContext.jsx";

// -----------------------------------------------------------------------------
// Focused Contexts - Chart Periods
// -----------------------------------------------------------------------------
export {
  default as ChartPeriodsContext,
  ChartPeriodsProvider,
  useChartPeriodsContext as useChartPeriods,
} from "./ChartPeriodsContext.jsx";

// -----------------------------------------------------------------------------
// Focused Contexts - UI Data (Meetings, Activities)
// -----------------------------------------------------------------------------
export {
  default as UIDataContext,
  UIDataProvider,
  useUIDataContext as useUIData,
} from "./UIDataContext.jsx";

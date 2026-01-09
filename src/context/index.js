// =============================================================================
// LEADFLOW DASHBOARD - CONTEXT INDEX
// Central export point for all context providers and hooks
// =============================================================================

// -----------------------------------------------------------------------------
// Context Hooks (from separate hook files for Fast Refresh compatibility)
// -----------------------------------------------------------------------------
export {
  useLeadDataContext,
  useAlertsContext,
  useNotesContext,
  useModalsContext,
  useChartPeriodsContext,
  useUIDataContext,
  useDashboardContext,
} from './hooks/index.js';

// -----------------------------------------------------------------------------
// Main Dashboard Context (Composed)
// -----------------------------------------------------------------------------
export { default as DashboardContext, DashboardProvider } from './DashboardContext.jsx';

// -----------------------------------------------------------------------------
// Legacy Dashboard Hook (Backward Compatibility)
// -----------------------------------------------------------------------------
export { default as useDashboard } from './useDashboard.js';

// -----------------------------------------------------------------------------
// Focused Contexts - Lead Data
// -----------------------------------------------------------------------------
export { default as LeadDataContext, LeadDataProvider } from './LeadDataContext.jsx';

// Alias for convenience
export { useLeadDataContext as useLeadData } from './hooks/useLeadDataContext.js';

// -----------------------------------------------------------------------------
// Focused Contexts - Alerts
// -----------------------------------------------------------------------------
export { default as AlertsContext, AlertsProvider } from './AlertsContext.jsx';

// Alias for convenience
export { useAlertsContext as useAlerts } from './hooks/useAlertsContext.js';

// -----------------------------------------------------------------------------
// Focused Contexts - Notes
// -----------------------------------------------------------------------------
export { default as NotesContext, NotesProvider } from './NotesContext.jsx';

// Alias for convenience
export { useNotesContext as useNotes } from './hooks/useNotesContext.js';

// -----------------------------------------------------------------------------
// Focused Contexts - Modals
// -----------------------------------------------------------------------------
export { default as ModalsContext, ModalsProvider } from './ModalsContext.jsx';

// Alias for convenience
export { useModalsContext as useModals } from './hooks/useModalsContext.js';

// -----------------------------------------------------------------------------
// Focused Contexts - Chart Periods
// -----------------------------------------------------------------------------
export { default as ChartPeriodsContext, ChartPeriodsProvider } from './ChartPeriodsContext.jsx';

// Alias for convenience
export { useChartPeriodsContext as useChartPeriods } from './hooks/useChartPeriodsContext.js';

// -----------------------------------------------------------------------------
// Focused Contexts - UI Data (Meetings, Activities)
// -----------------------------------------------------------------------------
export { default as UIDataContext, UIDataProvider } from './UIDataContext.jsx';

// Alias for convenience
export { useUIDataContext as useUIData } from './hooks/useUIDataContext.js';

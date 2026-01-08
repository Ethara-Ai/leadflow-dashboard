// =============================================================================
// LEADFLOW DASHBOARD - HOOKS INDEX
// Central export point for all custom hooks
// =============================================================================

// -----------------------------------------------------------------------------
// Theme Context and Provider
// -----------------------------------------------------------------------------
export { ThemeContext } from "./ThemeContext.js";
export { default as ThemeProvider } from "./ThemeProvider.jsx";

// -----------------------------------------------------------------------------
// Theme Hooks
// -----------------------------------------------------------------------------
export { default as useTheme } from "./useTheme.jsx";
export { default as useThemeSafe } from "./useThemeSafe.js";
export { default as useGlobalStyles } from "./useGlobalStyles.js";
export { default as withTheme } from "./withTheme.jsx";

// -----------------------------------------------------------------------------
// Data Hooks
// -----------------------------------------------------------------------------
export { default as useLeadData } from "./useLeadData.js";
export { default as useAlerts } from "./useAlerts.js";
export { default as useNotes } from "./useNotes.js";

// -----------------------------------------------------------------------------
// UI Hooks
// -----------------------------------------------------------------------------
export { default as useModals, MODAL_IDS } from "./useModals.js";
export { default as useChartPeriods, TIME_PERIODS, CHART_IDS } from "./useChartPeriods.js";

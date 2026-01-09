// =============================================================================
// LEADFLOW DASHBOARD - HOOKS INDEX
// Central export point for all custom hooks
// =============================================================================

// -----------------------------------------------------------------------------
// Theme Context and Provider
// -----------------------------------------------------------------------------
export { ThemeContext } from './ThemeContext.js';
export { default as ThemeProvider } from './ThemeProvider.jsx';

// -----------------------------------------------------------------------------
// Theme Hooks (Consolidated)
// -----------------------------------------------------------------------------
export { default as useTheme, useThemeStrict, useThemeSafe } from './useTheme.jsx';

// Backward compatibility - re-export useThemeSafe as default from its original location
export { default as useThemeSafeCompat } from './useThemeSafe.js';

// -----------------------------------------------------------------------------
// Theme Utilities
// -----------------------------------------------------------------------------
export { default as useGlobalStyles } from './useGlobalStyles.js';
export { default as useChartStyles } from './useChartStyles.js';
export { default as useThemeClasses } from './useThemeClasses.js';
export { default as withTheme } from './withTheme.jsx';

// -----------------------------------------------------------------------------
// Data Hooks
// -----------------------------------------------------------------------------
export { default as useLeadData } from './useLeadData.js';
export { default as useAlerts } from './useAlerts.js';
export { default as useNotes } from './useNotes.js';

// -----------------------------------------------------------------------------
// UI Hooks
// -----------------------------------------------------------------------------
export { default as useModals, MODAL_IDS } from './useModals.js';
export { default as useChartPeriods, TIME_PERIODS, CHART_IDS } from './useChartPeriods.js';
export { default as useScrollLock } from './useScrollLock.js';

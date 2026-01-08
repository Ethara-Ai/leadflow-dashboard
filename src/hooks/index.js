/**
 * Hooks Index
 * Central export point for all custom hooks
 */

// Theme Context and Provider
export { ThemeContext } from "./ThemeContext";
export { default as ThemeProvider } from "./ThemeProvider";

// Theme Hooks
export { default as useTheme } from "./useTheme";
export { default as useThemeSafe } from "./useThemeSafe";
export { default as useGlobalStyles } from "./useGlobalStyles";
export { default as withTheme } from "./withTheme";

// Data Hooks
export { default as useLeadData } from "./useLeadData";
/** @deprecated Use useLeadData instead */
export { default as useZooData } from "./useZooData";
export { default as useAlerts } from "./useAlerts";
export { default as useNotes } from "./useNotes";

// UI Hooks
export { default as useModals, MODAL_IDS } from "./useModals";
export {
  default as useChartPeriods,
  TIME_PERIODS,
  CHART_IDS,
} from "./useChartPeriods";

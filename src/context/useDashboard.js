// =============================================================================
// LEADFLOW DASHBOARD - USE DASHBOARD HOOK
// Custom hook for accessing dashboard context with backward compatibility
// =============================================================================

import { useContext } from 'react';
import DashboardContext from './DashboardContext.jsx';
import {
  useLeadDataContext,
  useAlertsContext,
  useNotesContext,
  useModalsContext,
  useChartPeriodsContext,
  useUIDataContext,
} from './hooks/index.js';

/**
 * Custom hook to access the unified dashboard context
 *
 * This hook provides access to all dashboard state through a single interface.
 * It maintains backward compatibility with the original monolithic context while
 * supporting the new focused context architecture.
 *
 * @returns {Object} Dashboard context value containing all state and actions
 * @throws {Error} If used outside of DashboardProvider
 *
 * @example
 * // Basic usage - access all dashboard state
 * const { leadData, alerts, isLoading } = useDashboard();
 *
 * @example
 * // Access specific functionality
 * const { refreshData, addAlert, openNotes } = useDashboard();
 *
 * @example
 * // Access focused contexts directly (advanced usage)
 * const { contexts } = useDashboard();
 * const { leadData } = contexts.leadData;
 */
const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error(
      'useDashboard must be used within a DashboardProvider. ' +
        'Make sure your component is wrapped with <DashboardProvider>.'
    );
  }

  return context;
};

/**
 * Hook to access only lead data state
 * Use this when you only need lead data to optimize re-renders
 *
 * @returns {Object} Lead data context value
 * @throws {Error} If used outside of LeadDataProvider
 */
export const useLeadData = () => {
  return useLeadDataContext();
};

/**
 * Hook to access only alerts state
 * Use this when you only need alerts to optimize re-renders
 *
 * @returns {Object} Alerts context value
 * @throws {Error} If used outside of AlertsProvider
 */
export const useAlerts = () => {
  return useAlertsContext();
};

/**
 * Hook to access only notes state
 * Use this when you only need notes to optimize re-renders
 *
 * @returns {Object} Notes context value
 * @throws {Error} If used outside of NotesProvider
 */
export const useNotes = () => {
  return useNotesContext();
};

/**
 * Hook to access only modals state
 * Use this when you only need modals to optimize re-renders
 *
 * @returns {Object} Modals context value
 * @throws {Error} If used outside of ModalsProvider
 */
export const useModals = () => {
  return useModalsContext();
};

/**
 * Hook to access only chart periods state
 * Use this when you only need chart periods to optimize re-renders
 *
 * @returns {Object} Chart periods context value
 * @throws {Error} If used outside of ChartPeriodsProvider
 */
export const useChartPeriods = () => {
  return useChartPeriodsContext();
};

/**
 * Hook to access only UI data state (meetings, activities)
 * Use this when you only need UI data to optimize re-renders
 *
 * @returns {Object} UI data context value
 * @throws {Error} If used outside of UIDataProvider
 */
export const useUIData = () => {
  return useUIDataContext();
};

export default useDashboard;

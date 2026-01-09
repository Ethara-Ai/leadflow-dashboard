// =============================================================================
// LEADFLOW DASHBOARD - DASHBOARD CONTEXT
// Composed context that integrates all focused contexts
// =============================================================================

import { createContext, useContext, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

// Import focused context providers and hooks
import { LeadDataProvider, useLeadDataContext } from "./LeadDataContext.jsx";
import { AlertsProvider, useAlertsContext } from "./AlertsContext.jsx";
import { NotesProvider, useNotesContext } from "./NotesContext.jsx";
import { ModalsProvider, useModalsContext } from "./ModalsContext.jsx";
import {
  ChartPeriodsProvider,
  useChartPeriodsContext,
} from "./ChartPeriodsContext.jsx";
import { UIDataProvider, useUIDataContext } from "./UIDataContext.jsx";

// Import utilities
import { exportToCSV, exportToJSON, generateExportFilename } from "../utils.js";

/**
 * Dashboard Context
 * Provides a unified interface to all dashboard state
 */
const DashboardContext = createContext(undefined);

/**
 * Custom hook to access the unified dashboard context
 * This provides backward compatibility and a convenient way to access all state
 *
 * @returns {Object} Unified dashboard context value
 * @throws {Error} If used outside of DashboardProvider
 */
export const useDashboardContext = () => {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider",
    );
  }

  return context;
};

/**
 * Inner Dashboard Provider Component
 * This component has access to all focused contexts and provides export functionality
 */
const DashboardInnerProvider = ({ children }) => {
  // Access all focused contexts
  const leadDataCtx = useLeadDataContext();
  const alertsCtx = useAlertsContext();
  const notesCtx = useNotesContext();
  const modalsCtx = useModalsContext();
  const chartPeriodsCtx = useChartPeriodsContext();
  const uiDataCtx = useUIDataContext();

  // =========================================================================
  // Export Handlers
  // =========================================================================
  const handleExportCSV = useCallback(() => {
    const data = {
      leadData: leadDataCtx.leadData,
      activityData: chartPeriodsCtx.activityData,
      conversionData: chartPeriodsCtx.conversionData,
      sourceData: chartPeriodsCtx.sourceData,
      alerts: alertsCtx.alerts,
    };
    exportToCSV(data, generateExportFilename("csv"));
  }, [
    leadDataCtx.leadData,
    chartPeriodsCtx.activityData,
    chartPeriodsCtx.conversionData,
    chartPeriodsCtx.sourceData,
    alertsCtx.alerts,
  ]);

  const handleExportJSON = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      leadMetrics: {
        totalLeads: leadDataCtx.leadData.totalLeads,
        callsMade: leadDataCtx.leadData.callsMade,
        meetingsScheduled: leadDataCtx.leadData.meetingsScheduled,
        lastUpdated: leadDataCtx.leadData.lastUpdated,
      },
      activityData: chartPeriodsCtx.activityData,
      conversionRate: chartPeriodsCtx.conversionData,
      leadSources: chartPeriodsCtx.sourceData,
      alerts: alertsCtx.alerts.filter((alert) => !alert.dismissed),
      notes: notesCtx.notes,
    };
    exportToJSON(data, generateExportFilename("json"));
  }, [
    leadDataCtx.leadData,
    chartPeriodsCtx.activityData,
    chartPeriodsCtx.conversionData,
    chartPeriodsCtx.sourceData,
    alertsCtx.alerts,
    notesCtx.notes,
  ]);

  // =========================================================================
  // Unified Context Value
  // Provides backward compatibility with the original monolithic context
  // =========================================================================
  const value = useMemo(
    () => ({
      // =====================================================================
      // Lead Data (from LeadDataContext)
      // =====================================================================
      leadData: leadDataCtx.leadData,
      isLoading: leadDataCtx.isLoading,
      error: leadDataCtx.error,
      lastRefreshed: leadDataCtx.lastRefreshed,
      refreshData: leadDataCtx.refreshData,
      resetLeadData: leadDataCtx.resetData,
      clearError: leadDataCtx.clearError,

      // =====================================================================
      // Alerts (from AlertsContext)
      // =====================================================================
      alerts: alertsCtx.alerts,
      activeAlerts: alertsCtx.activeAlerts,
      activeAlertCount: alertsCtx.activeAlertCount,
      hasWarnings: alertsCtx.hasWarnings,
      hasErrors: alertsCtx.hasErrors,
      addAlert: alertsCtx.addAlert,
      removeAlert: alertsCtx.removeAlert,
      dismissAlert: alertsCtx.dismissAlert,
      clearAlerts: alertsCtx.clearAlerts,
      resetAlerts: alertsCtx.resetAlerts,
      getAlertsByType: alertsCtx.getAlertsByType,

      // =====================================================================
      // Notes (from NotesContext)
      // =====================================================================
      notes: notesCtx.notes,
      noteCount: notesCtx.noteCount,
      isNotesAtLimit: notesCtx.isAtLimit,
      notesRemainingCapacity: notesCtx.remainingCapacity,
      addNote: notesCtx.addNote,
      deleteNote: notesCtx.deleteNote,
      updateNote: notesCtx.updateNote,
      clearNotes: notesCtx.clearNotes,
      getNoteById: notesCtx.getNoteById,
      searchNotes: notesCtx.searchNotes,

      // =====================================================================
      // Modals (from ModalsContext)
      // =====================================================================
      isNotesOpen: modalsCtx.isNotesOpen,
      isProductModalOpen: modalsCtx.isProductModalOpen,
      isResourcesModalOpen: modalsCtx.isResourcesModalOpen,
      isCompanyModalOpen: modalsCtx.isCompanyModalOpen,
      isAlertsModalOpen: modalsCtx.isAlertsModalOpen,
      isAnyModalOpen: modalsCtx.isAnyModalOpen,
      openNotes: modalsCtx.openNotes,
      closeNotes: modalsCtx.closeNotes,
      openProductModal: modalsCtx.openProductModal,
      closeProductModal: modalsCtx.closeProductModal,
      openResourcesModal: modalsCtx.openResourcesModal,
      closeResourcesModal: modalsCtx.closeResourcesModal,
      openCompanyModal: modalsCtx.openCompanyModal,
      closeCompanyModal: modalsCtx.closeCompanyModal,
      openAlertsModal: modalsCtx.openAlertsModal,
      closeAlertsModal: modalsCtx.closeAlertsModal,
      closeAllModals: modalsCtx.closeAllModals,

      // =====================================================================
      // Chart Periods (from ChartPeriodsContext)
      // =====================================================================
      activityPeriod: chartPeriodsCtx.activityPeriod,
      conversionPeriod: chartPeriodsCtx.conversionPeriod,
      sourcePeriod: chartPeriodsCtx.sourcePeriod,
      setActivityPeriod: chartPeriodsCtx.setActivityPeriod,
      setConversionPeriod: chartPeriodsCtx.setConversionPeriod,
      setSourcePeriod: chartPeriodsCtx.setSourcePeriod,
      setAllPeriods: chartPeriodsCtx.setAllPeriods,
      resetPeriods: chartPeriodsCtx.resetPeriods,
      activityData: chartPeriodsCtx.activityData,
      conversionData: chartPeriodsCtx.conversionData,
      sourceData: chartPeriodsCtx.sourceData,
      arePeriodsSync: chartPeriodsCtx.arePeriodsSync,

      // =====================================================================
      // UI Data (from UIDataContext)
      // =====================================================================
      meetings: uiDataCtx.meetings,
      upcomingMeetings: uiDataCtx.upcomingMeetings,
      pastMeetings: uiDataCtx.pastMeetings,
      activities: uiDataCtx.activities,
      uiActivityData: uiDataCtx.activityData,
      addMeeting: uiDataCtx.addMeeting,
      removeMeeting: uiDataCtx.removeMeeting,
      updateMeeting: uiDataCtx.updateMeeting,
      addActivity: uiDataCtx.addActivity,
      removeActivity: uiDataCtx.removeActivity,
      getRecentActivities: uiDataCtx.getRecentActivities,
      getActivitiesByType: uiDataCtx.getActivitiesByType,
      getActivitiesByPriority: uiDataCtx.getActivitiesByPriority,

      // =====================================================================
      // Export Functions
      // =====================================================================
      handleExportCSV,
      handleExportJSON,

      // =====================================================================
      // Direct Context Access (for advanced usage)
      // =====================================================================
      contexts: {
        leadData: leadDataCtx,
        alerts: alertsCtx,
        notes: notesCtx,
        modals: modalsCtx,
        chartPeriods: chartPeriodsCtx,
        uiData: uiDataCtx,
      },
    }),
    [
      // Lead Data
      leadDataCtx,
      // Alerts
      alertsCtx,
      // Notes
      notesCtx,
      // Modals
      modalsCtx,
      // Chart Periods
      chartPeriodsCtx,
      // UI Data
      uiDataCtx,
      // Export
      handleExportCSV,
      handleExportJSON,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

DashboardInnerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Dashboard Provider Component
 * Composes all focused context providers into a single provider
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const DashboardProvider = ({ children }) => {
  // Create a callback to handle new alerts from lead data refresh
  // This is wrapped in a component to access the AlertsContext
  return (
    <AlertsProvider>
      <NotesProvider>
        <ModalsProvider>
          <ChartPeriodsProvider>
            <UIDataProvider>
              <LeadDataProviderWithAlerts>
                <DashboardInnerProvider>{children}</DashboardInnerProvider>
              </LeadDataProviderWithAlerts>
            </UIDataProvider>
          </ChartPeriodsProvider>
        </ModalsProvider>
      </NotesProvider>
    </AlertsProvider>
  );
};

/**
 * Wrapper component that connects LeadDataProvider to AlertsContext
 * This allows lead data refresh to trigger alerts
 */
const LeadDataProviderWithAlerts = ({ children }) => {
  const { addAlert } = useAlertsContext();

  return <LeadDataProvider onNewAlert={addAlert}>{children}</LeadDataProvider>;
};

LeadDataProviderWithAlerts.propTypes = {
  children: PropTypes.node.isRequired,
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// =============================================================================
// Re-export focused context hooks for direct access
// =============================================================================
export {
  useLeadDataContext,
  useAlertsContext,
  useNotesContext,
  useModalsContext,
  useChartPeriodsContext,
  useUIDataContext,
};

export default DashboardContext;

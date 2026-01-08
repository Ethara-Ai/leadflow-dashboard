// =============================================================================
// LEADFLOW DASHBOARD - DASHBOARD CONTEXT
// Centralized state management for the dashboard
// =============================================================================

import { createContext, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

// Import hooks
import useLeadData from "../hooks/useLeadData.js";
import useAlerts from "../hooks/useAlerts.js";
import useNotes from "../hooks/useNotes.js";
import useModals from "../hooks/useModals.js";
import useChartPeriods from "../hooks/useChartPeriods.js";

// Import utilities
import { exportToCSV, exportToJSON, generateExportFilename } from "../utils.js";

/**
 * Dashboard Context
 */
const DashboardContext = createContext(undefined);

/**
 * Dashboard Provider Component
 * Provides centralized state management for the dashboard
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const DashboardProvider = ({ children }) => {
  // =========================================================================
  // Alerts State
  // =========================================================================
  const {
    alerts,
    activeAlerts,
    activeAlertCount,
    hasWarnings,
    hasErrors,
    addAlert,
    removeAlert,
    dismissAlert,
    clearAlerts,
    resetAlerts,
    getAlertsByType,
  } = useAlerts();

  // =========================================================================
  // Notes State
  // =========================================================================
  const {
    notes,
    noteCount,
    isAtLimit: isNotesAtLimit,
    remainingCapacity: notesRemainingCapacity,
    addNote,
    deleteNote,
    updateNote,
    clearNotes,
    getNoteById,
    searchNotes,
  } = useNotes();

  // =========================================================================
  // Modals State
  // =========================================================================
  const {
    isNotesOpen,
    isProductModalOpen,
    isResourcesModalOpen,
    isCompanyModalOpen,
    isAlertsModalOpen,
    isAnyModalOpen,
    openNotes,
    closeNotes,
    openProductModal,
    closeProductModal,
    openResourcesModal,
    closeResourcesModal,
    openCompanyModal,
    closeCompanyModal,
    openAlertsModal,
    closeAlertsModal,
    closeAllModals,
  } = useModals();

  // =========================================================================
  // Lead Data State
  // =========================================================================
  const handleNewAlert = useCallback(
    (alert) => {
      addAlert(alert);
    },
    [addAlert],
  );

  const {
    leadData,
    isLoading,
    error,
    lastRefreshed,
    refreshData,
    resetData: resetLeadData,
    clearError,
  } = useLeadData({
    onNewAlert: handleNewAlert,
  });

  // =========================================================================
  // Chart Periods State
  // =========================================================================
  const {
    activityPeriod,
    conversionPeriod,
    sourcePeriod,
    setActivityPeriod,
    setConversionPeriod,
    setSourcePeriod,
    setAllPeriods,
    resetPeriods,
    activityData,
    conversionData,
    sourceData,
    arePeriodsSync,
  } = useChartPeriods();

  // =========================================================================
  // Export Handlers
  // =========================================================================
  const handleExportCSV = useCallback(() => {
    const data = {
      leadData,
      activityData,
      conversionData,
      sourceData,
      alerts,
    };
    exportToCSV(data, generateExportFilename("csv"));
  }, [leadData, activityData, conversionData, sourceData, alerts]);

  const handleExportJSON = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      leadMetrics: {
        totalLeads: leadData.totalLeads,
        callsMade: leadData.callsMade,
        meetingsScheduled: leadData.meetingsScheduled,
        lastUpdated: leadData.lastUpdated,
      },
      activityData,
      conversionRate: conversionData,
      leadSources: sourceData,
      alerts: alerts.filter((alert) => !alert.dismissed),
      notes,
    };
    exportToJSON(data, generateExportFilename("json"));
  }, [leadData, activityData, conversionData, sourceData, alerts, notes]);

  // =========================================================================
  // Context Value
  // =========================================================================
  const value = useMemo(
    () => ({
      // Lead Data
      leadData,
      isLoading,
      error,
      lastRefreshed,
      refreshData,
      resetLeadData,
      clearError,

      // Alerts
      alerts,
      activeAlerts,
      activeAlertCount,
      hasWarnings,
      hasErrors,
      addAlert,
      removeAlert,
      dismissAlert,
      clearAlerts,
      resetAlerts,
      getAlertsByType,

      // Notes
      notes,
      noteCount,
      isNotesAtLimit,
      notesRemainingCapacity,
      addNote,
      deleteNote,
      updateNote,
      clearNotes,
      getNoteById,
      searchNotes,

      // Modals
      isNotesOpen,
      isProductModalOpen,
      isResourcesModalOpen,
      isCompanyModalOpen,
      isAlertsModalOpen,
      isAnyModalOpen,
      openNotes,
      closeNotes,
      openProductModal,
      closeProductModal,
      openResourcesModal,
      closeResourcesModal,
      openCompanyModal,
      closeCompanyModal,
      openAlertsModal,
      closeAlertsModal,
      closeAllModals,

      // Chart Periods
      activityPeriod,
      conversionPeriod,
      sourcePeriod,
      setActivityPeriod,
      setConversionPeriod,
      setSourcePeriod,
      setAllPeriods,
      resetPeriods,
      activityData,
      conversionData,
      sourceData,
      arePeriodsSync,

      // Export
      handleExportCSV,
      handleExportJSON,
    }),
    [
      // Lead Data
      leadData,
      isLoading,
      error,
      lastRefreshed,
      refreshData,
      resetLeadData,
      clearError,

      // Alerts
      alerts,
      activeAlerts,
      activeAlertCount,
      hasWarnings,
      hasErrors,
      addAlert,
      removeAlert,
      dismissAlert,
      clearAlerts,
      resetAlerts,
      getAlertsByType,

      // Notes
      notes,
      noteCount,
      isNotesAtLimit,
      notesRemainingCapacity,
      addNote,
      deleteNote,
      updateNote,
      clearNotes,
      getNoteById,
      searchNotes,

      // Modals
      isNotesOpen,
      isProductModalOpen,
      isResourcesModalOpen,
      isCompanyModalOpen,
      isAlertsModalOpen,
      isAnyModalOpen,
      openNotes,
      closeNotes,
      openProductModal,
      closeProductModal,
      openResourcesModal,
      closeResourcesModal,
      openCompanyModal,
      closeCompanyModal,
      openAlertsModal,
      closeAlertsModal,
      closeAllModals,

      // Chart Periods
      activityPeriod,
      conversionPeriod,
      sourcePeriod,
      setActivityPeriod,
      setConversionPeriod,
      setSourcePeriod,
      setAllPeriods,
      resetPeriods,
      activityData,
      conversionData,
      sourceData,
      arePeriodsSync,

      // Export
      handleExportCSV,
      handleExportJSON,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardContext;

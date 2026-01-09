// =============================================================================
// LEADFLOW DASHBOARD - LEAD DATA CONTEXT
// Focused context for lead data state management
// =============================================================================

import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import useLeadData from "../hooks/useLeadData.js";

/**
 * Lead Data Context
 */
const LeadDataContext = createContext(undefined);

/**
 * Custom hook to access lead data context
 * @returns {Object} Lead data context value
 * @throws {Error} If used outside of LeadDataProvider
 */
export const useLeadDataContext = () => {
  const context = useContext(LeadDataContext);

  if (context === undefined) {
    throw new Error("useLeadDataContext must be used within a LeadDataProvider");
  }

  return context;
};

/**
 * Lead Data Provider Component
 * Provides focused state management for lead data
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Function} [props.onNewAlert] - Callback when a new alert should be added
 * @param {boolean} [props.autoRefresh] - Enable automatic data refresh
 * @param {number} [props.refreshInterval] - Interval for auto-refresh in ms
 */
export const LeadDataProvider = ({
  children,
  onNewAlert,
  autoRefresh = false,
  refreshInterval,
}) => {
  const {
    leadData,
    isLoading,
    error,
    lastRefreshed,
    refreshData,
    resetData,
    clearError,
    setData,
  } = useLeadData({
    onNewAlert,
    autoRefresh,
    refreshInterval,
  });

  const value = useMemo(
    () => ({
      // Lead Data State
      leadData,
      isLoading,
      error,
      lastRefreshed,

      // Lead Data Actions
      refreshData,
      resetData,
      clearError,
      setData,
    }),
    [
      leadData,
      isLoading,
      error,
      lastRefreshed,
      refreshData,
      resetData,
      clearError,
      setData,
    ]
  );

  return (
    <LeadDataContext.Provider value={value}>
      {children}
    </LeadDataContext.Provider>
  );
};

LeadDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onNewAlert: PropTypes.func,
  autoRefresh: PropTypes.bool,
  refreshInterval: PropTypes.number,
};

export default LeadDataContext;

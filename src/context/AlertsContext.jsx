// =============================================================================
// LEADFLOW DASHBOARD - ALERTS CONTEXT
// Focused context for alerts state management
// =============================================================================

import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import useAlerts from "../hooks/useAlerts.js";

/**
 * Alerts Context
 */
const AlertsContext = createContext(undefined);

/**
 * Custom hook to access alerts context
 * @returns {Object} Alerts context value
 * @throws {Error} If used outside of AlertsProvider
 */
export const useAlertsContext = () => {
  const context = useContext(AlertsContext);

  if (context === undefined) {
    throw new Error("useAlertsContext must be used within an AlertsProvider");
  }

  return context;
};

/**
 * Alerts Provider Component
 * Provides focused state management for alerts
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array} [props.initialState] - Initial alerts array
 * @param {number} [props.maxAlerts] - Maximum number of alerts to keep
 */
export const AlertsProvider = ({
  children,
  initialState,
  maxAlerts,
}) => {
  const {
    alerts,
    activeAlerts,
    activeAlertCount,
    alertCount,
    hasWarnings,
    hasErrors,
    addAlert,
    removeAlert,
    dismissAlert,
    clearAlerts,
    resetAlerts,
    getAlertsByType,
  } = useAlerts({
    initialState,
    maxAlerts,
  });

  const value = useMemo(
    () => ({
      // Alerts State
      alerts,
      activeAlerts,
      activeAlertCount,
      alertCount,

      // Type Checks
      hasWarnings,
      hasErrors,

      // Alerts Actions
      addAlert,
      removeAlert,
      dismissAlert,
      clearAlerts,
      resetAlerts,
      getAlertsByType,
    }),
    [
      alerts,
      activeAlerts,
      activeAlertCount,
      alertCount,
      hasWarnings,
      hasErrors,
      addAlert,
      removeAlert,
      dismissAlert,
      clearAlerts,
      resetAlerts,
      getAlertsByType,
    ]
  );

  return (
    <AlertsContext.Provider value={value}>
      {children}
    </AlertsContext.Provider>
  );
};

AlertsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialState: PropTypes.array,
  maxAlerts: PropTypes.number,
};

export default AlertsContext;

import { useState, useCallback } from "react";
import { initialAlerts } from "../constants";

/**
 * Custom hook for managing alerts state
 *
 * @param {Object} options - Hook options
 * @param {Array} [options.initialState] - Initial alerts array (defaults to initialAlerts from constants)
 * @param {number} [options.maxAlerts=5] - Maximum number of alerts to keep
 * @returns {Object} Alerts state and handlers
 */
const useAlerts = ({ initialState = initialAlerts, maxAlerts = 5 } = {}) => {
  const [alerts, setAlerts] = useState(initialState);

  /**
   * Add a new alert to the list
   * @param {string|Object} alertOrMessage - Alert message string or full alert object
   */
  const addAlert = useCallback(
    (alertOrMessage) => {
      let newAlert;

      if (typeof alertOrMessage === "string") {
        // Determine alert type based on message content
        const message = alertOrMessage;
        let alertType = "info";

        if (message.toLowerCase().includes("warning")) {
          alertType = "warning";
        } else if (message.toLowerCase().includes("error")) {
          alertType = "error";
        }

        newAlert = {
          id: Date.now(),
          message,
          type: alertType,
          time: "Just now",
        };
      } else {
        // Use provided alert object, ensuring it has an id
        newAlert = {
          id: Date.now(),
          time: "Just now",
          ...alertOrMessage,
        };
      }

      setAlerts((prev) => [newAlert, ...prev].slice(0, maxAlerts));
    },
    [maxAlerts]
  );

  /**
   * Remove a specific alert by ID
   * @param {number|string} alertId - ID of the alert to remove
   */
  const removeAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  }, []);

  /**
   * Dismiss a specific alert (marks as dismissed but keeps in list)
   * @param {number|string} alertId - ID of the alert to dismiss
   */
  const dismissAlert = useCallback((alertId) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, dismissed: true } : alert))
    );
  }, []);

  /**
   * Clear all alerts
   */
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  /**
   * Reset alerts to initial state
   */
  const resetAlerts = useCallback(() => {
    setAlerts(initialState);
  }, [initialState]);

  /**
   * Get count of active (non-dismissed) alerts
   */
  const activeAlertCount = alerts.filter((alert) => !alert.dismissed).length;

  /**
   * Get only active (non-dismissed) alerts
   */
  const activeAlerts = alerts.filter((alert) => !alert.dismissed);

  return {
    alerts,
    activeAlerts,
    activeAlertCount,
    alertCount: alerts.length,
    addAlert,
    removeAlert,
    dismissAlert,
    clearAlerts,
    resetAlerts,
  };
};

export default useAlerts;

// =============================================================================
// LEADFLOW DASHBOARD - USE ALERTS HOOK
// Custom hook for managing alerts state
// =============================================================================

import { useState, useCallback } from "react";
import { initialAlerts, MAX_ALERTS, ALERT_TYPES } from "../constants/index.js";

/**
 * Custom hook for managing alerts state
 *
 * @param {Object} options - Hook options
 * @param {Array} [options.initialState] - Initial alerts array (defaults to initialAlerts from constants)
 * @param {number} [options.maxAlerts] - Maximum number of alerts to keep (defaults to MAX_ALERTS)
 * @returns {Object} Alerts state and handlers
 */
const useAlerts = ({ initialState = initialAlerts, maxAlerts = MAX_ALERTS } = {}) => {
  const [alerts, setAlerts] = useState(initialState);

  /**
   * Determine alert type based on message content
   * @param {string} message - Alert message
   * @returns {string} Alert type
   */
  const getAlertTypeFromMessage = useCallback((message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("warning") || lowerMessage.includes("pending") || lowerMessage.includes("requires")) {
      return ALERT_TYPES.WARNING;
    }
    if (lowerMessage.includes("error") || lowerMessage.includes("failed")) {
      return ALERT_TYPES.ERROR;
    }
    if (lowerMessage.includes("success") || lowerMessage.includes("completed") || lowerMessage.includes("achieved")) {
      return ALERT_TYPES.SUCCESS;
    }
    return ALERT_TYPES.INFO;
  }, []);

  /**
   * Add a new alert to the list
   * @param {string|Object} alertOrMessage - Alert message string or full alert object
   */
  const addAlert = useCallback(
    (alertOrMessage) => {
      let newAlert;

      if (typeof alertOrMessage === "string") {
        const message = alertOrMessage;
        newAlert = {
          id: Date.now(),
          message,
          type: getAlertTypeFromMessage(message),
          time: "Just now",
          timestamp: new Date().toISOString(),
        };
      } else {
        // Use provided alert object, ensuring it has an id
        newAlert = {
          id: Date.now(),
          time: "Just now",
          timestamp: new Date().toISOString(),
          ...alertOrMessage,
        };
      }

      setAlerts((prev) => [newAlert, ...prev].slice(0, maxAlerts));
    },
    [maxAlerts, getAlertTypeFromMessage],
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
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, dismissed: true } : alert)));
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

  /**
   * Get alerts by type
   * @param {string} type - Alert type to filter by
   * @returns {Array} Alerts of the specified type
   */
  const getAlertsByType = useCallback(
    (type) => {
      return alerts.filter((alert) => alert.type === type && !alert.dismissed);
    },
    [alerts],
  );

  /**
   * Check if there are any warning alerts
   */
  const hasWarnings = alerts.some((alert) => alert.type === ALERT_TYPES.WARNING && !alert.dismissed);

  /**
   * Check if there are any error alerts
   */
  const hasErrors = alerts.some((alert) => alert.type === ALERT_TYPES.ERROR && !alert.dismissed);

  return {
    // State
    alerts,
    activeAlerts,
    activeAlertCount,
    alertCount: alerts.length,

    // Type checks
    hasWarnings,
    hasErrors,

    // Actions
    addAlert,
    removeAlert,
    dismissAlert,
    clearAlerts,
    resetAlerts,
    getAlertsByType,

    // Utilities
    getAlertTypeFromMessage,
  };
};

export default useAlerts;

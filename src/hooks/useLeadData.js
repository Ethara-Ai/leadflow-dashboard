// =============================================================================
// LEADFLOW DASHBOARD - USE LEAD DATA HOOK
// Custom hook for managing lead data state and API interactions
// =============================================================================

import { useState, useCallback, useRef, useEffect } from "react";
import { refreshLeadData as apiRefreshLeadData } from "../api/leads.js";
import { initialLeadData, DEFAULT_REFRESH_INTERVAL } from "../constants/index.js";

/**
 * Custom hook for managing lead data state and refresh functionality
 *
 * @param {Object} options - Hook options
 * @param {Function} [options.onNewAlert] - Callback when a new alert should be added
 * @param {boolean} [options.autoRefresh=false] - Enable automatic data refresh
 * @param {number} [options.refreshInterval] - Interval for auto-refresh in ms
 * @returns {Object} Lead data state and handlers
 */
const useLeadData = ({ onNewAlert, autoRefresh = false, refreshInterval = DEFAULT_REFRESH_INTERVAL } = {}) => {
  const [leadData, setLeadData] = useState(initialLeadData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Ref to track if component is mounted (prevents state updates after unmount)
  const isMountedRef = useRef(true);
  // Ref to store the latest leadData for use in callbacks
  const leadDataRef = useRef(leadData);

  // Keep ref in sync with state
  useEffect(() => {
    leadDataRef.current = leadData;
  }, [leadData]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Refresh lead data with new values from API
   * @returns {Promise<Object>} The new lead data
   */
  const refreshData = useCallback(async () => {
    // Prevent concurrent refreshes
    if (isLoading) {
      return leadDataRef.current;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch new data using the API layer
      const result = await apiRefreshLeadData(leadDataRef.current);

      // Only update state if component is still mounted
      if (!isMountedRef.current) {
        return leadDataRef.current;
      }

      const { data: newData, alert } = result;

      // Update lead data state
      setLeadData(newData);
      setLastRefreshed(new Date());

      // Trigger alert callback if provided and an alert was generated
      if (alert && onNewAlert) {
        onNewAlert(alert);
      }

      return newData;
    } catch (err) {
      // Only update state if component is still mounted
      if (!isMountedRef.current) {
        return leadDataRef.current;
      }

      const errorMessage = err.message || "Failed to refresh data. Please try again.";
      setError(errorMessage);

      // Log error in development
      if (import.meta.env.DEV) {
        console.error("useLeadData refresh error:", err);
      }

      throw err;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isLoading, onNewAlert]);

  /**
   * Reset lead data to initial values
   */
  const resetData = useCallback(() => {
    setLeadData(initialLeadData);
    setError(null);
    setLastRefreshed(null);
  }, []);

  /**
   * Clear any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Manually set lead data (useful for optimistic updates)
   * @param {Object|Function} dataOrUpdater - New data or updater function
   */
  const setData = useCallback((dataOrUpdater) => {
    if (typeof dataOrUpdater === "function") {
      setLeadData((prev) => ({
        ...prev,
        ...dataOrUpdater(prev),
        lastUpdated: new Date().toLocaleString(),
      }));
    } else {
      setLeadData({
        ...dataOrUpdater,
        lastUpdated: new Date().toLocaleString(),
      });
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const intervalId = setInterval(() => {
      refreshData().catch(() => {
        // Silently handle auto-refresh errors
        // They're already logged in refreshData
      });
    }, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval, refreshData]);

  // Transform lead data to backward-compatible format
  const zooData = {
    population: leadData.totalLeads,
    temperature: leadData.callsMade,
    humidity: leadData.meetingsScheduled,
    lastUpdated: leadData.lastUpdated,
  };

  return {
    // Primary data
    leadData,
    isLoading,
    error,
    lastRefreshed,

    // Actions
    refreshData,
    resetData,
    clearError,
    setData,

    // Backward compatibility alias
    // Maps lead terminology to the original "zoo" terminology
    zooData,
  };
};

export default useLeadData;

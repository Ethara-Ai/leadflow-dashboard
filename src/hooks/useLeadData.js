import { useState, useCallback } from "react";
import { initialLeadData } from "../constants";
import { getRandomAlertMessage, getAlertType } from "../utils";

/**
 * Simulates an API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Custom hook for managing lead data state and refresh functionality
 *
 * @param {Object} options - Hook options
 * @param {function} [options.onNewAlert] - Callback when a new alert should be added
 * @returns {Object} Lead data state and handlers
 */
const useLeadData = ({ onNewAlert } = {}) => {
  const [leadData, setLeadData] = useState(initialLeadData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Refresh lead data with simulated new values
   * In a real app, this would fetch from an API
   */
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await delay(500);

      // Calculate new values
      const newData = await new Promise((resolve, reject) => {
        try {
          setLeadData((prevData) => {
            const newTotalLeads = Math.floor(
              Math.random() * 50 + prevData.totalLeads
            );
            const newCallsMade = Math.floor(
              Math.random() * 20 + prevData.callsMade
            );
            const newMeetingsScheduled = Math.floor(
              Math.random() * 5 + prevData.meetingsScheduled
            );

            const updated = {
              totalLeads: newTotalLeads,
              callsMade: newCallsMade,
              meetingsScheduled: Math.max(0, Math.min(100, newMeetingsScheduled)),
              lastUpdated: new Date().toLocaleString(),
            };

            resolve(updated);
            return updated;
          });
        } catch (err) {
          reject(err);
        }
      });

      // Randomly generate an alert (30% chance)
      if (Math.random() > 0.7 && onNewAlert) {
        const newAlertMessage = getRandomAlertMessage();
        const newAlertObj = {
          id: Date.now(),
          message: newAlertMessage,
          type: getAlertType(newAlertMessage),
          time: "Just now",
        };
        onNewAlert(newAlertObj);
      }

      return newData;
    } catch (err) {
      const errorMessage = "Failed to refresh data. Please try again.";
      setError(errorMessage);
      console.error("useLeadData refresh error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onNewAlert]);

  /**
   * Reset lead data to initial values
   */
  const resetData = useCallback(() => {
    setLeadData(initialLeadData);
    setError(null);
  }, []);

  /**
   * Clear any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Return with backward-compatible aliases
  return {
    leadData,
    // Backward compatibility alias
    zooData: {
      population: leadData.totalLeads,
      temperature: leadData.callsMade,
      humidity: leadData.meetingsScheduled,
      lastUpdated: leadData.lastUpdated,
    },
    isLoading,
    error,
    refreshData,
    resetData,
    clearError,
  };
};

export default useLeadData;

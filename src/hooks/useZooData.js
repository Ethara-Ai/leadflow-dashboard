import { useState, useCallback } from "react";
import { initialZooData } from "../constants";
import { getRandomAlertMessage, getAlertType } from "../utils";

/**
 * Simulates an API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Custom hook for managing zoo data state and refresh functionality
 *
 * @param {Object} options - Hook options
 * @param {function} [options.onNewAlert] - Callback when a new alert should be added
 * @returns {Object} Zoo data state and handlers
 */
const useZooData = ({ onNewAlert } = {}) => {
  const [zooData, setZooData] = useState(initialZooData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Refresh zoo data with simulated new values
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
          setZooData((prevData) => {
            const newPopulation = Math.floor(Math.random() * 50 + prevData.population);
            const newTemperature = +(Math.random() * 0.5 - 0.25 + prevData.temperature).toFixed(1);
            const newHumidity = Math.floor(Math.random() * 5 - 2.5 + prevData.humidity);

            const updated = {
              population: newPopulation,
              temperature: newTemperature,
              humidity: Math.max(0, Math.min(100, newHumidity)), // Clamp between 0-100
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
      console.error("useZooData refresh error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onNewAlert]);

  /**
   * Reset zoo data to initial values
   */
  const resetData = useCallback(() => {
    setZooData(initialZooData);
    setError(null);
  }, []);

  /**
   * Clear any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    zooData,
    isLoading,
    error,
    refreshData,
    resetData,
    clearError,
  };
};

export default useZooData;

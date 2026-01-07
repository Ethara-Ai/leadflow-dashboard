import { useState, useCallback } from "react";
import { initialZooData } from "../constants";
import { getRandomAlertMessage, getAlertType } from "../utils";

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
  const refreshData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate data refresh with random variations
      setZooData((prevData) => {
        const newPopulation = Math.floor(Math.random() * 50 + prevData.population);
        const newTemperature = +(Math.random() * 0.5 - 0.25 + prevData.temperature).toFixed(1);
        const newHumidity = Math.floor(Math.random() * 5 - 2.5 + prevData.humidity);

        return {
          population: newPopulation,
          temperature: newTemperature,
          humidity: Math.max(0, Math.min(100, newHumidity)), // Clamp between 0-100
          lastUpdated: new Date().toLocaleString(),
        };
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
    } catch (err) {
      setError("Failed to refresh data. Please try again.");
      console.error("useZooData refresh error:", err);
    } finally {
      // Simulate network delay
      setTimeout(() => setIsLoading(false), 500);
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

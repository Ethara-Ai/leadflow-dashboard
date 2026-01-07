import { useState, useMemo, useCallback } from "react";
import {
  activityWeekData,
  activityMonthData,
  activityYearData,
  feedingWeekData,
  feedingMonthData,
  feedingYearData,
  dietWeekData,
  dietMonthData,
  dietYearData,
} from "../constants";

/**
 * Valid time period values
 */
export const TIME_PERIODS = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

/**
 * Chart identifiers
 */
export const CHART_IDS = {
  ACTIVITY: "activity",
  FEEDING: "feeding",
  DIET: "diet",
};

/**
 * Get data for a specific chart and time period
 * @param {string} chartId - The chart identifier
 * @param {string} period - The time period
 * @returns {Array} The data for the specified chart and period
 */
const getChartData = (chartId, period) => {
  const dataMap = {
    [CHART_IDS.ACTIVITY]: {
      [TIME_PERIODS.WEEK]: activityWeekData,
      [TIME_PERIODS.MONTH]: activityMonthData,
      [TIME_PERIODS.YEAR]: activityYearData,
    },
    [CHART_IDS.FEEDING]: {
      [TIME_PERIODS.WEEK]: feedingWeekData,
      [TIME_PERIODS.MONTH]: feedingMonthData,
      [TIME_PERIODS.YEAR]: feedingYearData,
    },
    [CHART_IDS.DIET]: {
      [TIME_PERIODS.WEEK]: dietWeekData,
      [TIME_PERIODS.MONTH]: dietMonthData,
      [TIME_PERIODS.YEAR]: dietYearData,
    },
  };

  return dataMap[chartId]?.[period] || dataMap[chartId]?.[TIME_PERIODS.WEEK] || [];
};

/**
 * Custom hook for managing chart time period states
 * Centralizes time period management for all dashboard charts
 *
 * @param {Object} options - Hook options
 * @param {string} [options.defaultPeriod='week'] - Default time period for all charts
 * @returns {Object} Chart period states, setters, and computed data
 */
const useChartPeriods = ({ defaultPeriod = TIME_PERIODS.WEEK } = {}) => {
  // Individual time period states for each chart
  const [activityPeriod, setActivityPeriod] = useState(defaultPeriod);
  const [feedingPeriod, setFeedingPeriod] = useState(defaultPeriod);
  const [dietPeriod, setDietPeriod] = useState(defaultPeriod);

  /**
   * Set all charts to the same time period
   * @param {string} period - Time period to set
   */
  const setAllPeriods = useCallback((period) => {
    if (Object.values(TIME_PERIODS).includes(period)) {
      setActivityPeriod(period);
      setFeedingPeriod(period);
      setDietPeriod(period);
    }
  }, []);

  /**
   * Reset all periods to default
   */
  const resetPeriods = useCallback(() => {
    setActivityPeriod(defaultPeriod);
    setFeedingPeriod(defaultPeriod);
    setDietPeriod(defaultPeriod);
  }, [defaultPeriod]);

  /**
   * Get period setter by chart ID
   * @param {string} chartId - The chart identifier
   * @returns {function} The setter function for that chart
   */
  const getPeriodSetter = useCallback(
    (chartId) => {
      switch (chartId) {
        case CHART_IDS.ACTIVITY:
          return setActivityPeriod;
        case CHART_IDS.FEEDING:
          return setFeedingPeriod;
        case CHART_IDS.DIET:
          return setDietPeriod;
        default:
          return () => {};
      }
    },
    []
  );

  // Memoized data for each chart based on current period
  const activityData = useMemo(
    () => getChartData(CHART_IDS.ACTIVITY, activityPeriod),
    [activityPeriod]
  );

  const feedingData = useMemo(
    () => getChartData(CHART_IDS.FEEDING, feedingPeriod),
    [feedingPeriod]
  );

  const dietData = useMemo(() => getChartData(CHART_IDS.DIET, dietPeriod), [dietPeriod]);

  // Check if all periods are synchronized
  const arePeriodsSync = activityPeriod === feedingPeriod && feedingPeriod === dietPeriod;

  return {
    // Individual period states
    activityPeriod,
    feedingPeriod,
    dietPeriod,

    // Individual setters
    setActivityPeriod,
    setFeedingPeriod,
    setDietPeriod,

    // Bulk operations
    setAllPeriods,
    resetPeriods,

    // Utility functions
    getPeriodSetter,

    // Computed data (memoized)
    activityData,
    feedingData,
    dietData,

    // Status
    arePeriodsSync,

    // Backward compatibility aliases
    timePeriod: activityPeriod,
    setTimePeriod: setActivityPeriod,
    foragingTimePeriod: feedingPeriod,
    setForagingTimePeriod: setFeedingPeriod,
    foodTimePeriod: dietPeriod,
    setFoodTimePeriod: setDietPeriod,
  };
};

export default useChartPeriods;

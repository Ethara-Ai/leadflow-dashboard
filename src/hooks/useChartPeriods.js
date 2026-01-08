// =============================================================================
// LEADFLOW DASHBOARD - USE CHART PERIODS HOOK
// Custom hook for managing chart time period states
// =============================================================================

import { useState, useMemo, useCallback } from "react";
import {
  activityWeekData,
  activityMonthData,
  activityYearData,
  conversionWeekData,
  conversionMonthData,
  conversionYearData,
  sourceWeekData,
  sourceMonthData,
  sourceYearData,
  TIME_PERIODS,
} from "../constants/index.js";

// Re-export TIME_PERIODS for convenience
export { TIME_PERIODS };

/**
 * Chart identifiers
 */
export const CHART_IDS = {
  ACTIVITY: "activity",
  CONVERSION: "conversion",
  SOURCE: "source",
};

/**
 * Static data map for chart data lookup
 * Moved outside function to avoid recreation on every call
 */
const CHART_DATA_MAP = {
  [CHART_IDS.ACTIVITY]: {
    [TIME_PERIODS.WEEK]: activityWeekData,
    [TIME_PERIODS.MONTH]: activityMonthData,
    [TIME_PERIODS.YEAR]: activityYearData,
  },
  [CHART_IDS.CONVERSION]: {
    [TIME_PERIODS.WEEK]: conversionWeekData,
    [TIME_PERIODS.MONTH]: conversionMonthData,
    [TIME_PERIODS.YEAR]: conversionYearData,
  },
  [CHART_IDS.SOURCE]: {
    [TIME_PERIODS.WEEK]: sourceWeekData,
    [TIME_PERIODS.MONTH]: sourceMonthData,
    [TIME_PERIODS.YEAR]: sourceYearData,
  },
};

/**
 * Get data for a specific chart and time period
 * @param {string} chartId - The chart identifier
 * @param {string} period - The time period
 * @returns {Array} The data for the specified chart and period
 */
const getChartData = (chartId, period) => {
  return CHART_DATA_MAP[chartId]?.[period] || CHART_DATA_MAP[chartId]?.[TIME_PERIODS.WEEK] || [];
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
  const [conversionPeriod, setConversionPeriod] = useState(defaultPeriod);
  const [sourcePeriod, setSourcePeriod] = useState(defaultPeriod);

  /**
   * Set all charts to the same time period
   * @param {string} period - Time period to set
   */
  const setAllPeriods = useCallback((period) => {
    if (Object.values(TIME_PERIODS).includes(period)) {
      setActivityPeriod(period);
      setConversionPeriod(period);
      setSourcePeriod(period);
    }
  }, []);

  /**
   * Reset all periods to default
   */
  const resetPeriods = useCallback(() => {
    setActivityPeriod(defaultPeriod);
    setConversionPeriod(defaultPeriod);
    setSourcePeriod(defaultPeriod);
  }, [defaultPeriod]);

  /**
   * Get period setter by chart ID
   * @param {string} chartId - The chart identifier
   * @returns {function} The setter function for that chart
   */
  const getPeriodSetter = useCallback((chartId) => {
    switch (chartId) {
      case CHART_IDS.ACTIVITY:
        return setActivityPeriod;
      case CHART_IDS.CONVERSION:
        return setConversionPeriod;
      case CHART_IDS.SOURCE:
        return setSourcePeriod;
      default:
        return () => {};
    }
  }, []);

  // Memoized data for each chart based on current period
  const activityData = useMemo(() => getChartData(CHART_IDS.ACTIVITY, activityPeriod), [activityPeriod]);

  const conversionData = useMemo(() => getChartData(CHART_IDS.CONVERSION, conversionPeriod), [conversionPeriod]);

  const sourceData = useMemo(() => getChartData(CHART_IDS.SOURCE, sourcePeriod), [sourcePeriod]);

  // Check if all periods are synchronized
  const arePeriodsSync = activityPeriod === conversionPeriod && conversionPeriod === sourcePeriod;

  return {
    // Individual period states
    activityPeriod,
    conversionPeriod,
    sourcePeriod,

    // Individual setters
    setActivityPeriod,
    setConversionPeriod,
    setSourcePeriod,

    // Bulk operations
    setAllPeriods,
    resetPeriods,

    // Utility functions
    getPeriodSetter,

    // Computed data (memoized)
    activityData,
    conversionData,
    sourceData,

    // Status
    arePeriodsSync,
  };
};

export default useChartPeriods;

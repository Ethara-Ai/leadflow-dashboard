// =============================================================================
// LEADFLOW DASHBOARD - CHART PERIODS CONTEXT
// Focused context for chart periods state management
// =============================================================================

import { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import useChartPeriods, { TIME_PERIODS, CHART_IDS } from '../hooks/useChartPeriods.js';

/**
 * Chart Periods Context
 */
const ChartPeriodsContext = createContext(undefined);

/**
 * Chart Periods Provider Component
 * Provides focused state management for chart time periods
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.defaultPeriod='week'] - Default time period for all charts
 */
export const ChartPeriodsProvider = ({ children, defaultPeriod = TIME_PERIODS.WEEK }) => {
  const {
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
  } = useChartPeriods({
    defaultPeriod,
  });

  const value = useMemo(
    () => ({
      // Constants for reference
      TIME_PERIODS,
      CHART_IDS,

      // Individual Period States
      activityPeriod,
      conversionPeriod,
      sourcePeriod,

      // Individual Setters
      setActivityPeriod,
      setConversionPeriod,
      setSourcePeriod,

      // Bulk Operations
      setAllPeriods,
      resetPeriods,

      // Utility Functions
      getPeriodSetter,

      // Computed Data (memoized)
      activityData,
      conversionData,
      sourceData,

      // Status
      arePeriodsSync,
    }),
    [
      activityPeriod,
      conversionPeriod,
      sourcePeriod,
      setActivityPeriod,
      setConversionPeriod,
      setSourcePeriod,
      setAllPeriods,
      resetPeriods,
      getPeriodSetter,
      activityData,
      conversionData,
      sourceData,
      arePeriodsSync,
    ]
  );

  return <ChartPeriodsContext.Provider value={value}>{children}</ChartPeriodsContext.Provider>;
};

ChartPeriodsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultPeriod: PropTypes.oneOf(Object.values(TIME_PERIODS)),
};

export default ChartPeriodsContext;

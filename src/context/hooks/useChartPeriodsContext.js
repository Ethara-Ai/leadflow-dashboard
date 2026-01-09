// =============================================================================
// LEADFLOW DASHBOARD - USE CHART PERIODS CONTEXT HOOK
// Custom hook to access chart periods context
// =============================================================================

import { useContext } from 'react';
import ChartPeriodsContext from '../ChartPeriodsContext.jsx';

/**
 * Custom hook to access chart periods context
 * @returns {Object} Chart periods context value
 * @throws {Error} If used outside of ChartPeriodsProvider
 */
export const useChartPeriodsContext = () => {
  const context = useContext(ChartPeriodsContext);

  if (context === undefined) {
    throw new Error('useChartPeriodsContext must be used within a ChartPeriodsProvider');
  }

  return context;
};

export default useChartPeriodsContext;

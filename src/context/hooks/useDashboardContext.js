// =============================================================================
// LEADFLOW DASHBOARD - USE DASHBOARD CONTEXT HOOK
// Custom hook to access the unified dashboard context
// =============================================================================

import { useContext } from 'react';
import DashboardContext from '../DashboardContext.jsx';

/**
 * Custom hook to access the unified dashboard context
 * This provides backward compatibility and a convenient way to access all state
 *
 * @returns {Object} Unified dashboard context value
 * @throws {Error} If used outside of DashboardProvider
 */
export const useDashboardContext = () => {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error(
      'useDashboardContext must be used within a DashboardProvider'
    );
  }

  return context;
};

export default useDashboardContext;

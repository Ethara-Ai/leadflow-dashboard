// =============================================================================
// LEADFLOW DASHBOARD - USE DASHBOARD HOOK
// Custom hook for accessing dashboard context
// =============================================================================

import { useContext } from 'react';
import DashboardContext from './DashboardContext.jsx';

/**
 * Custom hook to access dashboard context
 * @returns {Object} Dashboard context value
 * @throws {Error} If used outside of DashboardProvider
 */
const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  return context;
};

export default useDashboard;

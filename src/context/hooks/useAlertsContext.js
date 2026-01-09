// =============================================================================
// LEADFLOW DASHBOARD - USE ALERTS CONTEXT HOOK
// Custom hook to access alerts context
// =============================================================================

import { useContext } from 'react';
import AlertsContext from '../AlertsContext.jsx';

/**
 * Custom hook to access alerts context
 * @returns {Object} Alerts context value
 * @throws {Error} If used outside of AlertsProvider
 */
export const useAlertsContext = () => {
  const context = useContext(AlertsContext);

  if (context === undefined) {
    throw new Error('useAlertsContext must be used within an AlertsProvider');
  }

  return context;
};

export default useAlertsContext;

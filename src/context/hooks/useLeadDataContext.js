// =============================================================================
// LEADFLOW DASHBOARD - USE LEAD DATA CONTEXT HOOK
// Custom hook to access lead data context
// =============================================================================

import { useContext } from 'react';
import LeadDataContext from '../LeadDataContext.jsx';

/**
 * Custom hook to access lead data context
 * @returns {Object} Lead data context value
 * @throws {Error} If used outside of LeadDataProvider
 */
export const useLeadDataContext = () => {
  const context = useContext(LeadDataContext);

  if (context === undefined) {
    throw new Error('useLeadDataContext must be used within a LeadDataProvider');
  }

  return context;
};

export default useLeadDataContext;

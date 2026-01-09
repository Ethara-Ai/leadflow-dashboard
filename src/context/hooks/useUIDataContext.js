// =============================================================================
// LEADFLOW DASHBOARD - USE UI DATA CONTEXT HOOK
// Custom hook to access UI data context
// =============================================================================

import { useContext } from 'react';
import UIDataContext from '../UIDataContext.jsx';

/**
 * Custom hook to access UI data context
 * @returns {Object} UI data context value
 * @throws {Error} If used outside of UIDataProvider
 */
export const useUIDataContext = () => {
  const context = useContext(UIDataContext);

  if (context === undefined) {
    throw new Error('useUIDataContext must be used within a UIDataProvider');
  }

  return context;
};

export default useUIDataContext;

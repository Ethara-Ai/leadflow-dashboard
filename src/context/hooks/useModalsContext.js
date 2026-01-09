// =============================================================================
// LEADFLOW DASHBOARD - USE MODALS CONTEXT HOOK
// Custom hook to access modals context
// =============================================================================

import { useContext } from 'react';
import ModalsContext from '../ModalsContext.jsx';

/**
 * Custom hook to access modals context
 * @returns {Object} Modals context value
 * @throws {Error} If used outside of ModalsProvider
 */
export const useModalsContext = () => {
  const context = useContext(ModalsContext);

  if (context === undefined) {
    throw new Error('useModalsContext must be used within a ModalsProvider');
  }

  return context;
};

export default useModalsContext;

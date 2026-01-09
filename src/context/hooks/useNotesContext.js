// =============================================================================
// LEADFLOW DASHBOARD - USE NOTES CONTEXT HOOK
// Custom hook to access notes context
// =============================================================================

import { useContext } from 'react';
import NotesContext from '../NotesContext.jsx';

/**
 * Custom hook to access notes context
 * @returns {Object} Notes context value
 * @throws {Error} If used outside of NotesProvider
 */
export const useNotesContext = () => {
  const context = useContext(NotesContext);

  if (context === undefined) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }

  return context;
};

export default useNotesContext;

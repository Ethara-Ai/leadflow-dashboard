// =============================================================================
// LEADFLOW DASHBOARD - NOTES CONTEXT
// Focused context for notes state management
// =============================================================================

import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import useNotes from "../hooks/useNotes.js";

/**
 * Notes Context
 */
const NotesContext = createContext(undefined);

/**
 * Custom hook to access notes context
 * @returns {Object} Notes context value
 * @throws {Error} If used outside of NotesProvider
 */
export const useNotesContext = () => {
  const context = useContext(NotesContext);

  if (context === undefined) {
    throw new Error("useNotesContext must be used within a NotesProvider");
  }

  return context;
};

/**
 * Notes Provider Component
 * Provides focused state management for notes
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array} [props.initialState] - Initial notes array
 * @param {number} [props.maxNotes] - Maximum number of notes to keep
 * @param {number} [props.maxNoteLength] - Maximum character length for notes
 */
export const NotesProvider = ({
  children,
  initialState,
  maxNotes,
  maxNoteLength,
}) => {
  const {
    notes,
    noteCount,
    isAtLimit,
    remainingCapacity,
    maxNotes: maxNotesLimit,
    maxNoteLength: maxNoteLengthLimit,
    addNote,
    deleteNote,
    updateNote,
    clearNotes,
    resetNotes,
    getNoteById,
    searchNotes,
    getSortedNotes,
    validateNote,
  } = useNotes({
    initialState,
    maxNotes,
    maxNoteLength,
  });

  const value = useMemo(
    () => ({
      // Notes State
      notes,
      noteCount,

      // Capacity Info
      isAtLimit,
      remainingCapacity,
      maxNotes: maxNotesLimit,
      maxNoteLength: maxNoteLengthLimit,

      // CRUD Operations
      addNote,
      deleteNote,
      updateNote,
      clearNotes,
      resetNotes,

      // Query Operations
      getNoteById,
      searchNotes,
      getSortedNotes,

      // Utilities
      validateNote,
    }),
    [
      notes,
      noteCount,
      isAtLimit,
      remainingCapacity,
      maxNotesLimit,
      maxNoteLengthLimit,
      addNote,
      deleteNote,
      updateNote,
      clearNotes,
      resetNotes,
      getNoteById,
      searchNotes,
      getSortedNotes,
      validateNote,
    ]
  );

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

NotesProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialState: PropTypes.array,
  maxNotes: PropTypes.number,
  maxNoteLength: PropTypes.number,
};

export default NotesContext;

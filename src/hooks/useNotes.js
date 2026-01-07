import { useState, useCallback } from "react";
import { initialNotes } from "../constants";

/**
 * Custom hook for managing notes state
 *
 * @param {Object} options - Hook options
 * @param {Array} [options.initialState] - Initial notes array (defaults to initialNotes from constants)
 * @param {number} [options.maxNotes=100] - Maximum number of notes to keep
 * @returns {Object} Notes state and handlers
 */
const useNotes = ({ initialState = initialNotes, maxNotes = 100 } = {}) => {
  const [notes, setNotes] = useState(initialState);

  /**
   * Add a new note
   * @param {string|Object} contentOrNote - Note content string or full note object
   */
  const addNote = useCallback(
    (contentOrNote) => {
      let newNote;

      if (typeof contentOrNote === "string") {
        newNote = {
          id: Date.now(),
          content: contentOrNote,
          timestamp: new Date().toLocaleString(),
        };
      } else {
        // Use provided note object, ensuring it has an id and timestamp
        newNote = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          ...contentOrNote,
        };
      }

      setNotes((prev) => [newNote, ...prev].slice(0, maxNotes));
    },
    [maxNotes]
  );

  /**
   * Delete a note by ID
   * @param {number|string} noteId - ID of the note to delete
   */
  const deleteNote = useCallback((noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  }, []);

  /**
   * Update an existing note's content
   * @param {number|string} noteId - ID of the note to update
   * @param {string} newContent - New content for the note
   */
  const updateNote = useCallback((noteId, newContent) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              content: newContent,
              timestamp: new Date().toLocaleString(),
              edited: true,
            }
          : note
      )
    );
  }, []);

  /**
   * Clear all notes
   */
  const clearNotes = useCallback(() => {
    setNotes([]);
  }, []);

  /**
   * Reset notes to initial state
   */
  const resetNotes = useCallback(() => {
    setNotes(initialState);
  }, [initialState]);

  /**
   * Get a note by ID
   * @param {number|string} noteId - ID of the note to find
   * @returns {Object|undefined} The found note or undefined
   */
  const getNoteById = useCallback(
    (noteId) => {
      return notes.find((note) => note.id === noteId);
    },
    [notes]
  );

  /**
   * Search notes by content
   * @param {string} searchTerm - Term to search for in note content
   * @returns {Array} Matching notes
   */
  const searchNotes = useCallback(
    (searchTerm) => {
      if (!searchTerm || !searchTerm.trim()) {
        return notes;
      }
      const term = searchTerm.toLowerCase();
      return notes.filter((note) => note.content.toLowerCase().includes(term));
    },
    [notes]
  );

  return {
    notes,
    noteCount: notes.length,
    addNote,
    deleteNote,
    updateNote,
    clearNotes,
    resetNotes,
    getNoteById,
    searchNotes,
  };
};

export default useNotes;

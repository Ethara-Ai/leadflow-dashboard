// =============================================================================
// LEADFLOW DASHBOARD - USE NOTES HOOK
// Custom hook for managing notes state
// =============================================================================

import { useState, useCallback } from "react";
import { initialNotes, MAX_NOTES, MAX_NOTE_LENGTH } from "../constants/index.js";

/**
 * Custom hook for managing notes state
 *
 * @param {Object} options - Hook options
 * @param {Array} [options.initialState] - Initial notes array (defaults to initialNotes from constants)
 * @param {number} [options.maxNotes] - Maximum number of notes to keep (defaults to MAX_NOTES)
 * @param {number} [options.maxNoteLength] - Maximum character length for notes (defaults to MAX_NOTE_LENGTH)
 * @returns {Object} Notes state and handlers
 */
const useNotes = ({ initialState = initialNotes, maxNotes = MAX_NOTES, maxNoteLength = MAX_NOTE_LENGTH } = {}) => {
  const [notes, setNotes] = useState(initialState);

  /**
   * Validate note content
   * @param {string} content - Note content to validate
   * @returns {{ valid: boolean, error: string | null }} Validation result
   */
  const validateNote = useCallback(
    (content) => {
      if (!content || typeof content !== "string") {
        return { valid: false, error: "Note content is required" };
      }

      const trimmedContent = content.trim();

      if (trimmedContent.length === 0) {
        return { valid: false, error: "Note cannot be empty" };
      }

      if (trimmedContent.length > maxNoteLength) {
        return {
          valid: false,
          error: `Note exceeds maximum length of ${maxNoteLength} characters`,
        };
      }

      return { valid: true, error: null };
    },
    [maxNoteLength],
  );

  /**
   * Add a new note
   * @param {string|Object} contentOrNote - Note content string or full note object
   * @returns {{ success: boolean, note: Object | null, error: string | null }}
   */
  const addNote = useCallback(
    (contentOrNote) => {
      let newNote;

      if (typeof contentOrNote === "string") {
        const validation = validateNote(contentOrNote);
        if (!validation.valid) {
          return { success: false, note: null, error: validation.error };
        }

        newNote = {
          id: Date.now(),
          content: contentOrNote.trim(),
          timestamp: new Date().toLocaleString(),
          createdAt: new Date().toISOString(),
        };
      } else {
        // Use provided note object, ensuring it has an id and timestamp
        const content = contentOrNote?.content;
        if (content) {
          const validation = validateNote(content);
          if (!validation.valid) {
            return { success: false, note: null, error: validation.error };
          }
        }

        newNote = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          createdAt: new Date().toISOString(),
          ...contentOrNote,
          content: content?.trim() || "",
        };
      }

      setNotes((prev) => [newNote, ...prev].slice(0, maxNotes));
      return { success: true, note: newNote, error: null };
    },
    [maxNotes, validateNote],
  );

  /**
   * Delete a note by ID
   * @param {number|string} noteId - ID of the note to delete
   * @returns {boolean} Whether the note was found and deleted
   */
  const deleteNote = useCallback((noteId) => {
    let deleted = false;
    setNotes((prev) => {
      const newNotes = prev.filter((note) => note.id !== noteId);
      deleted = newNotes.length !== prev.length;
      return newNotes;
    });
    return deleted;
  }, []);

  /**
   * Update an existing note's content
   * @param {number|string} noteId - ID of the note to update
   * @param {string} newContent - New content for the note
   * @returns {{ success: boolean, error: string | null }}
   */
  const updateNote = useCallback(
    (noteId, newContent) => {
      const validation = validateNote(newContent);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      let found = false;
      setNotes((prev) =>
        prev.map((note) => {
          if (note.id === noteId) {
            found = true;
            return {
              ...note,
              content: newContent.trim(),
              timestamp: new Date().toLocaleString(),
              updatedAt: new Date().toISOString(),
              edited: true,
            };
          }
          return note;
        }),
      );

      if (!found) {
        return { success: false, error: "Note not found" };
      }

      return { success: true, error: null };
    },
    [validateNote],
  );

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
    [notes],
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
    [notes],
  );

  /**
   * Get notes sorted by date (newest first by default)
   * @param {boolean} [ascending=false] - Sort in ascending order (oldest first)
   * @returns {Array} Sorted notes
   */
  const getSortedNotes = useCallback(
    (ascending = false) => {
      return [...notes].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.timestamp).getTime();
        const dateB = new Date(b.createdAt || b.timestamp).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
    },
    [notes],
  );

  /**
   * Check if notes limit is reached
   */
  const isAtLimit = notes.length >= maxNotes;

  /**
   * Get remaining capacity for notes
   */
  const remainingCapacity = Math.max(0, maxNotes - notes.length);

  return {
    // State
    notes,
    noteCount: notes.length,

    // Capacity info
    isAtLimit,
    remainingCapacity,
    maxNotes,
    maxNoteLength,

    // CRUD operations
    addNote,
    deleteNote,
    updateNote,
    clearNotes,
    resetNotes,

    // Query operations
    getNoteById,
    searchNotes,
    getSortedNotes,

    // Utilities
    validateNote,
  };
};

export default useNotes;

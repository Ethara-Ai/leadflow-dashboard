/**
 * Unit Tests for useNotes Hook
 * Tests notes CRUD operations including add, delete, update, search, and validation
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useNotes from './useNotes.js';

// =============================================================================
// Test Helpers
// =============================================================================

const createMockNote = (overrides = {}) => ({
  id: Date.now() + Math.random(),
  content: 'Test note content',
  timestamp: new Date().toLocaleString(),
  createdAt: new Date().toISOString(),
  ...overrides,
});

// =============================================================================
// Initial State Tests
// =============================================================================

describe('useNotes', () => {
  describe('initial state', () => {
    it('should initialize with default notes from constants', () => {
      const { result } = renderHook(() => useNotes());

      expect(result.current.notes).toBeDefined();
      expect(Array.isArray(result.current.notes)).toBe(true);
    });

    it('should initialize with custom initial state', () => {
      const customNotes = [
        createMockNote({ id: 1, content: 'Custom note 1' }),
        createMockNote({ id: 2, content: 'Custom note 2' }),
      ];

      const { result } = renderHook(() => useNotes({ initialState: customNotes }));

      expect(result.current.notes).toEqual(customNotes);
      expect(result.current.noteCount).toBe(2);
    });

    it('should initialize with empty array when provided', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      expect(result.current.notes).toEqual([]);
      expect(result.current.noteCount).toBe(0);
    });

    it('should initialize with correct capacity info', () => {
      const { result } = renderHook(() => useNotes({ initialState: [], maxNotes: 10 }));

      expect(result.current.isAtLimit).toBe(false);
      expect(result.current.remainingCapacity).toBe(10);
      expect(result.current.maxNotes).toBe(10);
    });
  });

  // =============================================================================
  // Validate Note Tests
  // =============================================================================

  describe('validateNote', () => {
    it('should return valid for proper note content', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      const validation = result.current.validateNote('Valid note content');

      expect(validation.valid).toBe(true);
      expect(validation.error).toBe(null);
    });

    it('should return invalid for empty content', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      const validation = result.current.validateNote('');

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('Note content is required');
    });

    it('should return invalid for whitespace-only content', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      const validation = result.current.validateNote('   ');

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('Note cannot be empty');
    });

    it('should return invalid for null content', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      const validation = result.current.validateNote(null);

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('Note content is required');
    });

    it('should return invalid for undefined content', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      const validation = result.current.validateNote(undefined);

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('Note content is required');
    });

    it('should return invalid for non-string content', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      const validation = result.current.validateNote(123);

      expect(validation.valid).toBe(false);
      expect(validation.error).toBe('Note content is required');
    });

    it('should return invalid for content exceeding max length', () => {
      const { result } = renderHook(() => useNotes({ initialState: [], maxNoteLength: 10 }));

      const validation = result.current.validateNote('This is way too long');

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('exceeds maximum length');
    });
  });

  // =============================================================================
  // Add Note Tests
  // =============================================================================

  describe('addNote', () => {
    it('should add a new note from a string', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote('New test note');
      });

      expect(result.current.noteCount).toBe(1);
      expect(result.current.notes[0].content).toBe('New test note');
    });

    it('should add note at the beginning of the list', () => {
      const existingNote = createMockNote({ id: 1, content: 'Existing note' });
      const { result } = renderHook(() => useNotes({ initialState: [existingNote] }));

      act(() => {
        result.current.addNote('New note');
      });

      expect(result.current.notes[0].content).toBe('New note');
      expect(result.current.notes[1].content).toBe('Existing note');
    });

    it('should return success result when adding valid note', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      let addResult;
      act(() => {
        addResult = result.current.addNote('Valid note');
      });

      expect(addResult.success).toBe(true);
      expect(addResult.note).toBeDefined();
      expect(addResult.error).toBe(null);
    });

    it('should return error result when adding invalid note', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      let addResult;
      act(() => {
        addResult = result.current.addNote('');
      });

      expect(addResult.success).toBe(false);
      expect(addResult.note).toBe(null);
      expect(addResult.error).toBeDefined();
    });

    it('should add a full note object', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote({
          content: 'Object note content',
        });
      });

      expect(result.current.notes[0].content).toBe('Object note content');
    });

    it('should auto-generate id for new notes', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote('Test note');
      });

      expect(result.current.notes[0].id).toBeDefined();
      expect(typeof result.current.notes[0].id).toBe('number');
    });

    it('should add timestamp to new notes', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote('Test note');
      });

      expect(result.current.notes[0].timestamp).toBeDefined();
      expect(result.current.notes[0].createdAt).toBeDefined();
    });

    it('should trim note content', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote('  Trimmed content  ');
      });

      expect(result.current.notes[0].content).toBe('Trimmed content');
    });

    it('should respect maxNotes limit', () => {
      const { result } = renderHook(() => useNotes({ initialState: [], maxNotes: 3 }));

      act(() => {
        result.current.addNote('Note 1');
        result.current.addNote('Note 2');
        result.current.addNote('Note 3');
        result.current.addNote('Note 4');
        result.current.addNote('Note 5');
      });

      expect(result.current.noteCount).toBe(3);
      expect(result.current.notes[0].content).toBe('Note 5');
    });

    it('should validate content from note object', () => {
      const { result } = renderHook(() => useNotes({ initialState: [], maxNoteLength: 10 }));

      let addResult;
      act(() => {
        addResult = result.current.addNote({
          content: 'This content is too long for the limit',
        });
      });

      expect(addResult.success).toBe(false);
      expect(addResult.error).toContain('exceeds maximum length');
    });
  });

  // =============================================================================
  // Delete Note Tests
  // =============================================================================

  describe('deleteNote', () => {
    it('should delete a note by id', () => {
      const notes = [
        createMockNote({ id: 1, content: 'Note 1' }),
        createMockNote({ id: 2, content: 'Note 2' }),
        createMockNote({ id: 3, content: 'Note 3' }),
      ];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      act(() => {
        result.current.deleteNote(2);
      });

      expect(result.current.noteCount).toBe(2);
      expect(result.current.notes.find((n) => n.id === 2)).toBeUndefined();
    });

    it('should return true when note is deleted', () => {
      const notes = [createMockNote({ id: 1, content: 'Note 1' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      let deleted;
      act(() => {
        deleted = result.current.deleteNote(1);
      });

      expect(deleted).toBe(true);
    });

    it('should return false when note id not found', () => {
      const notes = [createMockNote({ id: 1, content: 'Note 1' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      let deleted;
      act(() => {
        deleted = result.current.deleteNote(999);
      });

      expect(deleted).toBe(false);
      expect(result.current.noteCount).toBe(1);
    });

    it('should handle deleting from empty list', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      let deleted;
      act(() => {
        deleted = result.current.deleteNote(1);
      });

      expect(deleted).toBe(false);
      expect(result.current.noteCount).toBe(0);
    });

    it('should update remaining capacity after delete', () => {
      const notes = [createMockNote({ id: 1 }), createMockNote({ id: 2 })];
      const { result } = renderHook(() => useNotes({ initialState: notes, maxNotes: 5 }));

      expect(result.current.remainingCapacity).toBe(3);

      act(() => {
        result.current.deleteNote(1);
      });

      expect(result.current.remainingCapacity).toBe(4);
    });
  });

  // =============================================================================
  // Update Note Tests
  // =============================================================================

  describe('updateNote', () => {
    it('should update note content by id', () => {
      const notes = [createMockNote({ id: 1, content: 'Original content' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      act(() => {
        result.current.updateNote(1, 'Updated content');
      });

      expect(result.current.notes[0].content).toBe('Updated content');
    });

    it('should return success result for valid update', () => {
      const notes = [createMockNote({ id: 1, content: 'Original' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      let updateResult;
      act(() => {
        updateResult = result.current.updateNote(1, 'Updated');
      });

      expect(updateResult.success).toBe(true);
      expect(updateResult.error).toBe(null);
    });

    it('should return error for invalid content', () => {
      const notes = [createMockNote({ id: 1, content: 'Original' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      let updateResult;
      act(() => {
        updateResult = result.current.updateNote(1, '');
      });

      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toBeDefined();
    });

    it('should return error for non-existent note', () => {
      const notes = [createMockNote({ id: 1, content: 'Original' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      let updateResult;
      act(() => {
        updateResult = result.current.updateNote(999, 'Updated');
      });

      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toBe('Note not found');
    });

    it('should update timestamp on edit', () => {
      const notes = [createMockNote({ id: 1, content: 'Original', timestamp: 'Old time' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      act(() => {
        result.current.updateNote(1, 'Updated');
      });

      expect(result.current.notes[0].timestamp).not.toBe('Old time');
    });

    it('should mark note as edited', () => {
      const notes = [createMockNote({ id: 1, content: 'Original' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      act(() => {
        result.current.updateNote(1, 'Updated');
      });

      expect(result.current.notes[0].edited).toBe(true);
    });

    it('should add updatedAt timestamp', () => {
      const notes = [createMockNote({ id: 1, content: 'Original' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      act(() => {
        result.current.updateNote(1, 'Updated');
      });

      expect(result.current.notes[0].updatedAt).toBeDefined();
    });

    it('should trim updated content', () => {
      const notes = [createMockNote({ id: 1, content: 'Original' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      act(() => {
        result.current.updateNote(1, '  Trimmed update  ');
      });

      expect(result.current.notes[0].content).toBe('Trimmed update');
    });
  });

  // =============================================================================
  // Clear and Reset Tests
  // =============================================================================

  describe('clearNotes', () => {
    it('should remove all notes', () => {
      const notes = [
        createMockNote({ id: 1 }),
        createMockNote({ id: 2 }),
        createMockNote({ id: 3 }),
      ];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      expect(result.current.noteCount).toBe(3);

      act(() => {
        result.current.clearNotes();
      });

      expect(result.current.noteCount).toBe(0);
      expect(result.current.notes).toEqual([]);
    });

    it('should work on empty list', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.clearNotes();
      });

      expect(result.current.noteCount).toBe(0);
    });
  });

  describe('resetNotes', () => {
    it('should reset to initial state', () => {
      const initialNotes = [createMockNote({ id: 1, content: 'Initial note' })];
      const { result } = renderHook(() => useNotes({ initialState: initialNotes }));

      act(() => {
        result.current.addNote('New note 1');
        result.current.addNote('New note 2');
      });

      expect(result.current.noteCount).toBe(3);

      act(() => {
        result.current.resetNotes();
      });

      expect(result.current.noteCount).toBe(1);
      expect(result.current.notes[0].content).toBe('Initial note');
    });

    it('should reset to empty when initial was empty', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote('Test note');
      });

      expect(result.current.noteCount).toBe(1);

      act(() => {
        result.current.resetNotes();
      });

      expect(result.current.noteCount).toBe(0);
    });
  });

  // =============================================================================
  // Get Note By Id Tests
  // =============================================================================

  describe('getNoteById', () => {
    it('should return note by id', () => {
      const notes = [
        createMockNote({ id: 1, content: 'Note 1' }),
        createMockNote({ id: 2, content: 'Note 2' }),
      ];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const note = result.current.getNoteById(2);

      expect(note).toBeDefined();
      expect(note.content).toBe('Note 2');
    });

    it('should return undefined for non-existent id', () => {
      const notes = [createMockNote({ id: 1, content: 'Note 1' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const note = result.current.getNoteById(999);

      expect(note).toBeUndefined();
    });

    it('should return undefined for empty list', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      const note = result.current.getNoteById(1);

      expect(note).toBeUndefined();
    });
  });

  // =============================================================================
  // Search Notes Tests
  // =============================================================================

  describe('searchNotes', () => {
    it('should find notes containing search term', () => {
      const notes = [
        createMockNote({ id: 1, content: 'Meeting notes for Monday' }),
        createMockNote({ id: 2, content: 'Shopping list' }),
        createMockNote({ id: 3, content: 'Notes from meeting' }),
      ];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const found = result.current.searchNotes('meeting');

      expect(found.length).toBe(2);
    });

    it('should be case-insensitive', () => {
      const notes = [
        createMockNote({ id: 1, content: 'UPPERCASE TEXT' }),
        createMockNote({ id: 2, content: 'lowercase text' }),
      ];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const found = result.current.searchNotes('TEXT');

      expect(found.length).toBe(2);
    });

    it('should return all notes for empty search term', () => {
      const notes = [createMockNote({ id: 1 }), createMockNote({ id: 2 })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const found = result.current.searchNotes('');

      expect(found.length).toBe(2);
    });

    it('should return all notes for whitespace search term', () => {
      const notes = [createMockNote({ id: 1 }), createMockNote({ id: 2 })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const found = result.current.searchNotes('   ');

      expect(found.length).toBe(2);
    });

    it('should return empty array for no matches', () => {
      const notes = [createMockNote({ id: 1, content: 'Hello world' })];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const found = result.current.searchNotes('xyz');

      expect(found).toEqual([]);
    });
  });

  // =============================================================================
  // Get Sorted Notes Tests
  // =============================================================================

  describe('getSortedNotes', () => {
    it('should sort notes by date (newest first by default)', () => {
      const notes = [
        createMockNote({ id: 1, createdAt: '2024-01-01T10:00:00Z' }),
        createMockNote({ id: 2, createdAt: '2024-03-01T10:00:00Z' }),
        createMockNote({ id: 3, createdAt: '2024-02-01T10:00:00Z' }),
      ];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const sorted = result.current.getSortedNotes();

      expect(sorted[0].id).toBe(2);
      expect(sorted[1].id).toBe(3);
      expect(sorted[2].id).toBe(1);
    });

    it('should sort notes ascending when specified', () => {
      const notes = [
        createMockNote({ id: 1, createdAt: '2024-01-01T10:00:00Z' }),
        createMockNote({ id: 2, createdAt: '2024-03-01T10:00:00Z' }),
        createMockNote({ id: 3, createdAt: '2024-02-01T10:00:00Z' }),
      ];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const sorted = result.current.getSortedNotes(true);

      expect(sorted[0].id).toBe(1);
      expect(sorted[1].id).toBe(3);
      expect(sorted[2].id).toBe(2);
    });

    it('should not modify original notes array', () => {
      const notes = [
        createMockNote({ id: 1, createdAt: '2024-01-01T10:00:00Z' }),
        createMockNote({ id: 2, createdAt: '2024-03-01T10:00:00Z' }),
      ];
      const { result } = renderHook(() => useNotes({ initialState: notes }));

      const sorted = result.current.getSortedNotes();

      expect(result.current.notes[0].id).toBe(1);
      expect(sorted).not.toBe(result.current.notes);
    });

    it('should handle empty list', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      const sorted = result.current.getSortedNotes();

      expect(sorted).toEqual([]);
    });
  });

  // =============================================================================
  // Capacity Tests
  // =============================================================================

  describe('capacity tracking', () => {
    it('should update isAtLimit correctly', () => {
      const { result } = renderHook(() => useNotes({ initialState: [], maxNotes: 2 }));

      expect(result.current.isAtLimit).toBe(false);

      act(() => {
        result.current.addNote('Note 1');
        result.current.addNote('Note 2');
      });

      expect(result.current.isAtLimit).toBe(true);
    });

    it('should update remainingCapacity correctly', () => {
      const { result } = renderHook(() => useNotes({ initialState: [], maxNotes: 5 }));

      expect(result.current.remainingCapacity).toBe(5);

      act(() => {
        result.current.addNote('Note 1');
        result.current.addNote('Note 2');
      });

      expect(result.current.remainingCapacity).toBe(3);
    });

    it('should not go below 0 for remainingCapacity', () => {
      const notes = [
        createMockNote({ id: 1 }),
        createMockNote({ id: 2 }),
        createMockNote({ id: 3 }),
      ];
      const { result } = renderHook(() => useNotes({ initialState: notes, maxNotes: 2 }));

      // Even though we have 3 notes and max is 2, remainingCapacity should be 0
      expect(result.current.remainingCapacity).toBe(0);
    });

    it('should expose maxNoteLength', () => {
      const { result } = renderHook(() => useNotes({ initialState: [], maxNoteLength: 500 }));

      expect(result.current.maxNoteLength).toBe(500);
    });
  });

  // =============================================================================
  // Edge Cases Tests
  // =============================================================================

  describe('edge cases', () => {
    it('should handle rapid successive addNote calls', () => {
      const { result } = renderHook(() => useNotes({ initialState: [], maxNotes: 10 }));

      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.addNote(`Note ${i}`);
        }
      });

      expect(result.current.noteCount).toBe(5);
    });

    it('should maintain note order (newest first)', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote('First');
      });

      act(() => {
        result.current.addNote('Second');
      });

      act(() => {
        result.current.addNote('Third');
      });

      expect(result.current.notes[0].content).toBe('Third');
      expect(result.current.notes[1].content).toBe('Second');
      expect(result.current.notes[2].content).toBe('First');
    });

    it('should work with default options', () => {
      const { result } = renderHook(() => useNotes());

      expect(result.current.addNote).toBeDefined();
      expect(result.current.deleteNote).toBeDefined();
      expect(result.current.updateNote).toBeDefined();
      expect(result.current.clearNotes).toBeDefined();
      expect(result.current.resetNotes).toBeDefined();
      expect(result.current.getNoteById).toBeDefined();
      expect(result.current.searchNotes).toBeDefined();
      expect(result.current.getSortedNotes).toBeDefined();
      expect(result.current.validateNote).toBeDefined();
    });

    it('should return all expected properties', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      // State
      expect(result.current.notes).toBeDefined();
      expect(typeof result.current.noteCount).toBe('number');

      // Capacity info
      expect(typeof result.current.isAtLimit).toBe('boolean');
      expect(typeof result.current.remainingCapacity).toBe('number');
      expect(typeof result.current.maxNotes).toBe('number');
      expect(typeof result.current.maxNoteLength).toBe('number');
    });

    it('should handle special characters in note content', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote('Note with <html> & "quotes" and \'apostrophes\'');
      });

      expect(result.current.notes[0].content).toBe(
        'Note with <html> & "quotes" and \'apostrophes\''
      );
    });

    it('should handle unicode characters', () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote('Unicode: 你好 🎉 émojis');
      });

      expect(result.current.notes[0].content).toBe('Unicode: 你好 🎉 émojis');
    });
  });
});

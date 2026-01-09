/**
 * Unit Tests for useNotes Hook
 * Tests notes state management functionality
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useNotes from "./useNotes";

// =============================================================================
// Test Helpers
// =============================================================================

const mockNotes = [
  {
    id: 1,
    content: "First note content",
    timestamp: "1/1/2024, 10:00:00 AM",
    createdAt: "2024-01-01T10:00:00.000Z",
  },
  {
    id: 2,
    content: "Second note content",
    timestamp: "1/2/2024, 11:00:00 AM",
    createdAt: "2024-01-02T11:00:00.000Z",
  },
  {
    id: 3,
    content: "Third note content",
    timestamp: "1/3/2024, 12:00:00 PM",
    createdAt: "2024-01-03T12:00:00.000Z",
  },
];

// =============================================================================
// Initialization Tests
// =============================================================================

describe("useNotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with default notes from constants", () => {
      const { result } = renderHook(() => useNotes());

      expect(result.current.notes).toBeDefined();
      expect(Array.isArray(result.current.notes)).toBe(true);
    });

    it("should initialize with custom initial state", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      expect(result.current.notes).toHaveLength(3);
      expect(result.current.notes[0].content).toBe("First note content");
    });

    it("should initialize with empty array when provided", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      expect(result.current.notes).toHaveLength(0);
    });

    it("should return noteCount matching notes length", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      expect(result.current.noteCount).toBe(3);
    });

    it("should expose maxNotes configuration", () => {
      const { result } = renderHook(() =>
        useNotes({ maxNotes: 10 })
      );

      expect(result.current.maxNotes).toBe(10);
    });

    it("should expose maxNoteLength configuration", () => {
      const { result } = renderHook(() =>
        useNotes({ maxNoteLength: 500 })
      );

      expect(result.current.maxNoteLength).toBe(500);
    });
  });

  // ===========================================================================
  // addNote Tests
  // ===========================================================================

  describe("addNote", () => {
    it("should add note from string content", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote("New note content");
      });

      expect(result.current.notes).toHaveLength(1);
      expect(result.current.notes[0].content).toBe("New note content");
    });

    it("should add note from object", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote({
          content: "Object note content",
          customProp: "custom value",
        });
      });

      expect(result.current.notes).toHaveLength(1);
      expect(result.current.notes[0].content).toBe("Object note content");
      expect(result.current.notes[0].customProp).toBe("custom value");
    });

    it("should add note at the beginning of the list", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.addNote("Newest note");
      });

      expect(result.current.notes[0].content).toBe("Newest note");
    });

    it("should auto-generate id for new notes", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote("Note with auto id");
      });

      expect(result.current.notes[0].id).toBeDefined();
      expect(typeof result.current.notes[0].id).toBe("number");
    });

    it("should set timestamp for new notes", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote("Note with timestamp");
      });

      expect(result.current.notes[0].timestamp).toBeDefined();
    });

    it("should set createdAt for new notes", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote("Note with createdAt");
      });

      expect(result.current.notes[0].createdAt).toBeDefined();
    });

    it("should respect maxNotes limit", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: [], maxNotes: 3 })
      );

      act(() => {
        result.current.addNote("Note 1");
        result.current.addNote("Note 2");
        result.current.addNote("Note 3");
        result.current.addNote("Note 4");
      });

      expect(result.current.notes).toHaveLength(3);
      expect(result.current.notes[0].content).toBe("Note 4");
    });

    it("should return success result on valid note", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      let addResult;
      act(() => {
        addResult = result.current.addNote("Valid note");
      });

      expect(addResult.success).toBe(true);
      expect(addResult.note).toBeDefined();
      expect(addResult.error).toBeNull();
    });

    it("should return error for empty content", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      let addResult;
      act(() => {
        addResult = result.current.addNote("");
      });

      expect(addResult.success).toBe(false);
      expect(addResult.error).toBeTruthy();
    });

    it("should return error for whitespace-only content", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      let addResult;
      act(() => {
        addResult = result.current.addNote("   ");
      });

      expect(addResult.success).toBe(false);
      expect(addResult.error).toContain("empty");
    });

    it("should trim whitespace from content", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote("  Trimmed content  ");
      });

      expect(result.current.notes[0].content).toBe("Trimmed content");
    });

    it("should return error for content exceeding maxNoteLength", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: [], maxNoteLength: 10 })
      );

      let addResult;
      act(() => {
        addResult = result.current.addNote("This is a very long note content");
      });

      expect(addResult.success).toBe(false);
      expect(addResult.error).toContain("maximum length");
    });
  });

  // ===========================================================================
  // deleteNote Tests
  // ===========================================================================

  describe("deleteNote", () => {
    it("should delete note by id", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.deleteNote(1);
      });

      expect(result.current.notes).toHaveLength(2);
      expect(result.current.notes.find((n) => n.id === 1)).toBeUndefined();
    });

    it("should return true when note is deleted", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      let deleted;
      act(() => {
        deleted = result.current.deleteNote(1);
      });

      expect(deleted).toBe(true);
    });

    it("should return false when note is not found", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      let deleted;
      act(() => {
        deleted = result.current.deleteNote(999);
      });

      expect(deleted).toBe(false);
    });

    it("should not affect other notes when deleting one", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.deleteNote(1);
      });

      expect(result.current.notes.find((n) => n.id === 2)).toBeDefined();
      expect(result.current.notes.find((n) => n.id === 3)).toBeDefined();
    });

    it("should update noteCount after deletion", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.deleteNote(1);
      });

      expect(result.current.noteCount).toBe(2);
    });
  });

  // ===========================================================================
  // updateNote Tests
  // ===========================================================================

  describe("updateNote", () => {
    it("should update note content by id", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.updateNote(1, "Updated content");
      });

      const updatedNote = result.current.notes.find((n) => n.id === 1);
      expect(updatedNote.content).toBe("Updated content");
    });

    it("should return success result on valid update", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      let updateResult;
      act(() => {
        updateResult = result.current.updateNote(1, "Updated content");
      });

      expect(updateResult.success).toBe(true);
      expect(updateResult.error).toBeNull();
    });

    it("should return error when note is not found", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      let updateResult;
      act(() => {
        updateResult = result.current.updateNote(999, "New content");
      });

      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toContain("not found");
    });

    it("should return error for empty content", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      let updateResult;
      act(() => {
        updateResult = result.current.updateNote(1, "");
      });

      expect(updateResult.success).toBe(false);
      expect(updateResult.error).toBeTruthy();
    });

    it("should update timestamp on update", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const originalTimestamp = result.current.notes[0].timestamp;

      act(() => {
        result.current.updateNote(1, "Updated content");
      });

      const updatedNote = result.current.notes.find((n) => n.id === 1);
      expect(updatedNote.timestamp).not.toBe(originalTimestamp);
    });

    it("should set updatedAt on update", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.updateNote(1, "Updated content");
      });

      const updatedNote = result.current.notes.find((n) => n.id === 1);
      expect(updatedNote.updatedAt).toBeDefined();
    });

    it("should set edited flag on update", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.updateNote(1, "Updated content");
      });

      const updatedNote = result.current.notes.find((n) => n.id === 1);
      expect(updatedNote.edited).toBe(true);
    });

    it("should trim whitespace from updated content", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.updateNote(1, "  Trimmed update  ");
      });

      const updatedNote = result.current.notes.find((n) => n.id === 1);
      expect(updatedNote.content).toBe("Trimmed update");
    });
  });

  // ===========================================================================
  // clearNotes Tests
  // ===========================================================================

  describe("clearNotes", () => {
    it("should remove all notes", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.clearNotes();
      });

      expect(result.current.notes).toHaveLength(0);
    });

    it("should set noteCount to 0", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.clearNotes();
      });

      expect(result.current.noteCount).toBe(0);
    });
  });

  // ===========================================================================
  // resetNotes Tests
  // ===========================================================================

  describe("resetNotes", () => {
    it("should reset to initial state", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.addNote("New note");
        result.current.resetNotes();
      });

      expect(result.current.notes).toHaveLength(3);
    });

    it("should restore original notes after modifications", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      act(() => {
        result.current.deleteNote(1);
        result.current.deleteNote(2);
        result.current.resetNotes();
      });

      expect(result.current.notes.find((n) => n.id === 1)).toBeDefined();
      expect(result.current.notes.find((n) => n.id === 2)).toBeDefined();
    });
  });

  // ===========================================================================
  // getNoteById Tests
  // ===========================================================================

  describe("getNoteById", () => {
    it("should find note by id", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const note = result.current.getNoteById(1);

      expect(note).toBeDefined();
      expect(note.id).toBe(1);
      expect(note.content).toBe("First note content");
    });

    it("should return undefined for non-existent id", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const note = result.current.getNoteById(999);

      expect(note).toBeUndefined();
    });
  });

  // ===========================================================================
  // searchNotes Tests
  // ===========================================================================

  describe("searchNotes", () => {
    it("should find notes matching search term", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const found = result.current.searchNotes("First");

      expect(found).toHaveLength(1);
      expect(found[0].content).toContain("First");
    });

    it("should be case-insensitive", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const found = result.current.searchNotes("FIRST");

      expect(found).toHaveLength(1);
    });

    it("should return all notes for empty search term", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const found = result.current.searchNotes("");

      expect(found).toHaveLength(3);
    });

    it("should return all notes for whitespace-only search term", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const found = result.current.searchNotes("   ");

      expect(found).toHaveLength(3);
    });

    it("should return empty array when no notes match", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const found = result.current.searchNotes("nonexistent");

      expect(found).toHaveLength(0);
    });

    it("should find partial matches", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const found = result.current.searchNotes("content");

      expect(found).toHaveLength(3);
    });
  });

  // ===========================================================================
  // getSortedNotes Tests
  // ===========================================================================

  describe("getSortedNotes", () => {
    it("should return notes sorted by date (newest first by default)", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const sorted = result.current.getSortedNotes();

      expect(sorted[0].id).toBe(3); // Most recent
      expect(sorted[2].id).toBe(1); // Oldest
    });

    it("should return notes sorted ascending when specified", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const sorted = result.current.getSortedNotes(true);

      expect(sorted[0].id).toBe(1); // Oldest
      expect(sorted[2].id).toBe(3); // Most recent
    });

    it("should not mutate original notes array", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const sorted = result.current.getSortedNotes();

      expect(result.current.notes[0].id).toBe(1);
      expect(sorted[0].id).toBe(3);
    });
  });

  // ===========================================================================
  // validateNote Tests
  // ===========================================================================

  describe("validateNote", () => {
    it("should return valid for valid content", () => {
      const { result } = renderHook(() => useNotes());

      const validation = result.current.validateNote("Valid note content");

      expect(validation.valid).toBe(true);
      expect(validation.error).toBeNull();
    });

    it("should return invalid for empty content", () => {
      const { result } = renderHook(() => useNotes());

      const validation = result.current.validateNote("");

      expect(validation.valid).toBe(false);
      expect(validation.error).toBeTruthy();
    });

    it("should return invalid for null content", () => {
      const { result } = renderHook(() => useNotes());

      const validation = result.current.validateNote(null);

      expect(validation.valid).toBe(false);
    });

    it("should return invalid for undefined content", () => {
      const { result } = renderHook(() => useNotes());

      const validation = result.current.validateNote(undefined);

      expect(validation.valid).toBe(false);
    });

    it("should return invalid for non-string content", () => {
      const { result } = renderHook(() => useNotes());

      const validation = result.current.validateNote(123);

      expect(validation.valid).toBe(false);
    });

    it("should return invalid for content exceeding maxNoteLength", () => {
      const { result } = renderHook(() =>
        useNotes({ maxNoteLength: 10 })
      );

      const validation = result.current.validateNote("This is too long for the limit");

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain("maximum length");
    });
  });

  // ===========================================================================
  // Capacity Tests
  // ===========================================================================

  describe("capacity", () => {
    it("should report isAtLimit correctly", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes, maxNotes: 3 })
      );

      expect(result.current.isAtLimit).toBe(true);
    });

    it("should report isAtLimit as false when under limit", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes, maxNotes: 10 })
      );

      expect(result.current.isAtLimit).toBe(false);
    });

    it("should report correct remainingCapacity", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes, maxNotes: 10 })
      );

      expect(result.current.remainingCapacity).toBe(7);
    });

    it("should report remainingCapacity as 0 when at limit", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: mockNotes, maxNotes: 3 })
      );

      expect(result.current.remainingCapacity).toBe(0);
    });
  });

  // ===========================================================================
  // Callback Stability Tests
  // ===========================================================================

  describe("callback stability", () => {
    it("should maintain stable addNote reference", () => {
      const { result, rerender } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const firstAddNote = result.current.addNote;
      rerender();
      const secondAddNote = result.current.addNote;

      expect(firstAddNote).toBe(secondAddNote);
    });

    it("should maintain stable deleteNote reference", () => {
      const { result, rerender } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const firstDeleteNote = result.current.deleteNote;
      rerender();
      const secondDeleteNote = result.current.deleteNote;

      expect(firstDeleteNote).toBe(secondDeleteNote);
    });

    it("should maintain stable clearNotes reference", () => {
      const { result, rerender } = renderHook(() =>
        useNotes({ initialState: mockNotes })
      );

      const firstClearNotes = result.current.clearNotes;
      rerender();
      const secondClearNotes = result.current.clearNotes;

      expect(firstClearNotes).toBe(secondClearNotes);
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("edge cases", () => {
    it("should handle rapid successive addNote calls", () => {
      const { result } = renderHook(() =>
        useNotes({ initialState: [], maxNotes: 100 })
      );

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addNote(`Note ${i}`);
        }
      });

      expect(result.current.notes).toHaveLength(10);
    });

    it("should handle special characters in content", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote("Note with <script> & special 'chars'");
      });

      expect(result.current.notes[0].content).toBe(
        "Note with <script> & special 'chars'"
      );
    });

    it("should handle unicode characters", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote("Unicode: 你好 🎉 émojis");
      });

      expect(result.current.notes[0].content).toBe("Unicode: 你好 🎉 émojis");
    });

    it("should handle multiline content", () => {
      const { result } = renderHook(() => useNotes({ initialState: [] }));

      act(() => {
        result.current.addNote("Line 1\nLine 2\nLine 3");
      });

      expect(result.current.notes[0].content).toContain("\n");
    });
  });
});

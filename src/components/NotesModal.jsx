import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Eye, Clock, Save, StickyNote } from "lucide-react";
import { fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * NoteItem Component
 * Displays a single note with timestamp and delete option.
 */
const NoteItem = ({ note, onDelete, isDark }) => {
  const cardClasses = isDark
    ? "bg-slate-700/30 border-slate-600"
    : "bg-slate-50 border-slate-200";
  const textClasses = isDark ? "text-slate-200" : "text-slate-700";
  const deleteButtonClasses = isDark
    ? "text-slate-400 hover:text-red-400"
    : "text-slate-500 hover:text-red-500";

  return (
    <motion.div
      className={`p-4 rounded-xl border overflow-hidden ${cardClasses}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={14} />
          <span style={{ fontFamily }}>{note.timestamp}</span>
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className={`p-1 rounded transition-colors cursor-pointer ${deleteButtonClasses}`}
        >
          <X size={14} />
        </button>
      </div>
      <p
        className={`${textClasses} leading-relaxed wrap-break-word`}
        style={{
          fontFamily,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {note.content}
      </p>
    </motion.div>
  );
};

/**
 * AddNoteForm Component
 * Form for adding new notes.
 */
const AddNoteForm = ({ onSave, isDark }) => {
  const [currentNote, setCurrentNote] = useState("");

  const handleSave = () => {
    if (!currentNote.trim()) return;
    onSave(currentNote);
    setCurrentNote("");
  };

  const labelClasses = isDark ? "text-slate-300" : "text-slate-700";
  const inputClasses = isDark
    ? "bg-slate-700/50 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-blue-500"
    : "bg-slate-50 border-slate-300 text-slate-700 placeholder-slate-500 focus:border-blue-500";
  const disabledButtonClasses = isDark
    ? "bg-slate-700 text-slate-500"
    : "bg-slate-200 text-slate-400";

  return (
    <div className="space-y-4">
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${labelClasses}`}
          style={{ fontFamily }}
        >
          Animal Observation Note
        </label>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Enter your animal observation (e.g., behavior, health, feeding notes)..."
          rows={6}
          maxLength={1000}
          className={`w-full p-4 rounded-xl border transition-all duration-200 resize-none ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          style={{
            fontFamily,
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={16} />
          <span style={{ fontFamily }}>{new Date().toLocaleString()}</span>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={!currentNote.trim()}
          className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            currentNote.trim()
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer"
              : `${disabledButtonClasses} cursor-not-allowed`
          }`}
          whileHover={currentNote.trim() ? { scale: 1.05 } : {}}
          whileTap={currentNote.trim() ? { scale: 0.95 } : {}}
          style={{ fontFamily }}
        >
          <Save size={16} />
          Save Note
        </motion.button>
      </div>
    </div>
  );
};

/**
 * NotesList Component
 * Displays a list of notes or empty state.
 */
const NotesList = ({ notes, onDeleteNote, isDark }) => {
  const emptyIconClasses = isDark ? "text-slate-500" : "text-slate-400";
  const emptyTextClasses = isDark ? "text-slate-400" : "text-slate-600";

  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <StickyNote size={32} className={`mx-auto mb-3 ${emptyIconClasses}`} />
        <p className={`text-sm ${emptyTextClasses}`} style={{ fontFamily }}>
          No observations yet. Start documenting animal behavior and health
          notes!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onDelete={onDeleteNote}
            isDark={isDark}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * NotesModal Component
 * Modal for viewing and adding animal observation notes.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {Array} props.notes - Array of note objects
 * @param {function} props.onSaveNote - Callback when a new note is saved
 * @param {function} props.onDeleteNote - Callback when a note is deleted
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const NotesModal = ({
  isOpen,
  onClose,
  notes,
  onSaveNote,
  onDeleteNote,
  darkMode: darkModeOverride,
}) => {
  const [notesMode, setNotesMode] = useState("add");

  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  // Handle save and switch to view mode
  const handleSaveNote = (content) => {
    onSaveNote(content);
    setNotesMode("view");
  };

  // Handle close and reset state
  const handleClose = () => {
    onClose();
  };

  // Theme-based classes
  const modalClasses = isDark
    ? "bg-slate-800/95 border-slate-700"
    : "bg-white/95 border-slate-300";
  const headerBorderClasses = isDark ? "border-slate-700" : "border-slate-200";
  const titleClasses = isDark ? "text-slate-200" : "text-slate-700";
  const closeButtonClasses = isDark
    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200";

  // Mode button classes helper
  const getModeButtonClasses = (mode) => {
    const isActive = notesMode === mode;
    if (isActive) {
      return "bg-blue-600 text-white shadow-lg";
    }
    return isDark
      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className={`${modalClasses} backdrop-blur-md rounded-2xl border shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden`}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 border-b ${headerBorderClasses}`}>
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-xl font-bold ${titleClasses}`}
                  style={{ fontFamily }}
                >
                  Animal Observations
                </h3>
                <button
                  onClick={handleClose}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${closeButtonClasses}`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setNotesMode("add")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 flex items-center gap-2 ${getModeButtonClasses("add")}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily }}
                >
                  <Plus size={16} />
                  Add Note
                </motion.button>
                <motion.button
                  onClick={() => setNotesMode("view")}
                  className={`px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 flex items-center gap-2 ${getModeButtonClasses("view")}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily }}
                >
                  <Eye size={16} />
                  View Notes ({notes.length})
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto custom-scroll">
              {notesMode === "add" ? (
                <AddNoteForm onSave={handleSaveNote} isDark={isDark} />
              ) : (
                <NotesList
                  notes={notes}
                  onDeleteNote={onDeleteNote}
                  isDark={isDark}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotesModal;

import { useState, useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Eye, Clock, Save, StickyNote } from 'lucide-react';
import { fontFamily, modalVariants } from '../constants';
import useThemeSafe from '../hooks/useThemeSafe';

/**
 * NoteItem Component
 * Displays a single note with timestamp and delete option.
 */
const NoteItem = memo(function NoteItem({ note, onDelete, isDark }) {
  const cardClasses = isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200';
  const textClasses = isDark ? 'text-slate-200' : 'text-slate-700';
  const deleteButtonClasses = isDark
    ? 'text-slate-400 hover:text-red-400'
    : 'text-slate-500 hover:text-red-500';

  return (
    <motion.article
      className={`p-4 rounded-xl border overflow-hidden ${cardClasses}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      aria-label={`Note from ${note.timestamp}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={14} aria-hidden="true" />
          <time style={{ fontFamily }}>{note.timestamp}</time>
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className={`p-1 rounded transition-colors cursor-pointer ${deleteButtonClasses}`}
          aria-label={`Delete note from ${note.timestamp}`}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      <p
        className={`${textClasses} leading-relaxed wrap-break-word`}
        style={{
          fontFamily,
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }}
      >
        {note.content}
      </p>
    </motion.article>
  );
});

NoteItem.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

/**
 * AddNoteForm Component
 * Form for adding new notes.
 */
const AddNoteForm = memo(function AddNoteForm({ onSave, isDark }) {
  const [currentNote, setCurrentNote] = useState('');
  const textareaRef = useRef(null);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (!currentNote.trim()) return;
    onSave(currentNote);
    setCurrentNote('');
  };

  const handleKeyDown = (e) => {
    // Cmd/Ctrl + Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && currentNote.trim()) {
      e.preventDefault();
      handleSave();
    }
  };

  const labelClasses = isDark ? 'text-slate-300' : 'text-slate-700';
  const inputClasses = isDark
    ? 'bg-slate-700/50 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-700 placeholder-slate-500 focus:border-blue-500';
  const disabledButtonClasses = isDark
    ? 'bg-slate-700 text-slate-500'
    : 'bg-slate-200 text-slate-400';

  const characterCount = currentNote.length;
  const maxCharacters = 1000;

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="note-textarea"
          className={`block text-sm font-medium mb-2 ${labelClasses}`}
          style={{ fontFamily }}
        >
          Lead Note
        </label>
        <textarea
          ref={textareaRef}
          id="note-textarea"
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your lead note (e.g., follow-up details, client requirements, next steps)..."
          rows={6}
          maxLength={maxCharacters}
          className={`w-full p-4 rounded-xl border transition-all duration-200 resize-none ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          style={{
            fontFamily,
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
          aria-describedby="note-help character-count"
        />
        <div className="flex justify-between items-center mt-2">
          <p id="note-help" className="text-xs text-slate-500" style={{ fontFamily }}>
            Press Cmd/Ctrl + Enter to save
          </p>
          <p
            id="character-count"
            className={`text-xs ${characterCount > maxCharacters * 0.9 ? 'text-amber-500' : 'text-slate-500'}`}
            style={{ fontFamily }}
            aria-live="polite"
          >
            {characterCount}/{maxCharacters}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={16} aria-hidden="true" />
          <span style={{ fontFamily }}>{new Date().toLocaleString()}</span>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={!currentNote.trim()}
          className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            currentNote.trim()
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer'
              : `${disabledButtonClasses} cursor-not-allowed`
          }`}
          whileHover={currentNote.trim() ? { scale: 1.05 } : {}}
          whileTap={currentNote.trim() ? { scale: 0.95 } : {}}
          style={{ fontFamily }}
          aria-disabled={!currentNote.trim()}
        >
          <Save size={16} aria-hidden="true" />
          Save Note
        </motion.button>
      </div>
    </div>
  );
});

AddNoteForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

/**
 * NotesList Component
 * Displays a list of notes or empty state.
 */
const NotesList = memo(function NotesList({ notes, onDeleteNote, isDark }) {
  const emptyIconClasses = isDark ? 'text-slate-500' : 'text-slate-400';
  const emptyTextClasses = isDark ? 'text-slate-400' : 'text-slate-600';

  if (notes.length === 0) {
    return (
      <div className="text-center py-8" role="status" aria-label="No notes available">
        <StickyNote size={32} className={`mx-auto mb-3 ${emptyIconClasses}`} aria-hidden="true" />
        <p className={`text-sm ${emptyTextClasses}`} style={{ fontFamily }}>
          No notes yet. Start documenting lead interactions and follow-up tasks!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="feed" aria-label="Notes list">
      <AnimatePresence mode="popLayout">
        {notes.map((note) => (
          <NoteItem key={note.id} note={note} onDelete={onDeleteNote} isDark={isDark} />
        ))}
      </AnimatePresence>
    </div>
  );
});

NotesList.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

/**
 * NotesModal Component
 * Modal for viewing and adding lead notes and follow-up tasks.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {Array} props.notes - Array of note objects
 * @param {function} props.onSaveNote - Callback when a new note is saved
 * @param {function} props.onDeleteNote - Callback when a note is deleted
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const NotesModal = memo(function NotesModal({
  isOpen,
  onClose,
  notes,
  onSaveNote,
  onDeleteNote,
  darkMode: darkModeOverride,
}) {
  const [notesMode, setNotesMode] = useState('add');
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Focus management and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen, notesMode]);

  // Handle save and switch to view mode
  const handleSaveNote = (content) => {
    onSaveNote(content);
    setNotesMode('view');
  };

  // Theme-based classes
  const modalClasses = isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-300';
  const headerBorderClasses = isDark ? 'border-slate-700' : 'border-slate-200';
  const titleClasses = isDark ? 'text-slate-200' : 'text-slate-700';
  const closeButtonClasses = isDark
    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200';

  // Mode button classes helper
  const getModeButtonClasses = (mode) => {
    const isActive = notesMode === mode;
    if (isActive) {
      return 'bg-blue-600 text-white shadow-lg';
    }
    return isDark
      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            ref={modalRef}
            className={`${modalClasses} backdrop-blur-md rounded-2xl border shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col my-2 sm:my-0`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notes-modal-title"
            aria-describedby="notes-modal-description"
          >
            {/* Header */}
            <div className={`p-4 sm:p-6 border-b shrink-0 ${headerBorderClasses}`}>
              <div className="flex justify-between items-center mb-4">
                <h2
                  id="notes-modal-title"
                  className={`text-xl font-bold ${titleClasses}`}
                  style={{ fontFamily }}
                >
                  Lead Notes
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${closeButtonClasses}`}
                  aria-label="Close modal"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <p id="notes-modal-description" className="sr-only">
                Modal for managing lead notes and follow-up tasks. Use the tabs to add new notes or
                view existing ones.
              </p>

              {/* Mode Toggle Buttons */}
              <div className="flex gap-2" role="tablist" aria-label="Notes view options">
                <motion.button
                  onClick={() => setNotesMode('add')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 flex items-center gap-2 ${getModeButtonClasses('add')}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily }}
                  role="tab"
                  aria-selected={notesMode === 'add'}
                  aria-controls="add-note-panel"
                  id="add-note-tab"
                >
                  <Plus size={16} aria-hidden="true" />
                  Add Note
                </motion.button>
                <motion.button
                  onClick={() => setNotesMode('view')}
                  className={`px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 flex items-center gap-2 ${getModeButtonClasses('view')}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily }}
                  role="tab"
                  aria-selected={notesMode === 'view'}
                  aria-controls="view-notes-panel"
                  id="view-notes-tab"
                >
                  <Eye size={16} aria-hidden="true" />
                  View Notes ({notes.length})
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto custom-scroll min-h-0">
              {notesMode === 'add' ? (
                <div role="tabpanel" id="add-note-panel" aria-labelledby="add-note-tab">
                  <AddNoteForm onSave={handleSaveNote} isDark={isDark} />
                </div>
              ) : (
                <div role="tabpanel" id="view-notes-panel" aria-labelledby="view-notes-tab">
                  <NotesList notes={notes} onDeleteNote={onDeleteNote} isDark={isDark} />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

NotesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSaveNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default NotesModal;

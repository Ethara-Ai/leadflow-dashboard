import { useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { fontFamily, modalVariants } from '../constants';
import useThemeSafe from '../hooks/useThemeSafe';

/**
 * FooterModal Component
 * A reusable modal wrapper for footer content with theme support and accessibility.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const FooterModal = memo(function FooterModal({
  isOpen,
  onClose,
  title,
  children,
  darkMode: darkModeOverride,
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Store the previously focused element and restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  // Generate unique IDs for accessibility
  const titleId = `footer-modal-title-${title?.toLowerCase().replace(/\s+/g, '-') || 'default'}`;
  const descriptionId = `footer-modal-description-${title?.toLowerCase().replace(/\s+/g, '-') || 'default'}`;

  // Theme-based classes
  const modalClasses = isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-300';
  const headerBorderClasses = isDark ? 'border-slate-700' : 'border-slate-200';
  const titleClasses = isDark ? 'text-slate-200' : 'text-slate-700';
  const closeButtonClasses = isDark
    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200';

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
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
          >
            {/* Header */}
            <div className={`p-4 sm:p-6 border-b shrink-0 ${headerBorderClasses}`}>
              <div className="flex justify-between items-center">
                <h2
                  id={titleId}
                  className={`text-xl font-bold ${titleClasses}`}
                  style={{ fontFamily }}
                >
                  {title}
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${closeButtonClasses}`}
                  aria-label={`Close ${title} modal`}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Screen reader description */}
            <p id={descriptionId} className="sr-only">
              {`${title} information modal. Press Escape to close.`}
            </p>

            {/* Content */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto custom-scroll min-h-0">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

FooterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  darkMode: PropTypes.bool,
};

export default FooterModal;

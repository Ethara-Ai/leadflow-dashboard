import { useRef, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import { fontFamily, modalVariants } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";
import AlertItem from "./AlertItem";

/**
 * AlertsModal Component
 * A modal dialog for viewing and managing lead alerts with theme support and accessibility.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {Array} props.alerts - Array of alert objects
 * @param {function} props.onAddAlert - Callback when a new alert is added
 * @param {function} props.onClearAlerts - Callback when all alerts are cleared
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const AlertsModal = memo(function AlertsModal({
  isOpen,
  onClose,
  alerts,
  onAddAlert,
  onClearAlerts,
  darkMode: darkModeOverride,
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const inputRef = useRef(null);
  const previousActiveElement = useRef(null);
  const [newAlert, setNewAlert] = useState("");

  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Store the previously focused element and restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      // Focus the input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
      // Reset input when modal closes
      setNewAlert("");
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  // Handle adding a new alert
  const handleAddAlert = () => {
    if (!newAlert.trim()) return;
    onAddAlert(newAlert);
    setNewAlert("");
  };

  // Handle keyboard submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddAlert();
    }
  };

  // Handle clearing all alerts
  const handleClearAlerts = () => {
    onClearAlerts();
  };

  // Generate unique IDs for accessibility
  const titleId = "alerts-modal-title";
  const descriptionId = "alerts-modal-description";

  // Theme-based classes
  const modalClasses = isDark
    ? "bg-slate-800/95 border-slate-700"
    : "bg-white/95 border-slate-300";
  const headerBorderClasses = isDark ? "border-slate-700" : "border-slate-200";
  const titleClasses = isDark ? "text-slate-200" : "text-slate-700";
  const closeButtonClasses = isDark
    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200";
  const inputClasses = isDark
    ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-blue-500"
    : "bg-slate-50 border-slate-300 text-slate-700 placeholder-slate-500 focus:border-blue-500";
  const buttonClasses = isDark
    ? "text-slate-400 hover:text-slate-200"
    : "text-slate-600 hover:text-slate-800";
  const emptyIconClasses = isDark ? "text-slate-500" : "text-slate-400";
  const emptyTextClasses = isDark ? "text-slate-400" : "text-slate-600";
  const emptySubtextClasses = isDark ? "text-slate-500" : "text-slate-500";
  const disabledButtonClasses = isDark
    ? "bg-slate-700 text-slate-500"
    : "bg-slate-200 text-slate-400";
  const countBadgeClasses =
    alerts.length > 0
      ? isDark
        ? "bg-amber-900/40 text-amber-300"
        : "bg-amber-100 text-amber-700"
      : isDark
        ? "bg-slate-700 text-slate-400"
        : "bg-slate-200 text-slate-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2
 sm:p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            ref={modalRef}
            className={`${modalClasses} backdrop-blur-md rounded-2xl border shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col my-2 sm:my-0`}
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
            <div
              className={`p-4 sm:p-6 border-b shrink-0 ${headerBorderClasses}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h2
                    id={titleId}
                    className={`text-xl font-bold ${titleClasses}`}
                    style={{ fontFamily }}
                  >
                    Lead Alerts
                  </h2>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${countBadgeClasses}`}
                    style={{ fontFamily }}
                  >
                    {alerts.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {alerts.length > 0 && (
                    <button
                      onClick={handleClearAlerts}
                      className={`text-xs font-medium cursor-pointer ${buttonClasses} transition-colors px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700`}
                      style={{ fontFamily }}
                      aria-label="Clear all alerts"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${closeButtonClasses}`}
                    aria-label="Close alerts modal"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Screen reader description */}
            <p id={descriptionId} className="sr-only">
              Lead alerts management modal. You can view, add, and clear alerts.
              Press Escape to close.
            </p>

            {/* Alerts List */}
            <div
              className="flex-1 overflow-y-auto custom-scroll min-h-0 p-4 sm:p-6"
              role="log"
              aria-live="polite"
              aria-label="Alert notifications"
            >
              {alerts.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  <AnimatePresence mode="popLayout">
                    {alerts.map((alert, index) => (
                      <AlertItem key={alert.id} alert={alert} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                  >
                    <Bell
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${emptyIconClasses}`}
                      aria-hidden="true"
                    />
                  </motion.div>
                  <p
                    className={`mt-4 text-sm sm:text-base font-medium ${emptyTextClasses}`}
                    style={{ fontFamily }}
                  >
                    No current alerts
                  </p>
                  <p
                    className={`mt-1 text-xs sm:text-sm ${emptySubtextClasses}`}
                    style={{ fontFamily }}
                  >
                    All leads are being properly managed!
                  </p>
                </div>
              )}
            </div>

            {/* Add Alert Input */}
            <div
              className={`p-4 sm:p-6 border-t shrink-0 ${headerBorderClasses}`}
            >
              <div className="flex gap-2">
                <label htmlFor="new-alert-modal-input" className="sr-only">
                  Add custom alert
                </label>
                <input
                  id="new-alert-modal-input"
                  ref={inputRef}
                  type="text"
                  value={newAlert}
                  onChange={(e) => setNewAlert(e.target.value)}
                  placeholder="Add custom alert..."
                  maxLength={200}
                  className={`flex-1 min-w-0 px-3 py-2.5 text-sm rounded-lg border transition-all duration-200 ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  style={{ fontFamily, textOverflow: "ellipsis" }}
                  onKeyDown={handleKeyDown}
                  aria-describedby="alert-modal-input-hint"
                />
                <span id="alert-modal-input-hint" className="sr-only">
                  Press Enter to add alert
                </span>
                <motion.button
                  onClick={handleAddAlert}
                  disabled={!newAlert.trim()}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors shrink-0 ${
                    newAlert.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      : `${disabledButtonClasses} cursor-not-allowed`
                  }`}
                  whileHover={newAlert.trim() ? { scale: 1.05 } : {}}
                  whileTap={newAlert.trim() ? { scale: 0.95 } : {}}
                  style={{ fontFamily }}
                  aria-disabled={!newAlert.trim()}
                >
                  Add
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AlertsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["info", "warning", "error"]).isRequired,
      time: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onAddAlert: PropTypes.func.isRequired,
  onClearAlerts: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default AlertsModal;

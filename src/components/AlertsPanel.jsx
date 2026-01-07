import { useState, useEffect, useRef, memo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronDown } from "lucide-react";
import { cardVariants, fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";
import AlertItem from "./AlertItem";
import AlertDropdown from "./AlertDropdown";

/**
 * AlertsPanel Component
 * Displays a panel of zoo alerts with a dropdown for managing alerts.
 *
 * @param {Object} props - Component props
 * @param {Array} props.alerts - Array of alert objects
 * @param {function} props.onAddAlert - Callback when a new alert is added
 * @param {function} props.onClearAlerts - Callback when all alerts are cleared
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const AlertsPanel = memo(function AlertsPanel({ alerts, onAddAlert, onClearAlerts, darkMode: darkModeOverride }) {
  const [isAlertDropdownOpen, setIsAlertDropdownOpen] = useState(false);
  const [newAlert, setNewAlert] = useState("");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsAlertDropdownOpen(false);
      }
    };

    if (isAlertDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isAlertDropdownOpen]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isAlertDropdownOpen) {
        setIsAlertDropdownOpen(false);
      }
    };

    if (isAlertDropdownOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAlertDropdownOpen]);

  // Handle adding a new alert
  const handleAddAlert = () => {
    if (!newAlert.trim()) return;
    onAddAlert(newAlert);
    setNewAlert("");
    setIsAlertDropdownOpen(false);
  };

  // Handle clearing all alerts
  const handleClearAlerts = () => {
    onClearAlerts();
    setIsAlertDropdownOpen(false);
  };

  // Handle closing the dropdown
  const handleCloseDropdown = () => {
    setIsAlertDropdownOpen(false);
  };

  // Theme-based classes
  const cardClasses = isDark
    ? "bg-slate-800/80 border-slate-600/50 shadow-2xl shadow-black/50 ring-1 ring-slate-500/10"
    : "bg-white/90 border-slate-200/60 shadow-xl shadow-slate-900/10";
  const titleClasses = isDark ? "text-slate-200" : "text-slate-700";
  const alertButtonClasses =
    alerts.length > 0
      ? isDark
        ? "bg-amber-900/40 text-amber-300 shadow-lg"
        : "bg-amber-100 text-amber-700 shadow-lg"
      : isDark
        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
        : "text-slate-600 hover:text-slate-800 hover:bg-slate-100";
  const emptyIconClasses = isDark ? "text-slate-500" : "text-slate-400";
  const emptyTextClasses = isDark ? "text-slate-400" : "text-slate-600";
  const emptySubtextClasses = isDark ? "text-slate-500" : "text-slate-500";

  return (
    <motion.div
      className={`${cardClasses} backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border transition-all duration-300 hover:shadow-2xl`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      variants={cardVariants}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className={`text-base sm:text-lg md:text-xl font-bold ${titleClasses}`} style={{ fontFamily }}>
          Zoo Alerts
        </h3>

        {/* Alert Dropdown Trigger */}
        <div className="relative">
          <motion.button
            ref={buttonRef}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${alertButtonClasses}`}
            onClick={() => setIsAlertDropdownOpen(!isAlertDropdownOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontFamily }}
            aria-expanded={isAlertDropdownOpen}
            aria-haspopup="true"
            aria-label={`${alerts.length} alerts. Click to manage alerts.`}
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            <span className="font-bold">{alerts.length}</span>
            <ChevronDown
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5 sm:ml-1 transition-transform duration-200 ${
                isAlertDropdownOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </motion.button>

          {/* Alert Dropdown */}
          <AlertDropdown
            isOpen={isAlertDropdownOpen}
            onClose={handleCloseDropdown}
            alerts={alerts}
            newAlert={newAlert}
            onNewAlertChange={setNewAlert}
            onAddAlert={handleAddAlert}
            onClearAlerts={handleClearAlerts}
            dropdownRef={dropdownRef}
          />
        </div>
      </div>

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div
          className="max-h-75 sm:max-h-87.5 overflow-y-auto hidden-scrollbar"
          role="log"
          aria-live="polite"
          aria-label="Alert notifications"
        >
          <div className="space-y-2 sm:space-y-3 md:space-y-4 p-1">
            <AnimatePresence mode="popLayout">
              {alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        // Empty State
        <div
          className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 text-center"
          role="status"
          aria-label="No alerts"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            <Bell className={`w-6 h-6 sm:w-8 sm:h-8 ${emptyIconClasses}`} aria-hidden="true" />
          </motion.div>
          <p className={`mt-3 sm:mt-4 text-sm sm:text-base font-medium ${emptyTextClasses}`} style={{ fontFamily }}>
            No current alerts
          </p>
          <p className={`mt-1 text-xs sm:text-sm ${emptySubtextClasses}`} style={{ fontFamily }}>
            All animals and enclosures are in good condition!
          </p>
        </div>
      )}
    </motion.div>
  );
});

AlertsPanel.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["info", "warning", "error", "success"]),
      time: PropTypes.string,
      dismissed: PropTypes.bool,
    }),
  ).isRequired,
  onAddAlert: PropTypes.func.isRequired,
  onClearAlerts: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default AlertsPanel;

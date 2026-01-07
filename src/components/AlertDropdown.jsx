// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { dropdownVariants, fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * AlertDropdown Component
 * A dropdown panel for viewing alerts and adding new ones.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dropdown is open
 * @param {function} props.onClose - Callback when dropdown is closed
 * @param {Array} props.alerts - Array of alert objects
 * @param {string} props.newAlert - Current value of new alert input
 * @param {function} props.onNewAlertChange - Callback when new alert input changes
 * @param {function} props.onAddAlert - Callback when new alert is submitted
 * @param {function} props.onClearAlerts - Callback when all alerts are cleared
 * @param {React.RefObject} props.dropdownRef - Ref for the dropdown container
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const AlertDropdown = ({
  isOpen,
  onClose,
  alerts,
  newAlert,
  onNewAlertChange,
  onAddAlert,
  onClearAlerts,
  dropdownRef,
  darkMode: darkModeOverride,
}) => {
  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  // Handle add alert submission
  const handleSubmit = () => {
    if (!newAlert.trim()) return;
    onAddAlert();
  };

  // Handle keyboard submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Theme-based classes
  const containerClasses = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-300";
  const headerBorderClasses = isDark ? "border-slate-700" : "border-slate-200";
  const headingClasses = isDark ? "text-slate-200" : "text-slate-700";
  const buttonClasses = isDark
    ? "text-slate-400 hover:text-slate-200"
    : "text-slate-600 hover:text-slate-800";
  const closeButtonClasses = isDark
    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100";
  const inputClasses = isDark
    ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-blue-500"
    : "bg-slate-50 border-slate-300 text-slate-700 placeholder-slate-500 focus:border-blue-500";
  const emptyTextClasses = "text-slate-500";
  const disabledButtonClasses = isDark
    ? "bg-slate-700 text-slate-500"
    : "bg-slate-200 text-slate-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={dropdownRef}
            className={`absolute right-0 mt-2 w-70 sm:w-80 ${containerClasses} rounded-xl border shadow-2xl z-50`}
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
            style={{
              maxHeight: "calc(100vh - 200px)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div className={`p-3 sm:p-4 border-b ${headerBorderClasses}`}>
              <div className="flex justify-between items-center">
                <h4
                  className={`text-sm font-bold ${headingClasses}`}
                  style={{ fontFamily }}
                >
                  Alerts
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClearAlerts}
                    className={`text-xs font-medium cursor-pointer ${buttonClasses} transition-colors`}
                    style={{ fontFamily }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={onClose}
                    className={`p-1 rounded-md cursor-pointer ${closeButtonClasses} transition-colors`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="max-h-64 overflow-y-auto hidden-scrollbar">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <AlertDropdownItem
                    key={alert.id}
                    alert={alert}
                    isDark={isDark}
                  />
                ))
              ) : (
                <div
                  className={`p-6 text-center text-sm ${emptyTextClasses}`}
                  style={{ fontFamily }}
                >
                  No alerts
                </div>
              )}
            </div>

            {/* Add Alert Input */}
            <div className={`p-4 border-t ${headerBorderClasses}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAlert}
                  onChange={(e) => onNewAlertChange(e.target.value)}
                  placeholder="Add custom alert..."
                  maxLength={200}
                  className={`flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  style={{ fontFamily, textOverflow: "ellipsis" }}
                  onKeyDown={handleKeyDown}
                />
                <motion.button
                  onClick={handleSubmit}
                  disabled={!newAlert.trim()}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shrink-0 ${
                    newAlert.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      : `${disabledButtonClasses} cursor-not-allowed`
                  }`}
                  whileHover={newAlert.trim() ? { scale: 1.05 } : {}}
                  whileTap={newAlert.trim() ? { scale: 0.95 } : {}}
                  style={{ fontFamily }}
                >
                  Add
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * AlertDropdownItem Component
 * A single alert item within the dropdown.
 */
const AlertDropdownItem = ({ alert, isDark }) => {
  // Alert type styling
  const getAlertStyles = () => {
    if (alert.type === "warning") {
      return {
        bg: isDark ? "bg-amber-900/20" : "bg-amber-50",
        text: isDark ? "text-amber-300" : "text-amber-700",
      };
    }
    return {
      bg: isDark ? "bg-blue-900/20" : "bg-blue-50",
      text: isDark ? "text-blue-300" : "text-blue-700",
    };
  };

  const styles = getAlertStyles();
  const borderClasses = isDark ? "border-slate-700" : "border-slate-200";
  const timeClasses = isDark ? "text-slate-500" : "text-slate-500";

  return (
    <div className={`p-4 border-b last:border-0 ${borderClasses} ${styles.bg}`}>
      <p
        className={`text-sm font-medium wrap-break-word overflow-hidden ${styles.text}`}
        style={{
          fontFamily,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {alert.message}
      </p>
      <span
        className={`text-xs mt-1 block ${timeClasses}`}
        style={{ fontFamily }}
      >
        {alert.time}
      </span>
    </div>
  );
};

export default AlertDropdown;

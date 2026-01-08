import { memo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { cardVariants, fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";
import AlertItem from "./AlertItem";

/**
 * AlertsPanel Component
 * Displays a panel of lead alerts with a button to open the alerts modal.
 *
 * @param {Object} props - Component props
 * @param {Array} props.alerts - Array of alert objects
 * @param {function} props.onOpenModal - Callback when the alerts button is clicked to open modal
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const AlertsPanel = memo(function AlertsPanel({
  alerts,
  onOpenModal,
  darkMode: darkModeOverride,
}) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

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
        <h3
          className={`text-base sm:text-lg md:text-xl font-bold ${titleClasses}`}
          style={{ fontFamily }}
        >
          Lead Alerts
        </h3>

        {/* Alert Modal Trigger Button */}
        <motion.button
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${alertButtonClasses}`}
          onClick={onOpenModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ fontFamily }}
          aria-label={`${alerts.length} alerts. Click to manage alerts.`}
        >
          <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
          <span className="font-bold">{alerts.length}</span>
        </motion.button>
      </div>

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div
          className="max-h-75 sm:max-h-87.5 overflow-y-auto hidden-scrollbar space-y-3 sm:space-y-4"
          role="log"
          aria-live="polite"
          aria-label="Alert notifications"
        >
          <AnimatePresence mode="popLayout">
            {alerts.map((alert, index) => (
              <AlertItem key={alert.id} alert={alert} index={index} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16">
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
              className={`w-6 h-6 sm:w-8 sm:h-8 ${emptyIconClasses}`}
              aria-hidden="true"
            />
          </motion.div>
          <p
            className={`mt-3 sm:mt-4 text-sm sm:text-base font-medium ${emptyTextClasses}`}
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
    </motion.div>
  );
});

AlertsPanel.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["info", "warning", "error"]).isRequired,
      time: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onOpenModal: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default AlertsPanel;

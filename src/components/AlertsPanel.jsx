import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus } from 'lucide-react';
import { cardVariants, fontFamily } from '../constants';
import useThemeSafe from '../hooks/useThemeSafe';
import AlertItem from './AlertItem';

/**
 * AlertsPanel Component
 * Displays a panel of lead alerts with a button to open the alerts modal.
 *
 * @param {Object} props - Component props
 * @param {Array} props.alerts - Array of alert objects
 * @param {function} props.onAddAlert - Callback when the add alert button is clicked to open modal
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const AlertsPanel = memo(function AlertsPanel({ alerts, onAddAlert, darkMode: darkModeOverride }) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Theme-based classes
  const cardClasses = isDark
    ? 'bg-zinc-900/90 border-zinc-700/50 shadow-2xl shadow-black/60 ring-1 ring-zinc-600/10'
    : 'bg-white/90 border-slate-200/60 shadow-xl shadow-slate-900/10';
  const titleClasses = isDark ? 'text-zinc-200' : 'text-slate-700';
  const countBadgeClasses =
    alerts.length > 0
      ? isDark
        ? 'bg-zinc-800/60 text-amber-400'
        : 'bg-slate-100 text-amber-600'
      : isDark
        ? 'bg-zinc-800/40 text-zinc-500'
        : 'bg-slate-100 text-slate-400';
  const addButtonClasses = isDark
    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50';
  const emptyIconClasses = isDark ? 'text-zinc-500' : 'text-slate-400';
  const emptyTextClasses = isDark ? 'text-zinc-400' : 'text-slate-600';
  const emptySubtextClasses = isDark ? 'text-zinc-500' : 'text-slate-500';

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

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Alert Count Badge (static display) */}
          <span
            className={`inline-flex items-center justify-center min-w-6 sm:min-w-7 px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold tabular-nums ${countBadgeClasses}`}
            style={{ fontFamily }}
            aria-label={`${alerts.length} alerts`}
          >
            {alerts.length}
          </span>

          {/* Add Alert Button */}
          <motion.button
            className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 cursor-pointer ${addButtonClasses}`}
            onClick={onAddAlert}
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Add custom alert"
          >
            <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.5} aria-hidden="true" />
          </motion.button>
        </div>
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
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <Bell className={`w-6 h-6 sm:w-8 sm:h-8 ${emptyIconClasses}`} aria-hidden="true" />
          </motion.div>
          <p
            className={`mt-3 sm:mt-4 text-sm sm:text-base font-medium ${emptyTextClasses}`}
            style={{ fontFamily }}
          >
            No current alerts
          </p>
          <p className={`mt-1 text-xs sm:text-sm ${emptySubtextClasses}`} style={{ fontFamily }}>
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
      type: PropTypes.oneOf(['info', 'warning', 'error', 'success']).isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddAlert: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default AlertsPanel;

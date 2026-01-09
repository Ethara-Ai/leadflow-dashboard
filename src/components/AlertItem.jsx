import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ShieldAlert, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { fontFamily } from '../constants';
import useThemeSafe from '../hooks/useThemeSafe';

/**
 * Alert type configurations for styling
 */
const ALERT_TYPES = {
  warning: {
    icon: ShieldAlert,
    darkBg: 'bg-amber-900/20 border-amber-800/30',
    lightBg: 'bg-amber-50 border-amber-200',
    darkIcon: 'text-amber-400',
    lightIcon: 'text-amber-600',
  },
  info: {
    icon: Info,
    darkBg: 'bg-blue-900/20 border-blue-800/30',
    lightBg: 'bg-blue-50 border-blue-200',
    darkIcon: 'text-blue-400',
    lightIcon: 'text-blue-600',
  },
  error: {
    icon: AlertCircle,
    darkBg: 'bg-red-900/20 border-red-800/30',
    lightBg: 'bg-red-50 border-red-200',
    darkIcon: 'text-red-400',
    lightIcon: 'text-red-600',
  },
  success: {
    icon: CheckCircle,
    darkBg: 'bg-emerald-900/20 border-emerald-800/30',
    lightBg: 'bg-emerald-50 border-emerald-200',
    darkIcon: 'text-emerald-400',
    lightIcon: 'text-emerald-600',
  },
};

/**
 * AlertItem Component
 * Displays a single alert with icon, message, and timestamp.
 *
 * @param {Object} props - Component props
 * @param {Object} props.alert - Alert object containing id, message, type, and time
 * @param {string} props.alert.id - Unique identifier for the alert
 * @param {string} props.alert.message - Alert message content
 * @param {string} props.alert.type - Alert type ("warning" | "info" | "error" | "success")
 * @param {string} props.alert.time - Timestamp string
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const AlertItem = memo(function AlertItem({ alert, darkMode: darkModeOverride }) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Get alert type configuration, default to info if type not found
  const alertConfig = ALERT_TYPES[alert.type] || ALERT_TYPES.info;
  const IconComponent = alertConfig.icon;

  // Theme-based classes
  const bgClasses = isDark ? alertConfig.darkBg : alertConfig.lightBg;
  const iconClasses = isDark ? alertConfig.darkIcon : alertConfig.lightIcon;
  const textClasses = isDark ? 'text-slate-200' : 'text-slate-700';
  const timeClasses = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <motion.article
      className={`p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border ${bgClasses}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      role="alert"
      aria-label={`${alert.type} alert: ${alert.message}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <IconComponent
          className={`w-5 h-5 sm:w-5 sm:h-5 shrink-0 mt-0.5 ${iconClasses}`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0 overflow-hidden">
          <p
            className={`text-xs sm:text-sm font-medium leading-snug wrap-break-word ${textClasses}`}
            style={{
              fontFamily,
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            }}
          >
            {alert.message}
          </p>
          <time
            className={`text-[11px] sm:text-xs mt-1.5 sm:mt-2 block ${timeClasses}`}
            style={{ fontFamily }}
            dateTime={alert.timestamp}
          >
            {alert.time}
          </time>
        </div>
      </div>
    </motion.article>
  );
});

AlertItem.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['warning', 'info', 'error', 'success']),
    time: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
    dismissed: PropTypes.bool,
  }).isRequired,
  darkMode: PropTypes.bool,
};

export default AlertItem;

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ShieldAlert, Info } from "lucide-react";
import { fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * Alert type configurations for styling
 */
const ALERT_TYPES = {
  warning: {
    icon: ShieldAlert,
    darkBg: "bg-amber-900/20 border-amber-800/30",
    lightBg: "bg-amber-50 border-amber-200",
    darkIcon: "text-amber-400",
    lightIcon: "text-amber-600",
  },
  info: {
    icon: Info,
    darkBg: "bg-blue-900/20 border-blue-800/30",
    lightBg: "bg-blue-50 border-blue-200",
    darkIcon: "text-blue-400",
    lightIcon: "text-blue-600",
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
 * @param {string} props.alert.type - Alert type ("warning" | "info")
 * @param {string} props.alert.time - Timestamp string
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const AlertItem = ({ alert, darkMode: darkModeOverride }) => {
  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  // Get alert type configuration, default to info if type not found
  const alertConfig = ALERT_TYPES[alert.type] || ALERT_TYPES.info;
  const IconComponent = alertConfig.icon;

  // Theme-based classes
  const bgClasses = isDark ? alertConfig.darkBg : alertConfig.lightBg;
  const iconClasses = isDark ? alertConfig.darkIcon : alertConfig.lightIcon;
  const textClasses = isDark ? "text-slate-200" : "text-slate-700";
  const timeClasses = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <motion.div
      className={`p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border ${bgClasses}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <IconComponent
          className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 mt-0.5 ${iconClasses}`}
        />
        <div className="flex-1 min-w-0 overflow-hidden">
          <p
            className={`text-xs sm:text-sm font-medium leading-snug wrap-break-word ${textClasses}`}
            style={{
              fontFamily,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {alert.message}
          </p>
          <p
            className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${timeClasses}`}
            style={{ fontFamily }}
          >
            {alert.time}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertItem;

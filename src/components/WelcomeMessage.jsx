// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * WelcomeMessage Component
 * Displays a dismissible welcome banner with theme support.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the message
 * @param {function} props.onClose - Callback when message is dismissed
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const WelcomeMessage = ({ show, onClose, darkMode: darkModeOverride }) => {
  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  if (!show) return null;

  return (
    <motion.div
      className={`mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border ${
        isDark
          ? "bg-emerald-900/20 border-emerald-800/30"
          : "bg-emerald-50 border-emerald-200"
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-start sm:items-center flex-1 min-w-0">
          <div
            className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl shrink-0 ${
              isDark ? "bg-emerald-800/30" : "bg-emerald-100"
            } mr-2 sm:mr-3 md:mr-4`}
          >
            <Info
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={`text-sm sm:text-base md:text-lg font-bold leading-tight ${
                isDark ? "text-slate-200" : "text-slate-700"
              }`}
              style={{ fontFamily }}
            >
              Welcome back, Zoolab Staff!
            </h3>
            <p
              className={`text-xs sm:text-sm mt-0.5 sm:mt-1 leading-snug ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
              style={{ fontFamily }}
            >
              Here's the current status of your zoo and animal enclosures
            </p>
          </div>
        </div>
        <motion.button
          onClick={onClose}
          className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-colors cursor-pointer shrink-0 ${
            isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;

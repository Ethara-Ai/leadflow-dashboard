// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * Default time periods if none provided
 */
const DEFAULT_PERIODS = ["week", "month", "year"];

/**
 * Format period label for display
 * @param {string} period - The period string
 * @returns {string} - Formatted label with first letter capitalized
 */
const formatPeriodLabel = (period) => {
  return period.charAt(0).toUpperCase() + period.slice(1);
};

/**
 * TimePeriodButtons Component
 * A reusable button group for selecting time periods with theme support.
 *
 * @param {Object} props - Component props
 * @param {string} props.currentPeriod - Currently selected period
 * @param {function} props.onPeriodChange - Callback when period changes
 * @param {Array<string>} [props.periods] - Available periods (default: ["week", "month", "year"])
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const TimePeriodButtons = ({
  currentPeriod,
  onPeriodChange,
  periods = DEFAULT_PERIODS,
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

  return (
    <div className="flex space-x-2 w-full sm:w-auto">
      {periods.map((period) => (
        <motion.button
          key={period}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 flex-1 sm:flex-none cursor-pointer ${
            currentPeriod === period
              ? "bg-blue-600 text-white shadow-lg"
              : isDark
                ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          }`}
          onClick={() => onPeriodChange(period)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ fontFamily }}
        >
          {formatPeriodLabel(period)}
        </motion.button>
      ))}
    </div>
  );
};

export default TimePeriodButtons;

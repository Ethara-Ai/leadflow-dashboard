// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * ErrorMessage Component
 * Displays an error alert banner with theme support.
 *
 * @param {Object} props - Component props
 * @param {string} props.error - Error message to display (null/undefined hides component)
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const ErrorMessage = ({ error, darkMode: darkModeOverride }) => {
  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  if (!error) return null;

  return (
    <motion.div
      className={`mb-6 p-4 rounded-xl border ${
        isDark ? "bg-red-900/20 border-red-800/30" : "bg-red-50 border-red-200"
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p
        className={`text-sm font-medium flex items-center ${
          isDark ? "text-red-400" : "text-red-600"
        }`}
        style={{ fontFamily }}
      >
        <ShieldAlert size={16} className="mr-2" />
        {error}
      </p>
    </motion.div>
  );
};

export default ErrorMessage;

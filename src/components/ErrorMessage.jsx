import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";

/**
 * ErrorMessage Component
 * Displays an error alert banner with theme support.
 *
 * @param {Object} props - Component props
 * @param {string} props.error - Error message to display (null/undefined hides component)
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const ErrorMessage = memo(function ErrorMessage({ error, darkMode: darkModeOverride }) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  if (!error) return null;

  return (
    <motion.div
      className={`mb-6 p-4 rounded-xl border ${
        isDark ? "bg-red-900/20 border-red-800/30" : "bg-red-50 border-red-200"
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="alert"
      aria-live="assertive"
    >
      <p
        className={`text-sm font-medium flex items-center ${isDark ? "text-red-400" : "text-red-600"}`}
        style={{ fontFamily }}
      >
        <ShieldAlert size={16} className="mr-2 shrink-0" aria-hidden="true" />
        <span>{error}</span>
      </p>
    </motion.div>
  );
});

ErrorMessage.propTypes = {
  error: PropTypes.string,
  darkMode: PropTypes.bool,
};

export default ErrorMessage;

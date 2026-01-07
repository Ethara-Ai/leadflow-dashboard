import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { cardVariants as defaultCardVariants, fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";

/**
 * Variant color mappings for subValue display
 * Separates presentation from business logic
 */
const SUB_VALUE_VARIANT_CLASSES = {
  positive: "text-emerald-500",
  negative: "text-rose-500",
  warning: "text-amber-500",
  neutral: "text-slate-500",
};

/**
 * StatCard Component
 * A reusable card for displaying statistics with an icon, value, and sub-information.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main display value
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {string} [props.subValue] - Secondary value (e.g., "+8", "-3%")
 * @param {string} [props.subText] - Descriptive text for sub value
 * @param {string} props.accent - CSS classes for icon container styling
 * @param {"positive"|"negative"|"warning"|"neutral"} [props.subValueVariant="neutral"] - Color variant for subValue
 * @param {Object} [props.variants] - Framer Motion animation variants (injectable for testing)
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const StatCard = memo(function StatCard({
  title,
  value,
  icon,
  subValue,
  subText,
  accent,
  subValueVariant = "neutral",
  variants = defaultCardVariants,
  darkMode: darkModeOverride,
}) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Get the appropriate color class for subValue
  const subValueColorClass = SUB_VALUE_VARIANT_CLASSES[subValueVariant] || SUB_VALUE_VARIANT_CLASSES.neutral;

  return (
    <motion.div
      className={`${
        isDark
          ? "bg-slate-800/80 border-slate-600/50 shadow-2xl shadow-black/50 ring-1 ring-slate-500/10"
          : "bg-white/90 border-slate-200/60 shadow-xl shadow-slate-900/10"
      } backdrop-blur-lg rounded-2xl p-4 sm:p-6 border transition-all duration-300 hover:shadow-2xl`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      variants={variants}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0 pr-3">
          <h3
            className={`text-sm sm:text-lg font-bold ${isDark ? "text-slate-200" : "text-slate-700"} truncate`}
            style={{ fontFamily }}
          >
            {title}
          </h3>
        </div>
        <div className={`${accent} p-2 sm:p-3 rounded-xl shadow-lg shrink-0`} aria-hidden="true">
          {icon}
        </div>
      </div>

      <div className="flex flex-col">
        <p
          className={`text-xl sm:text-4xl font-bold ${isDark ? "text-slate-100" : "text-slate-800"} wrap-break-word`}
          style={{ fontFamily }}
        >
          {value}
        </p>
        <div className="mt-2 sm:mt-3 flex items-center flex-wrap">
          {subValue && (
            <span className={`text-xs sm:text-sm font-bold ${subValueColorClass} mr-1 sm:mr-2`} style={{ fontFamily }}>
              {subValue}
            </span>
          )}
          <span className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`} style={{ fontFamily }}>
            {subText}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  subValue: PropTypes.string,
  subText: PropTypes.string,
  accent: PropTypes.string.isRequired,
  subValueVariant: PropTypes.oneOf(["positive", "negative", "warning", "neutral"]),
  variants: PropTypes.object,
  darkMode: PropTypes.bool,
};

export default StatCard;

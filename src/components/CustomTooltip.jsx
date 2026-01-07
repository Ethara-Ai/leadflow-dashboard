import { memo } from "react";
import PropTypes from "prop-types";
import { fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";

/**
 * Format value based on data type
 * Extracts business logic from presentation
 * @param {any} value - The value to format
 * @param {string} dataKey - The data key identifier
 * @returns {string} - Formatted value string
 */
const formatTooltipValue = (value, dataKey) => {
  if (typeof value === "number" && dataKey === "value") {
    return `${value}%`;
  }
  return String(value);
};

/**
 * CustomTooltip Component
 * A reusable tooltip for Recharts components with theme support.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether the tooltip is active
 * @param {Array} props.payload - Data payload from the chart
 * @param {string} [props.label] - Label for the tooltip
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const CustomTooltip = memo(function CustomTooltip({ active, payload, label, darkMode: darkModeOverride }) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className={`${
        isDark ? "bg-slate-800/95 border-slate-700" : "bg-white/95 border-slate-300"
      } backdrop-blur-md rounded-lg p-2 sm:p-4 border shadow-xl max-w-37.5 sm:max-w-50 wrap-break-word`}
      style={{
        pointerEvents: "none",
      }}
      role="tooltip"
      aria-live="polite"
    >
      {label && (
        <p
          className={`font-bold mb-1 sm:mb-2 text-xs sm:text-sm truncate ${
            isDark ? "text-slate-200" : "text-slate-700"
          }`}
          style={{ fontFamily }}
        >
          {label}
        </p>
      )}
      {payload.map((entry, index) => (
        <p
          key={index}
          className="text-xs sm:text-sm font-medium leading-tight"
          style={{ color: entry.color, fontFamily }}
        >
          <span className="font-semibold">{entry.name}: </span>
          <span className="whitespace-nowrap">{formatTooltipValue(entry.value, entry.dataKey)}</span>
        </p>
      ))}
    </div>
  );
});

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      color: PropTypes.string,
      dataKey: PropTypes.string,
    }),
  ),
  label: PropTypes.string,
  darkMode: PropTypes.bool,
};

export default CustomTooltip;

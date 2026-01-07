import { memo } from "react";
import PropTypes from "prop-types";
import { fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";

/**
 * ChartLegend Component
 * A reusable legend renderer for Recharts components with theme support.
 *
 * @param {Object} props - Component props
 * @param {Array} props.payload - Legend payload from Recharts
 */
export const ChartLegend = memo(function ChartLegend({ payload }) {
  // Use safe theme hook
  const { isDark } = useThemeSafe();

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2 px-2" role="list" aria-label="Chart legend">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5 sm:gap-2" role="listitem">
          <div
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span
            className={`text-xs sm:text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}
            style={{ fontFamily }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
});

ChartLegend.propTypes = {
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      color: PropTypes.string,
    }),
  ),
};

/**
 * XAxisTick Component
 * A reusable X-axis tick renderer for Recharts components with theme support.
 *
 * @param {Object} props - Component props
 * @param {number} props.x - X coordinate
 * @param {number} props.y - Y coordinate
 * @param {Object} props.payload - Tick payload from Recharts
 */
export const XAxisTick = memo(function XAxisTick({ x, y, payload }) {
  // Use safe theme hook
  const { isDark } = useThemeSafe();

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="middle"
        fill={isDark ? "#94a3b8" : "#475569"}
        fontSize={10}
        fontWeight="500"
        fontFamily={fontFamily}
        aria-label={payload.value}
      >
        {payload.value}
      </text>
    </g>
  );
});

XAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default { ChartLegend, XAxisTick };

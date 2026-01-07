import { fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * ChartLegend Component
 * A reusable legend renderer for Recharts components with theme support.
 *
 * @param {Object} props - Component props
 * @param {Array} props.payload - Legend payload from Recharts
 */
export const ChartLegend = ({ payload }) => {
  // Use theme context
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = theme.isDark;
  } catch {
    isDark = false;
  }

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2 px-2">
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className="flex items-center gap-1.5 sm:gap-2"
        >
          <div
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span
            className={`text-xs sm:text-sm font-medium ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
            style={{ fontFamily }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
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
export const XAxisTick = ({ x, y, payload }) => {
  // Use theme context
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = theme.isDark;
  } catch {
    isDark = false;
  }

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
      >
        {payload.value}
      </text>
    </g>
  );
};

export default { ChartLegend, XAxisTick };

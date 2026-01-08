import { memo, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { cardVariants, fontFamily, getColors } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";
import CustomTooltip from "./CustomTooltip";
import TimePeriodButtons from "./TimePeriodButtons";
import { getChartCardClasses, getChartTitleClasses } from "../chartUtils";

/**
 * LeadSourceChart Component
 * Displays lead source distribution data as a pie chart with responsive design.
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 * @param {string} props.timePeriod - Currently selected time period
 * @param {function} props.setTimePeriod - Callback when time period changes
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const LeadSourceChart = memo(function LeadSourceChart({ data, timePeriod, setTimePeriod, darkMode: darkModeOverride }) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  const COLORS = getColors(isDark);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Get theme-based styles
  const cardClasses = getChartCardClasses(isDark);
  const titleClasses = getChartTitleClasses(isDark);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Custom tooltip position handler to keep tooltip within bounds on small screens
  const handleMouseMove = useCallback(
    (state) => {
      if (state && state.activeCoordinate && isSmallScreen) {
        const { x, y } = state.activeCoordinate;
        // Constrain tooltip position for small screens
        const constrainedX = Math.max(60, Math.min(x, 180));
        const constrainedY = Math.max(20, Math.min(y, 140));
        setTooltipPosition({ x: constrainedX, y: constrainedY });
      }
    },
    [isSmallScreen],
  );

  return (
    <motion.div
      className={`${cardClasses} backdrop-blur-lg rounded-2xl p-4 sm:p-6 border transition-all duration-300 hover:shadow-2xl overflow-hidden`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      variants={cardVariants}
    >
      {/* Header - Title first, then time period below */}
      <div className="flex flex-col items-center mb-3">
        <h3 className={`text-lg sm:text-xl font-bold ${titleClasses} mb-2`} style={{ fontFamily }}>
          Lead Source Distribution
        </h3>
        <TimePeriodButtons currentPeriod={timePeriod} onPeriodChange={setTimePeriod} />
      </div>

      {/* Pie Chart - Centered without external labels */}
      <div
        className={`${isSmallScreen ? "h-40" : "h-48"} relative ${isDark ? "text-slate-300" : "text-slate-600"}`}
        role="img"
        aria-label="Lead source distribution pie chart showing lead source percentages"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            key={`lead-source-chart-${timePeriod}`}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            onMouseMove={handleMouseMove}
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isSmallScreen ? 35 : 50}
              outerRadius={isSmallScreen ? 60 : 80}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              label={false}
              style={{ fontSize: "12px", fontFamily }}
              animationBegin={0}
              animationDuration={300}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="cursor-pointer"
                  style={{ outline: "none" }}
                />
              ))}
            </Pie>
            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              wrapperStyle={{
                zIndex: 50,
                pointerEvents: "none",
                visibility: "visible",
              }}
              allowEscapeViewBox={{ x: false, y: false }}
              position={isSmallScreen ? tooltipPosition : undefined}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend - Always visible with complete names and percentages */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2" role="list" aria-label="Lead source distribution legend">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 min-w-0" role="listitem">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              aria-hidden="true"
            />
            <span className={`text-xs flex-1 ${isDark ? "text-slate-300" : "text-slate-600"}`} style={{ fontFamily }}>
              {entry.name}
            </span>
            <span
              className={`text-xs font-semibold shrink-0 ${isDark ? "text-slate-200" : "text-slate-700"}`}
              style={{ fontFamily }}
            >
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

LeadSourceChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  timePeriod: PropTypes.oneOf(["week", "month", "year"]).isRequired,
  setTimePeriod: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default LeadSourceChart;

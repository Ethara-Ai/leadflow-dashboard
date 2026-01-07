// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { cardVariants, fontFamily, getColors } from "../constants";
import useTheme from "../hooks/useTheme";
import CustomTooltip from "./CustomTooltip";
import TimePeriodButtons from "./TimePeriodButtons";
import { getChartCardClasses, getChartTitleClasses } from "../chartUtils";

const RADIAN = Math.PI / 180;

/**
 * Custom label renderer for pie chart (used on larger screens)
 * @param {Object} props - Label props from Recharts
 * @returns {JSX.Element} - SVG text element
 */
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  percent,
}) => {
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Determine text anchor based on position
  const textAnchor = x > cx ? "start" : "end";

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor={textAnchor}
      dominantBaseline="central"
      style={{
        fontSize: "12px",
        fontFamily,
        fontWeight: 500,
      }}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/**
 * FoodDistributionChart Component
 * Displays diet distribution data as a pie chart with responsive design.
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 * @param {string} props.timePeriod - Currently selected time period
 * @param {function} props.setTimePeriod - Callback when time period changes
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const FoodDistributionChart = ({
  data,
  timePeriod,
  setTimePeriod,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3
          className={`text-lg sm:text-xl font-bold ${titleClasses}`}
          style={{ fontFamily }}
        >
          Diet Distribution
        </h3>
        <TimePeriodButtons
          currentPeriod={timePeriod}
          onPeriodChange={setTimePeriod}
        />
      </div>

      {/* Pie Chart - Original size for larger screens, compact for small screens */}
      <div
        className={`${isSmallScreen ? "h-45" : "h-75"} relative ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            key={`diet-chart-${timePeriod}`}
            margin={
              isSmallScreen
                ? { top: 5, right: 5, bottom: 5, left: 5 }
                : { top: 20, right: 20, bottom: 20, left: 20 }
            }
            onMouseMove={handleMouseMove}
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isSmallScreen ? 30 : 40}
              outerRadius={isSmallScreen ? 55 : 70}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              label={isSmallScreen ? false : renderCustomizedLabel}
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

      {/* Legend - Only visible on small screens for clear food source names */}
      {isSmallScreen && (
        <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span
                className={`text-[10px] truncate flex-1 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
                style={{ fontFamily }}
                title={entry.name}
              >
                {entry.name}
              </span>
              <span
                className={`text-[10px] font-semibold shrink-0 ${
                  isDark ? "text-slate-200" : "text-slate-700"
                }`}
                style={{ fontFamily }}
              >
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FoodDistributionChart;

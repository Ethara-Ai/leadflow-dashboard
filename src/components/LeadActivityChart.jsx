import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, Bar } from "recharts";
import { cardVariants, fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";
import CustomTooltip from "./CustomTooltip";
import TimePeriodButtons from "./TimePeriodButtons";
import { ChartLegend, XAxisTick } from "./ChartComponents";
import {
  getAxisStyles,
  getGridStyles,
  getTooltipCursorStyles,
  getChartCardClasses,
  getChartTitleClasses,
  getDotStyles,
  getActiveDotStyles,
} from "../chartUtils";

/**
 * LeadActivityChart Component
 * Displays lead activity data as a composed chart with area and bar elements.
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 * @param {string} props.timePeriod - Currently selected time period
 * @param {function} props.setTimePeriod - Callback when time period changes
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const LeadActivityChart = memo(function LeadActivityChart({
  data,
  timePeriod,
  setTimePeriod,
  darkMode: darkModeOverride,
}) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Memoize theme-based styles to prevent recreation on every render
  const axisStyles = useMemo(() => getAxisStyles(isDark), [isDark]);
  const gridStyles = useMemo(() => getGridStyles(isDark), [isDark]);
  const cursorStyles = useMemo(() => getTooltipCursorStyles(isDark), [isDark]);
  const cardClasses = useMemo(() => getChartCardClasses(isDark), [isDark]);
  const titleClasses = useMemo(() => getChartTitleClasses(isDark), [isDark]);

  // Memoize chart colors based on theme
  const primaryColor = useMemo(() => (isDark ? "#60a5fa" : "#2563eb"), [isDark]);
  const secondaryColor = useMemo(() => (isDark ? "#34d399" : "#059669"), [isDark]);

  // Memoize dot styles
  const dotStyles = useMemo(() => getDotStyles(isDark, primaryColor), [isDark, primaryColor]);
  const activeDotStyles = useMemo(() => getActiveDotStyles(isDark, primaryColor), [isDark, primaryColor]);

  // Memoize legend wrapper style
  const legendWrapperStyle = useMemo(() => ({ paddingTop: "10px" }), []);

  // Memoize chart margins
  const chartMargins = useMemo(
    () => ({
      top: 10,
      right: 10,
      left: 0,
      bottom: 25,
    }),
    [],
  );

  // Calculate bar size based on time period
  const barSize = timePeriod === "year" ? 6 : 10;

  return (
    <motion.div
      className={`${cardClasses} backdrop-blur-lg rounded-2xl p-3 sm:p-4 md:p-6 border transition-all duration-300 hover:shadow-2xl`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      variants={cardVariants}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3 className={`text-base sm:text-lg md:text-xl font-bold ${titleClasses}`} style={{ fontFamily }}>
          Lead Activity
        </h3>
        <TimePeriodButtons currentPeriod={timePeriod} onPeriodChange={setTimePeriod} />
      </div>

      {/* Chart Container */}
      <div
        className="w-full h-55 sm:h-65 md:h-75"
        role="img"
        aria-label="Lead activity chart showing active leads and calls completed"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={chartMargins}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={secondaryColor} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyles} />
            <XAxis
              dataKey="name"
              stroke={axisStyles.stroke}
              tick={(props) => <XAxisTick {...props} />}
              tickLine={axisStyles.tickLine}
              axisLine={axisStyles.axisLine}
              interval={0}
              height={40}
            />
            <YAxis
              stroke={axisStyles.stroke}
              fontSize={10}
              fontWeight="500"
              fontFamily={fontFamily}
              tick={axisStyles.tick}
              tickMargin={5}
              width={40}
              axisLine={axisStyles.axisLine}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} />} cursor={cursorStyles} />
            <Legend content={(props) => <ChartLegend {...props} />} wrapperStyle={legendWrapperStyle} />
            <Area
              type="monotone"
              dataKey="leads"
              name="Active Leads"
              fill="url(#colorLeads)"
              stroke={primaryColor}
              strokeWidth={2}
              dot={dotStyles}
              activeDot={activeDotStyles}
            />
            <Bar
              dataKey="callsCompleted"
              name="Calls Completed"
              fill={secondaryColor}
              barSize={barSize}
              radius={[3, 3, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

LeadActivityChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      leads: PropTypes.number.isRequired,
      callsCompleted: PropTypes.number.isRequired,
    }),
  ).isRequired,
  timePeriod: PropTypes.oneOf(["week", "month", "year"]).isRequired,
  setTimePeriod: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default LeadActivityChart;

import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { cardVariants, fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";
import { formatEfficiency } from "../utils";
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
 * FeedingEfficiencyChart Component
 * Displays feeding efficiency data as a line chart.
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 * @param {string} props.timePeriod - Currently selected time period
 * @param {function} props.setTimePeriod - Callback when time period changes
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const FeedingEfficiencyChart = memo(function FeedingEfficiencyChart({
  data,
  timePeriod,
  setTimePeriod,
  darkMode: darkModeOverride,
}) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Get theme-based styles
  const axisStyles = getAxisStyles(isDark);
  const gridStyles = getGridStyles(isDark);
  const cursorStyles = getTooltipCursorStyles(isDark);
  const cardClasses = getChartCardClasses(isDark);
  const titleClasses = getChartTitleClasses(isDark);

  // Chart colors based on theme
  const lineColor = isDark ? "#fbbf24" : "#d97706";

  return (
    <motion.div
      className={`${cardClasses} backdrop-blur-lg rounded-2xl p-3 sm:p-4 md:p-6 border transition-all duration-300 hover:shadow-2xl`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      variants={cardVariants}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3 className={`text-base sm:text-lg md:text-xl font-bold ${titleClasses}`} style={{ fontFamily }}>
          Feeding Efficiency
        </h3>
        <TimePeriodButtons currentPeriod={timePeriod} onPeriodChange={setTimePeriod} />
      </div>

      {/* Chart Container */}
      <div
        className="w-full h-55 sm:h-65 md:h-75"
        role="img"
        aria-label="Feeding efficiency line chart showing feeding rate percentage over time"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 25,
            }}
          >
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
              tickFormatter={formatEfficiency}
              fontSize={10}
              fontWeight="500"
              fontFamily={fontFamily}
              tick={axisStyles.tick}
              tickMargin={5}
              width={45}
              axisLine={axisStyles.axisLine}
            />
            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              cursor={cursorStyles}
              formatter={(value) => [formatEfficiency(value), "Efficiency"]}
            />
            <Legend
              content={(props) => <ChartLegend {...props} />}
              wrapperStyle={{
                paddingTop: "10px",
              }}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              name="Feeding Rate"
              stroke={lineColor}
              strokeWidth={2}
              dot={getDotStyles(isDark, lineColor)}
              activeDot={getActiveDotStyles(isDark, lineColor)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

FeedingEfficiencyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      efficiency: PropTypes.number.isRequired,
    }),
  ).isRequired,
  timePeriod: PropTypes.oneOf(["week", "month", "year"]).isRequired,
  setTimePeriod: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default FeedingEfficiencyChart;

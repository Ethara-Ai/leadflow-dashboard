// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Bar,
} from "recharts";
import { cardVariants, fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";
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
 * AntActivityChart Component
 * Displays animal activity data as a composed chart with area and bar elements.
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 * @param {string} props.timePeriod - Currently selected time period
 * @param {function} props.setTimePeriod - Callback when time period changes
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const AntActivityChart = ({
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

  // Get theme-based styles
  const axisStyles = getAxisStyles(isDark);
  const gridStyles = getGridStyles(isDark);
  const cursorStyles = getTooltipCursorStyles(isDark);
  const cardClasses = getChartCardClasses(isDark);
  const titleClasses = getChartTitleClasses(isDark);

  // Chart colors based on theme
  const primaryColor = isDark ? "#60a5fa" : "#2563eb";
  const secondaryColor = isDark ? "#34d399" : "#059669";

  return (
    <motion.div
      className={`${cardClasses} backdrop-blur-lg rounded-2xl p-3 sm:p-4 md:p-6 border transition-all duration-300 hover:shadow-2xl`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      variants={cardVariants}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3
          className={`text-base sm:text-lg md:text-xl font-bold ${titleClasses}`}
          style={{ fontFamily }}
        >
          Animal Activity
        </h3>
        <TimePeriodButtons
          currentPeriod={timePeriod}
          onPeriodChange={setTimePeriod}
        />
      </div>

      {/* Chart Container */}
      <div className="w-full h-55 sm:h-65 md:h-75">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 25,
            }}
          >
            <defs>
              <linearGradient id="colorAnimals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorFeeding" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={secondaryColor}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={secondaryColor}
                  stopOpacity={0.2}
                />
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
            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              cursor={cursorStyles}
            />
            <Legend
              content={(props) => <ChartLegend {...props} />}
              wrapperStyle={{
                paddingTop: "10px",
              }}
            />
            <Area
              type="monotone"
              dataKey="animals"
              name="Active Animals"
              fill="url(#colorAnimals)"
              stroke={primaryColor}
              strokeWidth={2}
              dot={getDotStyles(isDark, primaryColor)}
              activeDot={getActiveDotStyles(isDark, primaryColor)}
            />
            <Bar
              dataKey="feedingCompleted"
              name="Feedings Completed"
              fill="url(#colorFeeding)"
              barSize={timePeriod === "year" ? 6 : 10}
              radius={[3, 3, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AntActivityChart;

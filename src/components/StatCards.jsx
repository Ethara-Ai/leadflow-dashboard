// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { PawPrint, Thermometer, Droplet, Activity } from "lucide-react";
import { staggerContainerVariants } from "../constants";
import { calculateTotalAnimals } from "../utils";
import useTheme from "../hooks/useTheme";
import StatCard from "./StatCard";

/**
 * Helper function to determine the subValueVariant based on the value
 * This extracts business logic from the presentation component
 * @param {string} subValue - The sub value string (e.g., "+8", "-3%")
 * @returns {"positive"|"negative"|"warning"|"neutral"} - The variant type
 */
const getSubValueVariant = (subValue) => {
  if (!subValue) return "neutral";
  if (subValue.includes("+")) return "positive";
  if (subValue.includes("-")) return "warning";
  return "neutral";
};

/**
 * StatCards Component
 * Displays a grid of statistic cards for the dashboard.
 * Uses theme context for dark mode styling.
 *
 * @param {Object} props - Component props
 * @param {Object} props.zooData - Zoo statistics data (population, temperature, humidity)
 * @param {Array} props.activityData - Activity data for calculating totals
 * @param {boolean} [props.darkMode] - Optional override for dark mode (backward compatibility)
 */
const StatCards = ({ zooData, activityData, darkMode: darkModeOverride }) => {
  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  const totalAnimals = calculateTotalAnimals(activityData);

  const stats = [
    {
      title: "Total Animals",
      value: zooData.population,
      icon: <PawPrint />,
      subValue: "+8",
      subText: "new arrivals",
      accent: isDark
        ? "bg-emerald-900/40 text-emerald-400"
        : "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Avg Temp",
      value: `${zooData.temperature}°C`,
      icon: <Thermometer />,
      subValue: "+0.5°C",
      subText: "vs yesterday",
      accent: isDark
        ? "bg-amber-900/40 text-amber-400"
        : "bg-amber-100 text-amber-600",
    },
    {
      title: "Humidity",
      value: `${zooData.humidity}%`,
      icon: <Droplet />,
      subValue: "-3%",
      subText: "vs yesterday",
      accent: isDark
        ? "bg-cyan-900/40 text-cyan-400"
        : "bg-cyan-100 text-cyan-600",
    },
    {
      title: "Active",
      value: totalAnimals,
      icon: <Activity />,
      subValue: "+12.4%",
      subText: "activity",
      accent: isDark
        ? "bg-blue-900/40 text-blue-400"
        : "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          subValue={stat.subValue}
          subText={stat.subText}
          accent={stat.accent}
          subValueVariant={getSubValueVariant(stat.subValue)}
        />
      ))}
    </motion.div>
  );
};

export default StatCards;

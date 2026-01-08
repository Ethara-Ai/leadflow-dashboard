import { memo } from "react";
import { motion } from "framer-motion";
import { Users, Phone, Calendar, TrendingUp } from "lucide-react";
import { staggerContainerVariants } from "../constants";
import { calculateTotalLeads } from "../utils";
import useThemeSafe from "../hooks/useThemeSafe";
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
 * @param {Object} props.zooData - Lead statistics data (total leads, calls, meetings, conversion rate)
 * @param {Array} props.activityData - Activity data for calculating totals
 * @param {boolean} [props.darkMode] - Optional override for dark mode (backward compatibility)
 */
const StatCards = memo(function StatCards({
  zooData,
  activityData,
  darkMode: darkModeOverride,
}) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  const totalLeads = calculateTotalLeads(activityData);

  const stats = [
    {
      title: "Total Leads",
      value: zooData.population,
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      subValue: "+24",
      subText: "new this week",
      accent: isDark
        ? "bg-emerald-900/40 text-emerald-400"
        : "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Calls Made",
      value: zooData.temperature,
      icon: <Phone className="w-4 h-4 sm:w-5 sm:h-5" />,
      subValue: "+18",
      subText: "vs yesterday",
      accent: isDark
        ? "bg-amber-900/40 text-amber-400"
        : "bg-amber-100 text-amber-600",
    },
    {
      title: "Meetings",
      value: `${zooData.humidity}`,
      icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
      subValue: "+5",
      subText: "scheduled",
      accent: isDark
        ? "bg-cyan-900/40 text-cyan-400"
        : "bg-cyan-100 text-cyan-600",
    },
    {
      title: "Conversion Rate",
      value: `${totalLeads}%`,
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
      subValue: "+3.2%",
      subText: "from meetings",
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
});

export default StatCards;

import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  Users,
  Phone,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  BarChart,
  Activity,
} from 'lucide-react';
import {
  staggerContainerVariants,
  DEFAULT_STATS_CONFIG,
  getAccentClasses,
  getSubValueVariant,
} from '../constants';
import { calculateTotalLeads } from '../utils';
import useThemeSafe from '../hooks/useThemeSafe';
import StatCard from './StatCard';

/**
 * Icon mapping - maps icon names to actual components
 */
const ICON_MAP = {
  Users,
  Phone,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  BarChart,
  Activity,
};

/**
 * Get icon component by name
 * @param {string} iconName - Name of the icon
 * @param {string} className - CSS classes for the icon
 * @returns {React.ReactNode} Icon component
 */
const getIconComponent = (iconName, className = 'w-4 h-4 sm:w-5 sm:h-5') => {
  const IconComponent = ICON_MAP[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in ICON_MAP`);
    return null;
  }
  return <IconComponent className={className} />;
};

/**
 * Get stat value from lead data
 * @param {Object} leadData - Lead data object
 * @param {Object} config - Stat configuration
 * @param {number} conversionRate - Calculated conversion rate
 * @returns {string|number} Formatted value
 */
const getStatValue = (leadData, config, conversionRate) => {
  let value;

  if (config.valueKey === 'conversionRate') {
    value = conversionRate;
  } else {
    value = leadData[config.valueKey];
  }

  if (config.valueFormatter) {
    return config.valueFormatter(value);
  }

  return value;
};

/**
 * StatCards Component
 * Displays a grid of statistic cards for the dashboard.
 * Uses theme context for dark mode styling.
 *
 * @param {Object} props - Component props
 * @param {Object} props.leadData - Lead statistics data (totalLeads, callsMade, meetingsScheduled)
 * @param {Array} props.activityData - Activity data for calculating totals
 * @param {Array} [props.statsConfig] - Optional custom stats configuration
 * @param {boolean} [props.darkMode] - Optional override for dark mode (backward compatibility)
 */
const StatCards = memo(function StatCards({
  leadData,
  activityData,
  statsConfig = DEFAULT_STATS_CONFIG,
  darkMode: darkModeOverride,
}) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Calculate conversion rate from activity data
  const conversionRate = useMemo(() => calculateTotalLeads(activityData), [activityData]);

  // Build stats array from configuration
  const stats = useMemo(() => {
    return statsConfig.map((config) => ({
      key: config.id,
      title: config.title,
      value: getStatValue(leadData, config, conversionRate),
      icon: getIconComponent(config.iconName),
      subValue: config.subValue,
      subText: config.subText,
      accent: getAccentClasses(config.accent, isDark),
      subValueVariant: getSubValueVariant(config.subValue),
    }));
  }, [statsConfig, leadData, conversionRate, isDark]);

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.key}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          subValue={stat.subValue}
          subText={stat.subText}
          accent={stat.accent}
          subValueVariant={stat.subValueVariant}
        />
      ))}
    </motion.div>
  );
});

StatCards.propTypes = {
  leadData: PropTypes.shape({
    totalLeads: PropTypes.number,
    callsMade: PropTypes.number,
    meetingsScheduled: PropTypes.number,
  }).isRequired,
  activityData: PropTypes.array.isRequired,
  statsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      iconName: PropTypes.string.isRequired,
      accent: PropTypes.string.isRequired,
      valueKey: PropTypes.string.isRequired,
      subValue: PropTypes.string,
      subText: PropTypes.string.isRequired,
      valueFormatter: PropTypes.func,
    })
  ),
  darkMode: PropTypes.bool,
};

export default StatCards;

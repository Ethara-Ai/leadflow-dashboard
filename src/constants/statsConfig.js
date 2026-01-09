// =============================================================================
// LEADFLOW DASHBOARD - STATS CONFIGURATION
// Configuration for dashboard statistics cards
// =============================================================================

/**
 * Stat card accent color configurations
 * Maps stat types to their theme-based accent classes
 */
export const STAT_ACCENTS = {
  emerald: {
    dark: 'bg-emerald-950/60 text-emerald-400',
    light: 'bg-emerald-100 text-emerald-600',
  },
  amber: {
    dark: 'bg-amber-950/60 text-amber-400',
    light: 'bg-amber-100 text-amber-600',
  },
  cyan: {
    dark: 'bg-cyan-950/60 text-cyan-400',
    light: 'bg-cyan-100 text-cyan-600',
  },
  blue: {
    dark: 'bg-blue-950/60 text-blue-400',
    light: 'bg-blue-100 text-blue-600',
  },
  rose: {
    dark: 'bg-rose-950/60 text-rose-400',
    light: 'bg-rose-100 text-rose-600',
  },
  violet: {
    dark: 'bg-violet-950/60 text-violet-400',
    light: 'bg-violet-100 text-violet-600',
  },
};

/**
 * Get accent classes based on theme
 * @param {string} accentKey - Key from STAT_ACCENTS
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {string} Tailwind CSS classes for the accent
 */
export const getAccentClasses = (accentKey, isDark) => {
  const accent = STAT_ACCENTS[accentKey] || STAT_ACCENTS.blue;
  return isDark ? accent.dark : accent.light;
};

/**
 * Stat card configuration type
 * @typedef {Object} StatConfig
 * @property {string} id - Unique identifier for the stat
 * @property {string} title - Display title
 * @property {string} iconName - Name of the lucide-react icon
 * @property {string} accent - Key from STAT_ACCENTS
 * @property {string} valueKey - Key to get value from leadData
 * @property {string} [subValueKey] - Optional key to get subValue from data
 * @property {string} [subValue] - Static sub value (e.g., "+24")
 * @property {string} subText - Description text
 * @property {function} [valueFormatter] - Optional function to format the value
 */

/**
 * Default stats configuration
 * Defines the structure and display of each stat card
 */
export const DEFAULT_STATS_CONFIG = [
  {
    id: 'total-leads',
    title: 'Total Leads',
    iconName: 'Users',
    accent: 'emerald',
    valueKey: 'totalLeads',
    subValue: '+24',
    subText: 'new this week',
  },
  {
    id: 'calls-made',
    title: 'Calls Made',
    iconName: 'Phone',
    accent: 'amber',
    valueKey: 'callsMade',
    subValue: '+18',
    subText: 'vs yesterday',
  },
  {
    id: 'meetings',
    title: 'Meetings',
    iconName: 'Calendar',
    accent: 'cyan',
    valueKey: 'meetingsScheduled',
    subValue: '+5',
    subText: 'scheduled',
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    iconName: 'TrendingUp',
    accent: 'blue',
    valueKey: 'conversionRate',
    subValue: '+3.2%',
    subText: 'from meetings',
    valueFormatter: (value) => `${value}%`,
  },
];

/**
 * Helper function to determine the subValueVariant based on the value
 * @param {string} subValue - The sub value string (e.g., "+8", "-3%")
 * @returns {"positive"|"negative"|"warning"|"neutral"} - The variant type
 */
export const getSubValueVariant = (subValue) => {
  if (!subValue) return 'neutral';
  if (subValue.includes('+')) return 'positive';
  if (subValue.includes('-')) return 'warning';
  return 'neutral';
};

/**
 * Icon mapping for stat cards
 * Maps icon names to actual lucide-react icon components
 * Note: This must be used with dynamic imports or passed as props
 */
export const STAT_ICON_NAMES = {
  Users: 'Users',
  Phone: 'Phone',
  Calendar: 'Calendar',
  TrendingUp: 'TrendingUp',
  DollarSign: 'DollarSign',
  Target: 'Target',
  BarChart: 'BarChart',
  Activity: 'Activity',
};

export default DEFAULT_STATS_CONFIG;

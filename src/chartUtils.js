import { fontFamily } from './constants';

/**
 * Get chart axis styles based on theme
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {Object} - Axis style configuration
 */
export const getAxisStyles = (isDark) => ({
  stroke: isDark ? '#a3a3a3' : '#475569',
  tickLine: { stroke: isDark ? '#a3a3a3' : '#475569' },
  axisLine: {
    stroke: isDark ? '#525252' : '#475569',
    strokeWidth: 1,
  },
  tick: {
    fontSize: 10,
    fill: isDark ? '#a3a3a3' : '#475569',
  },
});

/**
 * Get chart grid styles based on theme
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {Object} - Grid style configuration
 */
export const getGridStyles = (isDark) => ({
  strokeDasharray: '3 3',
  stroke: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)',
});

/**
 * Get chart tooltip cursor styles based on theme
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {Object} - Cursor style configuration
 */
export const getTooltipCursorStyles = (isDark) => ({
  fill: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.05)',
});

/**
 * Get chart card container classes based on theme
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {string} - Tailwind CSS classes
 */
export const getChartCardClasses = (isDark) =>
  isDark
    ? 'bg-neutral-900/90 border-neutral-700/50 shadow-2xl shadow-black/60 ring-1 ring-neutral-600/20'
    : 'bg-white/90 border-slate-200/60 shadow-xl shadow-slate-900/10';

/**
 * Get chart title classes based on theme
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {string} - Tailwind CSS classes
 */
export const getChartTitleClasses = (isDark) => (isDark ? 'text-neutral-100' : 'text-slate-700');

/**
 * Common chart gradient definitions for Area charts
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {Object} - Gradient color configurations
 */
export const getChartGradients = (isDark) => ({
  primary: {
    start: isDark ? '#60a5fa' : '#2563eb',
    startOpacity: 0.8,
    endOpacity: 0.2,
  },
  secondary: {
    start: isDark ? '#34d399' : '#059669',
    startOpacity: 0.8,
    endOpacity: 0.2,
  },
  warning: {
    start: isDark ? '#fbbf24' : '#d97706',
    startOpacity: 0.8,
    endOpacity: 0.2,
  },
});

/**
 * Get dot styles for line/area charts
 * @param {boolean} isDark - Whether dark mode is enabled
 * @param {string} color - The dot color
 * @returns {Object} - Dot style configuration
 */
export const getDotStyles = (isDark, color) => ({
  r: 3,
  fill: color,
  strokeWidth: 1.5,
  stroke: isDark ? '#171717' : '#ffffff',
});

/**
 * Get active dot styles for line/area charts
 * @param {boolean} isDark - Whether dark mode is enabled
 * @param {string} color - The dot color
 * @returns {Object} - Active dot style configuration
 */
export const getActiveDotStyles = (isDark, color) => ({
  r: 5,
  fill: color,
  strokeWidth: 2,
  stroke: isDark ? '#171717' : '#ffffff',
});

/**
 * Get chart colors for different themes
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {Object} - Color configurations
 */
export const getChartColors = (isDark) => ({
  primary: isDark ? '#60a5fa' : '#2563eb',
  secondary: isDark ? '#34d399' : '#059669',
  warning: isDark ? '#fbbf24' : '#d97706',
  danger: isDark ? '#f87171' : '#dc2626',
  text: isDark ? '#a3a3a3' : '#475569',
  lightText: isDark ? '#d4d4d4' : '#64748b',
});

/**
 * Font family constant for chart labels
 */
export { fontFamily };

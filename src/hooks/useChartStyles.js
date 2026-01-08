// =============================================================================
// LEADFLOW DASHBOARD - USE CHART STYLES HOOK
// Custom hook for memoized chart styles to prevent recreation on every render
// =============================================================================

import { useMemo } from "react";
import {
  getAxisStyles,
  getGridStyles,
  getTooltipCursorStyles,
  getChartCardClasses,
  getChartTitleClasses,
  getDotStyles,
  getActiveDotStyles,
  getChartColors,
} from "../chartUtils.js";

/**
 * Custom hook for memoized chart styles
 * Prevents recreation of style objects on every render
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {Object} Memoized chart style configurations
 */
const useChartStyles = (isDark) => {
  const axisStyles = useMemo(() => getAxisStyles(isDark), [isDark]);
  const gridStyles = useMemo(() => getGridStyles(isDark), [isDark]);
  const cursorStyles = useMemo(() => getTooltipCursorStyles(isDark), [isDark]);
  const cardClasses = useMemo(() => getChartCardClasses(isDark), [isDark]);
  const titleClasses = useMemo(() => getChartTitleClasses(isDark), [isDark]);
  const colors = useMemo(() => getChartColors(isDark), [isDark]);

  const primaryDotStyles = useMemo(
    () => getDotStyles(isDark, colors.primary),
    [isDark, colors.primary]
  );

  const primaryActiveDotStyles = useMemo(
    () => getActiveDotStyles(isDark, colors.primary),
    [isDark, colors.primary]
  );

  return useMemo(
    () => ({
      axisStyles,
      gridStyles,
      cursorStyles,
      cardClasses,
      titleClasses,
      colors,
      primaryDotStyles,
      primaryActiveDotStyles,
    }),
    [
      axisStyles,
      gridStyles,
      cursorStyles,
      cardClasses,
      titleClasses,
      colors,
      primaryDotStyles,
      primaryActiveDotStyles,
    ]
  );
};

export default useChartStyles;

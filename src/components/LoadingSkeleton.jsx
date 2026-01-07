// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useMemo } from "react";
import { cardVariants } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * Pre-calculated skeleton line widths to avoid random values during render
 * This ensures consistent rendering and prevents hydration mismatches
 */
const SKELETON_LINE_WIDTHS = [72, 85, 68, 91, 76, 83];

/**
 * LoadingSkeleton Component
 * Displays a skeleton loading state for the dashboard with theme support.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const LoadingSkeleton = ({ darkMode: darkModeOverride }) => {
  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  // Memoize the skeleton line widths to ensure consistency across renders
  const lineWidths = useMemo(() => SKELETON_LINE_WIDTHS, []);

  // Card background classes based on theme
  const cardClasses = isDark
    ? "bg-slate-800/80 border-slate-600/50 shadow-2xl shadow-black/50 ring-1 ring-slate-500/10"
    : "bg-white/90 border-slate-200/60";

  // Skeleton element classes based on theme
  const skeletonClasses = isDark ? "bg-slate-700" : "bg-slate-200";

  return (
    <div className="space-y-8">
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={`stat-skeleton-${index}`}
            className={`${cardClasses} backdrop-blur-lg rounded-2xl p-4 sm:p-6 border h-28 sm:h-32`}
            variants={cardVariants}
          >
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div
                  className={`h-5 w-2/3 rounded animate-pulse ${skeletonClasses}`}
                />
                <div
                  className={`h-5 w-5 rounded-full animate-pulse ${skeletonClasses}`}
                />
              </div>
              <div className="space-y-2 mt-2">
                <div
                  className={`h-8 w-1/2 rounded animate-pulse ${skeletonClasses}`}
                />
                <div
                  className={`h-3 w-2/3 rounded animate-pulse ${skeletonClasses}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={`chart-skeleton-${index}`}
            className={`${cardClasses} backdrop-blur-lg rounded-2xl p-4 sm:p-6 border h-72 sm:h-80`}
            variants={cardVariants}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`h-6 w-1/3 rounded animate-pulse ${skeletonClasses}`}
                />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, btnIndex) => (
                    <div
                      key={`btn-skeleton-${index}-${btnIndex}`}
                      className={`h-8 w-16 rounded-xl animate-pulse ${skeletonClasses}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                {lineWidths.map((width, lineIndex) => (
                  <div
                    key={`line-skeleton-${index}-${lineIndex}`}
                    className={`h-4 rounded animate-pulse ${skeletonClasses}`}
                    style={{ width: `${width}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;

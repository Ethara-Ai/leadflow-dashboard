import { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { cardVariants } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";

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
const LoadingSkeleton = memo(function LoadingSkeleton({ darkMode: darkModeOverride }) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Memoize the skeleton line widths to ensure consistency across renders
  const lineWidths = useMemo(() => SKELETON_LINE_WIDTHS, []);

  // Card background classes based on theme
  const cardClasses = isDark
    ? "bg-slate-800/80 border-slate-600/50 shadow-2xl shadow-black/50 ring-1 ring-slate-500/10"
    : "bg-white/90 border-slate-200/60";

  // Skeleton element classes based on theme
  const skeletonClasses = isDark ? "bg-slate-700" : "bg-slate-200";

  return (
    <div className="space-y-8" role="status" aria-label="Loading dashboard content" aria-busy="true">
      <span className="sr-only">Loading dashboard...</span>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={`stat-skeleton-${index}`}
            className={`${cardClasses} backdrop-blur-lg rounded-2xl p-4 sm:p-6 border h-28 sm:h-32`}
            variants={cardVariants}
            aria-hidden="true"
          >
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className={`h-5 w-2/3 rounded animate-pulse ${skeletonClasses}`} />
                <div className={`h-5 w-5 rounded-full animate-pulse ${skeletonClasses}`} />
              </div>
              <div className="space-y-2 mt-2">
                <div className={`h-8 w-1/2 rounded animate-pulse ${skeletonClasses}`} />
                <div className={`h-3 w-2/3 rounded animate-pulse ${skeletonClasses}`} />
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
            aria-hidden="true"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className={`h-6 w-1/3 rounded animate-pulse ${skeletonClasses}`} />
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
});

LoadingSkeleton.propTypes = {
  darkMode: PropTypes.bool,
};

export default LoadingSkeleton;

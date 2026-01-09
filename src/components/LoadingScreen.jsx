import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fontFamily } from '../constants';
import { STORAGE_KEYS } from '../constants/storage.js';

/**
 * Get the initial theme from localStorage or system preference
 * This runs synchronously to prevent flash of wrong theme
 * @returns {boolean} Whether dark mode should be enabled
 */
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved !== null) {
        return saved === 'dark';
      }
      // Check for system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }
    } catch {
      // localStorage may be unavailable (e.g., private browsing)
    }
  }
  return false;
};

/**
 * LoadingScreen Component
 * A responsive loading screen with animated logo, brand name, and spinner.
 * Perfectly centered on all screen sizes including mobile.
 * Scales appropriately across all Tailwind CSS breakpoints (sm, md, lg, xl, 2xl).
 * Automatically matches the current UI theme (dark/light mode).
 */
const LoadingScreen = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  // Listen for theme changes in localStorage (in case theme changes during loading)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.THEME) {
        setIsDark(e.newValue === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Theme-based classes
  const bgClasses = isDark
    ? 'bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950'
    : 'bg-linear-to-br from-slate-50 via-white to-slate-100';

  const logoContainerClasses = isDark
    ? 'bg-linear-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30'
    : 'bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20';

  const brandTextClasses = isDark ? 'text-neutral-100' : 'text-slate-800';

  const taglineClasses = isDark ? 'text-neutral-400' : 'text-slate-500';

  const spinnerClasses = isDark
    ? 'border-neutral-700 border-t-blue-400'
    : 'border-slate-200 border-t-blue-500';

  const loadingTextClasses = isDark ? 'text-neutral-400' : 'text-slate-500';

  const footerTextClasses = isDark ? 'text-neutral-500' : 'text-slate-400';

  const dotClasses = isDark ? 'bg-blue-400' : 'bg-blue-400';

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${bgClasses} p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Main content container - centered, with top margin on mobile only */}
      <div className="flex flex-col items-center justify-center text-center mt-50 sm:mt-0">
        {/* Logo container - scales up with viewport */}
        <motion.div
          className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 ${logoContainerClasses} rounded-xl sm:rounded-2xl md:rounded-2xl lg:rounded-3xl xl:rounded-3xl 2xl:rounded-4xl flex items-center justify-center md:shadow-xl lg:shadow-2xl`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Lightning bolt icon - scales with container */}
          <svg
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </motion.div>

        {/* Brand name - responsive text sizing */}
        <motion.h1
          className={`mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8 2xl:mt-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight ${brandTextClasses}`}
          style={{ fontFamily }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          LeadFlow
        </motion.h1>

        {/* Tagline - only visible on larger screens */}
        <motion.p
          className={`hidden md:block mt-2 lg:mt-3 xl:mt-4 text-sm lg:text-base xl:text-lg 2xl:text-xl ${taglineClasses} font-medium`}
          style={{ fontFamily }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Lead Management Dashboard
        </motion.p>

        {/* Loading spinner container - responsive spacing */}
        <motion.div
          className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 xl:mt-12 2xl:mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          {/* Spinner - scales with viewport */}
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 border-2 sm:border-3 md:border-3 lg:border-4 xl:border-4 2xl:border-5 ${spinnerClasses} rounded-full animate-spin`}
          />
        </motion.div>

        {/* Loading text - responsive sizing */}
        <motion.p
          className={`mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl ${loadingTextClasses} font-medium`}
          style={{ fontFamily }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          Loading...
        </motion.p>

        {/* Progress dots animation - visible on sm and above */}
        <motion.div
          className="hidden sm:flex mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.3 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-4 2xl:h-4 ${dotClasses} rounded-full`}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Footer text - only on larger viewports, centered at bottom */}
      <motion.p
        className={`hidden lg:block absolute bottom-6 xl:bottom-8 2xl:bottom-10 left-0 right-0 text-center text-xs lg:text-sm xl:text-base 2xl:text-lg ${footerTextClasses} font-medium`}
        style={{ fontFamily }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        Preparing your dashboard experience...
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;

// =============================================================================
// LEADFLOW DASHBOARD - USE THEME SAFE HOOK
// Safe theme hook that handles cases where ThemeProvider is not available
// =============================================================================

import { useContext } from "react";
import { ThemeContext } from "./ThemeContext.js";

/**
 * Safe theme hook that handles cases where ThemeProvider is not available
 * Eliminates the need for try-catch blocks in every component
 *
 * @param {boolean} [darkModeOverride] - Optional override for dark mode (for backward compatibility)
 * @returns {Object} Theme context value containing:
 *   - isDark: boolean - Current dark mode state
 *   - darkMode: boolean - Alias for isDark (backward compatibility)
 *   - toggleTheme: function - Toggle between light and dark mode (no-op if no provider)
 *   - setDarkMode: function - Set dark mode to a specific value (no-op if no provider)
 */
const useThemeSafe = (darkModeOverride) => {
  const context = useContext(ThemeContext);

  // If override is provided, use it regardless of context
  if (darkModeOverride !== undefined) {
    return {
      isDark: darkModeOverride,
      darkMode: darkModeOverride,
      toggleTheme: () => {},
      setDarkMode: () => {},
    };
  }

  // If context exists, return it
  if (context !== undefined) {
    return context;
  }

  // Fallback when used outside ThemeProvider
  // Only warn in development to avoid console noise in production
  return {
    isDark: false,
    darkMode: false,
    toggleTheme: () => {
      if (import.meta.env.DEV) {
        console.warn("useThemeSafe: toggleTheme called outside of ThemeProvider");
      }
    },
    setDarkMode: () => {
      if (import.meta.env.DEV) {
        console.warn("useThemeSafe: setDarkMode called outside of ThemeProvider");
      }
    },
  };
};

export default useThemeSafe;

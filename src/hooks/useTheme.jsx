// =============================================================================
// LEADFLOW DASHBOARD - UNIFIED THEME HOOK
// Consolidated theme hook that handles all theme-related functionality
// =============================================================================

import { useContext, useMemo } from "react";
import { ThemeContext } from "./ThemeContext.js";

/**
 * Default fallback theme values when no provider is available
 */
const DEFAULT_THEME = {
  isDark: false,
  darkMode: false,
  toggleTheme: () => {
    if (import.meta.env.DEV) {
      console.warn("useTheme: toggleTheme called outside of ThemeProvider");
    }
  },
  setDarkMode: () => {
    if (import.meta.env.DEV) {
      console.warn("useTheme: setDarkMode called outside of ThemeProvider");
    }
  },
};

/**
 * Unified theme hook that consolidates all theme functionality
 *
 * This hook replaces both `useTheme` and `useThemeSafe` with a single,
 * flexible implementation that supports:
 * - Safe mode (no error when used outside ThemeProvider)
 * - Dark mode override via props
 * - Backward compatibility with existing code
 *
 * @param {Object|boolean} [options] - Hook options or darkModeOverride for backward compatibility
 * @param {boolean} [options.darkModeOverride] - Override the theme context dark mode value
 * @param {boolean} [options.safe=true] - If true, returns fallback values instead of throwing when outside provider
 * @param {boolean} [options.throwOnMissingProvider=false] - If true, throws error when used outside ThemeProvider
 *
 * @returns {Object} Theme context value containing:
 *   - isDark: boolean - Current dark mode state
 *   - darkMode: boolean - Alias for isDark (backward compatibility)
 *   - toggleTheme: function - Toggle between light and dark mode
 *   - setDarkMode: function - Set dark mode to a specific value
 *   - isProviderAvailable: boolean - Whether the ThemeProvider is available
 *
 * @example
 * // Basic usage (safe by default)
 * const { isDark, toggleTheme } = useTheme();
 *
 * @example
 * // With dark mode override
 * const { isDark } = useTheme({ darkModeOverride: true });
 *
 * @example
 * // Strict mode (throws if no provider)
 * const { isDark } = useTheme({ throwOnMissingProvider: true });
 *
 * @example
 * // Backward compatible with useThemeSafe
 * const { isDark } = useTheme(darkModeProp); // boolean override
 */
const useTheme = (options) => {
  const context = useContext(ThemeContext);

  // Normalize options - support both object config and boolean (backward compatibility)
  const normalizedOptions = useMemo(() => {
    if (options === undefined || options === null) {
      return { safe: true };
    }

    // Backward compatibility: if options is a boolean, treat as darkModeOverride
    if (typeof options === "boolean") {
      return { darkModeOverride: options, safe: true };
    }

    // Object configuration
    return {
      darkModeOverride: options.darkModeOverride,
      safe: options.safe !== false, // Default to safe mode
      throwOnMissingProvider: options.throwOnMissingProvider || false,
    };
  }, [options]);

  // Handle dark mode override
  const overrideResult = useMemo(() => {
    if (normalizedOptions.darkModeOverride !== undefined) {
      return {
        isDark: normalizedOptions.darkModeOverride,
        darkMode: normalizedOptions.darkModeOverride,
        toggleTheme: () => {},
        setDarkMode: () => {},
        isProviderAvailable: context !== undefined,
      };
    }
    return null;
  }, [normalizedOptions.darkModeOverride, context]);

  // If override is provided, return override result
  if (overrideResult) {
    return overrideResult;
  }

  // If context exists, return it with additional metadata
  if (context !== undefined) {
    return {
      ...context,
      isProviderAvailable: true,
    };
  }

  // Handle missing provider
  if (normalizedOptions.throwOnMissingProvider) {
    throw new Error(
      "useTheme must be used within a ThemeProvider. " +
        "Either wrap your component tree with <ThemeProvider> or use " +
        "useTheme({ safe: true }) to get fallback values.",
    );
  }

  // Safe mode: return fallback values
  return {
    ...DEFAULT_THEME,
    isProviderAvailable: false,
  };
};

/**
 * Strict version of useTheme that throws if used outside ThemeProvider
 * Use this when you want to ensure the component is always within a ThemeProvider
 *
 * @returns {Object} Theme context value
 * @throws {Error} If used outside of ThemeProvider
 */
export const useThemeStrict = () => {
  return useTheme({ throwOnMissingProvider: true });
};

/**
 * Safe version of useTheme that never throws
 * Alias for backward compatibility with useThemeSafe
 *
 * @param {boolean} [darkModeOverride] - Optional override for dark mode
 * @returns {Object} Theme context value
 */
export const useThemeSafe = (darkModeOverride) => {
  return useTheme({ darkModeOverride, safe: true });
};

export default useTheme;

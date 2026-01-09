// =============================================================================
// LEADFLOW DASHBOARD - THEME PROVIDER
// Provides centralized theme management via React Context
// =============================================================================

import { useState, useEffect, useMemo } from 'react';
import { ThemeContext } from './ThemeContext.js';
import { STORAGE_KEYS } from '../constants/index.js';

/**
 * Theme Provider component that wraps the application
 * Provides centralized theme management via React Context
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} [props.defaultDarkMode=false] - Initial dark mode state
 */
const ThemeProvider = ({ children, defaultDarkMode = false }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check for saved preference in localStorage
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
      } catch (error) {
        // localStorage may be unavailable (e.g., private browsing)
        if (import.meta.env.DEV) {
          console.warn('ThemeProvider: Unable to access localStorage', error);
        }
      }
    }
    return defaultDarkMode;
  });

  // Persist theme preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    } catch (error) {
      // Silently fail if localStorage is unavailable
      if (import.meta.env.DEV) {
        console.warn('ThemeProvider: Unable to save theme preference', error);
      }
    }
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only auto-switch if user hasn't set a preference
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME);
        if (saved === null) {
          setIsDark(e.matches);
        }
      } catch {
        // If localStorage fails, follow system preference
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * Toggle between light and dark mode
   */
  const toggleTheme = () => setIsDark((prev) => !prev);

  /**
   * Set dark mode to a specific value
   * @param {boolean} value - Whether to enable dark mode
   */
  const setDarkMode = (value) => setIsDark(Boolean(value));

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isDark,
      darkMode: isDark, // Alias for backward compatibility
      toggleTheme,
      setDarkMode,
    }),
    [isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;

import { useState, useEffect, useMemo } from "react";
import { ThemeContext } from "./ThemeContext.js";
import { STORAGE_KEYS } from "../constants";

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
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved !== null) {
        return saved === "dark";
      }
      // Check for system preference
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return true;
      }
    }
    return defaultDarkMode;
  });

  // Persist theme preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? "dark" : "light");
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only auto-switch if user hasn't set a preference
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === null) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const setDarkMode = (value) => setIsDark(Boolean(value));

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isDark,
      darkMode: isDark, // Alias for backward compatibility
      toggleTheme,
      setDarkMode,
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;

import { useState, useEffect, useMemo } from "react";
import { ThemeContext } from "./ThemeContext.js";

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
      const saved = localStorage.getItem("antlab-theme");
      if (saved !== null) {
        return saved === "dark";
      }
    }
    return defaultDarkMode;
  });

  // Persist theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("antlab-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const setDarkMode = (value) => setIsDark(value);

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

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;

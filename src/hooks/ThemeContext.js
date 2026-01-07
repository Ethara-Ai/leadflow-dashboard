import { createContext } from "react";

/**
 * Theme Context for centralized theme management
 * Replaces prop drilling of darkMode throughout the component tree
 *
 * Context shape:
 * - isDark: boolean - Current dark mode state
 * - darkMode: boolean - Alias for isDark (backward compatibility)
 * - toggleTheme: function - Toggle between light and dark mode
 * - setDarkMode: function - Set dark mode to a specific value
 */
export const ThemeContext = createContext(undefined);

export default ThemeContext;

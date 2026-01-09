import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context value containing:
 *   - isDark: boolean - Current dark mode state
 *   - darkMode: boolean - Alias for isDark (backward compatibility)
 *   - toggleTheme: function - Toggle between light and dark mode
 *   - setDarkMode: function - Set dark mode to a specific value
 * @throws {Error} If used outside of ThemeProvider
 */
const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default useTheme;

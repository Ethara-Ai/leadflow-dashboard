import { useEffect, useRef } from "react";

// Font imports are handled separately to avoid reloading on theme changes
const FONT_STYLES_ID = "zoolab-font-styles";
const THEME_STYLES_ID = "zoolab-theme-styles";

/**
 * Inject font styles once on initial load
 * This is separate from theme styles to avoid reloading fonts on theme toggle
 */
const injectFontStyles = () => {
  if (document.getElementById(FONT_STYLES_ID)) {
    return; // Already injected
  }

  const fontStyleElement = document.createElement("style");
  fontStyleElement.id = FONT_STYLES_ID;
  fontStyleElement.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  `;
  document.head.appendChild(fontStyleElement);
};

/**
 * Generate scrollbar styles based on dark mode
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {string} CSS styles for scrollbars
 */
const generateScrollbarStyles = (isDark) => `
  html {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  html::-webkit-scrollbar {
    display: none;
  }

  body {
    scrollbar-width: thin;
    scrollbar-color: ${isDark ? "#475569 #1e293b" : "#cbd5e1 #f1f5f9"};
  }

  body::-webkit-scrollbar {
    width: 8px;
  }

  body::-webkit-scrollbar-track {
    background: ${isDark ? "#1e293b" : "#f1f5f9"};
    border-radius: 4px;
  }

  body::-webkit-scrollbar-thumb {
    background: ${isDark ? "#475569" : "#cbd5e1"};
    border-radius: 4px;
    border: 2px solid ${isDark ? "#1e293b" : "#f1f5f9"};
  }

  body::-webkit-scrollbar-thumb:hover {
    background: ${isDark ? "#64748b" : "#94a3b8"};
  }

  body::-webkit-scrollbar-thumb:active {
    background: ${isDark ? "#64748b" : "#94a3b8"};
  }

  .custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: ${isDark ? "#475569 #334155" : "#cbd5e1 #e2e8f0"};
  }

  .custom-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scroll::-webkit-scrollbar-track {
    background: ${isDark ? "#334155" : "#e2e8f0"};
    border-radius: 3px;
  }

  .custom-scroll::-webkit-scrollbar-thumb {
    background: ${isDark ? "#475569" : "#cbd5e1"};
    border-radius: 3px;
  }

  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: ${isDark ? "#64748b" : "#94a3b8"};
  }
`;

/**
 * Custom hook for injecting global styles into the document head.
 * Handles scrollbar styling based on dark mode and font imports.
 *
 * Font imports are done once and not reloaded on theme changes.
 * Scrollbar styles update dynamically based on the dark mode state.
 *
 * @param {boolean} darkMode - Whether dark mode is enabled
 */
const useGlobalStyles = (darkMode) => {
  const hasInjectedFonts = useRef(false);

  // Inject font styles once on mount
  useEffect(() => {
    if (!hasInjectedFonts.current) {
      injectFontStyles();
      hasInjectedFonts.current = true;
    }
  }, []);

  // Update theme-dependent styles when dark mode changes
  useEffect(() => {
    let styleElement = document.getElementById(THEME_STYLES_ID);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = THEME_STYLES_ID;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = generateScrollbarStyles(darkMode);

    // Cleanup function - we intentionally don't remove the style element
    // to avoid flicker during re-renders. It will be updated on next render.
    return () => {};
  }, [darkMode]);
};

export default useGlobalStyles;

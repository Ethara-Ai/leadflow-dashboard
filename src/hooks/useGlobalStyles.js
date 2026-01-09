// =============================================================================
// LEADFLOW DASHBOARD - USE GLOBAL STYLES HOOK
// Custom hook for injecting global styles into the document head
// =============================================================================

import { useEffect, useRef } from 'react';

const THEME_STYLES_ID = 'leadflow-theme-styles';

// Reference counter for tracking how many components are using this hook
let mountCount = 0;
let currentStyleElement = null;
let currentDarkMode = null;

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
    scrollbar-color: ${isDark ? '#3f3f46 #09090b' : '#cbd5e1 #f1f5f9'};
  }

  body::-webkit-scrollbar {
    width: 8px;
  }

  body::-webkit-scrollbar-track {
    background: ${isDark ? '#09090b' : '#f1f5f9'};
    border-radius: 4px;
  }

  body::-webkit-scrollbar-thumb {
    background: ${isDark ? '#3f3f46' : '#cbd5e1'};
    border-radius: 4px;
    border: 2px solid ${isDark ? '#09090b' : '#f1f5f9'};
  }

  body::-webkit-scrollbar-thumb:hover {
    background: ${isDark ? '#52525b' : '#94a3b8'};
  }

  body::-webkit-scrollbar-thumb:active {
    background: ${isDark ? '#52525b' : '#94a3b8'};
  }

  .custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: ${isDark ? '#3f3f46 #18181b' : '#cbd5e1 #e2e8f0'};
  }

  .custom-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scroll::-webkit-scrollbar-track {
    background: ${isDark ? '#18181b' : '#e2e8f0'};
    border-radius: 3px;
  }

  .custom-scroll::-webkit-scrollbar-thumb {
    background: ${isDark ? '#3f3f46' : '#cbd5e1'};
    border-radius: 3px;
  }

  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: ${isDark ? '#52525b' : '#94a3b8'};
  }

  .hidden-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .hidden-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

/**
 * Create or update the style element
 * @param {boolean} isDark - Whether dark mode is enabled
 */
const updateStyles = (isDark) => {
  if (!currentStyleElement) {
    currentStyleElement = document.createElement('style');
    currentStyleElement.id = THEME_STYLES_ID;
    document.head.appendChild(currentStyleElement);
  }

  // Only update if the theme has changed
  if (currentDarkMode !== isDark) {
    currentStyleElement.textContent = generateScrollbarStyles(isDark);
    currentDarkMode = isDark;
  }
};

/**
 * Remove the style element from the DOM
 */
const removeStyles = () => {
  if (currentStyleElement && currentStyleElement.parentNode) {
    currentStyleElement.parentNode.removeChild(currentStyleElement);
    currentStyleElement = null;
    currentDarkMode = null;
  }
};

/**
 * Custom hook for injecting global styles into the document head.
 * Handles scrollbar styling based on dark mode.
 * Uses reference counting to properly clean up when all consumers unmount.
 *
 * Note: Font imports are handled in index.html for better performance.
 * This hook only manages theme-dependent scrollbar styles.
 *
 * @param {boolean} darkMode - Whether dark mode is enabled
 */
const useGlobalStyles = (darkMode) => {
  // Track if this instance has been counted
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Increment mount count on first mount
    if (!isMountedRef.current) {
      mountCount++;
      isMountedRef.current = true;
    }

    // Update styles with current dark mode
    updateStyles(darkMode);

    // Cleanup function
    return () => {
      if (isMountedRef.current) {
        mountCount--;
        isMountedRef.current = false;

        // Only remove styles when all consumers have unmounted
        if (mountCount === 0) {
          removeStyles();
        }
      }
    };
  }, [darkMode]);
};

export default useGlobalStyles;

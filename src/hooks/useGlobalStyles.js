import { useEffect } from 'react';

/**
 * Custom hook for injecting global styles into the document head.
 * Handles scrollbar styling and font imports based on dark mode.
 * @param {boolean} darkMode - Whether dark mode is enabled
 */
const useGlobalStyles = (darkMode) => {
  useEffect(() => {
    const styleId = 'antlab-global-styles';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

      html {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      html::-webkit-scrollbar {
        display: none;
      }

      body {
        scrollbar-width: thin;
        scrollbar-color: ${darkMode ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'};
      }

      body::-webkit-scrollbar {
        width: 8px;
      }

      body::-webkit-scrollbar-track {
        background: ${darkMode ? '#1e293b' : '#f1f5f9'};
        border-radius: 4px;
      }

      body::-webkit-scrollbar-thumb {
        background: ${darkMode ? '#475569' : '#cbd5e1'};
        border-radius: 4px;
        border: 2px solid ${darkMode ? '#1e293b' : '#f1f5f9'};
      }

      body::-webkit-scrollbar-thumb:hover {
        background: ${darkMode ? '#64748b' : '#94a3b8'};
      }

      body::-webkit-scrollbar-thumb:active {
        background: ${darkMode ? '#64748b' : '#94a3b8'};
      }

      .custom-scroll {
        scrollbar-width: thin;
        scrollbar-color: ${darkMode ? '#475569 #334155' : '#cbd5e1 #e2e8f0'};
      }

      .custom-scroll::-webkit-scrollbar {
        width: 6px;
      }

      .custom-scroll::-webkit-scrollbar-track {
        background: ${darkMode ? '#334155' : '#e2e8f0'};
        border-radius: 3px;
      }

      .custom-scroll::-webkit-scrollbar-thumb {
        background: ${darkMode ? '#475569' : '#cbd5e1'};
        border-radius: 3px;
      }

      .custom-scroll::-webkit-scrollbar-thumb:hover {
        background: ${darkMode ? '#64748b' : '#94a3b8'};
      }
    `;

    // Cleanup is intentionally not removing the style element
    // to avoid flicker during re-renders
    return () => {};
  }, [darkMode]);
};

export default useGlobalStyles;

/**
 * Test Utilities and Helper Functions
 * Provides common testing utilities for the Zoolab Dashboard project
 */

import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import ThemeProvider from '../hooks/ThemeProvider';

/**
 * Custom render function that wraps components with necessary providers
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @param {boolean} options.darkMode - Initial dark mode state
 * @param {Object} options.renderOptions - Additional options to pass to RTL render
 * @returns {Object} - RTL render result plus user event instance
 */
export function renderWithProviders(ui, { darkMode = false, ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return <ThemeProvider defaultDarkMode={darkMode}>{children}</ThemeProvider>;
  }

  return {
    user: userEvent.setup(),
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Render with dark mode enabled
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Additional render options
 * @returns {Object} - RTL render result
 */
export function renderDarkMode(ui, options = {}) {
  return renderWithProviders(ui, { darkMode: true, ...options });
}

/**
 * Render with light mode (default)
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Additional render options
 * @returns {Object} - RTL render result
 */
export function renderLightMode(ui, options = {}) {
  return renderWithProviders(ui, { darkMode: false, ...options });
}

// Re-export everything from testing library
export * from '@testing-library/react';

// Override render with our custom render
export { renderWithProviders as render };

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

/**
 * Generate mock activity data for charts
 * @param {number} count - Number of data points to generate
 * @returns {Array} - Array of activity data objects
 */
export function generateMockActivityData(count = 7) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return Array.from({ length: count }, (_, i) => ({
    name: days[i % days.length],
    animals: Math.floor(Math.random() * 100) + 100,
    feedingCompleted: Math.floor(Math.random() * 30) + 10,
  }));
}

/**
 * Generate mock feeding efficiency data
 * @param {number} count - Number of data points to generate
 * @returns {Array} - Array of efficiency data objects
 */
export function generateMockFeedingData(count = 7) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return Array.from({ length: count }, (_, i) => ({
    name: days[i % days.length],
    efficiency: Math.floor(Math.random() * 25) + 75,
  }));
}

/**
 * Generate mock diet distribution data
 * @returns {Array} - Array of diet data objects
 */
export function generateMockDietData() {
  return [
    { name: 'Fresh Produce', value: 35 },
    { name: 'Protein/Meat', value: 30 },
    { name: 'Grains & Pellets', value: 20 },
    { name: 'Supplements', value: 15 },
  ];
}

/**
 * Generate mock alert data
 * @param {number} count - Number of alerts to generate
 * @returns {Array} - Array of alert objects
 */
export function generateMockAlerts(count = 3) {
  const messages = [
    {
      message: 'Elephant enclosure temperature above optimal range',
      type: 'warning',
    },
    {
      message: 'Veterinary checkup completed for primates section',
      type: 'info',
    },
    {
      message: 'Low stock alert: Vitamin supplements for reptile house',
      type: 'warning',
    },
    {
      message: 'Humidity level critical in tropical bird aviary',
      type: 'warning',
    },
    {
      message: 'New animal arrival scheduled for quarantine area',
      type: 'info',
    },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    ...messages[i % messages.length],
    time: `${i + 1} hour${i === 0 ? '' : 's'} ago`,
  }));
}

/**
 * Generate mock zoo data (colony data)
 * @param {Object} overrides - Optional overrides for default values
 * @returns {Object} - Zoo data object
 */
export function generateMockZooData(overrides = {}) {
  return {
    population: 847,
    temperature: 24.5,
    humidity: 58,
    lastUpdated: new Date().toLocaleString(),
    ...overrides,
  };
}

/**
 * Generate mock notes data
 * @param {number} count - Number of notes to generate
 * @returns {Array} - Array of note objects
 */
export function generateMockNotes(count = 2) {
  const noteContents = [
    'Lion enclosure: Male lion showing increased appetite after medication completed',
    'Penguin habitat: Water filtration system maintenance scheduled for next week',
    'Gorilla section: New enrichment activities showing positive behavioral results',
    'Reptile house: Temperature monitoring system upgraded successfully',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    content: noteContents[i % noteContents.length],
    timestamp: new Date(Date.now() - i * 86400000).toLocaleString(),
  }));
}

// =============================================================================
// MOCK FUNCTIONS
// =============================================================================

/**
 * Create a mock function that resolves after a delay
 * @param {any} resolveValue - Value to resolve with
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Mock async function
 */
export function createAsyncMock(resolveValue, delay = 100) {
  return vi.fn(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(resolveValue), delay);
      })
  );
}

/**
 * Create a mock function that rejects after a delay
 * @param {Error|string} error - Error to reject with
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Mock async function
 */
export function createAsyncRejectMock(error, delay = 100) {
  return vi.fn(
    () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(error instanceof Error ? error : new Error(error)), delay);
      })
  );
}

// =============================================================================
// ANIMATION MOCKS
// =============================================================================

/**
 * Mock Framer Motion variants for testing
 * Disables animations for faster tests
 */
export const mockAnimationVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

/**
 * Mock card animation variants
 */
export const mockCardVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

/**
 * Mock dropdown animation variants
 */
export const mockDropdownVariants = {
  closed: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0 } },
  open: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0 } },
};

// =============================================================================
// ASSERTION HELPERS
// =============================================================================

/**
 * Wait for an element to be removed from the DOM
 * @param {Function} queryFn - Function that queries for the element
 * @param {number} timeout - Maximum time to wait
 * @returns {Promise} - Resolves when element is removed
 */
export async function waitForElementToBeRemoved(queryFn, timeout = 5000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const element = queryFn();
      if (!element) return;
    } catch {
      return; // Element not found, which is what we want
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error('Element was not removed within timeout');
}

/**
 * Assert that a function throws an error
 * @param {Function} fn - Function to test
 * @param {string|RegExp} expectedMessage - Expected error message
 */
export function expectToThrow(fn, expectedMessage) {
  expect(fn).toThrow(expectedMessage);
}

/**
 * Assert element has specific styles (useful for theme testing)
 * @param {HTMLElement} element - Element to check
 * @param {Object} styles - Expected styles
 */
export function expectStyles(element, styles) {
  const computedStyles = window.getComputedStyle(element);
  Object.entries(styles).forEach(([property, value]) => {
    expect(computedStyles[property]).toBe(value);
  });
}

// =============================================================================
// EVENT HELPERS
// =============================================================================

/**
 * Simulate a resize event
 * @param {number} width - New window width
 * @param {number} height - New window height
 */
export function simulateResize(width, height) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
}

/**
 * Simulate pressing a keyboard key
 * @param {HTMLElement} element - Element to dispatch event on
 * @param {string} key - Key to press
 * @param {Object} options - Additional event options
 */
export function pressKey(element, key, options = {}) {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      ...options,
    })
  );
}

/**
 * Simulate pressing Enter key
 * @param {HTMLElement} element - Element to dispatch event on
 */
export function pressEnter(element) {
  pressKey(element, 'Enter');
}

/**
 * Simulate pressing Escape key
 * @param {HTMLElement} element - Element to dispatch event on
 */
export function pressEscape(element) {
  pressKey(element, 'Escape');
}

// =============================================================================
// RECHARTS TESTING HELPERS
// =============================================================================

/**
 * Mock Recharts ResponsiveContainer for testing
 * Recharts ResponsiveContainer doesn't render children without a sized parent
 */
export const MockResponsiveContainer = ({ children, width = 500, height = 300 }) => (
  <div style={{ width, height }}>{children}</div>
);

/**
 * Get chart elements within a container
 * @param {HTMLElement} container - Container element
 * @returns {Object} - Object with chart element queries
 */
export function getChartElements(container) {
  return {
    getSvg: () => container.querySelector('svg'),
    getBars: () => container.querySelectorAll('.recharts-bar-rectangle'),
    getLines: () => container.querySelectorAll('.recharts-line'),
    getAreas: () => container.querySelectorAll('.recharts-area'),
    getPieSectors: () => container.querySelectorAll('.recharts-pie-sector'),
    getTooltip: () => container.querySelector('.recharts-tooltip-wrapper'),
    getLegend: () => container.querySelector('.recharts-legend-wrapper'),
    getXAxis: () => container.querySelector('.recharts-xAxis'),
    getYAxis: () => container.querySelector('.recharts-yAxis'),
  };
}

// =============================================================================
// ACCESSIBILITY HELPERS
// =============================================================================

/**
 * Check if element is focusable
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - Whether element is focusable
 */
export function isFocusable(element) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    "[tabindex]:not([tabindex='-1'])",
  ];

  return focusableSelectors.some((selector) => element.matches(selector));
}

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - Container element
 * @returns {NodeList} - List of focusable elements
 */
export function getFocusableElements(container) {
  return container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
}

// =============================================================================
// SNAPSHOT HELPERS
// =============================================================================

/**
 * Remove dynamic attributes from element for consistent snapshots
 * @param {string} html - HTML string
 * @returns {string} - Cleaned HTML string
 */
export function cleanHtmlForSnapshot(html) {
  return html
    .replace(/id="[^"]*"/g, 'id="[id]"')
    .replace(/data-testid="[^"]*"/g, 'data-testid="[testid]"')
    .replace(/style="[^"]*"/g, 'style="[styles]"');
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  renderWithProviders,
  renderDarkMode,
  renderLightMode,
  generateMockActivityData,
  generateMockFeedingData,
  generateMockDietData,
  generateMockAlerts,
  generateMockZooData,
  generateMockNotes,
  mockAnimationVariants,
  mockCardVariants,
  mockDropdownVariants,
};

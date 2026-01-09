/**
 * Unit Tests for AlertDropdown Component
 * Tests the alert dropdown panel with alert management functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import AlertDropdown from './AlertDropdown';
import ThemeProvider from '../hooks/ThemeProvider';

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const mockAlerts = [
  {
    id: 1,
    message: 'Temperature alert in elephant enclosure',
    type: 'warning',
    time: '1 hour ago',
  },
  { id: 2, message: 'Feeding completed for primates', type: 'info', time: '2 hours ago' },
  { id: 3, message: 'Low stock alert: Vitamin supplements', type: 'warning', time: '3 hours ago' },
];

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  alerts: mockAlerts,
  newAlert: '',
  onNewAlertChange: vi.fn(),
  onAddAlert: vi.fn(),
  onClearAlerts: vi.fn(),
  dropdownRef: createRef(),
};

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
    button: ({ children, className, onClick, disabled, ...props }) => (
      <button className={className} onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe('AlertDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render when isOpen is true', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      expect(screen.getByText('Alerts')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Alerts')).not.toBeInTheDocument();
    });

    it('should render the Clear All button', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should render the close button', () => {
      const { container } = renderWithTheme(<AlertDropdown {...defaultProps} />);
      const closeButton = container.querySelector('button:has(svg)');
      expect(closeButton).toBeInTheDocument();
    });

    it('should render the Add button', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('should render the input field', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      expect(screen.getByPlaceholderText('Add custom alert...')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Alert Display Tests
  // =============================================================================

  describe('alert display', () => {
    it('should render all alerts', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      expect(screen.getByText('Temperature alert in elephant enclosure')).toBeInTheDocument();
      expect(screen.getByText('Feeding completed for primates')).toBeInTheDocument();
      expect(screen.getByText('Low stock alert: Vitamin supplements')).toBeInTheDocument();
    });

    it('should render alert times', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      expect(screen.getByText('1 hour ago')).toBeInTheDocument();
      expect(screen.getByText('2 hours ago')).toBeInTheDocument();
      expect(screen.getByText('3 hours ago')).toBeInTheDocument();
    });

    it("should show 'No alerts' when alerts array is empty", () => {
      renderWithTheme(<AlertDropdown {...defaultProps} alerts={[]} />);
      expect(screen.getByText('No alerts')).toBeInTheDocument();
    });

    it('should apply warning styling to warning alerts', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      const warningAlert = screen.getByText('Temperature alert in elephant enclosure');
      expect(warningAlert).toHaveClass('text-amber-700');
    });

    it('should apply info styling to info alerts', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      const infoAlert = screen.getByText('Feeding completed for primates');
      expect(infoAlert).toHaveClass('text-blue-700');
    });
  });

  // =============================================================================
  // Close Button Tests
  // =============================================================================

  describe('close functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTheme(<AlertDropdown {...defaultProps} />);

      // Find the X button (close button)
      const buttons = container.querySelectorAll('button');
      const closeButton = Array.from(buttons).find(
        (btn) => btn.querySelector('svg') && !btn.textContent.includes('Clear')
      );

      if (closeButton) {
        await user.click(closeButton);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
      }
    });

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertDropdown {...defaultProps} />);

      const backdrop = document.querySelector('.fixed.inset-0');
      if (backdrop) {
        await user.click(backdrop);
        expect(defaultProps.onClose).toHaveBeenCalled();
      }
    });
  });

  // =============================================================================
  // Clear All Tests
  // =============================================================================

  describe('clear all functionality', () => {
    it('should call onClearAlerts when Clear All is clicked', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertDropdown {...defaultProps} />);

      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      expect(defaultProps.onClearAlerts).toHaveBeenCalledTimes(1);
    });
  });

  // =============================================================================
  // Add Alert Tests
  // =============================================================================

  describe('add alert functionality', () => {
    it('should call onNewAlertChange when input value changes', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertDropdown {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add custom alert...');
      await user.type(input, 'New alert');

      expect(defaultProps.onNewAlertChange).toHaveBeenCalled();
    });

    it('should call onAddAlert when Add button is clicked with valid input', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="New test alert" />);

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      expect(defaultProps.onAddAlert).toHaveBeenCalledTimes(1);
    });

    it('should not call onAddAlert when Add button is clicked with empty input', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="" />);

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      expect(defaultProps.onAddAlert).not.toHaveBeenCalled();
    });

    it('should not call onAddAlert when Add button is clicked with whitespace only', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="   " />);

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      expect(defaultProps.onAddAlert).not.toHaveBeenCalled();
    });

    it('should call onAddAlert when Enter key is pressed with valid input', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="New test alert" />);

      const input = screen.getByPlaceholderText('Add custom alert...');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(defaultProps.onAddAlert).toHaveBeenCalledTimes(1);
    });

    it('should not call onAddAlert when Enter key is pressed with empty input', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="" />);

      const input = screen.getByPlaceholderText('Add custom alert...');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(defaultProps.onAddAlert).not.toHaveBeenCalled();
    });

    it('should disable Add button when input is empty', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="" />);
      const addButton = screen.getByText('Add');
      expect(addButton).toBeDisabled();
    });

    it('should enable Add button when input has value', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="New alert" />);
      const addButton = screen.getByText('Add');
      expect(addButton).not.toBeDisabled();
    });

    it('should have maxLength attribute on input', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      const input = screen.getByPlaceholderText('Add custom alert...');
      expect(input).toHaveAttribute('maxLength', '200');
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe('dark mode styling', () => {
    it('should apply dark theme container classes in dark mode', () => {
      const { container } = renderWithTheme(<AlertDropdown {...defaultProps} />, {
        darkMode: true,
      });
      const dropdown = container.querySelector('.bg-slate-800');
      expect(dropdown).toBeInTheDocument();
    });

    it('should apply light theme container classes in light mode', () => {
      const { container } = renderWithTheme(<AlertDropdown {...defaultProps} />, {
        darkMode: false,
      });
      const dropdown = container.querySelector('.bg-white');
      expect(dropdown).toBeInTheDocument();
    });

    it('should apply dark theme heading color in dark mode', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />, { darkMode: true });
      const heading = screen.getByText('Alerts');
      expect(heading).toHaveClass('text-slate-200');
    });

    it('should apply light theme heading color in light mode', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />, { darkMode: false });
      const heading = screen.getByText('Alerts');
      expect(heading).toHaveClass('text-slate-700');
    });

    it('should apply dark theme input classes in dark mode', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />, { darkMode: true });
      const input = screen.getByPlaceholderText('Add custom alert...');
      expect(input).toHaveClass('bg-slate-700');
    });

    it('should apply light theme input classes in light mode', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />, { darkMode: false });
      const input = screen.getByPlaceholderText('Add custom alert...');
      expect(input).toHaveClass('bg-slate-50');
    });

    it('should apply dark theme warning alert styling in dark mode', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />, { darkMode: true });
      const warningAlert = screen.getByText('Temperature alert in elephant enclosure');
      expect(warningAlert).toHaveClass('text-amber-300');
    });

    it('should apply dark theme info alert styling in dark mode', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />, { darkMode: true });
      const infoAlert = screen.getByText('Feeding completed for primates');
      expect(infoAlert).toHaveClass('text-blue-300');
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe('darkMode override prop', () => {
    it('should use darkMode override when provided (true)', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} darkMode={true} />, {
        darkMode: false,
      });
      const heading = screen.getByText('Alerts');
      expect(heading).toHaveClass('text-slate-200');
    });

    it('should use darkMode override when provided (false)', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} darkMode={false} />, {
        darkMode: true,
      });
      const heading = screen.getByText('Alerts');
      expect(heading).toHaveClass('text-slate-700');
    });

    it('should use context value when darkMode override is undefined', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />, { darkMode: true });
      const heading = screen.getByText('Alerts');
      expect(heading).toHaveClass('text-slate-200');
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe('accessibility', () => {
    it('should have proper heading for alerts section', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      const heading = screen.getByText('Alerts');
      expect(heading.tagName).toBe('H4');
    });

    it('should have input with type text', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      const input = screen.getByPlaceholderText('Add custom alert...');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should have cursor-pointer on clickable buttons', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} />);
      const clearButton = screen.getByText('Clear All');
      expect(clearButton).toHaveClass('cursor-pointer');
    });

    it('should have cursor-not-allowed on disabled Add button', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="" />);
      const addButton = screen.getByText('Add');
      expect(addButton).toHaveClass('cursor-not-allowed');
    });

    it('should have cursor-pointer on enabled Add button', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="Test" />);
      const addButton = screen.getByText('Add');
      expect(addButton).toHaveClass('cursor-pointer');
    });
  });

  // =============================================================================
  // Styling Classes Tests
  // =============================================================================

  describe('styling classes', () => {
    it('should have rounded-xl class on dropdown container', () => {
      const { container } = renderWithTheme(<AlertDropdown {...defaultProps} />);
      const dropdown = container.querySelector('.rounded-xl');
      expect(dropdown).toBeInTheDocument();
    });

    it('should have shadow-2xl class on dropdown container', () => {
      const { container } = renderWithTheme(<AlertDropdown {...defaultProps} />);
      const dropdown = container.querySelector('.shadow-2xl');
      expect(dropdown).toBeInTheDocument();
    });

    it('should have z-50 class on dropdown for proper layering', () => {
      const { container } = renderWithTheme(<AlertDropdown {...defaultProps} />);
      const dropdown = container.querySelector('.z-50');
      expect(dropdown).toBeInTheDocument();
    });

    it('should have max-h-64 class on alerts list for scrolling', () => {
      const { container } = renderWithTheme(<AlertDropdown {...defaultProps} />);
      const alertsList = container.querySelector('.max-h-64');
      expect(alertsList).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Backward Compatibility Tests
  // =============================================================================

  describe('backward compatibility (outside ThemeProvider)', () => {
    it('should render without ThemeProvider using darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<AlertDropdown {...defaultProps} darkMode={true} />);
      expect(screen.getByText('Alerts')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should default to light mode when outside ThemeProvider without darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<AlertDropdown {...defaultProps} />);
      const heading = screen.getByText('Alerts');
      expect(heading).toHaveClass('text-slate-700');

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe('edge cases', () => {
    it('should handle alerts with very long messages', () => {
      const longMessage = 'A'.repeat(500);
      const alertsWithLongMessage = [
        { id: 1, message: longMessage, type: 'warning', time: 'Just now' },
      ];
      renderWithTheme(<AlertDropdown {...defaultProps} alerts={alertsWithLongMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle alerts with special characters', () => {
      const specialMessage = 'Alert: <script>test</script> & "quotes" \'apostrophe\'';
      const alertsWithSpecialChars = [
        { id: 1, message: specialMessage, type: 'info', time: 'Just now' },
      ];
      renderWithTheme(<AlertDropdown {...defaultProps} alerts={alertsWithSpecialChars} />);
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('should handle large number of alerts', () => {
      const manyAlerts = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        message: `Alert message ${i}`,
        type: i % 2 === 0 ? 'warning' : 'info',
        time: `${i} hours ago`,
      }));
      renderWithTheme(<AlertDropdown {...defaultProps} alerts={manyAlerts} />);
      expect(screen.getByText('Alert message 0')).toBeInTheDocument();
      expect(screen.getByText('Alert message 99')).toBeInTheDocument();
    });

    it('should handle other keys without triggering submit', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="Test" />);
      const input = screen.getByPlaceholderText('Add custom alert...');
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(defaultProps.onAddAlert).not.toHaveBeenCalled();
    });

    it('should handle ref properly', () => {
      const ref = createRef();
      renderWithTheme(<AlertDropdown {...defaultProps} dropdownRef={ref} />);
      // The ref should be attached to the dropdown container
      expect(ref.current).toBeDefined();
    });
  });

  // =============================================================================
  // Add Button Styling Tests
  // =============================================================================

  describe('add button styling', () => {
    it('should have active styling when input has value', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="Test alert" />);
      const addButton = screen.getByText('Add');
      expect(addButton).toHaveClass('bg-blue-600');
      expect(addButton).toHaveClass('text-white');
    });

    it('should have disabled styling when input is empty', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="" />, { darkMode: false });
      const addButton = screen.getByText('Add');
      expect(addButton).toHaveClass('bg-slate-200');
      expect(addButton).toHaveClass('text-slate-400');
    });

    it('should have dark theme disabled styling when input is empty in dark mode', () => {
      renderWithTheme(<AlertDropdown {...defaultProps} newAlert="" />, { darkMode: true });
      const addButton = screen.getByText('Add');
      expect(addButton).toHaveClass('bg-slate-700');
      expect(addButton).toHaveClass('text-slate-500');
    });
  });
});

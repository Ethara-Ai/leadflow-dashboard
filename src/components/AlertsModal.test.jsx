/**
 * Unit Tests for AlertsModal Component
 * Tests the alerts modal with add/clear functionality and accessibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertsModal from './AlertsModal';
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
  {
    id: 2,
    message: 'Feeding completed for primates',
    type: 'info',
    time: '2 hours ago',
  },
  {
    id: 3,
    message: 'Low stock alert: Vitamin supplements',
    type: 'warning',
    time: '3 hours ago',
  },
];

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  alerts: mockAlerts,
  onAddAlert: vi.fn(),
  onClearAlerts: vi.fn(),
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
    article: ({ children, className, ...props }) => (
      <article className={className} {...props}>
        {children}
      </article>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// =============================================================================
// Test Suite
// =============================================================================

describe('AlertsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Basic Rendering Tests
  // ===========================================================================

  describe('basic rendering', () => {
    it('should render modal when isOpen is true', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      renderWithTheme(<AlertsModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render Lead Alerts title', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByText('Lead Alerts')).toBeInTheDocument();
    });

    it('should render alert count badge', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render close button', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByLabelText('Close alerts modal')).toBeInTheDocument();
    });

    it('should render all alerts', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByText('Temperature alert in elephant enclosure')).toBeInTheDocument();
      expect(screen.getByText('Feeding completed for primates')).toBeInTheDocument();
      expect(screen.getByText('Low stock alert: Vitamin supplements')).toBeInTheDocument();
    });

    it('should render add alert input', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByPlaceholderText('Add custom alert...')).toBeInTheDocument();
    });

    it('should render Add button', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByText('Add')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Empty State Tests
  // ===========================================================================

  describe('empty state', () => {
    it('should show empty state message when no alerts', () => {
      renderWithTheme(<AlertsModal {...defaultProps} alerts={[]} />);
      expect(screen.getByText('No current alerts')).toBeInTheDocument();
    });

    it('should show encouraging message when no alerts', () => {
      renderWithTheme(<AlertsModal {...defaultProps} alerts={[]} />);
      expect(screen.getByText('All leads are being properly managed!')).toBeInTheDocument();
    });

    it('should show count badge with 0 when no alerts', () => {
      renderWithTheme(<AlertsModal {...defaultProps} alerts={[]} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should not show Clear All button when no alerts', () => {
      renderWithTheme(<AlertsModal {...defaultProps} alerts={[]} />);
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Close Modal Tests
  // ===========================================================================

  describe('close modal', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const closeButton = screen.getByLabelText('Close alerts modal');
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const backdrop = screen.getByRole('presentation');
      await user.click(backdrop);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should not close when clicking inside modal content', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const title = screen.getByText('Lead Alerts');
      await user.click(title);

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Add Alert Tests
  // ===========================================================================

  describe('add alert functionality', () => {
    it('should call onAddAlert when Add button is clicked with valid input', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add custom alert...');
      await user.type(input, 'New test alert');

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      expect(defaultProps.onAddAlert).toHaveBeenCalledWith('New test alert');
    });

    it('should clear input after adding alert', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add custom alert...');
      await user.type(input, 'New test alert');

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      expect(input).toHaveValue('');
    });

    it('should not call onAddAlert when input is empty', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      expect(defaultProps.onAddAlert).not.toHaveBeenCalled();
    });

    it('should not call onAddAlert when input has only whitespace', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add custom alert...');
      await user.type(input, '   ');

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      expect(defaultProps.onAddAlert).not.toHaveBeenCalled();
    });

    it('should call onAddAlert when Enter is pressed with valid input', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add custom alert...');
      await user.type(input, 'New test alert{Enter}');

      expect(defaultProps.onAddAlert).toHaveBeenCalledWith('New test alert');
    });

    it('should disable Add button when input is empty', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const addButton = screen.getByText('Add');
      expect(addButton).toBeDisabled();
    });

    it('should enable Add button when input has text', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add custom alert...');
      await user.type(input, 'Test');

      const addButton = screen.getByText('Add');
      expect(addButton).not.toBeDisabled();
    });
  });

  // ===========================================================================
  // Clear Alerts Tests
  // ===========================================================================

  describe('clear alerts functionality', () => {
    it('should show Clear All button when alerts exist', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should call onClearAlerts when Clear All is clicked', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      expect(defaultProps.onClearAlerts).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================================
  // Dark Mode Styling Tests
  // ===========================================================================

  describe('dark mode styling', () => {
    it('should apply dark theme modal classes in dark mode', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />, { darkMode: true });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('bg-slate-800/95');
    });

    it('should apply light theme modal classes in light mode', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />, { darkMode: false });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('bg-white/95');
    });

    it('should apply dark theme title color in dark mode', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />, { darkMode: true });
      const title = screen.getByText('Lead Alerts');
      expect(title).toHaveClass('text-slate-200');
    });

    it('should apply light theme title color in light mode', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />, { darkMode: false });
      const title = screen.getByText('Lead Alerts');
      expect(title).toHaveClass('text-slate-700');
    });

    it('should apply dark theme input styling in dark mode', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />, { darkMode: true });
      const input = screen.getByPlaceholderText('Add custom alert...');
      expect(input).toHaveClass('bg-slate-700');
    });

    it('should apply light theme input styling in light mode', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />, { darkMode: false });
      const input = screen.getByPlaceholderText('Add custom alert...');
      expect(input).toHaveClass('bg-slate-50');
    });

    it('should apply amber badge styling when alerts exist in dark mode', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />, { darkMode: true });
      const badge = screen.getByText('3');
      expect(badge).toHaveClass('bg-amber-900/40');
    });

    it('should apply amber badge styling when alerts exist in light mode', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />, { darkMode: false });
      const badge = screen.getByText('3');
      expect(badge).toHaveClass('bg-amber-100');
    });
  });

  // ===========================================================================
  // DarkMode Override Prop Tests
  // ===========================================================================

  describe('darkMode override prop', () => {
    it('should use darkMode override when provided (true)', () => {
      renderWithTheme(<AlertsModal {...defaultProps} darkMode={true} />, {
        darkMode: false,
      });
      const title = screen.getByText('Lead Alerts');
      expect(title).toHaveClass('text-slate-200');
    });

    it('should use darkMode override when provided (false)', () => {
      renderWithTheme(<AlertsModal {...defaultProps} darkMode={false} />, {
        darkMode: true,
      });
      const title = screen.getByText('Lead Alerts');
      expect(title).toHaveClass('text-slate-700');
    });
  });

  // ===========================================================================
  // Accessibility Tests
  // ===========================================================================

  describe('accessibility', () => {
    it('should have role dialog', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'alerts-modal-title');
    });

    it('should have screen reader description', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByText(/Lead alerts management modal/)).toBeInTheDocument();
    });

    it('should have accessible name for close button', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByLabelText('Close alerts modal')).toBeInTheDocument();
    });

    it('should have accessible name for clear button', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByLabelText('Clear all alerts')).toBeInTheDocument();
    });

    it('should have label for input field', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByLabelText('Add custom alert')).toBeInTheDocument();
    });

    it('should render alerts list with log role', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const alertsList = screen.getByRole('log');
      expect(alertsList).toBeInTheDocument();
    });

    it('should have aria-live on alerts list', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const alertsList = screen.getByRole('log');
      expect(alertsList).toHaveAttribute('aria-live', 'polite');
    });
  });

  // ===========================================================================
  // Styling Classes Tests
  // ===========================================================================

  describe('styling classes', () => {
    it('should have backdrop-blur-md class on modal', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('backdrop-blur-md');
    });

    it('should have rounded corners', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('rounded-2xl');
    });

    it('should have shadow styling', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('shadow-2xl');
    });

    it('should have max-width constraint', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-lg');
    });

    it('should have max-height constraint', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-h-[95vh]');
    });

    it('should have backdrop blur on overlay', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      const backdrop = screen.getByRole('presentation');
      expect(backdrop).toHaveClass('backdrop-blur-sm');
    });
  });

  // ===========================================================================
  // Edge Cases Tests
  // ===========================================================================

  describe('edge cases', () => {
    it('should handle large number of alerts', () => {
      const manyAlerts = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        message: `Alert ${i + 1}`,
        type: i % 2 === 0 ? 'warning' : 'info',
        time: `${i} hours ago`,
      }));
      renderWithTheme(<AlertsModal {...defaultProps} alerts={manyAlerts} />);
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should handle alerts with very long messages', () => {
      const longMessage = 'A'.repeat(500);
      const alertsWithLongMessage = [{ id: 1, message: longMessage, type: 'warning', time: 'now' }];
      renderWithTheme(<AlertsModal {...defaultProps} alerts={alertsWithLongMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle alerts with special characters', () => {
      const specialMessage = '<script>alert("xss")</script> & "quotes" \'single\' <tag>';
      const alertsWithSpecialChars = [
        { id: 1, message: specialMessage, type: 'info', time: 'now' },
      ];
      renderWithTheme(<AlertsModal {...defaultProps} alerts={alertsWithSpecialChars} />);
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('should handle input with maximum length', async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add custom alert...');
      const longText = 'A'.repeat(250);
      await user.type(input, longText);

      // Should be limited to maxLength (200)
      expect(input.value.length).toBeLessThanOrEqual(200);
    });
  });

  // ===========================================================================
  // Backward Compatibility Tests
  // ===========================================================================

  describe('backward compatibility (outside ThemeProvider)', () => {
    it('should render without ThemeProvider using darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<AlertsModal {...defaultProps} darkMode={true} />);
      expect(screen.getByText('Lead Alerts')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should default to light mode when outside ThemeProvider without darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<AlertsModal {...defaultProps} />);
      const title = screen.getByText('Lead Alerts');
      expect(title).toHaveClass('text-slate-700');

      consoleSpy.mockRestore();
    });
  });
});

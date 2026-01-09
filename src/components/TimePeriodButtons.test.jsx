/**
 * Unit Tests for TimePeriodButtons Component
 * Tests the time period selection button group with theme support
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimePeriodButtons from './TimePeriodButtons';
import ThemeProvider from '../hooks/ThemeProvider';

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const defaultProps = {
  currentPeriod: 'week',
  onPeriodChange: vi.fn(),
};

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, className, onClick, ...props }) => (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
}));

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe('TimePeriodButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render all default time period buttons', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
    });

    it('should render exactly 3 buttons by default', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('should capitalize first letter of period labels', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.queryByText('week')).not.toBeInTheDocument();
    });
  });

  // =============================================================================
  // Period Selection Tests
  // =============================================================================

  describe('period selection', () => {
    it("should call onPeriodChange with 'week' when Week button is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="month" />);

      await user.click(screen.getByText('Week'));
      expect(defaultProps.onPeriodChange).toHaveBeenCalledWith('week');
    });

    it("should call onPeriodChange with 'month' when Month button is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);

      await user.click(screen.getByText('Month'));
      expect(defaultProps.onPeriodChange).toHaveBeenCalledWith('month');
    });

    it("should call onPeriodChange with 'year' when Year button is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);

      await user.click(screen.getByText('Year'));
      expect(defaultProps.onPeriodChange).toHaveBeenCalledWith('year');
    });

    it('should call onPeriodChange even when clicking the already selected period', async () => {
      const user = userEvent.setup();
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />);

      await user.click(screen.getByText('Week'));
      expect(defaultProps.onPeriodChange).toHaveBeenCalledWith('week');
    });
  });

  // =============================================================================
  // Active Button Styling Tests
  // =============================================================================

  describe('active button styling', () => {
    it('should apply active styling to currently selected period', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />);
      const weekButton = screen.getByText('Week');
      expect(weekButton).toHaveClass('bg-blue-600');
      expect(weekButton).toHaveClass('text-white');
    });

    it('should not apply active styling to non-selected periods', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />);
      const monthButton = screen.getByText('Month');
      expect(monthButton).not.toHaveClass('bg-blue-600');
      expect(monthButton).not.toHaveClass('text-white');
    });

    it('should update active styling when currentPeriod changes', () => {
      const { rerender } = renderWithTheme(
        <TimePeriodButtons {...defaultProps} currentPeriod="week" />
      );

      expect(screen.getByText('Week')).toHaveClass('bg-blue-600');
      expect(screen.getByText('Month')).not.toHaveClass('bg-blue-600');

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <TimePeriodButtons {...defaultProps} currentPeriod="month" />
        </ThemeProvider>
      );

      expect(screen.getByText('Week')).not.toHaveClass('bg-blue-600');
      expect(screen.getByText('Month')).toHaveClass('bg-blue-600');
    });

    it('should have shadow on active button', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />);
      const weekButton = screen.getByText('Week');
      expect(weekButton).toHaveClass('shadow-lg');
    });
  });

  // =============================================================================
  // Custom Periods Tests
  // =============================================================================

  describe('custom periods', () => {
    it('should render custom periods when provided', () => {
      const customPeriods = ['day', 'week', 'month', 'quarter', 'year'];
      renderWithTheme(<TimePeriodButtons {...defaultProps} periods={customPeriods} />);

      expect(screen.getByText('Day')).toBeInTheDocument();
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Quarter')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
    });

    it('should render correct number of custom period buttons', () => {
      const customPeriods = ['day', 'week'];
      renderWithTheme(<TimePeriodButtons {...defaultProps} periods={customPeriods} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('should call onPeriodChange with custom period value', async () => {
      const user = userEvent.setup();
      const customPeriods = ['day', 'week', 'month'];
      renderWithTheme(<TimePeriodButtons {...defaultProps} periods={customPeriods} />);

      await user.click(screen.getByText('Day'));
      expect(defaultProps.onPeriodChange).toHaveBeenCalledWith('day');
    });

    it('should handle single period', () => {
      const customPeriods = ['week'];
      renderWithTheme(<TimePeriodButtons {...defaultProps} periods={customPeriods} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(screen.getByText('Week')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe('dark mode styling', () => {
    it('should apply dark theme inactive button styling in dark mode', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />, {
        darkMode: true,
      });
      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveClass('text-slate-400');
    });

    it('should apply light theme inactive button styling in light mode', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />, {
        darkMode: false,
      });
      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveClass('text-slate-600');
    });

    it('should apply dark theme hover styling in dark mode', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />, {
        darkMode: true,
      });
      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveClass('hover:text-slate-200');
      expect(monthButton).toHaveClass('hover:bg-slate-700/50');
    });

    it('should apply light theme hover styling in light mode', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />, {
        darkMode: false,
      });
      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveClass('hover:text-slate-800');
      expect(monthButton).toHaveClass('hover:bg-slate-100');
    });

    it('should maintain active button styling regardless of theme', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />, {
        darkMode: true,
      });
      const weekButton = screen.getByText('Week');
      expect(weekButton).toHaveClass('bg-blue-600');
      expect(weekButton).toHaveClass('text-white');
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe('darkMode override prop', () => {
    it('should use darkMode override when provided (true)', () => {
      renderWithTheme(
        <TimePeriodButtons {...defaultProps} currentPeriod="week" darkMode={true} />,
        { darkMode: false }
      );
      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveClass('text-slate-400');
    });

    it('should use darkMode override when provided (false)', () => {
      renderWithTheme(
        <TimePeriodButtons {...defaultProps} currentPeriod="week" darkMode={false} />,
        { darkMode: true }
      );
      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveClass('text-slate-600');
    });

    it('should use context value when darkMode override is undefined', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />, {
        darkMode: true,
      });
      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveClass('text-slate-400');
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe('accessibility', () => {
    it('should render buttons with button role', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('should have cursor-pointer on all buttons', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const weekButton = screen.getByText('Week');
      const monthButton = screen.getByText('Month');
      const yearButton = screen.getByText('Year');

      expect(weekButton).toHaveClass('cursor-pointer');
      expect(monthButton).toHaveClass('cursor-pointer');
      expect(yearButton).toHaveClass('cursor-pointer');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);

      const weekButton = screen.getByText('Week');
      weekButton.focus();

      await user.keyboard('{Enter}');
      expect(defaultProps.onPeriodChange).toHaveBeenCalled();
    });
  });

  // =============================================================================
  // Responsive Classes Tests
  // =============================================================================

  describe('responsive classes', () => {
    it('should have responsive padding classes', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const button = screen.getByText('Week');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('sm:px-4');
    });

    it('should have responsive text sizes', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const button = screen.getByText('Week');
      expect(button).toHaveClass('text-xs');
      expect(button).toHaveClass('sm:text-sm');
    });

    it('should have responsive flex behavior on container', () => {
      const { container } = renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const buttonContainer = container.firstChild;
      expect(buttonContainer).toHaveClass('flex');
      expect(buttonContainer).toHaveClass('w-full');
      expect(buttonContainer).toHaveClass('sm:w-auto');
    });

    it('should have flex-1 on buttons for small screens', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const button = screen.getByText('Week');
      expect(button).toHaveClass('flex-1');
      expect(button).toHaveClass('sm:flex-none');
    });
  });

  // =============================================================================
  // Styling Classes Tests
  // =============================================================================

  describe('styling classes', () => {
    it('should have rounded corners on buttons', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const button = screen.getByText('Week');
      expect(button).toHaveClass('rounded-xl');
    });

    it('should have transition classes for animations', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const button = screen.getByText('Week');
      expect(button).toHaveClass('transition-all');
      expect(button).toHaveClass('duration-200');
    });

    it('should have font-medium class', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const button = screen.getByText('Week');
      expect(button).toHaveClass('font-medium');
    });

    it('should have space between buttons', () => {
      const { container } = renderWithTheme(<TimePeriodButtons {...defaultProps} />);
      const buttonContainer = container.firstChild;
      expect(buttonContainer).toHaveClass('space-x-2');
    });
  });

  // =============================================================================
  // Backward Compatibility Tests
  // =============================================================================

  describe('backward compatibility (outside ThemeProvider)', () => {
    it('should render without ThemeProvider using darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<TimePeriodButtons {...defaultProps} darkMode={true} />);
      expect(screen.getByText('Week')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should default to light mode when outside ThemeProvider without darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<TimePeriodButtons {...defaultProps} currentPeriod="week" />);
      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveClass('text-slate-600');

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe('edge cases', () => {
    it('should handle empty periods array', () => {
      const { container } = renderWithTheme(<TimePeriodButtons {...defaultProps} periods={[]} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(0);
    });

    it('should handle unknown currentPeriod', () => {
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="unknown" />);
      // All buttons should be in non-active state
      const weekButton = screen.getByText('Week');
      const monthButton = screen.getByText('Month');
      const yearButton = screen.getByText('Year');

      expect(weekButton).not.toHaveClass('bg-blue-600');
      expect(monthButton).not.toHaveClass('bg-blue-600');
      expect(yearButton).not.toHaveClass('bg-blue-600');
    });

    it('should handle rapid clicks on different buttons', async () => {
      const user = userEvent.setup();
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);

      await user.click(screen.getByText('Week'));
      await user.click(screen.getByText('Month'));
      await user.click(screen.getByText('Year'));

      expect(defaultProps.onPeriodChange).toHaveBeenCalledTimes(3);
      expect(defaultProps.onPeriodChange).toHaveBeenNthCalledWith(1, 'week');
      expect(defaultProps.onPeriodChange).toHaveBeenNthCalledWith(2, 'month');
      expect(defaultProps.onPeriodChange).toHaveBeenNthCalledWith(3, 'year');
    });

    it('should handle periods with special formatting needs', () => {
      const customPeriods = ['last-week', 'this_month', 'YEAR'];
      renderWithTheme(<TimePeriodButtons {...defaultProps} periods={customPeriods} />);

      expect(screen.getByText('Last-week')).toBeInTheDocument();
      expect(screen.getByText('This_month')).toBeInTheDocument();
      expect(screen.getByText('YEAR')).toBeInTheDocument();
    });

    it('should handle very long period names', () => {
      const customPeriods = ['verylongperiodname'];
      renderWithTheme(<TimePeriodButtons {...defaultProps} periods={customPeriods} />);

      expect(screen.getByText('Verylongperiodname')).toBeInTheDocument();
    });

    it('should handle single character period names', () => {
      const customPeriods = ['d', 'w', 'm'];
      renderWithTheme(
        <TimePeriodButtons {...defaultProps} periods={customPeriods} currentPeriod="d" />
      );

      expect(screen.getByText('D')).toBeInTheDocument();
      expect(screen.getByText('W')).toBeInTheDocument();
      expect(screen.getByText('M')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Multiple Clicks Tests
  // =============================================================================

  describe('multiple interactions', () => {
    it('should handle double click on same button', async () => {
      const user = userEvent.setup();
      renderWithTheme(<TimePeriodButtons {...defaultProps} currentPeriod="week" />);

      await user.dblClick(screen.getByText('Week'));
      expect(defaultProps.onPeriodChange).toHaveBeenCalledTimes(2);
    });

    it('should handle alternating clicks between two periods', async () => {
      const user = userEvent.setup();
      renderWithTheme(<TimePeriodButtons {...defaultProps} />);

      await user.click(screen.getByText('Week'));
      await user.click(screen.getByText('Month'));
      await user.click(screen.getByText('Week'));
      await user.click(screen.getByText('Month'));

      expect(defaultProps.onPeriodChange).toHaveBeenCalledTimes(4);
    });
  });
});

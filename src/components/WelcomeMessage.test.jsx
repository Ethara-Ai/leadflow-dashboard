/**
 * Unit Tests for WelcomeMessage Component
 * Tests the dismissible welcome banner with theme support
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WelcomeMessage from './WelcomeMessage';
import ThemeProvider from '../hooks/ThemeProvider';

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const defaultProps = {
  show: true,
  onClose: vi.fn(),
};

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    button: ({ children, className, onClick, ...props }) => (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe('WelcomeMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render when show is true', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />);
      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();
    });

    it('should not render when show is false', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} show={false} />);
      expect(screen.queryByText('Welcome back, John Doe!')).not.toBeInTheDocument();
    });

    it('should render the welcome title', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />);
      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();
    });

    it('should render the welcome description', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />);
      expect(
        screen.getByText("Here's the current status of your leads and sales pipeline")
      ).toBeInTheDocument();
    });

    it('should render the Info icon', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render the close button', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const closeButton = container.querySelector('button');
      expect(closeButton).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Close Button Tests
  // =============================================================================

  describe('close functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);

      const closeButton = container.querySelector('button');
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should only call onClose once per click', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);

      const closeButton = container.querySelector('button');
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple clicks on close button', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);

      const closeButton = container.querySelector('button');
      await user.click(closeButton);
      await user.click(closeButton);
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(3);
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe('dark mode styling', () => {
    it('should apply dark theme background in dark mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: true,
      });
      const banner = container.firstChild;
      expect(banner).toHaveClass('bg-blue-900/20');
    });

    it('should apply light theme background in light mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: false,
      });
      const banner = container.firstChild;
      expect(banner).toHaveClass('bg-blue-50');
    });

    it('should apply dark theme border in dark mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: true,
      });
      const banner = container.firstChild;
      expect(banner).toHaveClass('border-blue-800/30');
    });

    it('should apply light theme border in light mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: false,
      });
      const banner = container.firstChild;
      expect(banner).toHaveClass('border-blue-200');
    });

    it('should apply dark theme title color in dark mode', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />, { darkMode: true });
      const title = screen.getByText('Welcome back, John Doe!');
      expect(title).toHaveClass('text-slate-200');
    });

    it('should apply light theme title color in light mode', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: false,
      });
      const title = screen.getByText('Welcome back, John Doe!');
      expect(title).toHaveClass('text-slate-700');
    });

    it('should apply dark theme description color in dark mode', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />, { darkMode: true });
      const description = screen.getByText(
        "Here's the current status of your leads and sales pipeline"
      );
      expect(description).toHaveClass('text-slate-400');
    });

    it('should apply light theme description color in light mode', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: false,
      });
      const description = screen.getByText(
        "Here's the current status of your leads and sales pipeline"
      );
      expect(description).toHaveClass('text-slate-600');
    });

    it('should apply dark theme icon container background in dark mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: true,
      });
      const iconContainer = container.querySelector('.bg-blue-800\\/30');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply light theme icon container background in light mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: false,
      });
      const iconContainer = container.querySelector('.bg-blue-100');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply dark theme icon color in dark mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: true,
      });
      const icon = container.querySelector('.text-blue-400');
      expect(icon).toBeInTheDocument();
    });

    it('should apply light theme icon color in light mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: false,
      });
      const icon = container.querySelector('.text-blue-600');
      expect(icon).toBeInTheDocument();
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe('darkMode override prop', () => {
    it('should use darkMode override when provided (true)', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} darkMode={true} />, {
        darkMode: false,
      });
      const banner = container.firstChild;
      expect(banner).toHaveClass('bg-blue-900/20');
    });

    it('should use darkMode override when provided (false)', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} darkMode={false} />, {
        darkMode: true,
      });
      const banner = container.firstChild;
      expect(banner).toHaveClass('bg-blue-50');
    });

    it('should use context value when darkMode override is undefined', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: true,
      });
      const banner = container.firstChild;
      expect(banner).toHaveClass('bg-blue-900/20');
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe('accessibility', () => {
    it('should have proper heading structure for title', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const title = screen.getByText('Welcome back, John Doe!');
      expect(title.tagName).toBe('H3');
    });

    it('should have proper paragraph element for description', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const description = screen.getByText(
        "Here's the current status of your leads and sales pipeline"
      );
      expect(description.tagName).toBe('P');
    });

    it('should have clickable close button', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const closeButton = container.querySelector('button');
      expect(closeButton).toHaveClass('cursor-pointer');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);

      const closeButton = container.querySelector('button');
      closeButton.focus();

      await user.keyboard('{Enter}');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  // =============================================================================
  // Responsive Classes Tests
  // =============================================================================

  describe('responsive classes', () => {
    it('should have responsive margin classes', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const banner = container.firstChild;
      expect(banner).toHaveClass('mb-4');
      expect(banner).toHaveClass('sm:mb-6');
      expect(banner).toHaveClass('md:mb-8');
    });

    it('should have responsive padding classes', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const banner = container.firstChild;
      expect(banner).toHaveClass('p-3');
      expect(banner).toHaveClass('sm:p-4');
      expect(banner).toHaveClass('md:p-4');
    });

    it('should have responsive text sizes for title', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const title = screen.getByText('Welcome back, John Doe!');
      expect(title).toHaveClass('text-sm');
      expect(title).toHaveClass('sm:text-base');
      expect(title).toHaveClass('md:text-lg');
    });

    it('should have responsive text sizes for description', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const description = screen.getByText(
        "Here's the current status of your leads and sales pipeline"
      );
      expect(description).toHaveClass('text-xs');
      expect(description).toHaveClass('sm:text-sm');
    });

    it('should have responsive icon container padding', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const iconContainers = container.querySelectorAll("[class*='p-2']");
      expect(iconContainers.length).toBeGreaterThan(0);
    });

    it('should have responsive rounded corners', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const banner = container.firstChild;
      expect(banner).toHaveClass('rounded-xl');
      expect(banner).toHaveClass('sm:rounded-2xl');
    });
  });

  // =============================================================================
  // Styling Classes Tests
  // =============================================================================

  describe('styling classes', () => {
    it('should have border class', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const banner = container.firstChild;
      expect(banner).toHaveClass('border');
    });

    it('should have flex layout for content', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have proper spacing between icon and text', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const iconContainer = container.querySelector("[class*='mr-']");
      expect(iconContainer).toBeInTheDocument();
    });

    it('should have font-bold on title', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const title = screen.getByText('Welcome back, John Doe!');
      expect(title).toHaveClass('font-bold');
    });
  });

  // =============================================================================
  // Close Button Styling Tests
  // =============================================================================

  describe('close button styling', () => {
    it('should have dark theme close button styling in dark mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: true,
      });
      const closeButton = container.querySelector('button');
      expect(closeButton).toHaveClass('text-slate-400');
      expect(closeButton).toHaveClass('hover:text-slate-200');
    });

    it('should have light theme close button styling in light mode', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />, {
        darkMode: false,
      });
      const closeButton = container.querySelector('button');
      expect(closeButton).toHaveClass('text-slate-500');
      expect(closeButton).toHaveClass('hover:text-slate-700');
    });

    it('should have rounded corners on close button', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const closeButton = container.querySelector('button');
      expect(closeButton).toHaveClass('rounded-md');
    });

    it('should have transition classes on close button', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} />);
      const closeButton = container.querySelector('button');
      expect(closeButton).toHaveClass('transition-colors');
    });
  });

  // =============================================================================
  // Backward Compatibility Tests
  // =============================================================================

  describe('backward compatibility (outside ThemeProvider)', () => {
    it('should render without ThemeProvider using darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<WelcomeMessage {...defaultProps} darkMode={true} />);
      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should default to light mode when outside ThemeProvider without darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(<WelcomeMessage {...defaultProps} />);
      const banner = container.firstChild;
      expect(banner).toHaveClass('bg-blue-50');

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe('edge cases', () => {
    it('should handle show prop changing from true to false', () => {
      const { rerender } = renderWithTheme(<WelcomeMessage {...defaultProps} show={true} />);
      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <WelcomeMessage {...defaultProps} show={false} />
        </ThemeProvider>
      );
      expect(screen.queryByText('Welcome back, John Doe!')).not.toBeInTheDocument();
    });

    it('should handle show prop changing from false to true', () => {
      const { rerender } = renderWithTheme(<WelcomeMessage {...defaultProps} show={false} />);
      expect(screen.queryByText('Welcome back, John Doe!')).not.toBeInTheDocument();

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <WelcomeMessage {...defaultProps} show={true} />
        </ThemeProvider>
      );
      expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument();
    });

    it('should handle undefined show prop (falsy)', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} show={undefined} />);
      expect(screen.queryByText('Welcome back, John Doe!')).not.toBeInTheDocument();
    });

    it('should handle null show prop (falsy)', () => {
      renderWithTheme(<WelcomeMessage {...defaultProps} show={null} />);
      expect(screen.queryByText('Welcome back, John Doe!')).not.toBeInTheDocument();
    });

    it('should handle onClose being called rapidly', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const { container } = renderWithTheme(<WelcomeMessage show={true} onClose={onClose} />);

      const closeButton = container.querySelector('button');

      // Rapid clicks
      await user.click(closeButton);
      await user.click(closeButton);
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(3);
    });
  });

  // =============================================================================
  // Return Value Tests
  // =============================================================================

  describe('return value', () => {
    it('should return null when show is false', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} show={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return content when show is true', () => {
      const { container } = renderWithTheme(<WelcomeMessage {...defaultProps} show={true} />);
      expect(container.firstChild).not.toBeNull();
    });
  });
});

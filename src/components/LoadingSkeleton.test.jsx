/**
 * Unit Tests for LoadingSkeleton Component
 * Tests the skeleton loading state display with theme support
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import LoadingSkeleton from './LoadingSkeleton';
import ThemeProvider from '../hooks/ThemeProvider';

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe('LoadingSkeleton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render the loading skeleton', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render stat card skeletons', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statSkeletons = container.querySelectorAll('.h-28, .sm\\:h-32');
      expect(statSkeletons.length).toBeGreaterThan(0);
    });

    it('should render chart skeletons', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartSkeletons = container.querySelectorAll('.h-72, .sm\\:h-80');
      expect(chartSkeletons.length).toBeGreaterThan(0);
    });

    it('should render 4 stat card skeletons', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const grid = container.querySelector('.grid-cols-2.lg\\:grid-cols-4');
      expect(grid).toBeInTheDocument();
      const statCards = grid.children;
      expect(statCards.length).toBe(4);
    });

    it('should render 4 chart skeletons', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      expect(chartGrid).toBeInTheDocument();
      const charts = chartGrid.children;
      expect(charts.length).toBe(4);
    });
  });

  // =============================================================================
  // Animation Tests
  // =============================================================================

  describe('animation classes', () => {
    it('should have animate-pulse class on skeleton elements', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('should have animation on stat card skeleton lines', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statCardGrid = container.querySelector('.grid-cols-2.lg\\:grid-cols-4');
      const animatedInStats = statCardGrid.querySelectorAll('.animate-pulse');
      expect(animatedInStats.length).toBeGreaterThan(0);
    });

    it('should have animation on chart skeleton lines', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      const animatedInCharts = chartGrid.querySelectorAll('.animate-pulse');
      expect(animatedInCharts.length).toBeGreaterThan(0);
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe('dark mode styling', () => {
    it('should apply dark theme card classes in dark mode', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />, {
        darkMode: true,
      });
      const darkCard = container.querySelector('.bg-slate-800\\/80');
      expect(darkCard).toBeInTheDocument();
    });

    it('should apply light theme card classes in light mode', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />, {
        darkMode: false,
      });
      const lightCard = container.querySelector('.bg-white\\/90');
      expect(lightCard).toBeInTheDocument();
    });

    it('should apply dark theme skeleton element classes in dark mode', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />, {
        darkMode: true,
      });
      const darkSkeleton = container.querySelector('.bg-slate-700');
      expect(darkSkeleton).toBeInTheDocument();
    });

    it('should apply light theme skeleton element classes in light mode', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />, {
        darkMode: false,
      });
      const lightSkeleton = container.querySelector('.bg-slate-200');
      expect(lightSkeleton).toBeInTheDocument();
    });

    it('should apply dark theme border in dark mode', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />, {
        darkMode: true,
      });
      const darkBorder = container.querySelector('.border-slate-600\\/50');
      expect(darkBorder).toBeInTheDocument();
    });

    it('should apply light theme border in light mode', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />, {
        darkMode: false,
      });
      const lightBorder = container.querySelector('.border-slate-200\\/60');
      expect(lightBorder).toBeInTheDocument();
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe('darkMode override prop', () => {
    it('should use darkMode override when provided (true)', () => {
      const { container } = renderWithTheme(<LoadingSkeleton darkMode={true} />, {
        darkMode: false,
      });
      const darkCard = container.querySelector('.bg-slate-800\\/80');
      expect(darkCard).toBeInTheDocument();
    });

    it('should use darkMode override when provided (false)', () => {
      const { container } = renderWithTheme(<LoadingSkeleton darkMode={false} />, {
        darkMode: true,
      });
      const lightCard = container.querySelector('.bg-white\\/90');
      expect(lightCard).toBeInTheDocument();
    });

    it('should use context value when darkMode override is undefined', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />, {
        darkMode: true,
      });
      const darkCard = container.querySelector('.bg-slate-800\\/80');
      expect(darkCard).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Stat Card Skeleton Tests
  // =============================================================================

  describe('stat card skeletons', () => {
    it('should render skeleton header with title and icon placeholders', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statCardGrid = container.querySelector('.grid-cols-2.lg\\:grid-cols-4');
      const roundedFullElements = statCardGrid.querySelectorAll('.rounded-full');
      expect(roundedFullElements.length).toBeGreaterThan(0);
    });

    it('should have proper height for stat cards', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statCards = container.querySelectorAll('.h-28');
      expect(statCards.length).toBe(4);
    });

    it('should have responsive height for stat cards', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statCards = container.querySelectorAll('.sm\\:h-32');
      expect(statCards.length).toBe(4);
    });

    it('should have backdrop-blur on stat cards', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const blurElements = container.querySelectorAll('.backdrop-blur-lg');
      expect(blurElements.length).toBeGreaterThan(0);
    });

    it('should have rounded corners on stat cards', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const roundedCards = container.querySelectorAll('.rounded-2xl');
      expect(roundedCards.length).toBeGreaterThan(0);
    });
  });

  // =============================================================================
  // Chart Skeleton Tests
  // =============================================================================

  describe('chart skeletons', () => {
    it('should render chart header with title placeholder', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      const titlePlaceholders = chartGrid.querySelectorAll('.h-6');
      expect(titlePlaceholders.length).toBeGreaterThan(0);
    });

    it('should render time period button placeholders', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      const buttonPlaceholders = chartGrid.querySelectorAll('.h-8.w-16');
      // Each chart has 3 button placeholders, 4 charts total = 12
      expect(buttonPlaceholders.length).toBe(12);
    });

    it('should have proper height for chart skeletons', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartSkeletons = container.querySelectorAll('.h-72');
      expect(chartSkeletons.length).toBe(4);
    });

    it('should have responsive height for chart skeletons', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartSkeletons = container.querySelectorAll('.sm\\:h-80');
      expect(chartSkeletons.length).toBe(4);
    });

    it('should render skeleton content lines', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      const contentLines = chartGrid.querySelectorAll('.h-4');
      expect(contentLines.length).toBeGreaterThan(0);
    });
  });

  // =============================================================================
  // Skeleton Line Width Tests
  // =============================================================================

  describe('skeleton line widths', () => {
    it('should have varied widths for visual interest', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      const lines = chartGrid.querySelectorAll('.h-4.rounded');

      // Check that at least some lines have varying widths
      const hasVariedWidths = Array.from(lines).some((line) => {
        const style = line.getAttribute('style');
        return style && style.includes('width');
      });

      expect(hasVariedWidths).toBe(true);
    });

    it('should use pre-calculated widths for consistency', () => {
      // Render twice and check widths are consistent
      const { container: container1 } = renderWithTheme(<LoadingSkeleton />);
      const { container: container2 } = renderWithTheme(<LoadingSkeleton />);

      const getWidths = (container) => {
        const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
        const lines = chartGrid.querySelectorAll('.h-4.rounded');
        return Array.from(lines)
          .map((line) => line.getAttribute('style'))
          .filter(Boolean);
      };

      const widths1 = getWidths(container1);
      const widths2 = getWidths(container2);

      expect(widths1).toEqual(widths2);
    });
  });

  // =============================================================================
  // Layout Structure Tests
  // =============================================================================

  describe('layout structure', () => {
    it('should have space-y-8 on main container', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const mainContainer = container.querySelector('.space-y-8');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should have grid layout for stat cards', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statGrid = container.querySelector('.grid.grid-cols-2.lg\\:grid-cols-4');
      expect(statGrid).toBeInTheDocument();
    });

    it('should have gap between stat cards', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statGrid = container.querySelector('.gap-4');
      expect(statGrid).toBeInTheDocument();
    });

    it('should have responsive gap between stat cards', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statGrid = container.querySelector('.sm\\:gap-6');
      expect(statGrid).toBeInTheDocument();
    });

    it('should have margin bottom on stat cards section', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statGrid = container.querySelector('.mb-6');
      expect(statGrid).toBeInTheDocument();
    });

    it('should have gap between charts', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2.gap-6');
      expect(chartGrid).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Responsive Classes Tests
  // =============================================================================

  describe('responsive classes', () => {
    it('should have responsive stat card grid columns', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statGrid = container.querySelector('.grid-cols-2.lg\\:grid-cols-4');
      expect(statGrid).toBeInTheDocument();
    });

    it('should have responsive chart grid columns', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      expect(chartGrid).toBeInTheDocument();
    });

    it('should have responsive padding on cards', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const responsivePadding = container.querySelector('.p-4.sm\\:p-6');
      expect(responsivePadding).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Backward Compatibility Tests
  // =============================================================================

  describe('backward compatibility (outside ThemeProvider)', () => {
    it('should render without ThemeProvider using darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(<LoadingSkeleton darkMode={true} />);
      expect(container.firstChild).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should default to light mode when outside ThemeProvider without darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(<LoadingSkeleton />);
      const lightCard = container.querySelector('.bg-white\\/90');
      expect(lightCard).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe('edge cases', () => {
    it('should render consistently on multiple renders', () => {
      const { rerender, container } = renderWithTheme(<LoadingSkeleton />);

      const firstRenderStatCards = container.querySelectorAll('.h-28').length;

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <LoadingSkeleton />
        </ThemeProvider>
      );

      const secondRenderStatCards = container.querySelectorAll('.h-28').length;

      expect(firstRenderStatCards).toBe(secondRenderStatCards);
    });

    it('should not crash on unmount', () => {
      const { unmount } = renderWithTheme(<LoadingSkeleton />);
      expect(() => unmount()).not.toThrow();
    });

    it('should handle theme changes smoothly', () => {
      const { rerender, container } = renderWithTheme(<LoadingSkeleton />, {
        darkMode: false,
      });

      // Light mode should have light background cards
      const lightCard = container.querySelector('.bg-white\\/90');
      expect(lightCard).toBeInTheDocument();

      rerender(
        <ThemeProvider defaultDarkMode={true}>
          <LoadingSkeleton />
        </ThemeProvider>
      );

      // After theme change, dark mode should have dark background cards
      // Note: We need to check that the component still renders properly
      expect(container.querySelector('.backdrop-blur-lg')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Structure Verification Tests
  // =============================================================================

  describe('structure verification', () => {
    it('should have flex layout inside stat cards', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statCardGrid = container.querySelector('.grid-cols-2.lg\\:grid-cols-4');
      const flexContainers = statCardGrid.querySelectorAll('.flex.flex-col');
      expect(flexContainers.length).toBe(4);
    });

    it('should have justify-between in stat card content', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const statCardGrid = container.querySelector('.grid-cols-2.lg\\:grid-cols-4');
      const justifyBetween = statCardGrid.querySelectorAll('.justify-between');
      expect(justifyBetween.length).toBeGreaterThan(0);
    });

    it('should have header row with title and buttons in charts', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      const headerRows = chartGrid.querySelectorAll('.flex.items-center.justify-between');
      expect(headerRows.length).toBe(4);
    });

    it('should have flex-1 for chart content area', () => {
      const { container } = renderWithTheme(<LoadingSkeleton />);
      const chartGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      const contentAreas = chartGrid.querySelectorAll('.flex-1');
      expect(contentAreas.length).toBe(4);
    });
  });
});

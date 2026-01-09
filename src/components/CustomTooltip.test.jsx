/**
 * Unit Tests for CustomTooltip Component
 * Tests the Recharts custom tooltip with theme support
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomTooltip from './CustomTooltip';
import ThemeProvider from '../hooks/ThemeProvider';

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const createPayload = (entries) =>
  entries.map((entry, index) => ({
    name: entry.name || `Series ${index + 1}`,
    value: entry.value,
    dataKey: entry.dataKey || 'value',
    color: entry.color || '#60a5fa',
    ...entry,
  }));

const defaultPayload = createPayload([{ name: 'Animals', value: 150, color: '#60a5fa' }]);

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe('CustomTooltip', () => {
  describe('basic rendering', () => {
    it('should render when active with payload', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Monday" />);
      expect(screen.getByText('Monday')).toBeInTheDocument();
    });

    it('should render payload values', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Monday" />);
      expect(screen.getByText(/150/)).toBeInTheDocument();
    });

    it('should render payload names', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Monday" />);
      expect(screen.getByText(/Animals/)).toBeInTheDocument();
    });

    it('should not render when not active', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={false} payload={defaultPayload} label="Monday" />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should not render when payload is empty', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={[]} label="Monday" />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should not render when payload is null', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={null} label="Monday" />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should not render when payload is undefined', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={undefined} label="Monday" />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  // =============================================================================
  // Label Tests
  // =============================================================================

  describe('label rendering', () => {
    it('should render label when provided', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Tuesday" />);
      expect(screen.getByText('Tuesday')).toBeInTheDocument();
    });

    it('should not render label element when label is undefined', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} />
      );
      // Should still render the tooltip, just without the label
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByText('undefined')).not.toBeInTheDocument();
    });

    it('should render empty string label (but element exists)', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="" />);
      // Tooltip should render
      expect(screen.getByText(/Animals/)).toBeInTheDocument();
    });

    it('should render numeric label', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label={2024} />);
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('should have font-bold class on label', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Week 1" />);
      const label = screen.getByText('Week 1');
      expect(label).toHaveClass('font-bold');
    });

    it('should have truncate class on label', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Week 1" />);
      const label = screen.getByText('Week 1');
      expect(label).toHaveClass('truncate');
    });
  });

  // =============================================================================
  // Multiple Payload Items Tests
  // =============================================================================

  describe('multiple payload items', () => {
    it('should render all payload items', () => {
      const multiPayload = createPayload([
        { name: 'Animals', value: 150, color: '#60a5fa' },
        { name: 'Feedings', value: 25, color: '#34d399' },
        { name: 'Staff', value: 12, color: '#fbbf24' },
      ]);

      renderWithTheme(<CustomTooltip active={true} payload={multiPayload} label="Monday" />);

      expect(screen.getByText(/Animals/)).toBeInTheDocument();
      expect(screen.getByText(/Feedings/)).toBeInTheDocument();
      expect(screen.getByText(/Staff/)).toBeInTheDocument();
    });

    it('should render all values for multiple items', () => {
      const multiPayload = createPayload([
        { name: 'Series A', value: 100 },
        { name: 'Series B', value: 200 },
      ]);

      renderWithTheme(<CustomTooltip active={true} payload={multiPayload} label="Test" />);

      expect(screen.getByText(/100/)).toBeInTheDocument();
      expect(screen.getByText(/200/)).toBeInTheDocument();
    });

    it('should apply correct colors to each payload item', () => {
      const multiPayload = createPayload([
        { name: 'Red', value: 10, color: '#ff0000' },
        { name: 'Blue', value: 20, color: '#0000ff' },
      ]);

      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={multiPayload} label="Test" />
      );

      const items = container.querySelectorAll('p.text-xs, p.text-sm');
      // Filter to only payload items (not label)
      const payloadItems = Array.from(items).filter((item) => item.style.color);
      expect(payloadItems.length).toBe(2);
    });
  });

  // =============================================================================
  // Value Formatting Tests
  // =============================================================================

  describe('value formatting', () => {
    it('should format percentage values (dataKey === value)', () => {
      const payload = createPayload([{ name: 'Efficiency', value: 85, dataKey: 'value' }]);

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Test" />);

      expect(screen.getByText(/85%/)).toBeInTheDocument();
    });

    it('should not add percentage for non-value dataKeys', () => {
      const payload = createPayload([{ name: 'Animals', value: 150, dataKey: 'animals' }]);

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Test" />);

      expect(screen.getByText(/150/)).toBeInTheDocument();
      // The value should not have a % sign
      expect(screen.queryByText('150%')).not.toBeInTheDocument();
    });

    it('should handle zero value', () => {
      const payload = createPayload([{ name: 'Count', value: 0 }]);

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Test" />);

      expect(screen.getByText(/0/)).toBeInTheDocument();
    });

    it('should handle decimal values', () => {
      const payload = createPayload([{ name: 'Temperature', value: 24.5, dataKey: 'temp' }]);

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Test" />);

      expect(screen.getByText(/24.5/)).toBeInTheDocument();
    });

    it('should handle large numbers', () => {
      const payload = createPayload([{ name: 'Population', value: 1000000, dataKey: 'pop' }]);

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Test" />);

      expect(screen.getByText(/1000000/)).toBeInTheDocument();
    });

    it('should handle negative values', () => {
      const payload = createPayload([{ name: 'Change', value: -15, dataKey: 'change' }]);

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Test" />);

      expect(screen.getByText(/-15/)).toBeInTheDocument();
    });

    it('should handle string values', () => {
      const payload = createPayload([{ name: 'Status', value: 'Active', dataKey: 'status' }]);

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Test" />);

      expect(screen.getByText(/Active/)).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Dark Mode Tests
  // =============================================================================

  describe('dark mode styling', () => {
    it('should apply dark background in dark mode', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />,
        { darkMode: true }
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('bg-slate-800/95');
    });

    it('should apply light background in light mode', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />,
        { darkMode: false }
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('bg-white/95');
    });

    it('should apply dark border in dark mode', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />,
        { darkMode: true }
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('border-slate-700');
    });

    it('should apply light border in light mode', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />,
        { darkMode: false }
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('border-slate-300');
    });

    it('should apply dark label text color in dark mode', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Test" />, {
        darkMode: true,
      });

      const label = screen.getByText('Test');
      expect(label).toHaveClass('text-slate-200');
    });

    it('should apply light label text color in light mode', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Test" />, {
        darkMode: false,
      });

      const label = screen.getByText('Test');
      expect(label).toHaveClass('text-slate-700');
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe('darkMode override prop', () => {
    it('should use darkModeOverride when provided (true)', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" darkMode={true} />,
        { darkMode: false } // Provider says light mode
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('bg-slate-800/95');
    });

    it('should use darkModeOverride when provided (false)', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" darkMode={false} />,
        { darkMode: true } // Provider says dark mode
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('bg-white/95');
    });

    it('should use context value when darkModeOverride is undefined', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />,
        { darkMode: true }
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('bg-slate-800/95');
    });
  });

  // =============================================================================
  // Backward Compatibility Tests
  // =============================================================================

  describe('backward compatibility (outside ThemeProvider)', () => {
    it('should render without ThemeProvider using darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<CustomTooltip active={true} payload={defaultPayload} label="Test" darkMode={true} />);

      expect(screen.getByText('Test')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should default to light mode when outside ThemeProvider without darkMode prop', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('bg-white/95');

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Styling Tests
  // =============================================================================

  describe('styling', () => {
    it('should have backdrop blur effect', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('backdrop-blur-md');
    });

    it('should have rounded corners', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('rounded-lg');
    });

    it('should have shadow', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('shadow-xl');
    });

    it('should have border', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('border');
    });

    it('should have responsive padding', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('p-2');
      expect(tooltip).toHaveClass('sm:p-4');
    });

    it('should have max-width constraints', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('max-w-37.5');
      expect(tooltip).toHaveClass('sm:max-w-50');
    });

    it('should have pointer-events none to prevent interaction issues', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveStyle({ pointerEvents: 'none' });
    });

    it('should have word-wrap class for long content', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('wrap-break-word');
    });
  });

  // =============================================================================
  // Payload Item Styling Tests
  // =============================================================================

  describe('payload item styling', () => {
    it('should have responsive text size for payload items', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Test" />);

      // Find payload item text (not label)
      const payloadItem = screen.getByText(/Animals/).closest('p');
      expect(payloadItem).toHaveClass('text-xs');
      expect(payloadItem).toHaveClass('sm:text-sm');
    });

    it('should have font-medium class on payload items', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Test" />);

      const payloadItem = screen.getByText(/Animals/).closest('p');
      expect(payloadItem).toHaveClass('font-medium');
    });

    it('should have font-semibold on name part', () => {
      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      // The name should be in a semibold span
      expect(container.querySelector('.font-semibold')).toBeInTheDocument();
    });

    it('should apply inline color style from payload', () => {
      const payload = createPayload([{ name: 'Test', value: 100, color: '#ff5500' }]);

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Label" />);

      const payloadItem = screen.getByText(/Test/).closest('p');
      expect(payloadItem).toHaveStyle({ color: '#ff5500' });
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe('edge cases', () => {
    it('should handle payload with missing name', () => {
      const payload = [{ value: 100, color: '#60a5fa', dataKey: 'val' }];

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Test" />);

      // Should render without crashing
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle payload with missing color', () => {
      const payload = [{ name: 'Test', value: 100, dataKey: 'val' }];

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Label" />);

      expect(screen.getByText(/Test/)).toBeInTheDocument();
    });

    it('should handle very long label', () => {
      const longLabel = 'This is a very long label that might need truncation';

      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label={longLabel} />);

      const label = screen.getByText(longLabel);
      expect(label).toHaveClass('truncate');
    });

    it('should handle special characters in label', () => {
      renderWithTheme(<CustomTooltip active={true} payload={defaultPayload} label="Test <>&" />);

      expect(screen.getByText('Test <>&')).toBeInTheDocument();
    });

    it('should handle special characters in payload name', () => {
      const payload = createPayload([{ name: 'Temperature (°C)', value: 25, color: '#60a5fa' }]);

      renderWithTheme(<CustomTooltip active={true} payload={payload} label="Test" />);

      expect(screen.getByText(/Temperature \(°C\)/)).toBeInTheDocument();
    });

    it('should handle boolean active prop', () => {
      // Test explicit true
      const { container: trueContainer } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );
      expect(trueContainer.firstChild).toBeInTheDocument();

      // Test explicit false
      const { container: falseContainer } = renderWithTheme(
        <CustomTooltip active={false} payload={defaultPayload} label="Test" />
      );
      expect(falseContainer.firstChild).toBeNull();
    });

    it('should handle truthy/falsy active values', () => {
      // Truthy value (1)
      const { container: truthyContainer } = renderWithTheme(
        <CustomTooltip active={1} payload={defaultPayload} label="Test" />
      );
      expect(truthyContainer.firstChild).toBeInTheDocument();

      // Falsy value (0)
      const { container: falsyContainer } = renderWithTheme(
        <CustomTooltip active={0} payload={defaultPayload} label="Test" />
      );
      expect(falsyContainer.firstChild).toBeNull();
    });
  });

  // =============================================================================
  // Integration Tests
  // =============================================================================

  describe('integration tests', () => {
    it('should display complete tooltip with all elements', () => {
      const payload = createPayload([
        {
          name: 'Active Animals',
          value: 847,
          color: '#60a5fa',
          dataKey: 'animals',
        },
        {
          name: 'Feedings Done',
          value: 95,
          color: '#34d399',
          dataKey: 'value',
        },
      ]);

      const { container } = renderWithTheme(
        <CustomTooltip active={true} payload={payload} label="Monday" />,
        { darkMode: false }
      );

      // Check label
      expect(screen.getByText('Monday')).toBeInTheDocument();

      // Check first item (no percentage)
      expect(screen.getByText(/Active Animals/)).toBeInTheDocument();
      expect(screen.getByText(/847/)).toBeInTheDocument();

      // Check second item (with percentage due to dataKey="value")
      expect(screen.getByText(/Feedings Done/)).toBeInTheDocument();
      expect(screen.getByText(/95%/)).toBeInTheDocument();

      // Check styling
      const tooltip = container.firstChild;
      expect(tooltip).toHaveClass('bg-white/95');
      expect(tooltip).toHaveClass('backdrop-blur-md');
    });

    it('should work correctly with theme toggle simulation', () => {
      // Light mode first
      const { container: lightContainer, unmount: unmountLight } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />,
        { darkMode: false }
      );
      expect(lightContainer.firstChild).toHaveClass('bg-white/95');
      unmountLight();

      // Dark mode
      const { container: darkContainer } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />,
        { darkMode: true }
      );
      expect(darkContainer.firstChild).toHaveClass('bg-slate-800/95');
    });

    it('should handle rapid active state changes', () => {
      const { rerender, container } = renderWithTheme(
        <CustomTooltip active={true} payload={defaultPayload} label="Test" />
      );

      expect(container.firstChild).toBeInTheDocument();

      rerender(
        <ThemeProvider>
          <CustomTooltip active={false} payload={defaultPayload} label="Test" />
        </ThemeProvider>
      );
      expect(container.firstChild).toBeNull();

      rerender(
        <ThemeProvider>
          <CustomTooltip active={true} payload={defaultPayload} label="Test" />
        </ThemeProvider>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

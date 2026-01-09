/**
 * Unit Tests for ConversionRateChart Component
 * Tests basic rendering of the conversion rate chart
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConversionRateChart from './ConversionRateChart';
import ThemeProvider from '../hooks/ThemeProvider';

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const mockData = [
  { name: 'Mon', efficiency: 75 },
  { name: 'Tue', efficiency: 82 },
  { name: 'Wed', efficiency: 78 },
  { name: 'Thu', efficiency: 85 },
  { name: 'Fri', efficiency: 90 },
];

const defaultProps = {
  data: mockData,
  timePeriod: 'week',
  setTimePeriod: vi.fn(),
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
}));

// Mock Recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Line: () => <div data-testid="line" />,
}));

describe('ConversionRateChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render the chart component', () => {
      renderWithTheme(<ConversionRateChart {...defaultProps} />);
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    });

    it('should render time period buttons', () => {
      renderWithTheme(<ConversionRateChart {...defaultProps} />);
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
    });

    it('should render the chart container', () => {
      renderWithTheme(<ConversionRateChart {...defaultProps} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should render the responsive container', () => {
      renderWithTheme(<ConversionRateChart {...defaultProps} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });
});

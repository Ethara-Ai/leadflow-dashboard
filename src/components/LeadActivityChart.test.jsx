/**
 * Unit Tests for LeadActivityChart Component
 * Tests basic rendering of the lead activity chart
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LeadActivityChart from './LeadActivityChart';
import ThemeProvider from '../hooks/ThemeProvider';

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const mockChartData = [
  { name: 'Mon', leads: 120, callsCompleted: 25 },
  { name: 'Tue', leads: 150, callsCompleted: 30 },
  { name: 'Wed', leads: 180, callsCompleted: 35 },
];

const defaultProps = {
  data: mockChartData,
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
  ComposedChart: ({ children }) => <div data-testid="composed-chart">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Area: () => <div data-testid="area" />,
  Bar: () => <div data-testid="bar" />,
  defs: ({ children }) => <div>{children}</div>,
  linearGradient: ({ children }) => <div>{children}</div>,
  stop: () => <div />,
}));

describe('LeadActivityChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render the chart component', () => {
      renderWithTheme(<LeadActivityChart {...defaultProps} />);
      expect(screen.getByText('Lead Activity')).toBeInTheDocument();
    });

    it('should render time period buttons', () => {
      renderWithTheme(<LeadActivityChart {...defaultProps} />);
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
    });

    it('should render the chart container', () => {
      renderWithTheme(<LeadActivityChart {...defaultProps} />);
      expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
    });

    it('should render the responsive container', () => {
      renderWithTheme(<LeadActivityChart {...defaultProps} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });
});

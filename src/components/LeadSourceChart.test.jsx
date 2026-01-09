/**
 * Unit Tests for LeadSourceChart Component
 * Tests basic rendering of the pie chart component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LeadSourceChart from './LeadSourceChart';
import ThemeProvider from '../hooks/ThemeProvider';

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const mockData = [
  { name: 'Website', value: 35 },
  { name: 'Referral', value: 25 },
  { name: 'Social Media', value: 20 },
  { name: 'Cold Call', value: 20 },
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
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container" style={{ width: 500, height: 300 }}>
      {children}
    </div>
  ),
  PieChart: ({ children, ...props }) => (
    <div data-testid="pie-chart" {...props}>
      {children}
    </div>
  ),
  Pie: ({ children, _data, dataKey, nameKey, ..._props }) => (
    <div data-testid="pie" data-datakey={dataKey} data-namekey={nameKey}>
      {children}
    </div>
  ),
  Cell: ({ fill }) => <div data-testid="cell" data-fill={fill} />,
  Tooltip: ({ _content }) => <div data-testid="tooltip" />,
}));

describe('LeadSourceChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render the chart component', () => {
      renderWithTheme(<LeadSourceChart {...defaultProps} />);
      expect(screen.getByText('Lead Source Distribution')).toBeInTheDocument();
    });

    it('should render the chart title', () => {
      renderWithTheme(<LeadSourceChart {...defaultProps} />);
      const title = screen.getByText('Lead Source Distribution');
      expect(title).toBeInTheDocument();
    });

    it('should render time period buttons', () => {
      renderWithTheme(<LeadSourceChart {...defaultProps} />);
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
    });

    it('should render the pie chart container', () => {
      renderWithTheme(<LeadSourceChart {...defaultProps} />);
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('should render the responsive container', () => {
      renderWithTheme(<LeadSourceChart {...defaultProps} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });
});

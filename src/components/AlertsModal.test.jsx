/**
 * Unit Tests for AlertsModal Component
 * Tests basic rendering of the alerts modal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AlertsModal from './AlertsModal';
import ThemeProvider from '../hooks/ThemeProvider';

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const mockAlerts = [
  {
    id: 1,
    message: 'Test alert message',
    type: 'warning',
    time: '1 hour ago',
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

describe('AlertsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render modal when isOpen is true', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByText('Lead Alerts')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      renderWithTheme(<AlertsModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Lead Alerts')).not.toBeInTheDocument();
    });

    it('should render the close button', () => {
      const { container } = renderWithTheme(<AlertsModal {...defaultProps} />);
      const closeButton = container.querySelector('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('should render alert messages', () => {
      renderWithTheme(<AlertsModal {...defaultProps} />);
      expect(screen.getByText('Test alert message')).toBeInTheDocument();
    });
  });
});

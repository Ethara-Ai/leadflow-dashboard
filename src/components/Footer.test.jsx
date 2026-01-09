/**
 * Unit Tests for Footer Component
 * Tests basic rendering of the footer component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import ThemeProvider from '../hooks/ThemeProvider';

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const defaultProps = {
  onOpenProductModal: vi.fn(),
  onOpenResourcesModal: vi.fn(),
  onOpenCompanyModal: vi.fn(),
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
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render the LeadFlow logo text', () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText('LeadFlow')).toBeInTheDocument();
    });

    it('should render the footer description', () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(
        screen.getByText(/Professional lead generation and management platform/)
      ).toBeInTheDocument();
    });

    it('should render the copyright text', () => {
      renderWithTheme(<Footer {...defaultProps} />);
      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(`© ${currentYear} LeadFlow. All rights reserved.`)
      ).toBeInTheDocument();
    });

    it('should render Product link', () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText('Product')).toBeInTheDocument();
    });

    it('should render Resources link', () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText('Resources')).toBeInTheDocument();
    });

    it('should render Company link', () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText('Company')).toBeInTheDocument();
    });
  });
});

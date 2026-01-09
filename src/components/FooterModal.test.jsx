/**
 * Unit Tests for FooterModal Component
 * Tests basic rendering of the footer modal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FooterModal from './FooterModal';
import ThemeProvider from '../hooks/ThemeProvider';

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  title: 'Test Modal Title',
  children: <p>Test modal content</p>,
};

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('FooterModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render when isOpen is true', () => {
      renderWithTheme(<FooterModal {...defaultProps} />);
      expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      renderWithTheme(<FooterModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Test Modal Title')).not.toBeInTheDocument();
    });

    it('should render children content', () => {
      renderWithTheme(<FooterModal {...defaultProps} />);
      expect(screen.getByText('Test modal content')).toBeInTheDocument();
    });

    it('should render the close button', () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const closeButton = container.querySelector('button');
      expect(closeButton).toBeInTheDocument();
    });
  });
});

/**
 * Unit Tests for CustomTimePicker Component
 * Tests basic rendering of the time picker component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomTimePicker from './CustomTimePicker';

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

const defaultProps = {
  value: '09:30',
  onChange: vi.fn(),
  isDark: false,
  onClose: vi.fn(),
};

describe('CustomTimePicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render the time picker', () => {
      render(<CustomTimePicker {...defaultProps} />);
      expect(screen.getByText('Hr')).toBeInTheDocument();
      expect(screen.getByText('Min')).toBeInTheDocument();
    });

    it('should render AM and PM buttons', () => {
      render(<CustomTimePicker {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'AM' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'PM' })).toBeInTheDocument();
    });

    it('should render Done button', () => {
      render(<CustomTimePicker {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    });
  });
});

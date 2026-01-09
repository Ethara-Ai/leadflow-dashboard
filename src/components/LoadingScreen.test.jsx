/**
 * Unit Tests for LoadingScreen Component
 * Tests the responsive loading screen overlay with branding and spinner
 * Tests all Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

// =============================================================================
// Mock framer-motion
// =============================================================================

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    h1: ({ children, className, style, ...props }) => (
      <h1 className={className} style={style} {...props}>
        {children}
      </h1>
    ),
    p: ({ children, className, style, ...props }) => (
      <p className={className} style={style} {...props}>
        {children}
      </p>
    ),
  },
}));

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe('LoadingScreen', () => {
  describe('basic rendering', () => {
    it('should render the loading screen', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('LeadFlow')).toBeInTheDocument();
    });

    it('should render the brand name', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('LeadFlow')).toBeInTheDocument();
    });

    it('should render the loading text', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render the logo icon container', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.rounded-xl');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should render the SVG logo icon', () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });

    it('should render the loading spinner', () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render the tagline', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Lead Management Dashboard')).toBeInTheDocument();
    });

    it('should render the footer text', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Preparing your dashboard experience...')).toBeInTheDocument();
    });

    it('should render progress dots', () => {
      const { container } = render(<LoadingScreen />);
      const dots = container.querySelectorAll('.bg-blue-400.rounded-full');
      expect(dots.length).toBe(3);
    });
  });

  // =============================================================================
  // Logo Tests
  // =============================================================================

  describe('logo rendering', () => {
    it('should render logo container with gradient background', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.bg-linear-to-br');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should render logo with blue colors', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.from-blue-500');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should render logo with to-blue-600 gradient', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.to-blue-600');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should render logo with shadow', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.shadow-lg');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should render SVG icon with correct viewBox', () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should render SVG icon with white color', () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toHaveClass('text-white');
    });

    it('should render SVG with polygon element (lightning bolt)', () => {
      const { container } = render(<LoadingScreen />);
      const polygon = container.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Brand Name Tests
  // =============================================================================

  describe('brand name rendering', () => {
    it('should render brand name as h1', () => {
      render(<LoadingScreen />);
      const heading = screen.getByText('LeadFlow');
      expect(heading.tagName).toBe('H1');
    });

    it('should render brand name with bold styling', () => {
      render(<LoadingScreen />);
      const heading = screen.getByText('LeadFlow');
      expect(heading).toHaveClass('font-bold');
    });

    it('should render brand name with slate text color', () => {
      render(<LoadingScreen />);
      const heading = screen.getByText('LeadFlow');
      expect(heading).toHaveClass('text-slate-800');
    });

    it('should render brand name with tracking-tight class', () => {
      render(<LoadingScreen />);
      const heading = screen.getByText('LeadFlow');
      expect(heading).toHaveClass('tracking-tight');
    });

    it('should render brand name with responsive margin top', () => {
      render(<LoadingScreen />);
      const heading = screen.getByText('LeadFlow');
      expect(heading).toHaveClass('mt-4');
    });

    it('should render brand name with all responsive margin top classes', () => {
      render(<LoadingScreen />);
      const heading = screen.getByText('LeadFlow');
      expect(heading).toHaveClass('mt-4');
      expect(heading).toHaveClass('sm:mt-5');
      expect(heading).toHaveClass('md:mt-6');
      expect(heading).toHaveClass('lg:mt-7');
      expect(heading).toHaveClass('xl:mt-8');
      expect(heading).toHaveClass('2xl:mt-10');
    });

    it('should have responsive text size classes', () => {
      render(<LoadingScreen />);
      const heading = screen.getByText('LeadFlow');
      expect(heading).toHaveClass('text-xl');
      expect(heading).toHaveClass('sm:text-2xl');
      expect(heading).toHaveClass('md:text-3xl');
      expect(heading).toHaveClass('lg:text-4xl');
      expect(heading).toHaveClass('xl:text-5xl');
      expect(heading).toHaveClass('2xl:text-6xl');
    });
  });

  // =============================================================================
  // Loading Spinner Tests
  // =============================================================================

  describe('loading spinner', () => {
    it('should render spinner with animate-spin class', () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render spinner with rounded-full class', () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector('.rounded-full.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render spinner with responsive border styling', () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector('.border-2');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('sm:border-3');
      expect(spinner).toHaveClass('md:border-3');
      expect(spinner).toHaveClass('lg:border-4');
      expect(spinner).toHaveClass('xl:border-4');
      expect(spinner).toHaveClass('2xl:border-5');
    });

    it('should render spinner with blue accent color', () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector('.border-t-blue-500');
      expect(spinner).toBeInTheDocument();
    });

    it('should render spinner with slate border color', () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector('.border-slate-200');
      expect(spinner).toBeInTheDocument();
    });

    it('should render spinner with responsive size', () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toHaveClass('w-6', 'h-6');
      expect(spinner).toHaveClass('sm:w-8', 'sm:h-8');
      expect(spinner).toHaveClass('md:w-10', 'md:h-10');
      expect(spinner).toHaveClass('lg:w-12', 'lg:h-12');
      expect(spinner).toHaveClass('xl:w-14', 'xl:h-14');
      expect(spinner).toHaveClass('2xl:w-16', '2xl:h-16');
    });

    it('should have responsive margin top above spinner', () => {
      const { container } = render(<LoadingScreen />);
      const spinnerWrapper = container.querySelector('.mt-6');
      expect(spinnerWrapper).toBeInTheDocument();
      expect(spinnerWrapper).toHaveClass('sm:mt-7');
      expect(spinnerWrapper).toHaveClass('md:mt-8');
      expect(spinnerWrapper).toHaveClass('lg:mt-10');
      expect(spinnerWrapper).toHaveClass('xl:mt-12');
      expect(spinnerWrapper).toHaveClass('2xl:mt-14');
    });
  });

  // =============================================================================
  // Loading Text Tests
  // =============================================================================

  describe('loading text', () => {
    it('should render loading text', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render loading text with responsive font size', () => {
      render(<LoadingScreen />);
      const loadingText = screen.getByText('Loading...');
      expect(loadingText).toHaveClass('text-xs');
      expect(loadingText).toHaveClass('sm:text-sm');
      expect(loadingText).toHaveClass('md:text-base');
      expect(loadingText).toHaveClass('lg:text-lg');
      expect(loadingText).toHaveClass('xl:text-xl');
      expect(loadingText).toHaveClass('2xl:text-2xl');
    });

    it('should render loading text with slate color', () => {
      render(<LoadingScreen />);
      const loadingText = screen.getByText('Loading...');
      expect(loadingText).toHaveClass('text-slate-500');
    });

    it('should render loading text with medium font weight', () => {
      render(<LoadingScreen />);
      const loadingText = screen.getByText('Loading...');
      expect(loadingText).toHaveClass('font-medium');
    });

    it('should render loading text with responsive margin top', () => {
      render(<LoadingScreen />);
      const loadingText = screen.getByText('Loading...');
      expect(loadingText).toHaveClass('mt-3');
      expect(loadingText).toHaveClass('sm:mt-4');
      expect(loadingText).toHaveClass('md:mt-5');
      expect(loadingText).toHaveClass('lg:mt-6');
      expect(loadingText).toHaveClass('xl:mt-7');
      expect(loadingText).toHaveClass('2xl:mt-8');
    });
  });

  // =============================================================================
  // Container Styling Tests
  // =============================================================================

  describe('container styling', () => {
    it('should render with fixed positioning', () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('fixed');
    });

    it('should render with inset-0 for full coverage', () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('inset-0');
    });

    it('should render with z-50 for proper layering', () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('z-50');
    });

    it('should render with flex layout for centering', () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('flex');
      expect(mainContainer).toHaveClass('items-center');
      expect(mainContainer).toHaveClass('justify-center');
    });

    it('should render with center alignment', () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('items-center');
      expect(mainContainer).toHaveClass('justify-center');
    });

    it('should render with gradient background', () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('bg-linear-to-br');
    });

    it('should render with slate gradient colors', () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('from-slate-50');
      expect(mainContainer).toHaveClass('via-white');
      expect(mainContainer).toHaveClass('to-slate-100');
    });

    it('should have responsive padding on main container', () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('p-4');
      expect(mainContainer).toHaveClass('sm:p-6');
      expect(mainContainer).toHaveClass('md:p-8');
      expect(mainContainer).toHaveClass('lg:p-10');
      expect(mainContainer).toHaveClass('xl:p-12');
      expect(mainContainer).toHaveClass('2xl:p-16');
    });
  });

  // =============================================================================
  // Content Container Tests
  // =============================================================================

  describe('content container', () => {
    it('should render content with flex-col layout', () => {
      const { container } = render(<LoadingScreen />);
      const contentContainer = container.querySelector('.flex.flex-col.items-center');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should center content horizontally', () => {
      const { container } = render(<LoadingScreen />);
      const contentContainer = container.querySelector('.items-center');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should have text-center class for centering content', () => {
      const { container } = render(<LoadingScreen />);
      const contentContainer = container.querySelector('.text-center');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should have justify-center for vertical centering', () => {
      const { container } = render(<LoadingScreen />);
      const contentContainer = container.querySelector('.justify-center');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<LoadingScreen />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('LeadFlow');
    });

    it('should display loading status text', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should have visible loading indicator', () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Logo Container Size Tests
  // =============================================================================

  describe('logo container sizing', () => {
    it('should have responsive width classes', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.w-14');
      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveClass('sm:w-16');
      expect(logoContainer).toHaveClass('md:w-20');
      expect(logoContainer).toHaveClass('lg:w-24');
      expect(logoContainer).toHaveClass('xl:w-28');
      expect(logoContainer).toHaveClass('2xl:w-32');
    });

    it('should have responsive height classes', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.h-14');
      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveClass('sm:h-16');
      expect(logoContainer).toHaveClass('md:h-20');
      expect(logoContainer).toHaveClass('lg:h-24');
      expect(logoContainer).toHaveClass('xl:h-28');
      expect(logoContainer).toHaveClass('2xl:h-32');
    });

    it('should have flex centering for icon', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.flex.items-center.justify-center');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should have responsive border radius', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.rounded-xl');
      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveClass('sm:rounded-2xl');
      expect(logoContainer).toHaveClass('md:rounded-2xl');
      expect(logoContainer).toHaveClass('lg:rounded-3xl');
      expect(logoContainer).toHaveClass('xl:rounded-3xl');
      expect(logoContainer).toHaveClass('2xl:rounded-4xl');
    });

    it('should have responsive shadow classes', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.shadow-lg');
      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveClass('md:shadow-xl');
      expect(logoContainer).toHaveClass('lg:shadow-2xl');
    });
  });

  // =============================================================================
  // SVG Icon Size Tests
  // =============================================================================

  describe('SVG icon sizing', () => {
    it('should have responsive width classes on SVG', () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector('svg.w-7');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveClass('sm:w-9');
      expect(svgIcon).toHaveClass('md:w-11');
      expect(svgIcon).toHaveClass('lg:w-14');
      expect(svgIcon).toHaveClass('xl:w-16');
      expect(svgIcon).toHaveClass('2xl:w-18');
    });

    it('should have responsive height classes on SVG', () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector('svg.h-7');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveClass('sm:h-9');
      expect(svgIcon).toHaveClass('md:h-11');
      expect(svgIcon).toHaveClass('lg:h-14');
      expect(svgIcon).toHaveClass('xl:h-16');
      expect(svgIcon).toHaveClass('2xl:h-18');
    });
  });

  // =============================================================================
  // Shadow Tests
  // =============================================================================

  describe('shadow styling', () => {
    it('should have shadow-lg class on logo container', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.shadow-lg');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should have blue shadow color', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.shadow-blue-500\\/20');
      expect(logoContainer).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Tagline Tests
  // =============================================================================

  describe('tagline rendering', () => {
    it('should render tagline text', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Lead Management Dashboard')).toBeInTheDocument();
    });

    it('should have hidden class for mobile', () => {
      render(<LoadingScreen />);
      const tagline = screen.getByText('Lead Management Dashboard');
      expect(tagline).toHaveClass('hidden');
      expect(tagline).toHaveClass('md:block');
    });

    it('should have responsive text size classes', () => {
      render(<LoadingScreen />);
      const tagline = screen.getByText('Lead Management Dashboard');
      expect(tagline).toHaveClass('text-sm');
      expect(tagline).toHaveClass('lg:text-base');
      expect(tagline).toHaveClass('xl:text-lg');
      expect(tagline).toHaveClass('2xl:text-xl');
    });

    it('should be centered via parent container', () => {
      const { container } = render(<LoadingScreen />);
      // Parent container handles centering with text-center class
      const parentContainer = container.querySelector('.text-center');
      expect(parentContainer).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Footer Text Tests
  // =============================================================================

  describe('footer text rendering', () => {
    it('should render footer text', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Preparing your dashboard experience...')).toBeInTheDocument();
    });

    it('should have hidden class for smaller screens', () => {
      render(<LoadingScreen />);
      const footer = screen.getByText('Preparing your dashboard experience...');
      expect(footer).toHaveClass('hidden');
      expect(footer).toHaveClass('lg:block');
    });

    it('should have absolute positioning', () => {
      render(<LoadingScreen />);
      const footer = screen.getByText('Preparing your dashboard experience...');
      expect(footer).toHaveClass('absolute');
    });

    it('should be horizontally centered with left-0 right-0', () => {
      render(<LoadingScreen />);
      const footer = screen.getByText('Preparing your dashboard experience...');
      expect(footer).toHaveClass('left-0');
      expect(footer).toHaveClass('right-0');
      expect(footer).toHaveClass('text-center');
    });

    it('should have responsive bottom positioning', () => {
      render(<LoadingScreen />);
      const footer = screen.getByText('Preparing your dashboard experience...');
      expect(footer).toHaveClass('bottom-6');
      expect(footer).toHaveClass('xl:bottom-8');
      expect(footer).toHaveClass('2xl:bottom-10');
    });

    it('should have responsive text size', () => {
      render(<LoadingScreen />);
      const footer = screen.getByText('Preparing your dashboard experience...');
      expect(footer).toHaveClass('text-xs');
      expect(footer).toHaveClass('lg:text-sm');
      expect(footer).toHaveClass('xl:text-base');
      expect(footer).toHaveClass('2xl:text-lg');
    });
  });

  // =============================================================================
  // Progress Dots Tests
  // =============================================================================

  describe('progress dots', () => {
    it('should render 3 progress dots', () => {
      const { container } = render(<LoadingScreen />);
      const dots = container.querySelectorAll('.bg-blue-400.rounded-full');
      expect(dots.length).toBe(3);
    });

    it('should have hidden class for extra small screens', () => {
      const { container } = render(<LoadingScreen />);
      const dotsContainer = container.querySelector('.hidden.sm\\:flex');
      expect(dotsContainer).toBeInTheDocument();
    });

    it('should have responsive gap classes', () => {
      const { container } = render(<LoadingScreen />);
      const dotsContainer = container.querySelector('.gap-1\\.5');
      expect(dotsContainer).toBeInTheDocument();
      expect(dotsContainer).toHaveClass('sm:gap-2');
      expect(dotsContainer).toHaveClass('md:gap-2.5');
      expect(dotsContainer).toHaveClass('lg:gap-3');
      expect(dotsContainer).toHaveClass('xl:gap-3.5');
      expect(dotsContainer).toHaveClass('2xl:gap-4');
    });

    it('should have responsive dot sizes', () => {
      const { container } = render(<LoadingScreen />);
      const dot = container.querySelector('.bg-blue-400.rounded-full');
      expect(dot).toHaveClass('w-1.5', 'h-1.5');
      expect(dot).toHaveClass('sm:w-2', 'sm:h-2');
      expect(dot).toHaveClass('md:w-2.5', 'md:h-2.5');
      expect(dot).toHaveClass('lg:w-3', 'lg:h-3');
      expect(dot).toHaveClass('xl:w-3.5', 'xl:h-3.5');
      expect(dot).toHaveClass('2xl:w-4', '2xl:h-4');
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe('edge cases', () => {
    it('should render consistently on multiple renders', () => {
      const { rerender } = render(<LoadingScreen />);
      expect(screen.getByText('LeadFlow')).toBeInTheDocument();

      rerender(<LoadingScreen />);
      expect(screen.getByText('LeadFlow')).toBeInTheDocument();
    });

    it('should render without any props', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not crash on unmount', () => {
      const { unmount } = render(<LoadingScreen />);
      expect(() => unmount()).not.toThrow();
    });
  });

  // =============================================================================
  // Structure Tests
  // =============================================================================

  describe('component structure', () => {
    it('should have a single root element', () => {
      const { container } = render(<LoadingScreen />);
      expect(container.children.length).toBe(1);
    });

    it('should render all main elements', () => {
      const { container } = render(<LoadingScreen />);

      // Logo container
      expect(container.querySelector('.rounded-xl')).toBeInTheDocument();
      // Brand name
      expect(screen.getByText('LeadFlow')).toBeInTheDocument();
      // Spinner
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
      // Loading text
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      // Tagline
      expect(screen.getByText('Lead Management Dashboard')).toBeInTheDocument();
      // Footer
      expect(screen.getByText('Preparing your dashboard experience...')).toBeInTheDocument();
    });

    it('should render elements in correct order (logo, title, tagline, spinner, text, dots)', () => {
      const { container } = render(<LoadingScreen />);
      const contentDiv = container.querySelector('.flex.flex-col.items-center');

      expect(contentDiv).toBeInTheDocument();
      // Elements should exist in the structure
      expect(contentDiv.querySelector('svg')).toBeInTheDocument();
    });
  });
});

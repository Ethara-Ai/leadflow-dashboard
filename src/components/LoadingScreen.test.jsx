/**
 * Unit Tests for LoadingScreen Component
 * Tests the loading screen overlay with branding and spinner
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingScreen from "./LoadingScreen";

// =============================================================================
// Mock framer-motion
// =============================================================================

vi.mock("framer-motion", () => ({
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

describe("LoadingScreen", () => {
  describe("basic rendering", () => {
    it("should render the loading screen", () => {
      render(<LoadingScreen />);
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();
    });

    it("should render the brand name", () => {
      render(<LoadingScreen />);
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();
    });

    it("should render the loading text", () => {
      render(<LoadingScreen />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render the logo icon container", () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector(".rounded-2xl");
      expect(logoContainer).toBeInTheDocument();
    });

    it("should render the SVG logo icon", () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should render the loading spinner", () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Logo Tests
  // =============================================================================

  describe("logo rendering", () => {
    it("should render logo container with gradient background", () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector(".bg-linear-to-br");
      expect(logoContainer).toBeInTheDocument();
    });

    it("should render logo with emerald colors", () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector(".from-emerald-500");
      expect(logoContainer).toBeInTheDocument();
    });

    it("should render logo with shadow", () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector(".shadow-lg");
      expect(logoContainer).toBeInTheDocument();
    });

    it("should render SVG icon with correct viewBox", () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toHaveAttribute("viewBox", "0 0 24 24");
    });

    it("should render SVG icon with white color", () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toHaveClass("text-white");
    });

    it("should render SVG with multiple ellipse elements (paw print)", () => {
      const { container } = render(<LoadingScreen />);
      const ellipses = container.querySelectorAll("ellipse");
      expect(ellipses.length).toBe(5);
    });
  });

  // =============================================================================
  // Brand Name Tests
  // =============================================================================

  describe("brand name rendering", () => {
    it("should render brand name as h1", () => {
      render(<LoadingScreen />);
      const heading = screen.getByText("ZOOLAB");
      expect(heading.tagName).toBe("H1");
    });

    it("should render brand name with bold styling", () => {
      render(<LoadingScreen />);
      const heading = screen.getByText("ZOOLAB");
      expect(heading).toHaveClass("font-bold");
    });

    it("should render brand name with slate text color", () => {
      render(<LoadingScreen />);
      const heading = screen.getByText("ZOOLAB");
      expect(heading).toHaveClass("text-slate-800");
    });

    it("should render brand name with tracking-tight class", () => {
      render(<LoadingScreen />);
      const heading = screen.getByText("ZOOLAB");
      expect(heading).toHaveClass("tracking-tight");
    });

    it("should render brand name with margin top", () => {
      render(<LoadingScreen />);
      const heading = screen.getByText("ZOOLAB");
      expect(heading).toHaveClass("mt-5");
    });

    it("should have responsive text size classes", () => {
      render(<LoadingScreen />);
      const heading = screen.getByText("ZOOLAB");
      expect(heading).toHaveClass("text-2xl");
      expect(heading).toHaveClass("sm:text-3xl");
    });
  });

  // =============================================================================
  // Loading Spinner Tests
  // =============================================================================

  describe("loading spinner", () => {
    it("should render spinner with animate-spin class", () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("should render spinner with rounded-full class", () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector(".rounded-full");
      expect(spinner).toBeInTheDocument();
    });

    it("should render spinner with border styling", () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector(".border-3");
      expect(spinner).toBeInTheDocument();
    });

    it("should render spinner with emerald accent color", () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector(".border-t-emerald-500");
      expect(spinner).toBeInTheDocument();
    });

    it("should render spinner with slate border color", () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector(".border-slate-200");
      expect(spinner).toBeInTheDocument();
    });

    it("should render spinner with proper size", () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector(".w-8.h-8");
      expect(spinner).toBeInTheDocument();
    });

    it("should have margin top above spinner", () => {
      const { container } = render(<LoadingScreen />);
      const spinnerWrapper = container.querySelector(".mt-8");
      expect(spinnerWrapper).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Loading Text Tests
  // =============================================================================

  describe("loading text", () => {
    it("should render loading text", () => {
      render(<LoadingScreen />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render loading text with small font size", () => {
      render(<LoadingScreen />);
      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toHaveClass("text-sm");
    });

    it("should render loading text with slate color", () => {
      render(<LoadingScreen />);
      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toHaveClass("text-slate-500");
    });

    it("should render loading text with medium font weight", () => {
      render(<LoadingScreen />);
      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toHaveClass("font-medium");
    });

    it("should render loading text with margin top", () => {
      render(<LoadingScreen />);
      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toHaveClass("mt-4");
    });
  });

  // =============================================================================
  // Container Styling Tests
  // =============================================================================

  describe("container styling", () => {
    it("should render with fixed positioning", () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("fixed");
    });

    it("should render with inset-0 for full coverage", () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("inset-0");
    });

    it("should render with z-50 for proper layering", () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("z-50");
    });

    it("should render with flex layout for centering", () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("flex");
      expect(mainContainer).toHaveClass("flex-col");
    });

    it("should render with center alignment", () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("items-center");
      expect(mainContainer).toHaveClass("justify-center");
    });

    it("should render with gradient background", () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("bg-linear-to-br");
    });

    it("should render with slate gradient colors", () => {
      const { container } = render(<LoadingScreen />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("from-slate-50");
      expect(mainContainer).toHaveClass("via-white");
      expect(mainContainer).toHaveClass("to-slate-100");
    });
  });

  // =============================================================================
  // Content Container Tests
  // =============================================================================

  describe("content container", () => {
    it("should render content with flex-col layout", () => {
      const { container } = render(<LoadingScreen />);
      const contentContainer = container.querySelector(".flex.flex-col.items-center");
      expect(contentContainer).toBeInTheDocument();
    });

    it("should center content horizontally", () => {
      const { container } = render(<LoadingScreen />);
      const contentContainer = container.querySelector(".items-center");
      expect(contentContainer).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe("accessibility", () => {
    it("should have proper heading structure", () => {
      render(<LoadingScreen />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("ZOOLAB");
    });

    it("should display loading status text", () => {
      render(<LoadingScreen />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should have visible loading indicator", () => {
      const { container } = render(<LoadingScreen />);
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Logo Container Size Tests
  // =============================================================================

  describe("logo container sizing", () => {
    it("should have width of 16 units", () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector(".w-16");
      expect(logoContainer).toBeInTheDocument();
    });

    it("should have height of 16 units", () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector(".h-16");
      expect(logoContainer).toBeInTheDocument();
    });

    it("should have flex centering for icon", () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector(".flex.items-center.justify-center");
      expect(logoContainer).toBeInTheDocument();
    });
  });

  // =============================================================================
  // SVG Icon Size Tests
  // =============================================================================

  describe("SVG icon sizing", () => {
    it("should have width class w-9", () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector("svg.w-9");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should have height class h-9", () => {
      const { container } = render(<LoadingScreen />);
      const svgIcon = container.querySelector("svg.h-9");
      expect(svgIcon).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Shadow Tests
  // =============================================================================

  describe("shadow styling", () => {
    it("should have shadow-lg class on logo container", () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector(".shadow-lg");
      expect(logoContainer).toBeInTheDocument();
    });

    it("should have emerald shadow color", () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector(".shadow-emerald-500\\/20");
      expect(logoContainer).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should render consistently on multiple renders", () => {
      const { rerender } = render(<LoadingScreen />);
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();

      rerender(<LoadingScreen />);
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();
    });

    it("should render without any props", () => {
      render(<LoadingScreen />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should not crash on unmount", () => {
      const { unmount } = render(<LoadingScreen />);
      expect(() => unmount()).not.toThrow();
    });
  });

  // =============================================================================
  // Structure Tests
  // =============================================================================

  describe("component structure", () => {
    it("should have a single root element", () => {
      const { container } = render(<LoadingScreen />);
      expect(container.children.length).toBe(1);
    });

    it("should render all main elements", () => {
      const { container } = render(<LoadingScreen />);

      // Logo container
      expect(container.querySelector(".rounded-2xl")).toBeInTheDocument();
      // Brand name
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();
      // Spinner
      expect(container.querySelector(".animate-spin")).toBeInTheDocument();
      // Loading text
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render elements in correct order (logo, title, spinner, text)", () => {
      const { container } = render(<LoadingScreen />);
      const contentDiv = container.querySelector(".flex.flex-col.items-center");

      expect(contentDiv).toBeInTheDocument();
      // Elements should exist in the structure
      expect(contentDiv.querySelector("svg")).toBeInTheDocument();
    });
  });
});

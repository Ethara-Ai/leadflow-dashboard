/**
 * Unit Tests for ProductModalContent Component
 * Tests product information and support services display with theme support
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductModalContent from "./ProductModalContent";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe("ProductModalContent", () => {
  describe("basic rendering", () => {
    it("should render Advanced Features section heading", () => {
      renderWithTheme(<ProductModalContent />);
      expect(screen.getByText("Advanced Features")).toBeInTheDocument();
    });

    it("should render Support Services section heading", () => {
      renderWithTheme(<ProductModalContent />);
      expect(screen.getByText("Support Services")).toBeInTheDocument();
    });

    it("should render Real-time Lead Tracking feature", () => {
      renderWithTheme(<ProductModalContent />);
      expect(screen.getByText("Real-time Lead Tracking")).toBeInTheDocument();
    });

    it("should render Advanced Analytics Dashboard feature", () => {
      renderWithTheme(<ProductModalContent />);
      expect(
        screen.getByText("Advanced Analytics Dashboard"),
      ).toBeInTheDocument();
    });

    it("should render Smart Alert System feature", () => {
      renderWithTheme(<ProductModalContent />);
      expect(screen.getByText("Smart Alert System")).toBeInTheDocument();
    });

    it("should render 24/7 Technical Support service", () => {
      renderWithTheme(<ProductModalContent />);
      expect(screen.getByText("24/7 Technical Support")).toBeInTheDocument();
    });

    it("should render Sales Team Training service", () => {
      renderWithTheme(<ProductModalContent />);
      expect(screen.getByText("Sales Team Training")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Content Tests
  // ===========================================================================

  describe("content", () => {
    it("should display lead tracking description", () => {
      renderWithTheme(<ProductModalContent />);
      expect(
        screen.getByText(/Track leads across your pipeline/i),
      ).toBeInTheDocument();
    });

    it("should display analytics dashboard description", () => {
      renderWithTheme(<ProductModalContent />);
      expect(
        screen.getByText(/Interactive charts, conversion rate metrics/i),
      ).toBeInTheDocument();
    });

    it("should display alert system description", () => {
      renderWithTheme(<ProductModalContent />);
      expect(
        screen.getByText(/Automated lead monitoring with customizable alerts/i),
      ).toBeInTheDocument();
    });

    it("should display technical support description", () => {
      renderWithTheme(<ProductModalContent />);
      expect(
        screen.getByText(/Expert assistance available/i),
      ).toBeInTheDocument();
    });

    it("should display training description", () => {
      renderWithTheme(<ProductModalContent />);
      expect(
        screen.getByText(/Complete team onboarding program/i),
      ).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Dark Mode Styling Tests
  // ===========================================================================

  describe("dark mode styling", () => {
    it("should apply dark mode heading classes", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: true });
      const heading = screen.getByText("Advanced Features");
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should apply light mode heading classes", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: false });
      const heading = screen.getByText("Advanced Features");
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should apply dark mode text classes to descriptions", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: true });
      const description = screen.getByText(/Track leads across your pipeline/i);
      expect(description).toHaveClass("text-slate-400");
    });

    it("should apply light mode text classes to descriptions", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: false });
      const description = screen.getByText(/Track leads across your pipeline/i);
      expect(description).toHaveClass("text-slate-600");
    });

    it("should apply dark mode card background classes", () => {
      const { container } = renderWithTheme(<ProductModalContent />, {
        darkMode: true,
      });
      const cards = container.querySelectorAll(".bg-slate-700\\/30");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("should apply light mode card background classes", () => {
      const { container } = renderWithTheme(<ProductModalContent />, {
        darkMode: false,
      });
      const cards = container.querySelectorAll(".bg-slate-50");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Support Services Section Tests
  // ===========================================================================

  describe("support services section", () => {
    it("should apply dark mode styling to technical support card", () => {
      const { container } = renderWithTheme(<ProductModalContent />, {
        darkMode: true,
      });
      const blueCard = container.querySelector(".bg-blue-900\\/20");
      expect(blueCard).toBeInTheDocument();
    });

    it("should apply light mode styling to technical support card", () => {
      const { container } = renderWithTheme(<ProductModalContent />, {
        darkMode: false,
      });
      const blueCard = container.querySelector(".bg-blue-50");
      expect(blueCard).toBeInTheDocument();
    });

    it("should apply dark mode styling to training card", () => {
      const { container } = renderWithTheme(<ProductModalContent />, {
        darkMode: true,
      });
      const emeraldCard = container.querySelector(".bg-emerald-900\\/20");
      expect(emeraldCard).toBeInTheDocument();
    });

    it("should apply light mode styling to training card", () => {
      const { container } = renderWithTheme(<ProductModalContent />, {
        darkMode: false,
      });
      const emeraldCard = container.querySelector(".bg-emerald-50");
      expect(emeraldCard).toBeInTheDocument();
    });

    it("should apply dark mode text color to technical support heading", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: true });
      const heading = screen.getByText("24/7 Technical Support");
      expect(heading).toHaveClass("text-blue-400");
    });

    it("should apply light mode text color to technical support heading", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: false });
      const heading = screen.getByText("24/7 Technical Support");
      expect(heading).toHaveClass("text-blue-700");
    });

    it("should apply dark mode text color to training heading", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: true });
      const heading = screen.getByText("Sales Team Training");
      expect(heading).toHaveClass("text-emerald-400");
    });

    it("should apply light mode text color to training heading", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: false });
      const heading = screen.getByText("Sales Team Training");
      expect(heading).toHaveClass("text-emerald-700");
    });
  });

  // ===========================================================================
  // darkMode Override Prop Tests
  // ===========================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      renderWithTheme(<ProductModalContent darkMode={true} />, {
        darkMode: false, // Provider says light mode
      });
      const heading = screen.getByText("Advanced Features");
      // Override should take precedence
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should use darkMode override when provided (false)", () => {
      renderWithTheme(<ProductModalContent darkMode={false} />, {
        darkMode: true, // Provider says dark mode
      });
      const heading = screen.getByText("Advanced Features");
      // Override should take precedence
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should use context value when darkMode override is undefined", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: true });
      const heading = screen.getByText("Advanced Features");
      expect(heading).toHaveClass("text-slate-200");
    });
  });

  // ===========================================================================
  // Backward Compatibility Tests
  // ===========================================================================

  describe("backward compatibility (outside ThemeProvider)", () => {
    it("should render without ThemeProvider using darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<ProductModalContent darkMode={true} />);
      expect(screen.getByText("Advanced Features")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<ProductModalContent />);
      const heading = screen.getByText("Advanced Features");
      expect(heading).toHaveClass("text-slate-700");

      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Structure Tests
  // ===========================================================================

  describe("structure", () => {
    it("should have proper spacing classes on container", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("space-y-6");
    });

    it("should render h4 elements for section headings", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const h4Elements = container.querySelectorAll("h4");
      expect(h4Elements.length).toBe(2); // Advanced Features and Support Services
    });

    it("should render h5 elements for feature headings", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const h5Elements = container.querySelectorAll("h5");
      expect(h5Elements.length).toBe(3); // Real-time Lead Tracking, Analytics Dashboard, Smart Alert System
    });

    it("should render h6 elements for support service headings", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const h6Elements = container.querySelectorAll("h6");
      expect(h6Elements.length).toBe(2); // Technical Support and Sales Team Training
    });

    it("should render feature cards with rounded corners", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const roundedCards = container.querySelectorAll(".rounded-xl");
      expect(roundedCards.length).toBeGreaterThan(0);
    });

    it("should render support services in grid layout", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("should have responsive grid columns for support services", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-1");
      expect(grid).toHaveClass("sm:grid-cols-2");
    });
  });

  // ===========================================================================
  // Typography Tests
  // ===========================================================================

  describe("typography", () => {
    it("should apply font-bold to section headings", () => {
      renderWithTheme(<ProductModalContent />);
      const heading = screen.getByText("Advanced Features");
      expect(heading).toHaveClass("font-bold");
    });

    it("should apply text-lg to section headings", () => {
      renderWithTheme(<ProductModalContent />);
      const heading = screen.getByText("Advanced Features");
      expect(heading).toHaveClass("text-lg");
    });

    it("should apply font-semibold to feature headings", () => {
      renderWithTheme(<ProductModalContent />);
      const featureHeading = screen.getByText("Real-time Lead Tracking");
      expect(featureHeading).toHaveClass("font-semibold");
    });

    it("should apply font-medium to support service headings", () => {
      renderWithTheme(<ProductModalContent />);
      const serviceHeading = screen.getByText("24/7 Technical Support");
      expect(serviceHeading).toHaveClass("font-medium");
    });

    it("should apply text-sm to feature description paragraphs", () => {
      renderWithTheme(<ProductModalContent />);
      const description = screen.getByText(/Track leads across your pipeline/i);
      expect(description).toHaveClass("text-sm");
    });

    it("should apply text-xs to support service descriptions", () => {
      renderWithTheme(<ProductModalContent />);
      const description = screen.getByText(/Expert assistance available/i);
      expect(description).toHaveClass("text-xs");
    });
  });

  // ===========================================================================
  // Card Styling Tests
  // ===========================================================================

  describe("card styling", () => {
    it("should apply padding to feature cards", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const paddedCards = container.querySelectorAll(".p-4");
      expect(paddedCards.length).toBeGreaterThan(0);
    });

    it("should apply smaller padding to support service cards", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const smallPaddedCards = container.querySelectorAll(".p-3");
      expect(smallPaddedCards.length).toBe(2);
    });

    it("should apply rounded-lg to support service cards", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const roundedLgCards = container.querySelectorAll(".rounded-lg");
      expect(roundedLgCards.length).toBe(2);
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("edge cases", () => {
    it("should handle multiple renders without issues", () => {
      const { rerender } = renderWithTheme(<ProductModalContent />);

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <ProductModalContent />
        </ThemeProvider>,
      );

      expect(screen.getByText("Advanced Features")).toBeInTheDocument();
    });

    it("should render consistently in light mode", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: false });

      const heading = screen.getByText("Advanced Features");
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should render consistently in dark mode", () => {
      renderWithTheme(<ProductModalContent />, { darkMode: true });

      const heading = screen.getByText("Advanced Features");
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should render all three feature cards", () => {
      const { container } = renderWithTheme(<ProductModalContent />);
      const featureSection = container.querySelector(".space-y-3");
      expect(featureSection).toBeInTheDocument();
    });
  });
});

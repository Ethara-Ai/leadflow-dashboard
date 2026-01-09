/**
 * Unit Tests for ResourcesModalContent Component
 * Tests community resources and case studies display with theme support
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ResourcesModalContent from "./ResourcesModalContent";
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

describe("ResourcesModalContent", () => {
  describe("basic rendering", () => {
    it("should render Community Hub section heading", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(screen.getByText("Community Hub")).toBeInTheDocument();
    });

    it("should render Case Studies section heading", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(screen.getByText("Case Studies")).toBeInTheDocument();
    });

    it("should render Global Sales Network subsection", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(screen.getByText("Global Sales Network")).toBeInTheDocument();
    });

    it("should render Discussion Forums subsection", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(screen.getByText("Discussion Forums")).toBeInTheDocument();
    });

    it("should render TechCorp Enterprise Solutions case study", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(
        screen.getByText("TechCorp Enterprise Solutions"),
      ).toBeInTheDocument();
    });

    it("should render StartupX Growth Story case study", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(screen.getByText("StartupX Growth Story")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Content Tests
  // ===========================================================================

  describe("content", () => {
    it("should display global sales network description", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(
        screen.getByText(/Connect with sales professionals/i),
      ).toBeInTheDocument();
    });

    it("should display discussion forums description", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(
        screen.getByText(/Active community discussions on sales techniques/i),
      ).toBeInTheDocument();
    });

    it("should display TechCorp case study description", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(
        screen.getByText(/How leading enterprises use LeadFlow/i),
      ).toBeInTheDocument();
    });

    it("should display StartupX case study description", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(
        screen.getByText(
          /Real-world applications in scaling sales operations/i,
        ),
      ).toBeInTheDocument();
    });

    it("should mention 40% conversion rate increase in TechCorp case study", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(
        screen.getByText(/40% increase in conversion rates/i),
      ).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Dark Mode Styling Tests
  // ===========================================================================

  describe("dark mode styling", () => {
    it("should apply dark mode heading classes", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: true });
      const heading = screen.getByText("Community Hub");
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should apply light mode heading classes", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: false });
      const heading = screen.getByText("Community Hub");
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should apply dark mode text classes to descriptions", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: true });
      const description = screen.getByText(/Connect with sales professionals/i);
      expect(description).toHaveClass("text-slate-400");
    });

    it("should apply light mode text classes to descriptions", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: false });
      const description = screen.getByText(/Connect with sales professionals/i);
      expect(description).toHaveClass("text-slate-600");
    });

    it("should apply dark mode card background classes", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />, {
        darkMode: true,
      });
      const cards = container.querySelectorAll(".bg-slate-700\\/30");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("should apply light mode card background classes", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />, {
        darkMode: false,
      });
      const cards = container.querySelectorAll(".bg-slate-50");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Case Studies Section Tests
  // ===========================================================================

  describe("case studies section", () => {
    it("should apply dark mode styling to TechCorp case study card", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />, {
        darkMode: true,
      });
      const amberCard = container.querySelector(".bg-amber-900\\/20");
      expect(amberCard).toBeInTheDocument();
    });

    it("should apply light mode styling to TechCorp case study card", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />, {
        darkMode: false,
      });
      const amberCard = container.querySelector(".bg-amber-50");
      expect(amberCard).toBeInTheDocument();
    });

    it("should apply dark mode styling to StartupX case study card", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />, {
        darkMode: true,
      });
      const blueCard = container.querySelector(".bg-blue-900\\/20");
      expect(blueCard).toBeInTheDocument();
    });

    it("should apply light mode styling to StartupX case study card", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />, {
        darkMode: false,
      });
      const blueCard = container.querySelector(".bg-blue-50");
      expect(blueCard).toBeInTheDocument();
    });

    it("should apply dark mode text color to TechCorp heading", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: true });
      const heading = screen.getByText("TechCorp Enterprise Solutions");
      expect(heading).toHaveClass("text-amber-300");
    });

    it("should apply light mode text color to TechCorp heading", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: false });
      const heading = screen.getByText("TechCorp Enterprise Solutions");
      expect(heading).toHaveClass("text-amber-700");
    });

    it("should apply dark mode text color to StartupX heading", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: true });
      const heading = screen.getByText("StartupX Growth Story");
      expect(heading).toHaveClass("text-blue-300");
    });

    it("should apply light mode text color to StartupX heading", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: false });
      const heading = screen.getByText("StartupX Growth Story");
      expect(heading).toHaveClass("text-blue-700");
    });

    it("should have left border on case study cards", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />);
      const borderedCards = container.querySelectorAll(".border-l-4");
      expect(borderedCards.length).toBe(2);
    });

    it("should apply amber border to TechCorp card in dark mode", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />, {
        darkMode: true,
      });
      const amberBorderedCard = container.querySelector(".border-amber-500");
      expect(amberBorderedCard).toBeInTheDocument();
    });

    it("should apply blue border to StartupX card in dark mode", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />, {
        darkMode: true,
      });
      const blueBorderedCard = container.querySelector(".border-blue-500");
      expect(blueBorderedCard).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // darkMode Override Prop Tests
  // ===========================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      renderWithTheme(<ResourcesModalContent darkMode={true} />, {
        darkMode: false, // Provider says light mode
      });
      const heading = screen.getByText("Community Hub");
      // Override should take precedence
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should use darkMode override when provided (false)", () => {
      renderWithTheme(<ResourcesModalContent darkMode={false} />, {
        darkMode: true, // Provider says dark mode
      });
      const heading = screen.getByText("Community Hub");
      // Override should take precedence
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should use context value when darkMode override is undefined", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: true });
      const heading = screen.getByText("Community Hub");
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

      render(<ResourcesModalContent darkMode={true} />);
      expect(screen.getByText("Community Hub")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<ResourcesModalContent />);
      const heading = screen.getByText("Community Hub");
      expect(heading).toHaveClass("text-slate-700");

      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Structure Tests
  // ===========================================================================

  describe("structure", () => {
    it("should have proper spacing classes on container", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("space-y-6");
    });

    it("should render h4 elements for section headings", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />);
      const h4Elements = container.querySelectorAll("h4");
      expect(h4Elements.length).toBe(2); // Community Hub and Case Studies
    });

    it("should render h5 elements for community subsection headings", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />);
      const h5Elements = container.querySelectorAll("h5");
      expect(h5Elements.length).toBe(2); // Global Sales Network and Discussion Forums
    });

    it("should render h6 elements for case study headings", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />);
      const h6Elements = container.querySelectorAll("h6");
      expect(h6Elements.length).toBe(2); // TechCorp and StartupX
    });

    it("should render community cards with rounded corners", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />);
      const roundedCards = container.querySelectorAll(".rounded-xl");
      expect(roundedCards.length).toBeGreaterThan(0);
    });

    it("should render cards with padding", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />);
      const paddedCards = container.querySelectorAll(".p-4");
      expect(paddedCards.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Typography Tests
  // ===========================================================================

  describe("typography", () => {
    it("should apply font-bold to section headings", () => {
      renderWithTheme(<ResourcesModalContent />);
      const heading = screen.getByText("Community Hub");
      expect(heading).toHaveClass("font-bold");
    });

    it("should apply text-lg to section headings", () => {
      renderWithTheme(<ResourcesModalContent />);
      const heading = screen.getByText("Community Hub");
      expect(heading).toHaveClass("text-lg");
    });

    it("should apply font-semibold to community subsection headings", () => {
      renderWithTheme(<ResourcesModalContent />);
      const subheading = screen.getByText("Global Sales Network");
      expect(subheading).toHaveClass("font-semibold");
    });

    it("should apply font-medium to case study headings", () => {
      renderWithTheme(<ResourcesModalContent />);
      const caseHeading = screen.getByText("TechCorp Enterprise Solutions");
      expect(caseHeading).toHaveClass("font-medium");
    });

    it("should apply text-sm to description paragraphs", () => {
      renderWithTheme(<ResourcesModalContent />);
      const description = screen.getByText(/Connect with sales professionals/i);
      expect(description).toHaveClass("text-sm");
    });
  });

  // ===========================================================================
  // Community Section Tests
  // ===========================================================================

  describe("community section", () => {
    it("should have spacing between community cards", () => {
      const { container } = renderWithTheme(<ResourcesModalContent />);
      const spacedSection = container.querySelector(".space-y-3");
      expect(spacedSection).toBeInTheDocument();
    });

    it("should display networking-related content", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(
        screen.getByText(/business development experts/i),
      ).toBeInTheDocument();
    });

    it("should display forum-related content", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(screen.getByText(/CRM best practices/i)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("edge cases", () => {
    it("should handle multiple renders without issues", () => {
      const { rerender } = renderWithTheme(<ResourcesModalContent />);

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <ResourcesModalContent />
        </ThemeProvider>,
      );

      expect(screen.getByText("Community Hub")).toBeInTheDocument();
    });

    it("should render consistently in light mode", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: false });

      const heading = screen.getByText("Community Hub");
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should render consistently in dark mode", () => {
      renderWithTheme(<ResourcesModalContent />, { darkMode: true });

      const heading = screen.getByText("Community Hub");
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should render both community cards", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(screen.getByText("Global Sales Network")).toBeInTheDocument();
      expect(screen.getByText("Discussion Forums")).toBeInTheDocument();
    });

    it("should render both case study cards", () => {
      renderWithTheme(<ResourcesModalContent />);
      expect(
        screen.getByText("TechCorp Enterprise Solutions"),
      ).toBeInTheDocument();
      expect(screen.getByText("StartupX Growth Story")).toBeInTheDocument();
    });
  });
});

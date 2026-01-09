/**
 * Unit Tests for CompanyModalContent Component
 * Tests company information display with theme support
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CompanyModalContent from "./CompanyModalContent";
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

describe("CompanyModalContent", () => {
  describe("basic rendering", () => {
    it("should render Privacy Policy section heading", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    });

    it("should render Terms of Service section heading", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    });

    it("should render Data Protection subsection", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(screen.getByText("Data Protection")).toBeInTheDocument();
    });

    it("should render Data Ownership subsection", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(screen.getByText("Data Ownership")).toBeInTheDocument();
    });

    it("should render Professional License subsection", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(screen.getByText("Professional License")).toBeInTheDocument();
    });

    it("should render Data Compliance Standards subsection", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(screen.getByText("Data Compliance Standards")).toBeInTheDocument();
    });

    it("should render contact email information", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(screen.getByText(/legal@leadflow\.io/)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Content Tests
  // ===========================================================================

  describe("content", () => {
    it("should display data protection description", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(
        screen.getByText(/enterprise-grade encryption/i),
      ).toBeInTheDocument();
    });

    it("should display data ownership description", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(
        screen.getByText(/Your sales data belongs to you/i),
      ).toBeInTheDocument();
    });

    it("should display professional license description", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(screen.getByText(/Licensed for sales teams/i)).toBeInTheDocument();
    });

    it("should display compliance standards description", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(screen.getByText(/GDPR, CCPA, and SOC 2/i)).toBeInTheDocument();
    });

    it("should display contact information text", () => {
      renderWithTheme(<CompanyModalContent />);
      expect(
        screen.getByText(/For detailed legal documents, contact/i),
      ).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Dark Mode Styling Tests
  // ===========================================================================

  describe("dark mode styling", () => {
    it("should apply dark mode heading classes", () => {
      renderWithTheme(<CompanyModalContent />, { darkMode: true });
      const privacyHeading = screen.getByText("Privacy Policy");
      expect(privacyHeading).toHaveClass("text-slate-200");
    });

    it("should apply light mode heading classes", () => {
      renderWithTheme(<CompanyModalContent />, { darkMode: false });
      const privacyHeading = screen.getByText("Privacy Policy");
      expect(privacyHeading).toHaveClass("text-slate-700");
    });

    it("should apply dark mode text classes to descriptions", () => {
      renderWithTheme(<CompanyModalContent />, { darkMode: true });
      const description = screen.getByText(/enterprise-grade encryption/i);
      expect(description).toHaveClass("text-slate-400");
    });

    it("should apply light mode text classes to descriptions", () => {
      renderWithTheme(<CompanyModalContent />, { darkMode: false });
      const description = screen.getByText(/enterprise-grade encryption/i);
      expect(description).toHaveClass("text-slate-600");
    });

    it("should apply dark mode card background classes", () => {
      const { container } = renderWithTheme(<CompanyModalContent />, {
        darkMode: true,
      });
      const cards = container.querySelectorAll(".bg-slate-700\\/30");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("should apply light mode card background classes", () => {
      const { container } = renderWithTheme(<CompanyModalContent />, {
        darkMode: false,
      });
      const cards = container.querySelectorAll(".bg-slate-50");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Contact Info Section Tests
  // ===========================================================================

  describe("contact info section", () => {
    it("should apply dark mode styling to contact section", () => {
      const { container } = renderWithTheme(<CompanyModalContent />, {
        darkMode: true,
      });
      const contactSection = container.querySelector(".bg-blue-900\\/20");
      expect(contactSection).toBeInTheDocument();
    });

    it("should apply light mode styling to contact section", () => {
      const { container } = renderWithTheme(<CompanyModalContent />, {
        darkMode: false,
      });
      const contactSection = container.querySelector(".bg-blue-50");
      expect(contactSection).toBeInTheDocument();
    });

    it("should apply dark mode text color to contact text", () => {
      renderWithTheme(<CompanyModalContent />, { darkMode: true });
      const contactText = screen.getByText(/legal@leadflow\.io/);
      expect(contactText).toHaveClass("text-blue-300");
    });

    it("should apply light mode text color to contact text", () => {
      renderWithTheme(<CompanyModalContent />, { darkMode: false });
      const contactText = screen.getByText(/legal@leadflow\.io/);
      expect(contactText).toHaveClass("text-blue-700");
    });

    it("should center contact text", () => {
      renderWithTheme(<CompanyModalContent />);
      const contactText = screen.getByText(/legal@leadflow\.io/);
      expect(contactText).toHaveClass("text-center");
    });
  });

  // ===========================================================================
  // darkMode Override Prop Tests
  // ===========================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      renderWithTheme(<CompanyModalContent darkMode={true} />, {
        darkMode: false, // Provider says light mode
      });
      const heading = screen.getByText("Privacy Policy");
      // Override should take precedence
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should use darkMode override when provided (false)", () => {
      renderWithTheme(<CompanyModalContent darkMode={false} />, {
        darkMode: true, // Provider says dark mode
      });
      const heading = screen.getByText("Privacy Policy");
      // Override should take precedence
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should use context value when darkMode override is undefined", () => {
      renderWithTheme(<CompanyModalContent />, { darkMode: true });
      const heading = screen.getByText("Privacy Policy");
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

      render(<CompanyModalContent darkMode={true} />);
      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<CompanyModalContent />);
      const heading = screen.getByText("Privacy Policy");
      expect(heading).toHaveClass("text-slate-700");

      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Structure Tests
  // ===========================================================================

  describe("structure", () => {
    it("should have proper spacing classes on container", () => {
      const { container } = renderWithTheme(<CompanyModalContent />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("space-y-6");
    });

    it("should render h4 elements for section headings", () => {
      const { container } = renderWithTheme(<CompanyModalContent />);
      const h4Elements = container.querySelectorAll("h4");
      expect(h4Elements.length).toBe(2); // Privacy Policy and Terms of Service
    });

    it("should render h6 elements for subsection headings", () => {
      const { container } = renderWithTheme(<CompanyModalContent />);
      const h6Elements = container.querySelectorAll("h6");
      expect(h6Elements.length).toBe(4); // Data Protection, Data Ownership, Professional License, Data Compliance
    });

    it("should render cards with rounded corners", () => {
      const { container } = renderWithTheme(<CompanyModalContent />);
      const roundedCards = container.querySelectorAll(".rounded-xl");
      expect(roundedCards.length).toBeGreaterThan(0);
    });

    it("should render cards with padding", () => {
      const { container } = renderWithTheme(<CompanyModalContent />);
      const paddedCards = container.querySelectorAll(".p-4");
      expect(paddedCards.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Typography Tests
  // ===========================================================================

  describe("typography", () => {
    it("should apply font-bold to section headings", () => {
      renderWithTheme(<CompanyModalContent />);
      const heading = screen.getByText("Privacy Policy");
      expect(heading).toHaveClass("font-bold");
    });

    it("should apply text-lg to section headings", () => {
      renderWithTheme(<CompanyModalContent />);
      const heading = screen.getByText("Privacy Policy");
      expect(heading).toHaveClass("text-lg");
    });

    it("should apply font-medium to subsection headings", () => {
      renderWithTheme(<CompanyModalContent />);
      const subheading = screen.getByText("Data Protection");
      expect(subheading).toHaveClass("font-medium");
    });

    it("should apply text-sm to description paragraphs", () => {
      renderWithTheme(<CompanyModalContent />);
      const description = screen.getByText(/enterprise-grade encryption/i);
      expect(description).toHaveClass("text-sm");
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("edge cases", () => {
    it("should handle multiple renders without issues", () => {
      const { rerender } = renderWithTheme(<CompanyModalContent />);

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <CompanyModalContent />
        </ThemeProvider>,
      );

      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    });

    it("should render consistently in light mode", () => {
      renderWithTheme(<CompanyModalContent />, { darkMode: false });

      const heading = screen.getByText("Privacy Policy");
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should render consistently in dark mode", () => {
      renderWithTheme(<CompanyModalContent />, { darkMode: true });

      const heading = screen.getByText("Privacy Policy");
      expect(heading).toHaveClass("text-slate-200");
    });
  });
});

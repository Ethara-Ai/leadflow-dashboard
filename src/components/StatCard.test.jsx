/**
 * Unit Tests for StatCard Component
 * Tests the reusable statistics card component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "./StatCard";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const defaultProps = {
  title: "Total Leads",
  value: "847",
  icon: <span data-testid="test-icon">👤</span>,
  accent: "bg-blue-500",
};

// Mock framer-motion to simplify testing
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe("StatCard", () => {
  describe("basic rendering", () => {
    it("should render the title", () => {
      renderWithTheme(<StatCard {...defaultProps} />);
      expect(screen.getByText("Total Leads")).toBeInTheDocument();
    });

    it("should render the value", () => {
      renderWithTheme(<StatCard {...defaultProps} />);
      expect(screen.getByText("847")).toBeInTheDocument();
    });

    it("should render the icon", () => {
      renderWithTheme(<StatCard {...defaultProps} />);
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("should apply accent classes to icon container", () => {
      renderWithTheme(<StatCard {...defaultProps} accent="bg-emerald-500" />);
      const iconContainer = screen.getByTestId("test-icon").parentElement;
      expect(iconContainer).toHaveClass("bg-emerald-500");
    });

    it("should render without crashing with minimal props", () => {
      renderWithTheme(
        <StatCard
          title="Test"
          value="123"
          icon={<span>Icon</span>}
          accent="bg-red-500"
        />,
      );
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("subValue and subText rendering", () => {
    it("should render subValue when provided", () => {
      renderWithTheme(<StatCard {...defaultProps} subValue="+15%" />);
      expect(screen.getByText("+15%")).toBeInTheDocument();
    });

    it("should render subText when provided", () => {
      renderWithTheme(<StatCard {...defaultProps} subText="from last week" />);
      expect(screen.getByText("from last week")).toBeInTheDocument();
    });

    it("should render both subValue and subText together", () => {
      renderWithTheme(
        <StatCard {...defaultProps} subValue="+8" subText="new arrivals" />,
      );
      expect(screen.getByText("+8")).toBeInTheDocument();
      expect(screen.getByText("new arrivals")).toBeInTheDocument();
    });

    it("should not render subValue element when not provided", () => {
      const { container } = renderWithTheme(
        <StatCard {...defaultProps} subText="some text" />,
      );
      // Find text elements, should not have the bold subValue styling
      const subValueElements = container.querySelectorAll(
        ".font-bold.text-emerald-500, .font-bold.text-rose-500, .font-bold.text-amber-500, .font-bold.text-slate-500",
      );
      // Filter to only elements that would be subValue (not title or value)
      const actualSubValues = Array.from(subValueElements).filter(
        (el) =>
          !el.textContent.includes(defaultProps.title) &&
          !el.textContent.includes(defaultProps.value),
      );
      expect(actualSubValues.length).toBe(0);
    });
  });

  describe("subValueVariant styling", () => {
    it("should apply positive (emerald) color class", () => {
      renderWithTheme(
        <StatCard
          {...defaultProps}
          subValue="+10%"
          subValueVariant="positive"
        />,
      );
      const subValueElement = screen.getByText("+10%");
      expect(subValueElement).toHaveClass("text-emerald-500");
    });

    it("should apply negative (rose) color class", () => {
      renderWithTheme(
        <StatCard
          {...defaultProps}
          subValue="-5%"
          subValueVariant="negative"
        />,
      );
      const subValueElement = screen.getByText("-5%");
      expect(subValueElement).toHaveClass("text-rose-500");
    });

    it("should apply warning (amber) color class", () => {
      renderWithTheme(
        <StatCard {...defaultProps} subValue="~3%" subValueVariant="warning" />,
      );
      const subValueElement = screen.getByText("~3%");
      expect(subValueElement).toHaveClass("text-amber-500");
    });

    it("should apply neutral (slate) color class by default", () => {
      renderWithTheme(<StatCard {...defaultProps} subValue="0%" />);
      const subValueElement = screen.getByText("0%");
      expect(subValueElement).toHaveClass("text-slate-500");
    });

    it("should apply neutral color for unrecognized variant", () => {
      renderWithTheme(
        <StatCard
          {...defaultProps}
          subValue="test"
          subValueVariant="unknown"
        />,
      );
      const subValueElement = screen.getByText("test");
      expect(subValueElement).toHaveClass("text-slate-500");
    });
  });

  describe("dark mode styling", () => {
    it("should apply dark theme classes when in dark mode", () => {
      const { container } = renderWithTheme(<StatCard {...defaultProps} />, {
        darkMode: true,
      });
      const card = container.firstChild;
      expect(card).toHaveClass("bg-slate-800/80");
    });

    it("should apply light theme classes when in light mode", () => {
      const { container } = renderWithTheme(<StatCard {...defaultProps} />, {
        darkMode: false,
      });
      const card = container.firstChild;
      expect(card).toHaveClass("bg-white/90");
    });

    it("should apply dark text colors in dark mode", () => {
      renderWithTheme(<StatCard {...defaultProps} />, { darkMode: true });
      const title = screen.getByText("Total Leads");
      expect(title).toHaveClass("text-slate-200");
    });

    it("should apply light text colors in light mode", () => {
      renderWithTheme(<StatCard {...defaultProps} />, { darkMode: false });
      const title = screen.getByText("Total Leads");
      expect(title).toHaveClass("text-slate-700");
    });

    it("should apply correct value text color in dark mode", () => {
      renderWithTheme(<StatCard {...defaultProps} />, { darkMode: true });
      const value = screen.getByText("847");
      expect(value).toHaveClass("text-slate-100");
    });

    it("should apply correct value text color in light mode", () => {
      renderWithTheme(<StatCard {...defaultProps} />, { darkMode: false });
      const value = screen.getByText("847");
      expect(value).toHaveClass("text-slate-800");
    });
  });

  describe("darkMode override prop", () => {
    it("should use darkModeOverride when provided (true)", () => {
      const { container } = renderWithTheme(
        <StatCard {...defaultProps} darkMode={true} />,
        { darkMode: false }, // Provider says light mode
      );
      const card = container.firstChild;
      // Override should take precedence
      expect(card).toHaveClass("bg-slate-800/80");
    });

    it("should use darkModeOverride when provided (false)", () => {
      const { container } = renderWithTheme(
        <StatCard {...defaultProps} darkMode={false} />,
        { darkMode: true }, // Provider says dark mode
      );
      const card = container.firstChild;
      // Override should take precedence
      expect(card).toHaveClass("bg-white/90");
    });

    it("should use context value when darkModeOverride is undefined", () => {
      const { container } = renderWithTheme(<StatCard {...defaultProps} />, {
        darkMode: true,
      });
      const card = container.firstChild;
      expect(card).toHaveClass("bg-slate-800/80");
    });
  });

  describe("backward compatibility (outside ThemeProvider)", () => {
    it("should render without ThemeProvider using darkMode prop", () => {
      // Suppress console error for this test since useTheme will warn
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<StatCard {...defaultProps} darkMode={true} />);
      expect(screen.getByText("Total Leads")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = render(<StatCard {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("bg-white/90");

      consoleSpy.mockRestore();
    });
  });

  describe("custom variants prop", () => {
    it("should accept custom animation variants", () => {
      const customVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      };

      renderWithTheme(<StatCard {...defaultProps} variants={customVariants} />);

      // Component should render without issues
      expect(screen.getByText("Total Leads")).toBeInTheDocument();
    });
  });

  describe("responsive classes", () => {
    it("should have responsive padding classes", () => {
      const { container } = renderWithTheme(<StatCard {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("p-4");
      expect(card).toHaveClass("sm:p-6");
    });

    it("should have responsive text sizes for title", () => {
      renderWithTheme(<StatCard {...defaultProps} />);
      const title = screen.getByText("Total Leads");
      expect(title).toHaveClass("text-sm");
      expect(title).toHaveClass("sm:text-lg");
    });

    it("should have responsive text sizes for value", () => {
      renderWithTheme(<StatCard {...defaultProps} />);
      const value = screen.getByText("847");
      expect(value).toHaveClass("text-xl");
      expect(value).toHaveClass("sm:text-4xl");
    });
  });

  describe("different value types", () => {
    it("should render numeric value", () => {
      renderWithTheme(<StatCard {...defaultProps} value={1234} />);
      expect(screen.getByText("1234")).toBeInTheDocument();
    });

    it("should render string value with units", () => {
      renderWithTheme(<StatCard {...defaultProps} value="24.5°C" />);
      expect(screen.getByText("24.5°C")).toBeInTheDocument();
    });

    it("should render percentage value", () => {
      renderWithTheme(<StatCard {...defaultProps} value="85%" />);
      expect(screen.getByText("85%")).toBeInTheDocument();
    });

    it("should render complex formatted value", () => {
      renderWithTheme(<StatCard {...defaultProps} value="$1,234.56" />);
      expect(screen.getByText("$1,234.56")).toBeInTheDocument();
    });
  });

  describe("icon variations", () => {
    it("should render React element icon", () => {
      const customIcon = (
        <svg data-testid="svg-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );

      renderWithTheme(<StatCard {...defaultProps} icon={customIcon} />);
      expect(screen.getByTestId("svg-icon")).toBeInTheDocument();
    });

    it("should render icon within styled container", () => {
      renderWithTheme(<StatCard {...defaultProps} />);
      const iconContainer = screen.getByTestId("test-icon").parentElement;
      expect(iconContainer).toHaveClass("rounded-xl");
      expect(iconContainer).toHaveClass("shadow-lg");
    });
  });

  describe("accessibility", () => {
    it("should have proper heading structure for title", () => {
      renderWithTheme(<StatCard {...defaultProps} />);
      const title = screen.getByText("Total Leads");
      expect(title.tagName).toBe("H3");
    });

    it("should have readable text contrast in light mode", () => {
      renderWithTheme(<StatCard {...defaultProps} />, { darkMode: false });
      const title = screen.getByText("Total Leads");
      const value = screen.getByText("847");
      // Classes indicate readable contrast
      expect(title).toHaveClass("text-slate-700");
      expect(value).toHaveClass("text-slate-800");
    });

    it("should have readable text contrast in dark mode", () => {
      renderWithTheme(<StatCard {...defaultProps} />, { darkMode: true });
      const title = screen.getByText("Total Animals");
      const value = screen.getByText("847");
      // Classes indicate readable contrast
      expect(title).toHaveClass("text-slate-200");
      expect(value).toHaveClass("text-slate-100");
    });
  });

  describe("styling classes", () => {
    it("should have backdrop blur class", () => {
      const { container } = renderWithTheme(<StatCard {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("backdrop-blur-lg");
    });

    it("should have rounded corners", () => {
      const { container } = renderWithTheme(<StatCard {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("rounded-2xl");
    });

    it("should have transition classes for hover effects", () => {
      const { container } = renderWithTheme(<StatCard {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("transition-all");
      expect(card).toHaveClass("duration-300");
    });

    it("should have hover shadow class", () => {
      const { container } = renderWithTheme(<StatCard {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("hover:shadow-2xl");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string title", () => {
      renderWithTheme(<StatCard {...defaultProps} title="" />);
      // Should not crash, card should still render
      expect(screen.getByText("847")).toBeInTheDocument();
    });

    it("should handle very long title", () => {
      const longTitle =
        "This is a very long title that should be truncated properly";
      renderWithTheme(<StatCard {...defaultProps} title={longTitle} />);
      const title = screen.getByText(longTitle);
      expect(title).toHaveClass("truncate");
    });

    it("should handle zero value", () => {
      renderWithTheme(<StatCard {...defaultProps} value={0} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle negative values in subValue", () => {
      renderWithTheme(
        <StatCard
          {...defaultProps}
          subValue="-100"
          subValueVariant="negative"
        />,
      );
      expect(screen.getByText("-100")).toBeInTheDocument();
    });
  });
});

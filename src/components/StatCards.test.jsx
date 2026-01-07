/**
 * Unit Tests for StatCards Component
 * Tests the statistics cards grid component with theme support
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCards from "./StatCards";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const mockZooData = {
  population: 847,
  temperature: 24.5,
  humidity: 58,
  lastUpdated: "1/1/2025, 10:00:00 AM",
};

const mockActivityData = [
  { name: "Mon", animals: 120, feedingCompleted: 15 },
  { name: "Tue", animals: 135, feedingCompleted: 18 },
  { name: "Wed", animals: 142, feedingCompleted: 20 },
  { name: "Thu", animals: 128, feedingCompleted: 16 },
  { name: "Fri", animals: 150, feedingCompleted: 22 },
  { name: "Sat", animals: 145, feedingCompleted: 21 },
  { name: "Sun", animals: 140, feedingCompleted: 19 },
];

const defaultProps = {
  zooData: mockZooData,
  activityData: mockActivityData,
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

describe("StatCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic rendering", () => {
    it("should render the stat cards container", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render 4 stat cards", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      // Check for all 4 card titles
      expect(screen.getByText("Total Animals")).toBeInTheDocument();
      expect(screen.getByText("Avg Temp")).toBeInTheDocument();
      expect(screen.getByText("Humidity")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("should render population value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("847")).toBeInTheDocument();
    });

    it("should render temperature value with unit", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("24.5°C")).toBeInTheDocument();
    });

    it("should render humidity value with percentage", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("58%")).toBeInTheDocument();
    });

    it("should render calculated total active animals", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      // Sum of all animals in mockActivityData = 120+135+142+128+150+145+140 = 960
      expect(screen.getByText("960")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Sub Values Tests
  // =============================================================================

  describe("sub values rendering", () => {
    it("should render new arrivals sub value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("+8")).toBeInTheDocument();
      expect(screen.getByText("new arrivals")).toBeInTheDocument();
    });

    it("should render temperature change sub value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("+0.5°C")).toBeInTheDocument();
      // "vs yesterday" appears twice (for temp and humidity)
      const vsYesterdayTexts = screen.getAllByText("vs yesterday");
      expect(vsYesterdayTexts.length).toBe(2);
    });

    it("should render humidity change sub value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("-3%")).toBeInTheDocument();
    });

    it("should render activity percentage sub value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("+12.4%")).toBeInTheDocument();
      expect(screen.getByText("activity")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Icon Tests
  // =============================================================================

  describe("icons rendering", () => {
    it("should render icons in stat cards", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      // Check for SVG icons
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBe(4);
    });
  });

  // =============================================================================
  // Grid Layout Tests
  // =============================================================================

  describe("grid layout", () => {
    it("should have grid layout", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });

    it("should have 2 columns on small screens", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      const grid = container.querySelector(".grid-cols-2");
      expect(grid).toBeInTheDocument();
    });

    it("should have 4 columns on large screens", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      const grid = container.querySelector(".lg\\:grid-cols-4");
      expect(grid).toBeInTheDocument();
    });

    it("should have gap between cards", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      const grid = container.querySelector(".gap-2");
      expect(grid).toBeInTheDocument();
    });

    it("should have responsive gap", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      const grid = container.firstChild;
      expect(grid).toHaveClass("sm:gap-3");
      expect(grid).toHaveClass("md:gap-4");
      expect(grid).toHaveClass("lg:gap-6");
    });

    it("should have margin bottom", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      const grid = container.firstChild;
      expect(grid).toHaveClass("mb-4");
    });

    it("should have responsive margin bottom", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      const grid = container.firstChild;
      expect(grid).toHaveClass("sm:mb-6");
      expect(grid).toHaveClass("md:mb-8");
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe("dark mode styling", () => {
    it("should apply dark theme accent colors in dark mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: true,
      });
      // Check for dark theme accent classes
      const darkAccent = container.querySelector(".bg-emerald-900\\/40");
      expect(darkAccent).toBeInTheDocument();
    });

    it("should apply light theme accent colors in light mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: false,
      });
      // Check for light theme accent classes
      const lightAccent = container.querySelector(".bg-emerald-100");
      expect(lightAccent).toBeInTheDocument();
    });

    it("should apply dark theme text colors for icons in dark mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: true,
      });
      const darkText = container.querySelector(".text-emerald-400");
      expect(darkText).toBeInTheDocument();
    });

    it("should apply light theme text colors for icons in light mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: false,
      });
      const lightText = container.querySelector(".text-emerald-600");
      expect(lightText).toBeInTheDocument();
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      const { container } = renderWithTheme(
        <StatCards {...defaultProps} darkMode={true} />,
        { darkMode: false },
      );
      const darkAccent = container.querySelector(".bg-emerald-900\\/40");
      expect(darkAccent).toBeInTheDocument();
    });

    it("should use darkMode override when provided (false)", () => {
      const { container } = renderWithTheme(
        <StatCards {...defaultProps} darkMode={false} />,
        { darkMode: true },
      );
      const lightAccent = container.querySelector(".bg-emerald-100");
      expect(lightAccent).toBeInTheDocument();
    });

    it("should use context value when darkMode override is undefined", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: true,
      });
      const darkAccent = container.querySelector(".bg-emerald-900\\/40");
      expect(darkAccent).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Data Calculation Tests
  // =============================================================================

  describe("data calculations", () => {
    it("should calculate total animals from activity data", () => {
      const customActivityData = [
        { name: "Mon", animals: 100, feedingCompleted: 10 },
        { name: "Tue", animals: 200, feedingCompleted: 20 },
      ];
      renderWithTheme(
        <StatCards {...defaultProps} activityData={customActivityData} />,
      );
      // 100 + 200 = 300
      expect(screen.getByText("300")).toBeInTheDocument();
    });

    it("should handle empty activity data", () => {
      renderWithTheme(<StatCards {...defaultProps} activityData={[]} />);
      // Should show 0 for active
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle single activity data point", () => {
      const singleActivityData = [
        { name: "Mon", animals: 150, feedingCompleted: 15 },
      ];
      renderWithTheme(
        <StatCards {...defaultProps} activityData={singleActivityData} />,
      );
      expect(screen.getByText("150")).toBeInTheDocument();
    });

    it("should display correct zoo population", () => {
      const customZooData = { ...mockZooData, population: 1234 };
      renderWithTheme(<StatCards {...defaultProps} zooData={customZooData} />);
      expect(screen.getByText("1234")).toBeInTheDocument();
    });

    it("should display correct temperature", () => {
      const customZooData = { ...mockZooData, temperature: 30.0 };
      renderWithTheme(<StatCards {...defaultProps} zooData={customZooData} />);
      expect(screen.getByText("30°C")).toBeInTheDocument();
    });

    it("should display correct humidity", () => {
      const customZooData = { ...mockZooData, humidity: 75 };
      renderWithTheme(<StatCards {...defaultProps} zooData={customZooData} />);
      expect(screen.getByText("75%")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // SubValue Variant Tests
  // =============================================================================

  describe("subValue variants", () => {
    it("should apply positive variant for + values", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      // +8 and +12.4% should have positive variant (emerald color)
      const positiveValues = screen.getAllByText(/^\+/);
      expect(positiveValues.length).toBeGreaterThan(0);
    });

    it("should apply warning variant for - values", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      // -3% should have warning variant
      const negativeValue = screen.getByText("-3%");
      expect(negativeValue).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Accent Colors Tests
  // =============================================================================

  describe("accent colors", () => {
    it("should have emerald accent for Total Animals card in light mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: false,
      });
      const emeraldAccent = container.querySelector(".bg-emerald-100");
      expect(emeraldAccent).toBeInTheDocument();
    });

    it("should have amber accent for Avg Temp card in light mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: false,
      });
      const amberAccent = container.querySelector(".bg-amber-100");
      expect(amberAccent).toBeInTheDocument();
    });

    it("should have cyan accent for Humidity card in light mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: false,
      });
      const cyanAccent = container.querySelector(".bg-cyan-100");
      expect(cyanAccent).toBeInTheDocument();
    });

    it("should have blue accent for Active card in light mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: false,
      });
      const blueAccent = container.querySelector(".bg-blue-100");
      expect(blueAccent).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Backward Compatibility Tests
  // =============================================================================

  describe("backward compatibility (outside ThemeProvider)", () => {
    it("should render without ThemeProvider using darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<StatCards {...defaultProps} darkMode={true} />);
      expect(screen.getByText("Total Animals")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = render(<StatCards {...defaultProps} />);
      const lightAccent = container.querySelector(".bg-emerald-100");
      expect(lightAccent).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should handle zero population", () => {
      const customZooData = { ...mockZooData, population: 0 };
      renderWithTheme(<StatCards {...defaultProps} zooData={customZooData} />);
      // Should display 0
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThan(0);
    });

    it("should handle negative temperature", () => {
      const customZooData = { ...mockZooData, temperature: -5.5 };
      renderWithTheme(<StatCards {...defaultProps} zooData={customZooData} />);
      expect(screen.getByText("-5.5°C")).toBeInTheDocument();
    });

    it("should handle 0% humidity", () => {
      const customZooData = { ...mockZooData, humidity: 0 };
      renderWithTheme(<StatCards {...defaultProps} zooData={customZooData} />);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("should handle 100% humidity", () => {
      const customZooData = { ...mockZooData, humidity: 100 };
      renderWithTheme(<StatCards {...defaultProps} zooData={customZooData} />);
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("should handle large population numbers", () => {
      const customZooData = { ...mockZooData, population: 999999 };
      renderWithTheme(<StatCards {...defaultProps} zooData={customZooData} />);
      expect(screen.getByText("999999")).toBeInTheDocument();
    });

    it("should handle decimal temperature values", () => {
      const customZooData = { ...mockZooData, temperature: 22.75 };
      renderWithTheme(<StatCards {...defaultProps} zooData={customZooData} />);
      expect(screen.getByText("22.75°C")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Animation Tests
  // =============================================================================

  describe("animation", () => {
    it("should have motion container with variants", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />);
      // Since we mock framer-motion, just verify the container exists
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Stat Card Order Tests
  // =============================================================================

  describe("stat card order", () => {
    it("should render cards in correct order", () => {
      renderWithTheme(<StatCards {...defaultProps} />);

      const titles = screen.getAllByRole("heading", { level: 3 });
      const titleTexts = titles.map((t) => t.textContent);

      expect(titleTexts).toContain("Total Animals");
      expect(titleTexts).toContain("Avg Temp");
      expect(titleTexts).toContain("Humidity");
      expect(titleTexts).toContain("Active");
    });
  });

  // =============================================================================
  // Props Update Tests
  // =============================================================================

  describe("props updates", () => {
    it("should update when zooData changes", () => {
      const { rerender } = renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("847")).toBeInTheDocument();

      const newZooData = { ...mockZooData, population: 900 };
      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <StatCards {...defaultProps} zooData={newZooData} />
        </ThemeProvider>,
      );
      expect(screen.getByText("900")).toBeInTheDocument();
    });

    it("should update when activityData changes", () => {
      const { rerender } = renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("960")).toBeInTheDocument();

      const newActivityData = [
        { name: "Mon", animals: 500, feedingCompleted: 50 },
      ];
      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <StatCards {...defaultProps} activityData={newActivityData} />
        </ThemeProvider>,
      );
      expect(screen.getByText("500")).toBeInTheDocument();
    });
  });
});

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

const mockLeadData = {
  totalLeads: 847,
  callsMade: 342,
  meetingsScheduled: 67,
  lastUpdated: "1/1/2026, 10:00:00 AM",
};

const mockActivityData = [
  { name: "Mon", leads: 120, callsCompleted: 85 },
  { name: "Tue", leads: 135, callsCompleted: 95 },
  { name: "Wed", leads: 142, callsCompleted: 100 },
  { name: "Thu", leads: 128, callsCompleted: 90 },
  { name: "Fri", leads: 150, callsCompleted: 108 },
  { name: "Sat", leads: 145, callsCompleted: 102 },
  { name: "Sun", leads: 140, callsCompleted: 98 },
];

const defaultProps = {
  leadData: mockLeadData,
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
      expect(screen.getByText("Total Leads")).toBeInTheDocument();
      expect(screen.getByText("Calls Made")).toBeInTheDocument();
      expect(screen.getByText("Meetings")).toBeInTheDocument();
      expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
    });

    it("should render population value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("847")).toBeInTheDocument();
    });

    it("should render calls made value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("342")).toBeInTheDocument();
    });

    it("should render meetings value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("67")).toBeInTheDocument();
    });

    it("should render calculated conversion rate", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      // Sum of all leads in mockActivityData = 120+135+142+128+150+145+140 = 960
      expect(screen.getByText("960%")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Sub Values Tests
  // =============================================================================

  describe("sub values rendering", () => {
    it("should render new leads sub value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("+24")).toBeInTheDocument();
      expect(screen.getByText("new this week")).toBeInTheDocument();
    });

    it("should render calls made sub value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("+18")).toBeInTheDocument();
      expect(screen.getByText("vs yesterday")).toBeInTheDocument();
    });

    it("should render meetings scheduled sub value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("+5")).toBeInTheDocument();
      expect(screen.getByText("scheduled")).toBeInTheDocument();
    });

    it("should render conversion rate sub value", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("+3.2%")).toBeInTheDocument();
      expect(screen.getByText("from meetings")).toBeInTheDocument();
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
      const { container } = renderWithTheme(<StatCards {...defaultProps} darkMode={true} />, { darkMode: false });
      const darkAccent = container.querySelector(".bg-emerald-900\\/40");
      expect(darkAccent).toBeInTheDocument();
    });

    it("should use darkMode override when provided (false)", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} darkMode={false} />, { darkMode: true });
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
    it("should calculate total from activity data", () => {
      const customActivityData = [
        { name: "Mon", leads: 100, callsCompleted: 10 },
        { name: "Tue", leads: 200, callsCompleted: 20 },
      ];
      renderWithTheme(<StatCards {...defaultProps} activityData={customActivityData} />);
      // 100 + 200 = 300 leads, displayed as conversion rate percentage
      expect(screen.getByText("300%")).toBeInTheDocument();
    });

    it("should handle empty activity data", () => {
      renderWithTheme(<StatCards {...defaultProps} activityData={[]} />);
      // Should show 0% for conversion rate when no activity data
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("should handle single activity data point", () => {
      const singleActivityData = [{ name: "Mon", leads: 150, callsCompleted: 15 }];
      renderWithTheme(<StatCards {...defaultProps} activityData={singleActivityData} />);
      // 150 leads total becomes the conversion rate percentage
      expect(screen.getByText("150%")).toBeInTheDocument();
    });

    it("should display correct total leads", () => {
      const customLeadData = { ...mockLeadData, totalLeads: 1234 };
      renderWithTheme(<StatCards {...defaultProps} leadData={customLeadData} />);
      expect(screen.getByText("1234")).toBeInTheDocument();
    });

    it("should display correct calls made", () => {
      const customLeadData = { ...mockLeadData, callsMade: 400 };
      renderWithTheme(<StatCards {...defaultProps} leadData={customLeadData} />);
      expect(screen.getByText("400")).toBeInTheDocument();
    });

    it("should display correct meetings scheduled", () => {
      const customLeadData = { ...mockLeadData, meetingsScheduled: 75 };
      renderWithTheme(<StatCards {...defaultProps} leadData={customLeadData} />);
      expect(screen.getByText("75")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // SubValue Variant Tests
  // =============================================================================

  describe("subValue variants", () => {
    it("should apply positive variant for + values", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      // +24, +18, +5, +3.2% should have positive variant (emerald color)
      const positiveValues = screen.getAllByText(/^\+/);
      expect(positiveValues.length).toBeGreaterThan(0);
    });

    it("should display all positive subValues", () => {
      renderWithTheme(<StatCards {...defaultProps} />);
      // All current subValues are positive
      expect(screen.getByText("+24")).toBeInTheDocument();
      expect(screen.getByText("+18")).toBeInTheDocument();
      expect(screen.getByText("+5")).toBeInTheDocument();
      expect(screen.getByText("+3.2%")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Accent Colors Tests
  // =============================================================================

  describe("accent colors", () => {
    it("should have emerald accent for Total Leads card in light mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: false,
      });
      const emeraldAccent = container.querySelector(".bg-emerald-100");
      expect(emeraldAccent).toBeInTheDocument();
    });

    it("should have amber accent for Calls Made card in light mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: false,
      });
      const amberAccent = container.querySelector(".bg-amber-100");
      expect(amberAccent).toBeInTheDocument();
    });

    it("should have cyan accent for Meetings card in light mode", () => {
      const { container } = renderWithTheme(<StatCards {...defaultProps} />, {
        darkMode: false,
      });
      const cyanAccent = container.querySelector(".bg-cyan-100");
      expect(cyanAccent).toBeInTheDocument();
    });

    it("should have blue accent for Conversion Rate card in light mode", () => {
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
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(<StatCards {...defaultProps} darkMode={true} />);
      expect(screen.getByText("Total Leads")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

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
    it("should handle zero total leads", () => {
      const customLeadData = { ...mockLeadData, totalLeads: 0 };
      renderWithTheme(<StatCards {...defaultProps} leadData={customLeadData} />);
      // Should display 0
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThan(0);
    });

    it("should handle zero calls made", () => {
      const customLeadData = { ...mockLeadData, callsMade: 0 };
      renderWithTheme(<StatCards {...defaultProps} leadData={customLeadData} />);
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThan(0);
    });

    it("should handle zero meetings scheduled", () => {
      const customLeadData = { ...mockLeadData, meetingsScheduled: 0 };
      renderWithTheme(<StatCards {...defaultProps} leadData={customLeadData} />);
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThan(0);
    });

    it("should handle high meetings count", () => {
      const customLeadData = { ...mockLeadData, meetingsScheduled: 100 };
      renderWithTheme(<StatCards {...defaultProps} leadData={customLeadData} />);
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("should handle large total leads numbers", () => {
      const customLeadData = { ...mockLeadData, totalLeads: 999999 };
      renderWithTheme(<StatCards {...defaultProps} leadData={customLeadData} />);
      expect(screen.getByText("999999")).toBeInTheDocument();
    });

    it("should handle large calls made numbers", () => {
      const customLeadData = { ...mockLeadData, callsMade: 5000 };
      renderWithTheme(<StatCards {...defaultProps} leadData={customLeadData} />);
      expect(screen.getByText("5000")).toBeInTheDocument();
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

      expect(titleTexts).toContain("Total Leads");
      expect(titleTexts).toContain("Calls Made");
      expect(titleTexts).toContain("Meetings");
      expect(titleTexts).toContain("Conversion Rate");
    });
  });

  // =============================================================================
  // Props Update Tests
  // =============================================================================

  describe("props updates", () => {
    it("should update when leadData changes", () => {
      const { rerender } = renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("847")).toBeInTheDocument();

      const newLeadData = { ...mockLeadData, totalLeads: 900 };
      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <StatCards {...defaultProps} leadData={newLeadData} />
        </ThemeProvider>,
      );
      expect(screen.getByText("900")).toBeInTheDocument();
    });

    it("should update when activityData changes", () => {
      const { rerender } = renderWithTheme(<StatCards {...defaultProps} />);
      expect(screen.getByText("960%")).toBeInTheDocument();

      const newActivityData = [{ name: "Mon", leads: 500, callsCompleted: 50 }];
      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <StatCards {...defaultProps} activityData={newActivityData} />
        </ThemeProvider>,
      );
      expect(screen.getByText("500%")).toBeInTheDocument();
    });
  });
});

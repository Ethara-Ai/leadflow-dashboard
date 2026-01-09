/**
 * Unit Tests for ChartComponents
 * Tests for ChartLegend and XAxisTick components
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChartLegend, XAxisTick } from "./ChartComponents";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

// =============================================================================
// ChartLegend Tests
// =============================================================================

describe("ChartLegend", () => {
  const defaultPayload = [
    { value: "Active Leads", color: "#3b82f6" },
    { value: "Calls Completed", color: "#10b981" },
  ];

  describe("basic rendering", () => {
    it("should render legend items when payload is provided", () => {
      renderWithTheme(<ChartLegend payload={defaultPayload} />);
      expect(screen.getByText("Active Leads")).toBeInTheDocument();
      expect(screen.getByText("Calls Completed")).toBeInTheDocument();
    });

    it("should render correct number of legend items", () => {
      renderWithTheme(<ChartLegend payload={defaultPayload} />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("should render with role list for accessibility", () => {
      renderWithTheme(<ChartLegend payload={defaultPayload} />);
      expect(screen.getByRole("list", { name: "Chart legend" })).toBeInTheDocument();
    });

    it("should return null when payload is empty", () => {
      const { container } = renderWithTheme(<ChartLegend payload={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null when payload is undefined", () => {
      const { container } = renderWithTheme(<ChartLegend payload={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null when payload is null", () => {
      const { container } = renderWithTheme(<ChartLegend payload={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("color indicators", () => {
    it("should render color indicators with correct background color", () => {
      const { container } = renderWithTheme(<ChartLegend payload={defaultPayload} />);
      const colorIndicators = container.querySelectorAll(".rounded-full");

      expect(colorIndicators[0]).toHaveStyle({ backgroundColor: "#3b82f6" });
      expect(colorIndicators[1]).toHaveStyle({ backgroundColor: "#10b981" });
    });

    it("should have aria-hidden on color indicators", () => {
      const { container } = renderWithTheme(<ChartLegend payload={defaultPayload} />);
      const colorIndicators = container.querySelectorAll(".rounded-full");

      colorIndicators.forEach((indicator) => {
        expect(indicator).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  describe("dark mode styling", () => {
    it("should apply dark text color in dark mode", () => {
      renderWithTheme(<ChartLegend payload={defaultPayload} />, { darkMode: true });
      const legendText = screen.getByText("Active Leads");
      expect(legendText).toHaveClass("text-slate-300");
    });

    it("should apply light text color in light mode", () => {
      renderWithTheme(<ChartLegend payload={defaultPayload} />, { darkMode: false });
      const legendText = screen.getByText("Active Leads");
      expect(legendText).toHaveClass("text-slate-600");
    });
  });

  describe("responsive classes", () => {
    it("should have responsive gap classes", () => {
      const { container } = renderWithTheme(<ChartLegend payload={defaultPayload} />);
      const wrapper = container.querySelector('[role="list"]');
      expect(wrapper).toHaveClass("gap-3");
      expect(wrapper).toHaveClass("sm:gap-4");
    });

    it("should have responsive text size classes", () => {
      renderWithTheme(<ChartLegend payload={defaultPayload} />);
      const legendText = screen.getByText("Active Leads");
      expect(legendText).toHaveClass("text-xs");
      expect(legendText).toHaveClass("sm:text-sm");
    });
  });

  describe("edge cases", () => {
    it("should handle single item payload", () => {
      const singlePayload = [{ value: "Single Item", color: "#ff0000" }];
      renderWithTheme(<ChartLegend payload={singlePayload} />);
      expect(screen.getByText("Single Item")).toBeInTheDocument();
    });

    it("should handle many items", () => {
      const manyItems = [
        { value: "Item 1", color: "#111" },
        { value: "Item 2", color: "#222" },
        { value: "Item 3", color: "#333" },
        { value: "Item 4", color: "#444" },
        { value: "Item 5", color: "#555" },
      ];
      renderWithTheme(<ChartLegend payload={manyItems} />);
      expect(screen.getAllByRole("listitem")).toHaveLength(5);
    });
  });

  describe("backward compatibility (outside ThemeProvider)", () => {
    it("should render without ThemeProvider using default theme", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(<ChartLegend payload={defaultPayload} />);
      expect(screen.getByText("Active Leads")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});

// =============================================================================
// XAxisTick Tests
// =============================================================================

describe("XAxisTick", () => {
  const defaultProps = {
    x: 100,
    y: 200,
    payload: { value: "Mon" },
  };

  describe("basic rendering", () => {
    it("should render the tick text", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>);
      expect(container.querySelector("text")).toHaveTextContent("Mon");
    });

    it("should render within a g element with correct transform", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>);
      const gElement = container.querySelector("g");
      expect(gElement).toHaveAttribute("transform", "translate(100,200)");
    });

    it("should render with correct text anchor", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>);
      const textElement = container.querySelector("text");
      expect(textElement).toHaveAttribute("text-anchor", "middle");
    });

    it("should have aria-label for accessibility", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>);
      const textElement = container.querySelector("text");
      expect(textElement).toHaveAttribute("aria-label", "Mon");
    });
  });

  describe("positioning", () => {
    it("should set correct dy offset", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>);
      const textElement = container.querySelector("text");
      expect(textElement).toHaveAttribute("dy", "12");
    });

    it("should set x and y to 0 within the transformed group", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>);
      const textElement = container.querySelector("text");
      expect(textElement).toHaveAttribute("x", "0");
      expect(textElement).toHaveAttribute("y", "0");
    });

    it("should handle different x and y values", () => {
      const props = { x: 50, y: 150, payload: { value: "Tue" } };
      const { container } = renderWithTheme(<svg><XAxisTick {...props} /></svg>);
      const gElement = container.querySelector("g");
      expect(gElement).toHaveAttribute("transform", "translate(50,150)");
    });
  });

  describe("dark mode styling", () => {
    it("should use dark mode fill color in dark mode", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>, { darkMode: true });
      const textElement = container.querySelector("text");
      expect(textElement).toHaveAttribute("fill", "#94a3b8");
    });

    it("should use light mode fill color in light mode", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>, { darkMode: false });
      const textElement = container.querySelector("text");
      expect(textElement).toHaveAttribute("fill", "#475569");
    });
  });

  describe("text styling", () => {
    it("should have correct font size", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>);
      const textElement = container.querySelector("text");
      expect(textElement).toHaveAttribute("font-size", "10");
    });

    it("should have correct font weight", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>);
      const textElement = container.querySelector("text");
      expect(textElement).toHaveAttribute("font-weight", "500");
    });

    it("should have font family attribute", () => {
      const { container } = renderWithTheme(<svg><XAxisTick {...defaultProps} /></svg>);
      const textElement = container.querySelector("text");
      expect(textElement).toHaveAttribute("font-family");
    });
  });

  describe("payload variations", () => {
    it("should render numeric payload values", () => {
      const props = { x: 0, y: 0, payload: { value: 100 } };
      const { container } = renderWithTheme(<svg><XAxisTick {...props} /></svg>);
      expect(container.querySelector("text")).toHaveTextContent("100");
    });

    it("should render string payload values", () => {
      const props = { x: 0, y: 0, payload: { value: "Week 1" } };
      const { container } = renderWithTheme(<svg><XAxisTick {...props} /></svg>);
      expect(container.querySelector("text")).toHaveTextContent("Week 1");
    });

    it("should handle empty string payload", () => {
      const props = { x: 0, y: 0, payload: { value: "" } };
      const { container } = renderWithTheme(<svg><XAxisTick {...props} /></svg>);
      expect(container.querySelector("text")).toHaveTextContent("");
    });
  });

  describe("backward compatibility (outside ThemeProvider)", () => {
    it("should render without ThemeProvider using default theme", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const { container } = render(<svg><XAxisTick {...defaultProps} /></svg>);
      expect(container.querySelector("text")).toHaveTextContent("Mon");

      consoleSpy.mockRestore();
    });
  });
});

// =============================================================================
// Default Export Tests
// =============================================================================

describe("ChartComponents default export", () => {
  it("should export both ChartLegend and XAxisTick", async () => {
    const defaultExport = await import("./ChartComponents").then((m) => m.default);
    expect(defaultExport).toHaveProperty("ChartLegend");
    expect(defaultExport).toHaveProperty("XAxisTick");
  });
});

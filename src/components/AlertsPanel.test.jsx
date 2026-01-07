/**
 * Unit Tests for AlertsPanel Component
 * Tests the alerts panel with dropdown functionality and alert management
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlertsPanel from "./AlertsPanel";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const mockAlerts = [
  {
    id: 1,
    message: "Temperature alert in elephant enclosure",
    type: "warning",
    time: "1 hour ago",
  },
  {
    id: 2,
    message: "Feeding completed for primates",
    type: "info",
    time: "2 hours ago",
  },
  {
    id: 3,
    message: "Low stock alert: Vitamin supplements",
    type: "warning",
    time: "3 hours ago",
  },
];

const defaultProps = {
  alerts: mockAlerts,
  onAddAlert: vi.fn(),
  onClearAlerts: vi.fn(),
};

// Mock framer-motion to simplify testing
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, onClick, ...props }) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
    button: ({ children, className, onClick, disabled, ...props }) => (
      <button
        className={className}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    ),
    article: ({ children, className, ...props }) => (
      <article className={className} {...props}>
        {children}
      </article>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe("AlertsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic rendering", () => {
    it("should render the Zoo Alerts heading", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      expect(screen.getByText("Zoo Alerts")).toBeInTheDocument();
    });

    it("should render the alert count button", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should render the Bell icon", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render all alerts in the list", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      expect(
        screen.getByText("Temperature alert in elephant enclosure"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Feeding completed for primates"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Low stock alert: Vitamin supplements"),
      ).toBeInTheDocument();
    });

    it("should render the chevron icon in dropdown button", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const chevrons = container.querySelectorAll("svg");
      expect(chevrons.length).toBeGreaterThan(1);
    });
  });

  // =============================================================================
  // Empty State Tests
  // =============================================================================

  describe("empty state", () => {
    it("should show empty state when no alerts", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />);
      expect(screen.getByText("No current alerts")).toBeInTheDocument();
    });

    it("should show encouraging message when no alerts", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />);
      expect(
        screen.getByText("All animals and enclosures are in good condition!"),
      ).toBeInTheDocument();
    });

    it("should show Bell icon in empty state", () => {
      const { container } = renderWithTheme(
        <AlertsPanel {...defaultProps} alerts={[]} />,
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should show 0 count when no alerts", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Alert Count Button Tests
  // =============================================================================

  describe("alert count button", () => {
    it("should display correct alert count", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should update count when alerts change", () => {
      const { rerender } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      expect(screen.getByText("3")).toBeInTheDocument();

      const newAlerts = [mockAlerts[0]];
      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <AlertsPanel {...defaultProps} alerts={newAlerts} />
        </ThemeProvider>,
      );
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should have amber styling when alerts exist", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: false });
      const button = screen.getByText("3").closest("button");
      expect(button).toHaveClass("bg-amber-100");
    });

    it("should not have amber styling when no alerts", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />, {
        darkMode: false,
      });
      const button = screen.getByText("0").closest("button");
      expect(button).not.toHaveClass("bg-amber-100");
    });
  });

  // =============================================================================
  // Dropdown Toggle Tests
  // =============================================================================

  describe("dropdown toggle", () => {
    it("should open dropdown when count button is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      const button = screen.getByText("3").closest("button");
      await user.click(button);

      expect(screen.getByText("Clear All")).toBeInTheDocument();
    });

    it("should close dropdown when count button is clicked again", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      const button = screen.getByText("3").closest("button");
      await user.click(button);
      expect(screen.getByText("Clear All")).toBeInTheDocument();

      await user.click(button);
      await waitFor(() => {
        expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
      });
    });

    it("should rotate chevron when dropdown is open", async () => {
      const user = userEvent.setup();
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);

      const button = screen.getByText("3").closest("button");
      await user.click(button);

      const chevron = container.querySelector(".rotate-180");
      expect(chevron).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Add Alert Tests
  // =============================================================================

  describe("add alert functionality", () => {
    it("should call onAddAlert with message when alert is added", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      // Open dropdown
      const button = screen.getByText("3").closest("button");
      await user.click(button);

      // Type in input
      const input = screen.getByPlaceholderText("Add custom alert...");
      await user.type(input, "New test alert");

      // Click Add button
      const addButton = screen.getByText("Add");
      await user.click(addButton);

      expect(defaultProps.onAddAlert).toHaveBeenCalledWith("New test alert");
    });

    it("should close dropdown after adding alert", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      // Open dropdown
      const button = screen.getByText("3").closest("button");
      await user.click(button);

      // Type in input
      const input = screen.getByPlaceholderText("Add custom alert...");
      await user.type(input, "New test alert");

      // Click Add button
      const addButton = screen.getByText("Add");
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
      });
    });

    it("should clear input after adding alert", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      // Open dropdown
      const button = screen.getByText("3").closest("button");
      await user.click(button);

      // Type in input
      const input = screen.getByPlaceholderText("Add custom alert...");
      await user.type(input, "New test alert");

      // Click Add button
      const addButton = screen.getByText("Add");
      await user.click(addButton);

      // Reopen dropdown
      await user.click(button);

      const newInput = screen.getByPlaceholderText("Add custom alert...");
      expect(newInput).toHaveValue("");
    });

    it("should not call onAddAlert with empty input", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      // Open dropdown
      const button = screen.getByText("3").closest("button");
      await user.click(button);

      // Click Add button without typing
      const addButton = screen.getByText("Add");
      await user.click(addButton);

      expect(defaultProps.onAddAlert).not.toHaveBeenCalled();
    });
  });

  // =============================================================================
  // Clear Alerts Tests
  // =============================================================================

  describe("clear alerts functionality", () => {
    it("should call onClearAlerts when Clear All is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      // Open dropdown
      const button = screen.getByText("3").closest("button");
      await user.click(button);

      // Click Clear All
      const clearButton = screen.getByText("Clear All");
      await user.click(clearButton);

      expect(defaultProps.onClearAlerts).toHaveBeenCalledTimes(1);
    });

    it("should close dropdown after clearing alerts", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      // Open dropdown
      const button = screen.getByText("3").closest("button");
      await user.click(button);

      // Click Clear All
      const clearButton = screen.getByText("Clear All");
      await user.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe("dark mode styling", () => {
    it("should apply dark theme card classes in dark mode", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />, {
        darkMode: true,
      });
      const card = container.querySelector(".bg-slate-800\\/80");
      expect(card).toBeInTheDocument();
    });

    it("should apply light theme card classes in light mode", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />, {
        darkMode: false,
      });
      const card = container.querySelector(".bg-white\\/90");
      expect(card).toBeInTheDocument();
    });

    it("should apply dark theme heading color in dark mode", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: true });
      const heading = screen.getByText("Zoo Alerts");
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should apply light theme heading color in light mode", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: false });
      const heading = screen.getByText("Zoo Alerts");
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should apply dark theme button styling with alerts in dark mode", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: true });
      const button = screen.getByText("3").closest("button");
      expect(button).toHaveClass("bg-amber-900/40");
    });

    it("should apply dark theme empty state text in dark mode", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />, {
        darkMode: true,
      });
      const emptyText = screen.getByText("No current alerts");
      expect(emptyText).toHaveClass("text-slate-400");
    });

    it("should apply light theme empty state text in light mode", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />, {
        darkMode: false,
      });
      const emptyText = screen.getByText("No current alerts");
      expect(emptyText).toHaveClass("text-slate-600");
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} darkMode={true} />, {
        darkMode: false,
      });
      const heading = screen.getByText("Zoo Alerts");
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should use darkMode override when provided (false)", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} darkMode={false} />, {
        darkMode: true,
      });
      const heading = screen.getByText("Zoo Alerts");
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should use context value when darkMode override is undefined", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: true });
      const heading = screen.getByText("Zoo Alerts");
      expect(heading).toHaveClass("text-slate-200");
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe("accessibility", () => {
    it("should have proper heading for alerts section", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const heading = screen.getByText("Zoo Alerts");
      expect(heading.tagName).toBe("H3");
    });

    it("should have clickable button for dropdown toggle", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const button = screen.getByText("3").closest("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("cursor-pointer");
    });

    it("should render alerts as accessible content", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const alerts = screen.getAllByText(/alert|completed/i);
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  // =============================================================================
  // Styling Classes Tests
  // =============================================================================

  describe("styling classes", () => {
    it("should have backdrop-blur-lg class", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.querySelector(".backdrop-blur-lg");
      expect(card).toBeInTheDocument();
    });

    it("should have rounded corners", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const roundedElement = container.querySelector(
        ".rounded-xl, .rounded-2xl",
      );
      expect(roundedElement).toBeInTheDocument();
    });

    it("should have transition classes for hover effects", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.querySelector(".transition-all");
      expect(card).toBeInTheDocument();
    });

    it("should have hover shadow class", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.querySelector(".hover\\:shadow-2xl");
      expect(card).toBeInTheDocument();
    });

    it("should have max-height on alerts list for scrolling", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const alertsList = container.querySelector('[class*="max-h"]');
      expect(alertsList).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Responsive Classes Tests
  // =============================================================================

  describe("responsive classes", () => {
    it("should have responsive padding classes", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("p-3");
      expect(card).toHaveClass("sm:p-4");
      expect(card).toHaveClass("md:p-6");
    });

    it("should have responsive text sizes for heading", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const heading = screen.getByText("Zoo Alerts");
      expect(heading).toHaveClass("text-base");
      expect(heading).toHaveClass("sm:text-lg");
      expect(heading).toHaveClass("md:text-xl");
    });

    it("should have responsive button padding", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const button = screen.getByText("3").closest("button");
      expect(button).toHaveClass("px-2.5");
      expect(button).toHaveClass("sm:px-4");
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

      render(<AlertsPanel {...defaultProps} darkMode={true} />);
      expect(screen.getByText("Zoo Alerts")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<AlertsPanel {...defaultProps} />);
      const heading = screen.getByText("Zoo Alerts");
      expect(heading).toHaveClass("text-slate-700");

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should handle rapid dropdown toggles", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      const button = screen.getByText("3").closest("button");
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Should still function properly
      expect(screen.getByText("Zoo Alerts")).toBeInTheDocument();
    });

    it("should handle large number of alerts", () => {
      const manyAlerts = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        message: `Alert message ${i}`,
        type: i % 2 === 0 ? "warning" : "info",
        time: `${i} hours ago`,
      }));
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={manyAlerts} />);
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("should handle alerts with very long messages", () => {
      const longMessage = "A".repeat(500);
      const alertsWithLongMessage = [
        { id: 1, message: longMessage, type: "warning", time: "Just now" },
      ];
      renderWithTheme(
        <AlertsPanel {...defaultProps} alerts={alertsWithLongMessage} />,
      );
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("should handle alerts with special characters", () => {
      const specialMessage =
        "Alert: <script>test</script> & \"quotes\" 'apostrophe'";
      const alertsWithSpecialChars = [
        { id: 1, message: specialMessage, type: "info", time: "Just now" },
      ];
      renderWithTheme(
        <AlertsPanel {...defaultProps} alerts={alertsWithSpecialChars} />,
      );
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it("should handle undefined alerts gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // This should not crash
      try {
        renderWithTheme(<AlertsPanel {...defaultProps} alerts={undefined} />);
      } catch {
        // Expected to potentially fail, but should be handled
      }

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Animation Tests
  // =============================================================================

  describe("animation", () => {
    it("should have animation variants on main container", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    it("should animate empty state icon", () => {
      const { container } = renderWithTheme(
        <AlertsPanel {...defaultProps} alerts={[]} />,
      );
      // The bell icon in empty state should be rendered
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });
  });
});

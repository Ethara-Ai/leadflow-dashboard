/**
 * Unit Tests for AlertsPanel Component
 * Tests the alerts panel with modal trigger functionality
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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
  onOpenModal: vi.fn(),
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

  // ===========================================================================
  // Basic Rendering Tests
  // ===========================================================================

  describe("basic rendering", () => {
    it("should render the Lead Alerts heading", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      expect(screen.getByText("Lead Alerts")).toBeInTheDocument();
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
  });

  // ===========================================================================
  // Empty State Tests
  // ===========================================================================

  describe("empty state", () => {
    it("should show empty state when no alerts", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />);
      expect(screen.getByText("No current alerts")).toBeInTheDocument();
    });

    it("should show encouraging message when no alerts", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />);
      expect(
        screen.getByText("All leads are being properly managed!"),
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

  // ===========================================================================
  // Alert Count Button Tests
  // ===========================================================================

  describe("alert count button", () => {
    it("should display correct alert count", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should update count when alerts change", () => {
      const { rerender } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      expect(screen.getByText("3")).toBeInTheDocument();

      const newAlerts = [
        ...mockAlerts,
        { id: 4, message: "New alert", type: "info", time: "now" },
      ];
      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <AlertsPanel {...defaultProps} alerts={newAlerts} />
        </ThemeProvider>,
      );
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("should have amber styling when alerts exist", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: false });
      const button = screen.getByLabelText(/3 alerts/);
      expect(button).toHaveClass("bg-amber-100");
    });

    it("should not have amber styling when no alerts", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />, {
        darkMode: false,
      });
      const button = screen.getByLabelText(/0 alerts/);
      expect(button).not.toHaveClass("bg-amber-100");
    });
  });

  // ===========================================================================
  // Modal Trigger Tests
  // ===========================================================================

  describe("modal trigger", () => {
    it("should call onOpenModal when button is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      const button = screen.getByLabelText(/3 alerts/);
      await user.click(button);

      expect(defaultProps.onOpenModal).toHaveBeenCalledTimes(1);
    });

    it("should call onOpenModal on empty state button click", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={[]} />);

      const button = screen.getByLabelText(/0 alerts/);
      await user.click(button);

      expect(defaultProps.onOpenModal).toHaveBeenCalledTimes(1);
    });

    it("should have correct aria-label on button", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const button = screen.getByLabelText("3 alerts. Click to manage alerts.");
      expect(button).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Dark Mode Styling Tests
  // ===========================================================================

  describe("dark mode styling", () => {
    it("should apply dark theme card classes in dark mode", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />, {
        darkMode: true,
      });
      const card = container.firstChild;
      expect(card).toHaveClass("bg-slate-800/80");
    });

    it("should apply light theme card classes in light mode", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />, {
        darkMode: false,
      });
      const card = container.firstChild;
      expect(card).toHaveClass("bg-white/90");
    });

    it("should apply dark theme heading color in dark mode", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: true });
      const heading = screen.getByText("Lead Alerts");
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should apply light theme heading color in light mode", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: false });
      const heading = screen.getByText("Lead Alerts");
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should apply dark theme button styling with alerts in dark mode", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: true });
      const button = screen.getByLabelText(/3 alerts/);
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

  // ===========================================================================
  // DarkMode Override Prop Tests
  // ===========================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} darkMode={true} />, {
        darkMode: false,
      });
      const heading = screen.getByText("Lead Alerts");
      expect(heading).toHaveClass("text-slate-200");
    });

    it("should use darkMode override when provided (false)", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} darkMode={false} />, {
        darkMode: true,
      });
      const heading = screen.getByText("Lead Alerts");
      expect(heading).toHaveClass("text-slate-700");
    });

    it("should use context value when darkMode override is undefined", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />, { darkMode: true });
      const heading = screen.getByText("Lead Alerts");
      expect(heading).toHaveClass("text-slate-200");
    });
  });

  // ===========================================================================
  // Accessibility Tests
  // ===========================================================================

  describe("accessibility", () => {
    it("should have proper heading for alerts section", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const heading = screen.getByText("Lead Alerts");
      expect(heading.tagName).toBe("H3");
    });

    it("should have clickable button for modal trigger", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const button = screen.getByLabelText(/3 alerts/);
      expect(button.tagName).toBe("BUTTON");
    });

    it("should render alerts as accessible content", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const alerts = screen.getAllByRole("alert");
      expect(alerts).toHaveLength(3);
    });
  });

  // ===========================================================================
  // Styling Classes Tests
  // ===========================================================================

  describe("styling classes", () => {
    it("should have backdrop-blur-lg class", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("backdrop-blur-lg");
    });

    it("should have rounded corners", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const roundedElement = container.querySelector(
        ".rounded-xl, .sm\\:rounded-2xl",
      );
      expect(roundedElement).toBeInTheDocument();
    });

    it("should have transition classes for hover effects", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("transition-all");
    });

    it("should have hover shadow class", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("hover:shadow-2xl");
    });

    it("should have max-height on alerts list for scrolling", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const alertsList = container.querySelector('[role="log"]');
      expect(alertsList).toHaveClass("max-h-75");
    });
  });

  // ===========================================================================
  // Responsive Classes Tests
  // ===========================================================================

  describe("responsive classes", () => {
    it("should have responsive padding classes", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass("p-3", "sm:p-4", "md:p-6");
    });

    it("should have responsive text sizes for heading", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const heading = screen.getByText("Lead Alerts");
      expect(heading).toHaveClass("text-base");
      expect(heading).toHaveClass("sm:text-lg");
      expect(heading).toHaveClass("md:text-xl");
    });

    it("should have responsive button padding", () => {
      renderWithTheme(<AlertsPanel {...defaultProps} />);
      const button = screen.getByLabelText(/3 alerts/);
      expect(button).toHaveClass("px-2.5", "sm:px-4");
    });
  });

  // ===========================================================================
  // Backward Compatibility Tests (outside ThemeProvider)
  // ===========================================================================

  describe("backward compatibility (outside ThemeProvider)", () => {
    it("should render without ThemeProvider using darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<AlertsPanel {...defaultProps} darkMode={true} />);
      expect(screen.getByText("Lead Alerts")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<AlertsPanel {...defaultProps} />);
      const heading = screen.getByText("Lead Alerts");
      expect(heading).toHaveClass("text-slate-700");

      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Edge Cases Tests
  // ===========================================================================

  describe("edge cases", () => {
    it("should handle rapid button clicks", async () => {
      const user = userEvent.setup();
      renderWithTheme(<AlertsPanel {...defaultProps} />);

      const button = screen.getByLabelText(/3 alerts/);
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(defaultProps.onOpenModal).toHaveBeenCalledTimes(3);
      expect(screen.getByText("Lead Alerts")).toBeInTheDocument();
    });

    it("should handle large number of alerts", () => {
      const manyAlerts = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        message: `Alert ${i + 1}`,
        type: i % 2 === 0 ? "warning" : "info",
        time: `${i} hours ago`,
      }));
      renderWithTheme(<AlertsPanel {...defaultProps} alerts={manyAlerts} />);
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("should handle alerts with very long messages", () => {
      const longMessage = "A".repeat(500);
      const alertsWithLongMessage = [
        { id: 1, message: longMessage, type: "warning", time: "now" },
      ];
      renderWithTheme(
        <AlertsPanel {...defaultProps} alerts={alertsWithLongMessage} />,
      );
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("should handle alerts with special characters", () => {
      const specialMessage =
        '<script>alert("xss")</script> & "quotes" \'single\' <tag>';
      const alertsWithSpecialChars = [
        { id: 1, message: specialMessage, type: "info", time: "now" },
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

      // This should either throw or handle gracefully
      expect(() => {
        renderWithTheme(<AlertsPanel {...defaultProps} alerts={undefined} />);
      }).toThrow();

      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Animation Tests
  // ===========================================================================

  describe("animation", () => {
    it("should have animation variants on main container", () => {
      const { container } = renderWithTheme(<AlertsPanel {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveAttribute("variants");
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

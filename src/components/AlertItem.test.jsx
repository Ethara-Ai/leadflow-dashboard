/**
 * Unit Tests for AlertItem Component
 * Tests the alert display component with theme and type variations
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AlertItem from "./AlertItem";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const createAlert = (overrides = {}) => ({
  id: 1,
  message: "Test alert message",
  type: "info",
  time: "2 hours ago",
  ...overrides,
});

// Mock framer-motion to simplify testing
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    article: ({ children, className, ...props }) => (
      <article className={className} {...props}>
        {children}
      </article>
    ),
  },
}));

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe("AlertItem", () => {
  describe("basic rendering", () => {
    it("should render the alert message", () => {
      const alert = createAlert({
        message: "Temperature warning in enclosure",
      });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(
        screen.getByText("Temperature warning in enclosure"),
      ).toBeInTheDocument();
    });

    it("should render the alert time", () => {
      const alert = createAlert({ time: "5 minutes ago" });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
    });

    it("should render without crashing with minimal alert data", () => {
      const alert = { id: 1, message: "Test", type: "info", time: "now" };
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should render the icon", () => {
      const alert = createAlert({ type: "warning" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Alert Type Tests
  // =============================================================================

  describe("warning alert type", () => {
    it("should render ShieldAlert icon for warning type", () => {
      const alert = createAlert({ type: "warning" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
      // Icon should exist (ShieldAlert renders as SVG)
      expect(icon.classList.length).toBeGreaterThan(0);
    });

    it("should apply warning background classes in light mode", () => {
      const alert = createAlert({ type: "warning" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: false,
      });
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("bg-amber-50");
      expect(alertElement).toHaveClass("border-amber-200");
    });

    it("should apply warning background classes in dark mode", () => {
      const alert = createAlert({ type: "warning" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: true,
      });
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("bg-amber-900/20");
      expect(alertElement).toHaveClass("border-amber-800/30");
    });

    it("should apply warning icon color in light mode", () => {
      const alert = createAlert({ type: "warning" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: false,
      });
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("text-amber-600");
    });

    it("should apply warning icon color in dark mode", () => {
      const alert = createAlert({ type: "warning" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: true,
      });
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("text-amber-400");
    });
  });

  describe("info alert type", () => {
    it("should render Info icon for info type", () => {
      const alert = createAlert({ type: "info" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should apply info background classes in light mode", () => {
      const alert = createAlert({ type: "info" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: false,
      });
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("bg-blue-50");
      expect(alertElement).toHaveClass("border-blue-200");
    });

    it("should apply info background classes in dark mode", () => {
      const alert = createAlert({ type: "info" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: true,
      });
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("bg-blue-900/20");
      expect(alertElement).toHaveClass("border-blue-800/30");
    });

    it("should apply info icon color in light mode", () => {
      const alert = createAlert({ type: "info" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: false,
      });
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("text-blue-600");
    });

    it("should apply info icon color in dark mode", () => {
      const alert = createAlert({ type: "info" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: true,
      });
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("text-blue-400");
    });
  });

  describe("unknown/default alert type", () => {
    it("should default to info styling for unknown type", () => {
      const alert = createAlert({ type: "unknown" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: false,
      });
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("bg-blue-50");
    });

    it("should default to info styling for undefined type", () => {
      const alert = { id: 1, message: "Test", time: "now" };
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: false,
      });
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("bg-blue-50");
    });

    it("should default to info styling for empty string type", () => {
      const alert = createAlert({ type: "" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: false,
      });
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("bg-blue-50");
    });
  });

  // =============================================================================
  // Dark Mode Tests
  // =============================================================================

  describe("dark mode styling", () => {
    it("should apply dark text color for message in dark mode", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />, { darkMode: true });
      const message = screen.getByText(alert.message);
      expect(message).toHaveClass("text-slate-200");
    });

    it("should apply light text color for message in light mode", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />, { darkMode: false });
      const message = screen.getByText(alert.message);
      expect(message).toHaveClass("text-slate-700");
    });

    it("should apply dark time color in dark mode", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />, { darkMode: true });
      const time = screen.getByText(alert.time);
      expect(time).toHaveClass("text-slate-400");
    });

    it("should apply light time color in light mode", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />, { darkMode: false });
      const time = screen.getByText(alert.time);
      expect(time).toHaveClass("text-slate-500");
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe("darkMode override prop", () => {
    it("should use darkModeOverride when provided (true)", () => {
      const alert = createAlert({ type: "info" });
      const { container } = renderWithTheme(
        <AlertItem alert={alert} darkMode={true} />,
        { darkMode: false }, // Provider says light mode
      );
      const alertElement = container.firstChild;
      // Override should take precedence
      expect(alertElement).toHaveClass("bg-blue-900/20");
    });

    it("should use darkModeOverride when provided (false)", () => {
      const alert = createAlert({ type: "info" });
      const { container } = renderWithTheme(
        <AlertItem alert={alert} darkMode={false} />,
        { darkMode: true }, // Provider says dark mode
      );
      const alertElement = container.firstChild;
      // Override should take precedence
      expect(alertElement).toHaveClass("bg-blue-50");
    });

    it("should use context value when darkModeOverride is undefined", () => {
      const alert = createAlert({ type: "warning" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />, {
        darkMode: true,
      });
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("bg-amber-900/20");
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
      const alert = createAlert();

      render(<AlertItem alert={alert} darkMode={true} />);
      expect(screen.getByText(alert.message)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const alert = createAlert({ type: "info" });

      const { container } = render(<AlertItem alert={alert} />);
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("bg-blue-50");

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Layout and Styling Tests
  // =============================================================================

  describe("layout and styling", () => {
    it("should have rounded corners", () => {
      const alert = createAlert();
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("rounded-lg");
    });

    it("should have border styling", () => {
      const alert = createAlert();
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("border");
    });

    it("should have responsive padding classes", () => {
      const alert = createAlert();
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const alertElement = container.firstChild;
      expect(alertElement).toHaveClass("p-2.5");
      expect(alertElement).toHaveClass("sm:p-3");
      expect(alertElement).toHaveClass("md:p-4");
    });

    it("should have flex layout for icon and content", () => {
      const alert = createAlert();
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const flexContainer = container.querySelector(".flex.items-start");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have gap between icon and content", () => {
      const alert = createAlert();
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const flexContainer = container.querySelector(".flex.items-start");
      expect(flexContainer).toHaveClass("gap-2");
    });

    it("should have responsive icon sizes", () => {
      const alert = createAlert();
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("w-4");
      expect(icon).toHaveClass("h-4");
    });

    it("should have shrink-0 on icon to prevent shrinking", () => {
      const alert = createAlert();
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("shrink-0");
    });
  });

  // =============================================================================
  // Text Styling Tests
  // =============================================================================

  describe("text styling", () => {
    it("should have font-medium class on message", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />);
      const message = screen.getByText(alert.message);
      expect(message).toHaveClass("font-medium");
    });

    it("should have responsive text size for message", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />);
      const message = screen.getByText(alert.message);
      expect(message).toHaveClass("text-xs");
      expect(message).toHaveClass("sm:text-sm");
    });

    it("should have smaller text size for time", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />);
      const time = screen.getByText(alert.time);
      expect(time).toHaveClass("text-[10px]");
      expect(time).toHaveClass("sm:text-xs");
    });

    it("should have word-break styling on message", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />);
      const message = screen.getByText(alert.message);
      expect(message).toHaveClass("wrap-break-word");
    });
  });

  // =============================================================================
  // Different Message Content Tests
  // =============================================================================

  describe("different message content", () => {
    it("should render short message", () => {
      const alert = createAlert({ message: "OK" });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText("OK")).toBeInTheDocument();
    });

    it("should render long message", () => {
      const longMessage =
        "This is a very long alert message that contains a lot of information about an event that occurred in the lead management system";
      const alert = createAlert({ message: longMessage });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("should render message with special characters", () => {
      const alert = createAlert({
        message: "Temperature: 25°C - Alert! <critical>",
      });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(
        screen.getByText("Temperature: 25°C - Alert! <critical>"),
      ).toBeInTheDocument();
    });

    it("should render message with numbers", () => {
      const alert = createAlert({
        message: "Enclosure #42 needs attention - ID: 12345",
      });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(
        screen.getByText("Enclosure #42 needs attention - ID: 12345"),
      ).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Different Time Formats Tests
  // =============================================================================

  describe("different time formats", () => {
    it("should render relative time", () => {
      const alert = createAlert({ time: "5 minutes ago" });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
    });

    it("should render absolute time", () => {
      const alert = createAlert({ time: "2024-06-15 14:30" });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText("2024-06-15 14:30")).toBeInTheDocument();
    });

    it("should render simple time label", () => {
      const alert = createAlert({ time: "now" });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText("now")).toBeInTheDocument();
    });

    it("should render formatted date time", () => {
      const alert = createAlert({ time: "Jan 15, 2024, 2:30 PM" });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText("Jan 15, 2024, 2:30 PM")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should handle empty message", () => {
      const alert = createAlert({ message: "" });
      const { container } = renderWithTheme(<AlertItem alert={alert} />);
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle empty time", () => {
      const alert = createAlert({ time: "" });
      renderWithTheme(<AlertItem alert={alert} />);
      // Should render without crashing
      expect(screen.getByText(alert.message)).toBeInTheDocument();
    });

    it("should handle alert with only required fields", () => {
      const alert = { id: 99, message: "Minimal", type: "info", time: "now" };
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText("Minimal")).toBeInTheDocument();
    });

    it("should handle alert with extra fields", () => {
      const alert = createAlert({
        extraField: "extra",
        anotherField: 123,
        nested: { value: true },
      });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText(alert.message)).toBeInTheDocument();
    });

    it("should handle numeric id", () => {
      const alert = createAlert({ id: 999 });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText(alert.message)).toBeInTheDocument();
    });

    it("should handle string id", () => {
      const alert = createAlert({ id: "alert-uuid-123" });
      renderWithTheme(<AlertItem alert={alert} />);
      expect(screen.getByText(alert.message)).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe("accessibility", () => {
    it("should have semantic paragraph element for message", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />);
      const message = screen.getByText(alert.message);
      expect(message.tagName).toBe("P");
    });

    it("should have semantic time element for time", () => {
      const alert = createAlert();
      renderWithTheme(<AlertItem alert={alert} />);
      const time = screen.getByText(alert.time);
      expect(time.tagName).toBe("TIME");
    });

    it("should have appropriate text contrast in light mode", () => {
      const alert = createAlert({ type: "warning" });
      renderWithTheme(<AlertItem alert={alert} />, { darkMode: false });
      const message = screen.getByText(alert.message);
      expect(message).toHaveClass("text-slate-700");
    });

    it("should have appropriate text contrast in dark mode", () => {
      const alert = createAlert({ type: "warning" });
      renderWithTheme(<AlertItem alert={alert} />, { darkMode: true });
      const message = screen.getByText(alert.message);
      expect(message).toHaveClass("text-slate-200");
    });
  });

  // =============================================================================
  // Integration Tests
  // =============================================================================

  describe("integration tests", () => {
    it("should render multiple alerts with different types", () => {
      const warningAlert = createAlert({
        id: 1,
        message: "Warning message",
        type: "warning",
      });
      const infoAlert = createAlert({
        id: 2,
        message: "Info message",
        type: "info",
      });

      const { container } = renderWithTheme(
        <>
          <AlertItem alert={warningAlert} />
          <AlertItem alert={infoAlert} />
        </>,
      );

      expect(screen.getByText("Warning message")).toBeInTheDocument();
      expect(screen.getByText("Info message")).toBeInTheDocument();

      const alerts = container.querySelectorAll(".rounded-lg");
      expect(alerts).toHaveLength(2);
    });

    it("should maintain consistent styling across theme changes", () => {
      const alert = createAlert({ type: "warning" });

      // Render in light mode
      const { container: lightContainer, unmount: unmountLight } =
        renderWithTheme(<AlertItem alert={alert} />, { darkMode: false });
      expect(lightContainer.firstChild).toHaveClass("bg-amber-50");
      unmountLight();

      // Render in dark mode
      const { container: darkContainer } = renderWithTheme(
        <AlertItem alert={alert} />,
        { darkMode: true },
      );
      expect(darkContainer.firstChild).toHaveClass("bg-amber-900/20");
    });
  });
});

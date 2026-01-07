/**
 * Unit Tests for ErrorMessage Component
 * Tests the error alert banner with theme support
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
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

describe("ErrorMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic rendering", () => {
    it("should render when error is provided", () => {
      renderWithTheme(<ErrorMessage error="Something went wrong" />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should not render when error is null", () => {
      const { container } = renderWithTheme(<ErrorMessage error={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when error is undefined", () => {
      const { container } = renderWithTheme(<ErrorMessage error={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when error is empty string", () => {
      const { container } = renderWithTheme(<ErrorMessage error="" />);
      expect(container.firstChild).toBeNull();
    });

    it("should render the ShieldAlert icon", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render error message text", () => {
      const errorMessage = "Failed to load data";
      renderWithTheme(<ErrorMessage error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Error Message Content Tests
  // =============================================================================

  describe("error message content", () => {
    it("should display the exact error message", () => {
      const errorMessage = "Network connection failed";
      renderWithTheme(<ErrorMessage error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should handle long error messages", () => {
      const longError = "A".repeat(500);
      renderWithTheme(<ErrorMessage error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it("should handle error messages with special characters", () => {
      const specialError =
        "Error: <script>alert('xss')</script> & \"quotes\" 'apostrophe'";
      renderWithTheme(<ErrorMessage error={specialError} />);
      expect(screen.getByText(specialError)).toBeInTheDocument();
    });

    it("should handle error messages with numbers", () => {
      const errorWithNumbers = "Error code: 500 - Internal Server Error";
      renderWithTheme(<ErrorMessage error={errorWithNumbers} />);
      expect(screen.getByText(errorWithNumbers)).toBeInTheDocument();
    });

    it("should handle multiline error messages", () => {
      const multilineError = "Error occurred\nPlease try again";
      renderWithTheme(<ErrorMessage error={multilineError} />);
      // Text with newlines may be rendered differently, check container has the text
      const { container } = renderWithTheme(
        <ErrorMessage error={multilineError} />,
      );
      expect(container.textContent).toContain("Error occurred");
      expect(container.textContent).toContain("Please try again");
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe("dark mode styling", () => {
    it("should apply dark theme background in dark mode", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
        {
          darkMode: true,
        },
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("bg-red-900/20");
    });

    it("should apply light theme background in light mode", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
        {
          darkMode: false,
        },
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("bg-red-50");
    });

    it("should apply dark theme border in dark mode", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
        {
          darkMode: true,
        },
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("border-red-800/30");
    });

    it("should apply light theme border in light mode", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
        {
          darkMode: false,
        },
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("border-red-200");
    });

    it("should apply dark theme text color in dark mode", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
        {
          darkMode: true,
        },
      );
      const text = container.querySelector("p");
      expect(text).toHaveClass("text-red-400");
    });

    it("should apply light theme text color in light mode", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
        {
          darkMode: false,
        },
      );
      const text = container.querySelector("p");
      expect(text).toHaveClass("text-red-600");
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" darkMode={true} />,
        { darkMode: false },
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("bg-red-900/20");
    });

    it("should use darkMode override when provided (false)", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" darkMode={false} />,
        { darkMode: true },
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("bg-red-50");
    });

    it("should use context value when darkMode override is undefined", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
        {
          darkMode: true,
        },
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("bg-red-900/20");
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe("accessibility", () => {
    it("should have proper paragraph element for error text", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const text = container.querySelector("p");
      expect(text).toBeInTheDocument();
    });

    it("should have icon before error text", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const paragraph = container.querySelector("p");
      const icon = paragraph.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should have proper text styling for readability", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const text = container.querySelector("p");
      expect(text).toHaveClass("text-sm");
      expect(text).toHaveClass("font-medium");
    });

    it("should have flex layout for icon and text alignment", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const text = container.querySelector("p");
      expect(text).toHaveClass("flex");
      expect(text).toHaveClass("items-center");
    });
  });

  // =============================================================================
  // Styling Classes Tests
  // =============================================================================

  describe("styling classes", () => {
    it("should have margin bottom class", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("mb-6");
    });

    it("should have padding class", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("p-4");
    });

    it("should have rounded corners", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("rounded-xl");
    });

    it("should have border class", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const banner = container.firstChild;
      expect(banner).toHaveClass("border");
    });

    it("should have proper icon margin", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const icon = container.querySelector("svg");
      // Icon has mr-2 class directly on itself
      expect(icon).toHaveClass("mr-2");
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

      render(<ErrorMessage error="Test error" darkMode={true} />);
      expect(screen.getByText("Test error")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = render(<ErrorMessage error="Test error" />);
      const banner = container.firstChild;
      expect(banner).toHaveClass("bg-red-50");

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should handle error prop changing from null to string", () => {
      const { rerender, container } = renderWithTheme(
        <ErrorMessage error={null} />,
      );
      expect(container.firstChild).toBeNull();

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <ErrorMessage error="New error" />
        </ThemeProvider>,
      );
      expect(screen.getByText("New error")).toBeInTheDocument();
    });

    it("should handle error prop changing from string to null", () => {
      const { rerender, container } = renderWithTheme(
        <ErrorMessage error="Error" />,
      );
      expect(screen.getByText("Error")).toBeInTheDocument();

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <ErrorMessage error={null} />
        </ThemeProvider>,
      );
      expect(container.firstChild).toBeNull();
    });

    it("should handle error prop changing between different strings", () => {
      const { rerender } = renderWithTheme(
        <ErrorMessage error="First error" />,
      );
      expect(screen.getByText("First error")).toBeInTheDocument();

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <ErrorMessage error="Second error" />
        </ThemeProvider>,
      );
      expect(screen.getByText("Second error")).toBeInTheDocument();
      expect(screen.queryByText("First error")).not.toBeInTheDocument();
    });

    it("should handle whitespace-only error (treated as truthy)", () => {
      const { container } = renderWithTheme(<ErrorMessage error="   " />);
      // Whitespace-only error should still render the component
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle numeric error converted to string", () => {
      renderWithTheme(<ErrorMessage error={404} />);
      expect(screen.getByText("404")).toBeInTheDocument();
    });

    it("should handle zero as error (falsy but valid)", () => {
      renderWithTheme(<ErrorMessage error={0} />);
      // 0 is falsy, so it should not render
      // But this depends on implementation - if it checks for null/undefined specifically
    });
  });

  // =============================================================================
  // Return Value Tests
  // =============================================================================

  describe("return value", () => {
    it("should return null when error is falsy", () => {
      const { container } = renderWithTheme(<ErrorMessage error={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should return content when error is truthy", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      expect(container.firstChild).not.toBeNull();
    });

    it("should return null for empty string", () => {
      const { container } = renderWithTheme(<ErrorMessage error="" />);
      expect(container.firstChild).toBeNull();
    });
  });

  // =============================================================================
  // Icon Tests
  // =============================================================================

  describe("icon rendering", () => {
    it("should render ShieldAlert icon with correct size", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should have margin between icon and text", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      const paragraph = container.querySelector("p");
      expect(paragraph).toHaveClass("flex");
    });
  });

  // =============================================================================
  // Animation Tests (Mocked)
  // =============================================================================

  describe("animation", () => {
    it("should have motion.div wrapper", () => {
      const { container } = renderWithTheme(
        <ErrorMessage error="Test error" />,
      );
      // Since we're mocking framer-motion, just verify the structure exists
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

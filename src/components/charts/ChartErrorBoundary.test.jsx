/**
 * Unit Tests for ChartErrorBoundary Component
 * Tests error catching, fallback UI, retry functionality, and theme support
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChartErrorBoundary from "./ChartErrorBoundary";

// =============================================================================
// Test Helpers
// =============================================================================

// Component that throws an error
const ThrowError = ({ shouldThrow = true, errorMessage = "Chart error" }) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div data-testid="chart-content">Chart rendered successfully</div>;
};

// Custom fallback component for testing
const CustomFallback = ({ error, retry, chartName }) => (
  <div data-testid="custom-fallback">
    <span data-testid="custom-chart-name">{chartName}</span>
    <span data-testid="custom-error">{error?.message}</span>
    <button data-testid="custom-retry" onClick={retry}>
      Custom Retry
    </button>
  </div>
);

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe("ChartErrorBoundary", () => {
  let consoleSpy;

  beforeEach(() => {
    // Suppress console.error for cleaner test output
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("basic rendering", () => {
    it("should render children when no error occurs", () => {
      render(
        <ChartErrorBoundary>
          <div data-testid="chart">Chart Content</div>
        </ChartErrorBoundary>,
      );

      expect(screen.getByTestId("chart")).toBeInTheDocument();
      expect(screen.getByText("Chart Content")).toBeInTheDocument();
    });

    it("should render multiple children without error", () => {
      render(
        <ChartErrorBoundary>
          <div data-testid="chart-1">Chart 1</div>
          <div data-testid="chart-2">Chart 2</div>
        </ChartErrorBoundary>,
      );

      expect(screen.getByTestId("chart-1")).toBeInTheDocument();
      expect(screen.getByTestId("chart-2")).toBeInTheDocument();
    });

    it("should not render fallback UI when no error", () => {
      render(
        <ChartErrorBoundary chartName="Test Chart">
          <div>Content</div>
        </ChartErrorBoundary>,
      );

      expect(screen.queryByText("Test Chart Error")).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Error Catching Tests
  // ===========================================================================

  describe("error catching", () => {
    it("should catch errors and display default fallback UI", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(screen.getByText("Chart Error")).toBeInTheDocument();
      expect(screen.queryByTestId("chart-content")).not.toBeInTheDocument();
    });

    it("should display chart name in error title", () => {
      render(
        <ChartErrorBoundary chartName="Lead Activity">
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(screen.getByText("Lead Activity Error")).toBeInTheDocument();
    });

    it("should display default error message", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(
        screen.getByText(/Unable to render this chart/i),
      ).toBeInTheDocument();
    });

    it("should have role alert for accessibility", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should have aria-live polite for screen readers", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");
    });
  });

  // ===========================================================================
  // Custom Fallback Tests
  // ===========================================================================

  describe("custom fallback", () => {
    it("should render custom fallback element when provided", () => {
      render(
        <ChartErrorBoundary
          fallback={<div data-testid="custom">Custom Error</div>}
        >
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(screen.getByTestId("custom")).toBeInTheDocument();
      expect(screen.getByText("Custom Error")).toBeInTheDocument();
    });

    it("should render custom fallback function when provided", () => {
      render(
        <ChartErrorBoundary chartName="Test Chart" fallback={CustomFallback}>
          <ThrowError errorMessage="Custom error message" />
        </ChartErrorBoundary>,
      );

      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
      expect(screen.getByTestId("custom-chart-name")).toHaveTextContent(
        "Test Chart",
      );
      expect(screen.getByTestId("custom-error")).toHaveTextContent(
        "Custom error message",
      );
    });

    it("should pass retry function to custom fallback", () => {
      render(
        <ChartErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(screen.getByTestId("custom-retry")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Retry Functionality Tests
  // ===========================================================================

  describe("retry functionality", () => {
    it("should render Try Again button by default", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(
        screen.getByRole("button", { name: /Try Again/i }),
      ).toBeInTheDocument();
    });

    it("should not render Try Again button when showRetry is false", () => {
      render(
        <ChartErrorBoundary showRetry={false}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(
        screen.queryByRole("button", { name: /Try Again/i }),
      ).not.toBeInTheDocument();
    });

    it("should reset error state when Try Again is clicked", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const retryButton = screen.getByRole("button", { name: /Try Again/i });
      fireEvent.click(retryButton);

      // Will throw again but error state should have been reset first
      expect(screen.getByText("Chart Error")).toBeInTheDocument();
    });

    it("should track error count on retries", () => {
      render(
        <ChartErrorBoundary maxRetries={3}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      // First error is shown
      expect(screen.getByText("Chart Error")).toBeInTheDocument();

      // Retry button should be available (errorCount=1 < maxRetries=3)
      const retryButton = screen.getByRole("button", { name: /Try Again/i });
      expect(retryButton).toBeInTheDocument();
    });

    it("should handle retry attempt when component keeps throwing", () => {
      render(
        <ChartErrorBoundary maxRetries={3}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      // Error state is shown
      expect(screen.getByText("Chart Error")).toBeInTheDocument();

      // Clicking retry resets state, component re-renders and throws again
      const retryButton = screen.getByRole("button", { name: /Try Again/i });
      fireEvent.click(retryButton);

      // Should still show error (component threw again)
      expect(screen.getByText("Chart Error")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Max Retries Tests
  // ===========================================================================

  describe("max retries", () => {
    it("should have default max retries of 3", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      // Initial error shows retry button (errorCount starts at 1, maxRetries is 3)
      // canRetry = showRetry && errorCount < maxRetries = true && 1 < 3 = true
      expect(
        screen.getByRole("button", { name: /Try Again/i }),
      ).toBeInTheDocument();
    });

    it("should accept custom maxRetries prop", () => {
      // With maxRetries=5, should still show retry after first error
      render(
        <ChartErrorBoundary maxRetries={5}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      // errorCount is 1 after first error, 1 < 5 so retry should be available
      expect(
        screen.getByRole("button", { name: /Try Again/i }),
      ).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Height Prop Tests
  // ===========================================================================

  describe("height prop", () => {
    it("should use default height of 300px", () => {
      const { container } = render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const errorContainer = container.querySelector('[role="alert"]');
      expect(errorContainer).toHaveStyle({ minHeight: "300px" });
    });

    it("should use custom height when provided", () => {
      const { container } = render(
        <ChartErrorBoundary height="400px">
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const errorContainer = container.querySelector('[role="alert"]');
      expect(errorContainer).toHaveStyle({ minHeight: "400px" });
    });
  });

  // ===========================================================================
  // Theme (Dark Mode) Tests
  // ===========================================================================

  describe("dark mode styling", () => {
    it("should apply light mode classes by default", () => {
      const { container } = render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const errorContainer = container.querySelector('[role="alert"]');
      expect(errorContainer).toHaveClass("bg-white/90");
    });

    it("should apply dark mode classes when isDark is true", () => {
      const { container } = render(
        <ChartErrorBoundary isDark={true}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const errorContainer = container.querySelector('[role="alert"]');
      expect(errorContainer).toHaveClass("bg-slate-800/80");
    });

    it("should apply dark mode icon styling when isDark is true", () => {
      const { container } = render(
        <ChartErrorBoundary isDark={true}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const iconContainer = container.querySelector(".bg-red-900\\/30");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should apply light mode icon styling when isDark is false", () => {
      const { container } = render(
        <ChartErrorBoundary isDark={false}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const iconContainer = container.querySelector(".bg-red-100");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should apply dark mode text colors when isDark is true", () => {
      render(
        <ChartErrorBoundary isDark={true}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const title = screen.getByText("Chart Error");
      expect(title).toHaveClass("text-slate-200");
    });

    it("should apply light mode text colors when isDark is false", () => {
      render(
        <ChartErrorBoundary isDark={false}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const title = screen.getByText("Chart Error");
      expect(title).toHaveClass("text-slate-700");
    });

    it("should apply dark mode button styling when isDark is true", () => {
      render(
        <ChartErrorBoundary isDark={true}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const button = screen.getByRole("button", { name: /Try Again/i });
      expect(button).toHaveClass("bg-slate-700");
    });

    it("should apply light mode button styling when isDark is false", () => {
      render(
        <ChartErrorBoundary isDark={false}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const button = screen.getByRole("button", { name: /Try Again/i });
      expect(button).toHaveClass("bg-slate-100");
    });
  });

  // ===========================================================================
  // onError Callback Tests
  // ===========================================================================

  describe("onError callback", () => {
    it("should call onError callback when error is caught", () => {
      const onError = vi.fn();

      render(
        <ChartErrorBoundary onError={onError} chartName="Test Chart">
          <ThrowError errorMessage="Test error" />
        </ChartErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        }),
        "Test Chart",
      );
    });

    it("should pass chart name to onError callback", () => {
      const onError = vi.fn();

      render(
        <ChartErrorBoundary onError={onError} chartName="Lead Activity">
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object),
        "Lead Activity",
      );
    });

    it("should not fail when onError is not provided", () => {
      expect(() => {
        render(
          <ChartErrorBoundary>
            <ThrowError />
          </ChartErrorBoundary>,
        );
      }).not.toThrow();
    });
  });

  // ===========================================================================
  // Styling Tests
  // ===========================================================================

  describe("styling", () => {
    it("should have rounded corners", () => {
      const { container } = render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const errorContainer = container.querySelector('[role="alert"]');
      expect(errorContainer).toHaveClass("rounded-2xl");
    });

    it("should have backdrop blur", () => {
      const { container } = render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const errorContainer = container.querySelector('[role="alert"]');
      expect(errorContainer).toHaveClass("backdrop-blur-lg");
    });

    it("should have border", () => {
      const { container } = render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const errorContainer = container.querySelector('[role="alert"]');
      expect(errorContainer).toHaveClass("border");
    });

    it("should center content with flexbox", () => {
      const { container } = render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const errorContainer = container.querySelector('[role="alert"]');
      expect(errorContainer).toHaveClass("flex");
      expect(errorContainer).toHaveClass("items-center");
      expect(errorContainer).toHaveClass("justify-center");
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("edge cases", () => {
    it("should handle errors without message", () => {
      const ThrowEmptyError = () => {
        throw new Error();
      };

      render(
        <ChartErrorBoundary>
          <ThrowEmptyError />
        </ChartErrorBoundary>,
      );

      expect(screen.getByText("Chart Error")).toBeInTheDocument();
    });

    it("should handle non-Error throws", () => {
      const ThrowString = () => {
        throw "String error";
      };

      render(
        <ChartErrorBoundary>
          <ThrowString />
        </ChartErrorBoundary>,
      );

      expect(screen.getByText("Chart Error")).toBeInTheDocument();
    });

    it("should handle empty chartName", () => {
      render(
        <ChartErrorBoundary chartName="">
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("should handle deeply nested children that throw", () => {
      render(
        <ChartErrorBoundary chartName="Nested Chart">
          <div>
            <div>
              <div>
                <ThrowError />
              </div>
            </div>
          </div>
        </ChartErrorBoundary>,
      );

      expect(screen.getByText("Nested Chart Error")).toBeInTheDocument();
    });

    it("should display error state after error occurs", () => {
      render(
        <ChartErrorBoundary maxRetries={3}>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      // Error should be displayed
      expect(screen.getByText("Chart Error")).toBeInTheDocument();
      expect(
        screen.getByText(/Unable to render this chart/i),
      ).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Default Props Tests
  // ===========================================================================

  describe("default props", () => {
    it("should use default chartName of Chart", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(screen.getByText("Chart Error")).toBeInTheDocument();
    });

    it("should show retry by default", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      expect(
        screen.getByRole("button", { name: /Try Again/i }),
      ).toBeInTheDocument();
    });

    it("should use light mode by default", () => {
      const { container } = render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const errorContainer = container.querySelector('[role="alert"]');
      expect(errorContainer).toHaveClass("bg-white/90");
    });
  });

  // ===========================================================================
  // Icon Tests
  // ===========================================================================

  describe("icon", () => {
    it("should render AlertTriangle icon", () => {
      const { container } = render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      // The icon should be within the icon container
      const iconContainer = container.querySelector(".rounded-full");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should render RefreshCcw icon in retry button", () => {
      render(
        <ChartErrorBoundary>
          <ThrowError />
        </ChartErrorBoundary>,
      );

      const button = screen.getByRole("button", { name: /Try Again/i });
      expect(button.querySelector("svg")).toBeInTheDocument();
    });
  });
});

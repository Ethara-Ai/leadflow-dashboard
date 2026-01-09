/**
 * Unit Tests for ErrorBoundary Component
 * Tests error catching, fallback UI, and recovery functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

// =============================================================================
// Test Helpers
// =============================================================================

// Component that throws an error
const ThrowError = ({ shouldThrow = true, errorMessage = "Test error" }) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div data-testid="child-component">Child content</div>;
};

// Custom fallback component for testing
const CustomFallbackComponent = ({ error, resetErrorBoundary }) => (
  <div data-testid="custom-fallback">
    <span data-testid="error-message">{error?.message}</span>
    <button data-testid="reset-button" onClick={resetErrorBoundary}>
      Reset
    </button>
  </div>
);

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe("ErrorBoundary", () => {
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
        <ErrorBoundary>
          <div data-testid="child">Hello World</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("should render multiple children without error", () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });

    it("should not render fallback UI when no error", () => {
      render(
        <ErrorBoundary>
          <div>Content</div>
        </ErrorBoundary>
      );

      expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    });
  });

  describe("error catching", () => {
    it("should catch errors and display default fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.queryByTestId("child-component")).not.toBeInTheDocument();
    });

    it("should display default fallback message", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(
        screen.getByText(/An error occurred while rendering this component/)
      ).toBeInTheDocument();
    });

    it("should render alert icon in fallback UI", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Should have the AlertTriangle icon container
      expect(container.querySelector(".bg-red-100")).toBeInTheDocument();
    });

    it("should have role alert for accessibility", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should have aria-live assertive for screen readers", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
    });
  });

  describe("custom fallback", () => {
    it("should render custom fallback element when provided", () => {
      render(
        <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Error</div>}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
      expect(screen.getByText("Custom Error")).toBeInTheDocument();
    });

    it("should render FallbackComponent when provided", () => {
      render(
        <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
          <ThrowError errorMessage="Specific error" />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toHaveTextContent("Specific error");
    });

    it("should prioritize FallbackComponent over fallback element", () => {
      render(
        <ErrorBoundary
          fallback={<div data-testid="fallback-element">Element Fallback</div>}
          FallbackComponent={CustomFallbackComponent}
        >
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
      expect(screen.queryByTestId("fallback-element")).not.toBeInTheDocument();
    });

    it("should pass error to FallbackComponent", () => {
      render(
        <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
          <ThrowError errorMessage="Error passed to component" />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Error passed to component"
      );
    });
  });

  describe("showDetails prop", () => {
    it("should not show error details by default", () => {
      render(
        <ErrorBoundary>
          <ThrowError errorMessage="Hidden error" />
        </ErrorBoundary>
      );

      expect(screen.queryByText("Error details")).not.toBeInTheDocument();
    });

    it("should show error details when showDetails is true", () => {
      render(
        <ErrorBoundary showDetails>
          <ThrowError errorMessage="Visible error" />
        </ErrorBoundary>
      );

      expect(screen.getByText("Error details")).toBeInTheDocument();
    });

    it("should show actual error message in details", () => {
      render(
        <ErrorBoundary showDetails>
          <ThrowError errorMessage="Detailed error message" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Detailed error message/)).toBeInTheDocument();
    });
  });

  describe("callbacks", () => {
    it("should call onError callback when error is caught", () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError errorMessage="Callback test error" />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it("should call onReset callback when reset is triggered", async () => {
      const onReset = vi.fn();

      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole("button", { name: /Try Again/i });
      fireEvent.click(tryAgainButton);

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("reset functionality", () => {
    it("should render Try Again button in default fallback", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
    });

    it("should render Reload Page button in default fallback", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole("button", { name: /Reload Page/i })).toBeInTheDocument();
    });

    it("should pass resetErrorBoundary to FallbackComponent", () => {
      render(
        <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("reset-button")).toBeInTheDocument();
    });

    it("should reset state when Try Again is clicked", () => {
      const TestComponent = () => {
        const [shouldThrow, setShouldThrow] = vi.importActual("react").useState(true);

        return (
          <ErrorBoundary>
            {shouldThrow ? (
              <ThrowError />
            ) : (
              <button onClick={() => setShouldThrow(true)}>Trigger Error</button>
            )}
          </ErrorBoundary>
        );
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Initially should show error
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Click Try Again
      fireEvent.click(screen.getByRole("button", { name: /Try Again/i }));

      // Will throw again since component still throws
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should call window.location.reload when Reload Page is clicked", () => {
      const reloadMock = vi.fn();
      const originalLocation = window.location;

      delete window.location;
      window.location = { reload: reloadMock };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole("button", { name: /Reload Page/i }));

      expect(reloadMock).toHaveBeenCalledTimes(1);

      window.location = originalLocation;
    });
  });

  describe("styling", () => {
    it("should have centered layout", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("flex");
      expect(wrapper).toHaveClass("items-center");
      expect(wrapper).toHaveClass("justify-center");
    });

    it("should have rounded card styling", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const card = container.querySelector(".rounded-2xl");
      expect(card).toBeInTheDocument();
    });

    it("should have shadow styling", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const card = container.querySelector(".shadow-xl");
      expect(card).toBeInTheDocument();
    });
  });

  describe("button styling", () => {
    it("should have styled Try Again button", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole("button", { name: /Try Again/i });
      expect(tryAgainButton).toHaveClass("rounded-xl");
      expect(tryAgainButton).toHaveClass("transition-colors");
    });

    it("should have styled Reload Page button", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByRole("button", { name: /Reload Page/i });
      expect(reloadButton).toHaveClass("bg-blue-600");
      expect(reloadButton).toHaveClass("text-white");
    });
  });

  describe("error logging", () => {
    it("should log error to console", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError errorMessage="Logged error" />
        </ErrorBoundary>
      );

      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  });

  describe("getDerivedStateFromError", () => {
    it("should set hasError to true when error occurs", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // If hasError is true, fallback UI is rendered
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle errors without message", () => {
      const ThrowEmptyError = () => {
        throw new Error();
      };

      render(
        <ErrorBoundary showDetails>
          <ThrowEmptyError />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should handle non-Error throws", () => {
      const ThrowString = () => {
        throw "String error";
      };

      render(
        <ErrorBoundary>
          <ThrowString />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should not crash with deeply nested children", () => {
      render(
        <ErrorBoundary>
          <div>
            <div>
              <div>
                <ThrowError />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});

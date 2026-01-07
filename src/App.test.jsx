/**
 * Unit Tests for App Component
 * Tests the main App component with loading state management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import App from "./App";

// =============================================================================
// Mocks
// =============================================================================

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    span: ({ children, className, ...props }) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
    p: ({ children, className, ...props }) => (
      <p className={className} {...props}>
        {children}
      </p>
    ),
    button: ({ children, className, ...props }) => (
      <button className={className} {...props}>
        {children}
      </button>
    ),
    h1: ({ children, className, ...props }) => (
      <h1 className={className} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, className, ...props }) => (
      <h2 className={className} {...props}>
        {children}
      </h2>
    ),
    svg: ({ children, className, ...props }) => (
      <svg className={className} {...props}>
        {children}
      </svg>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock child components to simplify testing
vi.mock("./components/LoadingScreen", () => ({
  default: () => <div data-testid="loading-screen">Loading...</div>,
}));

vi.mock("./components/dashboard", () => ({
  default: () => <div data-testid="dashboard">Dashboard Content</div>,
}));

// =============================================================================
// Test Helpers
// =============================================================================

// Helper function for waiting for loading to complete (available for future tests)
const _waitForLoadingToComplete = async (timeout = 5000) => {
  await waitFor(
    () => {
      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
    },
    { timeout },
  );
};
void _waitForLoadingToComplete; // Suppress unused warning

// =============================================================================
// App Component Tests
// =============================================================================

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset document.readyState mock
    Object.defineProperty(document, "readyState", {
      value: "loading",
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // =============================================================================
  // Initial Loading State Tests
  // =============================================================================

  describe("initial loading state", () => {
    it("should render loading screen initially", () => {
      render(<App />);

      expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
    });

    it("should not render dashboard while loading", () => {
      render(<App />);

      expect(screen.queryByTestId("dashboard")).not.toBeInTheDocument();
    });

    it("should show loading screen text", () => {
      render(<App />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Loading Completion Tests
  // =============================================================================

  describe("loading completion", () => {
    it("should hide loading screen after max loading time (4 seconds)", async () => {
      render(<App />);

      expect(screen.getByTestId("loading-screen")).toBeInTheDocument();

      // Advance past the max loading time
      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
    });

    it("should show dashboard after loading completes", async () => {
      render(<App />);

      // Advance past the max loading time
      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });

    it("should complete loading when document is already complete", async () => {
      // Set document as already loaded
      Object.defineProperty(document, "readyState", {
        value: "complete",
        writable: true,
        configurable: true,
      });

      render(<App />);

      // Advance past the minimum display time (1.5 seconds)
      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });

    it("should transition to dashboard after window load event", async () => {
      render(<App />);

      // Simulate window load event
      await act(async () => {
        window.dispatchEvent(new Event("load"));
      });

      // Advance past minimum display time
      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Minimum Loading Time Tests
  // =============================================================================

  describe("minimum loading time", () => {
    it("should maintain loading screen for at least 1.5 seconds after load", async () => {
      // Document already complete
      Object.defineProperty(document, "readyState", {
        value: "complete",
        writable: true,
        configurable: true,
      });

      render(<App />);

      // At 1 second, should still be loading
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByTestId("loading-screen")).toBeInTheDocument();

      // At 1.5 seconds, loading should complete
      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
    });
  });

  // =============================================================================
  // Maximum Loading Time Tests
  // =============================================================================

  describe("maximum loading time", () => {
    it("should not exceed 4 seconds of loading time", async () => {
      render(<App />);

      // At 3.9 seconds, should still be loading
      await act(async () => {
        vi.advanceTimersByTime(3900);
      });

      expect(screen.getByTestId("loading-screen")).toBeInTheDocument();

      // At 4 seconds, loading should complete
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
    });

    it("should show dashboard after exactly 4 seconds", async () => {
      render(<App />);

      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Cleanup Tests
  // =============================================================================

  describe("cleanup on unmount", () => {
    it("should cleanup timeouts on unmount", async () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

      const { unmount } = render(<App />);

      unmount();

      // clearTimeout should have been called for the max loading timer
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it("should remove load event listener on unmount", async () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = render(<App />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "load",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  // =============================================================================
  // State Transition Tests
  // =============================================================================

  describe("state transitions", () => {
    it("should only show one component at a time", async () => {
      render(<App />);

      // During loading
      expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
      expect(screen.queryByTestId("dashboard")).not.toBeInTheDocument();

      // After loading
      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });

    it("should not flicker between states", async () => {
      render(<App />);

      // Check state at various points
      for (let i = 0; i < 3500; i += 500) {
        await act(async () => {
          vi.advanceTimersByTime(500);
        });

        // Should always be loading before 4 seconds
        if (i < 3500) {
          expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
        }
      }

      // Complete loading
      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Should be dashboard after 4 seconds
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should handle multiple load events gracefully", async () => {
      render(<App />);

      // Fire multiple load events
      await act(async () => {
        window.dispatchEvent(new Event("load"));
        window.dispatchEvent(new Event("load"));
        window.dispatchEvent(new Event("load"));
      });

      // Should still work correctly
      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });

    it("should handle re-renders during loading", async () => {
      const { rerender } = render(<App />);

      expect(screen.getByTestId("loading-screen")).toBeInTheDocument();

      // Re-render the app
      rerender(<App />);

      expect(screen.getByTestId("loading-screen")).toBeInTheDocument();

      // Complete loading
      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Integration Tests
  // =============================================================================

  describe("integration", () => {
    it("should complete full loading cycle", async () => {
      render(<App />);

      // Initial state
      expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
      expect(screen.queryByTestId("dashboard")).not.toBeInTheDocument();

      // Advance through loading
      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      // Final state
      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });
  });
});

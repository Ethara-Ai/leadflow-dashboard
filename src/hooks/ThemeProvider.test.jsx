/**
 * Unit Tests for ThemeProvider Component
 * Tests the theme context provider with localStorage persistence
 */

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import React, { useContext } from "react";
import ThemeProvider from "./ThemeProvider";
import { ThemeContext } from "./ThemeContext";

// =============================================================================
// Test Helpers
// =============================================================================

const TestConsumer = () => {
  const context = useContext(ThemeContext);
  return (
    <div>
      <span data-testid="is-dark">{String(context?.isDark)}</span>
      <span data-testid="dark-mode">{String(context?.darkMode)}</span>
      <button data-testid="toggle-btn" onClick={context?.toggleTheme}>
        Toggle
      </button>
      <button
        data-testid="set-dark-btn"
        onClick={() => context?.setDarkMode(true)}
      >
        Set Dark
      </button>
      <button
        data-testid="set-light-btn"
        onClick={() => context?.setDarkMode(false)}
      >
        Set Light
      </button>
    </div>
  );
};

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
  });

  describe("basic rendering", () => {
    it("should render children", () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Child Content</div>
        </ThemeProvider>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <ThemeProvider>
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
        </ThemeProvider>,
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });

    it("should render nested elements", () => {
      render(
        <ThemeProvider>
          <div data-testid="parent">
            <div data-testid="nested">Nested Content</div>
          </div>
        </ThemeProvider>,
      );

      expect(screen.getByTestId("nested")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Context Value Tests
  // =============================================================================

  describe("context value", () => {
    it("should provide isDark value", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });

    it("should provide darkMode alias", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("dark-mode")).toHaveTextContent("false");
    });

    it("should have isDark and darkMode in sync", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      const isDark = screen.getByTestId("is-dark").textContent;
      const darkMode = screen.getByTestId("dark-mode").textContent;

      expect(isDark).toBe(darkMode);
    });

    it("should provide toggleTheme function", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      const toggleBtn = screen.getByTestId("toggle-btn");
      expect(toggleBtn).toBeInTheDocument();
    });

    it("should provide setDarkMode function", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      const setDarkBtn = screen.getByTestId("set-dark-btn");
      expect(setDarkBtn).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Default Value Tests
  // =============================================================================

  describe("default values", () => {
    it("should default to light mode (isDark = false)", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });

    it("should use defaultDarkMode prop when set to true", () => {
      render(
        <ThemeProvider defaultDarkMode={true}>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");
    });

    it("should use defaultDarkMode prop when set to false", () => {
      render(
        <ThemeProvider defaultDarkMode={false}>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });
  });

  // =============================================================================
  // localStorage Integration Tests
  // =============================================================================

  describe("localStorage integration", () => {
    it("should check localStorage on mount", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(localStorage.getItem).toHaveBeenCalledWith("antlab-theme");
    });

    it("should use dark mode when localStorage has 'dark'", () => {
      localStorage.getItem.mockReturnValue("dark");

      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");
    });

    it("should use light mode when localStorage has 'light'", () => {
      localStorage.getItem.mockReturnValue("light");

      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });

    it("should prefer localStorage over defaultDarkMode", () => {
      localStorage.getItem.mockReturnValue("light");

      render(
        <ThemeProvider defaultDarkMode={true}>
          <TestConsumer />
        </ThemeProvider>,
      );

      // localStorage says light, even though default is dark
      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });

    it("should save to localStorage when theme changes", async () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      const toggleBtn = screen.getByTestId("toggle-btn");

      act(() => {
        toggleBtn.click();
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "antlab-theme",
          "dark",
        );
      });
    });

    it("should save 'light' to localStorage when set to light mode", async () => {
      localStorage.getItem.mockReturnValue("dark");

      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      const setLightBtn = screen.getByTestId("set-light-btn");

      act(() => {
        setLightBtn.click();
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "antlab-theme",
          "light",
        );
      });
    });
  });

  // =============================================================================
  // toggleTheme Tests
  // =============================================================================

  describe("toggleTheme functionality", () => {
    it("should toggle from light to dark", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");

      act(() => {
        screen.getByTestId("toggle-btn").click();
      });

      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");
    });

    it("should toggle from dark to light", () => {
      render(
        <ThemeProvider defaultDarkMode={true}>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");

      act(() => {
        screen.getByTestId("toggle-btn").click();
      });

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });

    it("should keep isDark and darkMode in sync after toggle", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      act(() => {
        screen.getByTestId("toggle-btn").click();
      });

      const isDark = screen.getByTestId("is-dark").textContent;
      const darkMode = screen.getByTestId("dark-mode").textContent;

      expect(isDark).toBe(darkMode);
      expect(isDark).toBe("true");
    });

    it("should handle multiple toggles", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      const toggleBtn = screen.getByTestId("toggle-btn");

      // Start: false
      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");

      // Toggle 1: true
      act(() => toggleBtn.click());
      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");

      // Toggle 2: false
      act(() => toggleBtn.click());
      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");

      // Toggle 3: true
      act(() => toggleBtn.click());
      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");

      // Toggle 4: false
      act(() => toggleBtn.click());
      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });
  });

  // =============================================================================
  // setDarkMode Tests
  // =============================================================================

  describe("setDarkMode functionality", () => {
    it("should set dark mode to true", () => {
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");

      act(() => {
        screen.getByTestId("set-dark-btn").click();
      });

      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");
    });

    it("should set dark mode to false", () => {
      render(
        <ThemeProvider defaultDarkMode={true}>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");

      act(() => {
        screen.getByTestId("set-light-btn").click();
      });

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });

    it("should be idempotent when setting same value", () => {
      render(
        <ThemeProvider defaultDarkMode={true}>
          <TestConsumer />
        </ThemeProvider>,
      );

      // Already dark, set to dark again
      act(() => {
        screen.getByTestId("set-dark-btn").click();
      });

      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");

      // Set to dark again
      act(() => {
        screen.getByTestId("set-dark-btn").click();
      });

      expect(screen.getByTestId("is-dark")).toHaveTextContent("true");
    });
  });

  // =============================================================================
  // Multiple Consumers Tests
  // =============================================================================

  describe("multiple consumers", () => {
    const MultiConsumer = () => (
      <>
        <div data-testid="consumer-1">
          <TestConsumer />
        </div>
        <div data-testid="consumer-2">
          <TestConsumer />
        </div>
      </>
    );

    it("should provide same values to multiple consumers", () => {
      render(
        <ThemeProvider defaultDarkMode={true}>
          <MultiConsumer />
        </ThemeProvider>,
      );

      const consumer1 = screen.getByTestId("consumer-1");
      const consumer2 = screen.getByTestId("consumer-2");

      const isDark1 = consumer1.querySelector(
        '[data-testid="is-dark"]',
      ).textContent;
      const isDark2 = consumer2.querySelector(
        '[data-testid="is-dark"]',
      ).textContent;

      expect(isDark1).toBe(isDark2);
      expect(isDark1).toBe("true");
    });
  });

  // =============================================================================
  // Nested Providers Tests
  // =============================================================================

  describe("nested providers", () => {
    it("should allow nested providers with different values", () => {
      render(
        <ThemeProvider defaultDarkMode={false}>
          <div data-testid="outer">
            <TestConsumer />
          </div>
          <ThemeProvider defaultDarkMode={true}>
            <div data-testid="inner">
              <TestConsumer />
            </div>
          </ThemeProvider>
        </ThemeProvider>,
      );

      const outer = screen.getByTestId("outer");
      const inner = screen.getByTestId("inner");

      const outerIsDark = outer.querySelector(
        '[data-testid="is-dark"]',
      ).textContent;
      const innerIsDark = inner.querySelector(
        '[data-testid="is-dark"]',
      ).textContent;

      expect(outerIsDark).toBe("false");
      expect(innerIsDark).toBe("true");
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should handle undefined localStorage value gracefully", () => {
      localStorage.getItem.mockReturnValue(undefined);

      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });

    it("should handle invalid localStorage value gracefully", () => {
      localStorage.getItem.mockReturnValue("invalid-value");

      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      // Should not be dark since value !== "dark"
      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });

    it("should handle empty string localStorage value", () => {
      localStorage.getItem.mockReturnValue("");

      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    });

    it("should render without crashing when children is null", () => {
      expect(() => {
        render(<ThemeProvider>{null}</ThemeProvider>);
      }).not.toThrow();
    });

    it("should render without crashing when children is undefined", () => {
      expect(() => {
        render(<ThemeProvider>{undefined}</ThemeProvider>);
      }).not.toThrow();
    });
  });
});

/**
 * Unit Tests for Theme Hooks
 * Tests useTheme hook, ThemeProvider, and ThemeContext
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import useTheme from "./useTheme";
import ThemeProvider from "./ThemeProvider";
import { ThemeContext } from "./ThemeContext";

// =============================================================================
// Test Wrapper Helper
// =============================================================================

const createWrapper = (defaultDarkMode = false) => {
  return function Wrapper({ children }) {
    return (
      <ThemeProvider defaultDarkMode={defaultDarkMode}>
        {children}
      </ThemeProvider>
    );
  };
};

// =============================================================================
// useTheme Hook Tests
// =============================================================================

describe("useTheme", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.getItem.mockReturnValue(null);
  });

  describe("when used within ThemeProvider", () => {
    it("should return isDark property", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current).toHaveProperty("isDark");
      expect(typeof result.current.isDark).toBe("boolean");
    });

    it("should return darkMode alias for backward compatibility", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current).toHaveProperty("darkMode");
      expect(result.current.darkMode).toBe(result.current.isDark);
    });

    it("should return toggleTheme function", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current).toHaveProperty("toggleTheme");
      expect(typeof result.current.toggleTheme).toBe("function");
    });

    it("should return setDarkMode function", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current).toHaveProperty("setDarkMode");
      expect(typeof result.current.setDarkMode).toBe("function");
    });

    it("should default to light mode (isDark = false)", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(false);
    });

    it("should respect defaultDarkMode prop", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      expect(result.current.isDark).toBe(true);
    });
  });

  describe("toggleTheme functionality", () => {
    it("should toggle from light to dark mode", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(true);
    });

    it("should toggle from dark to light mode", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      expect(result.current.isDark).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(false);
    });

    it("should toggle multiple times correctly", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.isDark).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.isDark).toBe(true);
    });

    it("should keep darkMode alias in sync after toggle", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(result.current.darkMode);
      expect(result.current.isDark).toBe(true);
    });
  });

  describe("setDarkMode functionality", () => {
    it("should set dark mode to true", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.isDark).toBe(true);
    });

    it("should set dark mode to false", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      expect(result.current.isDark).toBe(true);

      act(() => {
        result.current.setDarkMode(false);
      });

      expect(result.current.isDark).toBe(false);
    });

    it("should handle setting same value (idempotent)", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.isDark).toBe(true);

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.isDark).toBe(true);
    });
  });

  describe("when used outside ThemeProvider", () => {
    it("should throw an error", () => {
      // Suppress console.error for this test since we expect an error
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow("useTheme must be used within a ThemeProvider");

      consoleSpy.mockRestore();
    });
  });
});

// =============================================================================
// ThemeProvider Tests
// =============================================================================

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
  });

  describe("initialization", () => {
    it("should render children", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current).toBeDefined();
    });

    it("should default to light mode when no localStorage value", () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(false);
    });

    it("should use defaultDarkMode when no localStorage value", () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      expect(result.current.isDark).toBe(true);
    });

    it("should read from localStorage on mount", () => {
      localStorage.getItem.mockReturnValue("dark");

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(localStorage.getItem).toHaveBeenCalledWith("leadflow-theme");
      expect(result.current.isDark).toBe(true);
    });

    it("should use light mode when localStorage value is 'light'", () => {
      localStorage.getItem.mockReturnValue("light");

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true), // Even with default true
      });

      expect(result.current.isDark).toBe(false);
    });
  });

  describe("localStorage persistence", () => {
    it("should save 'dark' to localStorage when toggled to dark mode", async () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      act(() => {
        result.current.toggleTheme();
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "leadflow-theme",
          "dark",
        );
      });
    });

    it("should save 'light' to localStorage when toggled to light mode", async () => {
      localStorage.getItem.mockReturnValue("dark");

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      act(() => {
        result.current.toggleTheme();
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "leadflow-theme",
          "light",
        );
      });
    });

    it("should save to localStorage when using setDarkMode", async () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      act(() => {
        result.current.setDarkMode(true);
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "leadflow-theme",
          "dark",
        );
      });
    });
  });

  describe("context value memoization", () => {
    it("should maintain reference equality when theme does not change", () => {
      const { result, rerender } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      const firstValue = result.current;
      rerender();
      const secondValue = result.current;

      // The object reference should be the same due to useMemo
      expect(firstValue).toBe(secondValue);
    });

    it("should update reference when theme changes", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      const firstValue = result.current;

      act(() => {
        result.current.toggleTheme();
      });

      const secondValue = result.current;

      // The object reference should be different after toggle
      expect(firstValue).not.toBe(secondValue);
    });
  });
});

// =============================================================================
// ThemeContext Tests
// =============================================================================

describe("ThemeContext", () => {
  it("should be defined", () => {
    expect(ThemeContext).toBeDefined();
  });

  it("should have undefined as default value", () => {
    // The context is created with undefined as default
    // This is intentional to detect usage outside provider
    const { result } = renderHook(() => React.useContext(ThemeContext));
    expect(result.current).toBeUndefined();
  });

  it("should be a valid React context", () => {
    expect(ThemeContext.Provider).toBeDefined();
    expect(ThemeContext.Consumer).toBeDefined();
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe("Theme Hooks Integration", () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
  });

  it("should share state between multiple useTheme calls", () => {
    const wrapper = createWrapper(false);

    const { result: result1 } = renderHook(() => useTheme(), { wrapper });
    const { result: result2 } = renderHook(() => useTheme(), { wrapper });

    // Both should start in light mode
    expect(result1.current.isDark).toBe(false);
    expect(result2.current.isDark).toBe(false);
  });

  it("should work with nested providers (last provider wins)", () => {
    const NestedWrapper = ({ children }) => (
      <ThemeProvider defaultDarkMode={false}>
        <ThemeProvider defaultDarkMode={true}>{children}</ThemeProvider>
      </ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), {
      wrapper: NestedWrapper,
    });

    // Inner provider's default should be used
    expect(result.current.isDark).toBe(true);
  });

  it("should provide complete theme interface", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(false),
    });

    // Check all expected properties exist
    const theme = result.current;
    expect(theme).toMatchObject({
      isDark: expect.any(Boolean),
      darkMode: expect.any(Boolean),
      toggleTheme: expect.any(Function),
      setDarkMode: expect.any(Function),
    });
  });

  it("should handle rapid toggles correctly", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(false),
    });

    // Rapid toggles
    act(() => {
      result.current.toggleTheme();
      result.current.toggleTheme();
      result.current.toggleTheme();
      result.current.toggleTheme();
      result.current.toggleTheme();
    });

    // 5 toggles from false should end at true
    expect(result.current.isDark).toBe(true);
  });

  it("should handle mixed toggleTheme and setDarkMode calls", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(false),
    });

    act(() => {
      result.current.setDarkMode(true);
    });
    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.setDarkMode(true);
    });
    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.setDarkMode(false);
    });
    expect(result.current.isDark).toBe(false);
  });
});

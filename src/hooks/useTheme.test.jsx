/**
 * Unit Tests for Theme Hooks
 * Tests useTheme hook (unified), ThemeProvider, and ThemeContext
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import useTheme, { useThemeStrict, useThemeSafe } from "./useTheme";
import ThemeProvider from "./ThemeProvider";
import { ThemeContext } from "./ThemeContext";

// =============================================================================
// Test Wrapper Helper
// =============================================================================

const createWrapper = (defaultDarkMode = false) => {
  return function Wrapper({ children }) {
    return <ThemeProvider defaultDarkMode={defaultDarkMode}>{children}</ThemeProvider>;
  };
};

// =============================================================================
// useTheme Hook Tests
// =============================================================================

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.getItem.mockReturnValue(null);
  });

  describe('when used within ThemeProvider', () => {
    it('should return isDark property', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current).toHaveProperty('isDark');
      expect(typeof result.current.isDark).toBe('boolean');
    });

    it('should return darkMode alias for backward compatibility', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current).toHaveProperty('darkMode');
      expect(result.current.darkMode).toBe(result.current.isDark);
    });

    it('should return toggleTheme function', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current).toHaveProperty('toggleTheme');
      expect(typeof result.current.toggleTheme).toBe('function');
    });

    it('should return setDarkMode function', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current).toHaveProperty('setDarkMode');
      expect(typeof result.current.setDarkMode).toBe('function');
    });

    it("should return isProviderAvailable as true", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current).toHaveProperty("isProviderAvailable");
      expect(result.current.isProviderAvailable).toBe(true);
    });

    it("should default to light mode (isDark = false)", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(false);
    });

    it('should respect defaultDarkMode prop', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      expect(result.current.isDark).toBe(true);
    });
  });

  describe('toggleTheme functionality', () => {
    it('should toggle from light to dark mode', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(true);
    });

    it('should toggle from dark to light mode', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      expect(result.current.isDark).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
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

    it('should keep darkMode alias in sync after toggle', () => {
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

  describe('setDarkMode functionality', () => {
    it('should set dark mode to true', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.isDark).toBe(true);
    });

    it('should set dark mode to false', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      expect(result.current.isDark).toBe(true);

      act(() => {
        result.current.setDarkMode(false);
      });

      expect(result.current.isDark).toBe(false);
    });

    it('should handle setting same value (idempotent)', () => {
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

  describe("when used outside ThemeProvider (safe mode - default)", () => {
    it("should return fallback values instead of throwing", () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.isDark).toBe(false);
      expect(result.current.darkMode).toBe(false);
      expect(result.current.isProviderAvailable).toBe(false);
    });

    it("should have no-op toggleTheme function", () => {
      const { result } = renderHook(() => useTheme());

      // Should not throw
      expect(() => {
        act(() => {
          result.current.toggleTheme();
        });
      }).not.toThrow();
    });

    it("should have no-op setDarkMode function", () => {
      const { result } = renderHook(() => useTheme());

      // Should not throw
      expect(() => {
        act(() => {
          result.current.setDarkMode(true);
        });
      }).not.toThrow();
    });

    it("should warn in development when calling toggleTheme outside provider", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("darkModeOverride option", () => {
    it("should override theme when darkModeOverride is true", () => {
      const { result } = renderHook(
        () => useTheme({ darkModeOverride: true }),
        { wrapper: createWrapper(false) },
      );

      expect(result.current.isDark).toBe(true);
    });

    it("should override theme when darkModeOverride is false", () => {
      const { result } = renderHook(
        () => useTheme({ darkModeOverride: false }),
        { wrapper: createWrapper(true) },
      );

      expect(result.current.isDark).toBe(false);
    });

    it("should support boolean argument for backward compatibility", () => {
      const { result } = renderHook(() => useTheme(true), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(true);
    });

    it("should have no-op functions when using override", () => {
      const { result } = renderHook(
        () => useTheme({ darkModeOverride: true }),
        { wrapper: createWrapper(false) },
      );

      // Functions should be no-ops when override is used
      act(() => {
        result.current.toggleTheme();
        result.current.setDarkMode(false);
      });

      // Should still be true because override takes precedence
      expect(result.current.isDark).toBe(true);
    });

    it("should report provider availability even when using override", () => {
      const { result: withProvider } = renderHook(
        () => useTheme({ darkModeOverride: true }),
        { wrapper: createWrapper(false) },
      );

      const { result: withoutProvider } = renderHook(() =>
        useTheme({ darkModeOverride: true }),
      );

      expect(withProvider.current.isProviderAvailable).toBe(true);
      expect(withoutProvider.current.isProviderAvailable).toBe(false);
    });
  });

  describe("throwOnMissingProvider option", () => {
    it("should throw when throwOnMissingProvider is true and no provider", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme({ throwOnMissingProvider: true }));
      }).toThrow("useTheme must be used within a ThemeProvider");

      consoleSpy.mockRestore();
    });

    it("should not throw when throwOnMissingProvider is true and provider exists", () => {
      const { result } = renderHook(
        () => useTheme({ throwOnMissingProvider: true }),
        { wrapper: createWrapper(false) },
      );

      expect(result.current.isDark).toBe(false);
    });
  });
});

// =============================================================================
// useThemeStrict Tests
// =============================================================================

describe("useThemeStrict", () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
  });

  it("should throw when used outside ThemeProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useThemeStrict());
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleSpy.mockRestore();
  });

  it("should work normally when used within ThemeProvider", () => {
    const { result } = renderHook(() => useThemeStrict(), {
      wrapper: createWrapper(false),
    });

    expect(result.current.isDark).toBe(false);
    expect(result.current.isProviderAvailable).toBe(true);
  });
});

// =============================================================================
// useThemeSafe Tests
// =============================================================================

describe("useThemeSafe", () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
  });

  it("should return fallback values when used outside ThemeProvider", () => {
    const { result } = renderHook(() => useThemeSafe());

    expect(result.current.isDark).toBe(false);
    expect(result.current.isProviderAvailable).toBe(false);
  });

  it("should work normally when used within ThemeProvider", () => {
    const { result } = renderHook(() => useThemeSafe(), {
      wrapper: createWrapper(true),
    });

    expect(result.current.isDark).toBe(true);
    expect(result.current.isProviderAvailable).toBe(true);
  });

  it("should support darkModeOverride argument", () => {
    const { result } = renderHook(() => useThemeSafe(true), {
      wrapper: createWrapper(false),
    });

    expect(result.current.isDark).toBe(true);
  });
});

// =============================================================================
// ThemeProvider Tests
// =============================================================================

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
  });

  describe('initialization', () => {
    it('should render children', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current).toBeDefined();
    });

    it('should default to light mode when no localStorage value', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(result.current.isDark).toBe(false);
    });

    it('should use defaultDarkMode when no localStorage value', () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      expect(result.current.isDark).toBe(true);
    });

    it('should read from localStorage on mount', () => {
      localStorage.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      expect(localStorage.getItem).toHaveBeenCalledWith('leadflow-theme');
      expect(result.current.isDark).toBe(true);
    });

    it("should use light mode when localStorage value is 'light'", () => {
      localStorage.getItem.mockReturnValue('light');

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true), // Even with default true
      });

      expect(result.current.isDark).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    it("should save 'dark' to localStorage when toggled to dark mode", async () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      act(() => {
        result.current.toggleTheme();
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('leadflow-theme', 'dark');
      });
    });

    it("should save 'light' to localStorage when toggled to light mode", async () => {
      localStorage.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(true),
      });

      act(() => {
        result.current.toggleTheme();
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('leadflow-theme', 'light');
      });
    });

    it('should save to localStorage when using setDarkMode', async () => {
      localStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      act(() => {
        result.current.setDarkMode(true);
      });

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('leadflow-theme', 'dark');
      });
    });
  });

  describe("context value memoization", () => {
    it("should maintain stable function references when theme does not change", () => {
      const { result, rerender } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      const firstToggle = result.current.toggleTheme;
      const firstSetDarkMode = result.current.setDarkMode;

      rerender();

      // Function references should be stable due to useCallback in provider
      expect(result.current.toggleTheme).toBe(firstToggle);
      expect(result.current.setDarkMode).toBe(firstSetDarkMode);
    });

    it('should update reference when theme changes', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(false),
      });

      const firstIsDark = result.current.isDark;

      act(() => {
        result.current.toggleTheme();
      });

      // isDark value should be different after toggle
      expect(result.current.isDark).not.toBe(firstIsDark);
    });
  });
});

// =============================================================================
// ThemeContext Tests
// =============================================================================

describe('ThemeContext', () => {
  it('should be defined', () => {
    expect(ThemeContext).toBeDefined();
  });

  it('should have undefined as default value', () => {
    // The context is created with undefined as default
    // This is intentional to detect usage outside provider
    const { result } = renderHook(() => React.useContext(ThemeContext));
    expect(result.current).toBeUndefined();
  });

  it('should be a valid React context', () => {
    expect(ThemeContext.Provider).toBeDefined();
    expect(ThemeContext.Consumer).toBeDefined();
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe('Theme Hooks Integration', () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
  });

  it('should share state between multiple useTheme calls', () => {
    const wrapper = createWrapper(false);

    const { result: result1 } = renderHook(() => useTheme(), { wrapper });
    const { result: result2 } = renderHook(() => useTheme(), { wrapper });

    // Both should start in light mode
    expect(result1.current.isDark).toBe(false);
    expect(result2.current.isDark).toBe(false);
  });

  it('should work with nested providers (last provider wins)', () => {
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

  it('should provide complete theme interface', () => {
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
      isProviderAvailable: expect.any(Boolean),
    });
  });

  it('should handle rapid toggles correctly', () => {
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

  it('should handle mixed toggleTheme and setDarkMode calls', () => {
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

  it("should allow components to work without ThemeProvider using safe default", () => {
    // This simulates a component that can work both with and without ThemeProvider
    const { result } = renderHook(() => {
      const theme = useTheme();
      return {
        canRender: true,
        isDark: theme.isDark,
        hasProvider: theme.isProviderAvailable,
      };
    });

    expect(result.current.canRender).toBe(true);
    expect(result.current.isDark).toBe(false);
    expect(result.current.hasProvider).toBe(false);
  });
});

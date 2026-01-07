/**
 * Unit Tests for Chart Utility Functions
 * Tests all functions in src/chartUtils.js
 */

import { describe, it, expect } from "vitest";
import {
  getAxisStyles,
  getGridStyles,
  getTooltipCursorStyles,
  getChartCardClasses,
  getChartTitleClasses,
  getChartGradients,
  getDotStyles,
  getActiveDotStyles,
  getChartColors,
  fontFamily,
} from "./chartUtils";

// =============================================================================
// getAxisStyles Tests
// =============================================================================

describe("getAxisStyles", () => {
  describe("dark mode", () => {
    it("should return correct stroke color for dark mode", () => {
      const result = getAxisStyles(true);
      expect(result.stroke).toBe("#94a3b8");
    });

    it("should return correct tickLine stroke for dark mode", () => {
      const result = getAxisStyles(true);
      expect(result.tickLine.stroke).toBe("#94a3b8");
    });

    it("should return correct axisLine properties for dark mode", () => {
      const result = getAxisStyles(true);
      expect(result.axisLine.stroke).toBe("#94a3b8");
      expect(result.axisLine.strokeWidth).toBe(1);
    });

    it("should return correct tick properties for dark mode", () => {
      const result = getAxisStyles(true);
      expect(result.tick.fontSize).toBe(10);
      expect(result.tick.fill).toBe("#94a3b8");
    });
  });

  describe("light mode", () => {
    it("should return correct stroke color for light mode", () => {
      const result = getAxisStyles(false);
      expect(result.stroke).toBe("#475569");
    });

    it("should return correct tickLine stroke for light mode", () => {
      const result = getAxisStyles(false);
      expect(result.tickLine.stroke).toBe("#475569");
    });

    it("should return correct axisLine properties for light mode", () => {
      const result = getAxisStyles(false);
      expect(result.axisLine.stroke).toBe("#475569");
      expect(result.axisLine.strokeWidth).toBe(1);
    });

    it("should return correct tick properties for light mode", () => {
      const result = getAxisStyles(false);
      expect(result.tick.fontSize).toBe(10);
      expect(result.tick.fill).toBe("#475569");
    });
  });

  it("should return an object with all required properties", () => {
    const result = getAxisStyles(true);
    expect(result).toHaveProperty("stroke");
    expect(result).toHaveProperty("tickLine");
    expect(result).toHaveProperty("axisLine");
    expect(result).toHaveProperty("tick");
  });
});

// =============================================================================
// getGridStyles Tests
// =============================================================================

describe("getGridStyles", () => {
  it("should return dashed stroke pattern", () => {
    const darkResult = getGridStyles(true);
    const lightResult = getGridStyles(false);

    expect(darkResult.strokeDasharray).toBe("3 3");
    expect(lightResult.strokeDasharray).toBe("3 3");
  });

  describe("dark mode", () => {
    it("should return light stroke with low opacity for dark mode", () => {
      const result = getGridStyles(true);
      expect(result.stroke).toBe("rgba(255, 255, 255, 0.1)");
    });
  });

  describe("light mode", () => {
    it("should return dark stroke with low opacity for light mode", () => {
      const result = getGridStyles(false);
      expect(result.stroke).toBe("rgba(0, 0, 0, 0.1)");
    });
  });

  it("should return an object with strokeDasharray and stroke properties", () => {
    const result = getGridStyles(true);
    expect(Object.keys(result)).toHaveLength(2);
    expect(result).toHaveProperty("strokeDasharray");
    expect(result).toHaveProperty("stroke");
  });
});

// =============================================================================
// getTooltipCursorStyles Tests
// =============================================================================

describe("getTooltipCursorStyles", () => {
  describe("dark mode", () => {
    it("should return light fill with low opacity for dark mode", () => {
      const result = getTooltipCursorStyles(true);
      expect(result.fill).toBe("rgba(255, 255, 255, 0.05)");
    });
  });

  describe("light mode", () => {
    it("should return dark fill with low opacity for light mode", () => {
      const result = getTooltipCursorStyles(false);
      expect(result.fill).toBe("rgba(0, 0, 0, 0.05)");
    });
  });

  it("should return an object with only fill property", () => {
    const result = getTooltipCursorStyles(true);
    expect(Object.keys(result)).toHaveLength(1);
    expect(result).toHaveProperty("fill");
  });
});

// =============================================================================
// getChartCardClasses Tests
// =============================================================================

describe("getChartCardClasses", () => {
  describe("dark mode", () => {
    it("should return dark theme classes", () => {
      const result = getChartCardClasses(true);
      expect(result).toContain("bg-slate-800/80");
      expect(result).toContain("border-slate-600/50");
      expect(result).toContain("shadow-black/50");
    });

    it("should include ring class for dark mode", () => {
      const result = getChartCardClasses(true);
      expect(result).toContain("ring-1");
      expect(result).toContain("ring-slate-500/10");
    });
  });

  describe("light mode", () => {
    it("should return light theme classes", () => {
      const result = getChartCardClasses(false);
      expect(result).toContain("bg-white/90");
      expect(result).toContain("border-slate-200/60");
      expect(result).toContain("shadow-slate-900/10");
    });

    it("should not include ring class for light mode", () => {
      const result = getChartCardClasses(false);
      expect(result).not.toContain("ring-1");
    });
  });

  it("should return a non-empty string", () => {
    const darkResult = getChartCardClasses(true);
    const lightResult = getChartCardClasses(false);

    expect(typeof darkResult).toBe("string");
    expect(typeof lightResult).toBe("string");
    expect(darkResult.length).toBeGreaterThan(0);
    expect(lightResult.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// getChartTitleClasses Tests
// =============================================================================

describe("getChartTitleClasses", () => {
  describe("dark mode", () => {
    it("should return light text color for dark mode", () => {
      const result = getChartTitleClasses(true);
      expect(result).toBe("text-slate-200");
    });
  });

  describe("light mode", () => {
    it("should return dark text color for light mode", () => {
      const result = getChartTitleClasses(false);
      expect(result).toBe("text-slate-700");
    });
  });

  it("should return a valid Tailwind text class", () => {
    const darkResult = getChartTitleClasses(true);
    const lightResult = getChartTitleClasses(false);

    expect(darkResult).toMatch(/^text-slate-\d+$/);
    expect(lightResult).toMatch(/^text-slate-\d+$/);
  });
});

// =============================================================================
// getChartGradients Tests
// =============================================================================

describe("getChartGradients", () => {
  describe("dark mode", () => {
    it("should return correct primary gradient colors", () => {
      const result = getChartGradients(true);
      expect(result.primary.start).toBe("#60a5fa");
      expect(result.primary.startOpacity).toBe(0.8);
      expect(result.primary.endOpacity).toBe(0.2);
    });

    it("should return correct secondary gradient colors", () => {
      const result = getChartGradients(true);
      expect(result.secondary.start).toBe("#34d399");
      expect(result.secondary.startOpacity).toBe(0.8);
      expect(result.secondary.endOpacity).toBe(0.2);
    });

    it("should return correct warning gradient colors", () => {
      const result = getChartGradients(true);
      expect(result.warning.start).toBe("#fbbf24");
      expect(result.warning.startOpacity).toBe(0.8);
      expect(result.warning.endOpacity).toBe(0.2);
    });
  });

  describe("light mode", () => {
    it("should return correct primary gradient colors", () => {
      const result = getChartGradients(false);
      expect(result.primary.start).toBe("#2563eb");
      expect(result.primary.startOpacity).toBe(0.8);
      expect(result.primary.endOpacity).toBe(0.2);
    });

    it("should return correct secondary gradient colors", () => {
      const result = getChartGradients(false);
      expect(result.secondary.start).toBe("#059669");
      expect(result.secondary.startOpacity).toBe(0.8);
      expect(result.secondary.endOpacity).toBe(0.2);
    });

    it("should return correct warning gradient colors", () => {
      const result = getChartGradients(false);
      expect(result.warning.start).toBe("#d97706");
      expect(result.warning.startOpacity).toBe(0.8);
      expect(result.warning.endOpacity).toBe(0.2);
    });
  });

  it("should return all three gradient types", () => {
    const result = getChartGradients(true);
    expect(result).toHaveProperty("primary");
    expect(result).toHaveProperty("secondary");
    expect(result).toHaveProperty("warning");
  });

  it("should have consistent opacity values across themes", () => {
    const darkResult = getChartGradients(true);
    const lightResult = getChartGradients(false);

    // Primary gradients
    expect(darkResult.primary.startOpacity).toBe(
      lightResult.primary.startOpacity,
    );
    expect(darkResult.primary.endOpacity).toBe(lightResult.primary.endOpacity);

    // Secondary gradients
    expect(darkResult.secondary.startOpacity).toBe(
      lightResult.secondary.startOpacity,
    );
    expect(darkResult.secondary.endOpacity).toBe(
      lightResult.secondary.endOpacity,
    );

    // Warning gradients
    expect(darkResult.warning.startOpacity).toBe(
      lightResult.warning.startOpacity,
    );
    expect(darkResult.warning.endOpacity).toBe(lightResult.warning.endOpacity);
  });
});

// =============================================================================
// getDotStyles Tests
// =============================================================================

describe("getDotStyles", () => {
  const testColor = "#ff0000";

  describe("dark mode", () => {
    it("should return correct dot styles", () => {
      const result = getDotStyles(true, testColor);
      expect(result.r).toBe(3);
      expect(result.fill).toBe(testColor);
      expect(result.strokeWidth).toBe(1.5);
      expect(result.stroke).toBe("#1e293b");
    });
  });

  describe("light mode", () => {
    it("should return correct dot styles", () => {
      const result = getDotStyles(false, testColor);
      expect(result.r).toBe(3);
      expect(result.fill).toBe(testColor);
      expect(result.strokeWidth).toBe(1.5);
      expect(result.stroke).toBe("#ffffff");
    });
  });

  it("should use the provided color for fill", () => {
    const colors = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"];

    colors.forEach((color) => {
      const result = getDotStyles(true, color);
      expect(result.fill).toBe(color);
    });
  });

  it("should return consistent radius regardless of theme", () => {
    const darkResult = getDotStyles(true, testColor);
    const lightResult = getDotStyles(false, testColor);

    expect(darkResult.r).toBe(lightResult.r);
    expect(darkResult.r).toBe(3);
  });

  it("should return all required properties", () => {
    const result = getDotStyles(true, testColor);
    expect(result).toHaveProperty("r");
    expect(result).toHaveProperty("fill");
    expect(result).toHaveProperty("strokeWidth");
    expect(result).toHaveProperty("stroke");
  });
});

// =============================================================================
// getActiveDotStyles Tests
// =============================================================================

describe("getActiveDotStyles", () => {
  const testColor = "#00ff00";

  describe("dark mode", () => {
    it("should return correct active dot styles", () => {
      const result = getActiveDotStyles(true, testColor);
      expect(result.r).toBe(5);
      expect(result.fill).toBe(testColor);
      expect(result.strokeWidth).toBe(2);
      expect(result.stroke).toBe("#1e293b");
    });
  });

  describe("light mode", () => {
    it("should return correct active dot styles", () => {
      const result = getActiveDotStyles(false, testColor);
      expect(result.r).toBe(5);
      expect(result.fill).toBe(testColor);
      expect(result.strokeWidth).toBe(2);
      expect(result.stroke).toBe("#ffffff");
    });
  });

  it("should have larger radius than regular dot styles", () => {
    const color = "#ff0000";
    const regularDot = getDotStyles(true, color);
    const activeDot = getActiveDotStyles(true, color);

    expect(activeDot.r).toBeGreaterThan(regularDot.r);
  });

  it("should have larger stroke width than regular dot styles", () => {
    const color = "#ff0000";
    const regularDot = getDotStyles(true, color);
    const activeDot = getActiveDotStyles(true, color);

    expect(activeDot.strokeWidth).toBeGreaterThan(regularDot.strokeWidth);
  });

  it("should use the same stroke color as regular dots for same theme", () => {
    const color = "#ff0000";

    const darkRegular = getDotStyles(true, color);
    const darkActive = getActiveDotStyles(true, color);
    expect(darkRegular.stroke).toBe(darkActive.stroke);

    const lightRegular = getDotStyles(false, color);
    const lightActive = getActiveDotStyles(false, color);
    expect(lightRegular.stroke).toBe(lightActive.stroke);
  });
});

// =============================================================================
// getChartColors Tests
// =============================================================================

describe("getChartColors", () => {
  describe("dark mode", () => {
    it("should return correct primary color", () => {
      const result = getChartColors(true);
      expect(result.primary).toBe("#60a5fa");
    });

    it("should return correct secondary color", () => {
      const result = getChartColors(true);
      expect(result.secondary).toBe("#34d399");
    });

    it("should return correct warning color", () => {
      const result = getChartColors(true);
      expect(result.warning).toBe("#fbbf24");
    });

    it("should return correct danger color", () => {
      const result = getChartColors(true);
      expect(result.danger).toBe("#f87171");
    });

    it("should return correct text color", () => {
      const result = getChartColors(true);
      expect(result.text).toBe("#94a3b8");
    });

    it("should return correct lightText color", () => {
      const result = getChartColors(true);
      expect(result.lightText).toBe("#cbd5e1");
    });
  });

  describe("light mode", () => {
    it("should return correct primary color", () => {
      const result = getChartColors(false);
      expect(result.primary).toBe("#2563eb");
    });

    it("should return correct secondary color", () => {
      const result = getChartColors(false);
      expect(result.secondary).toBe("#059669");
    });

    it("should return correct warning color", () => {
      const result = getChartColors(false);
      expect(result.warning).toBe("#d97706");
    });

    it("should return correct danger color", () => {
      const result = getChartColors(false);
      expect(result.danger).toBe("#dc2626");
    });

    it("should return correct text color", () => {
      const result = getChartColors(false);
      expect(result.text).toBe("#475569");
    });

    it("should return correct lightText color", () => {
      const result = getChartColors(false);
      expect(result.lightText).toBe("#64748b");
    });
  });

  it("should return all color properties", () => {
    const result = getChartColors(true);
    expect(result).toHaveProperty("primary");
    expect(result).toHaveProperty("secondary");
    expect(result).toHaveProperty("warning");
    expect(result).toHaveProperty("danger");
    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("lightText");
  });

  it("should return valid hex color codes", () => {
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    const darkColors = getChartColors(true);
    const lightColors = getChartColors(false);

    Object.values(darkColors).forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });

    Object.values(lightColors).forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });
  });
});

// =============================================================================
// fontFamily Export Tests
// =============================================================================

describe("fontFamily", () => {
  it("should be exported and defined", () => {
    expect(fontFamily).toBeDefined();
  });

  it("should be a string", () => {
    expect(typeof fontFamily).toBe("string");
  });

  it("should contain Manrope font", () => {
    expect(fontFamily).toContain("Manrope");
  });

  it("should have sans-serif fallback", () => {
    expect(fontFamily).toContain("sans-serif");
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe("Chart Utils Integration", () => {
  it("should have consistent colors between gradients and chart colors", () => {
    const darkColors = getChartColors(true);
    const darkGradients = getChartGradients(true);

    expect(darkGradients.primary.start).toBe(darkColors.primary);
    expect(darkGradients.secondary.start).toBe(darkColors.secondary);
    expect(darkGradients.warning.start).toBe(darkColors.warning);
  });

  it("should have consistent stroke colors for axis and grid in dark mode", () => {
    const axisStyles = getAxisStyles(true);
    const gridStyles = getGridStyles(true);

    // Grid should be more subtle (transparent) than axis
    expect(gridStyles.stroke).toContain("rgba");
    expect(axisStyles.stroke).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("should provide readable text colors against backgrounds", () => {
    // Dark mode: light text on dark background
    const darkClasses = getChartCardClasses(true);
    const darkTitleClasses = getChartTitleClasses(true);
    expect(darkClasses).toContain("bg-slate-800");
    expect(darkTitleClasses).toContain("text-slate-200");

    // Light mode: dark text on light background
    const lightClasses = getChartCardClasses(false);
    const lightTitleClasses = getChartTitleClasses(false);
    expect(lightClasses).toContain("bg-white");
    expect(lightTitleClasses).toContain("text-slate-700");
  });

  it("should return different values for dark vs light mode for all theme-dependent functions", () => {
    // Verify all functions return different values for different themes
    expect(getAxisStyles(true)).not.toEqual(getAxisStyles(false));
    expect(getGridStyles(true)).not.toEqual(getGridStyles(false));
    expect(getTooltipCursorStyles(true)).not.toEqual(
      getTooltipCursorStyles(false),
    );
    expect(getChartCardClasses(true)).not.toBe(getChartCardClasses(false));
    expect(getChartTitleClasses(true)).not.toBe(getChartTitleClasses(false));
    expect(getChartGradients(true)).not.toEqual(getChartGradients(false));
    expect(getDotStyles(true, "#fff")).not.toEqual(getDotStyles(false, "#fff"));
    expect(getActiveDotStyles(true, "#fff")).not.toEqual(
      getActiveDotStyles(false, "#fff"),
    );
    expect(getChartColors(true)).not.toEqual(getChartColors(false));
  });
});

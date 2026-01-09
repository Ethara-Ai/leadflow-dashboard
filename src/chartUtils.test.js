/**
 * Unit Tests for Chart Utility Functions
 * Tests chart styling utilities for dark and light themes
 */

import { describe, it, expect } from 'vitest';
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
} from './chartUtils.js';

// =============================================================================
// Axis Styles Tests
// =============================================================================

describe('getAxisStyles', () => {
  describe('dark mode', () => {
    it('should return correct stroke color for dark mode', () => {
      const styles = getAxisStyles(true);
      expect(styles.stroke).toBe('#a3a3a3');
    });

    it('should return correct tickLine stroke for dark mode', () => {
      const styles = getAxisStyles(true);
      expect(styles.tickLine.stroke).toBe('#a3a3a3');
    });

    it('should return correct axisLine stroke for dark mode', () => {
      const styles = getAxisStyles(true);
      expect(styles.axisLine.stroke).toBe('#525252');
    });

    it('should return correct tick fill for dark mode', () => {
      const styles = getAxisStyles(true);
      expect(styles.tick.fill).toBe('#a3a3a3');
    });
  });

  describe('light mode', () => {
    it('should return correct stroke color for light mode', () => {
      const styles = getAxisStyles(false);
      expect(styles.stroke).toBe('#475569');
    });

    it('should return correct tickLine stroke for light mode', () => {
      const styles = getAxisStyles(false);
      expect(styles.tickLine.stroke).toBe('#475569');
    });

    it('should return correct axisLine stroke for light mode', () => {
      const styles = getAxisStyles(false);
      expect(styles.axisLine.stroke).toBe('#475569');
    });

    it('should return correct tick fill for light mode', () => {
      const styles = getAxisStyles(false);
      expect(styles.tick.fill).toBe('#475569');
    });
  });

  describe('common properties', () => {
    it('should have axisLine strokeWidth of 1', () => {
      expect(getAxisStyles(true).axisLine.strokeWidth).toBe(1);
      expect(getAxisStyles(false).axisLine.strokeWidth).toBe(1);
    });

    it('should have tick fontSize of 10', () => {
      expect(getAxisStyles(true).tick.fontSize).toBe(10);
      expect(getAxisStyles(false).tick.fontSize).toBe(10);
    });
  });
});

// =============================================================================
// Grid Styles Tests
// =============================================================================

describe('getGridStyles', () => {
  it('should return correct strokeDasharray', () => {
    expect(getGridStyles(true).strokeDasharray).toBe('3 3');
    expect(getGridStyles(false).strokeDasharray).toBe('3 3');
  });

  it('should return correct stroke for dark mode', () => {
    const styles = getGridStyles(true);
    expect(styles.stroke).toBe('rgba(255, 255, 255, 0.08)');
  });

  it('should return correct stroke for light mode', () => {
    const styles = getGridStyles(false);
    expect(styles.stroke).toBe('rgba(0, 0, 0, 0.1)');
  });
});

// =============================================================================
// Tooltip Cursor Styles Tests
// =============================================================================

describe('getTooltipCursorStyles', () => {
  it('should return correct fill for dark mode', () => {
    const styles = getTooltipCursorStyles(true);
    expect(styles.fill).toBe('rgba(255, 255, 255, 0.04)');
  });

  it('should return correct fill for light mode', () => {
    const styles = getTooltipCursorStyles(false);
    expect(styles.fill).toBe('rgba(0, 0, 0, 0.05)');
  });
});

// =============================================================================
// Chart Card Classes Tests
// =============================================================================

describe('getChartCardClasses', () => {
  describe('dark mode', () => {
    it('should include dark background class', () => {
      const classes = getChartCardClasses(true);
      expect(classes).toContain('bg-neutral-900/90');
    });

    it('should include dark border class', () => {
      const classes = getChartCardClasses(true);
      expect(classes).toContain('border-neutral-700/50');
    });

    it('should include dark shadow class', () => {
      const classes = getChartCardClasses(true);
      expect(classes).toContain('shadow-black/60');
    });

    it('should include ring class for dark mode', () => {
      const classes = getChartCardClasses(true);
      expect(classes).toContain('ring-1');
      expect(classes).toContain('ring-neutral-600/20');
    });
  });

  describe('light mode', () => {
    it('should include light background class', () => {
      const classes = getChartCardClasses(false);
      expect(classes).toContain('bg-white/90');
    });

    it('should include light border class', () => {
      const classes = getChartCardClasses(false);
      expect(classes).toContain('border-slate-200/60');
    });

    it('should include light shadow class', () => {
      const classes = getChartCardClasses(false);
      expect(classes).toContain('shadow-slate-900/10');
    });
  });

  it('should return a string', () => {
    expect(typeof getChartCardClasses(true)).toBe('string');
    expect(typeof getChartCardClasses(false)).toBe('string');
  });
});

// =============================================================================
// Chart Title Classes Tests
// =============================================================================

describe('getChartTitleClasses', () => {
  it('should return dark text class for dark mode', () => {
    const classes = getChartTitleClasses(true);
    expect(classes).toBe('text-neutral-100');
  });

  it('should return light text class for light mode', () => {
    const classes = getChartTitleClasses(false);
    expect(classes).toBe('text-slate-700');
  });

  it('should return a string', () => {
    expect(typeof getChartTitleClasses(true)).toBe('string');
    expect(typeof getChartTitleClasses(false)).toBe('string');
  });
});

// =============================================================================
// Chart Gradients Tests
// =============================================================================

describe('getChartGradients', () => {
  describe('primary gradient', () => {
    it('should return correct primary start color for dark mode', () => {
      const gradients = getChartGradients(true);
      expect(gradients.primary.start).toBe('#60a5fa');
    });

    it('should return correct primary start color for light mode', () => {
      const gradients = getChartGradients(false);
      expect(gradients.primary.start).toBe('#2563eb');
    });

    it('should have correct opacity values', () => {
      const gradients = getChartGradients(true);
      expect(gradients.primary.startOpacity).toBe(0.8);
      expect(gradients.primary.endOpacity).toBe(0.2);
    });
  });

  describe('secondary gradient', () => {
    it('should return correct secondary start color for dark mode', () => {
      const gradients = getChartGradients(true);
      expect(gradients.secondary.start).toBe('#34d399');
    });

    it('should return correct secondary start color for light mode', () => {
      const gradients = getChartGradients(false);
      expect(gradients.secondary.start).toBe('#059669');
    });

    it('should have correct opacity values', () => {
      const gradients = getChartGradients(false);
      expect(gradients.secondary.startOpacity).toBe(0.8);
      expect(gradients.secondary.endOpacity).toBe(0.2);
    });
  });

  describe('warning gradient', () => {
    it('should return correct warning start color for dark mode', () => {
      const gradients = getChartGradients(true);
      expect(gradients.warning.start).toBe('#fbbf24');
    });

    it('should return correct warning start color for light mode', () => {
      const gradients = getChartGradients(false);
      expect(gradients.warning.start).toBe('#d97706');
    });

    it('should have correct opacity values', () => {
      const gradients = getChartGradients(true);
      expect(gradients.warning.startOpacity).toBe(0.8);
      expect(gradients.warning.endOpacity).toBe(0.2);
    });
  });

  it('should return all three gradient types', () => {
    const gradients = getChartGradients(true);
    expect(gradients).toHaveProperty('primary');
    expect(gradients).toHaveProperty('secondary');
    expect(gradients).toHaveProperty('warning');
  });
});

// =============================================================================
// Dot Styles Tests
// =============================================================================

describe('getDotStyles', () => {
  const testColor = '#ff0000';

  it('should return correct radius', () => {
    const styles = getDotStyles(true, testColor);
    expect(styles.r).toBe(3);
  });

  it('should return the provided fill color', () => {
    const styles = getDotStyles(true, testColor);
    expect(styles.fill).toBe(testColor);
  });

  it('should return correct strokeWidth', () => {
    const styles = getDotStyles(true, testColor);
    expect(styles.strokeWidth).toBe(1.5);
  });

  it('should return correct stroke for dark mode', () => {
    const styles = getDotStyles(true, testColor);
    expect(styles.stroke).toBe('#171717');
  });

  it('should return correct stroke for light mode', () => {
    const styles = getDotStyles(false, testColor);
    expect(styles.stroke).toBe('#ffffff');
  });
});

// =============================================================================
// Active Dot Styles Tests
// =============================================================================

describe('getActiveDotStyles', () => {
  const testColor = '#00ff00';

  it('should return larger radius than regular dots', () => {
    const styles = getActiveDotStyles(true, testColor);
    expect(styles.r).toBe(5);
  });

  it('should return the provided fill color', () => {
    const styles = getActiveDotStyles(true, testColor);
    expect(styles.fill).toBe(testColor);
  });

  it('should return correct strokeWidth', () => {
    const styles = getActiveDotStyles(true, testColor);
    expect(styles.strokeWidth).toBe(2);
  });

  it('should return correct stroke for dark mode', () => {
    const styles = getActiveDotStyles(true, testColor);
    expect(styles.stroke).toBe('#171717');
  });

  it('should return correct stroke for light mode', () => {
    const styles = getActiveDotStyles(false, testColor);
    expect(styles.stroke).toBe('#ffffff');
  });

  it('should have larger radius and strokeWidth than regular dots', () => {
    const regularDot = getDotStyles(true, testColor);
    const activeDot = getActiveDotStyles(true, testColor);

    expect(activeDot.r).toBeGreaterThan(regularDot.r);
    expect(activeDot.strokeWidth).toBeGreaterThan(regularDot.strokeWidth);
  });
});

// =============================================================================
// Chart Colors Tests
// =============================================================================

describe('getChartColors', () => {
  describe('dark mode', () => {
    it('should return correct primary color', () => {
      const colors = getChartColors(true);
      expect(colors.primary).toBe('#60a5fa');
    });

    it('should return correct secondary color', () => {
      const colors = getChartColors(true);
      expect(colors.secondary).toBe('#34d399');
    });

    it('should return correct warning color', () => {
      const colors = getChartColors(true);
      expect(colors.warning).toBe('#fbbf24');
    });

    it('should return correct danger color', () => {
      const colors = getChartColors(true);
      expect(colors.danger).toBe('#f87171');
    });

    it('should return correct text color', () => {
      const colors = getChartColors(true);
      expect(colors.text).toBe('#a3a3a3');
    });

    it('should return correct lightText color', () => {
      const colors = getChartColors(true);
      expect(colors.lightText).toBe('#d4d4d4');
    });
  });

  describe('light mode', () => {
    it('should return correct primary color', () => {
      const colors = getChartColors(false);
      expect(colors.primary).toBe('#2563eb');
    });

    it('should return correct secondary color', () => {
      const colors = getChartColors(false);
      expect(colors.secondary).toBe('#059669');
    });

    it('should return correct warning color', () => {
      const colors = getChartColors(false);
      expect(colors.warning).toBe('#d97706');
    });

    it('should return correct danger color', () => {
      const colors = getChartColors(false);
      expect(colors.danger).toBe('#dc2626');
    });

    it('should return correct text color', () => {
      const colors = getChartColors(false);
      expect(colors.text).toBe('#475569');
    });

    it('should return correct lightText color', () => {
      const colors = getChartColors(false);
      expect(colors.lightText).toBe('#64748b');
    });
  });

  it('should return all expected color keys', () => {
    const colors = getChartColors(true);
    expect(colors).toHaveProperty('primary');
    expect(colors).toHaveProperty('secondary');
    expect(colors).toHaveProperty('warning');
    expect(colors).toHaveProperty('danger');
    expect(colors).toHaveProperty('text');
    expect(colors).toHaveProperty('lightText');
  });
});

// =============================================================================
// Font Family Export Test
// =============================================================================

describe('fontFamily', () => {
  it('should be exported', () => {
    expect(fontFamily).toBeDefined();
  });

  it('should include Manrope font', () => {
    expect(fontFamily).toContain('Manrope');
  });

  it('should include sans-serif fallback', () => {
    expect(fontFamily).toContain('sans-serif');
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe('Theme Consistency', () => {
  it('should have consistent primary colors across utilities', () => {
    const darkColors = getChartColors(true);
    const darkGradients = getChartGradients(true);

    expect(darkColors.primary).toBe(darkGradients.primary.start);
  });

  it('should have consistent secondary colors across utilities', () => {
    const darkColors = getChartColors(true);
    const darkGradients = getChartGradients(true);

    expect(darkColors.secondary).toBe(darkGradients.secondary.start);
  });

  it('should have consistent warning colors across utilities', () => {
    const darkColors = getChartColors(true);
    const darkGradients = getChartGradients(true);

    expect(darkColors.warning).toBe(darkGradients.warning.start);
  });

  it('should have consistent text colors between axis and chart colors', () => {
    const darkAxisStyles = getAxisStyles(true);
    const darkColors = getChartColors(true);

    expect(darkAxisStyles.tick.fill).toBe(darkColors.text);
  });
});

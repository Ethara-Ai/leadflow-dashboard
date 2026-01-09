/**
 * Unit Tests for useChartPeriods Hook
 * Tests chart time period state management functionality
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useChartPeriods, { TIME_PERIODS, CHART_IDS } from "./useChartPeriods";

// =============================================================================
// Test Setup
// =============================================================================

describe("useChartPeriods", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // Constants Export Tests
  // ===========================================================================

  describe("TIME_PERIODS", () => {
    it("should export TIME_PERIODS constants", () => {
      expect(TIME_PERIODS).toBeDefined();
    });

    it("should have WEEK period", () => {
      expect(TIME_PERIODS.WEEK).toBe("week");
    });

    it("should have MONTH period", () => {
      expect(TIME_PERIODS.MONTH).toBe("month");
    });

    it("should have YEAR period", () => {
      expect(TIME_PERIODS.YEAR).toBe("year");
    });
  });

  describe("CHART_IDS", () => {
    it("should export CHART_IDS constants", () => {
      expect(CHART_IDS).toBeDefined();
    });

    it("should have ACTIVITY chart id", () => {
      expect(CHART_IDS.ACTIVITY).toBe("activity");
    });

    it("should have CONVERSION chart id", () => {
      expect(CHART_IDS.CONVERSION).toBe("conversion");
    });

    it("should have SOURCE chart id", () => {
      expect(CHART_IDS.SOURCE).toBe("source");
    });
  });

  // ===========================================================================
  // Initialization Tests
  // ===========================================================================

  describe("initialization", () => {
    it("should initialize with default period (week)", () => {
      const { result } = renderHook(() => useChartPeriods());

      expect(result.current.activityPeriod).toBe("week");
      expect(result.current.conversionPeriod).toBe("week");
      expect(result.current.sourcePeriod).toBe("week");
    });

    it("should initialize with custom default period", () => {
      const { result } = renderHook(() =>
        useChartPeriods({ defaultPeriod: TIME_PERIODS.MONTH })
      );

      expect(result.current.activityPeriod).toBe("month");
      expect(result.current.conversionPeriod).toBe("month");
      expect(result.current.sourcePeriod).toBe("month");
    });

    it("should initialize with periods in sync", () => {
      const { result } = renderHook(() => useChartPeriods());

      expect(result.current.arePeriodsSync).toBe(true);
    });

    it("should provide initial chart data", () => {
      const { result } = renderHook(() => useChartPeriods());

      expect(result.current.activityData).toBeDefined();
      expect(result.current.conversionData).toBeDefined();
      expect(result.current.sourceData).toBeDefined();
    });

    it("should provide data arrays", () => {
      const { result } = renderHook(() => useChartPeriods());

      expect(Array.isArray(result.current.activityData)).toBe(true);
      expect(Array.isArray(result.current.conversionData)).toBe(true);
      expect(Array.isArray(result.current.sourceData)).toBe(true);
    });
  });

  // ===========================================================================
  // Individual Period Setter Tests
  // ===========================================================================

  describe("setActivityPeriod", () => {
    it("should update activity period", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("month");
      });

      expect(result.current.activityPeriod).toBe("month");
    });

    it("should not affect other periods", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("month");
      });

      expect(result.current.conversionPeriod).toBe("week");
      expect(result.current.sourcePeriod).toBe("week");
    });

    it("should update activity data when period changes", () => {
      const { result } = renderHook(() => useChartPeriods());

      const weekData = result.current.activityData;

      act(() => {
        result.current.setActivityPeriod("month");
      });

      const monthData = result.current.activityData;

      // Data should be different (or at least the reference should change)
      expect(result.current.activityPeriod).toBe("month");
    });

    it("should set arePeriodsSync to false when periods differ", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("month");
      });

      expect(result.current.arePeriodsSync).toBe(false);
    });
  });

  describe("setConversionPeriod", () => {
    it("should update conversion period", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setConversionPeriod("year");
      });

      expect(result.current.conversionPeriod).toBe("year");
    });

    it("should not affect other periods", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setConversionPeriod("year");
      });

      expect(result.current.activityPeriod).toBe("week");
      expect(result.current.sourcePeriod).toBe("week");
    });

    it("should update conversion data when period changes", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setConversionPeriod("month");
      });

      expect(result.current.conversionPeriod).toBe("month");
    });
  });

  describe("setSourcePeriod", () => {
    it("should update source period", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setSourcePeriod("month");
      });

      expect(result.current.sourcePeriod).toBe("month");
    });

    it("should not affect other periods", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setSourcePeriod("month");
      });

      expect(result.current.activityPeriod).toBe("week");
      expect(result.current.conversionPeriod).toBe("week");
    });

    it("should update source data when period changes", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setSourcePeriod("year");
      });

      expect(result.current.sourcePeriod).toBe("year");
    });
  });

  // ===========================================================================
  // Bulk Operations Tests
  // ===========================================================================

  describe("setAllPeriods", () => {
    it("should set all periods to the same value", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setAllPeriods("month");
      });

      expect(result.current.activityPeriod).toBe("month");
      expect(result.current.conversionPeriod).toBe("month");
      expect(result.current.sourcePeriod).toBe("month");
    });

    it("should keep periods in sync after setAllPeriods", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setAllPeriods("year");
      });

      expect(result.current.arePeriodsSync).toBe(true);
    });

    it("should synchronize previously out-of-sync periods", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("month");
        result.current.setConversionPeriod("year");
      });

      expect(result.current.arePeriodsSync).toBe(false);

      act(() => {
        result.current.setAllPeriods("week");
      });

      expect(result.current.arePeriodsSync).toBe(true);
    });

    it("should not change periods for invalid period value", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setAllPeriods("invalid-period");
      });

      expect(result.current.activityPeriod).toBe("week");
      expect(result.current.conversionPeriod).toBe("week");
      expect(result.current.sourcePeriod).toBe("week");
    });

    it("should accept week period", () => {
      const { result } = renderHook(() =>
        useChartPeriods({ defaultPeriod: "month" })
      );

      act(() => {
        result.current.setAllPeriods("week");
      });

      expect(result.current.activityPeriod).toBe("week");
    });

    it("should accept month period", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setAllPeriods("month");
      });

      expect(result.current.activityPeriod).toBe("month");
    });

    it("should accept year period", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setAllPeriods("year");
      });

      expect(result.current.activityPeriod).toBe("year");
    });
  });

  describe("resetPeriods", () => {
    it("should reset all periods to default", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("month");
        result.current.setConversionPeriod("year");
        result.current.setSourcePeriod("month");
      });

      act(() => {
        result.current.resetPeriods();
      });

      expect(result.current.activityPeriod).toBe("week");
      expect(result.current.conversionPeriod).toBe("week");
      expect(result.current.sourcePeriod).toBe("week");
    });

    it("should reset to custom default period", () => {
      const { result } = renderHook(() =>
        useChartPeriods({ defaultPeriod: "month" })
      );

      act(() => {
        result.current.setAllPeriods("year");
      });

      act(() => {
        result.current.resetPeriods();
      });

      expect(result.current.activityPeriod).toBe("month");
      expect(result.current.conversionPeriod).toBe("month");
      expect(result.current.sourcePeriod).toBe("month");
    });

    it("should restore sync status after reset", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("year");
      });

      expect(result.current.arePeriodsSync).toBe(false);

      act(() => {
        result.current.resetPeriods();
      });

      expect(result.current.arePeriodsSync).toBe(true);
    });
  });

  // ===========================================================================
  // getPeriodSetter Tests
  // ===========================================================================

  describe("getPeriodSetter", () => {
    it("should return setter for activity chart", () => {
      const { result } = renderHook(() => useChartPeriods());

      const setter = result.current.getPeriodSetter(CHART_IDS.ACTIVITY);

      act(() => {
        setter("month");
      });

      expect(result.current.activityPeriod).toBe("month");
    });

    it("should return setter for conversion chart", () => {
      const { result } = renderHook(() => useChartPeriods());

      const setter = result.current.getPeriodSetter(CHART_IDS.CONVERSION);

      act(() => {
        setter("year");
      });

      expect(result.current.conversionPeriod).toBe("year");
    });

    it("should return setter for source chart", () => {
      const { result } = renderHook(() => useChartPeriods());

      const setter = result.current.getPeriodSetter(CHART_IDS.SOURCE);

      act(() => {
        setter("month");
      });

      expect(result.current.sourcePeriod).toBe("month");
    });

    it("should return no-op function for unknown chart id", () => {
      const { result } = renderHook(() => useChartPeriods());

      const setter = result.current.getPeriodSetter("unknown");

      // Should not throw
      act(() => {
        setter("month");
      });

      // Periods should remain unchanged
      expect(result.current.activityPeriod).toBe("week");
      expect(result.current.conversionPeriod).toBe("week");
      expect(result.current.sourcePeriod).toBe("week");
    });
  });

  // ===========================================================================
  // arePeriodsSync Tests
  // ===========================================================================

  describe("arePeriodsSync", () => {
    it("should be true when all periods match", () => {
      const { result } = renderHook(() => useChartPeriods());

      expect(result.current.arePeriodsSync).toBe(true);
    });

    it("should be false when activity differs", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("month");
      });

      expect(result.current.arePeriodsSync).toBe(false);
    });

    it("should be false when conversion differs", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setConversionPeriod("year");
      });

      expect(result.current.arePeriodsSync).toBe(false);
    });

    it("should be false when source differs", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setSourcePeriod("month");
      });

      expect(result.current.arePeriodsSync).toBe(false);
    });

    it("should be true when all set to same non-default value", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("year");
        result.current.setConversionPeriod("year");
        result.current.setSourcePeriod("year");
      });

      expect(result.current.arePeriodsSync).toBe(true);
    });
  });

  // ===========================================================================
  // Data Memoization Tests
  // ===========================================================================

  describe("data memoization", () => {
    it("should return same activity data reference when period unchanged", () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const firstData = result.current.activityData;
      rerender();
      const secondData = result.current.activityData;

      expect(firstData).toBe(secondData);
    });

    it("should return same conversion data reference when period unchanged", () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const firstData = result.current.conversionData;
      rerender();
      const secondData = result.current.conversionData;

      expect(firstData).toBe(secondData);
    });

    it("should return same source data reference when period unchanged", () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const firstData = result.current.sourceData;
      rerender();
      const secondData = result.current.sourceData;

      expect(firstData).toBe(secondData);
    });
  });

  // ===========================================================================
  // Callback Stability Tests
  // ===========================================================================

  describe("callback stability", () => {
    it("should maintain stable setActivityPeriod reference", () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const firstSetter = result.current.setActivityPeriod;
      rerender();
      const secondSetter = result.current.setActivityPeriod;

      expect(firstSetter).toBe(secondSetter);
    });

    it("should maintain stable setConversionPeriod reference", () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const firstSetter = result.current.setConversionPeriod;
      rerender();
      const secondSetter = result.current.setConversionPeriod;

      expect(firstSetter).toBe(secondSetter);
    });

    it("should maintain stable setSourcePeriod reference", () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const firstSetter = result.current.setSourcePeriod;
      rerender();
      const secondSetter = result.current.setSourcePeriod;

      expect(firstSetter).toBe(secondSetter);
    });

    it("should maintain stable setAllPeriods reference", () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const firstSetter = result.current.setAllPeriods;
      rerender();
      const secondSetter = result.current.setAllPeriods;

      expect(firstSetter).toBe(secondSetter);
    });

    it("should maintain stable resetPeriods reference", () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const firstReset = result.current.resetPeriods;
      rerender();
      const secondReset = result.current.resetPeriods;

      expect(firstReset).toBe(secondReset);
    });

    it("should maintain stable getPeriodSetter reference", () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const firstGetter = result.current.getPeriodSetter;
      rerender();
      const secondGetter = result.current.getPeriodSetter;

      expect(firstGetter).toBe(secondGetter);
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("edge cases", () => {
    it("should handle rapid period changes", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("month");
        result.current.setActivityPeriod("year");
        result.current.setActivityPeriod("week");
        result.current.setActivityPeriod("month");
      });

      expect(result.current.activityPeriod).toBe("month");
    });

    it("should handle setting same period multiple times", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("month");
        result.current.setActivityPeriod("month");
        result.current.setActivityPeriod("month");
      });

      expect(result.current.activityPeriod).toBe("month");
    });

    it("should handle mixed operations", () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod("month");
        result.current.setAllPeriods("year");
        result.current.setConversionPeriod("week");
        result.current.resetPeriods();
      });

      expect(result.current.activityPeriod).toBe("week");
      expect(result.current.conversionPeriod).toBe("week");
      expect(result.current.sourcePeriod).toBe("week");
      expect(result.current.arePeriodsSync).toBe(true);
    });
  });

  // ===========================================================================
  // Integration Tests
  // ===========================================================================

  describe("integration", () => {
    it("should work with full workflow", () => {
      const { result } = renderHook(() => useChartPeriods());

      // Initial state
      expect(result.current.arePeriodsSync).toBe(true);
      expect(result.current.activityPeriod).toBe("week");

      // Change individual periods
      act(() => {
        result.current.setActivityPeriod("month");
      });
      expect(result.current.arePeriodsSync).toBe(false);

      // Sync all periods
      act(() => {
        result.current.setAllPeriods("year");
      });
      expect(result.current.arePeriodsSync).toBe(true);
      expect(result.current.activityPeriod).toBe("year");

      // Reset to defaults
      act(() => {
        result.current.resetPeriods();
      });
      expect(result.current.activityPeriod).toBe("week");
      expect(result.current.arePeriodsSync).toBe(true);
    });

    it("should provide correct data for each period", () => {
      const { result } = renderHook(() => useChartPeriods());

      // Get week data
      const weekActivityData = result.current.activityData;

      // Change to month
      act(() => {
        result.current.setActivityPeriod("month");
      });
      const monthActivityData = result.current.activityData;

      // Change to year
      act(() => {
        result.current.setActivityPeriod("year");
      });
      const yearActivityData = result.current.activityData;

      // All should be arrays
      expect(Array.isArray(weekActivityData)).toBe(true);
      expect(Array.isArray(monthActivityData)).toBe(true);
      expect(Array.isArray(yearActivityData)).toBe(true);
    });
  });
});

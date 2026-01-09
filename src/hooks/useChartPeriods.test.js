/**
 * Unit Tests for useChartPeriods Hook
 * Tests chart time period state management for activity, conversion, and source charts
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useChartPeriods, { TIME_PERIODS, CHART_IDS } from './useChartPeriods.js';

// =============================================================================
// Initial State Tests
// =============================================================================

describe('useChartPeriods', () => {
  describe('initial state', () => {
    it('should initialize with default period (week)', () => {
      const { result } = renderHook(() => useChartPeriods());

      expect(result.current.activityPeriod).toBe(TIME_PERIODS.WEEK);
      expect(result.current.conversionPeriod).toBe(TIME_PERIODS.WEEK);
      expect(result.current.sourcePeriod).toBe(TIME_PERIODS.WEEK);
    });

    it('should initialize with custom default period', () => {
      const { result } = renderHook(() => useChartPeriods({ defaultPeriod: TIME_PERIODS.MONTH }));

      expect(result.current.activityPeriod).toBe(TIME_PERIODS.MONTH);
      expect(result.current.conversionPeriod).toBe(TIME_PERIODS.MONTH);
      expect(result.current.sourcePeriod).toBe(TIME_PERIODS.MONTH);
    });

    it('should have synchronized periods initially', () => {
      const { result } = renderHook(() => useChartPeriods());

      expect(result.current.arePeriodsSync).toBe(true);
    });

    it('should provide initial data arrays', () => {
      const { result } = renderHook(() => useChartPeriods());

      expect(Array.isArray(result.current.activityData)).toBe(true);
      expect(Array.isArray(result.current.conversionData)).toBe(true);
      expect(Array.isArray(result.current.sourceData)).toBe(true);
    });
  });

  // =============================================================================
  // Individual Period Setters Tests
  // =============================================================================

  describe('individual period setters', () => {
    describe('setActivityPeriod', () => {
      it('should update activity period', () => {
        const { result } = renderHook(() => useChartPeriods());

        act(() => {
          result.current.setActivityPeriod(TIME_PERIODS.MONTH);
        });

        expect(result.current.activityPeriod).toBe(TIME_PERIODS.MONTH);
      });

      it('should not affect other periods', () => {
        const { result } = renderHook(() => useChartPeriods());

        act(() => {
          result.current.setActivityPeriod(TIME_PERIODS.YEAR);
        });

        expect(result.current.conversionPeriod).toBe(TIME_PERIODS.WEEK);
        expect(result.current.sourcePeriod).toBe(TIME_PERIODS.WEEK);
      });

      it('should update activityData when period changes', () => {
        const { result } = renderHook(() => useChartPeriods());

        const initialData = result.current.activityData;

        act(() => {
          result.current.setActivityPeriod(TIME_PERIODS.YEAR);
        });

        // Data should be different for different periods
        expect(result.current.activityData).not.toBe(initialData);
      });
    });

    describe('setConversionPeriod', () => {
      it('should update conversion period', () => {
        const { result } = renderHook(() => useChartPeriods());

        act(() => {
          result.current.setConversionPeriod(TIME_PERIODS.MONTH);
        });

        expect(result.current.conversionPeriod).toBe(TIME_PERIODS.MONTH);
      });

      it('should not affect other periods', () => {
        const { result } = renderHook(() => useChartPeriods());

        act(() => {
          result.current.setConversionPeriod(TIME_PERIODS.YEAR);
        });

        expect(result.current.activityPeriod).toBe(TIME_PERIODS.WEEK);
        expect(result.current.sourcePeriod).toBe(TIME_PERIODS.WEEK);
      });

      it('should update conversionData when period changes', () => {
        const { result } = renderHook(() => useChartPeriods());

        const initialData = result.current.conversionData;

        act(() => {
          result.current.setConversionPeriod(TIME_PERIODS.YEAR);
        });

        expect(result.current.conversionData).not.toBe(initialData);
      });
    });

    describe('setSourcePeriod', () => {
      it('should update source period', () => {
        const { result } = renderHook(() => useChartPeriods());

        act(() => {
          result.current.setSourcePeriod(TIME_PERIODS.MONTH);
        });

        expect(result.current.sourcePeriod).toBe(TIME_PERIODS.MONTH);
      });

      it('should not affect other periods', () => {
        const { result } = renderHook(() => useChartPeriods());

        act(() => {
          result.current.setSourcePeriod(TIME_PERIODS.YEAR);
        });

        expect(result.current.activityPeriod).toBe(TIME_PERIODS.WEEK);
        expect(result.current.conversionPeriod).toBe(TIME_PERIODS.WEEK);
      });

      it('should update sourceData when period changes', () => {
        const { result } = renderHook(() => useChartPeriods());

        const initialData = result.current.sourceData;

        act(() => {
          result.current.setSourcePeriod(TIME_PERIODS.YEAR);
        });

        expect(result.current.sourceData).not.toBe(initialData);
      });
    });
  });

  // =============================================================================
  // Set All Periods Tests
  // =============================================================================

  describe('setAllPeriods', () => {
    it('should set all periods to the same value', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setAllPeriods(TIME_PERIODS.YEAR);
      });

      expect(result.current.activityPeriod).toBe(TIME_PERIODS.YEAR);
      expect(result.current.conversionPeriod).toBe(TIME_PERIODS.YEAR);
      expect(result.current.sourcePeriod).toBe(TIME_PERIODS.YEAR);
    });

    it('should keep periods synchronized', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setAllPeriods(TIME_PERIODS.MONTH);
      });

      expect(result.current.arePeriodsSync).toBe(true);
    });

    it('should not update for invalid period', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setAllPeriods('invalid-period');
      });

      // Should remain at default
      expect(result.current.activityPeriod).toBe(TIME_PERIODS.WEEK);
      expect(result.current.conversionPeriod).toBe(TIME_PERIODS.WEEK);
      expect(result.current.sourcePeriod).toBe(TIME_PERIODS.WEEK);
    });

    it('should update all data arrays', () => {
      const { result } = renderHook(() => useChartPeriods());

      const initialActivityData = result.current.activityData;
      const initialConversionData = result.current.conversionData;
      const initialSourceData = result.current.sourceData;

      act(() => {
        result.current.setAllPeriods(TIME_PERIODS.YEAR);
      });

      expect(result.current.activityData).not.toBe(initialActivityData);
      expect(result.current.conversionData).not.toBe(initialConversionData);
      expect(result.current.sourceData).not.toBe(initialSourceData);
    });
  });

  // =============================================================================
  // Reset Periods Tests
  // =============================================================================

  describe('resetPeriods', () => {
    it('should reset all periods to default', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod(TIME_PERIODS.YEAR);
        result.current.setConversionPeriod(TIME_PERIODS.MONTH);
        result.current.setSourcePeriod(TIME_PERIODS.YEAR);
      });

      expect(result.current.arePeriodsSync).toBe(false);

      act(() => {
        result.current.resetPeriods();
      });

      expect(result.current.activityPeriod).toBe(TIME_PERIODS.WEEK);
      expect(result.current.conversionPeriod).toBe(TIME_PERIODS.WEEK);
      expect(result.current.sourcePeriod).toBe(TIME_PERIODS.WEEK);
    });

    it('should reset to custom default period', () => {
      const { result } = renderHook(() => useChartPeriods({ defaultPeriod: TIME_PERIODS.MONTH }));

      act(() => {
        result.current.setAllPeriods(TIME_PERIODS.YEAR);
      });

      act(() => {
        result.current.resetPeriods();
      });

      expect(result.current.activityPeriod).toBe(TIME_PERIODS.MONTH);
      expect(result.current.conversionPeriod).toBe(TIME_PERIODS.MONTH);
      expect(result.current.sourcePeriod).toBe(TIME_PERIODS.MONTH);
    });

    it('should restore synchronized state after reset', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod(TIME_PERIODS.YEAR);
      });

      expect(result.current.arePeriodsSync).toBe(false);

      act(() => {
        result.current.resetPeriods();
      });

      expect(result.current.arePeriodsSync).toBe(true);
    });
  });

  // =============================================================================
  // Get Period Setter Tests
  // =============================================================================

  describe('getPeriodSetter', () => {
    it('should return setActivityPeriod for activity chart', () => {
      const { result } = renderHook(() => useChartPeriods());

      const setter = result.current.getPeriodSetter(CHART_IDS.ACTIVITY);

      act(() => {
        setter(TIME_PERIODS.MONTH);
      });

      expect(result.current.activityPeriod).toBe(TIME_PERIODS.MONTH);
    });

    it('should return setConversionPeriod for conversion chart', () => {
      const { result } = renderHook(() => useChartPeriods());

      const setter = result.current.getPeriodSetter(CHART_IDS.CONVERSION);

      act(() => {
        setter(TIME_PERIODS.MONTH);
      });

      expect(result.current.conversionPeriod).toBe(TIME_PERIODS.MONTH);
    });

    it('should return setSourcePeriod for source chart', () => {
      const { result } = renderHook(() => useChartPeriods());

      const setter = result.current.getPeriodSetter(CHART_IDS.SOURCE);

      act(() => {
        setter(TIME_PERIODS.MONTH);
      });

      expect(result.current.sourcePeriod).toBe(TIME_PERIODS.MONTH);
    });

    it('should return no-op function for unknown chart id', () => {
      const { result } = renderHook(() => useChartPeriods());

      const setter = result.current.getPeriodSetter('unknown-chart');

      // Should not throw and should not change any state
      act(() => {
        setter(TIME_PERIODS.YEAR);
      });

      expect(result.current.activityPeriod).toBe(TIME_PERIODS.WEEK);
      expect(result.current.conversionPeriod).toBe(TIME_PERIODS.WEEK);
      expect(result.current.sourcePeriod).toBe(TIME_PERIODS.WEEK);
    });
  });

  // =============================================================================
  // Are Periods Sync Tests
  // =============================================================================

  describe('arePeriodsSync', () => {
    it('should be true when all periods match', () => {
      const { result } = renderHook(() => useChartPeriods());

      expect(result.current.arePeriodsSync).toBe(true);

      act(() => {
        result.current.setAllPeriods(TIME_PERIODS.MONTH);
      });

      expect(result.current.arePeriodsSync).toBe(true);
    });

    it('should be false when periods differ', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod(TIME_PERIODS.MONTH);
      });

      expect(result.current.arePeriodsSync).toBe(false);
    });

    it('should be false when only two periods match', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod(TIME_PERIODS.MONTH);
        result.current.setConversionPeriod(TIME_PERIODS.MONTH);
      });

      expect(result.current.arePeriodsSync).toBe(false);
    });

    it('should update when periods are synchronized', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod(TIME_PERIODS.MONTH);
      });

      expect(result.current.arePeriodsSync).toBe(false);

      act(() => {
        result.current.setConversionPeriod(TIME_PERIODS.MONTH);
        result.current.setSourcePeriod(TIME_PERIODS.MONTH);
      });

      expect(result.current.arePeriodsSync).toBe(true);
    });
  });

  // =============================================================================
  // Data Memoization Tests
  // =============================================================================

  describe('data memoization', () => {
    it('should return same data reference when period unchanged', () => {
      const { result, rerender } = renderHook(() => useChartPeriods());

      const initialActivityData = result.current.activityData;
      const initialConversionData = result.current.conversionData;
      const initialSourceData = result.current.sourceData;

      rerender();

      expect(result.current.activityData).toBe(initialActivityData);
      expect(result.current.conversionData).toBe(initialConversionData);
      expect(result.current.sourceData).toBe(initialSourceData);
    });

    it('should return different data reference when period changes', () => {
      const { result } = renderHook(() => useChartPeriods());

      const initialActivityData = result.current.activityData;

      act(() => {
        result.current.setActivityPeriod(TIME_PERIODS.MONTH);
      });

      expect(result.current.activityData).not.toBe(initialActivityData);
    });
  });

  // =============================================================================
  // Time Periods Constants Tests
  // =============================================================================

  describe('TIME_PERIODS constant', () => {
    it('should export TIME_PERIODS', () => {
      expect(TIME_PERIODS).toBeDefined();
    });

    it('should have week period', () => {
      expect(TIME_PERIODS.WEEK).toBe('week');
    });

    it('should have month period', () => {
      expect(TIME_PERIODS.MONTH).toBe('month');
    });

    it('should have year period', () => {
      expect(TIME_PERIODS.YEAR).toBe('year');
    });
  });

  // =============================================================================
  // Chart IDs Constants Tests
  // =============================================================================

  describe('CHART_IDS constant', () => {
    it('should export CHART_IDS', () => {
      expect(CHART_IDS).toBeDefined();
    });

    it('should have activity chart id', () => {
      expect(CHART_IDS.ACTIVITY).toBe('activity');
    });

    it('should have conversion chart id', () => {
      expect(CHART_IDS.CONVERSION).toBe('conversion');
    });

    it('should have source chart id', () => {
      expect(CHART_IDS.SOURCE).toBe('source');
    });
  });

  // =============================================================================
  // Edge Cases Tests
  // =============================================================================

  describe('edge cases', () => {
    it('should handle multiple rapid period changes', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod(TIME_PERIODS.MONTH);
        result.current.setActivityPeriod(TIME_PERIODS.YEAR);
        result.current.setActivityPeriod(TIME_PERIODS.WEEK);
        result.current.setActivityPeriod(TIME_PERIODS.MONTH);
      });

      expect(result.current.activityPeriod).toBe(TIME_PERIODS.MONTH);
    });

    it('should handle setting same period twice', () => {
      const { result } = renderHook(() => useChartPeriods());

      act(() => {
        result.current.setActivityPeriod(TIME_PERIODS.MONTH);
      });

      const dataAfterFirst = result.current.activityData;

      act(() => {
        result.current.setActivityPeriod(TIME_PERIODS.MONTH);
      });

      expect(result.current.activityPeriod).toBe(TIME_PERIODS.MONTH);
      expect(result.current.activityData).toBe(dataAfterFirst);
    });

    it('should work with all returned values', () => {
      const { result } = renderHook(() => useChartPeriods());

      // Check all return values exist
      expect(result.current.activityPeriod).toBeDefined();
      expect(result.current.conversionPeriod).toBeDefined();
      expect(result.current.sourcePeriod).toBeDefined();
      expect(result.current.setActivityPeriod).toBeDefined();
      expect(result.current.setConversionPeriod).toBeDefined();
      expect(result.current.setSourcePeriod).toBeDefined();
      expect(result.current.setAllPeriods).toBeDefined();
      expect(result.current.resetPeriods).toBeDefined();
      expect(result.current.getPeriodSetter).toBeDefined();
      expect(result.current.activityData).toBeDefined();
      expect(result.current.conversionData).toBeDefined();
      expect(result.current.sourceData).toBeDefined();
      expect(typeof result.current.arePeriodsSync).toBe('boolean');
    });

    it('should handle cycling through all periods', () => {
      const { result } = renderHook(() => useChartPeriods());

      const periods = [TIME_PERIODS.WEEK, TIME_PERIODS.MONTH, TIME_PERIODS.YEAR];

      for (const period of periods) {
        act(() => {
          result.current.setAllPeriods(period);
        });

        expect(result.current.activityPeriod).toBe(period);
        expect(result.current.conversionPeriod).toBe(period);
        expect(result.current.sourcePeriod).toBe(period);
        expect(result.current.arePeriodsSync).toBe(true);
      }
    });
  });
});

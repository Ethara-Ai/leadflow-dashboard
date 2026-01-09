/**
 * Unit Tests for useAlerts Hook
 * Tests alert state management functionality
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useAlerts from "./useAlerts";

// =============================================================================
// Test Helpers
// =============================================================================

const mockAlerts = [
  {
    id: 1,
    message: "New lead submitted from website form",
    type: "info",
    time: "1 hour ago",
  },
  {
    id: 2,
    message: "High-value lead requires immediate follow-up",
    type: "warning",
    time: "2 hours ago",
  },
  {
    id: 3,
    message: "System error occurred",
    type: "error",
    time: "3 hours ago",
  },
];

// =============================================================================
// Initialization Tests
// =============================================================================

describe("useAlerts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with default alerts from constants", () => {
      const { result } = renderHook(() => useAlerts());

      expect(result.current.alerts).toBeDefined();
      expect(Array.isArray(result.current.alerts)).toBe(true);
    });

    it("should initialize with custom initial state", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      expect(result.current.alerts).toHaveLength(3);
      expect(result.current.alerts[0].message).toBe(
        "New lead submitted from website form"
      );
    });

    it("should initialize with empty array when provided", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      expect(result.current.alerts).toHaveLength(0);
    });

    it("should return alertCount matching alerts length", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      expect(result.current.alertCount).toBe(3);
    });

    it("should return activeAlertCount for non-dismissed alerts", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      expect(result.current.activeAlertCount).toBe(3);
    });
  });

  // ===========================================================================
  // addAlert Tests
  // ===========================================================================

  describe("addAlert", () => {
    it("should add alert from string message", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert("New alert message");
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].message).toBe("New alert message");
    });

    it("should add alert from object", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert({
          message: "Object alert",
          type: "warning",
        });
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].message).toBe("Object alert");
      expect(result.current.alerts[0].type).toBe("warning");
    });

    it("should add alert at the beginning of the list", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.addAlert("Newest alert");
      });

      expect(result.current.alerts[0].message).toBe("Newest alert");
    });

    it("should auto-generate id for new alerts", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert("Alert with auto id");
      });

      expect(result.current.alerts[0].id).toBeDefined();
      expect(typeof result.current.alerts[0].id).toBe("number");
    });

    it("should set default time for new alerts", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert("Alert with time");
      });

      expect(result.current.alerts[0].time).toBe("Just now");
    });

    it("should set timestamp for new alerts", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert("Alert with timestamp");
      });

      expect(result.current.alerts[0].timestamp).toBeDefined();
    });

    it("should respect maxAlerts limit", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: [], maxAlerts: 3 })
      );

      act(() => {
        result.current.addAlert("Alert 1");
        result.current.addAlert("Alert 2");
        result.current.addAlert("Alert 3");
        result.current.addAlert("Alert 4");
      });

      expect(result.current.alerts).toHaveLength(3);
      expect(result.current.alerts[0].message).toBe("Alert 4");
    });

    it("should preserve custom properties from alert object", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert({
          message: "Custom alert",
          type: "info",
          customProp: "custom value",
        });
      });

      expect(result.current.alerts[0].customProp).toBe("custom value");
    });
  });

  // ===========================================================================
  // removeAlert Tests
  // ===========================================================================

  describe("removeAlert", () => {
    it("should remove alert by id", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.removeAlert(1);
      });

      expect(result.current.alerts).toHaveLength(2);
      expect(result.current.alerts.find((a) => a.id === 1)).toBeUndefined();
    });

    it("should not affect other alerts when removing one", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.removeAlert(1);
      });

      expect(result.current.alerts.find((a) => a.id === 2)).toBeDefined();
      expect(result.current.alerts.find((a) => a.id === 3)).toBeDefined();
    });

    it("should handle removing non-existent alert", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.removeAlert(999);
      });

      expect(result.current.alerts).toHaveLength(3);
    });

    it("should update alertCount after removal", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.removeAlert(1);
      });

      expect(result.current.alertCount).toBe(2);
    });
  });

  // ===========================================================================
  // dismissAlert Tests
  // ===========================================================================

  describe("dismissAlert", () => {
    it("should mark alert as dismissed", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.dismissAlert(1);
      });

      const dismissedAlert = result.current.alerts.find((a) => a.id === 1);
      expect(dismissedAlert.dismissed).toBe(true);
    });

    it("should keep dismissed alert in list", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.dismissAlert(1);
      });

      expect(result.current.alertCount).toBe(3);
    });

    it("should reduce activeAlertCount when alert is dismissed", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.dismissAlert(1);
      });

      expect(result.current.activeAlertCount).toBe(2);
    });

    it("should exclude dismissed alerts from activeAlerts", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.dismissAlert(1);
      });

      expect(result.current.activeAlerts.find((a) => a.id === 1)).toBeUndefined();
    });

    it("should not affect other alerts when dismissing one", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.dismissAlert(1);
      });

      const otherAlert = result.current.alerts.find((a) => a.id === 2);
      expect(otherAlert.dismissed).toBeUndefined();
    });
  });

  // ===========================================================================
  // clearAlerts Tests
  // ===========================================================================

  describe("clearAlerts", () => {
    it("should remove all alerts", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.clearAlerts();
      });

      expect(result.current.alerts).toHaveLength(0);
    });

    it("should set alertCount to 0", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.clearAlerts();
      });

      expect(result.current.alertCount).toBe(0);
    });

    it("should set activeAlertCount to 0", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.clearAlerts();
      });

      expect(result.current.activeAlertCount).toBe(0);
    });
  });

  // ===========================================================================
  // resetAlerts Tests
  // ===========================================================================

  describe("resetAlerts", () => {
    it("should reset to initial state", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.addAlert("New alert");
        result.current.resetAlerts();
      });

      expect(result.current.alerts).toHaveLength(3);
    });

    it("should restore original alerts after modifications", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.removeAlert(1);
        result.current.removeAlert(2);
        result.current.resetAlerts();
      });

      expect(result.current.alerts.find((a) => a.id === 1)).toBeDefined();
      expect(result.current.alerts.find((a) => a.id === 2)).toBeDefined();
    });
  });

  // ===========================================================================
  // getAlertsByType Tests
  // ===========================================================================

  describe("getAlertsByType", () => {
    it("should filter alerts by type", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      const warnings = result.current.getAlertsByType("warning");

      expect(warnings).toHaveLength(1);
      expect(warnings[0].type).toBe("warning");
    });

    it("should return empty array when no alerts match type", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      const unknownType = result.current.getAlertsByType("unknown");

      expect(unknownType).toHaveLength(0);
    });

    it("should exclude dismissed alerts from results", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.dismissAlert(2); // Dismiss the warning
      });

      const warnings = result.current.getAlertsByType("warning");

      expect(warnings).toHaveLength(0);
    });

    it("should return multiple alerts of same type", () => {
      const multipleWarnings = [
        { id: 1, message: "Warning 1", type: "warning" },
        { id: 2, message: "Warning 2", type: "warning" },
        { id: 3, message: "Info", type: "info" },
      ];

      const { result } = renderHook(() =>
        useAlerts({ initialState: multipleWarnings })
      );

      const warnings = result.current.getAlertsByType("warning");

      expect(warnings).toHaveLength(2);
    });
  });

  // ===========================================================================
  // hasWarnings and hasErrors Tests
  // ===========================================================================

  describe("hasWarnings", () => {
    it("should return true when warning alerts exist", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      expect(result.current.hasWarnings).toBe(true);
    });

    it("should return false when no warning alerts", () => {
      const noWarnings = [
        { id: 1, message: "Info", type: "info" },
        { id: 2, message: "Error", type: "error" },
      ];

      const { result } = renderHook(() =>
        useAlerts({ initialState: noWarnings })
      );

      expect(result.current.hasWarnings).toBe(false);
    });

    it("should return false when warning is dismissed", () => {
      const onlyWarning = [
        { id: 1, message: "Warning", type: "warning" },
      ];

      const { result } = renderHook(() =>
        useAlerts({ initialState: onlyWarning })
      );

      act(() => {
        result.current.dismissAlert(1);
      });

      expect(result.current.hasWarnings).toBe(false);
    });
  });

  describe("hasErrors", () => {
    it("should return true when error alerts exist", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      expect(result.current.hasErrors).toBe(true);
    });

    it("should return false when no error alerts", () => {
      const noErrors = [
        { id: 1, message: "Info", type: "info" },
        { id: 2, message: "Warning", type: "warning" },
      ];

      const { result } = renderHook(() =>
        useAlerts({ initialState: noErrors })
      );

      expect(result.current.hasErrors).toBe(false);
    });

    it("should return false when error is dismissed", () => {
      const onlyError = [{ id: 1, message: "Error", type: "error" }];

      const { result } = renderHook(() =>
        useAlerts({ initialState: onlyError })
      );

      act(() => {
        result.current.dismissAlert(1);
      });

      expect(result.current.hasErrors).toBe(false);
    });
  });

  // ===========================================================================
  // activeAlerts Tests
  // ===========================================================================

  describe("activeAlerts", () => {
    it("should return only non-dismissed alerts", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.dismissAlert(1);
        result.current.dismissAlert(2);
      });

      expect(result.current.activeAlerts).toHaveLength(1);
      expect(result.current.activeAlerts[0].id).toBe(3);
    });

    it("should return all alerts when none are dismissed", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      expect(result.current.activeAlerts).toHaveLength(3);
    });

    it("should return empty array when all alerts are dismissed", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      act(() => {
        result.current.dismissAlert(1);
        result.current.dismissAlert(2);
        result.current.dismissAlert(3);
      });

      expect(result.current.activeAlerts).toHaveLength(0);
    });
  });

  // ===========================================================================
  // Callback Stability Tests
  // ===========================================================================

  describe("callback stability", () => {
    it("should maintain stable addAlert reference", () => {
      const { result, rerender } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      const firstAddAlert = result.current.addAlert;
      rerender();
      const secondAddAlert = result.current.addAlert;

      expect(firstAddAlert).toBe(secondAddAlert);
    });

    it("should maintain stable removeAlert reference", () => {
      const { result, rerender } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      const firstRemoveAlert = result.current.removeAlert;
      rerender();
      const secondRemoveAlert = result.current.removeAlert;

      expect(firstRemoveAlert).toBe(secondRemoveAlert);
    });

    it("should maintain stable clearAlerts reference", () => {
      const { result, rerender } = renderHook(() =>
        useAlerts({ initialState: mockAlerts })
      );

      const firstClearAlerts = result.current.clearAlerts;
      rerender();
      const secondClearAlerts = result.current.clearAlerts;

      expect(firstClearAlerts).toBe(secondClearAlerts);
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("edge cases", () => {
    it("should handle rapid successive addAlert calls", () => {
      const { result } = renderHook(() =>
        useAlerts({ initialState: [], maxAlerts: 100 })
      );

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addAlert(`Alert ${i}`);
        }
      });

      expect(result.current.alerts).toHaveLength(10);
    });

    it("should handle empty string messages", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert("");
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].message).toBe("");
    });

    it("should handle special characters in messages", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert("Alert with <script> & special 'chars'");
      });

      expect(result.current.alerts[0].message).toBe(
        "Alert with <script> & special 'chars'"
      );
    });

    it("should handle very long messages", () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));
      const longMessage = "A".repeat(1000);

      act(() => {
        result.current.addAlert(longMessage);
      });

      expect(result.current.alerts[0].message).toHaveLength(1000);
    });
  });
});

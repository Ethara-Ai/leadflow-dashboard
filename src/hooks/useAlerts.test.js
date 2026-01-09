/**
 * Unit Tests for useAlerts Hook
 * Tests alerts state management including add, remove, dismiss, and filtering
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAlerts from './useAlerts.js';
import { ALERT_TYPES } from '../constants/index.js';

// =============================================================================
// Test Helpers
// =============================================================================

const createMockAlert = (overrides = {}) => ({
  id: Date.now() + Math.random(),
  message: 'Test alert message',
  type: ALERT_TYPES.INFO,
  time: 'Just now',
  timestamp: new Date().toISOString(),
  ...overrides,
});

// =============================================================================
// Initial State Tests
// =============================================================================

describe('useAlerts', () => {
  describe('initial state', () => {
    it('should initialize with default alerts from constants', () => {
      const { result } = renderHook(() => useAlerts());

      expect(result.current.alerts).toBeDefined();
      expect(Array.isArray(result.current.alerts)).toBe(true);
    });

    it('should initialize with custom initial state', () => {
      const customAlerts = [
        createMockAlert({ id: 1, message: 'Custom alert 1' }),
        createMockAlert({ id: 2, message: 'Custom alert 2' }),
      ];

      const { result } = renderHook(() => useAlerts({ initialState: customAlerts }));

      expect(result.current.alerts).toEqual(customAlerts);
      expect(result.current.alertCount).toBe(2);
    });

    it('should initialize with empty array when provided', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      expect(result.current.alerts).toEqual([]);
      expect(result.current.alertCount).toBe(0);
    });
  });

  // =============================================================================
  // Add Alert Tests
  // =============================================================================

  describe('addAlert', () => {
    it('should add a new alert from a string message', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert('New test alert');
      });

      expect(result.current.alertCount).toBe(1);
      expect(result.current.alerts[0].message).toBe('New test alert');
    });

    it('should add alert at the beginning of the list', () => {
      const existingAlert = createMockAlert({ id: 1, message: 'Existing alert' });
      const { result } = renderHook(() => useAlerts({ initialState: [existingAlert] }));

      act(() => {
        result.current.addAlert('New alert');
      });

      expect(result.current.alerts[0].message).toBe('New alert');
      expect(result.current.alerts[1].message).toBe('Existing alert');
    });

    it('should add a full alert object', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert({
          message: 'Custom alert',
          type: ALERT_TYPES.WARNING,
        });
      });

      expect(result.current.alerts[0].message).toBe('Custom alert');
      expect(result.current.alerts[0].type).toBe(ALERT_TYPES.WARNING);
    });

    it('should auto-generate id for new alerts', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert('Test alert');
      });

      expect(result.current.alerts[0].id).toBeDefined();
      expect(typeof result.current.alerts[0].id).toBe('number');
    });

    it('should set time to "Just now" for new alerts', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert('Test alert');
      });

      expect(result.current.alerts[0].time).toBe('Just now');
    });

    it('should auto-detect alert type from message', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert('Urgent: Action required immediately');
      });

      expect(result.current.alerts[0].type).toBe(ALERT_TYPES.WARNING);
    });

    it('should respect maxAlerts limit', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [], maxAlerts: 3 }));

      act(() => {
        result.current.addAlert('Alert 1');
        result.current.addAlert('Alert 2');
        result.current.addAlert('Alert 3');
        result.current.addAlert('Alert 4');
        result.current.addAlert('Alert 5');
      });

      expect(result.current.alertCount).toBe(3);
      expect(result.current.alerts[0].message).toBe('Alert 5');
    });
  });

  // =============================================================================
  // Remove Alert Tests
  // =============================================================================

  describe('removeAlert', () => {
    it('should remove an alert by id', () => {
      const alerts = [
        createMockAlert({ id: 1, message: 'Alert 1' }),
        createMockAlert({ id: 2, message: 'Alert 2' }),
        createMockAlert({ id: 3, message: 'Alert 3' }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      act(() => {
        result.current.removeAlert(2);
      });

      expect(result.current.alertCount).toBe(2);
      expect(result.current.alerts.find((a) => a.id === 2)).toBeUndefined();
    });

    it('should do nothing if id not found', () => {
      const alerts = [createMockAlert({ id: 1, message: 'Alert 1' })];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      act(() => {
        result.current.removeAlert(999);
      });

      expect(result.current.alertCount).toBe(1);
    });

    it('should handle removing from empty list', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.removeAlert(1);
      });

      expect(result.current.alertCount).toBe(0);
    });
  });

  // =============================================================================
  // Dismiss Alert Tests
  // =============================================================================

  describe('dismissAlert', () => {
    it('should mark an alert as dismissed', () => {
      const alerts = [
        createMockAlert({ id: 1, message: 'Alert 1' }),
        createMockAlert({ id: 2, message: 'Alert 2' }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      act(() => {
        result.current.dismissAlert(1);
      });

      expect(result.current.alerts.find((a) => a.id === 1).dismissed).toBe(true);
      expect(result.current.alerts.find((a) => a.id === 2).dismissed).toBeUndefined();
    });

    it('should keep dismissed alert in the list', () => {
      const alerts = [createMockAlert({ id: 1, message: 'Alert 1' })];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      act(() => {
        result.current.dismissAlert(1);
      });

      expect(result.current.alertCount).toBe(1);
    });

    it('should exclude dismissed alerts from activeAlerts', () => {
      const alerts = [
        createMockAlert({ id: 1, message: 'Alert 1' }),
        createMockAlert({ id: 2, message: 'Alert 2' }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      act(() => {
        result.current.dismissAlert(1);
      });

      expect(result.current.activeAlerts.length).toBe(1);
      expect(result.current.activeAlertCount).toBe(1);
      expect(result.current.activeAlerts[0].id).toBe(2);
    });
  });

  // =============================================================================
  // Clear and Reset Tests
  // =============================================================================

  describe('clearAlerts', () => {
    it('should remove all alerts', () => {
      const alerts = [
        createMockAlert({ id: 1 }),
        createMockAlert({ id: 2 }),
        createMockAlert({ id: 3 }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.alertCount).toBe(3);

      act(() => {
        result.current.clearAlerts();
      });

      expect(result.current.alertCount).toBe(0);
      expect(result.current.alerts).toEqual([]);
    });

    it('should work on empty list', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.clearAlerts();
      });

      expect(result.current.alertCount).toBe(0);
    });
  });

  describe('resetAlerts', () => {
    it('should reset to initial state', () => {
      const initialAlerts = [createMockAlert({ id: 1, message: 'Initial alert' })];
      const { result } = renderHook(() => useAlerts({ initialState: initialAlerts }));

      act(() => {
        result.current.addAlert('New alert');
        result.current.addAlert('Another alert');
      });

      expect(result.current.alertCount).toBe(3);

      act(() => {
        result.current.resetAlerts();
      });

      expect(result.current.alertCount).toBe(1);
      expect(result.current.alerts[0].message).toBe('Initial alert');
    });

    it('should reset to empty when initial was empty', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert('Test alert');
      });

      expect(result.current.alertCount).toBe(1);

      act(() => {
        result.current.resetAlerts();
      });

      expect(result.current.alertCount).toBe(0);
    });
  });

  // =============================================================================
  // Active Alerts Tests
  // =============================================================================

  describe('activeAlerts', () => {
    it('should return only non-dismissed alerts', () => {
      const alerts = [
        createMockAlert({ id: 1, dismissed: true }),
        createMockAlert({ id: 2 }),
        createMockAlert({ id: 3, dismissed: true }),
        createMockAlert({ id: 4 }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.activeAlerts.length).toBe(2);
      expect(result.current.activeAlerts.map((a) => a.id)).toEqual([2, 4]);
    });

    it('should return correct activeAlertCount', () => {
      const alerts = [
        createMockAlert({ id: 1, dismissed: true }),
        createMockAlert({ id: 2 }),
        createMockAlert({ id: 3 }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.activeAlertCount).toBe(2);
    });

    it('should return empty array when all dismissed', () => {
      const alerts = [
        createMockAlert({ id: 1, dismissed: true }),
        createMockAlert({ id: 2, dismissed: true }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.activeAlerts).toEqual([]);
      expect(result.current.activeAlertCount).toBe(0);
    });
  });

  // =============================================================================
  // Get Alerts By Type Tests
  // =============================================================================

  describe('getAlertsByType', () => {
    it('should filter alerts by type', () => {
      const alerts = [
        createMockAlert({ id: 1, type: ALERT_TYPES.WARNING }),
        createMockAlert({ id: 2, type: ALERT_TYPES.INFO }),
        createMockAlert({ id: 3, type: ALERT_TYPES.WARNING }),
        createMockAlert({ id: 4, type: ALERT_TYPES.ERROR }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      const warningAlerts = result.current.getAlertsByType(ALERT_TYPES.WARNING);

      expect(warningAlerts.length).toBe(2);
      expect(warningAlerts.every((a) => a.type === ALERT_TYPES.WARNING)).toBe(true);
    });

    it('should exclude dismissed alerts', () => {
      const alerts = [
        createMockAlert({ id: 1, type: ALERT_TYPES.WARNING }),
        createMockAlert({ id: 2, type: ALERT_TYPES.WARNING, dismissed: true }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      const warningAlerts = result.current.getAlertsByType(ALERT_TYPES.WARNING);

      expect(warningAlerts.length).toBe(1);
    });

    it('should return empty array for non-existent type', () => {
      const alerts = [createMockAlert({ id: 1, type: ALERT_TYPES.INFO })];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      const errorAlerts = result.current.getAlertsByType(ALERT_TYPES.ERROR);

      expect(errorAlerts).toEqual([]);
    });
  });

  // =============================================================================
  // Has Warnings / Has Errors Tests
  // =============================================================================

  describe('hasWarnings', () => {
    it('should return true when active warning alerts exist', () => {
      const alerts = [
        createMockAlert({ id: 1, type: ALERT_TYPES.WARNING }),
        createMockAlert({ id: 2, type: ALERT_TYPES.INFO }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.hasWarnings).toBe(true);
    });

    it('should return false when no warning alerts', () => {
      const alerts = [
        createMockAlert({ id: 1, type: ALERT_TYPES.INFO }),
        createMockAlert({ id: 2, type: ALERT_TYPES.SUCCESS }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.hasWarnings).toBe(false);
    });

    it('should return false when all warnings are dismissed', () => {
      const alerts = [createMockAlert({ id: 1, type: ALERT_TYPES.WARNING, dismissed: true })];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.hasWarnings).toBe(false);
    });
  });

  describe('hasErrors', () => {
    it('should return true when active error alerts exist', () => {
      const alerts = [
        createMockAlert({ id: 1, type: ALERT_TYPES.ERROR }),
        createMockAlert({ id: 2, type: ALERT_TYPES.INFO }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.hasErrors).toBe(true);
    });

    it('should return false when no error alerts', () => {
      const alerts = [
        createMockAlert({ id: 1, type: ALERT_TYPES.INFO }),
        createMockAlert({ id: 2, type: ALERT_TYPES.WARNING }),
      ];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.hasErrors).toBe(false);
    });

    it('should return false when all errors are dismissed', () => {
      const alerts = [createMockAlert({ id: 1, type: ALERT_TYPES.ERROR, dismissed: true })];
      const { result } = renderHook(() => useAlerts({ initialState: alerts }));

      expect(result.current.hasErrors).toBe(false);
    });
  });

  // =============================================================================
  // Edge Cases Tests
  // =============================================================================

  describe('edge cases', () => {
    it('should handle rapid successive addAlert calls', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [], maxAlerts: 10 }));

      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.addAlert(`Alert ${i}`);
        }
      });

      expect(result.current.alertCount).toBe(5);
    });

    it('should maintain alert order (newest first)', () => {
      const { result } = renderHook(() => useAlerts({ initialState: [] }));

      act(() => {
        result.current.addAlert('First');
      });

      act(() => {
        result.current.addAlert('Second');
      });

      act(() => {
        result.current.addAlert('Third');
      });

      expect(result.current.alerts[0].message).toBe('Third');
      expect(result.current.alerts[1].message).toBe('Second');
      expect(result.current.alerts[2].message).toBe('First');
    });

    it('should work with default options', () => {
      const { result } = renderHook(() => useAlerts());

      expect(result.current.addAlert).toBeDefined();
      expect(result.current.removeAlert).toBeDefined();
      expect(result.current.dismissAlert).toBeDefined();
      expect(result.current.clearAlerts).toBeDefined();
      expect(result.current.resetAlerts).toBeDefined();
      expect(result.current.getAlertsByType).toBeDefined();
    });
  });
});

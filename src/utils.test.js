/**
 * Unit Tests for Utility Functions
 * Tests calculations, formatting, validation, and export utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  // Lead Data Utilities
  calculateTotalLeads,
  calculateAverageLeads,
  calculateTotalCalls,
  // Formatting Utilities
  formatEfficiency,
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  // Alert Utilities
  getRandomAlertMessage,
  getAlertType,
  // Export Utilities
  exportToCSV,
  exportToJSON,
  generateExportFilename,
  // Validation Utilities
  isValidEmail,
  isValidPhone,
  // Misc Utilities
  debounce,
  throttle,
  generateId,
  deepClone,
  isEmpty,
} from './utils.js';

// =============================================================================
// Lead Data Utilities Tests
// =============================================================================

describe('Lead Data Utilities', () => {
  describe('calculateTotalLeads', () => {
    it('should calculate total leads from week data', () => {
      const weekData = [{ leads: 10 }, { leads: 20 }, { leads: 30 }];
      expect(calculateTotalLeads(weekData)).toBe(60);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalLeads([])).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(calculateTotalLeads(null)).toBe(0);
    });

    it('should return 0 for undefined input', () => {
      expect(calculateTotalLeads(undefined)).toBe(0);
    });

    it('should return 0 for non-array input', () => {
      expect(calculateTotalLeads('not an array')).toBe(0);
      expect(calculateTotalLeads(123)).toBe(0);
      expect(calculateTotalLeads({})).toBe(0);
    });

    it('should handle items without leads property', () => {
      const weekData = [{ leads: 10 }, { other: 20 }, { leads: 30 }];
      expect(calculateTotalLeads(weekData)).toBe(40);
    });

    it('should handle single item array', () => {
      expect(calculateTotalLeads([{ leads: 42 }])).toBe(42);
    });
  });

  describe('calculateAverageLeads', () => {
    it('should calculate average leads from week data', () => {
      const weekData = [{ leads: 10 }, { leads: 20 }, { leads: 30 }];
      expect(calculateAverageLeads(weekData)).toBe(20);
    });

    it('should round to nearest integer', () => {
      const weekData = [{ leads: 10 }, { leads: 11 }];
      expect(calculateAverageLeads(weekData)).toBe(11); // 10.5 rounds to 11
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageLeads([])).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(calculateAverageLeads(null)).toBe(0);
    });

    it('should return 0 for undefined input', () => {
      expect(calculateAverageLeads(undefined)).toBe(0);
    });

    it('should handle single item array', () => {
      expect(calculateAverageLeads([{ leads: 42 }])).toBe(42);
    });
  });

  describe('calculateTotalCalls', () => {
    it('should calculate total calls from week data', () => {
      const weekData = [{ callsCompleted: 5 }, { callsCompleted: 10 }, { callsCompleted: 15 }];
      expect(calculateTotalCalls(weekData)).toBe(30);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalCalls([])).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(calculateTotalCalls(null)).toBe(0);
    });

    it('should return 0 for undefined input', () => {
      expect(calculateTotalCalls(undefined)).toBe(0);
    });

    it('should handle items without callsCompleted property', () => {
      const weekData = [{ callsCompleted: 5 }, { other: 10 }, { callsCompleted: 15 }];
      expect(calculateTotalCalls(weekData)).toBe(20);
    });
  });
});

// =============================================================================
// Formatting Utilities Tests
// =============================================================================

describe('Formatting Utilities', () => {
  describe('formatEfficiency', () => {
    it('should format efficiency as percentage', () => {
      expect(formatEfficiency(85)).toBe('85%');
    });

    it('should handle zero', () => {
      expect(formatEfficiency(0)).toBe('0%');
    });

    it('should handle 100', () => {
      expect(formatEfficiency(100)).toBe('100%');
    });

    it('should return 0% for non-number input', () => {
      expect(formatEfficiency('not a number')).toBe('0%');
      expect(formatEfficiency(null)).toBe('0%');
      expect(formatEfficiency(undefined)).toBe('0%');
    });

    it('should return 0% for NaN', () => {
      expect(formatEfficiency(NaN)).toBe('0%');
    });
  });

  describe('formatNumber', () => {
    it('should format number with thousands separators', () => {
      // Note: Format may vary by locale, so check for commas presence
      const formatted1000 = formatNumber(1000);
      const formatted1000000 = formatNumber(1000000);
      expect(formatted1000).toContain(',');
      expect(formatted1000).toContain('1');
      expect(formatted1000000).toContain(',');
      expect(formatted1000000).toContain('1');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(42)).toBe('42');
      expect(formatNumber(999)).toBe('999');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should return 0 for non-number input', () => {
      expect(formatNumber('not a number')).toBe('0');
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });

    it('should return 0 for NaN', () => {
      expect(formatNumber(NaN)).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('should format amount as USD currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(50000)).toBe('$50,000');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0');
    });

    it('should return $0 for non-number input', () => {
      expect(formatCurrency('not a number')).toBe('$0');
      expect(formatCurrency(null)).toBe('$0');
      expect(formatCurrency(undefined)).toBe('$0');
    });

    it('should return $0 for NaN', () => {
      expect(formatCurrency(NaN)).toBe('$0');
    });

    it('should handle different currencies', () => {
      const result = formatCurrency(1000, 'EUR');
      expect(result).toContain('1,000');
    });
  });

  describe('formatDate', () => {
    it('should format date object', () => {
      const date = new Date('2024-06-15');
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('Jun');
      expect(result).toContain('15');
    });

    it('should format date string', () => {
      const result = formatDate('2024-06-15');
      expect(result).toContain('2024');
    });

    it('should return empty string for invalid date', () => {
      expect(formatDate('invalid')).toBe('');
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    it('should accept custom options', () => {
      const date = new Date('2024-06-15');
      const result = formatDate(date, { month: 'long' });
      expect(result).toContain('June');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "Just now" for very recent times', () => {
      const date = new Date('2024-06-15T11:59:30');
      expect(formatRelativeTime(date)).toBe('Just now');
    });

    it('should return minutes ago', () => {
      const date = new Date('2024-06-15T11:55:00');
      expect(formatRelativeTime(date)).toBe('5 minutes ago');
    });

    it('should return singular minute', () => {
      const date = new Date('2024-06-15T11:59:00');
      expect(formatRelativeTime(date)).toBe('1 minute ago');
    });

    it('should return hours ago', () => {
      const date = new Date('2024-06-15T09:00:00');
      expect(formatRelativeTime(date)).toBe('3 hours ago');
    });

    it('should return singular hour', () => {
      const date = new Date('2024-06-15T11:00:00');
      expect(formatRelativeTime(date)).toBe('1 hour ago');
    });

    it('should return days ago', () => {
      const date = new Date('2024-06-13T12:00:00');
      expect(formatRelativeTime(date)).toBe('2 days ago');
    });

    it('should return singular day', () => {
      const date = new Date('2024-06-14T12:00:00');
      expect(formatRelativeTime(date)).toBe('1 day ago');
    });

    it('should return formatted date for older dates', () => {
      const date = new Date('2024-06-01T12:00:00');
      const result = formatRelativeTime(date);
      expect(result).toContain('2024');
    });

    it('should return empty string for invalid date', () => {
      expect(formatRelativeTime('invalid')).toBe('');
      expect(formatRelativeTime(null)).toBe('');
    });

    it('should handle date strings', () => {
      const result = formatRelativeTime('2024-06-15T11:55:00');
      expect(result).toBe('5 minutes ago');
    });
  });
});

// =============================================================================
// Alert Utilities Tests
// =============================================================================

describe('Alert Utilities', () => {
  describe('getRandomAlertMessage', () => {
    it('should return a string', () => {
      const message = getRandomAlertMessage();
      expect(typeof message).toBe('string');
    });

    it('should return a non-empty string', () => {
      const message = getRandomAlertMessage();
      expect(message.length).toBeGreaterThan(0);
    });
  });

  describe('getAlertType', () => {
    it('should return warning for urgent messages', () => {
      expect(getAlertType('This is urgent!')).toBe('warning');
      expect(getAlertType('Requires immediate attention')).toBe('warning');
      expect(getAlertType('Hot lead available')).toBe('warning');
      expect(getAlertType('High-value opportunity')).toBe('warning');
      expect(getAlertType('Pending approval needed')).toBe('warning');
    });

    it('should return success for completion messages', () => {
      expect(getAlertType('Task completed successfully')).toBe('success');
      expect(getAlertType('Goal achieved!')).toBe('success');
      expect(getAlertType('Performance improved')).toBe('success');
      expect(getAlertType('Deal closed')).toBe('success');
    });

    it('should return error for error messages', () => {
      expect(getAlertType('An error occurred')).toBe('error');
      expect(getAlertType('Operation failed')).toBe('error');
    });

    it('should return info for generic messages', () => {
      expect(getAlertType('New notification')).toBe('info');
      expect(getAlertType('Update available')).toBe('info');
    });

    it('should return info for null or empty input', () => {
      expect(getAlertType(null)).toBe('info');
      expect(getAlertType('')).toBe('info');
      expect(getAlertType(undefined)).toBe('info');
    });

    it('should return info for non-string input', () => {
      expect(getAlertType(123)).toBe('info');
      expect(getAlertType({})).toBe('info');
    });

    it('should be case-insensitive', () => {
      expect(getAlertType('URGENT MESSAGE')).toBe('warning');
      expect(getAlertType('COMPLETED')).toBe('success');
      expect(getAlertType('ERROR occurred')).toBe('error');
    });
  });
});

// =============================================================================
// Export Utilities Tests
// =============================================================================

describe('Export Utilities', () => {
  let mockLink;
  let blobContent;
  let originalBlob;

  beforeEach(() => {
    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return mockLink;
      }
      return document.createElement(tagName);
    });

    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

    // Store original Blob and create mock
    originalBlob = global.Blob;
    blobContent = null;
    global.Blob = class MockBlob {
      constructor(content, options) {
        blobContent = content;
        this.content = content;
        this.options = options;
      }
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.Blob = originalBlob;
  });

  describe('exportToCSV', () => {
    it('should create and download CSV file', () => {
      const data = {
        leadData: {
          totalLeads: 100,
          callsMade: 50,
          meetingsScheduled: 10,
          lastUpdated: '2024-06-15',
        },
        activityData: [{ name: 'Mon', leads: 10, callsCompleted: 5 }],
        conversionData: [{ name: 'Week 1', efficiency: 85 }],
        sourceData: [{ name: 'Email', value: 30 }],
        alerts: [{ message: 'Test alert', type: 'info', time: 'Just now' }],
      };

      exportToCSV(data, 'test-export.csv');

      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toBe('test-export.csv');
    });

    it('should handle empty data', () => {
      const data = {
        leadData: {},
        activityData: [],
        conversionData: [],
        sourceData: [],
        alerts: [],
      };

      exportToCSV(data, 'empty-export.csv');

      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle null data gracefully', () => {
      const data = {
        leadData: null,
        activityData: null,
        conversionData: null,
        sourceData: null,
        alerts: null,
      };

      expect(() => exportToCSV(data, 'null-export.csv')).not.toThrow();
    });
  });

  describe('exportToJSON', () => {
    it('should create and download JSON file', () => {
      const data = { test: 'data', value: 123 };

      exportToJSON(data, 'test-export.json');

      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toBe('test-export.json');
    });

    it('should format JSON with indentation', () => {
      const data = { nested: { value: 'test' } };

      exportToJSON(data, 'formatted.json');

      expect(blobContent).toBeDefined();
      expect(blobContent[0]).toContain('  '); // Check for indentation
    });
  });

  describe('generateExportFilename', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should generate filename with date and csv extension', () => {
      const filename = generateExportFilename('csv');
      expect(filename).toBe('leadflow-data-2024-06-15.csv');
    });

    it('should generate filename with date and json extension', () => {
      const filename = generateExportFilename('json');
      expect(filename).toBe('leadflow-data-2024-06-15.json');
    });

    it('should use custom prefix', () => {
      const filename = generateExportFilename('csv', 'custom-report');
      expect(filename).toBe('custom-report-2024-06-15.csv');
    });
  });
});

// =============================================================================
// Validation Utilities Tests
// =============================================================================

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
    });

    it('should return false for empty or null input', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });

    it('should return false for non-string input', () => {
      expect(isValidEmail(123)).toBe(false);
      expect(isValidEmail({})).toBe(false);
    });

    it('should return false for emails with spaces', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
      expect(isValidEmail('test@ example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('+1 (555) 123-4567')).toBe(true);
      expect(isValidPhone('555-123-4567')).toBe(true);
      expect(isValidPhone('(555) 123-4567')).toBe(true);
    });

    it('should return true for international numbers', () => {
      expect(isValidPhone('+44 20 7123 4567')).toBe(true);
      expect(isValidPhone('+1-800-555-0199')).toBe(true);
    });

    it('should return false for too short numbers', () => {
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('123456789')).toBe(false);
    });

    it('should return false for too long numbers', () => {
      expect(isValidPhone('1234567890123456')).toBe(false);
    });

    it('should return false for empty or null input', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone(null)).toBe(false);
      expect(isValidPhone(undefined)).toBe(false);
    });

    it('should return false for non-string input', () => {
      expect(isValidPhone(1234567890)).toBe(false);
      expect(isValidPhone({})).toBe(false);
    });
  });
});

// =============================================================================
// Misc Utilities Tests
// =============================================================================

describe('Misc Utilities', () => {
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should delay function execution', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should only execute once for multiple rapid calls', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the function', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should reset timer on subsequent calls', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      vi.advanceTimersByTime(50);

      debouncedFn();
      vi.advanceTimersByTime(50);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should execute immediately on first call', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should ignore calls within throttle period', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should allow calls after throttle period', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to the function', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn('arg1', 'arg2');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('generateId', () => {
    it('should generate a unique string', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id1).not.toBe(id2);
    });

    it('should include prefix when provided', () => {
      const id = generateId('test');
      expect(id.startsWith('test-')).toBe(true);
    });

    it('should work without prefix', () => {
      const id = generateId();
      expect(id).not.toContain('undefined');
    });

    it('should generate unique IDs in rapid succession', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('deepClone', () => {
    it('should clone simple objects', () => {
      const obj = { a: 1, b: 2 };
      const cloned = deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    it('should clone nested objects', () => {
      const obj = { a: { b: { c: 1 } } };
      const cloned = deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned.a).not.toBe(obj.a);
      expect(cloned.a.b).not.toBe(obj.a.b);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, { a: 3 }];
      const cloned = deepClone(arr);

      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should return primitives as-is', () => {
      expect(deepClone(null)).toBe(null);
      expect(deepClone(123)).toBe(123);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(true)).toBe(true);
    });

    it('should handle empty objects and arrays', () => {
      expect(deepClone({})).toEqual({});
      expect(deepClone([])).toEqual([]);
    });
  });

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty arrays', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false for non-empty arrays', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty([null])).toBe(false);
    });

    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty objects', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' a ')).toBe(false);
    });

    it('should return false for numbers', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(123)).toBe(false);
    });

    it('should return false for booleans', () => {
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty(true)).toBe(false);
    });
  });
});

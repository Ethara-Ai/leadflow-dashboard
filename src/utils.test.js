/**
 * Unit Tests for Utility Functions
 * Tests all functions in src/utils.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateTotalLeads,
  calculateAverageLeads,
  calculateTotalCalls,
  formatEfficiency,
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  getRandomAlertMessage,
  getAlertType,
  exportToCSV,
  exportToJSON,
  generateExportFilename,
  isValidEmail,
  isValidPhone,
  debounce,
  throttle,
  generateId,
  deepClone,
  isEmpty,
} from './utils';
import { alertMessages, ALERT_TYPES } from './constants/index.js';

// =============================================================================
// calculateTotalLeads Tests
// =============================================================================

describe('calculateTotalLeads', () => {
  it('should calculate the sum of leads from week data', () => {
    const weekData = [
      { name: 'Mon', leads: 120 },
      { name: 'Tue', leads: 150 },
      { name: 'Wed', leads: 180 },
    ];

    const result = calculateTotalLeads(weekData);
    expect(result).toBe(450);
  });

  it('should return 0 for empty array', () => {
    const result = calculateTotalLeads([]);
    expect(result).toBe(0);
  });

  it('should return 0 for non-array input', () => {
    expect(calculateTotalLeads(null)).toBe(0);
    expect(calculateTotalLeads(undefined)).toBe(0);
    expect(calculateTotalLeads('string')).toBe(0);
  });

  it('should handle single day data', () => {
    const weekData = [{ name: 'Mon', leads: 100 }];
    const result = calculateTotalLeads(weekData);
    expect(result).toBe(100);
  });

  it('should handle data with zero leads', () => {
    const weekData = [
      { name: 'Mon', leads: 0 },
      { name: 'Tue', leads: 0 },
    ];
    const result = calculateTotalLeads(weekData);
    expect(result).toBe(0);
  });

  it('should handle large numbers correctly', () => {
    const weekData = [
      { name: 'Mon', leads: 10000 },
      { name: 'Tue', leads: 20000 },
      { name: 'Wed', leads: 30000 },
    ];
    const result = calculateTotalLeads(weekData);
    expect(result).toBe(60000);
  });

  it('should ignore other properties in data objects', () => {
    const weekData = [
      { name: 'Mon', leads: 100, callsCompleted: 15, extra: 'data' },
      { name: 'Tue', leads: 200, callsCompleted: 22, extra: 'more' },
    ];
    const result = calculateTotalLeads(weekData);
    expect(result).toBe(300);
  });

  it('should handle missing leads property', () => {
    const weekData = [{ name: 'Mon' }, { name: 'Tue', leads: 100 }];
    const result = calculateTotalLeads(weekData);
    expect(result).toBe(100);
  });
});

// =============================================================================
// calculateAverageLeads Tests
// =============================================================================

describe('calculateAverageLeads', () => {
  it('should calculate average leads per day', () => {
    const weekData = [
      { name: 'Mon', leads: 100 },
      { name: 'Tue', leads: 200 },
      { name: 'Wed', leads: 300 },
    ];
    expect(calculateAverageLeads(weekData)).toBe(200);
  });

  it('should return 0 for empty array', () => {
    expect(calculateAverageLeads([])).toBe(0);
  });

  it('should round the result', () => {
    const weekData = [
      { name: 'Mon', leads: 10 },
      { name: 'Tue', leads: 11 },
      { name: 'Wed', leads: 12 },
    ];
    expect(calculateAverageLeads(weekData)).toBe(11);
  });
});

// =============================================================================
// calculateTotalCalls Tests
// =============================================================================

describe('calculateTotalCalls', () => {
  it('should calculate total calls completed', () => {
    const weekData = [
      { name: 'Mon', callsCompleted: 10 },
      { name: 'Tue', callsCompleted: 20 },
    ];
    expect(calculateTotalCalls(weekData)).toBe(30);
  });

  it('should return 0 for empty array', () => {
    expect(calculateTotalCalls([])).toBe(0);
  });

  it('should handle missing callsCompleted property', () => {
    const weekData = [{ name: 'Mon' }, { name: 'Tue', callsCompleted: 15 }];
    expect(calculateTotalCalls(weekData)).toBe(15);
  });
});

// =============================================================================
// formatEfficiency Tests
// =============================================================================

describe('formatEfficiency', () => {
  it('should format efficiency as percentage string', () => {
    expect(formatEfficiency(85)).toBe('85%');
  });

  it('should handle zero efficiency', () => {
    expect(formatEfficiency(0)).toBe('0%');
  });

  it('should handle 100% efficiency', () => {
    expect(formatEfficiency(100)).toBe('100%');
  });

  it('should handle decimal efficiency values', () => {
    expect(formatEfficiency(85.5)).toBe('85.5%');
  });

  it('should handle negative values', () => {
    expect(formatEfficiency(-10)).toBe('-10%');
  });

  it('should handle values over 100', () => {
    expect(formatEfficiency(150)).toBe('150%');
  });

  it('should return 0% for non-number input', () => {
    expect(formatEfficiency('75')).toBe('0%');
    expect(formatEfficiency(null)).toBe('0%');
    expect(formatEfficiency(undefined)).toBe('0%');
    expect(formatEfficiency(NaN)).toBe('0%');
  });
});

// =============================================================================
// formatNumber Tests
// =============================================================================

describe('formatNumber', () => {
  it('should format number with thousands separators', () => {
    // Use locale-independent check - just verify it contains some separator
    const formatted1000 = formatNumber(1000);
    expect(formatted1000).toContain(',');
    expect(formatted1000).toContain('1');
    expect(formatted1000).toContain('000');

    const formatted1M = formatNumber(1000000);
    expect(formatted1M).toContain(',');
    expect(formatted1M.replace(/,/g, '')).toBe('1000000');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should return 0 for non-number input', () => {
    expect(formatNumber('test')).toBe('0');
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(NaN)).toBe('0');
  });
});

// =============================================================================
// formatCurrency Tests
// =============================================================================

describe('formatCurrency', () => {
  it('should format currency with USD by default', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(50000)).toBe('$50,000');
  });

  it('should return $0 for invalid input', () => {
    expect(formatCurrency(null)).toBe('$0');
    expect(formatCurrency(NaN)).toBe('$0');
  });
});

// =============================================================================
// formatDate Tests
// =============================================================================

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-06-15');
    const result = formatDate(date);
    expect(result).toContain('2024');
    expect(result).toContain('Jun');
    expect(result).toContain('15');
  });

  it('should handle string dates', () => {
    const result = formatDate('2024-06-15');
    expect(result).toContain('2024');
  });

  it('should return empty string for invalid date', () => {
    expect(formatDate('invalid')).toBe('');
    expect(formatDate(null)).toBe('');
  });
});

// =============================================================================
// formatRelativeTime Tests
// =============================================================================

describe('formatRelativeTime', () => {
  it('should return Just now for recent time', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe('Just now');
  });

  it('should return minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinAgo)).toBe('5 minutes ago');
  });

  it('should return hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
  });

  it('should return days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
  });

  it('should return empty string for invalid date', () => {
    expect(formatRelativeTime('invalid')).toBe('');
    expect(formatRelativeTime(null)).toBe('');
  });
});

// =============================================================================
// getRandomAlertMessage Tests
// =============================================================================

describe('getRandomAlertMessage', () => {
  it('should return a string', () => {
    const result = getRandomAlertMessage();
    expect(typeof result).toBe('string');
  });

  it('should return a message from the predefined list', () => {
    const result = getRandomAlertMessage();
    expect(alertMessages).toContain(result);
  });

  it('should return non-empty strings', () => {
    for (let i = 0; i < 10; i++) {
      const result = getRandomAlertMessage();
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it('should eventually return different messages (randomness test)', () => {
    const results = new Set();
    // Run multiple times to get different random values
    for (let i = 0; i < 100; i++) {
      results.add(getRandomAlertMessage());
    }
    // Should have gotten more than one unique message
    expect(results.size).toBeGreaterThan(1);
  });
});

// =============================================================================
// getAlertType Tests
// =============================================================================

describe('getAlertType', () => {
  describe('warning alerts', () => {
    it('should return "warning" for immediate follow-up messages', () => {
      const result = getAlertType('High-value lead from FinanceX requires immediate follow-up');
      expect(result).toBe(ALERT_TYPES.WARNING);
    });

    it('should return "warning" for pending messages', () => {
      const result = getAlertType('5 leads pending outreach for more than 48 hours');
      expect(result).toBe(ALERT_TYPES.WARNING);
    });

    it('should return "warning" for requires messages', () => {
      const result = getAlertType('This task requires attention');
      expect(result).toBe(ALERT_TYPES.WARNING);
    });

    it('should return "warning" for high-value lead messages', () => {
      const result = getAlertType('High-value opportunity identified');
      expect(result).toBe(ALERT_TYPES.WARNING);
    });

    it('should return "warning" for hot lead messages', () => {
      const result = getAlertType('Hot lead from healthcare sector needs proposal by EOD');
      expect(result).toBe(ALERT_TYPES.WARNING);
    });

    it('should return "warning" for urgent messages', () => {
      const result = getAlertType('Urgent action needed');
      expect(result).toBe(ALERT_TYPES.WARNING);
    });
  });

  describe('success alerts', () => {
    it('should return "success" for completed messages', () => {
      const result = getAlertType('Call campaign completed - 85% contact rate achieved');
      expect(result).toBe(ALERT_TYPES.SUCCESS);
    });

    it('should return "success" for achieved messages', () => {
      const result = getAlertType('Monthly sales targets achieved - great team performance');
      expect(result).toBe(ALERT_TYPES.SUCCESS);
    });

    it('should return "success" for improved messages', () => {
      const result = getAlertType('Conversion rate improved by 8% this week');
      expect(result).toBe(ALERT_TYPES.SUCCESS);
    });

    it('should return "success" for closed messages', () => {
      const result = getAlertType('Deal closed successfully');
      expect(result).toBe(ALERT_TYPES.SUCCESS);
    });
  });

  describe('error alerts', () => {
    it('should return "error" for error messages', () => {
      const result = getAlertType('An error occurred');
      expect(result).toBe(ALERT_TYPES.ERROR);
    });

    it('should return "error" for failed messages', () => {
      const result = getAlertType('Operation failed');
      expect(result).toBe(ALERT_TYPES.ERROR);
    });
  });

  describe('default behavior', () => {
    it('should return "info" for unrecognized messages', () => {
      const result = getAlertType('Random message without keywords');
      expect(result).toBe(ALERT_TYPES.INFO);
    });

    it('should return "info" for empty string', () => {
      const result = getAlertType('');
      expect(result).toBe(ALERT_TYPES.INFO);
    });

    it('should return "info" for null/undefined', () => {
      expect(getAlertType(null)).toBe(ALERT_TYPES.INFO);
      expect(getAlertType(undefined)).toBe(ALERT_TYPES.INFO);
    });
  });

  describe('case insensitivity', () => {
    it('should match lowercase keywords', () => {
      const result = getAlertType('immediate action needed');
      expect(result).toBe(ALERT_TYPES.WARNING);
    });

    it('should match uppercase keywords', () => {
      const result = getAlertType('IMMEDIATE ACTION NEEDED');
      expect(result).toBe(ALERT_TYPES.WARNING);
    });

    it('should match mixed case keywords', () => {
      const result = getAlertType('Immediate Action Needed');
      expect(result).toBe(ALERT_TYPES.WARNING);
    });
  });
});

// =============================================================================
// exportToCSV Tests
// =============================================================================

describe('exportToCSV', () => {
  let mockLink;
  let appendChildSpy;
  let removeChildSpy;

  beforeEach(() => {
    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    // Reset createElement mock to return our mock link
    document.createElement = vi.fn((tagName) => {
      if (tagName === 'a') {
        return mockLink;
      }
      return document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
    });

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
  });

  afterEach(() => {
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  const mockExportData = {
    zooData: {
      population: 847,
      temperature: 342,
      humidity: 67,
      lastUpdated: '1/1/2024, 12:00:00 PM',
    },
    activityData: [
      { name: 'Mon', leads: 120, callsCompleted: 15 },
      { name: 'Tue', leads: 150, callsCompleted: 22 },
    ],
    feedingData: [
      { name: 'Mon', efficiency: 80 },
      { name: 'Tue', efficiency: 85 },
    ],
    dietData: [
      { name: 'Website', value: 35 },
      { name: 'Referrals', value: 30 },
    ],
    alerts: [
      { message: 'Test alert 1', type: 'warning', time: '1 hour ago' },
      { message: 'Test alert 2', type: 'info', time: '2 hours ago' },
    ],
  };

  it('should create a Blob with CSV content', () => {
    exportToCSV(mockExportData, 'test.csv');
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('should set correct download filename', () => {
    exportToCSV(mockExportData, 'test-export.csv');
    expect(mockLink.download).toBe('test-export.csv');
  });

  it('should trigger download by clicking the link', () => {
    exportToCSV(mockExportData, 'test.csv');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should append and remove link from document body', () => {
    exportToCSV(mockExportData, 'test.csv');
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
  });

  it('should revoke the object URL after download', () => {
    exportToCSV(mockExportData, 'test.csv');
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should handle empty data arrays', () => {
    const emptyData = {
      zooData: {
        population: 0,
        temperature: 0,
        humidity: 0,
        lastUpdated: '',
      },
      activityData: [],
      feedingData: [],
      dietData: [],
      alerts: [],
    };

    expect(() => exportToCSV(emptyData, 'empty.csv')).not.toThrow();
  });

  it('should handle null/undefined data', () => {
    const nullData = {
      zooData: null,
      activityData: null,
      feedingData: null,
      dietData: null,
      alerts: null,
    };

    expect(() => exportToCSV(nullData, 'null.csv')).not.toThrow();
  });
});

// =============================================================================
// exportToJSON Tests
// =============================================================================

describe('exportToJSON', () => {
  let mockLink;
  let appendChildSpy;
  let removeChildSpy;

  beforeEach(() => {
    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    document.createElement = vi.fn((tagName) => {
      if (tagName === 'a') {
        return mockLink;
      }
      return document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
    });

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
  });

  afterEach(() => {
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  const mockData = {
    totalLeads: 847,
    callsMade: 342,
    meetingsScheduled: 67,
    alerts: [{ id: 1, message: 'Test' }],
  };

  it('should create a Blob with JSON content', () => {
    exportToJSON(mockData, 'test.json');
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('should set correct download filename', () => {
    exportToJSON(mockData, 'test-export.json');
    expect(mockLink.download).toBe('test-export.json');
  });

  it('should trigger download by clicking the link', () => {
    exportToJSON(mockData, 'test.json');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should append and remove link from document body', () => {
    exportToJSON(mockData, 'test.json');
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
  });

  it('should revoke the object URL after download', () => {
    exportToJSON(mockData, 'test.json');
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should handle empty objects', () => {
    expect(() => exportToJSON({}, 'empty.json')).not.toThrow();
  });

  it('should handle nested objects', () => {
    const nestedData = {
      level1: {
        level2: {
          level3: { value: 'deep' },
        },
      },
    };
    expect(() => exportToJSON(nestedData, 'nested.json')).not.toThrow();
  });

  it('should handle arrays', () => {
    const arrayData = [1, 2, 3, { nested: 'object' }];
    expect(() => exportToJSON(arrayData, 'array.json')).not.toThrow();
  });
});

// =============================================================================
// generateExportFilename Tests
// =============================================================================

describe('generateExportFilename', () => {
  beforeEach(() => {
    // Mock Date to get consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should generate filename with csv extension', () => {
    const result = generateExportFilename('csv');
    expect(result).toBe('leadflow-data-2024-06-15.csv');
  });

  it('should generate filename with json extension', () => {
    const result = generateExportFilename('json');
    expect(result).toBe('leadflow-data-2024-06-15.json');
  });

  it('should include current date in ISO format (date part only)', () => {
    const result = generateExportFilename('csv');
    expect(result).toContain('2024-06-15');
  });

  it('should work with any extension', () => {
    const result = generateExportFilename('xlsx');
    expect(result).toBe('leadflow-data-2024-06-15.xlsx');
  });

  it('should work with empty extension', () => {
    const result = generateExportFilename('');
    expect(result).toBe('leadflow-data-2024-06-15.');
  });

  it('should handle different dates correctly', () => {
    vi.setSystemTime(new Date('2026-12-31T23:59:59.000Z'));
    const result = generateExportFilename('csv');
    expect(result).toBe('leadflow-data-2026-12-31.csv');
  });

  it('should always start with leadflow-data prefix', () => {
    const result = generateExportFilename('csv');
    expect(result.startsWith('leadflow-data-')).toBe(true);
  });

  it('should accept custom prefix', () => {
    const result = generateExportFilename('csv', 'custom-prefix');
    expect(result).toBe('custom-prefix-2024-06-15.csv');
  });
});

// =============================================================================
// Validation Utilities Tests
// =============================================================================

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.org')).toBe(true);
    expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
  });

  it('should return false for invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('should return true for valid phone numbers', () => {
    expect(isValidPhone('1234567890')).toBe(true);
    expect(isValidPhone('+1 (555) 123-4567')).toBe(true);
    expect(isValidPhone('555-123-4567')).toBe(true);
  });

  it('should return false for invalid phone numbers', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone(null)).toBe(false);
  });
});

// =============================================================================
// Misc Utilities Tests
// =============================================================================

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

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

  it('should throttle function calls', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should include prefix if provided', () => {
    const id = generateId('test');
    expect(id.startsWith('test-')).toBe(true);
  });
});

describe('deepClone', () => {
  it('should create a deep copy of objects', () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
  });

  it('should handle null', () => {
    expect(deepClone(null)).toBe(null);
  });

  it('should handle primitives', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('string')).toBe('string');
  });
});

describe('isEmpty', () => {
  it('should return true for empty values', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('  ')).toBe(true);
  });

  it('should return false for non-empty values', () => {
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty(0)).toBe(false);
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe('Utils Integration Tests', () => {
  it('should generate alert type from random message', () => {
    const message = getRandomAlertMessage();
    const type = getAlertType(message);
    expect([
      ALERT_TYPES.WARNING,
      ALERT_TYPES.INFO,
      ALERT_TYPES.SUCCESS,
      ALERT_TYPES.ERROR,
    ]).toContain(type);
  });

  it('should calculate and format conversion rate workflow', () => {
    const weekData = [
      { name: 'Mon', leads: 100 },
      { name: 'Tue', leads: 200 },
    ];
    const total = calculateTotalLeads(weekData);
    const conversionRate = Math.round((total / 300) * 100);
    const formatted = formatEfficiency(conversionRate);
    expect(formatted).toBe('100%');
  });
});

/**
 * Unit Tests for Utility Functions
 * Tests all functions in src/utils.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  calculateTotalLeads,
  formatEfficiency,
  getRandomAlertMessage,
  getAlertType,
  exportToCSV,
  exportToJSON,
  generateExportFilename,
} from "./utils";
import { alertMessages } from "./constants";

// =============================================================================
// calculateTotalLeads Tests
// =============================================================================

describe("calculateTotalLeads", () => {
  it("should calculate the sum of leads from week data", () => {
    const weekData = [
      { name: "Mon", leads: 120 },
      { name: "Tue", leads: 150 },
      { name: "Wed", leads: 180 },
    ];

    const result = calculateTotalLeads(weekData);
    expect(result).toBe(450);
  });

  it("should return 0 for empty array", () => {
    const result = calculateTotalLeads([]);
    expect(result).toBe(0);
  });

  it("should handle single day data", () => {
    const weekData = [{ name: "Mon", leads: 100 }];
    const result = calculateTotalLeads(weekData);
    expect(result).toBe(100);
  });

  it("should handle data with zero leads", () => {
    const weekData = [
      { name: "Mon", leads: 0 },
      { name: "Tue", leads: 0 },
    ];
    const result = calculateTotalLeads(weekData);
    expect(result).toBe(0);
  });

  it("should handle large numbers correctly", () => {
    const weekData = [
      { name: "Mon", leads: 10000 },
      { name: "Tue", leads: 20000 },
      { name: "Wed", leads: 30000 },
    ];
    const result = calculateTotalLeads(weekData);
    expect(result).toBe(60000);
  });

  it("should ignore other properties in data objects", () => {
    const weekData = [
      { name: "Mon", leads: 100, callsCompleted: 15, extra: "data" },
      { name: "Tue", leads: 200, callsCompleted: 22, extra: "more" },
    ];
    const result = calculateTotalLeads(weekData);
    expect(result).toBe(300);
  });
});

// =============================================================================
// formatEfficiency Tests
// =============================================================================

describe("formatEfficiency", () => {
  it("should format efficiency as percentage string", () => {
    expect(formatEfficiency(85)).toBe("85%");
  });

  it("should handle zero efficiency", () => {
    expect(formatEfficiency(0)).toBe("0%");
  });

  it("should handle 100% efficiency", () => {
    expect(formatEfficiency(100)).toBe("100%");
  });

  it("should handle decimal efficiency values", () => {
    expect(formatEfficiency(85.5)).toBe("85.5%");
  });

  it("should handle negative values", () => {
    expect(formatEfficiency(-10)).toBe("-10%");
  });

  it("should handle values over 100", () => {
    expect(formatEfficiency(150)).toBe("150%");
  });

  it("should handle string input that can be coerced", () => {
    expect(formatEfficiency("75")).toBe("75%");
  });
});

// =============================================================================
// getRandomAlertMessage Tests
// =============================================================================

describe("getRandomAlertMessage", () => {
  it("should return a string", () => {
    const result = getRandomAlertMessage();
    expect(typeof result).toBe("string");
  });

  it("should return a message from the predefined list", () => {
    const result = getRandomAlertMessage();
    expect(alertMessages).toContain(result);
  });

  it("should return non-empty strings", () => {
    for (let i = 0; i < 10; i++) {
      const result = getRandomAlertMessage();
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it("should eventually return different messages (randomness test)", () => {
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

describe("getAlertType", () => {
  describe("warning alerts", () => {
    it('should return "warning" for immediate follow-up messages', () => {
      const result = getAlertType(
        "High-value lead from FinanceX requires immediate follow-up",
      );
      expect(result).toBe("warning");
    });

    it('should return "warning" for pending messages', () => {
      const result = getAlertType(
        "5 leads pending outreach for more than 48 hours",
      );
      expect(result).toBe("warning");
    });

    it('should return "warning" for requires messages', () => {
      const result = getAlertType("This task requires attention");
      expect(result).toBe("warning");
    });

    it('should return "warning" for high-value lead messages', () => {
      const result = getAlertType("High-value opportunity identified");
      expect(result).toBe("warning");
    });

    it('should return "warning" for hot lead messages', () => {
      const result = getAlertType(
        "Hot lead from healthcare sector needs proposal by EOD",
      );
      expect(result).toBe("warning");
    });
  });

  describe("info alerts", () => {
    it('should return "info" for completed messages', () => {
      const result = getAlertType(
        "Call campaign completed - 85% contact rate achieved",
      );
      expect(result).toBe("info");
    });

    it('should return "info" for achieved messages', () => {
      const result = getAlertType(
        "Monthly sales targets achieved - great team performance",
      );
      expect(result).toBe("info");
    });

    it('should return "info" for improved messages', () => {
      const result = getAlertType("Conversion rate improved by 8% this week");
      expect(result).toBe("info");
    });
  });

  describe("default behavior", () => {
    it('should return "info" for unrecognized messages', () => {
      const result = getAlertType("Random message without keywords");
      expect(result).toBe("info");
    });

    it('should return "info" for empty string', () => {
      const result = getAlertType("");
      expect(result).toBe("info");
    });
  });

  describe("case sensitivity", () => {
    it("should be case sensitive (lowercase keywords)", () => {
      const result = getAlertType("immediate action needed");
      expect(result).toBe("warning");
    });

    it("should not match uppercase keywords (default to info)", () => {
      const result = getAlertType("IMMEDIATE ACTION NEEDED");
      expect(result).toBe("info");
    });
  });
});

// =============================================================================
// exportToCSV Tests
// =============================================================================

describe("exportToCSV", () => {
  let mockLink;
  let appendChildSpy;
  let removeChildSpy;

  beforeEach(() => {
    mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
    };

    // Reset createElement mock to return our mock link
    document.createElement = vi.fn((tagName) => {
      if (tagName === "a") {
        return mockLink;
      }
      return document.createElementNS("http://www.w3.org/1999/xhtml", tagName);
    });

    appendChildSpy = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation(() => {});
    removeChildSpy = vi
      .spyOn(document.body, "removeChild")
      .mockImplementation(() => {});
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
      lastUpdated: "1/1/2024, 12:00:00 PM",
    },
    activityData: [
      { name: "Mon", leads: 120, callsCompleted: 15 },
      { name: "Tue", leads: 150, callsCompleted: 22 },
    ],
    feedingData: [
      { name: "Mon", efficiency: 80 },
      { name: "Tue", efficiency: 85 },
    ],
    dietData: [
      { name: "Website", value: 35 },
      { name: "Referrals", value: 30 },
    ],
    alerts: [
      { message: "Test alert 1", type: "warning", time: "1 hour ago" },
      { message: "Test alert 2", type: "info", time: "2 hours ago" },
    ],
  };

  it("should create a Blob with CSV content", () => {
    exportToCSV(mockExportData, "test.csv");
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("should set correct download filename", () => {
    exportToCSV(mockExportData, "test-export.csv");
    expect(mockLink.download).toBe("test-export.csv");
  });

  it("should trigger download by clicking the link", () => {
    exportToCSV(mockExportData, "test.csv");
    expect(mockLink.click).toHaveBeenCalled();
  });

  it("should append and remove link from document body", () => {
    exportToCSV(mockExportData, "test.csv");
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
  });

  it("should revoke the object URL after download", () => {
    exportToCSV(mockExportData, "test.csv");
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("should handle empty data arrays", () => {
    const emptyData = {
      zooData: {
        population: 0,
        temperature: 0,
        humidity: 0,
        lastUpdated: "",
      },
      activityData: [],
      feedingData: [],
      dietData: [],
      alerts: [],
    };

    expect(() => exportToCSV(emptyData, "empty.csv")).not.toThrow();
  });
});

// =============================================================================
// exportToJSON Tests
// =============================================================================

describe("exportToJSON", () => {
  let mockLink;
  let appendChildSpy;
  let removeChildSpy;

  beforeEach(() => {
    mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
    };

    document.createElement = vi.fn((tagName) => {
      if (tagName === "a") {
        return mockLink;
      }
      return document.createElementNS("http://www.w3.org/1999/xhtml", tagName);
    });

    appendChildSpy = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation(() => {});
    removeChildSpy = vi
      .spyOn(document.body, "removeChild")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  const mockData = {
    totalLeads: 847,
    callsMade: 342,
    meetingsScheduled: 67,
    alerts: [{ id: 1, message: "Test" }],
  };

  it("should create a Blob with JSON content", () => {
    exportToJSON(mockData, "test.json");
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("should set correct download filename", () => {
    exportToJSON(mockData, "test-export.json");
    expect(mockLink.download).toBe("test-export.json");
  });

  it("should trigger download by clicking the link", () => {
    exportToJSON(mockData, "test.json");
    expect(mockLink.click).toHaveBeenCalled();
  });

  it("should append and remove link from document body", () => {
    exportToJSON(mockData, "test.json");
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
  });

  it("should revoke the object URL after download", () => {
    exportToJSON(mockData, "test.json");
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("should handle empty objects", () => {
    expect(() => exportToJSON({}, "empty.json")).not.toThrow();
  });

  it("should handle nested objects", () => {
    const nestedData = {
      level1: {
        level2: {
          level3: { value: "deep" },
        },
      },
    };
    expect(() => exportToJSON(nestedData, "nested.json")).not.toThrow();
  });

  it("should handle arrays", () => {
    const arrayData = [1, 2, 3, { nested: "object" }];
    expect(() => exportToJSON(arrayData, "array.json")).not.toThrow();
  });
});

// =============================================================================
// generateExportFilename Tests
// =============================================================================

describe("generateExportFilename", () => {
  beforeEach(() => {
    // Mock Date to get consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should generate filename with csv extension", () => {
    const result = generateExportFilename("csv");
    expect(result).toBe("leadflow-data-2024-06-15.csv");
  });

  it("should generate filename with json extension", () => {
    const result = generateExportFilename("json");
    expect(result).toBe("leadflow-data-2024-06-15.json");
  });

  it("should include current date in ISO format (date part only)", () => {
    const result = generateExportFilename("csv");
    expect(result).toContain("2024-06-15");
  });

  it("should work with any extension", () => {
    const result = generateExportFilename("xlsx");
    expect(result).toBe("leadflow-data-2024-06-15.xlsx");
  });

  it("should work with empty extension", () => {
    const result = generateExportFilename("");
    expect(result).toBe("leadflow-data-2024-06-15.");
  });

  it("should handle different dates correctly", () => {
    vi.setSystemTime(new Date("2025-12-31T23:59:59.000Z"));
    const result = generateExportFilename("csv");
    expect(result).toBe("leadflow-data-2025-12-31.csv");
  });

  it("should always start with leadflow-data prefix", () => {
    const result = generateExportFilename("csv");
    expect(result.startsWith("leadflow-data-")).toBe(true);
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe("Utils Integration Tests", () => {
  it("should generate alert type from random message", () => {
    const message = getRandomAlertMessage();
    const type = getAlertType(message);
    expect(["warning", "info"]).toContain(type);
  });

  it("should calculate and format conversion rate workflow", () => {
    const weekData = [
      { name: "Mon", leads: 100 },
      { name: "Tue", leads: 200 },
    ];
    const total = calculateTotalLeads(weekData);
    const conversionRate = Math.round((total / 300) * 100);
    const formatted = formatEfficiency(conversionRate);
    expect(formatted).toBe("100%");
  });
});

/**
 * Unit Tests for Constants
 * Tests all constants exported from src/constants.js
 */

import { describe, it, expect } from "vitest";
import {
  // Activity Data
  activityWeekData,
  activityMonthData,
  activityYearData,
  // Conversion Rate Data
  conversionWeekData,
  conversionMonthData,
  conversionYearData,
  // Source Distribution Data
  sourceWeekData,
  sourceMonthData,
  sourceYearData,
  // Chart Colors
  CHART_COLORS_DARK,
  CHART_COLORS_LIGHT,
  getChartColors,
  // Animation Variants
  cardVariants,
  dropdownVariants,
  staggerContainerVariants,
  // Initial Data
  initialLeadData,
  initialNotes,
  initialAlerts,
  alertMessages,
  // Typography
  fontFamily,
  fontFamilyHeading,
} from "./constants/index.js";

// =============================================================================
// Activity Data Tests
// =============================================================================

describe("Activity Week Data", () => {
  it("should have 7 days of data", () => {
    expect(activityWeekData).toHaveLength(7);
  });

  it("should have correct day names", () => {
    const dayNames = activityWeekData.map((d) => d.name);
    expect(dayNames).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  });

  it("should have leads property for each day", () => {
    activityWeekData.forEach((day) => {
      expect(day).toHaveProperty("leads");
      expect(typeof day.leads).toBe("number");
      expect(day.leads).toBeGreaterThan(0);
    });
  });

  it("should have callsCompleted property for each day", () => {
    activityWeekData.forEach((day) => {
      expect(day).toHaveProperty("callsCompleted");
      expect(typeof day.callsCompleted).toBe("number");
      expect(day.callsCompleted).toBeGreaterThan(0);
    });
  });
});

describe("Activity Month Data", () => {
  it("should have 4 weeks of data", () => {
    expect(activityMonthData).toHaveLength(4);
  });

  it("should have correct week names", () => {
    const weekNames = activityMonthData.map((d) => d.name);
    expect(weekNames).toEqual(["Week 1", "Week 2", "Week 3", "Week 4"]);
  });

  it("should have leads greater than week data (aggregated)", () => {
    const monthLeads = activityMonthData[0].leads;
    const weekLeads = activityWeekData[0].leads;
    expect(monthLeads).toBeGreaterThan(weekLeads);
  });
});

describe("Activity Year Data", () => {
  it("should have 12 months of data", () => {
    expect(activityYearData).toHaveLength(12);
  });

  it("should have correct month names", () => {
    const monthNames = activityYearData.map((d) => d.name);
    expect(monthNames).toEqual(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
  });
});

// =============================================================================
// Conversion Rate Data Tests
// =============================================================================

describe("Conversion Week Data", () => {
  it("should have 7 days of data", () => {
    expect(conversionWeekData).toHaveLength(7);
  });

  it("should have efficiency property for each day", () => {
    conversionWeekData.forEach((day) => {
      expect(day).toHaveProperty("efficiency");
      expect(typeof day.efficiency).toBe("number");
      expect(day.efficiency).toBeGreaterThan(0);
      expect(day.efficiency).toBeLessThanOrEqual(100);
    });
  });
});

describe("Conversion Month Data", () => {
  it("should have 4 weeks of data", () => {
    expect(conversionMonthData).toHaveLength(4);
  });

  it("should have efficiency values between 0 and 100", () => {
    conversionMonthData.forEach((week) => {
      expect(week.efficiency).toBeGreaterThanOrEqual(0);
      expect(week.efficiency).toBeLessThanOrEqual(100);
    });
  });
});

describe("Conversion Year Data", () => {
  it("should have 12 months of data", () => {
    expect(conversionYearData).toHaveLength(12);
  });
});

// =============================================================================
// Source Distribution Data Tests
// =============================================================================

describe("Source Week Data", () => {
  it("should have lead source categories", () => {
    expect(sourceWeekData.length).toBeGreaterThan(0);
  });

  it("should have name and value properties", () => {
    sourceWeekData.forEach((source) => {
      expect(source).toHaveProperty("name");
      expect(source).toHaveProperty("value");
      expect(typeof source.name).toBe("string");
      expect(typeof source.value).toBe("number");
    });
  });

  it("should have values that could represent percentages", () => {
    sourceWeekData.forEach((source) => {
      expect(source.value).toBeGreaterThanOrEqual(0);
      expect(source.value).toBeLessThanOrEqual(100);
    });
  });

  it("should have expected source names", () => {
    const names = sourceWeekData.map((d) => d.name);
    expect(names).toContain("Website");
    expect(names).toContain("Referrals");
  });
});

describe("Source Month Data", () => {
  it("should have same categories as week data", () => {
    expect(sourceMonthData.length).toBe(sourceWeekData.length);
  });
});

describe("Source Year Data", () => {
  it("should have same categories as week data", () => {
    expect(sourceYearData.length).toBe(sourceWeekData.length);
  });
});

// =============================================================================
// Chart Colors Tests
// =============================================================================

describe("Chart Colors", () => {
  it("CHART_COLORS_DARK should be an array of hex colors", () => {
    expect(Array.isArray(CHART_COLORS_DARK)).toBe(true);
    CHART_COLORS_DARK.forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it("CHART_COLORS_LIGHT should be an array of hex colors", () => {
    expect(Array.isArray(CHART_COLORS_LIGHT)).toBe(true);
    CHART_COLORS_LIGHT.forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it("should have same number of colors in both palettes", () => {
    expect(CHART_COLORS_DARK.length).toBe(CHART_COLORS_LIGHT.length);
  });

  it("getChartColors should return dark colors when isDark is true", () => {
    expect(getChartColors(true)).toEqual(CHART_COLORS_DARK);
  });

  it("getChartColors should return light colors when isDark is false", () => {
    expect(getChartColors(false)).toEqual(CHART_COLORS_LIGHT);
  });
});

// =============================================================================
// Animation Variants Tests
// =============================================================================

describe("Card Variants", () => {
  it("should have hidden and visible states", () => {
    expect(cardVariants).toHaveProperty("hidden");
    expect(cardVariants).toHaveProperty("visible");
  });

  it("hidden state should have opacity 0", () => {
    expect(cardVariants.hidden.opacity).toBe(0);
  });

  it("visible state should have opacity 1", () => {
    expect(cardVariants.visible.opacity).toBe(1);
  });
});

describe("Dropdown Variants", () => {
  it("should have closed and open states", () => {
    expect(dropdownVariants).toHaveProperty("closed");
    expect(dropdownVariants).toHaveProperty("open");
  });

  it("closed state should have opacity 0", () => {
    expect(dropdownVariants.closed.opacity).toBe(0);
  });

  it("open state should have opacity 1", () => {
    expect(dropdownVariants.open.opacity).toBe(1);
  });

  it("open state should have y at 0", () => {
    expect(dropdownVariants.open.y).toBe(0);
  });
});

describe("Stagger Container Variants", () => {
  it("should have hidden and visible states", () => {
    expect(staggerContainerVariants).toHaveProperty("hidden");
    expect(staggerContainerVariants).toHaveProperty("visible");
  });

  it("visible state should have stagger children transition", () => {
    expect(staggerContainerVariants.visible.transition).toHaveProperty("staggerChildren");
  });
});

// =============================================================================
// Initial Lead Data Tests
// =============================================================================

describe("Initial Lead Data", () => {
  it("should have totalLeads property", () => {
    expect(initialLeadData).toHaveProperty("totalLeads");
    expect(typeof initialLeadData.totalLeads).toBe("number");
    expect(initialLeadData.totalLeads).toBeGreaterThan(0);
  });

  it("should have callsMade property", () => {
    expect(initialLeadData).toHaveProperty("callsMade");
    expect(typeof initialLeadData.callsMade).toBe("number");
    expect(initialLeadData.callsMade).toBeGreaterThan(0);
  });

  it("should have meetingsScheduled property", () => {
    expect(initialLeadData).toHaveProperty("meetingsScheduled");
    expect(typeof initialLeadData.meetingsScheduled).toBe("number");
    expect(initialLeadData.meetingsScheduled).toBeGreaterThan(0);
  });

  it("should have lastUpdated property", () => {
    expect(initialLeadData).toHaveProperty("lastUpdated");
    expect(typeof initialLeadData.lastUpdated).toBe("string");
  });
});

// =============================================================================
// Initial Notes Tests
// =============================================================================

describe("Initial Notes", () => {
  it("should be an array", () => {
    expect(Array.isArray(initialNotes)).toBe(true);
  });

  it("should have at least one note", () => {
    expect(initialNotes.length).toBeGreaterThan(0);
  });

  it("each note should have id, content, and timestamp", () => {
    initialNotes.forEach((note) => {
      expect(note).toHaveProperty("id");
      expect(note).toHaveProperty("content");
      expect(note).toHaveProperty("timestamp");
    });
  });

  it("note ids should be unique", () => {
    const ids = initialNotes.map((n) => n.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });
});

// =============================================================================
// Initial Alerts Tests
// =============================================================================

describe("Initial Alerts", () => {
  it("should be an array", () => {
    expect(Array.isArray(initialAlerts)).toBe(true);
  });

  it("should have at least one alert", () => {
    expect(initialAlerts.length).toBeGreaterThan(0);
  });

  it("each alert should have id, message, type, and time", () => {
    initialAlerts.forEach((alert) => {
      expect(alert).toHaveProperty("id");
      expect(alert).toHaveProperty("message");
      expect(alert).toHaveProperty("type");
      expect(alert).toHaveProperty("time");
    });
  });

  it("alert types should be valid", () => {
    const validTypes = ["info", "warning", "error", "success"];
    initialAlerts.forEach((alert) => {
      expect(validTypes).toContain(alert.type);
    });
  });
});

// =============================================================================
// Alert Messages Tests
// =============================================================================

describe("Alert Messages", () => {
  it("should be an array", () => {
    expect(Array.isArray(alertMessages)).toBe(true);
  });

  it("should have multiple messages", () => {
    expect(alertMessages.length).toBeGreaterThan(5);
  });

  it("each message should be a non-empty string", () => {
    alertMessages.forEach((message) => {
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(0);
    });
  });
});

// =============================================================================
// Typography Tests
// =============================================================================

describe("Typography Constants", () => {
  it("fontFamily should be a string", () => {
    expect(typeof fontFamily).toBe("string");
  });

  it("fontFamily should contain a font name", () => {
    expect(fontFamily.length).toBeGreaterThan(0);
  });

  it("fontFamilyHeading should be a string", () => {
    expect(typeof fontFamilyHeading).toBe("string");
  });

  it("fontFamilyHeading should contain a font name", () => {
    expect(fontFamilyHeading.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// Data Consistency Tests
// =============================================================================

describe("Data Consistency", () => {
  it("all activity data periods should have leads property", () => {
    [activityWeekData, activityMonthData, activityYearData].forEach((data) => {
      data.forEach((item) => {
        expect(item).toHaveProperty("leads");
      });
    });
  });

  it("all conversion data periods should have efficiency property", () => {
    [conversionWeekData, conversionMonthData, conversionYearData].forEach((data) => {
      data.forEach((item) => {
        expect(item).toHaveProperty("efficiency");
      });
    });
  });

  it("all source data periods should have value property", () => {
    [sourceWeekData, sourceMonthData, sourceYearData].forEach((data) => {
      data.forEach((item) => {
        expect(item).toHaveProperty("value");
      });
    });
  });
});

// =============================================================================
// Constants Integration Tests
// =============================================================================

describe("Constants Integration", () => {
  it("should have consistent structure across all activity data periods", () => {
    const checkStructure = (data) => {
      data.forEach((item) => {
        expect(item).toHaveProperty("name", expect.any(String));
        expect(item).toHaveProperty("leads", expect.any(Number));
        expect(item).toHaveProperty("callsCompleted", expect.any(Number));
      });
    };

    checkStructure(activityWeekData);
    checkStructure(activityMonthData);
    checkStructure(activityYearData);
  });

  it("should have consistent structure across all conversion data periods", () => {
    const checkStructure = (data) => {
      data.forEach((item) => {
        expect(item).toHaveProperty("name", expect.any(String));
        expect(item).toHaveProperty("efficiency", expect.any(Number));
      });
    };

    checkStructure(conversionWeekData);
    checkStructure(conversionMonthData);
    checkStructure(conversionYearData);
  });

  it("should have consistent structure across all source data periods", () => {
    const checkStructure = (data) => {
      data.forEach((item) => {
        expect(item).toHaveProperty("name", expect.any(String));
        expect(item).toHaveProperty("value", expect.any(Number));
      });
    };

    checkStructure(sourceWeekData);
    checkStructure(sourceMonthData);
    checkStructure(sourceYearData);
  });

  it("should have same number of colors in dark and light palettes", () => {
    expect(CHART_COLORS_DARK.length).toBe(CHART_COLORS_LIGHT.length);
  });

  it("should have colors that match source data categories count", () => {
    expect(CHART_COLORS_DARK.length).toBeGreaterThanOrEqual(sourceWeekData.length);
    expect(CHART_COLORS_LIGHT.length).toBeGreaterThanOrEqual(sourceWeekData.length);
  });

  it("should have messages in alertMessages that match initial alerts", () => {
    initialAlerts.forEach((alert) => {
      expect(alertMessages).toContain(alert.message);
    });
  });
});

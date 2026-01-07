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
  weekData,
  monthData,
  yearData,
  // Feeding Efficiency Data
  feedingWeekData,
  feedingMonthData,
  feedingYearData,
  foragingWeekData,
  foragingMonthData,
  foragingYearData,
  // Diet Distribution Data
  dietWeekData,
  dietMonthData,
  dietYearData,
  foodWeekData,
  foodMonthData,
  foodYearData,
  // Chart Colors
  COLORS_DARK,
  COLORS_LIGHT,
  getColors,
  // Animation Variants
  cardVariants,
  dropdownVariants,
  staggerContainerVariants,
  // Initial Data
  initialZooData,
  initialColonyData,
  initialNotes,
  initialAlerts,
  alertMessages,
  // Typography
  fontFamily,
  fontFamilyHeading,
} from "./constants";

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

  it("should have animals property for each day", () => {
    activityWeekData.forEach((day) => {
      expect(day).toHaveProperty("animals");
      expect(typeof day.animals).toBe("number");
      expect(day.animals).toBeGreaterThan(0);
    });
  });

  it("should have feedingCompleted property for each day", () => {
    activityWeekData.forEach((day) => {
      expect(day).toHaveProperty("feedingCompleted");
      expect(typeof day.feedingCompleted).toBe("number");
      expect(day.feedingCompleted).toBeGreaterThanOrEqual(0);
    });
  });

  it("should be aliased as weekData for backward compatibility", () => {
    expect(weekData).toBe(activityWeekData);
  });
});

describe("Activity Month Data", () => {
  it("should have 4 weeks of data", () => {
    expect(activityMonthData).toHaveLength(4);
  });

  it("should have correct week names", () => {
    const weekNames = activityMonthData.map((w) => w.name);
    expect(weekNames).toEqual(["Week 1", "Week 2", "Week 3", "Week 4"]);
  });

  it("should have animals and feedingCompleted properties", () => {
    activityMonthData.forEach((week) => {
      expect(week).toHaveProperty("animals");
      expect(week).toHaveProperty("feedingCompleted");
      expect(typeof week.animals).toBe("number");
      expect(typeof week.feedingCompleted).toBe("number");
    });
  });

  it("should be aliased as monthData for backward compatibility", () => {
    expect(monthData).toBe(activityMonthData);
  });
});

describe("Activity Year Data", () => {
  it("should have 12 months of data", () => {
    expect(activityYearData).toHaveLength(12);
  });

  it("should have correct month abbreviations", () => {
    const monthNames = activityYearData.map((m) => m.name);
    expect(monthNames).toEqual([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]);
  });

  it("should have animals and feedingCompleted properties for each month", () => {
    activityYearData.forEach((month) => {
      expect(month).toHaveProperty("animals");
      expect(month).toHaveProperty("feedingCompleted");
      expect(typeof month.animals).toBe("number");
      expect(typeof month.feedingCompleted).toBe("number");
    });
  });

  it("should be aliased as yearData for backward compatibility", () => {
    expect(yearData).toBe(activityYearData);
  });
});

// =============================================================================
// Feeding Efficiency Data Tests
// =============================================================================

describe("Feeding Week Data", () => {
  it("should have 7 days of data", () => {
    expect(feedingWeekData).toHaveLength(7);
  });

  it("should have correct day names", () => {
    const dayNames = feedingWeekData.map((d) => d.name);
    expect(dayNames).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  });

  it("should have efficiency property with values between 0 and 100", () => {
    feedingWeekData.forEach((day) => {
      expect(day).toHaveProperty("efficiency");
      expect(typeof day.efficiency).toBe("number");
      expect(day.efficiency).toBeGreaterThanOrEqual(0);
      expect(day.efficiency).toBeLessThanOrEqual(100);
    });
  });

  it("should be aliased as foragingWeekData for backward compatibility", () => {
    expect(foragingWeekData).toBe(feedingWeekData);
  });
});

describe("Feeding Month Data", () => {
  it("should have 4 weeks of data", () => {
    expect(feedingMonthData).toHaveLength(4);
  });

  it("should have efficiency property for each week", () => {
    feedingMonthData.forEach((week) => {
      expect(week).toHaveProperty("efficiency");
      expect(typeof week.efficiency).toBe("number");
      expect(week.efficiency).toBeGreaterThanOrEqual(0);
      expect(week.efficiency).toBeLessThanOrEqual(100);
    });
  });

  it("should be aliased as foragingMonthData for backward compatibility", () => {
    expect(foragingMonthData).toBe(feedingMonthData);
  });
});

describe("Feeding Year Data", () => {
  it("should have 12 months of data", () => {
    expect(feedingYearData).toHaveLength(12);
  });

  it("should have efficiency property for each month", () => {
    feedingYearData.forEach((month) => {
      expect(month).toHaveProperty("efficiency");
      expect(typeof month.efficiency).toBe("number");
    });
  });

  it("should be aliased as foragingYearData for backward compatibility", () => {
    expect(foragingYearData).toBe(feedingYearData);
  });
});

// =============================================================================
// Diet Distribution Data Tests
// =============================================================================

describe("Diet Week Data", () => {
  it("should have 4 food categories", () => {
    expect(dietWeekData).toHaveLength(4);
  });

  it("should have correct food category names", () => {
    const categoryNames = dietWeekData.map((d) => d.name);
    expect(categoryNames).toContain("Fresh Produce");
    expect(categoryNames).toContain("Protein/Meat");
    expect(categoryNames).toContain("Grains & Pellets");
    expect(categoryNames).toContain("Supplements");
  });

  it("should have value property for each category", () => {
    dietWeekData.forEach((category) => {
      expect(category).toHaveProperty("value");
      expect(typeof category.value).toBe("number");
      expect(category.value).toBeGreaterThan(0);
    });
  });

  it("should have values that sum to 100 (percentage)", () => {
    const total = dietWeekData.reduce((sum, item) => sum + item.value, 0);
    expect(total).toBe(100);
  });

  it("should be aliased as foodWeekData for backward compatibility", () => {
    expect(foodWeekData).toBe(dietWeekData);
  });
});

describe("Diet Month Data", () => {
  it("should have 4 food categories", () => {
    expect(dietMonthData).toHaveLength(4);
  });

  it("should have values that sum to 100 (percentage)", () => {
    const total = dietMonthData.reduce((sum, item) => sum + item.value, 0);
    expect(total).toBe(100);
  });

  it("should be aliased as foodMonthData for backward compatibility", () => {
    expect(foodMonthData).toBe(dietMonthData);
  });
});

describe("Diet Year Data", () => {
  it("should have 4 food categories", () => {
    expect(dietYearData).toHaveLength(4);
  });

  it("should have values that sum to 100 (percentage)", () => {
    const total = dietYearData.reduce((sum, item) => sum + item.value, 0);
    expect(total).toBe(100);
  });

  it("should be aliased as foodYearData for backward compatibility", () => {
    expect(foodYearData).toBe(dietYearData);
  });
});

// =============================================================================
// Chart Colors Tests
// =============================================================================

describe("COLORS_DARK", () => {
  it("should have 4 colors", () => {
    expect(COLORS_DARK).toHaveLength(4);
  });

  it("should contain valid hex color codes", () => {
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    COLORS_DARK.forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });
  });

  it("should have specific dark theme colors", () => {
    expect(COLORS_DARK).toEqual(["#60a5fa", "#34d399", "#fbbf24", "#f87171"]);
  });
});

describe("COLORS_LIGHT", () => {
  it("should have 4 colors", () => {
    expect(COLORS_LIGHT).toHaveLength(4);
  });

  it("should contain valid hex color codes", () => {
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    COLORS_LIGHT.forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });
  });

  it("should have specific light theme colors", () => {
    expect(COLORS_LIGHT).toEqual(["#2563eb", "#059669", "#d97706", "#dc2626"]);
  });
});

describe("getColors", () => {
  it("should return COLORS_DARK when darkMode is true", () => {
    const result = getColors(true);
    expect(result).toBe(COLORS_DARK);
  });

  it("should return COLORS_LIGHT when darkMode is false", () => {
    const result = getColors(false);
    expect(result).toBe(COLORS_LIGHT);
  });

  it("should return COLORS_LIGHT for falsy values", () => {
    expect(getColors(null)).toBe(COLORS_LIGHT);
    expect(getColors(undefined)).toBe(COLORS_LIGHT);
    expect(getColors(0)).toBe(COLORS_LIGHT);
    expect(getColors("")).toBe(COLORS_LIGHT);
  });

  it("should return COLORS_DARK for truthy values", () => {
    expect(getColors(1)).toBe(COLORS_DARK);
    expect(getColors("dark")).toBe(COLORS_DARK);
    expect(getColors({})).toBe(COLORS_DARK);
  });
});

// =============================================================================
// Animation Variants Tests
// =============================================================================

describe("cardVariants", () => {
  it("should have hidden state", () => {
    expect(cardVariants).toHaveProperty("hidden");
  });

  it("should have visible state", () => {
    expect(cardVariants).toHaveProperty("visible");
  });

  it("should have opacity and y transform in hidden state", () => {
    expect(cardVariants.hidden).toHaveProperty("opacity", 0);
    expect(cardVariants.hidden).toHaveProperty("y", 20);
  });

  it("should have opacity and y transform in visible state", () => {
    expect(cardVariants.visible).toHaveProperty("opacity", 1);
    expect(cardVariants.visible).toHaveProperty("y", 0);
  });

  it("should have transition in visible state", () => {
    expect(cardVariants.visible).toHaveProperty("transition");
    expect(cardVariants.visible.transition).toHaveProperty("duration");
    expect(cardVariants.visible.transition).toHaveProperty("ease");
  });
});

describe("dropdownVariants", () => {
  it("should have closed state", () => {
    expect(dropdownVariants).toHaveProperty("closed");
  });

  it("should have open state", () => {
    expect(dropdownVariants).toHaveProperty("open");
  });

  it("should have opacity, y, and height in closed state", () => {
    expect(dropdownVariants.closed).toHaveProperty("opacity", 0);
    expect(dropdownVariants.closed).toHaveProperty("y", -10);
    expect(dropdownVariants.closed).toHaveProperty("height", 0);
  });

  it("should have opacity, y, and height in open state", () => {
    expect(dropdownVariants.open).toHaveProperty("opacity", 1);
    expect(dropdownVariants.open).toHaveProperty("y", 0);
    expect(dropdownVariants.open).toHaveProperty("height", "auto");
  });

  it("should have transitions for both states", () => {
    expect(dropdownVariants.closed).toHaveProperty("transition");
    expect(dropdownVariants.open).toHaveProperty("transition");
  });
});

describe("staggerContainerVariants", () => {
  it("should have hidden state", () => {
    expect(staggerContainerVariants).toHaveProperty("hidden");
  });

  it("should have visible state", () => {
    expect(staggerContainerVariants).toHaveProperty("visible");
  });

  it("should have opacity in hidden state", () => {
    expect(staggerContainerVariants.hidden).toHaveProperty("opacity", 0);
  });

  it("should have stagger transition in visible state", () => {
    expect(staggerContainerVariants.visible).toHaveProperty("transition");
    expect(staggerContainerVariants.visible.transition).toHaveProperty(
      "staggerChildren",
    );
    expect(staggerContainerVariants.visible.transition).toHaveProperty(
      "delayChildren",
    );
  });
});

// =============================================================================
// Initial Zoo Data Tests
// =============================================================================

describe("initialZooData", () => {
  it("should have population property", () => {
    expect(initialZooData).toHaveProperty("population");
    expect(typeof initialZooData.population).toBe("number");
    expect(initialZooData.population).toBeGreaterThan(0);
  });

  it("should have temperature property", () => {
    expect(initialZooData).toHaveProperty("temperature");
    expect(typeof initialZooData.temperature).toBe("number");
  });

  it("should have humidity property", () => {
    expect(initialZooData).toHaveProperty("humidity");
    expect(typeof initialZooData.humidity).toBe("number");
    expect(initialZooData.humidity).toBeGreaterThanOrEqual(0);
    expect(initialZooData.humidity).toBeLessThanOrEqual(100);
  });

  it("should have lastUpdated property", () => {
    expect(initialZooData).toHaveProperty("lastUpdated");
    expect(typeof initialZooData.lastUpdated).toBe("string");
  });

  it("should be aliased as initialColonyData for backward compatibility", () => {
    expect(initialColonyData).toBe(initialZooData);
  });
});

// =============================================================================
// Initial Notes Tests
// =============================================================================

describe("initialNotes", () => {
  it("should be an array", () => {
    expect(Array.isArray(initialNotes)).toBe(true);
  });

  it("should have at least one note", () => {
    expect(initialNotes.length).toBeGreaterThan(0);
  });

  it("should have notes with required properties", () => {
    initialNotes.forEach((note) => {
      expect(note).toHaveProperty("id");
      expect(note).toHaveProperty("content");
      expect(note).toHaveProperty("timestamp");
    });
  });

  it("should have unique ids for each note", () => {
    const ids = initialNotes.map((note) => note.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have non-empty content for each note", () => {
    initialNotes.forEach((note) => {
      expect(note.content.length).toBeGreaterThan(0);
    });
  });
});

// =============================================================================
// Initial Alerts Tests
// =============================================================================

describe("initialAlerts", () => {
  it("should be an array", () => {
    expect(Array.isArray(initialAlerts)).toBe(true);
  });

  it("should have at least one alert", () => {
    expect(initialAlerts.length).toBeGreaterThan(0);
  });

  it("should have alerts with required properties", () => {
    initialAlerts.forEach((alert) => {
      expect(alert).toHaveProperty("id");
      expect(alert).toHaveProperty("message");
      expect(alert).toHaveProperty("type");
      expect(alert).toHaveProperty("time");
    });
  });

  it("should have unique ids for each alert", () => {
    const ids = initialAlerts.map((alert) => alert.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have valid alert types (warning or info)", () => {
    const validTypes = ["warning", "info"];
    initialAlerts.forEach((alert) => {
      expect(validTypes).toContain(alert.type);
    });
  });

  it("should have non-empty messages", () => {
    initialAlerts.forEach((alert) => {
      expect(alert.message.length).toBeGreaterThan(0);
    });
  });
});

// =============================================================================
// Alert Messages Tests
// =============================================================================

describe("alertMessages", () => {
  it("should be an array", () => {
    expect(Array.isArray(alertMessages)).toBe(true);
  });

  it("should have multiple messages", () => {
    expect(alertMessages.length).toBeGreaterThan(1);
  });

  it("should contain only strings", () => {
    alertMessages.forEach((message) => {
      expect(typeof message).toBe("string");
    });
  });

  it("should have non-empty messages", () => {
    alertMessages.forEach((message) => {
      expect(message.length).toBeGreaterThan(0);
    });
  });

  it("should contain zoo-related content", () => {
    const zooKeywords = [
      "enclosure",
      "temperature",
      "checkup",
      "stock",
      "alert",
      "behavior",
      "humidity",
      "animal",
      "feeding",
      "schedule",
    ];

    alertMessages.forEach((message) => {
      const containsKeyword = zooKeywords.some((keyword) =>
        message.toLowerCase().includes(keyword),
      );
      expect(containsKeyword).toBe(true);
    });
  });
});

// =============================================================================
// Typography Tests
// =============================================================================

describe("fontFamily", () => {
  it("should be defined", () => {
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

describe("fontFamilyHeading", () => {
  it("should be defined", () => {
    expect(fontFamilyHeading).toBeDefined();
  });

  it("should be a string", () => {
    expect(typeof fontFamilyHeading).toBe("string");
  });

  it("should contain Poppins font", () => {
    expect(fontFamilyHeading).toContain("Poppins");
  });

  it("should have sans-serif fallback", () => {
    expect(fontFamilyHeading).toContain("sans-serif");
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe("Constants Integration", () => {
  it("should have consistent structure across all activity data periods", () => {
    const checkStructure = (data) => {
      data.forEach((item) => {
        expect(item).toHaveProperty("name", expect.any(String));
        expect(item).toHaveProperty("animals", expect.any(Number));
        expect(item).toHaveProperty("feedingCompleted", expect.any(Number));
      });
    };

    checkStructure(activityWeekData);
    checkStructure(activityMonthData);
    checkStructure(activityYearData);
  });

  it("should have consistent structure across all feeding data periods", () => {
    const checkStructure = (data) => {
      data.forEach((item) => {
        expect(item).toHaveProperty("name", expect.any(String));
        expect(item).toHaveProperty("efficiency", expect.any(Number));
      });
    };

    checkStructure(feedingWeekData);
    checkStructure(feedingMonthData);
    checkStructure(feedingYearData);
  });

  it("should have consistent structure across all diet data periods", () => {
    const checkStructure = (data) => {
      data.forEach((item) => {
        expect(item).toHaveProperty("name", expect.any(String));
        expect(item).toHaveProperty("value", expect.any(Number));
      });
    };

    checkStructure(dietWeekData);
    checkStructure(dietMonthData);
    checkStructure(dietYearData);
  });

  it("should have same number of colors in dark and light palettes", () => {
    expect(COLORS_DARK.length).toBe(COLORS_LIGHT.length);
  });

  it("should have colors that match diet data categories count", () => {
    expect(COLORS_DARK.length).toBeGreaterThanOrEqual(dietWeekData.length);
    expect(COLORS_LIGHT.length).toBeGreaterThanOrEqual(dietWeekData.length);
  });

  it("should have messages in alertMessages that match initial alerts", () => {
    initialAlerts.forEach((alert) => {
      expect(alertMessages).toContain(alert.message);
    });
  });
});

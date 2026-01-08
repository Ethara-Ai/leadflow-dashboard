// =============================================================================
// LEADFLOW DASHBOARD - STORAGE CONSTANTS
// =============================================================================

/**
 * Local storage keys for persisting user preferences and data
 */
export const STORAGE_KEYS = {
  /** Theme preference (dark/light) */
  THEME: "leadflow-theme",
  /** User notes data */
  NOTES: "leadflow-notes",
  /** Application settings */
  SETTINGS: "leadflow-settings",
  /** User preferences */
  PREFERENCES: "leadflow-preferences",
  /** Cached dashboard data */
  DASHBOARD_CACHE: "leadflow-dashboard-cache",
};

/**
 * Storage expiration times in milliseconds
 */
export const STORAGE_EXPIRY = {
  /** Cache expires after 5 minutes */
  CACHE_TTL: 5 * 60 * 1000,
  /** Session data expires after 24 hours */
  SESSION_TTL: 24 * 60 * 60 * 1000,
};

export default STORAGE_KEYS;

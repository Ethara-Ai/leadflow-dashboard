// =============================================================================
// LEADFLOW DASHBOARD - API INDEX
// Central export point for all API functionality
// =============================================================================

// -----------------------------------------------------------------------------
// API Client
// -----------------------------------------------------------------------------
export { default as ApiClient, apiClient, ApiError } from "./client.js";

// -----------------------------------------------------------------------------
// Lead API
// -----------------------------------------------------------------------------
export {
  default as leadsApi,
  fetchLeadData,
  refreshLeadData,
  fetchLeadStatistics,
  fetchLeads,
  fetchLeadById,
  createLead,
  updateLead,
  deleteLead,
  fetchLeadActivities,
  maybeGenerateAlert,
} from "./leads.js";

// -----------------------------------------------------------------------------
// Re-export commonly used items at the top level
// -----------------------------------------------------------------------------

// Import apiClient for use in utility functions
import { apiClient as client } from "./client.js";

/**
 * Convenience function to get the default API client
 * @returns {ApiClient} The default API client instance
 */
export const getApiClient = () => client;

/**
 * Check if the API is configured (vs using mock data)
 * @returns {boolean} True if real API is configured
 */
export const isApiConfigured = () => {
  return !!import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_USE_MOCK_DATA !== "true";
};

// =============================================================================
// LEADFLOW DASHBOARD - LEADS API
// API endpoints for lead management with mock data fallback
// =============================================================================

import { apiClient } from './client.js';
import {
  initialLeadData,
  alertMessages,
  ALERT_GENERATION_PROBABILITY,
} from '../constants/index.js';
import { getAlertType } from '../utils.js';

/**
 * Simulates network delay for mock responses
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if we should use mock data
 * In development or when API is not configured, use mocks
 * @returns {boolean}
 */
const shouldUseMockData = () => {
  return !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK_DATA === 'true';
};

/**
 * Generate a random variation within a percentage
 * @param {number} base - Base value
 * @param {number} maxVariation - Maximum variation percentage (0-1)
 * @returns {number}
 */
const randomVariation = (base, maxVariation = 0.1) => {
  const variation = (Math.random() * 2 - 1) * maxVariation;
  return Math.floor(base * (1 + variation));
};

/**
 * Generate mock lead data with realistic variations
 * @param {Object} previousData - Previous data state for incremental updates
 * @returns {Object} Mock lead data
 */
const generateMockLeadData = (previousData = null) => {
  const baseData = previousData || initialLeadData;

  return {
    totalLeads: baseData.totalLeads + Math.floor(Math.random() * 50),
    callsMade: baseData.callsMade + Math.floor(Math.random() * 20),
    meetingsScheduled: Math.max(
      0,
      Math.min(100, baseData.meetingsScheduled + Math.floor(Math.random() * 5))
    ),
    lastUpdated: new Date().toLocaleString(),
  };
};

/**
 * Generate a random alert (may return null based on probability)
 * @returns {Object|null} Alert object or null
 */
export const maybeGenerateAlert = () => {
  if (Math.random() > ALERT_GENERATION_PROBABILITY) {
    return null;
  }

  const message = alertMessages[Math.floor(Math.random() * alertMessages.length)];

  return {
    id: Date.now(),
    message,
    type: getAlertType(message),
    time: 'Just now',
    timestamp: new Date().toISOString(),
  };
};

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Fetch current lead dashboard data
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Lead data
 */
export const fetchLeadData = async (options = {}) => {
  if (shouldUseMockData()) {
    await simulateDelay(options.delay || 500);
    return {
      data: generateMockLeadData(options.previousData),
      alert: maybeGenerateAlert(),
    };
  }

  try {
    const response = await apiClient.get('/leads/dashboard', options);
    return {
      data: response.data,
      alert: response.alert || null,
    };
  } catch (error) {
    // Fallback to mock data on error in development
    if (import.meta.env.DEV) {
      console.warn('API request failed, using mock data:', error.message);
      await simulateDelay(300);
      return {
        data: generateMockLeadData(options.previousData),
        alert: null,
      };
    }
    throw error;
  }
};

/**
 * Refresh lead data (same as fetch but semantically different)
 * @param {Object} previousData - Previous data for incremental updates
 * @returns {Promise<Object>} Refreshed lead data
 */
export const refreshLeadData = async (previousData = null) => {
  return fetchLeadData({ previousData });
};

/**
 * Fetch lead statistics for a specific time period
 * @param {string} period - Time period (week, month, year)
 * @returns {Promise<Object>} Lead statistics
 */
export const fetchLeadStatistics = async (period = 'week') => {
  if (shouldUseMockData()) {
    await simulateDelay(400);

    // Return mock statistics based on period
    const multiplier = period === 'year' ? 12 : period === 'month' ? 4 : 1;

    return {
      totalLeads: randomVariation(847 * multiplier, 0.15),
      qualifiedLeads: randomVariation(423 * multiplier, 0.15),
      convertedLeads: randomVariation(127 * multiplier, 0.15),
      conversionRate: randomVariation(30, 0.2),
      averageDealSize: randomVariation(45000, 0.25),
      period,
    };
  }

  return apiClient.get(`/leads/statistics?period=${period}`);
};

/**
 * Fetch list of leads with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated leads list
 */
export const fetchLeads = async (params = {}) => {
  const { page = 1, limit = 20, status, sortBy, sortOrder } = params;

  if (shouldUseMockData()) {
    await simulateDelay(600);

    // Generate mock leads
    const leads = Array.from({ length: limit }, (_, i) => ({
      id: `lead-${page}-${i}`,
      name: `Lead ${(page - 1) * limit + i + 1}`,
      email: `lead${(page - 1) * limit + i + 1}@example.com`,
      company: `Company ${Math.floor(Math.random() * 100)}`,
      status: ['new', 'contacted', 'qualified', 'proposal', 'closed'][
        Math.floor(Math.random() * 5)
      ],
      value: Math.floor(Math.random() * 100000) + 10000,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    return {
      data: leads,
      pagination: {
        page,
        limit,
        total: 150,
        totalPages: Math.ceil(150 / limit),
      },
    };
  }

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(status && { status }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  });

  return apiClient.get(`/leads?${queryParams}`);
};

/**
 * Fetch a single lead by ID
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} Lead details
 */
export const fetchLeadById = async (leadId) => {
  if (shouldUseMockData()) {
    await simulateDelay(300);

    return {
      id: leadId,
      name: 'Sample Lead',
      email: 'sample@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Sample Corp',
      status: 'qualified',
      value: 75000,
      notes: 'High-priority enterprise prospect',
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return apiClient.get(`/leads/${leadId}`);
};

/**
 * Create a new lead
 * @param {Object} leadData - Lead data to create
 * @returns {Promise<Object>} Created lead
 */
export const createLead = async (leadData) => {
  if (shouldUseMockData()) {
    await simulateDelay(400);

    return {
      id: `lead-${Date.now()}`,
      ...leadData,
      status: leadData.status || 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return apiClient.post('/leads', leadData);
};

/**
 * Update an existing lead
 * @param {string} leadId - Lead ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated lead
 */
export const updateLead = async (leadId, updates) => {
  if (shouldUseMockData()) {
    await simulateDelay(300);

    return {
      id: leadId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  return apiClient.patch(`/leads/${leadId}`, updates);
};

/**
 * Delete a lead
 * @param {string} leadId - Lead ID
 * @returns {Promise<void>}
 */
export const deleteLead = async (leadId) => {
  if (shouldUseMockData()) {
    await simulateDelay(300);
    return { success: true, id: leadId };
  }

  return apiClient.delete(`/leads/${leadId}`);
};

/**
 * Fetch lead activity history
 * @param {string} leadId - Lead ID
 * @returns {Promise<Array>} Activity history
 */
export const fetchLeadActivities = async (leadId) => {
  if (shouldUseMockData()) {
    await simulateDelay(400);

    return [
      {
        id: 1,
        type: 'call',
        description: 'Discovery call completed',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        user: 'John Doe',
      },
      {
        id: 2,
        type: 'email',
        description: 'Sent proposal document',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        user: 'Jane Smith',
      },
      {
        id: 3,
        type: 'note',
        description: 'Client interested in enterprise plan',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        user: 'John Doe',
      },
    ];
  }

  return apiClient.get(`/leads/${leadId}/activities`);
};

// =============================================================================
// EXPORT ALL FUNCTIONS
// =============================================================================

export default {
  fetchLeadData,
  refreshLeadData,
  fetchLeadStatistics,
  fetchLeads,
  fetchLeadById,
  createLead,
  updateLead,
  deleteLead,
  fetchLeadActivities,
  // Utilities
  maybeGenerateAlert,
};

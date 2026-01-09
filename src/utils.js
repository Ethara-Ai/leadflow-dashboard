// =============================================================================
// LEADFLOW DASHBOARD - UTILITY FUNCTIONS
// Common utility functions used throughout the application
// =============================================================================

import { alertMessages, ALERT_TYPES } from './constants/index.js';

// =============================================================================
// LEAD DATA UTILITIES
// =============================================================================

/**
 * Calculate the total number of active leads from weekly data
 * @param {Array} weekData - Array of daily lead activity data
 * @returns {number} Total leads
 */
export const calculateTotalLeads = (weekData) => {
  if (!Array.isArray(weekData) || weekData.length === 0) {
    return 0;
  }
  return weekData.reduce((sum, day) => sum + (day.leads || 0), 0);
};

/**
 * Calculate average leads per day
 * @param {Array} weekData - Array of daily lead activity data
 * @returns {number} Average leads per day
 */
export const calculateAverageLeads = (weekData) => {
  if (!Array.isArray(weekData) || weekData.length === 0) {
    return 0;
  }
  return Math.round(calculateTotalLeads(weekData) / weekData.length);
};

/**
 * Calculate total calls completed from weekly data
 * @param {Array} weekData - Array of daily lead activity data
 * @returns {number} Total calls completed
 */
export const calculateTotalCalls = (weekData) => {
  if (!Array.isArray(weekData) || weekData.length === 0) {
    return 0;
  }
  return weekData.reduce((sum, day) => sum + (day.callsCompleted || 0), 0);
};

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Format efficiency value as percentage string
 * @param {number} efficiency - Efficiency value
 * @returns {string} Formatted percentage
 */
export const formatEfficiency = (efficiency) => {
  if (typeof efficiency !== 'number' || isNaN(efficiency)) {
    return '0%';
  }
  return `${efficiency}%`;
};

/**
 * Format a number with thousands separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString();
};

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @param {string} [currency='USD'] - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date to localized string
 * @param {Date|string} date - Date to format
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(dateObj);
};

// =============================================================================
// ALERT UTILITIES
// =============================================================================

/**
 * Get a random alert message from predefined list
 * Uses alertMessages from constants to avoid duplication
 * @returns {string} Random alert message
 */
export const getRandomAlertMessage = () => {
  if (!alertMessages || alertMessages.length === 0) {
    return 'New notification';
  }
  return alertMessages[Math.floor(Math.random() * alertMessages.length)];
};

/**
 * Determine alert type based on message content
 * @param {string} message - Alert message
 * @returns {string} Alert type ('warning', 'info', 'error', or 'success')
 */
export const getAlertType = (message) => {
  if (!message || typeof message !== 'string') {
    return ALERT_TYPES.INFO;
  }

  const lowerMessage = message.toLowerCase();

  // Check for warning indicators
  if (
    lowerMessage.includes('immediate') ||
    lowerMessage.includes('pending') ||
    lowerMessage.includes('requires') ||
    lowerMessage.includes('hot lead') ||
    lowerMessage.includes('high-value') ||
    lowerMessage.includes('urgent') ||
    lowerMessage.includes('warning')
  ) {
    return ALERT_TYPES.WARNING;
  }

  // Check for success indicators
  if (
    lowerMessage.includes('completed') ||
    lowerMessage.includes('achieved') ||
    lowerMessage.includes('improved') ||
    lowerMessage.includes('closed') ||
    lowerMessage.includes('success')
  ) {
    return ALERT_TYPES.SUCCESS;
  }

  // Check for error indicators
  if (lowerMessage.includes('error') || lowerMessage.includes('failed')) {
    return ALERT_TYPES.ERROR;
  }

  return ALERT_TYPES.INFO;
};

// =============================================================================
// EXPORT UTILITIES
// =============================================================================

/**
 * Export data to CSV format and trigger download
 * @param {Object} data - Data object containing all export data
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (data, filename) => {
  const { leadData, activityData, conversionData, sourceData, alerts } = data;

  const csvData = [
    ['Metric', 'Value', 'Type'],
    ['Total Leads', leadData?.totalLeads ?? '', 'Lead Stats'],
    ['Calls Made', leadData?.callsMade ?? '', 'Activity'],
    ['Meetings Scheduled', leadData?.meetingsScheduled ?? '', 'Activity'],
    ['Last Updated', leadData?.lastUpdated ?? '', 'System'],
    [''],
    ['Lead Activity Data'],
    ['Period', 'Active Leads', 'Calls Completed'],
    ...(activityData || []).map((item) => [item.name, item.leads, item.callsCompleted]),
    [''],
    ['Conversion Rate'],
    ['Period', 'Rate'],
    ...(conversionData || []).map((item) => [item.name, item.efficiency + '%']),
    [''],
    ['Lead Source Distribution'],
    ['Source', 'Percentage'],
    ...(sourceData || []).map((item) => [item.name, item.value + '%']),
    [''],
    ['Active Alerts'],
    ['Message', 'Type', 'Time'],
    ...(alerts || []).map((alert) => [alert.message, alert.type, alert.time]),
  ];

  const csvContent = csvData
    .map((row) =>
      row
        .map((field) => {
          const stringField = String(field ?? '');
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (
            stringField.includes(',') ||
            stringField.includes('"') ||
            stringField.includes('\n')
          ) {
            return `"${stringField.replace(/"/g, '""')}"`;
          }
          return stringField;
        })
        .join(',')
    )
    .join('\n');

  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

/**
 * Export data to JSON format and trigger download
 * @param {Object} data - Data object to export
 * @param {string} filename - Name of the file to download
 */
export const exportToJSON = (data, filename) => {
  const dataStr = JSON.stringify(data, null, 2);
  downloadFile(dataStr, filename, 'application/json');
};

/**
 * Helper function to trigger file download
 * @param {string} content - File content
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type of the file
 */
const downloadFile = (content, filename, mimeType) => {
  const dataBlob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate export filename with current date
 * @param {string} extension - File extension (csv or json)
 * @param {string} [prefix='leadflow-data'] - Filename prefix
 * @returns {string} Filename with date
 */
export const generateExportFilename = (extension, prefix = 'leadflow-data') => {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}-${date}.${extension}`;
};

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (basic)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone is valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

// =============================================================================
// MISC UTILITIES
// =============================================================================

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate a unique ID
 * @param {string} [prefix=''] - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`;
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if an object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} Whether object is empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
};

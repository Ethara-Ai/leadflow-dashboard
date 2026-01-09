// =============================================================================
// LEADFLOW DASHBOARD - API CLIENT
// Centralized fetch wrapper with error handling, retries, and request management
// =============================================================================

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Check if error is a network error
   */
  get isNetworkError() {
    return this.status === 0 || this.status === null;
  }

  /**
   * Check if error is a client error (4xx)
   */
  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  get isServerError() {
    return this.status >= 500;
  }

  /**
   * Check if the request can be retried
   */
  get isRetryable() {
    return this.isNetworkError || this.isServerError;
  }
}

/**
 * Default API configuration
 */
const DEFAULT_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current attempt number (0-indexed)
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {number} Delay in milliseconds
 */
const getBackoffDelay = (attempt, baseDelay) => {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000);
};

/**
 * Create an AbortController with timeout
 * @param {number} timeout - Timeout in milliseconds
 * @returns {{ controller: AbortController, timeoutId: number }}
 */
const createTimeoutController = (timeout) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
};

/**
 * API Client class for making HTTP requests
 */
class ApiClient {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Add a request interceptor
   * @param {Function} interceptor - Function to transform request config
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   * @param {Function} interceptor - Function to transform response
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Apply request interceptors
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Transformed config
   */
  async applyRequestInterceptors(config) {
    let transformedConfig = config;
    for (const interceptor of this.requestInterceptors) {
      transformedConfig = await interceptor(transformedConfig);
    }
    return transformedConfig;
  }

  /**
   * Apply response interceptors
   * @param {Response} response - Fetch response
   * @param {Object} data - Parsed response data
   * @returns {Promise<Object>} Transformed data
   */
  async applyResponseInterceptors(response, data) {
    let transformedData = data;
    for (const interceptor of this.responseInterceptors) {
      transformedData = await interceptor(response, transformedData);
    }
    return transformedData;
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL
   */
  buildUrl(endpoint) {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const path = endpoint.replace(/^\//, '');
    return `${base}/${path}`;
  }

  /**
   * Make an HTTP request with retries
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = this.config.timeout,
      retries = this.config.retries,
      retryDelay = this.config.retryDelay,
      ...restOptions
    } = options;

    // Build request config
    let requestConfig = {
      method,
      headers: { ...this.config.headers, ...headers },
      ...restOptions,
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Apply request interceptors
    requestConfig = await this.applyRequestInterceptors(requestConfig);

    const url = this.buildUrl(endpoint);
    let lastError;

    // Retry loop
    for (let attempt = 0; attempt <= retries; attempt++) {
      const { controller, timeoutId } = createTimeoutController(timeout);

      try {
        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Parse response
        let data;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        // Handle non-OK responses
        if (!response.ok) {
          throw new ApiError(
            data?.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            data
          );
        }

        // Apply response interceptors and return
        return await this.applyResponseInterceptors(response, data);
      } catch (error) {
        clearTimeout(timeoutId);

        // Handle abort/timeout
        if (error.name === 'AbortError') {
          lastError = new ApiError('Request timeout', 0);
        } else if (error instanceof ApiError) {
          lastError = error;
        } else {
          lastError = new ApiError(error.message || 'Network error', 0, null);
        }

        // Check if we should retry
        const shouldRetry = lastError.isRetryable && attempt < retries;

        if (shouldRetry) {
          const delay = getBackoffDelay(attempt, retryDelay);
          if (import.meta.env.DEV) {
            console.warn(
              `API request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`,
              lastError.message
            );
          }
          await sleep(delay);
        }
      }
    }

    // All retries exhausted
    throw lastError;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create and export default client instance
export const apiClient = new ApiClient();

// Export class for custom instances
export default ApiClient;

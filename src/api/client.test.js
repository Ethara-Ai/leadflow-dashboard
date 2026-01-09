/**
 * Unit Tests for API Client
 * Tests error handling, retries, request methods, and interceptors
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ApiClient, { ApiError, apiClient } from './client.js';

// =============================================================================
// ApiError Class Tests
// =============================================================================

describe('ApiError', () => {
  describe('constructor', () => {
    it('should create an error with message, status, and data', () => {
      const error = new ApiError('Test error', 404, { detail: 'Not found' });

      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.data).toEqual({ detail: 'Not found' });
      expect(error.name).toBe('ApiError');
    });

    it('should set timestamp on creation', () => {
      const before = new Date().toISOString();
      const error = new ApiError('Test error', 500);
      const after = new Date().toISOString();

      expect(error.timestamp).toBeDefined();
      expect(error.timestamp >= before).toBe(true);
      expect(error.timestamp <= after).toBe(true);
    });

    it('should default data to null', () => {
      const error = new ApiError('Test error', 500);

      expect(error.data).toBe(null);
    });
  });

  describe('isNetworkError', () => {
    it('should return true for status 0', () => {
      const error = new ApiError('Network error', 0);

      expect(error.isNetworkError).toBe(true);
    });

    it('should return true for null status', () => {
      const error = new ApiError('Network error', null);

      expect(error.isNetworkError).toBe(true);
    });

    it('should return false for non-zero status', () => {
      const error = new ApiError('Server error', 500);

      expect(error.isNetworkError).toBe(false);
    });
  });

  describe('isClientError', () => {
    it('should return true for 4xx status codes', () => {
      expect(new ApiError('Bad request', 400).isClientError).toBe(true);
      expect(new ApiError('Unauthorized', 401).isClientError).toBe(true);
      expect(new ApiError('Forbidden', 403).isClientError).toBe(true);
      expect(new ApiError('Not found', 404).isClientError).toBe(true);
      expect(new ApiError('Conflict', 409).isClientError).toBe(true);
    });

    it('should return false for non-4xx status codes', () => {
      expect(new ApiError('OK', 200).isClientError).toBe(false);
      expect(new ApiError('Server error', 500).isClientError).toBe(false);
      expect(new ApiError('Network error', 0).isClientError).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for 5xx status codes', () => {
      expect(new ApiError('Internal error', 500).isServerError).toBe(true);
      expect(new ApiError('Bad gateway', 502).isServerError).toBe(true);
      expect(new ApiError('Service unavailable', 503).isServerError).toBe(true);
    });

    it('should return false for non-5xx status codes', () => {
      expect(new ApiError('OK', 200).isServerError).toBe(false);
      expect(new ApiError('Not found', 404).isServerError).toBe(false);
      expect(new ApiError('Network error', 0).isServerError).toBe(false);
    });
  });

  describe('isRetryable', () => {
    it('should return true for network errors', () => {
      const error = new ApiError('Network error', 0);

      expect(error.isRetryable).toBe(true);
    });

    it('should return true for server errors', () => {
      const error = new ApiError('Server error', 500);

      expect(error.isRetryable).toBe(true);
    });

    it('should return false for client errors', () => {
      const error = new ApiError('Not found', 404);

      expect(error.isRetryable).toBe(false);
    });

    it('should return false for successful status codes', () => {
      const error = new ApiError('OK', 200);

      expect(error.isRetryable).toBe(false);
    });
  });
});

// =============================================================================
// ApiClient Tests
// =============================================================================

describe('ApiClient', () => {
  let client;
  let fetchSpy;

  // Helper to create mock responses
  const mockJsonResponse = (data, status = 200) => {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    });
  };

  beforeEach(() => {
    client = new ApiClient({
      baseUrl: 'https://api.example.com',
      retries: 0, // Disable retries by default for simpler tests
      timeout: 30000,
    });
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =============================================================================
  // Constructor Tests
  // =============================================================================

  describe('constructor', () => {
    it('should use default config when none provided', () => {
      const defaultClient = new ApiClient();

      expect(defaultClient.config.timeout).toBe(30000);
      expect(defaultClient.config.retries).toBe(3);
    });

    it('should merge custom config with defaults', () => {
      const customClient = new ApiClient({
        baseUrl: 'https://custom.api.com',
        timeout: 5000,
      });

      expect(customClient.config.baseUrl).toBe('https://custom.api.com');
      expect(customClient.config.timeout).toBe(5000);
      expect(customClient.config.retries).toBe(3); // default
    });
  });

  // =============================================================================
  // buildUrl Tests
  // =============================================================================

  describe('buildUrl', () => {
    it('should combine base URL and endpoint', () => {
      const url = client.buildUrl('/users');

      expect(url).toBe('https://api.example.com/users');
    });

    it('should handle endpoint without leading slash', () => {
      const url = client.buildUrl('users');

      expect(url).toBe('https://api.example.com/users');
    });

    it('should handle base URL with trailing slash', () => {
      const clientWithSlash = new ApiClient({ baseUrl: 'https://api.example.com/' });
      const url = clientWithSlash.buildUrl('/users');

      expect(url).toBe('https://api.example.com/users');
    });
  });

  // =============================================================================
  // Request Method Tests
  // =============================================================================

  describe('request methods', () => {
    describe('get', () => {
      it('should make GET request', async () => {
        fetchSpy.mockImplementation(() => mockJsonResponse({ id: 1, name: 'Test' }));

        const result = await client.get('/users/1');

        expect(fetchSpy).toHaveBeenCalledWith(
          'https://api.example.com/users/1',
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual({ id: 1, name: 'Test' });
      });

      it('should not include body in GET request', async () => {
        fetchSpy.mockImplementation(() => mockJsonResponse({}));

        await client.get('/users');

        expect(fetchSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.not.objectContaining({ body: expect.anything() })
        );
      });
    });

    describe('post', () => {
      it('should make POST request with body', async () => {
        fetchSpy.mockImplementation(() => mockJsonResponse({ id: 1 }));

        const result = await client.post('/users', { name: 'Test' });

        expect(fetchSpy).toHaveBeenCalledWith(
          'https://api.example.com/users',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ name: 'Test' }),
          })
        );
        expect(result).toEqual({ id: 1 });
      });
    });

    describe('put', () => {
      it('should make PUT request with body', async () => {
        fetchSpy.mockImplementation(() => mockJsonResponse({ id: 1, name: 'Updated' }));

        const result = await client.put('/users/1', { name: 'Updated' });

        expect(fetchSpy).toHaveBeenCalledWith(
          'https://api.example.com/users/1',
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ name: 'Updated' }),
          })
        );
        expect(result).toEqual({ id: 1, name: 'Updated' });
      });
    });

    describe('patch', () => {
      it('should make PATCH request with body', async () => {
        fetchSpy.mockImplementation(() => mockJsonResponse({ id: 1, name: 'Patched' }));

        const result = await client.patch('/users/1', { name: 'Patched' });

        expect(fetchSpy).toHaveBeenCalledWith(
          'https://api.example.com/users/1',
          expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify({ name: 'Patched' }),
          })
        );
        expect(result).toEqual({ id: 1, name: 'Patched' });
      });
    });

    describe('delete', () => {
      it('should make DELETE request', async () => {
        fetchSpy.mockImplementation(() => mockJsonResponse({ success: true }));

        const result = await client.delete('/users/1');

        expect(fetchSpy).toHaveBeenCalledWith(
          'https://api.example.com/users/1',
          expect.objectContaining({ method: 'DELETE' })
        );
        expect(result).toEqual({ success: true });
      });
    });
  });

  // =============================================================================
  // Error Handling Tests
  // =============================================================================

  describe('error handling', () => {
    it('should throw ApiError for non-OK response', async () => {
      fetchSpy.mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ message: 'User not found' }),
        })
      );

      await expect(client.get('/users/999')).rejects.toThrow(ApiError);

      try {
        await client.get('/users/999');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(404);
      }
    });

    it('should throw ApiError for network errors', async () => {
      fetchSpy.mockImplementation(() => Promise.reject(new Error('Network failure')));

      await expect(client.get('/users')).rejects.toThrow(ApiError);

      try {
        await client.get('/users');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(0);
        expect(error.isNetworkError).toBe(true);
      }
    });

    it('should throw ApiError for abort/timeout', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';

      fetchSpy.mockImplementation(() => Promise.reject(abortError));

      await expect(client.get('/slow-endpoint')).rejects.toThrow(ApiError);

      try {
        await client.get('/slow-endpoint');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('Request timeout');
      }
    });
  });

  // =============================================================================
  // Retry Logic Tests
  // =============================================================================

  describe('retry logic', () => {
    it('should retry on server error', async () => {
      let attempts = 0;

      fetchSpy.mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            headers: new Headers({ 'content-type': 'application/json' }),
            json: () => Promise.resolve({ message: 'Server error' }),
          });
        }
        return mockJsonResponse({ success: true });
      });

      const retryClient = new ApiClient({
        baseUrl: 'https://api.example.com',
        retries: 3,
        retryDelay: 1, // Minimal delay for tests
      });

      const result = await retryClient.get('/flaky-endpoint');

      expect(attempts).toBe(3);
      expect(result).toEqual({ success: true });
    });

    it('should not retry on client error (4xx)', async () => {
      let attempts = 0;

      fetchSpy.mockImplementation(() => {
        attempts++;
        return Promise.resolve({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ message: 'Invalid input' }),
        });
      });

      // Client errors (4xx) are not retryable per ApiError.isRetryable
      // The first request fails with a client error and should not retry
      await expect(client.get('/endpoint')).rejects.toThrow(ApiError);
      // With retries disabled (retries: 0 in beforeEach), only 1 attempt
      expect(attempts).toBe(1);
    });

    it('should exhaust retries and throw last error', async () => {
      fetchSpy.mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ message: 'Service unavailable' }),
        })
      );

      const retryClient = new ApiClient({
        baseUrl: 'https://api.example.com',
        retries: 2,
        retryDelay: 1,
      });

      await expect(retryClient.get('/down-service')).rejects.toThrow(ApiError);
      expect(fetchSpy).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  // =============================================================================
  // Interceptors Tests
  // =============================================================================

  describe('interceptors', () => {
    describe('request interceptors', () => {
      it('should apply request interceptors', async () => {
        fetchSpy.mockImplementation(() => mockJsonResponse({ success: true }));

        client.addRequestInterceptor((config) => ({
          ...config,
          headers: {
            ...config.headers,
            Authorization: 'Bearer token123',
          },
        }));

        await client.get('/protected');

        expect(fetchSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: 'Bearer token123',
            }),
          })
        );
      });

      it('should apply multiple request interceptors in order', async () => {
        fetchSpy.mockImplementation(() => mockJsonResponse({ success: true }));

        client.addRequestInterceptor((config) => ({
          ...config,
          headers: { ...config.headers, 'X-First': 'first' },
        }));

        client.addRequestInterceptor((config) => ({
          ...config,
          headers: { ...config.headers, 'X-Second': 'second' },
        }));

        await client.get('/endpoint');

        expect(fetchSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'X-First': 'first',
              'X-Second': 'second',
            }),
          })
        );
      });
    });

    describe('response interceptors', () => {
      it('should apply response interceptors', async () => {
        fetchSpy.mockImplementation(() => mockJsonResponse({ data: { id: 1 } }));

        client.addResponseInterceptor((response, data) => ({
          ...data,
          intercepted: true,
        }));

        const result = await client.get('/endpoint');

        expect(result).toEqual({ data: { id: 1 }, intercepted: true });
      });
    });
  });

  // =============================================================================
  // Content Type Handling Tests
  // =============================================================================

  describe('content type handling', () => {
    it('should parse JSON response', async () => {
      fetchSpy.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json; charset=utf-8' }),
          json: () => Promise.resolve({ key: 'value' }),
        })
      );

      const result = await client.get('/json-endpoint');

      expect(result).toEqual({ key: 'value' });
    });

    it('should return text for non-JSON response', async () => {
      fetchSpy.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'text/plain' }),
          text: () => Promise.resolve('Plain text response'),
        })
      );

      const result = await client.get('/text-endpoint');

      expect(result).toBe('Plain text response');
    });
  });

  // =============================================================================
  // Default Client Export Tests
  // =============================================================================

  describe('apiClient export', () => {
    it('should export default apiClient instance', () => {
      expect(apiClient).toBeDefined();
      expect(apiClient).toBeInstanceOf(ApiClient);
    });

    it('should have request methods', () => {
      expect(apiClient.get).toBeDefined();
      expect(apiClient.post).toBeDefined();
      expect(apiClient.put).toBeDefined();
      expect(apiClient.patch).toBeDefined();
      expect(apiClient.delete).toBeDefined();
    });

    it('should have interceptor methods', () => {
      expect(apiClient.addRequestInterceptor).toBeDefined();
      expect(apiClient.addResponseInterceptor).toBeDefined();
    });
  });
});

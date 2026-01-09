// =============================================================================
// LEADFLOW DASHBOARD - ENVIRONMENT CONFIGURATION
// =============================================================================
// Centralized configuration for all environment variables.
// Provides type-safe access and default values.
// =============================================================================

/**
 * Helper to get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not set
 * @returns {string}
 */
const getEnv = (key, defaultValue = '') => {
  return import.meta.env[key] ?? defaultValue;
};

/**
 * Helper to get boolean environment variable
 * @param {string} key - Environment variable key
 * @param {boolean} defaultValue - Default value if not set
 * @returns {boolean}
 */
const getBoolEnv = (key, defaultValue = false) => {
  const value = import.meta.env[key];
  if (value === undefined || value === '') return defaultValue;
  return value === 'true' || value === '1';
};

/**
 * Helper to get number environment variable
 * @param {string} key - Environment variable key
 * @param {number} defaultValue - Default value if not set
 * @returns {number}
 */
const getNumberEnv = (key, defaultValue = 0) => {
  const value = import.meta.env[key];
  if (value === undefined || value === '') return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// =============================================================================
// CONFIGURATION OBJECT
// =============================================================================

const config = {
  // ---------------------------------------------------------------------------
  // Application
  // ---------------------------------------------------------------------------
  app: {
    env: getEnv('VITE_APP_ENV', 'development'),
    name: getEnv('VITE_APP_NAME', 'LeadFlow Dashboard'),
    version: getEnv('VITE_APP_VERSION', '1.0.0'),
    url: getEnv('VITE_APP_URL', 'http://localhost:5173'),
    basePath: getEnv('VITE_BASE_PATH', '/'),
  },

  // ---------------------------------------------------------------------------
  // API
  // ---------------------------------------------------------------------------
  api: {
    baseUrl: getEnv('VITE_API_BASE_URL', 'http://localhost:3001/api'),
    version: getEnv('VITE_API_VERSION', 'v1'),
    timeout: getNumberEnv('VITE_API_TIMEOUT', 30000),
    wsUrl: getEnv('VITE_WS_URL', ''),
  },

  // ---------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------
  auth: {
    provider: getEnv('VITE_AUTH_PROVIDER', 'local'),
    domain: getEnv('VITE_AUTH_DOMAIN', ''),
    clientId: getEnv('VITE_AUTH_CLIENT_ID', ''),
    audience: getEnv('VITE_AUTH_AUDIENCE', ''),
    redirectUri: getEnv('VITE_AUTH_REDIRECT_URI', 'http://localhost:5173/callback'),
    sessionTimeout: getNumberEnv('VITE_SESSION_TIMEOUT', 60),
    csrfEnabled: getBoolEnv('VITE_CSRF_ENABLED', true),
  },

  // ---------------------------------------------------------------------------
  // Feature Flags
  // ---------------------------------------------------------------------------
  features: {
    darkMode: getBoolEnv('VITE_FEATURE_DARK_MODE', true),
    export: getBoolEnv('VITE_FEATURE_EXPORT', true),
    notes: getBoolEnv('VITE_FEATURE_NOTES', true),
    alerts: getBoolEnv('VITE_FEATURE_ALERTS', true),
    charts: getBoolEnv('VITE_FEATURE_CHARTS', true),
    welcomeMessage: getBoolEnv('VITE_FEATURE_WELCOME_MESSAGE', true),
    pwa: getBoolEnv('VITE_FEATURE_PWA', false),
  },

  // ---------------------------------------------------------------------------
  // Analytics & Monitoring
  // ---------------------------------------------------------------------------
  analytics: {
    gaMeasurementId: getEnv('VITE_GA_MEASUREMENT_ID', ''),
    sentryDsn: getEnv('VITE_SENTRY_DSN', ''),
    sentryEnvironment: getEnv('VITE_SENTRY_ENVIRONMENT', 'development'),
    performanceMonitoring: getBoolEnv('VITE_ENABLE_PERFORMANCE_MONITORING', false),
    logrocketAppId: getEnv('VITE_LOGROCKET_APP_ID', ''),
    hotjarSiteId: getEnv('VITE_HOTJAR_SITE_ID', ''),
  },

  // ---------------------------------------------------------------------------
  // Third-Party Integrations
  // ---------------------------------------------------------------------------
  integrations: {
    mapsApiKey: getEnv('VITE_MAPS_API_KEY', ''),
    weatherApiKey: getEnv('VITE_WEATHER_API_KEY', ''),
    pushAppId: getEnv('VITE_PUSH_APP_ID', ''),
  },

  // ---------------------------------------------------------------------------
  // Storage & CDN
  // ---------------------------------------------------------------------------
  storage: {
    cdnUrl: getEnv('VITE_CDN_URL', ''),
    storageUrl: getEnv('VITE_STORAGE_URL', ''),
    maxUploadSize: getNumberEnv('VITE_MAX_UPLOAD_SIZE', 10),
  },

  // ---------------------------------------------------------------------------
  // Caching & Performance
  // ---------------------------------------------------------------------------
  cache: {
    maxAge: getNumberEnv('VITE_CACHE_MAX_AGE', 86400),
    swCacheEnabled: getBoolEnv('VITE_ENABLE_SW_CACHE', true),
    swrTime: getNumberEnv('VITE_SWR_TIME', 3600),
  },

  // ---------------------------------------------------------------------------
  // Localization
  // ---------------------------------------------------------------------------
  localization: {
    defaultLocale: getEnv('VITE_DEFAULT_LOCALE', 'en-US'),
    supportedLocales: getEnv('VITE_SUPPORTED_LOCALES', 'en-US').split(','),
    defaultTimezone: getEnv('VITE_DEFAULT_TIMEZONE', 'UTC'),
    dateFormat: getEnv('VITE_DATE_FORMAT', 'US'),
  },

  // ---------------------------------------------------------------------------
  // UI Configuration
  // ---------------------------------------------------------------------------
  ui: {
    defaultTheme: getEnv('VITE_DEFAULT_THEME', 'system'),
    primaryColor: getEnv('VITE_PRIMARY_COLOR', '2563eb'),
    refreshInterval: getNumberEnv('VITE_REFRESH_INTERVAL', 60000),
    maxAlerts: getNumberEnv('VITE_MAX_ALERTS', 50),
    chartAnimationDuration: getNumberEnv('VITE_CHART_ANIMATION_DURATION', 300),
  },

  // ---------------------------------------------------------------------------
  // Contact & Support
  // ---------------------------------------------------------------------------
  support: {
    email: getEnv('VITE_SUPPORT_EMAIL', 'support@leadflow.example.com'),
    docsUrl: getEnv('VITE_DOCS_URL', ''),
    statusUrl: getEnv('VITE_STATUS_URL', ''),
  },

  // ---------------------------------------------------------------------------
  // Debug (Development only)
  // ---------------------------------------------------------------------------
  debug: {
    enabled: getBoolEnv('VITE_DEBUG_MODE', false),
    mockApi: getBoolEnv('VITE_MOCK_API', false),
    logLevel: getEnv('VITE_LOG_LEVEL', 'warn'),
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if running in production environment
 * @returns {boolean}
 */
export const isProduction = () => config.app.env === 'production';

/**
 * Check if running in development environment
 * @returns {boolean}
 */
export const isDevelopment = () => config.app.env === 'development';

/**
 * Check if running in staging environment
 * @returns {boolean}
 */
export const isStaging = () => config.app.env === 'staging';

/**
 * Get full API URL with version
 * @returns {string}
 */
export const getApiUrl = () => {
  const { baseUrl, version } = config.api;
  return version ? `${baseUrl}/${version}` : baseUrl;
};

/**
 * Check if a feature is enabled
 * @param {keyof typeof config.features} featureName
 * @returns {boolean}
 */
export const isFeatureEnabled = (featureName) => {
  return config.features[featureName] ?? false;
};

/**
 * Get asset URL (CDN or local)
 * @param {string} path - Asset path
 * @returns {string}
 */
export const getAssetUrl = (path) => {
  const cdnUrl = config.storage.cdnUrl;
  return cdnUrl ? `${cdnUrl}/${path}` : path;
};

/**
 * Log configuration in development (sanitized)
 */
export const logConfig = () => {
  if (!isDevelopment()) return;

  console.group('🔧 LeadFlow Dashboard Configuration');
  console.log('Environment:', config.app.env);
  console.log('Version:', config.app.version);
  console.log('API URL:', getApiUrl());
  console.log('Features:', config.features);
  console.log('Debug Mode:', config.debug.enabled);
  console.groupEnd();
};

// =============================================================================
// EXPORTS
// =============================================================================

export default config;
export { config };

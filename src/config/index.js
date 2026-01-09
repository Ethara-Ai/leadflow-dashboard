// =============================================================================
// LEADFLOW DASHBOARD - CONFIGURATION INDEX
// =============================================================================
// Re-export all configuration modules for cleaner imports.
// Usage: import config, { isProduction } from '@/config';
// =============================================================================

export {
  default,
  config,
  isProduction,
  isDevelopment,
  isStaging,
  getApiUrl,
  isFeatureEnabled,
  getAssetUrl,
  logConfig,
} from './env.js';

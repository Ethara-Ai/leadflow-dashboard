// =============================================================================
// LEADFLOW DASHBOARD - USE THEME SAFE HOOK
// Re-exports useThemeSafe from the unified useTheme hook for backward compatibility
// =============================================================================

/**
 * @deprecated Use `useTheme` from './useTheme.jsx' instead.
 * This file is maintained for backward compatibility.
 *
 * The unified useTheme hook now handles both safe and strict modes:
 * - useTheme() - Safe by default, returns fallback values if no provider
 * - useTheme({ throwOnMissingProvider: true }) - Strict mode, throws if no provider
 * - useTheme(darkModeOverride) - Override dark mode value
 *
 * @example
 * // Old way (still works)
 * import useThemeSafe from './useThemeSafe';
 * const { isDark } = useThemeSafe();
 *
 * // New way (recommended)
 * import useTheme from './useTheme';
 * const { isDark } = useTheme();
 */

export { useThemeSafe as default } from './useTheme.jsx';

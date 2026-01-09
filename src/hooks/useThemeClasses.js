// =============================================================================
// LEADFLOW DASHBOARD - USE THEME CLASSES HOOK
// Provides reusable theme-based CSS classes to reduce duplication
// =============================================================================

import { useMemo } from 'react';
import useThemeSafe from './useThemeSafe';

/**
 * Custom hook that provides commonly used theme-based CSS classes
 * Reduces code duplication across components
 *
 * @param {boolean} [darkModeOverride] - Optional override for dark mode
 * @returns {Object} Object containing theme-based class strings
 */
const useThemeClasses = (darkModeOverride) => {
  const { isDark } = useThemeSafe(darkModeOverride);

  return useMemo(
    () => ({
      // =======================================================================
      // Card Classes
      // =======================================================================
      card: isDark
        ? 'bg-zinc-900/90 border-zinc-700/50 shadow-2xl shadow-black/60 ring-1 ring-zinc-600/10'
        : 'bg-white/90 border-slate-200/60 shadow-xl shadow-slate-900/10',

      cardHover: isDark
        ? 'hover:bg-zinc-800/90 hover:border-zinc-600/50'
        : 'hover:bg-white hover:border-slate-300/60',

      // =======================================================================
      // Modal Classes
      // =======================================================================
      modal: isDark
        ? 'bg-zinc-900/95 border-zinc-700'
        : 'bg-white/95 border-slate-300',

      modalHeader: isDark
        ? 'border-zinc-700 bg-zinc-900/80'
        : 'border-slate-100 bg-slate-50/80',

      // =======================================================================
      // Input Classes
      // =======================================================================
      input: isDark
        ? 'bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:border-blue-500'
        : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-500',

      inputFocus: 'focus:outline-none focus:ring-2 focus:ring-blue-500/20',

      // =======================================================================
      // Button Classes
      // =======================================================================
      buttonPrimary: isDark
        ? 'bg-blue-600 hover:bg-blue-500 text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white',

      buttonSecondary: isDark
        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',

      buttonGhost: isDark
        ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100',

      buttonDisabled: isDark
        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        : 'bg-slate-200 text-slate-400 cursor-not-allowed',

      // =======================================================================
      // Text Classes
      // =======================================================================
      textPrimary: isDark ? 'text-zinc-100' : 'text-slate-800',
      textSecondary: isDark ? 'text-zinc-200' : 'text-slate-700',
      textMuted: isDark ? 'text-zinc-400' : 'text-slate-600',
      textSubtle: isDark ? 'text-zinc-500' : 'text-slate-500',

      // =======================================================================
      // Label Classes
      // =======================================================================
      label: isDark ? 'text-zinc-400' : 'text-slate-500',
      labelBold: isDark ? 'text-zinc-300' : 'text-slate-600',

      // =======================================================================
      // Border Classes
      // =======================================================================
      border: isDark ? 'border-zinc-700' : 'border-slate-200',
      borderLight: isDark ? 'border-zinc-700/50' : 'border-slate-200/60',
      borderHover: isDark ? 'hover:border-zinc-600' : 'hover:border-slate-300',

      // =======================================================================
      // Background Classes
      // =======================================================================
      bgPrimary: isDark ? 'bg-zinc-900' : 'bg-white',
      bgSecondary: isDark ? 'bg-zinc-800' : 'bg-slate-50',
      bgTertiary: isDark ? 'bg-zinc-800/50' : 'bg-slate-100',
      bgOverlay: isDark ? 'bg-black/60' : 'bg-black/50',

      // =======================================================================
      // Accent Classes
      // =======================================================================
      accentEmerald: isDark
        ? 'bg-emerald-950/60 text-emerald-400'
        : 'bg-emerald-100 text-emerald-600',
      accentAmber: isDark
        ? 'bg-amber-950/60 text-amber-400'
        : 'bg-amber-100 text-amber-600',
      accentCyan: isDark
        ? 'bg-cyan-950/60 text-cyan-400'
        : 'bg-cyan-100 text-cyan-600',
      accentBlue: isDark
        ? 'bg-blue-950/60 text-blue-400'
        : 'bg-blue-100 text-blue-600',
      accentRed: isDark
        ? 'bg-red-950/60 text-red-400'
        : 'bg-red-100 text-red-600',

      // =======================================================================
      // Dropdown Classes
      // =======================================================================
      dropdown: isDark
        ? 'bg-zinc-900 border-zinc-700'
        : 'bg-white border-slate-200',

      dropdownItem: isDark
        ? 'text-zinc-300 hover:bg-zinc-700'
        : 'text-slate-700 hover:bg-slate-50',

      dropdownItemActive: isDark
        ? 'bg-blue-950/60 text-blue-400'
        : 'bg-blue-50 text-blue-600',

      // =======================================================================
      // Badge Classes
      // =======================================================================
      badge: isDark
        ? 'bg-zinc-800 text-zinc-300'
        : 'bg-slate-100 text-slate-600',

      badgeActive: isDark
        ? 'bg-amber-950/60 text-amber-300'
        : 'bg-amber-100 text-amber-700',

      // =======================================================================
      // Icon Classes
      // =======================================================================
      icon: isDark ? 'text-zinc-400' : 'text-slate-500',
      iconHover: isDark ? 'hover:text-zinc-200' : 'hover:text-slate-700',

      // =======================================================================
      // Close Button Classes
      // =======================================================================
      closeButton: isDark
        ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200',

      // =======================================================================
      // Empty State Classes
      // =======================================================================
      emptyIcon: isDark ? 'text-zinc-500' : 'text-slate-400',
      emptyText: isDark ? 'text-zinc-400' : 'text-slate-600',
      emptySubtext: isDark ? 'text-zinc-500' : 'text-slate-500',

      // =======================================================================
      // Status indicator
      // =======================================================================
      isDark,
    }),
    [isDark]
  );
};

export default useThemeClasses;

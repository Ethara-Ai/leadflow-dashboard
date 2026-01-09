// =============================================================================
// LEADFLOW DASHBOARD - USE SCROLL LOCK HOOK
// Reusable hook for managing body scroll locking
// =============================================================================

import { useEffect, useRef } from 'react';

/**
 * Custom hook for locking body scroll when a modal or overlay is open.
 * Handles scroll position restoration and supports mobile-specific behavior.
 *
 * @param {boolean} isLocked - Whether scroll should be locked
 * @param {Object} [options] - Hook options
 * @param {boolean} [options.enabled=true] - Whether scroll locking is enabled
 * @param {boolean} [options.mobileOnly=false] - Only lock on mobile/tablet devices
 * @param {number} [options.mobileBreakpoint=1024] - Breakpoint for mobile detection (px)
 * @returns {void}
 *
 * @example
 * // Basic usage
 * useScrollLock(isModalOpen);
 *
 * @example
 * // With options
 * useScrollLock(isMenuOpen, { mobileOnly: true, mobileBreakpoint: 768 });
 */
const useScrollLock = (
  isLocked,
  { enabled = true, mobileOnly = false, mobileBreakpoint = 1024 } = {}
) => {
  // Store scroll position for restoration
  const scrollYRef = useRef(0);

  useEffect(() => {
    // Early return if scroll locking is disabled
    if (!enabled) return;

    // Check if we should lock based on mobile-only option
    if (mobileOnly) {
      const isMobileOrTablet = window.innerWidth < mobileBreakpoint;
      if (!isMobileOrTablet) return;
    }

    if (isLocked) {
      // Store current scroll position before locking
      scrollYRef.current = window.scrollY;

      // Apply scroll lock styles
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Get the stored scroll position from body.style.top
      const storedScrollY = document.body.style.top;

      // Remove scroll lock styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      // Restore scroll position if we had one stored
      if (storedScrollY) {
        window.scrollTo(0, parseInt(storedScrollY || '0') * -1);
      }
    }

    // Cleanup function to ensure styles are removed on unmount
    return () => {
      const storedScrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      // Restore scroll position on cleanup
      if (storedScrollY) {
        window.scrollTo(0, parseInt(storedScrollY || '0') * -1);
      }
    };
  }, [isLocked, enabled, mobileOnly, mobileBreakpoint]);
};

export default useScrollLock;

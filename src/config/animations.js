/**
 * Animation Configuration
 * Framer Motion animation variants and timing configurations
 */

// -----------------------------------------------------------------------------
// Timing Constants
// -----------------------------------------------------------------------------

export const TIMING = {
  /** Fast transitions (hover effects, micro-interactions) */
  FAST: 0.15,
  /** Normal transitions (most UI elements) */
  NORMAL: 0.2,
  /** Slow transitions (page transitions, modals) */
  SLOW: 0.3,
  /** Loading screen minimum display time (ms) */
  LOADING_MIN_DISPLAY: 1500,
  /** Loading screen maximum wait time (ms) */
  LOADING_MAX_WAIT: 4000,
  /** Data refresh simulated delay (ms) */
  DATA_REFRESH_DELAY: 500,
};

// -----------------------------------------------------------------------------
// Easing Functions
// -----------------------------------------------------------------------------

export const EASING = {
  /** Standard ease out for most animations */
  EASE_OUT: 'easeOut',
  /** Standard ease in for exit animations */
  EASE_IN: 'easeIn',
  /** Smooth ease in-out for bidirectional animations */
  EASE_IN_OUT: 'easeInOut',
  /** Spring animation for bouncy effects */
  SPRING: { type: 'spring', stiffness: 260, damping: 20 },
};

// -----------------------------------------------------------------------------
// Card Variants
// -----------------------------------------------------------------------------

/**
 * Standard card animation variants
 * Used for stat cards, chart cards, and similar components
 */
export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.NORMAL,
      ease: EASING.EASE_OUT,
    },
  },
};

// -----------------------------------------------------------------------------
// Dropdown Variants
// -----------------------------------------------------------------------------

/**
 * Dropdown menu animation variants
 * Used for export menus, alert dropdowns, etc.
 */
export const dropdownVariants = {
  closed: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.EASE_IN_OUT,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: {
      duration: TIMING.FAST,
      ease: EASING.EASE_IN_OUT,
    },
  },
};

// -----------------------------------------------------------------------------
// Stagger Container Variants
// -----------------------------------------------------------------------------

/**
 * Container variants for staggered children animations
 * Used for lists, grids, and grouped elements
 */
export const staggerContainerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// -----------------------------------------------------------------------------
// Modal Variants
// -----------------------------------------------------------------------------

/**
 * Modal animation variants
 * Used for dialogs, notes modal, footer modals
 */
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: TIMING.NORMAL,
      ease: EASING.EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.EASE_IN,
    },
  },
};

// -----------------------------------------------------------------------------
// Fade Variants
// -----------------------------------------------------------------------------

/**
 * Simple fade animation variants
 * Used for subtle transitions
 */
export const fadeVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: TIMING.NORMAL,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TIMING.FAST,
    },
  },
};

// -----------------------------------------------------------------------------
// Slide Variants
// -----------------------------------------------------------------------------

/**
 * Slide up animation variants
 * Used for elements entering from bottom
 */
export const slideUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.NORMAL,
      ease: EASING.EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.EASE_IN,
    },
  },
};

// -----------------------------------------------------------------------------
// Hover Animations
// -----------------------------------------------------------------------------

/**
 * Standard hover animation for interactive cards
 */
export const cardHoverAnimation = {
  y: -4,
  transition: { duration: TIMING.NORMAL },
};

/**
 * Standard hover animation for buttons
 */
export const buttonHoverAnimation = {
  scale: 1.05,
  y: -2,
};

/**
 * Standard tap animation for buttons
 */
export const buttonTapAnimation = {
  scale: 0.95,
};

// -----------------------------------------------------------------------------
// Loading Animation
// -----------------------------------------------------------------------------

/**
 * Pulsing animation for loading states
 */
export const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: EASING.EASE_IN_OUT,
  },
};

/**
 * Spinning animation for loading spinners
 */
export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

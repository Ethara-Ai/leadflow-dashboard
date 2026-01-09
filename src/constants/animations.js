// =============================================================================
// LEADFLOW DASHBOARD - ANIMATION CONSTANTS
// =============================================================================

/**
 * Card animation variants for staggered entrance effects
 */
export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

/**
 * Dropdown animation variants for expand/collapse effects
 */
export const dropdownVariants = {
  closed: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: { duration: 0.15, ease: 'easeInOut' },
  },
  open: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: { duration: 0.15, ease: 'easeInOut' },
  },
};

/**
 * Container variants for staggered children animations
 */
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

/**
 * Modal animation variants for enter/exit transitions
 */
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

/**
 * Fade animation variants for simple opacity transitions
 */
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/**
 * Slide up animation variants
 */
export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/**
 * Scale animation variants for button/icon interactions
 */
export const scaleVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

/**
 * Common transition presets
 */
export const transitions = {
  fast: { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.2, ease: 'easeOut' },
  slow: { duration: 0.3, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 20 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 15 },
};

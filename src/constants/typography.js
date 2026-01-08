// =============================================================================
// LEADFLOW DASHBOARD - TYPOGRAPHY CONSTANTS
// =============================================================================

/**
 * Primary font family for body text and UI elements
 * Manrope is a modern, geometric sans-serif with excellent readability
 */
export const fontFamily = "'Manrope', sans-serif";

/**
 * Heading font family for titles and headers
 * Poppins provides a clean, professional look for headings
 */
export const fontFamilyHeading = "'Poppins', sans-serif";

/**
 * Monospace font family for code and data display
 */
export const fontFamilyMono = "'JetBrains Mono', 'Fira Code', monospace";

/**
 * Font weight constants
 */
export const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

/**
 * Font size scale (in rem)
 */
export const fontSizes = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
};

/**
 * Line height constants
 */
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

/**
 * Letter spacing constants
 */
export const letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

export default {
  fontFamily,
  fontFamilyHeading,
  fontFamilyMono,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
};

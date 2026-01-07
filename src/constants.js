// =============================================================================
// ZOOLAB DASHBOARD - CONSTANTS
// =============================================================================

// -----------------------------------------------------------------------------
// Animal Activity Data
// -----------------------------------------------------------------------------

export const activityWeekData = [
  { name: "Mon", animals: 120, feedingCompleted: 15 },
  { name: "Tue", animals: 150, feedingCompleted: 22 },
  { name: "Wed", animals: 180, feedingCompleted: 18 },
  { name: "Thu", animals: 160, feedingCompleted: 25 },
  { name: "Fri", animals: 200, feedingCompleted: 30 },
  { name: "Sat", animals: 170, feedingCompleted: 20 },
  { name: "Sun", animals: 190, feedingCompleted: 28 },
];

export const activityMonthData = [
  { name: "Week 1", animals: 145, feedingCompleted: 95 },
  { name: "Week 2", animals: 168, feedingCompleted: 112 },
  { name: "Week 3", animals: 185, feedingCompleted: 128 },
  { name: "Week 4", animals: 203, feedingCompleted: 145 },
];

export const activityYearData = [
  { name: "Jan", animals: 98, feedingCompleted: 45 },
  { name: "Feb", animals: 112, feedingCompleted: 52 },
  { name: "Mar", animals: 135, feedingCompleted: 68 },
  { name: "Apr", animals: 158, feedingCompleted: 82 },
  { name: "May", animals: 175, feedingCompleted: 95 },
  { name: "Jun", animals: 192, feedingCompleted: 108 },
  { name: "Jul", animals: 205, feedingCompleted: 125 },
  { name: "Aug", animals: 198, feedingCompleted: 118 },
  { name: "Sep", animals: 185, feedingCompleted: 102 },
  { name: "Oct", animals: 168, feedingCompleted: 88 },
  { name: "Nov", animals: 142, feedingCompleted: 72 },
  { name: "Dec", animals: 125, feedingCompleted: 58 },
];

// Backward compatibility aliases
export const weekData = activityWeekData;
export const monthData = activityMonthData;
export const yearData = activityYearData;

// -----------------------------------------------------------------------------
// Feeding Efficiency Data
// -----------------------------------------------------------------------------

export const feedingWeekData = [
  { name: "Mon", efficiency: 80 },
  { name: "Tue", efficiency: 85 },
  { name: "Wed", efficiency: 78 },
  { name: "Thu", efficiency: 90 },
  { name: "Fri", efficiency: 92 },
  { name: "Sat", efficiency: 88 },
  { name: "Sun", efficiency: 95 },
];

export const feedingMonthData = [
  { name: "Week 1", efficiency: 82 },
  { name: "Week 2", efficiency: 87 },
  { name: "Week 3", efficiency: 91 },
  { name: "Week 4", efficiency: 89 },
];

export const feedingYearData = [
  { name: "Jan", efficiency: 70 },
  { name: "Feb", efficiency: 73 },
  { name: "Mar", efficiency: 78 },
  { name: "Apr", efficiency: 85 },
  { name: "May", efficiency: 90 },
  { name: "Jun", efficiency: 93 },
  { name: "Jul", efficiency: 95 },
  { name: "Aug", efficiency: 92 },
  { name: "Sep", efficiency: 88 },
  { name: "Oct", efficiency: 82 },
  { name: "Nov", efficiency: 76 },
  { name: "Dec", efficiency: 72 },
];

// Backward compatibility aliases
export const foragingWeekData = feedingWeekData;
export const foragingMonthData = feedingMonthData;
export const foragingYearData = feedingYearData;

// -----------------------------------------------------------------------------
// Diet Distribution Data
// -----------------------------------------------------------------------------

export const dietWeekData = [
  { name: "Fresh Produce", value: 35 },
  { name: "Protein/Meat", value: 30 },
  { name: "Grains & Pellets", value: 20 },
  { name: "Supplements", value: 15 },
];

export const dietMonthData = [
  { name: "Fresh Produce", value: 38 },
  { name: "Protein/Meat", value: 28 },
  { name: "Grains & Pellets", value: 22 },
  { name: "Supplements", value: 12 },
];

export const dietYearData = [
  { name: "Fresh Produce", value: 32 },
  { name: "Protein/Meat", value: 32 },
  { name: "Grains & Pellets", value: 24 },
  { name: "Supplements", value: 12 },
];

// Backward compatibility aliases
export const foodWeekData = dietWeekData;
export const foodMonthData = dietMonthData;
export const foodYearData = dietYearData;

// -----------------------------------------------------------------------------
// Chart Colors
// -----------------------------------------------------------------------------

export const COLORS_DARK = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"];
export const COLORS_LIGHT = ["#2563eb", "#059669", "#d97706", "#dc2626"];

export const getColors = (darkMode) => (darkMode ? COLORS_DARK : COLORS_LIGHT);

// -----------------------------------------------------------------------------
// Animation Variants
// -----------------------------------------------------------------------------

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const dropdownVariants = {
  closed: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: { duration: 0.15, ease: "easeInOut" },
  },
  open: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.15, ease: "easeInOut" },
  },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

// -----------------------------------------------------------------------------
// Initial Zoo Data
// -----------------------------------------------------------------------------

export const initialZooData = {
  population: 847,
  temperature: 24.5,
  humidity: 58,
  lastUpdated: new Date().toLocaleString(),
};

// Backward compatibility alias
export const initialColonyData = initialZooData;

// -----------------------------------------------------------------------------
// Initial Notes
// -----------------------------------------------------------------------------

export const initialNotes = [
  {
    id: 1,
    content:
      "Lion enclosure: Male lion showing increased appetite after medication completed",
    timestamp: new Date(Date.now() - 86400000).toLocaleString(),
  },
  {
    id: 2,
    content:
      "Penguin habitat: Water filtration system maintenance scheduled for next week",
    timestamp: new Date(Date.now() - 172800000).toLocaleString(),
  },
];

// -----------------------------------------------------------------------------
// Initial Alerts
// -----------------------------------------------------------------------------

export const initialAlerts = [
  {
    id: 1,
    message: "Elephant enclosure temperature above optimal range",
    type: "warning",
    time: "2 hours ago",
  },
  {
    id: 2,
    message: "Veterinary checkup completed for primates section",
    type: "info",
    time: "1 day ago",
  },
  {
    id: 3,
    message: "Low stock alert: Vitamin supplements for reptile house",
    type: "warning",
    time: "3 days ago",
  },
];

// -----------------------------------------------------------------------------
// Alert Messages
// -----------------------------------------------------------------------------

export const alertMessages = [
  "Elephant enclosure temperature above optimal range",
  "Veterinary checkup completed for primates section",
  "Low stock alert: Vitamin supplements for reptile house",
  "Unusual behavior detected in big cats section",
  "Humidity level critical in tropical bird aviary",
  "New animal arrival scheduled for quarantine area",
  "Feeding schedule delayed for aquatic mammals",
];

// -----------------------------------------------------------------------------
// Typography
// -----------------------------------------------------------------------------

export const fontFamily = "'Manrope', sans-serif";
export const fontFamilyHeading = "'Poppins', sans-serif";

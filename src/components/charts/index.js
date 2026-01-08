// =============================================================================
// LEADFLOW DASHBOARD - CHART COMPONENTS INDEX
// Central export point for all chart-related components
// =============================================================================

// Error Boundary for Charts
export { default as ChartErrorBoundary } from "./ChartErrorBoundary.jsx";

// Re-export chart components from parent directory for convenience
// These will be gradually moved into this directory
export { default as LeadActivityChart } from "../AnimalActivityChart.jsx";
export { default as ConversionRateChart } from "../FeedingEfficiencyChart.jsx";
export { default as LeadSourceChart } from "../DietDistributionChart.jsx";

// Backward compatibility aliases
export { default as AnimalActivityChart } from "../AnimalActivityChart.jsx";
export { default as FeedingEfficiencyChart } from "../FeedingEfficiencyChart.jsx";
export { default as DietDistributionChart } from "../DietDistributionChart.jsx";

// Chart utility components
export { default as ChartComponents } from "../ChartComponents.jsx";
export { default as CustomTooltip } from "../CustomTooltip.jsx";
export { default as TimePeriodButtons } from "../TimePeriodButtons.jsx";

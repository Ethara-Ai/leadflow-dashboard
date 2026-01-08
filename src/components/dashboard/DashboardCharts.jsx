// =============================================================================
// LEADFLOW DASHBOARD - DASHBOARD CHARTS
// Charts section component with memoized styles and context integration
// =============================================================================

import { memo } from "react";
import { useDashboard } from "../../context/index.js";
import useTheme from "../../hooks/useTheme.jsx";
import useChartStyles from "../../hooks/useChartStyles.js";
import LeadActivityChart from "../LeadActivityChart.jsx";
import ConversionRateChart from "../ConversionRateChart.jsx";
import LeadSourceChart from "../LeadSourceChart.jsx";
import AlertsPanel from "../AlertsPanel.jsx";
import { ChartErrorBoundary } from "../charts/index.js";

/**
 * DashboardCharts Component
 * Renders all chart components with error boundaries and memoized styles
 * Connects to dashboard context for data and state management
 */
const DashboardCharts = memo(function DashboardCharts() {
  const { isDark } = useTheme();
  const {
    // Chart data
    activityData,
    conversionData,
    sourceData,
    // Chart periods
    activityPeriod,
    conversionPeriod,
    sourcePeriod,
    setActivityPeriod,
    setConversionPeriod,
    setSourcePeriod,
    // Alerts
    alerts,
    openAlertsModal,
  } = useDashboard();

  // Get memoized chart styles
  const chartStyles = useChartStyles(isDark);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Main Charts Column */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {/* Lead Activity Chart with Error Boundary */}
        <ChartErrorBoundary chartName="Lead Activity" isDark={isDark} height="320px">
          <LeadActivityChart
            data={activityData}
            timePeriod={activityPeriod}
            setTimePeriod={setActivityPeriod}
            chartStyles={chartStyles}
          />
        </ChartErrorBoundary>

        {/* Conversion Rate Chart with Error Boundary */}
        <ChartErrorBoundary chartName="Conversion Rate" isDark={isDark} height="320px">
          <ConversionRateChart
            data={conversionData}
            timePeriod={conversionPeriod}
            setTimePeriod={setConversionPeriod}
            chartStyles={chartStyles}
          />
        </ChartErrorBoundary>
      </div>

      {/* Side Column */}
      <div className="space-y-4 sm:space-y-6">
        {/* Lead Source Distribution Chart with Error Boundary */}
        <ChartErrorBoundary chartName="Lead Sources" isDark={isDark} height="320px">
          <LeadSourceChart
            data={sourceData}
            timePeriod={sourcePeriod}
            setTimePeriod={setSourcePeriod}
            chartStyles={chartStyles}
          />
        </ChartErrorBoundary>

        {/* Alerts Panel */}
        <AlertsPanel alerts={alerts} onOpenModal={openAlertsModal} />
      </div>
    </div>
  );
});

export default DashboardCharts;

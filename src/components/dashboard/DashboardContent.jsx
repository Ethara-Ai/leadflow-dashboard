// =============================================================================
// LEADFLOW DASHBOARD - DASHBOARD CONTENT
// Main content area component that orchestrates the dashboard layout
// =============================================================================

import { memo, useState, useCallback, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "../../context/index.js";
import useTheme from "../../hooks/useTheme.jsx";
import useGlobalStyles from "../../hooks/useGlobalStyles.js";
import DashboardHeader from "./DashboardHeader.jsx";
import DashboardCharts from "./DashboardCharts.jsx";
import DashboardModals from "./DashboardModals.jsx";
import StatCards from "../StatCards.jsx";
import MeetingScheduleCard from "../MeetingScheduleCard.jsx";
import RecentLeadActivities from "../RecentLeadActivities.jsx";
import WelcomeMessage from "../WelcomeMessage.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import LoadingSkeleton from "../LoadingSkeleton.jsx";
import Footer from "../Footer.jsx";
import {
  staggerContainerVariants,
  fontFamily,
  activityWeekData,
  initialMeetings,
  initialActivities,
} from "../../constants/index.js";

/**
 * DashboardContent Component
 * Main content area that orchestrates the dashboard layout.
 * Uses the DashboardContext for state management and coordinates
 * between all dashboard sub-components.
 */
const DashboardContent = memo(function DashboardContent() {
  // Get theme from context
  const { isDark } = useTheme();

  // UI states
  const [isMounted, setIsMounted] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Get dashboard state from context
  const { leadData, isLoading, error, openProductModal, openResourcesModal, openCompanyModal } = useDashboard();

  // Apply global styles (scrollbars, etc.)
  useGlobalStyles(isDark);

  // Use useLayoutEffect for mount detection to avoid flash of empty content
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  // Event handlers
  const handleCloseWelcome = useCallback(() => {
    setShowWelcomeMessage(false);
  }, []);

  // Don't render until mounted (prevents hydration issues)
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 overflow-x-hidden overflow-y-auto ${
        isDark
          ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          : "bg-linear-to-br from-slate-50 via-white to-slate-50 text-slate-900"
      }`}
      style={{
        fontFamily: `${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* Header with controls */}
        <DashboardHeader />

        {/* Welcome Message (dismissible) */}
        <AnimatePresence>
          {showWelcomeMessage && <WelcomeMessage show={showWelcomeMessage} onClose={handleCloseWelcome} />}
        </AnimatePresence>

        {/* Error Display */}
        <ErrorMessage error={error} />

        {/* Main Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div
            className="space-y-6 sm:space-y-8"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Statistics Cards */}
            <StatCards leadData={leadData} activityData={activityWeekData} />

            {/* Charts Section with Error Boundaries */}
            <DashboardCharts />

            {/* Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <MeetingScheduleCard meetings={initialMeetings} />
              <RecentLeadActivities activities={initialActivities} />
            </div>

            {/* Last Updated Footer */}
            <motion.div
              className={`mt-12 text-center text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <p className="font-medium" style={{ fontFamily }}>
                Last updated: {leadData.lastUpdated}
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <Footer
        onOpenProductModal={openProductModal}
        onOpenResourcesModal={openResourcesModal}
        onOpenCompanyModal={openCompanyModal}
      />

      {/* All Modals */}
      <DashboardModals />
    </div>
  );
});

export default DashboardContent;

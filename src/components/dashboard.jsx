import { useState, useCallback, memo, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Hooks
import useGlobalStyles from "../hooks/useGlobalStyles";
import useTheme from "../hooks/useTheme";
import ThemeProvider from "../hooks/ThemeProvider";
import useLeadData from "../hooks/useLeadData";
import useAlerts from "../hooks/useAlerts";
import useNotes from "../hooks/useNotes";
import useModals from "../hooks/useModals";
import useChartPeriods from "../hooks/useChartPeriods";

// Components
import Header from "./Header";
import StatCards from "./StatCards";
import AnimalActivityChart from "./AnimalActivityChart";
import FeedingEfficiencyChart from "./FeedingEfficiencyChart";
import DietDistributionChart from "./DietDistributionChart";
import AlertsPanel from "./AlertsPanel";
import MeetingScheduleCard from "./MeetingScheduleCard";
import RecentLeadActivities from "./RecentLeadActivities";
import WelcomeMessage from "./WelcomeMessage";
import ErrorMessage from "./ErrorMessage";
import LoadingSkeleton from "./LoadingSkeleton";
import Footer from "./Footer";
import FooterModal from "./FooterModal";
import NotesModal from "./NotesModal";
import AlertsModal from "./AlertsModal";
import ProductModalContent from "./ProductModalContent";
import ResourcesModalContent from "./ResourcesModalContent";
import CompanyModalContent from "./CompanyModalContent";
import ErrorBoundary from "./ErrorBoundary";
import { ChartErrorBoundary } from "./charts/index.js";

// Constants - using new modular structure
import {
  staggerContainerVariants,
  fontFamily,
  activityWeekData,
  initialMeetings,
  initialActivities,
} from "../constants/index.js";

// Utils
import { exportToCSV, exportToJSON, generateExportFilename } from "../utils";

/**
 * Memoized chart section with error boundaries around each chart
 * Prevents individual chart failures from crashing the entire dashboard
 */
const ChartSection = memo(function ChartSection({
  activityData,
  activityPeriod,
  setActivityPeriod,
  feedingData,
  feedingPeriod,
  setFeedingPeriod,
  dietData,
  dietPeriod,
  setDietPeriod,
  alerts,
  onOpenAlertsModal,
  isDark,
}) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Lead Activity Chart with Error Boundary */}
          <ChartErrorBoundary chartName="Lead Activity" isDark={isDark} height="320px">
            <AnimalActivityChart data={activityData} timePeriod={activityPeriod} setTimePeriod={setActivityPeriod} />
          </ChartErrorBoundary>

          {/* Conversion Rate Chart with Error Boundary */}
          <ChartErrorBoundary chartName="Conversion Rate" isDark={isDark} height="320px">
            <FeedingEfficiencyChart data={feedingData} timePeriod={feedingPeriod} setTimePeriod={setFeedingPeriod} />
          </ChartErrorBoundary>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Lead Source Distribution Chart with Error Boundary */}
          <ChartErrorBoundary chartName="Lead Sources" isDark={isDark} height="320px">
            <DietDistributionChart data={dietData} timePeriod={dietPeriod} setTimePeriod={setDietPeriod} />
          </ChartErrorBoundary>

          {/* Alerts Panel */}
          <AlertsPanel alerts={alerts} onOpenModal={onOpenAlertsModal} />
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        <MeetingScheduleCard meetings={initialMeetings} />
        <RecentLeadActivities activities={initialActivities} />
      </div>
    </>
  );
});

/**
 * Inner dashboard component that uses the theme context
 * Separated to allow useTheme hook to access ThemeProvider
 */
const DashboardContent = () => {
  // Get theme from context
  const { isDark: darkMode, toggleTheme } = useTheme();

  // UI states
  const [isMounted, setIsMounted] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Use custom hooks for state management
  const { alerts, addAlert, clearAlerts } = useAlerts();
  const { notes, addNote, deleteNote } = useNotes();
  const {
    isNotesOpen,
    isProductModalOpen,
    isResourcesModalOpen,
    isCompanyModalOpen,
    isAlertsModalOpen,
    openNotes,
    closeNotes,
    openProductModal,
    closeProductModal,
    openResourcesModal,
    closeResourcesModal,
    openCompanyModal,
    closeCompanyModal,
    openAlertsModal,
    closeAlertsModal,
  } = useModals();

  // Handle new alerts from lead data refresh
  const handleNewAlert = useCallback(
    (alert) => {
      addAlert(alert);
    },
    [addAlert],
  );

  // Lead data management with API integration
  const {
    zooData: leadData,
    isLoading,
    error,
    refreshData,
  } = useLeadData({
    onNewAlert: handleNewAlert,
  });

  // Chart time periods management
  const {
    activityPeriod,
    setActivityPeriod,
    feedingPeriod,
    setFeedingPeriod,
    dietPeriod,
    setDietPeriod,
    activityData,
    feedingData,
    dietData,
  } = useChartPeriods();

  // Apply global styles (scrollbars, etc.)
  useGlobalStyles(darkMode);

  // Use useLayoutEffect for mount detection to avoid flash of empty content
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  // Event handlers - memoized to prevent unnecessary re-renders
  const handleAddAlert = useCallback(
    (message) => {
      addAlert(message);
    },
    [addAlert],
  );

  const handleClearAlerts = useCallback(() => {
    clearAlerts();
  }, [clearAlerts]);

  const handleSaveNote = useCallback(
    (content) => {
      addNote(content);
    },
    [addNote],
  );

  const handleDeleteNote = useCallback(
    (noteId) => {
      deleteNote(noteId);
    },
    [deleteNote],
  );

  const handleExportCSV = useCallback(() => {
    const data = {
      zooData: leadData,
      activityData,
      feedingData,
      dietData,
      alerts,
    };
    exportToCSV(data, generateExportFilename("csv"));
  }, [leadData, activityData, feedingData, dietData, alerts]);

  const handleExportJSON = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      leadMetrics: {
        totalLeads: leadData.population,
        callsMade: leadData.temperature,
        meetingsScheduled: leadData.humidity,
        lastUpdated: leadData.lastUpdated,
      },
      activityData,
      conversionRate: feedingData,
      leadSources: dietData,
      alerts: alerts.filter((alert) => !alert.dismissed),
      notes,
    };
    exportToJSON(data, generateExportFilename("json"));
  }, [leadData, activityData, feedingData, dietData, alerts, notes]);

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
        darkMode
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
        <Header
          isLoading={isLoading}
          onToggleDarkMode={toggleTheme}
          onRefresh={refreshData}
          onOpenNotes={openNotes}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
        />

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
            <StatCards zooData={leadData} activityData={activityWeekData} />

            {/* Charts Section with Error Boundaries */}
            <ChartSection
              activityData={activityData}
              activityPeriod={activityPeriod}
              setActivityPeriod={setActivityPeriod}
              feedingData={feedingData}
              feedingPeriod={feedingPeriod}
              setFeedingPeriod={setFeedingPeriod}
              dietData={dietData}
              dietPeriod={dietPeriod}
              setDietPeriod={setDietPeriod}
              alerts={alerts}
              onOpenAlertsModal={openAlertsModal}
              isDark={darkMode}
            />

            {/* Last Updated Footer */}
            <motion.div
              className={`mt-12 text-center text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}
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

      {/* Modals */}
      <NotesModal
        isOpen={isNotesOpen}
        onClose={closeNotes}
        notes={notes}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
      />

      <FooterModal isOpen={isProductModalOpen} onClose={closeProductModal} title="Product Information">
        <ProductModalContent />
      </FooterModal>

      <FooterModal isOpen={isResourcesModalOpen} onClose={closeResourcesModal} title="Resources & Community">
        <ResourcesModalContent />
      </FooterModal>

      <FooterModal isOpen={isCompanyModalOpen} onClose={closeCompanyModal} title="Company & Legal">
        <CompanyModalContent />
      </FooterModal>

      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={closeAlertsModal}
        alerts={alerts}
        onAddAlert={handleAddAlert}
        onClearAlerts={handleClearAlerts}
      />
    </div>
  );
};

/**
 * Dashboard Component
 * Main dashboard component wrapped with ThemeProvider and ErrorBoundary
 * for centralized theme management and error handling
 */
const Dashboard = () => {
  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <ThemeProvider defaultDarkMode={false}>
        <DashboardContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default Dashboard;

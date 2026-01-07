import { useState, useCallback, memo } from "react";
import { AnimatePresence } from "framer-motion";

// Hooks
import useGlobalStyles from "../hooks/useGlobalStyles";
import useTheme from "../hooks/useTheme";
import ThemeProvider from "../hooks/ThemeProvider";
import useZooData from "../hooks/useZooData";
import useAlerts from "../hooks/useAlerts";
import useNotes from "../hooks/useNotes";
import useModals, { MODAL_IDS } from "../hooks/useModals";
import useChartPeriods from "../hooks/useChartPeriods";

// Components
import Header from "./Header";
import StatCards from "./StatCards";
import AnimalActivityChart from "./AnimalActivityChart";
import FeedingEfficiencyChart from "./FeedingEfficiencyChart";
import DietDistributionChart from "./DietDistributionChart";
import AlertsPanel from "./AlertsPanel";
import WelcomeMessage from "./WelcomeMessage";
import ErrorMessage from "./ErrorMessage";
import LoadingSkeleton from "./LoadingSkeleton";
import Footer from "./Footer";
import FooterModal from "./FooterModal";
import NotesModal from "./NotesModal";
import ProductModalContent from "./ProductModalContent";
import ResourcesModalContent from "./ResourcesModalContent";
import CompanyModalContent from "./CompanyModalContent";
import ErrorBoundary from "./ErrorBoundary";

// Constants and Utils
import { staggerContainerVariants, fontFamily, activityWeekData } from "../constants";
import { exportToCSV, exportToJSON, generateExportFilename } from "../utils";

/**
 * Memoized chart section to prevent unnecessary re-renders
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
  onAddAlert,
  onClearAlerts,
}) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimalActivityChart data={activityData} timePeriod={activityPeriod} setTimePeriod={setActivityPeriod} />
        <FeedingEfficiencyChart data={feedingData} timePeriod={feedingPeriod} setTimePeriod={setFeedingPeriod} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DietDistributionChart data={dietData} timePeriod={dietPeriod} setTimePeriod={setDietPeriod} />
        <AlertsPanel alerts={alerts} onAddAlert={onAddAlert} onClearAlerts={onClearAlerts} />
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
    openNotes,
    closeNotes,
    openProductModal,
    closeProductModal,
    openResourcesModal,
    closeResourcesModal,
    openCompanyModal,
    closeCompanyModal,
  } = useModals();

  // Handle new alerts from zoo data refresh
  const handleNewAlert = useCallback(
    (alert) => {
      addAlert(alert);
    },
    [addAlert],
  );

  const { zooData, isLoading, error, refreshData } = useZooData({
    onNewAlert: handleNewAlert,
  });

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

  // Apply global styles
  useGlobalStyles(darkMode);

  // Use layout effect pattern for mount detection to avoid cascading renders
  // This is safe because we're only setting state once on mount
  if (!isMounted) {
    // This will trigger a re-render, but only once
    setTimeout(() => setIsMounted(true), 0);
  }

  // Event handlers
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
      zooData,
      activityData,
      feedingData,
      dietData,
      alerts,
    };
    exportToCSV(data, generateExportFilename("csv"));
  }, [zooData, activityData, feedingData, dietData, alerts]);

  const handleExportJSON = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      zooMetrics: zooData,
      activityData,
      feedingEfficiency: feedingData,
      dietDistribution: dietData,
      alerts: alerts.filter((alert) => !alert.dismissed),
      notes,
    };
    exportToJSON(data, generateExportFilename("json"));
  }, [zooData, activityData, feedingData, dietData, alerts, notes]);

  const handleCloseWelcome = useCallback(() => {
    setShowWelcomeMessage(false);
  }, []);

  // Don't render until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          : "bg-linear-to-br from-slate-50 via-white to-slate-50 text-slate-900"
      }`}
      style={{
        fontFamily: `${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
      }}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <Header
          isLoading={isLoading}
          onToggleDarkMode={toggleTheme}
          onRefresh={refreshData}
          onOpenNotes={openNotes}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
        />

        <AnimatePresence>
          {showWelcomeMessage && <WelcomeMessage show={showWelcomeMessage} onClose={handleCloseWelcome} />}
        </AnimatePresence>

        <ErrorMessage error={error} />

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div
            className="space-y-6 sm:space-y-8"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCards zooData={zooData} activityData={activityWeekData} />

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
              onAddAlert={handleAddAlert}
              onClearAlerts={handleClearAlerts}
            />

            <motion.div
              className={`mt-12 text-center text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <p className="font-medium" style={{ fontFamily }}>
                Last updated: {zooData.lastUpdated}
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

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
    </div>
  );
};

/**
 * ZoolabDashboard Component
 * Main dashboard component wrapped with ThemeProvider and ErrorBoundary
 * for centralized theme management and error handling
 */
const ZoolabDashboard = () => {
  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <ThemeProvider defaultDarkMode={false}>
        <DashboardContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default ZoolabDashboard;

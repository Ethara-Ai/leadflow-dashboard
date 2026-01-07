import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

// Hooks
import useGlobalStyles from "../hooks/useGlobalStyles";
import useTheme from "../hooks/useTheme";
import ThemeProvider from "../hooks/ThemeProvider";

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

// Constants and Utils
import {
  activityWeekData,
  activityMonthData,
  activityYearData,
  feedingWeekData,
  feedingMonthData,
  feedingYearData,
  dietWeekData,
  dietMonthData,
  dietYearData,
  staggerContainerVariants,
  initialZooData,
  initialNotes,
  initialAlerts,
  fontFamily,
} from "../constants";

import {
  getRandomAlertMessage,
  getAlertType,
  exportToCSV,
  exportToJSON,
  generateExportFilename,
} from "../utils";

/**
 * Inner dashboard component that uses the theme context
 * Separated to allow useTheme hook to access ThemeProvider
 */
const DashboardContent = () => {
  // Get theme from context
  const { isDark: darkMode, toggleTheme } = useTheme();

  // Time period states for charts
  const [timePeriod, setTimePeriod] = useState("week");
  const [foragingTimePeriod, setForagingTimePeriod] = useState("week");
  const [foodTimePeriod, setFoodTimePeriod] = useState("week");

  // UI states
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Modal states
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Data states
  const [zooData, setZooData] = useState(initialZooData);
  const [notes, setNotes] = useState(initialNotes);
  const [alerts, setAlerts] = useState(initialAlerts);

  // Apply global styles
  useGlobalStyles(darkMode);

  // Initial mount effect
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    const isAnyModalOpen =
      isNotesOpen ||
      isProductModalOpen ||
      isResourcesModalOpen ||
      isCompanyModalOpen;

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [
    isNotesOpen,
    isProductModalOpen,
    isResourcesModalOpen,
    isCompanyModalOpen,
  ]);

  // Don't render until mounted
  if (!isMounted) {
    return null;
  }

  // Data getters based on time period
  const getCurrentActivityData = () => {
    switch (timePeriod) {
      case "month":
        return activityMonthData;
      case "year":
        return activityYearData;
      default:
        return activityWeekData;
    }
  };

  const getCurrentFeedingData = () => {
    switch (foragingTimePeriod) {
      case "month":
        return feedingMonthData;
      case "year":
        return feedingYearData;
      default:
        return feedingWeekData;
    }
  };

  const getCurrentDietData = () => {
    switch (foodTimePeriod) {
      case "month":
        return dietMonthData;
      case "year":
        return dietYearData;
      default:
        return dietWeekData;
    }
  };

  // Event handlers
  const handleRefreshData = () => {
    setIsLoading(true);
    setError(null);

    try {
      const newPopulation = Math.floor(Math.random() * 50 + zooData.population);
      const newTemperature = +(
        Math.random() * 0.5 -
        0.25 +
        zooData.temperature
      ).toFixed(1);
      const newHumidity = Math.floor(
        Math.random() * 5 - 2.5 + zooData.humidity,
      );

      setZooData({
        population: newPopulation,
        temperature: newTemperature,
        humidity: newHumidity,
        lastUpdated: new Date().toLocaleString(),
      });

      if (Math.random() > 0.7) {
        const newAlertMessage = getRandomAlertMessage();
        const newAlertObj = {
          id: Date.now(),
          message: newAlertMessage,
          type: getAlertType(newAlertMessage),
          time: "Just now",
        };
        setAlerts((prev) => [newAlertObj, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError("Failed to refresh data. Please try again.");
      console.error(err);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleSaveNote = (content) => {
    const newNote = {
      id: Date.now(),
      content,
      timestamp: new Date().toLocaleString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const handleAddAlert = (message) => {
    const alertType = message.includes("warning")
      ? "warning"
      : message.includes("error")
        ? "error"
        : "info";

    const newAlertObj = {
      id: Date.now(),
      message,
      type: alertType,
      time: "Just now",
    };

    setAlerts((prev) => [newAlertObj, ...prev].slice(0, 5));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  const handleExportCSV = () => {
    const data = {
      zooData,
      activityData: getCurrentActivityData(),
      feedingData: getCurrentFeedingData(),
      dietData: getCurrentDietData(),
      alerts,
    };
    exportToCSV(data, generateExportFilename("csv"));
  };

  const handleExportJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      zooMetrics: zooData,
      activityData: getCurrentActivityData(),
      feedingEfficiency: getCurrentFeedingData(),
      dietDistribution: getCurrentDietData(),
      alerts: alerts.filter((alert) => !alert.dismissed),
      notes,
    };
    exportToJSON(data, generateExportFilename("json"));
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          : "bg-linear-to-br from-slate-50 via-white to-slate-50 text-slate-900"
      }`}
      style={{
        fontFamily: `${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        scrollbarWidth: "thin",
        scrollbarColor: darkMode ? "#475569 #1e293b" : "#cbd5e1 #f1f5f9",
      }}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <Header
          isLoading={isLoading}
          onToggleDarkMode={toggleTheme}
          onRefresh={handleRefreshData}
          onOpenNotes={() => setIsNotesOpen(true)}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
        />

        <AnimatePresence>
          {showWelcomeMessage && (
            <WelcomeMessage
              show={showWelcomeMessage}
              onClose={() => setShowWelcomeMessage(false)}
            />
          )}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimalActivityChart
                data={getCurrentActivityData()}
                timePeriod={timePeriod}
                setTimePeriod={setTimePeriod}
              />
              <FeedingEfficiencyChart
                data={getCurrentFeedingData()}
                timePeriod={foragingTimePeriod}
                setTimePeriod={setForagingTimePeriod}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DietDistributionChart
                data={getCurrentDietData()}
                timePeriod={foodTimePeriod}
                setTimePeriod={setFoodTimePeriod}
              />
              <AlertsPanel
                alerts={alerts}
                onAddAlert={handleAddAlert}
                onClearAlerts={handleClearAlerts}
              />
            </div>

            <motion.div
              className={`mt-12 text-center text-sm ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
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
        onOpenProductModal={() => setIsProductModalOpen(true)}
        onOpenResourcesModal={() => setIsResourcesModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* Modals */}
      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={notes}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
      />

      <FooterModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Product Information"
      >
        <ProductModalContent />
      </FooterModal>

      <FooterModal
        isOpen={isResourcesModalOpen}
        onClose={() => setIsResourcesModalOpen(false)}
        title="Resources & Community"
      >
        <ResourcesModalContent />
      </FooterModal>

      <FooterModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        title="Company & Legal"
      >
        <CompanyModalContent />
      </FooterModal>
    </div>
  );
};

/**
 * AntColonyDashboard Component
 * Main dashboard component wrapped with ThemeProvider for centralized theme management
 */
const AntColonyDashboard = () => {
  return (
    <ThemeProvider defaultDarkMode={false}>
      <DashboardContent />
    </ThemeProvider>
  );
};

export default AntColonyDashboard;

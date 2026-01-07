import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  PawPrint,
  Sun,
  Moon,
  RotateCcw,
  StickyNote,
  Menu,
  Download,
  FileText,
} from "lucide-react";
import { dropdownVariants, fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * Header Component
 * Application header with navigation controls, theme toggle, and action buttons.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether data is currently loading
 * @param {function} props.onToggleDarkMode - Callback when dark mode is toggled
 * @param {function} props.onRefresh - Callback when refresh button is clicked
 * @param {function} props.onOpenNotes - Callback when notes button is clicked
 * @param {function} props.onExportCSV - Callback when CSV export is clicked
 * @param {function} props.onExportJSON - Callback when JSON export is clicked
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const Header = ({
  isLoading,
  onToggleDarkMode,
  onRefresh,
  onOpenNotes,
  onExportCSV,
  onExportJSON,
  darkMode: darkModeOverride,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  // Handler for logo click - reload page
  const handleLogoClick = () => {
    window.location.reload();
  };

  // Handler for logo keyboard interaction
  const handleLogoKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      window.location.reload();
    }
  };

  // Common button classes based on theme
  const buttonClasses = isDark
    ? "bg-slate-800/60 border-slate-700/50 shadow-lg shadow-slate-900/20"
    : "bg-white/90 border-slate-200/60 shadow-lg shadow-slate-900/10";

  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 md:mb-12">
      {/* Logo and Title Section */}
      <div className="mb-4 sm:mb-6 lg:mb-0 w-full lg:w-auto">
        <motion.div
          className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-4 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={handleLogoKeyDown}
        >
          <div
            className={`p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl ${
              isDark ? "bg-emerald-900/30" : "bg-emerald-100"
            }`}
          >
            <PawPrint
              className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight ${
              isDark ? "text-white" : "text-slate-800"
            }`}
            style={{
              fontFamily,
              textShadow: isDark
                ? "0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)"
                : "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)",
              transform: "perspective(1000px) rotateX(5deg)",
            }}
          >
            ZOOLAB
          </h1>
        </motion.div>
        <p
          className={`text-xs sm:text-sm md:text-base lg:text-lg font-medium ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
          style={{ fontFamily }}
        >
          Professional zoo animal monitoring and management system
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 w-full lg:w-auto justify-end">
        {/* Dark Mode Toggle */}
        <motion.button
          onClick={onToggleDarkMode}
          className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${buttonClasses} ${
            isDark ? "text-yellow-400" : "text-slate-700"
          } border backdrop-blur-lg hover:shadow-xl cursor-pointer`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </motion.button>

        {/* Refresh Button */}
        <motion.button
          onClick={onRefresh}
          className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${buttonClasses} ${
            isDark ? "text-blue-400" : "text-slate-700"
          } border backdrop-blur-lg hover:shadow-xl cursor-pointer`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          aria-label="Refresh data"
        >
          <RotateCcw
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? "animate-spin" : ""}`}
          />
        </motion.button>

        {/* Notes Button */}
        <motion.button
          onClick={onOpenNotes}
          className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${buttonClasses} ${
            isDark ? "text-slate-300" : "text-slate-700"
          } border backdrop-blur-lg hover:shadow-xl cursor-pointer`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open notes"
        >
          <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Menu Button */}
        <motion.div className="relative">
          <motion.button
            className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${buttonClasses} ${
              isDark ? "text-slate-300" : "text-slate-700"
            } border backdrop-blur-lg hover:shadow-xl cursor-pointer`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop to close menu when clicking outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  className={`absolute right-0 mt-2 w-48 sm:w-56 ${
                    isDark
                      ? "bg-slate-800/95 border-slate-700"
                      : "bg-white/95 border-slate-300"
                  } backdrop-blur-md rounded-lg sm:rounded-xl border shadow-xl overflow-hidden z-50`}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={dropdownVariants}
                >
                  <div className="p-1.5 sm:p-2">
                    <motion.button
                      onClick={() => {
                        onExportCSV();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 sm:gap-3 cursor-pointer ${
                        isDark
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ fontFamily }}
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Export Data (CSV)
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        onExportJSON();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 sm:gap-3 cursor-pointer ${
                        isDark
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ fontFamily }}
                    >
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Export Data (JSON)
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;

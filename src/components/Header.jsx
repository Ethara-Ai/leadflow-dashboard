import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Sun,
  Moon,
  RotateCcw,
  StickyNote,
  Menu,
  Download,
  FileText,
  FileDown,
} from "lucide-react";
import { dropdownVariants, fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";

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
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  // Prevent background scroll when hamburger menu is open on mobile/tablet
  useEffect(() => {
    if (isHamburgerMenuOpen) {
      // Only apply on mobile/tablet devices (lg breakpoint is 1024px)
      const isMobileOrTablet = window.innerWidth < 1024;
      if (isMobileOrTablet) {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${window.scrollY}px`;
      }
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isHamburgerMenuOpen]);

  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

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
    <header className="flex flex-row justify-between items-center mb-6 sm:mb-8 md:mb-12">
      {/* Logo and Title Section */}
      <div className="w-auto">
        <motion.div
          className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={handleLogoKeyDown}
          aria-label="Reload page"
        >
          <div
            className={`p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl ${
              isDark ? "bg-blue-900/30" : "bg-blue-100"
            }`}
          >
            <Zap
              className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            />
          </div>
          <div className="flex flex-col justify-center h-full">
            <h1
              className={`text-[2rem] font-black tracking-tight leading-none ${
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
              LeadFlow
            </h1>
            <p
              className={`hidden lg:block text-[0.625rem] sm:text-[0.75rem] font-medium leading-tight mt-1.5 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
              style={{ fontFamily }}
            >
              Lead generation and management platform
            </p>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 w-full lg:w-auto justify-end">
        {/* Hamburger Menu for Small Devices and Tablets */}
        <motion.div className="relative lg:hidden">
          <motion.button
            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 ${buttonClasses} ${
              isDark ? "text-slate-300" : "text-slate-700"
            } border backdrop-blur-lg hover:shadow-xl cursor-pointer`}
            onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open navigation menu"
            aria-expanded={isHamburgerMenuOpen}
            aria-haspopup="true"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>

          <AnimatePresence>
            {isHamburgerMenuOpen && (
              <>
                {/* Backdrop to close menu when clicking outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsHamburgerMenuOpen(false)}
                  aria-hidden="true"
                />
                <motion.div
                  className={`absolute right-0 mt-2 w-56 ${
                    isDark
                      ? "bg-slate-800/95 border-slate-700"
                      : "bg-white/95 border-slate-300"
                  } backdrop-blur-md rounded-xl border shadow-xl overflow-hidden z-50`}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={dropdownVariants}
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="p-2">
                    {/* Dark Mode Toggle */}
                    <motion.button
                      onClick={() => {
                        onToggleDarkMode();
                        setIsHamburgerMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
                        isDark
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ fontFamily }}
                      role="menuitem"
                    >
                      {isDark ? (
                        <Sun className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </motion.button>

                    {/* Refresh Button */}
                    <motion.button
                      onClick={() => {
                        onRefresh();
                        setIsHamburgerMenuOpen(false);
                      }}
                      disabled={isLoading}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
                        isDark
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ fontFamily }}
                      role="menuitem"
                    >
                      <RotateCcw
                        className={`w-4 h-4 ${isDark ? "text-blue-400" : ""} ${isLoading ? "animate-spin" : ""}`}
                      />
                      Refresh Data
                    </motion.button>

                    {/* Notes Button */}
                    <motion.button
                      onClick={() => {
                        onOpenNotes();
                        setIsHamburgerMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
                        isDark
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ fontFamily }}
                      role="menuitem"
                    >
                      <StickyNote className="w-4 h-4" />
                      Notes
                    </motion.button>

                    {/* Export CSV */}
                    <motion.button
                      onClick={() => {
                        onExportCSV();
                        setIsHamburgerMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
                        isDark
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ fontFamily }}
                      role="menuitem"
                    >
                      <Download className="w-4 h-4" />
                      Export Data (CSV)
                    </motion.button>

                    {/* Export JSON */}
                    <motion.button
                      onClick={() => {
                        onExportJSON();
                        setIsHamburgerMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
                        isDark
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ fontFamily }}
                      role="menuitem"
                    >
                      <FileText className="w-4 h-4" />
                      Export Data (JSON)
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Desktop Action Buttons - Hidden on small devices and tablets */}
        {/* Dark Mode Toggle */}
        <motion.button
          onClick={onToggleDarkMode}
          className={`hidden lg:flex p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${buttonClasses} ${
            isDark ? "text-yellow-400" : "text-slate-700"
          } border backdrop-blur-lg hover:shadow-xl cursor-pointer`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
          className={`hidden lg:flex p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${buttonClasses} ${
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
          className={`hidden lg:flex p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${buttonClasses} ${
            isDark ? "text-slate-300" : "text-slate-700"
          } border backdrop-blur-lg hover:shadow-xl cursor-pointer`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open notes"
        >
          <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Menu Button */}
        <motion.div className="relative hidden lg:block">
          <motion.button
            className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${buttonClasses} ${
              isDark ? "text-slate-300" : "text-slate-700"
            } border backdrop-blur-lg hover:shadow-xl cursor-pointer`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-haspopup="true"
          >
            <FileDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop to close menu when clicking outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-hidden="true"
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
                  role="menu"
                  aria-orientation="vertical"
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
                      role="menuitem"
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
                      role="menuitem"
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

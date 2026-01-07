// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * FooterModal Component
 * A reusable modal wrapper for footer content with theme support.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const FooterModal = ({
  isOpen,
  onClose,
  title,
  children,
  darkMode: darkModeOverride,
}) => {
  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`${
              isDark
                ? "bg-slate-800/95 border-slate-700"
                : "bg-white/95 border-slate-300"
            } backdrop-blur-md rounded-2xl border shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden`}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`p-6 border-b ${
                isDark ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}
                  style={{ fontFamily }}
                >
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isDark
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto custom-scroll">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FooterModal;

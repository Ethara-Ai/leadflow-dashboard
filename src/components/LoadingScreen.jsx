// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { fontFamily } from "../constants";

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Main content */}
      <div className="flex flex-col items-center">
        {/* Logo */}
        <motion.div
          className="w-16 h-16 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-9 h-9 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <ellipse cx="12" cy="17" rx="3.5" ry="3" />
            <ellipse cx="6" cy="10" rx="2" ry="2.5" />
            <ellipse cx="18" cy="10" rx="2" ry="2.5" />
            <ellipse cx="8.5" cy="6" rx="1.8" ry="2.2" />
            <ellipse cx="15.5" cy="6" rx="1.8" ry="2.2" />
          </svg>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-800"
          style={{ fontFamily }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          ZOOLAB
        </motion.h1>

        {/* Loading spinner */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <div className="w-8 h-8 border-3 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
        </motion.div>

        {/* Loading text */}
        <motion.p
          className="mt-4 text-sm text-slate-500 font-medium"
          style={{ fontFamily }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;

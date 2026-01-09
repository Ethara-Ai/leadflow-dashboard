import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  TrendingUp,
  UserPlus,
  FileText,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { cardVariants, fontFamily } from '../constants';
import useThemeSafe from '../hooks/useThemeSafe';

/**
 * RecentLeadActivities Component
 * Displays a timeline of recent lead interactions and activities
 *
 * @param {Object} props - Component props
 * @param {Array} props.activities - Array of activity objects
 * @param {boolean} [props.darkMode] - Override theme context (optional)
 */
const RecentLeadActivities = memo(function RecentLeadActivities({
  activities = [],
  darkMode: darkModeOverride,
}) {
  const { isDark } = useThemeSafe(darkModeOverride);

  // Theme classes
  const cardClasses = isDark
    ? 'bg-zinc-900/90 border-zinc-700/50 shadow-2xl shadow-black/60 ring-1 ring-zinc-600/10'
    : 'bg-white/90 border-slate-200/60 shadow-xl shadow-slate-900/10';
  const titleClasses = isDark ? 'text-zinc-200' : 'text-slate-700';

  // Activity type icons
  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return <Phone className="w-3.5 h-3.5" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5" />;
      case 'meeting':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'closed':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'status':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'new':
        return <UserPlus className="w-3.5 h-3.5" />;
      case 'proposal':
        return <FileText className="w-3.5 h-3.5" />;
      case 'note':
        return <MessageSquare className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  // Activity type colors
  const getActivityColor = (type) => {
    switch (type) {
      case 'call':
        return isDark
          ? 'bg-blue-900/40 text-blue-400 border-blue-800/50'
          : 'bg-blue-100 text-blue-600 border-blue-200';
      case 'email':
        return isDark
          ? 'bg-purple-900/40 text-purple-400 border-purple-800/50'
          : 'bg-purple-100 text-purple-600 border-purple-200';
      case 'meeting':
        return isDark
          ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50'
          : 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'closed':
        return isDark
          ? 'bg-green-900/40 text-green-400 border-green-800/50'
          : 'bg-green-100 text-green-600 border-green-200';
      case 'status':
        return isDark
          ? 'bg-amber-900/40 text-amber-400 border-amber-800/50'
          : 'bg-amber-100 text-amber-600 border-amber-200';
      case 'new':
        return isDark
          ? 'bg-cyan-900/40 text-cyan-400 border-cyan-800/50'
          : 'bg-cyan-100 text-cyan-600 border-cyan-200';
      case 'proposal':
        return isDark
          ? 'bg-indigo-900/40 text-indigo-400 border-indigo-800/50'
          : 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'note':
        return isDark
          ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
          : 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return isDark
          ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
          : 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // Priority badge colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return isDark
          ? 'bg-red-900/40 text-red-400 border-red-800/50'
          : 'bg-red-100 text-red-600 border-red-200';
      case 'medium':
        return isDark
          ? 'bg-amber-900/40 text-amber-400 border-amber-800/50'
          : 'bg-amber-100 text-amber-600 border-amber-200';
      case 'low':
        return isDark
          ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
          : 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return '';
    }
  };

  return (
    <motion.div
      className={`${cardClasses} backdrop-blur-lg rounded-2xl p-4 sm:p-5 border transition-all duration-300 hover:shadow-2xl h-auto min-[634px]:h-150 flex flex-col`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      variants={cardVariants}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-900/40' : 'bg-emerald-100'}`}>
            <TrendingUp className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <h3 className={`text-base sm:text-lg font-bold ${titleClasses}`} style={{ fontFamily }}>
            Recent Activities
          </h3>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'
          }`}
          style={{ fontFamily }}
        >
          Last 24h
        </span>
      </div>

      {/* Activities Timeline - Fixed height with scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto hidden-scrollbar">
        {activities.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div
              className={`absolute left-5 top-3 bottom-3 w-0.5 ${
                isDark ? 'bg-zinc-700' : 'bg-slate-200'
              }`}
            />

            {/* Activities list */}
            <div className="space-y-2.5">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="relative pl-12 pr-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  {/* Icon */}
                  <div
                    className={`absolute left-2.5 top-1 p-1.5 rounded-lg border-2 ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Content */}
                  <motion.div
                    className={`p-2.5 rounded-lg border ${
                      isDark
                        ? 'bg-zinc-800/30 border-zinc-700/30 hover:bg-zinc-800/50'
                        : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100'
                    } transition-all duration-200`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isDark ? 'text-zinc-200' : 'text-slate-800'
                        }`}
                        style={{ fontFamily }}
                      >
                        {activity.title}
                      </p>
                      {activity.priority && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold border shrink-0 ${getPriorityColor(
                            activity.priority
                          )}`}
                          style={{ fontFamily }}
                        >
                          {activity.priority.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-[11px] mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}
                      style={{ fontFamily }}
                    >
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[11px] font-medium ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}
                        style={{ fontFamily }}
                      >
                        {activity.leadName}
                      </span>
                      <span
                        className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
                        style={{ fontFamily }}
                      >
                        {activity.timestamp}
                      </span>
                    </div>

                    {activity.amount && (
                      <div
                        className={`mt-1.5 pt-1.5 border-t ${
                          isDark ? 'border-zinc-700/30' : 'border-slate-200'
                        }`}
                      >
                        <span
                          className={`text-[11px] font-bold ${
                            isDark ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                          style={{ fontFamily }}
                        >
                          {activity.amount}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`p-4 rounded-full mb-3 ${isDark ? 'bg-zinc-800/30' : 'bg-slate-100'}`}>
              <TrendingUp className={`w-8 h-8 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`} />
            </div>
            <p
              className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}
              style={{ fontFamily }}
            >
              No recent activities
            </p>
            <p
              className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
              style={{ fontFamily }}
            >
              Activities will appear here as they happen
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

RecentLeadActivities.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf([
        'call',
        'email',
        'meeting',
        'closed',
        'status',
        'new',
        'proposal',
        'note',
      ]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      leadName: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      priority: PropTypes.oneOf(['high', 'medium', 'low']),
      amount: PropTypes.string,
    })
  ),
  darkMode: PropTypes.bool,
};

export default RecentLeadActivities;

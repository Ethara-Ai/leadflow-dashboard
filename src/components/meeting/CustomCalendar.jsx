import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fontFamily } from '../../constants';

/**
 * Custom Calendar Picker Component
 * A compact date picker for selecting meeting dates.
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Selected date in ISO format (YYYY-MM-DD)
 * @param {function} props.onChange - Callback when date is selected
 * @param {boolean} props.isDark - Whether dark mode is enabled
 * @param {function} props.onClose - Callback to close the calendar
 */
const CustomCalendar = memo(function CustomCalendar({ value, onChange, isDark, onClose }) {
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const selectedDate = value ? new Date(value) : null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleDateSelect = (day) => {
    if (day) {
      const selected = new Date(year, month, day);
      const formatted = selected.toISOString().split('T')[0];
      onChange(formatted);
      onClose();
    }
  };

  const isToday = (day) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const isPast = (day) => {
    if (!day) return false;
    const date = new Date(year, month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.12 }}
      className={`absolute top-full left-0 mt-1.5 p-1.5 rounded-xl border shadow-xl z-50 w-44 ${
        isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <button
          type="button"
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className={`p-0.5 rounded transition-colors cursor-pointer ${
            isDark ? 'hover:bg-zinc-700 text-zinc-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <ChevronLeft size={12} />
        </button>
        <span
          className={`text-[10px] font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}
          style={{ fontFamily }}
        >
          {currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className={`p-0.5 rounded transition-colors cursor-pointer ${
            isDark ? 'hover:bg-zinc-700 text-zinc-400' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-0.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div
            key={i}
            className={`text-center text-[8px] font-medium py-0.5 ${
              isDark ? 'text-zinc-500' : 'text-slate-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => (
          <button
            key={i}
            type="button"
            disabled={!day || isPast(day)}
            onClick={() => handleDateSelect(day)}
            className={`
              w-5 h-5 text-[10px] rounded transition-all duration-100 font-medium
              ${!day ? 'invisible' : ''}
              ${isPast(day) ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              ${
                isSelected(day)
                  ? 'bg-blue-500 text-white shadow-sm'
                  : isToday(day)
                    ? isDark
                      ? 'bg-blue-950/60 text-blue-400 ring-1 ring-blue-500'
                      : 'bg-blue-100 text-blue-600 ring-1 ring-blue-400'
                    : isDark
                      ? 'text-zinc-300 hover:bg-zinc-700'
                      : 'text-slate-700 hover:bg-slate-100'
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>
    </motion.div>
  );
});

CustomCalendar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomCalendar;

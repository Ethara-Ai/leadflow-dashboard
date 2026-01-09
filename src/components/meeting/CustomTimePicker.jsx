import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { fontFamily } from '../../constants';

/**
 * Custom Time Picker Component
 * A compact time picker with hour, minute, and AM/PM selection.
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Selected time in 24-hour format (HH:MM)
 * @param {function} props.onChange - Callback when time is selected
 * @param {boolean} props.isDark - Whether dark mode is enabled
 * @param {function} props.onClose - Callback to close the picker
 */
const CustomTimePicker = memo(function CustomTimePicker({ value, onChange, isDark, onClose }) {
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
    const [h, m] = timeStr.split(':').map(Number);
    return {
      hour: h === 0 ? 12 : h > 12 ? h - 12 : h,
      minute: m,
      period: h >= 12 ? 'PM' : 'AM',
    };
  };

  const [selected, setSelected] = useState(parseTime(value));

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const handleHourSelect = (hour) => {
    const newSelected = { ...selected, hour };
    setSelected(newSelected);
    updateTime(newSelected);
  };

  const handleMinuteSelect = (minute) => {
    const newSelected = { ...selected, minute };
    setSelected(newSelected);
    updateTime(newSelected);
  };

  const handlePeriodSelect = (period) => {
    const newSelected = { ...selected, period };
    setSelected(newSelected);
    updateTime(newSelected);
  };

  const updateTime = (sel) => {
    if (sel.hour === null || sel.minute === null) return;
    let hour24 = sel.hour;
    if (sel.period === 'PM' && hour24 !== 12) hour24 += 12;
    if (sel.period === 'AM' && hour24 === 12) hour24 = 0;
    const timeStr = `${hour24.toString().padStart(2, '0')}:${sel.minute.toString().padStart(2, '0')}`;
    onChange(timeStr);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.12 }}
      className={`absolute top-full left-0 mt-1.5 p-2 rounded-xl border shadow-xl z-50 ${
        isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'
      }`}
    >
      {/* Scrollable Time Columns */}
      <div className="flex gap-1">
        {/* Hours Column */}
        <div className="flex flex-col">
          <label
            className={`text-[9px] font-semibold mb-1 text-center ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}
            style={{ fontFamily }}
          >
            Hr
          </label>
          <div
            className={`h-24 overflow-y-auto rounded-lg p-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
              isDark ? 'bg-zinc-800/30' : 'bg-slate-50'
            }`}
          >
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleHourSelect(h)}
                className={`w-9 py-1 text-[11px] rounded-md transition-all font-medium cursor-pointer block mb-0.5 ${
                  selected.hour === h
                    ? 'bg-blue-500 text-white shadow-sm'
                    : isDark
                      ? 'text-zinc-300 hover:bg-zinc-600'
                      : 'text-slate-700 hover:bg-slate-200'
                }`}
                style={{ fontFamily }}
              >
                {h.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        {/* Minutes Column */}
        <div className="flex flex-col">
          <label
            className={`text-[9px] font-semibold mb-1 text-center ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}
            style={{ fontFamily }}
          >
            Min
          </label>
          <div
            className={`h-24 overflow-y-auto rounded-lg p-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
              isDark ? 'bg-zinc-800/30' : 'bg-slate-50'
            }`}
          >
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleMinuteSelect(m)}
                className={`w-9 py-1 text-[11px] rounded-md transition-all font-medium cursor-pointer block mb-0.5 ${
                  selected.minute === m
                    ? 'bg-blue-500 text-white shadow-sm'
                    : isDark
                      ? 'text-zinc-300 hover:bg-zinc-600'
                      : 'text-slate-700 hover:bg-slate-200'
                }`}
                style={{ fontFamily }}
              >
                {m.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        {/* AM/PM Column */}
        <div className="flex flex-col">
          <label
            className={`text-[9px] font-semibold mb-1 text-center ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}
            style={{ fontFamily }}
          >
            &nbsp;
          </label>
          <div className="flex flex-col gap-0.5">
            {['AM', 'PM'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriodSelect(p)}
                className={`w-9 py-2.5 text-[10px] rounded-md transition-all font-semibold cursor-pointer ${
                  selected.period === p
                    ? 'bg-blue-500 text-white shadow-sm'
                    : isDark
                      ? 'text-zinc-300 hover:bg-zinc-600 bg-zinc-800/30'
                      : 'text-slate-700 hover:bg-slate-200 bg-slate-50'
                }`}
                style={{ fontFamily }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Done Button */}
      <button
        type="button"
        onClick={onClose}
        className="mt-2 w-full py-1.5 text-[10px] font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer shadow-sm"
        style={{ fontFamily }}
      >
        Done
      </button>
    </motion.div>
  );
});

CustomTimePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomTimePicker;

import { useState, useRef, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  CalendarPlus,
  Clock,
  User,
  Video,
  Phone,
  Users,
  FileText,
  Mail,
} from 'lucide-react';
import { fontFamily, modalVariants, existingClients } from '../constants';
import useThemeSafe from '../hooks/useThemeSafe';
import {
  CustomCalendar,
  CustomTimePicker,
  CustomDropdown,
  CustomClientDropdown,
} from './meeting/index.js';

/**
 * Duration options for meeting length selection
 */
const DURATION_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
];

/**
 * Meeting type options with icons
 */
const TYPE_OPTIONS = [
  { value: 'video', label: 'Video Call', icon: Video },
  { value: 'phone', label: 'Phone Call', icon: Phone },
  { value: 'in-person', label: 'In Person', icon: Users },
];

/**
 * Format date for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Format time for display
 * @param {string} timeStr - Time in 24-hour format (HH:MM)
 * @returns {string} Formatted time in 12-hour format
 */
const formatDisplayTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

/**
 * Initial form state
 */
const INITIAL_FORM_STATE = {
  title: '',
  client: '',
  clientEmail: '',
  date: '',
  time: '',
  duration: '',
  type: '',
  reason: '',
};

/**
 * CreateMeetingModal Component
 * A modal dialog for creating new meetings with client selection,
 * date/time pickers, and meeting type configuration.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {function} props.onCreateMeeting - Callback when meeting is created
 * @param {Array} [props.clients] - Array of existing clients (defaults to existingClients from constants)
 * @param {boolean} [props.darkMode] - Override theme context
 */
const CreateMeetingModal = memo(function CreateMeetingModal({
  isOpen,
  onClose,
  onCreateMeeting,
  clients = existingClients,
  darkMode: darkModeOverride,
}) {
  const modalRef = useRef(null);
  const calendarRef = useRef(null);
  const timeRef = useRef(null);
  const { isDark } = useThemeSafe(darkModeOverride);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
      setShowCalendar(false);
      setShowTimePicker(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside for pickers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
      if (timeRef.current && !timeRef.current.contains(e.target)) {
        setShowTimePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (clientName) => {
    setFormData((prev) => ({ ...prev, client: clientName }));
  };

  const handleClientEmailChange = (email) => {
    setFormData((prev) => ({ ...prev, clientEmail: email }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const handleDurationChange = (duration) => {
    setFormData((prev) => ({ ...prev, duration }));
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newMeeting = {
      id: Date.now(),
      title: formData.title.trim(),
      client: formData.client.trim(),
      clientEmail: formData.clientEmail.trim(),
      date: formData.date,
      time: formData.time,
      duration: `${formData.duration} min`,
      type: formData.type,
      reason: formData.reason.trim(),
    };

    onCreateMeeting(newMeeting);
    onClose();
  };

  // Form validation
  const isFormValid =
    formData.title.trim() &&
    formData.client.trim() &&
    formData.date &&
    formData.time &&
    formData.duration &&
    formData.type;

  // Theme-based classes
  const inputClasses = isDark
    ? 'bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:border-blue-500'
    : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-500';

  const labelClasses = isDark ? 'text-zinc-400' : 'text-slate-500';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto h-dvh min-h-dvh"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
          style={{ height: '100dvh', minHeight: '-webkit-fill-available' }}
        >
          <motion.div
            ref={modalRef}
            className={`w-full max-w-md rounded-3xl border shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[85vh] my-2 sm:my-0 ${
              isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'
            }`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-meeting-title"
          >
            {/* Header */}
            <div
              className={`px-5 py-3.5 border-b flex items-center justify-between shrink-0 rounded-t-3xl ${
                isDark ? 'border-zinc-700 bg-zinc-900/80' : 'border-slate-100 bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isDark
                      ? 'bg-linear-to-br from-blue-600 to-indigo-600'
                      : 'bg-linear-to-br from-blue-500 to-indigo-500'
                  }`}
                >
                  <CalendarPlus className="w-4 h-4 text-white" />
                </div>
                <h2
                  id="create-meeting-title"
                  className={`text-lg font-bold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}
                  style={{ fontFamily }}
                >
                  New Meeting
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-zinc-700 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {/* Title */}
              <div>
                <label className={`text-xs font-semibold mb-2 block ${labelClasses}`}>
                  Meeting Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Product Demo, Sales Discussion"
                  className={`w-full p-2.5 rounded-lg border text-sm transition-all ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  style={{ fontFamily }}
                />
              </div>

              {/* Client Name */}
              <div>
                <label
                  className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${labelClasses}`}
                >
                  <User size={11} /> Client Name <span className="text-red-400">*</span>
                </label>
                <CustomClientDropdown
                  value={formData.client}
                  onChange={handleClientChange}
                  onEmailChange={handleClientEmailChange}
                  isDark={isDark}
                  placeholder="Search existing or type new client..."
                  clients={clients}
                />
              </div>

              {/* Client Email */}
              <div>
                <label
                  className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${labelClasses}`}
                >
                  <Mail size={11} /> Client Email
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  placeholder="e.g., client@company.com"
                  className={`w-full p-2.5 rounded-lg border text-sm transition-all ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  style={{ fontFamily }}
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Date Picker */}
                <div className="relative" ref={calendarRef}>
                  <label
                    className={`text-xs font-semibold mb-1.5 flex items-center gap-1 ${labelClasses}`}
                  >
                    <Calendar size={11} /> Date <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                      setShowTimePicker(false);
                    }}
                    className={`w-full p-2.5 rounded-lg border text-sm text-left transition-all cursor-pointer ${inputClasses} ${
                      showCalendar ? 'ring-2 ring-blue-500/30 border-blue-500' : ''
                    }`}
                    style={{ fontFamily }}
                  >
                    {formData.date ? (
                      formatDisplayDate(formData.date)
                    ) : (
                      <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>Select</span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showCalendar && (
                      <CustomCalendar
                        value={formData.date}
                        onChange={handleDateChange}
                        isDark={isDark}
                        onClose={() => setShowCalendar(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Time Picker */}
                <div className="relative" ref={timeRef}>
                  <label
                    className={`text-xs font-semibold mb-1.5 flex items-center gap-1 ${labelClasses}`}
                  >
                    <Clock size={11} /> Time <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTimePicker(!showTimePicker);
                      setShowCalendar(false);
                    }}
                    className={`w-full p-2.5 rounded-lg border text-sm text-left transition-all cursor-pointer ${inputClasses} ${
                      showTimePicker ? 'ring-2 ring-blue-500/30 border-blue-500' : ''
                    }`}
                    style={{ fontFamily }}
                  >
                    {formData.time ? (
                      formatDisplayTime(formData.time)
                    ) : (
                      <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>Select</span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showTimePicker && (
                      <CustomTimePicker
                        value={formData.time}
                        onChange={handleTimeChange}
                        isDark={isDark}
                        onClose={() => setShowTimePicker(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Duration & Type Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Duration */}
                <div>
                  <label
                    className={`text-xs font-semibold mb-1.5 flex items-center gap-1 ${labelClasses}`}
                  >
                    <Clock size={11} /> Duration <span className="text-red-400">*</span>
                  </label>
                  <CustomDropdown
                    value={formData.duration}
                    options={DURATION_OPTIONS}
                    onChange={handleDurationChange}
                    isDark={isDark}
                    placeholder="Select"
                    dropUp={true}
                  />
                </div>

                {/* Type */}
                <div>
                  <label
                    className={`text-xs font-semibold mb-1.5 flex items-center gap-1 ${labelClasses}`}
                  >
                    <Video size={11} /> Type <span className="text-red-400">*</span>
                  </label>
                  <CustomDropdown
                    value={formData.type}
                    options={TYPE_OPTIONS}
                    onChange={handleTypeChange}
                    isDark={isDark}
                    placeholder="Select"
                    dropUp={true}
                  />
                </div>
              </div>

              {/* Notes/Reason */}
              <div>
                <label
                  className={`text-xs font-semibold mb-1.5 flex items-center gap-1 ${labelClasses}`}
                >
                  <FileText size={11} /> Notes
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Meeting agenda or notes..."
                  rows={2}
                  className={`w-full p-2.5 rounded-lg border text-sm transition-all resize-none ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  style={{ fontFamily }}
                />
              </div>
            </form>

            {/* Footer */}
            <div
              className={`px-5 py-3 border-t flex gap-2 shrink-0 rounded-b-3xl ${
                isDark ? 'border-zinc-700 bg-zinc-900/80' : 'border-slate-100 bg-slate-50/80'
              }`}
            >
              <motion.button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ fontFamily }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={!isFormValid}
                onClick={handleSubmit}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isFormValid
                    ? 'bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer'
                    : isDark
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                whileHover={isFormValid ? { scale: 1.02 } : {}}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
                style={{ fontFamily }}
              >
                Create Meeting
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});

CreateMeetingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateMeeting: PropTypes.func.isRequired,
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ),
  darkMode: PropTypes.bool,
};

export default CreateMeetingModal;

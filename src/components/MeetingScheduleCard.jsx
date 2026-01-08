import { memo, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Users,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react";
import { cardVariants, fontFamily } from "../constants";
import useThemeSafe from "../hooks/useThemeSafe";

/**
 * MeetingScheduleCard Component
 * Displays upcoming meetings with an interactive calendar view and list view toggle
 *
 * @param {Object} props - Component props
 * @param {Array} props.meetings - Array of meeting objects
 * @param {boolean} [props.darkMode] - Override theme context (optional)
 */
const MeetingScheduleCard = memo(function MeetingScheduleCard({
  meetings = [],
  darkMode: darkModeOverride,
}) {
  const { isDark } = useThemeSafe(darkModeOverride);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" or "list"
  const [selectedDay, setSelectedDay] = useState(null);

  // Get calendar data for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Get meetings for a specific day
  const getMeetingsForDay = (day) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getDate() === day &&
        meetingDate.getMonth() === month &&
        meetingDate.getFullYear() === year
      );
    });
  };

  // Check if a date has meetings
  const hasMeeting = (day) => {
    return getMeetingsForDay(day).length > 0;
  };

  // Get total meetings count for the currently displayed month
  const getMeetingsForCurrentMonth = () => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getMonth() === month && meetingDate.getFullYear() === year
      );
    });
  };

  const currentMonthMeetings = getMeetingsForCurrentMonth();

  // Handle click on calendar day
  const handleDayClick = (day) => {
    const dayMeetings = getMeetingsForDay(day);
    if (dayMeetings.length > 0) {
      // Toggle selection - if same day clicked, close it
      setSelectedDay(selectedDay === day ? null : day);
    }
  };

  // Get the row number for a specific day (0-indexed)
  const getRowForDay = (day) => {
    return Math.floor((firstDay + day - 1) / 7);
  };

  // Get selected day's row
  const selectedDayRow = selectedDay ? getRowForDay(selectedDay) : null;
  const selectedDayMeetings = selectedDay ? getMeetingsForDay(selectedDay) : [];

  // Reset selected day when month changes
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Get meetings for current month (sorted by date) for list view
  const monthMeetingsList = currentMonthMeetings.sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  // Theme classes
  const cardClasses = isDark
    ? "bg-slate-800/80 border-slate-600/50 shadow-2xl shadow-black/50 ring-1 ring-slate-500/10"
    : "bg-white/90 border-slate-200/60 shadow-xl shadow-slate-900/10";
  const titleClasses = isDark ? "text-slate-200" : "text-slate-700";

  // Meeting type icons
  const getMeetingIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-3 h-3" />;
      case "phone":
        return <Phone className="w-3 h-3" />;
      case "in-person":
        return <Users className="w-3 h-3" />;
      default:
        return <Calendar className="w-3 h-3" />;
    }
  };

  // Meeting type colors
  const getMeetingColor = (type) => {
    switch (type) {
      case "video":
        return isDark
          ? "bg-blue-900/40 text-blue-400"
          : "bg-blue-100 text-blue-600";
      case "phone":
        return isDark
          ? "bg-emerald-900/40 text-emerald-400"
          : "bg-emerald-100 text-emerald-600";
      case "in-person":
        return isDark
          ? "bg-purple-900/40 text-purple-400"
          : "bg-purple-100 text-purple-600";
      default:
        return isDark
          ? "bg-slate-700 text-slate-300"
          : "bg-slate-100 text-slate-600";
    }
  };

  // Calculate total rows in calendar
  const totalDays = firstDay + daysInMonth;
  const totalRows = Math.ceil(totalDays / 7);

  return (
    <motion.div
      className={`${cardClasses} backdrop-blur-lg rounded-2xl p-4 sm:p-5 border transition-all duration-300 hover:shadow-2xl h-150 flex flex-col`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      variants={cardVariants}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-blue-900/40" : "bg-blue-100"}`}
          >
            <Calendar
              className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            />
          </div>
          <h3
            className={`text-base sm:text-lg font-bold ${titleClasses}`}
            style={{ fontFamily }}
          >
            Meeting Schedule
          </h3>
        </div>

        {/* Toggle Buttons */}
        <div
          className={`flex items-center gap-1 p-1 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}
        >
          <motion.button
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
              viewMode === "calendar"
                ? isDark
                  ? "bg-blue-900/60 text-blue-400 shadow-md"
                  : "bg-white text-blue-600 shadow-md"
                : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-600 hover:text-slate-800"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Calendar view"
          >
            <Calendar className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
              viewMode === "list"
                ? isDark
                  ? "bg-blue-900/60 text-blue-400 shadow-md"
                  : "bg-white text-blue-600 shadow-md"
                : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-600 hover:text-slate-800"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Content Area with fixed height */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {viewMode === "calendar" ? (
          /* Calendar View - Fully visible without scrolling */
          <div className="h-full flex flex-col">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-2">
              <motion.button
                onClick={prevMonth}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <span
                className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}
                style={{ fontFamily }}
              >
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <motion.button
                onClick={nextMonth}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Calendar Grid - Fully visible */}
            <div className="flex-1 flex flex-col overflow-y-auto hidden-scrollbar">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {/* Day headers */}
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className={`text-center text-[10px] font-medium py-1 ${
                      isDark ? "text-slate-500" : "text-slate-600"
                    }`}
                    style={{ fontFamily }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days grid - Row by row with expandable meeting details */}
              <div className="flex-1 flex flex-col gap-2 p-1">
                {Array.from({ length: totalRows }).map((_, rowIndex) => (
                  <div key={`row-${rowIndex}`}>
                    {/* Days row */}
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }).map((_, colIndex) => {
                        const dayIndex = rowIndex * 7 + colIndex - firstDay;
                        const day = dayIndex + 1;
                        const isValidDay = day >= 1 && day <= daysInMonth;

                        if (!isValidDay) {
                          return (
                            <div
                              key={`empty-${rowIndex}-${colIndex}`}
                              className="aspect-square"
                            />
                          );
                        }

                        const isToday =
                          today.getDate() === day &&
                          today.getMonth() === month &&
                          today.getFullYear() === year;
                        const hasMeetingDay = hasMeeting(day);
                        const isSelected = selectedDay === day;

                        return (
                          <motion.div
                            key={day}
                            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-[11px] relative ${
                              hasMeetingDay ? "cursor-pointer" : ""
                            } ${
                              isSelected
                                ? isDark
                                  ? "bg-blue-600/50 text-blue-200 font-bold ring-2 ring-blue-400"
                                  : "bg-blue-500/20 text-blue-700 font-bold ring-2 ring-blue-500"
                                : isToday
                                  ? isDark
                                    ? "bg-blue-900/50 text-blue-300 font-bold shadow-md ring-2 ring-blue-500/50"
                                    : "bg-blue-100 text-blue-700 font-bold shadow-md ring-2 ring-blue-400/50"
                                  : hasMeetingDay
                                    ? isDark
                                      ? "bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50 font-semibold"
                                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                                    : isDark
                                      ? "text-slate-300"
                                      : "text-slate-700"
                            } transition-all duration-200`}
                            style={{ fontFamily }}
                            onClick={() => hasMeetingDay && handleDayClick(day)}
                            whileHover={hasMeetingDay ? { scale: 1.05 } : {}}
                            whileTap={hasMeetingDay ? { scale: 0.95 } : {}}
                          >
                            {day}
                            {hasMeetingDay && (
                              <div className="absolute bottom-0.5 flex gap-0.5">
                                {getMeetingsForDay(day)
                                  .slice(0, 3)
                                  .map((_, idx) => (
                                    <span
                                      key={idx}
                                      className={`w-1 h-1 rounded-full ${
                                        isDark
                                          ? "bg-emerald-400"
                                          : "bg-emerald-600"
                                      }`}
                                    />
                                  ))}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Expandable meeting details below the row */}
                    <AnimatePresence>
                      {selectedDayRow === rowIndex &&
                        selectedDayMeetings.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div
                              className={`mt-2 p-3 rounded-lg border ${
                                isDark
                                  ? "bg-slate-700/50 border-slate-600/50"
                                  : "bg-slate-50 border-slate-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p
                                  className={`text-xs font-bold ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                  }`}
                                  style={{ fontFamily }}
                                >
                                  {selectedDayMeetings.length}{" "}
                                  {selectedDayMeetings.length === 1
                                    ? "Meeting"
                                    : "Meetings"}{" "}
                                  on{" "}
                                  {currentDate.toLocaleString("default", {
                                    month: "short",
                                  })}{" "}
                                  {selectedDay}
                                </p>
                                <motion.button
                                  onClick={() => setSelectedDay(null)}
                                  className={`p-1 rounded-md ${
                                    isDark
                                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-600/50"
                                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <span className="text-xs">✕</span>
                                </motion.button>
                              </div>
                              <div className="space-y-2">
                                {selectedDayMeetings.map((meeting) => (
                                  <div
                                    key={meeting.id}
                                    className={`flex items-start gap-2 p-2 rounded-md ${
                                      isDark ? "bg-slate-800/50" : "bg-white"
                                    }`}
                                  >
                                    <div
                                      className={`p-1.5 rounded-md shrink-0 ${getMeetingColor(meeting.type)}`}
                                    >
                                      {getMeetingIcon(meeting.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-xs font-semibold truncate ${
                                          isDark
                                            ? "text-slate-200"
                                            : "text-slate-800"
                                        }`}
                                        style={{ fontFamily }}
                                      >
                                        {meeting.title}
                                      </p>
                                      <p
                                        className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}
                                        style={{ fontFamily }}
                                      >
                                        {meeting.client}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1">
                                          <Clock
                                            className={`w-3 h-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                                          />
                                          <span
                                            className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}
                                            style={{ fontFamily }}
                                          >
                                            {meeting.time}
                                          </span>
                                        </div>
                                        {meeting.duration && (
                                          <span
                                            className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-500"}`}
                                            style={{ fontFamily }}
                                          >
                                            • {meeting.duration}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="h-full overflow-y-auto hidden-scrollbar">
            {monthMeetingsList.length > 0 ? (
              <div className="space-y-2">
                {monthMeetingsList.map((meeting, index) => (
                  <motion.div
                    key={meeting.id}
                    className={`p-2.5 rounded-lg border ${
                      isDark
                        ? "bg-slate-700/30 border-slate-600/30"
                        : "bg-slate-50 border-slate-200/50"
                    } transition-all duration-200 hover:shadow-md`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1 }}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`p-1.5 rounded-md shrink-0 ${getMeetingColor(meeting.type)}`}
                      >
                        {getMeetingIcon(meeting.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${
                            isDark ? "text-slate-200" : "text-slate-800"
                          }`}
                          style={{ fontFamily }}
                        >
                          {meeting.title}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                          style={{ fontFamily }}
                        >
                          {meeting.client}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock
                              className={`w-3 h-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                            />
                            <span
                              className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}
                              style={{ fontFamily }}
                            >
                              {meeting.time}
                            </span>
                          </div>
                          {meeting.duration && (
                            <span
                              className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-500"}`}
                              style={{ fontFamily }}
                            >
                              • {meeting.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Calendar
                  className={`w-10 h-10 mx-auto mb-2 ${isDark ? "text-slate-600" : "text-slate-400"}`}
                />
                <p
                  className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  style={{ fontFamily }}
                >
                  No upcoming meetings
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - Total meetings count */}
      <div
        className={`mt-3 pt-2.5 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}
      >
        <p
          className={`text-[10px] text-center ${isDark ? "text-slate-400" : "text-slate-600"}`}
          style={{ fontFamily }}
        >
          {currentMonthMeetings.length}{" "}
          {currentMonthMeetings.length === 1 ? "meeting" : "meetings"} scheduled
          in {currentDate.toLocaleString("default", { month: "long" })} {year}
        </p>
      </div>
    </motion.div>
  );
});

MeetingScheduleCard.propTypes = {
  meetings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      client: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      duration: PropTypes.string,
      type: PropTypes.oneOf(["video", "phone", "in-person"]).isRequired,
    }),
  ),
  darkMode: PropTypes.bool,
};

export default MeetingScheduleCard;

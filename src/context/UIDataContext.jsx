// =============================================================================
// LEADFLOW DASHBOARD - UI DATA CONTEXT
// Focused context for UI mock data management (meetings, activities, etc.)
// =============================================================================

import { createContext, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { initialMeetings, initialActivities, activityWeekData } from '../constants/index.js';

/**
 * UI Data Context
 */
const UIDataContext = createContext(undefined);

/**
 * UI Data Provider Component
 * Provides focused state management for UI mock data
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array} [props.meetings] - Initial meetings data
 * @param {Array} [props.activities] - Initial activities data
 * @param {Array} [props.weekData] - Initial activity week data for charts
 */
export const UIDataProvider = ({
  children,
  meetings: initialMeetingsData,
  activities: initialActivitiesData,
  weekData: initialWeekData,
}) => {
  // State for meetings
  const [meetings, setMeetings] = useState(initialMeetingsData || initialMeetings);

  // State for activities
  const [activities, setActivities] = useState(initialActivitiesData || initialActivities);

  // State for activity week data
  const [activityData, setActivityData] = useState(initialWeekData || activityWeekData);

  /**
   * Add a new meeting
   * @param {Object} meeting - Meeting object to add
   */
  const addMeeting = useCallback((meeting) => {
    const newMeeting = {
      id: Date.now(),
      ...meeting,
    };
    setMeetings((prev) => [...prev, newMeeting]);
    return newMeeting;
  }, []);

  /**
   * Remove a meeting by ID
   * @param {number|string} meetingId - ID of the meeting to remove
   */
  const removeMeeting = useCallback((meetingId) => {
    setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
  }, []);

  /**
   * Update a meeting
   * @param {number|string} meetingId - ID of the meeting to update
   * @param {Object} updates - Fields to update
   */
  const updateMeeting = useCallback((meetingId, updates) => {
    setMeetings((prev) => prev.map((m) => (m.id === meetingId ? { ...m, ...updates } : m)));
  }, []);

  /**
   * Add a new activity
   * @param {Object} activity - Activity object to add
   */
  const addActivity = useCallback((activity) => {
    const newActivity = {
      id: Date.now(),
      timestamp: 'Just now',
      ...activity,
    };
    setActivities((prev) => [newActivity, ...prev]);
    return newActivity;
  }, []);

  /**
   * Remove an activity by ID
   * @param {number|string} activityId - ID of the activity to remove
   */
  const removeActivity = useCallback((activityId) => {
    setActivities((prev) => prev.filter((a) => a.id !== activityId));
  }, []);

  /**
   * Reset meetings to initial state
   */
  const resetMeetings = useCallback(() => {
    setMeetings(initialMeetingsData || initialMeetings);
  }, [initialMeetingsData]);

  /**
   * Reset activities to initial state
   */
  const resetActivities = useCallback(() => {
    setActivities(initialActivitiesData || initialActivities);
  }, [initialActivitiesData]);

  /**
   * Reset all UI data to initial state
   */
  const resetAllUIData = useCallback(() => {
    resetMeetings();
    resetActivities();
    setActivityData(initialWeekData || activityWeekData);
  }, [resetMeetings, resetActivities, initialWeekData]);

  /**
   * Get upcoming meetings (future dates only)
   */
  const upcomingMeetings = useMemo(() => {
    const now = new Date();
    return meetings
      .filter((m) => new Date(m.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [meetings]);

  /**
   * Get past meetings
   */
  const pastMeetings = useMemo(() => {
    const now = new Date();
    return meetings
      .filter((m) => new Date(m.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [meetings]);

  /**
   * Get recent activities (limited)
   * @param {number} limit - Maximum number of activities to return
   */
  const getRecentActivities = useCallback(
    (limit = 10) => {
      return activities.slice(0, limit);
    },
    [activities]
  );

  /**
   * Get activities by type
   * @param {string} type - Activity type to filter by
   */
  const getActivitiesByType = useCallback(
    (type) => {
      return activities.filter((a) => a.type === type);
    },
    [activities]
  );

  /**
   * Get activities by priority
   * @param {string} priority - Priority level to filter by
   */
  const getActivitiesByPriority = useCallback(
    (priority) => {
      return activities.filter((a) => a.priority === priority);
    },
    [activities]
  );

  const value = useMemo(
    () => ({
      // Meetings Data
      meetings,
      upcomingMeetings,
      pastMeetings,
      meetingCount: meetings.length,

      // Activities Data
      activities,
      activityCount: activities.length,

      // Chart Data
      activityData,

      // Meeting Actions
      addMeeting,
      removeMeeting,
      updateMeeting,
      resetMeetings,

      // Activity Actions
      addActivity,
      removeActivity,
      resetActivities,

      // Query Operations
      getRecentActivities,
      getActivitiesByType,
      getActivitiesByPriority,

      // Bulk Operations
      resetAllUIData,
    }),
    [
      meetings,
      upcomingMeetings,
      pastMeetings,
      activities,
      activityData,
      addMeeting,
      removeMeeting,
      updateMeeting,
      resetMeetings,
      addActivity,
      removeActivity,
      resetActivities,
      getRecentActivities,
      getActivitiesByType,
      getActivitiesByPriority,
      resetAllUIData,
    ]
  );

  return <UIDataContext.Provider value={value}>{children}</UIDataContext.Provider>;
};

UIDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
  meetings: PropTypes.array,
  activities: PropTypes.array,
  weekData: PropTypes.array,
};

export default UIDataContext;

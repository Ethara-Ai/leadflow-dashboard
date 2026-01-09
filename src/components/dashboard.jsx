// =============================================================================
// LEADFLOW DASHBOARD - MAIN DASHBOARD COMPONENT
// Root dashboard component with providers and error boundary
// =============================================================================

import { memo } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import ThemeProvider from '../hooks/ThemeProvider.jsx';
import { DashboardProvider } from '../context/DashboardContext.jsx';
import { DashboardContent } from './dashboard/index.js';

/**
 * Dashboard Component
 *
 * Main dashboard component that sets up the provider hierarchy:
 * 1. ErrorBoundary - Catches and displays errors gracefully
 * 2. ThemeProvider - Provides theme context (dark/light mode)
 * 3. DashboardProvider - Provides centralized state management
 * 4. DashboardContent - Renders the actual dashboard UI
 *
 * This architecture ensures:
 * - Clean separation of concerns
 * - Centralized state management via context
 * - Proper error handling at the top level
 * - Easy testing of individual components
 */
const Dashboard = memo(function Dashboard() {
  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <ThemeProvider defaultDarkMode={false}>
        <DashboardProvider>
          <DashboardContent />
        </DashboardProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
});

export default Dashboard;

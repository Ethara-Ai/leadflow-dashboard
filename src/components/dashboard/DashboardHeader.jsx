// =============================================================================
// LEADFLOW DASHBOARD - DASHBOARD HEADER
// Header component that connects to dashboard context
// =============================================================================

import { memo } from 'react';
import { useDashboard } from '../../context/index.js';
import useTheme from '../../hooks/useTheme.jsx';
import Header from '../Header.jsx';

/**
 * DashboardHeader Component
 * Wrapper around Header that connects to the dashboard context
 * Reduces prop drilling by consuming context directly
 */
const DashboardHeader = memo(function DashboardHeader() {
  const { toggleTheme } = useTheme();
  const { isLoading, refreshData, openNotes, handleExportCSV, handleExportJSON } = useDashboard();

  return (
    <Header
      isLoading={isLoading}
      onToggleDarkMode={toggleTheme}
      onRefresh={refreshData}
      onOpenNotes={openNotes}
      onExportCSV={handleExportCSV}
      onExportJSON={handleExportJSON}
    />
  );
});

export default DashboardHeader;

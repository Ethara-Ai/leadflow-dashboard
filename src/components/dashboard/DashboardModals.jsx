// =============================================================================
// LEADFLOW DASHBOARD - DASHBOARD MODALS
// Centralized modal management component
// =============================================================================

import { memo } from 'react';
import { useDashboard } from '../../context/index.js';
import NotesModal from '../NotesModal.jsx';
import AlertsModal from '../AlertsModal.jsx';
import FooterModal from '../FooterModal.jsx';
import ProductModalContent from '../ProductModalContent.jsx';
import ResourcesModalContent from '../ResourcesModalContent.jsx';
import CompanyModalContent from '../CompanyModalContent.jsx';

/**
 * DashboardModals Component
 * Centralizes all modal rendering in one place.
 * Connects to dashboard context for state management.
 *
 * Benefits:
 * - Single location for all modal components
 * - Reduces clutter in main dashboard component
 * - Easy to add/remove modals
 * - Consistent modal management
 */
const DashboardModals = memo(function DashboardModals() {
  const {
    // Notes Modal
    isNotesOpen,
    closeNotes,
    notes,
    addNote,
    deleteNote,

    // Alerts Modal
    isAlertsModalOpen,
    closeAlertsModal,
    alerts,
    addAlert,
    clearAlerts,

    // Footer Modals
    isProductModalOpen,
    closeProductModal,
    isResourcesModalOpen,
    closeResourcesModal,
    isCompanyModalOpen,
    closeCompanyModal,
  } = useDashboard();

  return (
    <>
      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesOpen}
        onClose={closeNotes}
        notes={notes}
        onSaveNote={addNote}
        onDeleteNote={deleteNote}
      />

      {/* Alerts Management Modal */}
      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={closeAlertsModal}
        alerts={alerts}
        onAddAlert={addAlert}
        onClearAlerts={clearAlerts}
      />

      {/* Product Information Modal */}
      <FooterModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        title="Product Information"
      >
        <ProductModalContent />
      </FooterModal>

      {/* Resources & Community Modal */}
      <FooterModal
        isOpen={isResourcesModalOpen}
        onClose={closeResourcesModal}
        title="Resources & Community"
      >
        <ResourcesModalContent />
      </FooterModal>

      {/* Company & Legal Modal */}
      <FooterModal isOpen={isCompanyModalOpen} onClose={closeCompanyModal} title="Company & Legal">
        <CompanyModalContent />
      </FooterModal>
    </>
  );
});

export default DashboardModals;

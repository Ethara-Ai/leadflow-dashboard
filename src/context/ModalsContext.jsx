// =============================================================================
// LEADFLOW DASHBOARD - MODALS CONTEXT
// Focused context for modals state management
// =============================================================================

import { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import useModals, { MODAL_IDS } from '../hooks/useModals.js';

/**
 * Modals Context
 */
const ModalsContext = createContext(undefined);

/**
 * Modals Provider Component
 * Provides focused state management for modals
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} [props.allowMultiple=false] - Allow multiple modals to be open at once
 * @param {boolean} [props.lockScroll=true] - Lock body scroll when modal is open
 */
export const ModalsProvider = ({ children, allowMultiple = false, lockScroll = true }) => {
  const {
    // Generic API
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
    isModalOpen,
    isAnyModalOpen,
    openModalCount,
    openModals,

    // Convenience states
    isNotesOpen,
    isProductModalOpen,
    isResourcesModalOpen,
    isCompanyModalOpen,
    isAlertsModalOpen,

    // Convenience handlers
    openNotes,
    closeNotes,
    openProductModal,
    closeProductModal,
    openResourcesModal,
    closeResourcesModal,
    openCompanyModal,
    closeCompanyModal,
    openAlertsModal,
    closeAlertsModal,
  } = useModals({
    allowMultiple,
    lockScroll,
  });

  const value = useMemo(
    () => ({
      // Generic API
      openModal,
      closeModal,
      toggleModal,
      closeAllModals,
      isModalOpen,
      isAnyModalOpen,
      openModalCount,
      openModals,

      // Modal IDs for reference
      MODAL_IDS,

      // Convenience States
      isNotesOpen,
      isProductModalOpen,
      isResourcesModalOpen,
      isCompanyModalOpen,
      isAlertsModalOpen,

      // Convenience Handlers
      openNotes,
      closeNotes,
      openProductModal,
      closeProductModal,
      openResourcesModal,
      closeResourcesModal,
      openCompanyModal,
      closeCompanyModal,
      openAlertsModal,
      closeAlertsModal,
    }),
    [
      openModal,
      closeModal,
      toggleModal,
      closeAllModals,
      isModalOpen,
      isAnyModalOpen,
      openModalCount,
      openModals,
      isNotesOpen,
      isProductModalOpen,
      isResourcesModalOpen,
      isCompanyModalOpen,
      isAlertsModalOpen,
      openNotes,
      closeNotes,
      openProductModal,
      closeProductModal,
      openResourcesModal,
      closeResourcesModal,
      openCompanyModal,
      closeCompanyModal,
      openAlertsModal,
      closeAlertsModal,
    ]
  );

  return <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>;
};

ModalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  allowMultiple: PropTypes.bool,
  lockScroll: PropTypes.bool,
};

export default ModalsContext;

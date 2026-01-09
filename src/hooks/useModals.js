import { useState, useCallback, useEffect, useMemo } from 'react';

/**
 * Modal identifiers for type safety and consistency
 */
export const MODAL_IDS = {
  NOTES: 'notes',
  PRODUCT: 'product',
  RESOURCES: 'resources',
  COMPANY: 'company',
  ALERTS: 'alerts',
};

/**
 * Custom hook for managing multiple modal states
 * Handles body scroll locking when any modal is open
 *
 * @param {Object} options - Hook options
 * @param {boolean} [options.allowMultiple=false] - Allow multiple modals to be open at once
 * @param {boolean} [options.lockScroll=true] - Lock body scroll when modal is open
 * @returns {Object} Modal states and handlers
 */
const useModals = ({ allowMultiple = false, lockScroll = true } = {}) => {
  const [openModals, setOpenModals] = useState(new Set());

  /**
   * Open a specific modal
   * @param {string} modalId - ID of the modal to open
   */
  const openModal = useCallback(
    (modalId) => {
      setOpenModals((prev) => {
        const next = allowMultiple ? new Set(prev) : new Set();
        next.add(modalId);
        return next;
      });
    },
    [allowMultiple]
  );

  /**
   * Close a specific modal
   * @param {string} modalId - ID of the modal to close
   */
  const closeModal = useCallback((modalId) => {
    setOpenModals((prev) => {
      const next = new Set(prev);
      next.delete(modalId);
      return next;
    });
  }, []);

  /**
   * Toggle a specific modal
   * @param {string} modalId - ID of the modal to toggle
   */
  const toggleModal = useCallback(
    (modalId) => {
      setOpenModals((prev) => {
        if (prev.has(modalId)) {
          const next = new Set(prev);
          next.delete(modalId);
          return next;
        } else {
          const next = allowMultiple ? new Set(prev) : new Set();
          next.add(modalId);
          return next;
        }
      });
    },
    [allowMultiple]
  );

  /**
   * Close all open modals
   */
  const closeAllModals = useCallback(() => {
    setOpenModals(new Set());
  }, []);

  /**
   * Check if a specific modal is open
   * @param {string} modalId - ID of the modal to check
   * @returns {boolean} Whether the modal is open
   */
  const isModalOpen = useCallback(
    (modalId) => {
      return openModals.has(modalId);
    },
    [openModals]
  );

  /**
   * Check if any modal is currently open
   */
  const isAnyModalOpen = openModals.size > 0;

  /**
   * Get the count of open modals
   */
  const openModalCount = openModals.size;

  // Handle body scroll locking
  useEffect(() => {
    if (!lockScroll) return;

    if (isAnyModalOpen) {
      // Store current scroll position and lock
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position when all modals close
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isAnyModalOpen, lockScroll]);

  // Convenience boolean states for common modals (backward compatibility)
  const modalStates = useMemo(
    () => ({
      isNotesOpen: openModals.has(MODAL_IDS.NOTES),
      isProductModalOpen: openModals.has(MODAL_IDS.PRODUCT),
      isResourcesModalOpen: openModals.has(MODAL_IDS.RESOURCES),
      isCompanyModalOpen: openModals.has(MODAL_IDS.COMPANY),
      isAlertsModalOpen: openModals.has(MODAL_IDS.ALERTS),
    }),
    [openModals]
  );

  // Convenience handlers for common modals (backward compatibility)
  const modalHandlers = useMemo(
    () => ({
      openNotes: () => openModal(MODAL_IDS.NOTES),
      closeNotes: () => closeModal(MODAL_IDS.NOTES),
      openProductModal: () => openModal(MODAL_IDS.PRODUCT),
      closeProductModal: () => closeModal(MODAL_IDS.PRODUCT),
      openResourcesModal: () => openModal(MODAL_IDS.RESOURCES),
      closeResourcesModal: () => closeModal(MODAL_IDS.RESOURCES),
      openCompanyModal: () => openModal(MODAL_IDS.COMPANY),
      closeCompanyModal: () => closeModal(MODAL_IDS.COMPANY),
      openAlertsModal: () => openModal(MODAL_IDS.ALERTS),
      closeAlertsModal: () => closeModal(MODAL_IDS.ALERTS),
    }),
    [openModal, closeModal]
  );

  return {
    // Generic API
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
    isModalOpen,
    isAnyModalOpen,
    openModalCount,
    openModals: Array.from(openModals),

    // Convenience states and handlers
    ...modalStates,
    ...modalHandlers,
  };
};

export default useModals;

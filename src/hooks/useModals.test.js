/**
 * Unit Tests for useModals Hook
 * Tests modal state management including open, close, toggle, and scroll locking
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useModals, { MODAL_IDS } from './useModals.js';

// =============================================================================
// Test Helpers
// =============================================================================

const resetBodyStyles = () => {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
};

// =============================================================================
// Initial State Tests
// =============================================================================

describe('useModals', () => {
  beforeEach(() => {
    resetBodyStyles();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetBodyStyles();
  });

  describe('initial state', () => {
    it('should initialize with no modals open', () => {
      const { result } = renderHook(() => useModals());

      expect(result.current.isAnyModalOpen).toBe(false);
      expect(result.current.openModalCount).toBe(0);
      expect(result.current.openModals).toEqual([]);
    });

    it('should have all convenience states as false initially', () => {
      const { result } = renderHook(() => useModals());

      expect(result.current.isNotesOpen).toBe(false);
      expect(result.current.isProductModalOpen).toBe(false);
      expect(result.current.isResourcesModalOpen).toBe(false);
      expect(result.current.isCompanyModalOpen).toBe(false);
      expect(result.current.isAlertsModalOpen).toBe(false);
    });
  });

  // =============================================================================
  // Open Modal Tests
  // =============================================================================

  describe('openModal', () => {
    it('should open a modal by id', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(true);
      expect(result.current.isAnyModalOpen).toBe(true);
      expect(result.current.openModalCount).toBe(1);
    });

    it('should close other modals when opening new one (allowMultiple=false)', () => {
      const { result } = renderHook(() => useModals({ allowMultiple: false }));

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      act(() => {
        result.current.openModal(MODAL_IDS.PRODUCT);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(false);
      expect(result.current.isModalOpen(MODAL_IDS.PRODUCT)).toBe(true);
      expect(result.current.openModalCount).toBe(1);
    });

    it('should keep other modals open when allowMultiple is true', () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      act(() => {
        result.current.openModal(MODAL_IDS.PRODUCT);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(true);
      expect(result.current.isModalOpen(MODAL_IDS.PRODUCT)).toBe(true);
      expect(result.current.openModalCount).toBe(2);
    });

    it('should return openModals array with open modal ids', () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
        result.current.openModal(MODAL_IDS.ALERTS);
      });

      expect(result.current.openModals).toContain(MODAL_IDS.NOTES);
      expect(result.current.openModals).toContain(MODAL_IDS.ALERTS);
    });
  });

  // =============================================================================
  // Close Modal Tests
  // =============================================================================

  describe('closeModal', () => {
    it('should close an open modal', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(true);

      act(() => {
        result.current.closeModal(MODAL_IDS.NOTES);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(false);
      expect(result.current.isAnyModalOpen).toBe(false);
    });

    it('should not affect other open modals', () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
        result.current.openModal(MODAL_IDS.PRODUCT);
      });

      act(() => {
        result.current.closeModal(MODAL_IDS.NOTES);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(false);
      expect(result.current.isModalOpen(MODAL_IDS.PRODUCT)).toBe(true);
      expect(result.current.openModalCount).toBe(1);
    });

    it('should handle closing a modal that is not open', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.closeModal(MODAL_IDS.NOTES);
      });

      expect(result.current.openModalCount).toBe(0);
      expect(result.current.isAnyModalOpen).toBe(false);
    });
  });

  // =============================================================================
  // Toggle Modal Tests
  // =============================================================================

  describe('toggleModal', () => {
    it('should open a closed modal', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.toggleModal(MODAL_IDS.NOTES);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(true);
    });

    it('should close an open modal', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      act(() => {
        result.current.toggleModal(MODAL_IDS.NOTES);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(false);
    });

    it('should respect allowMultiple option when toggling on', () => {
      const { result } = renderHook(() => useModals({ allowMultiple: false }));

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      act(() => {
        result.current.toggleModal(MODAL_IDS.PRODUCT);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(false);
      expect(result.current.isModalOpen(MODAL_IDS.PRODUCT)).toBe(true);
    });

    it('should work with allowMultiple=true', () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      act(() => {
        result.current.toggleModal(MODAL_IDS.PRODUCT);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(true);
      expect(result.current.isModalOpen(MODAL_IDS.PRODUCT)).toBe(true);
    });
  });

  // =============================================================================
  // Close All Modals Tests
  // =============================================================================

  describe('closeAllModals', () => {
    it('should close all open modals', () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
        result.current.openModal(MODAL_IDS.PRODUCT);
        result.current.openModal(MODAL_IDS.ALERTS);
      });

      expect(result.current.openModalCount).toBe(3);

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.openModalCount).toBe(0);
      expect(result.current.isAnyModalOpen).toBe(false);
    });

    it('should work when no modals are open', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.openModalCount).toBe(0);
    });
  });

  // =============================================================================
  // Is Modal Open Tests
  // =============================================================================

  describe('isModalOpen', () => {
    it('should return true for open modal', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(true);
    });

    it('should return false for closed modal', () => {
      const { result } = renderHook(() => useModals());

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(false);
    });

    it('should return false for unknown modal id', () => {
      const { result } = renderHook(() => useModals());

      expect(result.current.isModalOpen('unknown-modal')).toBe(false);
    });
  });

  // =============================================================================
  // Convenience Handlers Tests
  // =============================================================================

  describe('convenience handlers', () => {
    describe('notes modal', () => {
      it('should open notes modal with openNotes', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openNotes();
        });

        expect(result.current.isNotesOpen).toBe(true);
      });

      it('should close notes modal with closeNotes', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openNotes();
        });

        act(() => {
          result.current.closeNotes();
        });

        expect(result.current.isNotesOpen).toBe(false);
      });
    });

    describe('product modal', () => {
      it('should open product modal with openProductModal', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openProductModal();
        });

        expect(result.current.isProductModalOpen).toBe(true);
      });

      it('should close product modal with closeProductModal', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openProductModal();
        });

        act(() => {
          result.current.closeProductModal();
        });

        expect(result.current.isProductModalOpen).toBe(false);
      });
    });

    describe('resources modal', () => {
      it('should open resources modal with openResourcesModal', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openResourcesModal();
        });

        expect(result.current.isResourcesModalOpen).toBe(true);
      });

      it('should close resources modal with closeResourcesModal', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openResourcesModal();
        });

        act(() => {
          result.current.closeResourcesModal();
        });

        expect(result.current.isResourcesModalOpen).toBe(false);
      });
    });

    describe('company modal', () => {
      it('should open company modal with openCompanyModal', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openCompanyModal();
        });

        expect(result.current.isCompanyModalOpen).toBe(true);
      });

      it('should close company modal with closeCompanyModal', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openCompanyModal();
        });

        act(() => {
          result.current.closeCompanyModal();
        });

        expect(result.current.isCompanyModalOpen).toBe(false);
      });
    });

    describe('alerts modal', () => {
      it('should open alerts modal with openAlertsModal', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openAlertsModal();
        });

        expect(result.current.isAlertsModalOpen).toBe(true);
      });

      it('should close alerts modal with closeAlertsModal', () => {
        const { result } = renderHook(() => useModals());

        act(() => {
          result.current.openAlertsModal();
        });

        act(() => {
          result.current.closeAlertsModal();
        });

        expect(result.current.isAlertsModalOpen).toBe(false);
      });
    });
  });

  // =============================================================================
  // Scroll Lock Tests
  // =============================================================================

  describe('scroll locking', () => {
    it('should lock body scroll when modal opens', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should unlock body scroll when modal closes', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      act(() => {
        result.current.closeModal(MODAL_IDS.NOTES);
      });

      expect(document.body.style.position).toBe('');
      expect(document.body.style.overflow).toBe('');
    });

    it('should not lock scroll when lockScroll is false', () => {
      const { result } = renderHook(() => useModals({ lockScroll: false }));

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      expect(document.body.style.position).toBe('');
    });

    it('should keep scroll locked while any modal is open', () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
        result.current.openModal(MODAL_IDS.PRODUCT);
      });

      act(() => {
        result.current.closeModal(MODAL_IDS.NOTES);
      });

      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  // =============================================================================
  // MODAL_IDS Constants Tests
  // =============================================================================

  describe('MODAL_IDS constant', () => {
    it('should export MODAL_IDS', () => {
      expect(MODAL_IDS).toBeDefined();
    });

    it('should have notes modal id', () => {
      expect(MODAL_IDS.NOTES).toBe('notes');
    });

    it('should have product modal id', () => {
      expect(MODAL_IDS.PRODUCT).toBe('product');
    });

    it('should have resources modal id', () => {
      expect(MODAL_IDS.RESOURCES).toBe('resources');
    });

    it('should have company modal id', () => {
      expect(MODAL_IDS.COMPANY).toBe('company');
    });

    it('should have alerts modal id', () => {
      expect(MODAL_IDS.ALERTS).toBe('alerts');
    });
  });

  // =============================================================================
  // Edge Cases Tests
  // =============================================================================

  describe('edge cases', () => {
    it('should handle rapid open/close calls', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
        result.current.closeModal(MODAL_IDS.NOTES);
        result.current.openModal(MODAL_IDS.NOTES);
        result.current.closeModal(MODAL_IDS.NOTES);
        result.current.openModal(MODAL_IDS.NOTES);
      });

      expect(result.current.isModalOpen(MODAL_IDS.NOTES)).toBe(true);
    });

    it('should handle opening the same modal twice', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
        result.current.openModal(MODAL_IDS.NOTES);
      });

      expect(result.current.openModalCount).toBe(1);
    });

    it('should work with custom modal ids', () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal('custom-modal');
      });

      expect(result.current.isModalOpen('custom-modal')).toBe(true);
      expect(result.current.openModalCount).toBe(1);
    });

    it('should cleanup scroll lock on unmount', () => {
      const { result, unmount } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      expect(document.body.style.position).toBe('fixed');

      unmount();

      expect(document.body.style.position).toBe('');
    });

    it('should return all expected properties and methods', () => {
      const { result } = renderHook(() => useModals());

      // Generic API
      expect(result.current.openModal).toBeDefined();
      expect(result.current.closeModal).toBeDefined();
      expect(result.current.toggleModal).toBeDefined();
      expect(result.current.closeAllModals).toBeDefined();
      expect(result.current.isModalOpen).toBeDefined();
      expect(typeof result.current.isAnyModalOpen).toBe('boolean');
      expect(typeof result.current.openModalCount).toBe('number');
      expect(Array.isArray(result.current.openModals)).toBe(true);

      // Convenience states
      expect(typeof result.current.isNotesOpen).toBe('boolean');
      expect(typeof result.current.isProductModalOpen).toBe('boolean');
      expect(typeof result.current.isResourcesModalOpen).toBe('boolean');
      expect(typeof result.current.isCompanyModalOpen).toBe('boolean');
      expect(typeof result.current.isAlertsModalOpen).toBe('boolean');

      // Convenience handlers
      expect(result.current.openNotes).toBeDefined();
      expect(result.current.closeNotes).toBeDefined();
      expect(result.current.openProductModal).toBeDefined();
      expect(result.current.closeProductModal).toBeDefined();
      expect(result.current.openResourcesModal).toBeDefined();
      expect(result.current.closeResourcesModal).toBeDefined();
      expect(result.current.openCompanyModal).toBeDefined();
      expect(result.current.closeCompanyModal).toBeDefined();
      expect(result.current.openAlertsModal).toBeDefined();
      expect(result.current.closeAlertsModal).toBeDefined();
    });
  });
});

/**
 * Unit Tests for useModals Hook
 * Tests modal state management functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useModals, { MODAL_IDS } from "./useModals";

// =============================================================================
// Test Setup
// =============================================================================

describe("useModals", () => {
  let originalBodyStyle;

  beforeEach(() => {
    vi.clearAllMocks();
    // Save original body styles
    originalBodyStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
  });

  afterEach(() => {
    // Restore original body styles
    document.body.style.position = originalBodyStyle.position;
    document.body.style.top = originalBodyStyle.top;
    document.body.style.width = originalBodyStyle.width;
    document.body.style.overflow = originalBodyStyle.overflow;
  });

  // ===========================================================================
  // MODAL_IDS Export Tests
  // ===========================================================================

  describe("MODAL_IDS", () => {
    it("should export MODAL_IDS constants", () => {
      expect(MODAL_IDS).toBeDefined();
    });

    it("should have NOTES modal id", () => {
      expect(MODAL_IDS.NOTES).toBe("notes");
    });

    it("should have PRODUCT modal id", () => {
      expect(MODAL_IDS.PRODUCT).toBe("product");
    });

    it("should have RESOURCES modal id", () => {
      expect(MODAL_IDS.RESOURCES).toBe("resources");
    });

    it("should have COMPANY modal id", () => {
      expect(MODAL_IDS.COMPANY).toBe("company");
    });

    it("should have ALERTS modal id", () => {
      expect(MODAL_IDS.ALERTS).toBe("alerts");
    });
  });

  // ===========================================================================
  // Initialization Tests
  // ===========================================================================

  describe("initialization", () => {
    it("should initialize with no modals open", () => {
      const { result } = renderHook(() => useModals());

      expect(result.current.isAnyModalOpen).toBe(false);
      expect(result.current.openModalCount).toBe(0);
    });

    it("should return openModals as empty array initially", () => {
      const { result } = renderHook(() => useModals());

      expect(result.current.openModals).toEqual([]);
    });

    it("should have all convenience modal states as false", () => {
      const { result } = renderHook(() => useModals());

      expect(result.current.isNotesOpen).toBe(false);
      expect(result.current.isProductModalOpen).toBe(false);
      expect(result.current.isResourcesModalOpen).toBe(false);
      expect(result.current.isCompanyModalOpen).toBe(false);
      expect(result.current.isAlertsModalOpen).toBe(false);
    });
  });

  // ===========================================================================
  // openModal Tests
  // ===========================================================================

  describe("openModal", () => {
    it("should open a modal by id", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      expect(result.current.isModalOpen("test-modal")).toBe(true);
    });

    it("should set isAnyModalOpen to true", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      expect(result.current.isAnyModalOpen).toBe(true);
    });

    it("should increment openModalCount", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      expect(result.current.openModalCount).toBe(1);
    });

    it("should add modal to openModals array", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      expect(result.current.openModals).toContain("test-modal");
    });

    it("should close other modals when allowMultiple is false (default)", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("modal-1");
      });

      act(() => {
        result.current.openModal("modal-2");
      });

      expect(result.current.isModalOpen("modal-1")).toBe(false);
      expect(result.current.isModalOpen("modal-2")).toBe(true);
      expect(result.current.openModalCount).toBe(1);
    });

    it("should allow multiple modals when allowMultiple is true", () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal("modal-1");
        result.current.openModal("modal-2");
      });

      expect(result.current.isModalOpen("modal-1")).toBe(true);
      expect(result.current.isModalOpen("modal-2")).toBe(true);
      expect(result.current.openModalCount).toBe(2);
    });
  });

  // ===========================================================================
  // closeModal Tests
  // ===========================================================================

  describe("closeModal", () => {
    it("should close a modal by id", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      act(() => {
        result.current.closeModal("test-modal");
      });

      expect(result.current.isModalOpen("test-modal")).toBe(false);
    });

    it("should decrement openModalCount", () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal("modal-1");
        result.current.openModal("modal-2");
      });

      act(() => {
        result.current.closeModal("modal-1");
      });

      expect(result.current.openModalCount).toBe(1);
    });

    it("should set isAnyModalOpen to false when last modal closes", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      act(() => {
        result.current.closeModal("test-modal");
      });

      expect(result.current.isAnyModalOpen).toBe(false);
    });

    it("should remove modal from openModals array", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      act(() => {
        result.current.closeModal("test-modal");
      });

      expect(result.current.openModals).not.toContain("test-modal");
    });

    it("should handle closing non-existent modal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.closeModal("non-existent");
      });

      expect(result.current.openModalCount).toBe(0);
    });
  });

  // ===========================================================================
  // toggleModal Tests
  // ===========================================================================

  describe("toggleModal", () => {
    it("should open a closed modal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.toggleModal("test-modal");
      });

      expect(result.current.isModalOpen("test-modal")).toBe(true);
    });

    it("should close an open modal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      act(() => {
        result.current.toggleModal("test-modal");
      });

      expect(result.current.isModalOpen("test-modal")).toBe(false);
    });

    it("should close other modals when opening (allowMultiple false)", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("modal-1");
      });

      act(() => {
        result.current.toggleModal("modal-2");
      });

      expect(result.current.isModalOpen("modal-1")).toBe(false);
      expect(result.current.isModalOpen("modal-2")).toBe(true);
    });

    it("should not close other modals when allowMultiple is true", () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal("modal-1");
      });

      act(() => {
        result.current.toggleModal("modal-2");
      });

      expect(result.current.isModalOpen("modal-1")).toBe(true);
      expect(result.current.isModalOpen("modal-2")).toBe(true);
    });
  });

  // ===========================================================================
  // closeAllModals Tests
  // ===========================================================================

  describe("closeAllModals", () => {
    it("should close all open modals", () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal("modal-1");
        result.current.openModal("modal-2");
        result.current.openModal("modal-3");
      });

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.openModalCount).toBe(0);
      expect(result.current.isAnyModalOpen).toBe(false);
    });

    it("should return empty openModals array", () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openModal("modal-1");
        result.current.openModal("modal-2");
      });

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.openModals).toEqual([]);
    });
  });

  // ===========================================================================
  // isModalOpen Tests
  // ===========================================================================

  describe("isModalOpen", () => {
    it("should return true for open modal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      expect(result.current.isModalOpen("test-modal")).toBe(true);
    });

    it("should return false for closed modal", () => {
      const { result } = renderHook(() => useModals());

      expect(result.current.isModalOpen("test-modal")).toBe(false);
    });

    it("should return false for never-opened modal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("other-modal");
      });

      expect(result.current.isModalOpen("test-modal")).toBe(false);
    });
  });

  // ===========================================================================
  // Convenience Modal States Tests
  // ===========================================================================

  describe("convenience modal states", () => {
    it("should update isNotesOpen when notes modal opens", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.NOTES);
      });

      expect(result.current.isNotesOpen).toBe(true);
    });

    it("should update isProductModalOpen when product modal opens", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.PRODUCT);
      });

      expect(result.current.isProductModalOpen).toBe(true);
    });

    it("should update isResourcesModalOpen when resources modal opens", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.RESOURCES);
      });

      expect(result.current.isResourcesModalOpen).toBe(true);
    });

    it("should update isCompanyModalOpen when company modal opens", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.COMPANY);
      });

      expect(result.current.isCompanyModalOpen).toBe(true);
    });

    it("should update isAlertsModalOpen when alerts modal opens", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal(MODAL_IDS.ALERTS);
      });

      expect(result.current.isAlertsModalOpen).toBe(true);
    });
  });

  // ===========================================================================
  // Convenience Modal Handlers Tests
  // ===========================================================================

  describe("convenience modal handlers", () => {
    it("should open notes modal with openNotes", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openNotes();
      });

      expect(result.current.isNotesOpen).toBe(true);
    });

    it("should close notes modal with closeNotes", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openNotes();
      });

      act(() => {
        result.current.closeNotes();
      });

      expect(result.current.isNotesOpen).toBe(false);
    });

    it("should open product modal with openProductModal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openProductModal();
      });

      expect(result.current.isProductModalOpen).toBe(true);
    });

    it("should close product modal with closeProductModal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openProductModal();
      });

      act(() => {
        result.current.closeProductModal();
      });

      expect(result.current.isProductModalOpen).toBe(false);
    });

    it("should open resources modal with openResourcesModal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openResourcesModal();
      });

      expect(result.current.isResourcesModalOpen).toBe(true);
    });

    it("should close resources modal with closeResourcesModal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openResourcesModal();
      });

      act(() => {
        result.current.closeResourcesModal();
      });

      expect(result.current.isResourcesModalOpen).toBe(false);
    });

    it("should open company modal with openCompanyModal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openCompanyModal();
      });

      expect(result.current.isCompanyModalOpen).toBe(true);
    });

    it("should close company modal with closeCompanyModal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openCompanyModal();
      });

      act(() => {
        result.current.closeCompanyModal();
      });

      expect(result.current.isCompanyModalOpen).toBe(false);
    });

    it("should open alerts modal with openAlertsModal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openAlertsModal();
      });

      expect(result.current.isAlertsModalOpen).toBe(true);
    });

    it("should close alerts modal with closeAlertsModal", () => {
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

  // ===========================================================================
  // Scroll Lock Tests
  // ===========================================================================

  describe("scroll lock", () => {
    it("should lock body scroll when modal opens (lockScroll default true)", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should unlock body scroll when all modals close", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      act(() => {
        result.current.closeModal("test-modal");
      });

      expect(document.body.style.overflow).toBe("");
    });

    it("should not lock scroll when lockScroll is false", () => {
      const { result } = renderHook(() => useModals({ lockScroll: false }));

      act(() => {
        result.current.openModal("test-modal");
      });

      expect(document.body.style.overflow).not.toBe("hidden");
    });

    it("should set body position to fixed when locked", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      expect(document.body.style.position).toBe("fixed");
    });

    it("should set body width to 100% when locked", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      expect(document.body.style.width).toBe("100%");
    });

    it("should restore body styles when modal closes", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
      });

      act(() => {
        result.current.closeModal("test-modal");
      });

      expect(document.body.style.position).toBe("");
      expect(document.body.style.width).toBe("");
    });
  });

  // ===========================================================================
  // Callback Stability Tests
  // ===========================================================================

  describe("callback stability", () => {
    it("should maintain stable openModal reference", () => {
      const { result, rerender } = renderHook(() => useModals());

      const firstOpenModal = result.current.openModal;
      rerender();
      const secondOpenModal = result.current.openModal;

      expect(firstOpenModal).toBe(secondOpenModal);
    });

    it("should maintain stable closeModal reference", () => {
      const { result, rerender } = renderHook(() => useModals());

      const firstCloseModal = result.current.closeModal;
      rerender();
      const secondCloseModal = result.current.closeModal;

      expect(firstCloseModal).toBe(secondCloseModal);
    });

    it("should maintain stable toggleModal reference", () => {
      const { result, rerender } = renderHook(() => useModals());

      const firstToggleModal = result.current.toggleModal;
      rerender();
      const secondToggleModal = result.current.toggleModal;

      expect(firstToggleModal).toBe(secondToggleModal);
    });

    it("should maintain stable closeAllModals reference", () => {
      const { result, rerender } = renderHook(() => useModals());

      const firstCloseAllModals = result.current.closeAllModals;
      rerender();
      const secondCloseAllModals = result.current.closeAllModals;

      expect(firstCloseAllModals).toBe(secondCloseAllModals);
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("edge cases", () => {
    it("should handle opening same modal twice", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("test-modal");
        result.current.openModal("test-modal");
      });

      expect(result.current.openModalCount).toBe(1);
    });

    it("should handle closing already closed modal", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.closeModal("test-modal");
      });

      expect(result.current.openModalCount).toBe(0);
    });

    it("should handle rapid open/close operations", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("modal-1");
        result.current.closeModal("modal-1");
        result.current.openModal("modal-2");
        result.current.closeModal("modal-2");
        result.current.openModal("modal-3");
      });

      expect(result.current.openModalCount).toBe(1);
      expect(result.current.isModalOpen("modal-3")).toBe(true);
    });

    it("should handle special characters in modal id", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("modal-with-special-chars_123");
      });

      expect(result.current.isModalOpen("modal-with-special-chars_123")).toBe(true);
    });

    it("should handle empty string modal id", () => {
      const { result } = renderHook(() => useModals());

      act(() => {
        result.current.openModal("");
      });

      expect(result.current.isModalOpen("")).toBe(true);
      expect(result.current.openModalCount).toBe(1);
    });
  });

  // ===========================================================================
  // Integration Tests
  // ===========================================================================

  describe("integration", () => {
    it("should work with full workflow", () => {
      const { result } = renderHook(() => useModals());

      // Open notes
      act(() => {
        result.current.openNotes();
      });
      expect(result.current.isNotesOpen).toBe(true);
      expect(result.current.isAnyModalOpen).toBe(true);

      // Switch to product modal
      act(() => {
        result.current.openProductModal();
      });
      expect(result.current.isNotesOpen).toBe(false);
      expect(result.current.isProductModalOpen).toBe(true);

      // Close product modal
      act(() => {
        result.current.closeProductModal();
      });
      expect(result.current.isAnyModalOpen).toBe(false);
    });

    it("should handle multiple modals with allowMultiple", () => {
      const { result } = renderHook(() => useModals({ allowMultiple: true }));

      act(() => {
        result.current.openNotes();
        result.current.openAlertsModal();
      });

      expect(result.current.isNotesOpen).toBe(true);
      expect(result.current.isAlertsModalOpen).toBe(true);
      expect(result.current.openModalCount).toBe(2);

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.openModalCount).toBe(0);
    });
  });
});

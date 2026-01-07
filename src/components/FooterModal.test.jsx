/**
 * Unit Tests for FooterModal Component
 * Tests the reusable modal wrapper with theme support
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FooterModal from "./FooterModal";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  title: "Test Modal Title",
  children: <p>Test modal content</p>,
};

// Mock framer-motion to simplify testing
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, onClick, ...props }) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe("FooterModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic rendering", () => {
    it("should render when isOpen is true", () => {
      renderWithTheme(<FooterModal {...defaultProps} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
    });

    it("should not render when isOpen is false", () => {
      renderWithTheme(<FooterModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText("Test Modal Title")).not.toBeInTheDocument();
    });

    it("should render the modal title", () => {
      renderWithTheme(<FooterModal {...defaultProps} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
    });

    it("should render children content", () => {
      renderWithTheme(<FooterModal {...defaultProps} />);
      expect(screen.getByText("Test modal content")).toBeInTheDocument();
    });

    it("should render the close button", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const closeButton = container.querySelector("button");
      expect(closeButton).toBeInTheDocument();
    });

    it("should render the X icon in close button", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const closeButton = container.querySelector("button");
      const icon = closeButton.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Close Functionality Tests
  // =============================================================================

  describe("close functionality", () => {
    it("should call onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);

      const closeButton = container.querySelector("button");
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when backdrop is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<FooterModal {...defaultProps} />);

      // The backdrop is the outer fixed div
      const backdrop = document.querySelector(".fixed.inset-0.bg-black\\/50");
      if (backdrop) {
        await user.click(backdrop);
        expect(defaultProps.onClose).toHaveBeenCalled();
      }
    });

    it("should not call onClose when modal content is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<FooterModal {...defaultProps} />);

      const modalContent = screen.getByText("Test modal content");
      await user.click(modalContent);

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it("should not call onClose when modal container is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<FooterModal {...defaultProps} />);

      const title = screen.getByText("Test Modal Title");
      await user.click(title);

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  // =============================================================================
  // Title Tests
  // =============================================================================

  describe("title rendering", () => {
    it("should render different titles", () => {
      const { rerender } = renderWithTheme(
        <FooterModal {...defaultProps} title="First Title" />,
      );
      expect(screen.getByText("First Title")).toBeInTheDocument();

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <FooterModal {...defaultProps} title="Second Title" />
        </ThemeProvider>,
      );
      expect(screen.getByText("Second Title")).toBeInTheDocument();
    });

    it("should render title as h3 element", () => {
      renderWithTheme(<FooterModal {...defaultProps} />);
      const title = screen.getByText("Test Modal Title");
      expect(title.tagName).toBe("H3");
    });

    it("should apply font-bold to title", () => {
      renderWithTheme(<FooterModal {...defaultProps} />);
      const title = screen.getByText("Test Modal Title");
      expect(title).toHaveClass("font-bold");
    });

    it("should handle long titles", () => {
      const longTitle =
        "This is a very long modal title that might wrap to multiple lines";
      renderWithTheme(<FooterModal {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle empty title", () => {
      renderWithTheme(<FooterModal {...defaultProps} title="" />);
      const { container } = renderWithTheme(
        <FooterModal {...defaultProps} title="" />,
      );
      expect(container.querySelector("h3")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Children Content Tests
  // =============================================================================

  describe("children content", () => {
    it("should render text children", () => {
      renderWithTheme(
        <FooterModal {...defaultProps}>
          <span>Simple text content</span>
        </FooterModal>,
      );
      expect(screen.getByText("Simple text content")).toBeInTheDocument();
    });

    it("should render complex children", () => {
      renderWithTheme(
        <FooterModal {...defaultProps}>
          <div>
            <h4>Heading</h4>
            <p>Paragraph content</p>
            <button>Button</button>
          </div>
        </FooterModal>,
      );
      expect(screen.getByText("Heading")).toBeInTheDocument();
      expect(screen.getByText("Paragraph content")).toBeInTheDocument();
      expect(screen.getByText("Button")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      renderWithTheme(
        <FooterModal {...defaultProps}>
          <p>First child</p>
          <p>Second child</p>
          <p>Third child</p>
        </FooterModal>,
      );
      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
      expect(screen.getByText("Third child")).toBeInTheDocument();
    });

    it("should handle null children", () => {
      const { container } = renderWithTheme(
        <FooterModal {...defaultProps} children={null} />,
      );
      expect(container.querySelector(".p-6.max-h-96")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe("dark mode styling", () => {
    it("should apply dark theme background in dark mode", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />, {
        darkMode: true,
      });
      const modalContainer = container.querySelector(".bg-slate-800\\/95");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should apply light theme background in light mode", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />, {
        darkMode: false,
      });
      const modalContainer = container.querySelector(".bg-white\\/95");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should apply dark theme border in dark mode", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />, {
        darkMode: true,
      });
      const modalContainer = container.querySelector(".border-slate-700");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should apply light theme border in light mode", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />, {
        darkMode: false,
      });
      const modalContainer = container.querySelector(".border-slate-300");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should apply dark theme title color in dark mode", () => {
      renderWithTheme(<FooterModal {...defaultProps} />, { darkMode: true });
      const title = screen.getByText("Test Modal Title");
      expect(title).toHaveClass("text-slate-200");
    });

    it("should apply light theme title color in light mode", () => {
      renderWithTheme(<FooterModal {...defaultProps} />, { darkMode: false });
      const title = screen.getByText("Test Modal Title");
      expect(title).toHaveClass("text-slate-700");
    });

    it("should apply dark theme header border in dark mode", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />, {
        darkMode: true,
      });
      const headerBorder = container.querySelector(".border-slate-700");
      expect(headerBorder).toBeInTheDocument();
    });

    it("should apply light theme header border in light mode", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />, {
        darkMode: false,
      });
      const headerBorder = container.querySelector(".border-slate-200");
      expect(headerBorder).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Close Button Styling Tests
  // =============================================================================

  describe("close button styling", () => {
    it("should have dark theme close button styling in dark mode", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />, {
        darkMode: true,
      });
      const closeButton = container.querySelector("button");
      expect(closeButton).toHaveClass("text-slate-400");
      expect(closeButton).toHaveClass("hover:text-slate-200");
    });

    it("should have light theme close button styling in light mode", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />, {
        darkMode: false,
      });
      const closeButton = container.querySelector("button");
      expect(closeButton).toHaveClass("text-slate-500");
      expect(closeButton).toHaveClass("hover:text-slate-700");
    });

    it("should have rounded corners on close button", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const closeButton = container.querySelector("button");
      expect(closeButton).toHaveClass("rounded-lg");
    });

    it("should have transition classes on close button", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const closeButton = container.querySelector("button");
      expect(closeButton).toHaveClass("transition-colors");
    });

    it("should have cursor-pointer on close button", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const closeButton = container.querySelector("button");
      expect(closeButton).toHaveClass("cursor-pointer");
    });

    it("should have padding on close button", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const closeButton = container.querySelector("button");
      expect(closeButton).toHaveClass("p-2");
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      const { container } = renderWithTheme(
        <FooterModal {...defaultProps} darkMode={true} />,
        { darkMode: false },
      );
      const modalContainer = container.querySelector(".bg-slate-800\\/95");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should use darkMode override when provided (false)", () => {
      const { container } = renderWithTheme(
        <FooterModal {...defaultProps} darkMode={false} />,
        { darkMode: true },
      );
      const modalContainer = container.querySelector(".bg-white\\/95");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should use context value when darkMode override is undefined", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />, {
        darkMode: true,
      });
      const modalContainer = container.querySelector(".bg-slate-800\\/95");
      expect(modalContainer).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe("accessibility", () => {
    it("should have proper heading structure", () => {
      renderWithTheme(<FooterModal {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it("should have clickable close button", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const closeButton = container.querySelector("button");
      expect(closeButton).toBeInTheDocument();
    });

    it("should have scrollable content area", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const contentArea = container.querySelector(".overflow-y-auto");
      expect(contentArea).toBeInTheDocument();
    });

    it("should have max-height on content for scroll", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const contentArea = container.querySelector(".max-h-96");
      expect(contentArea).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Styling Classes Tests
  // =============================================================================

  describe("styling classes", () => {
    it("should have backdrop-blur on modal container", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const modalContainer = container.querySelector(".backdrop-blur-md");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should have rounded corners on modal", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const modalContainer = container.querySelector(".rounded-2xl");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should have shadow on modal", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const modalContainer = container.querySelector(".shadow-2xl");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should have max-width on modal", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const modalContainer = container.querySelector(".max-w-2xl");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should have max-height on modal", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const modalContainer = container.querySelector("[class*='max-h']");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should have w-full on modal", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const modalContainer = container.querySelector(".w-full");
      expect(modalContainer).toBeInTheDocument();
    });

    it("should have overflow-hidden on modal", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const modalContainer = container.querySelector(".overflow-hidden");
      expect(modalContainer).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Backdrop Tests
  // =============================================================================

  describe("backdrop", () => {
    it("should have backdrop with fixed positioning", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const backdrop = container.querySelector(".fixed.inset-0");
      expect(backdrop).toBeInTheDocument();
    });

    it("should have backdrop with z-50", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const backdrop = container.querySelector(".z-50");
      expect(backdrop).toBeInTheDocument();
    });

    it("should have backdrop with black/50 background", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const backdrop = container.querySelector(".bg-black\\/50");
      expect(backdrop).toBeInTheDocument();
    });

    it("should have backdrop with blur effect", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const backdrop = container.querySelector(".backdrop-blur-sm");
      expect(backdrop).toBeInTheDocument();
    });

    it("should have flex centering on backdrop", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const backdrop = container.querySelector(
        ".flex.items-center.justify-center",
      );
      expect(backdrop).toBeInTheDocument();
    });

    it("should have padding on backdrop for mobile", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const backdrop = container.querySelector(".p-4");
      expect(backdrop).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Header Section Tests
  // =============================================================================

  describe("header section", () => {
    it("should have padding on header", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const header = container.querySelector(".p-6.border-b");
      expect(header).toBeInTheDocument();
    });

    it("should have border-b on header", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const header = container.querySelector(".border-b");
      expect(header).toBeInTheDocument();
    });

    it("should have flex layout for header content", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const headerFlex = container.querySelector(
        ".flex.justify-between.items-center",
      );
      expect(headerFlex).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Content Section Tests
  // =============================================================================

  describe("content section", () => {
    it("should have padding on content", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const content = container.querySelector(".p-6.max-h-96");
      expect(content).toBeInTheDocument();
    });

    it("should have custom-scroll class for styled scrollbar", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);
      const content = container.querySelector(".custom-scroll");
      expect(content).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Backward Compatibility Tests
  // =============================================================================

  describe("backward compatibility (outside ThemeProvider)", () => {
    it("should render without ThemeProvider using darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<FooterModal {...defaultProps} darkMode={true} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = render(<FooterModal {...defaultProps} />);
      const modalContainer = container.querySelector(".bg-white\\/95");
      expect(modalContainer).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should handle isOpen changing from true to false", () => {
      const { rerender } = renderWithTheme(
        <FooterModal {...defaultProps} isOpen={true} />,
      );
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <FooterModal {...defaultProps} isOpen={false} />
        </ThemeProvider>,
      );
      expect(screen.queryByText("Test Modal Title")).not.toBeInTheDocument();
    });

    it("should handle isOpen changing from false to true", () => {
      const { rerender } = renderWithTheme(
        <FooterModal {...defaultProps} isOpen={false} />,
      );
      expect(screen.queryByText("Test Modal Title")).not.toBeInTheDocument();

      rerender(
        <ThemeProvider defaultDarkMode={false}>
          <FooterModal {...defaultProps} isOpen={true} />
        </ThemeProvider>,
      );
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
    });

    it("should handle rapid open/close", async () => {
      const user = userEvent.setup();
      const { container, rerender } = renderWithTheme(
        <FooterModal {...defaultProps} isOpen={true} />,
      );

      const closeButton = container.querySelector("button");
      await user.click(closeButton);
      await user.click(closeButton);
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(3);
    });

    it("should handle title with special characters", () => {
      const specialTitle = "Title with <script> & \"quotes\" 'apostrophe'";
      renderWithTheme(<FooterModal {...defaultProps} title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it("should handle children with interactive elements", async () => {
      const childButtonClick = vi.fn();
      renderWithTheme(
        <FooterModal {...defaultProps}>
          <button onClick={childButtonClick}>Child Button</button>
        </FooterModal>,
      );

      const user = userEvent.setup();
      await user.click(screen.getByText("Child Button"));

      expect(childButtonClick).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  // =============================================================================
  // Stop Propagation Tests
  // =============================================================================

  describe("event propagation", () => {
    it("should stop propagation when clicking inside modal", () => {
      const { container } = renderWithTheme(<FooterModal {...defaultProps} />);

      // Click on the modal content area
      const modalContent = screen.getByText("Test modal content");
      fireEvent.click(modalContent);

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it("should stop propagation when clicking on modal title", () => {
      renderWithTheme(<FooterModal {...defaultProps} />);

      const title = screen.getByText("Test Modal Title");
      fireEvent.click(title);

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });
});

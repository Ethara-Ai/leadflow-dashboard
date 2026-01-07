/**
 * Unit Tests for Header Component
 * Tests the application header with navigation controls and action buttons
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const defaultProps = {
  isLoading: false,
  onToggleDarkMode: vi.fn(),
  onRefresh: vi.fn(),
  onOpenNotes: vi.fn(),
  onExportCSV: vi.fn(),
  onExportJSON: vi.fn(),
};

// Mock framer-motion to simplify testing
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      onClick,
      role,
      tabIndex,
      onKeyDown,
      ...props
    }) => (
      <div
        className={className}
        onClick={onClick}
        role={role}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        {...props}
      >
        {children}
      </div>
    ),
    button: ({ children, className, onClick, disabled, ...props }) => (
      <button
        className={className}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, "location", {
  value: { reload: mockReload },
  writable: true,
});

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic rendering", () => {
    it("should render the ZOOLAB title", () => {
      renderWithTheme(<Header {...defaultProps} />);
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();
    });

    it("should render the tagline", () => {
      renderWithTheme(<Header {...defaultProps} />);
      expect(
        screen.getByText(
          "Professional zoo animal monitoring and management system",
        ),
      ).toBeInTheDocument();
    });

    it("should render the PawPrint icon", () => {
      const { container } = renderWithTheme(<Header {...defaultProps} />);
      // PawPrint icon should be in the logo area
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render all action buttons", () => {
      renderWithTheme(<Header {...defaultProps} />);
      expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
      expect(screen.getByLabelText("Refresh data")).toBeInTheDocument();
      expect(screen.getByLabelText("Open notes")).toBeInTheDocument();
      expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Logo Interaction Tests
  // =============================================================================

  describe("logo interactions", () => {
    it("should reload page when logo is clicked", () => {
      const { container } = renderWithTheme(<Header {...defaultProps} />);
      // Find the logo container (div with role="button" and tabindex="0")
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      fireEvent.click(logo);
      expect(mockReload).toHaveBeenCalled();
    });

    it("should reload page when Enter is pressed on logo", () => {
      const { container } = renderWithTheme(<Header {...defaultProps} />);
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      fireEvent.keyDown(logo, { key: "Enter" });
      expect(mockReload).toHaveBeenCalled();
    });

    it("should reload page when Space is pressed on logo", () => {
      const { container } = renderWithTheme(<Header {...defaultProps} />);
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      fireEvent.keyDown(logo, { key: " " });
      expect(mockReload).toHaveBeenCalled();
    });

    it("should not reload page for other keys", () => {
      const { container } = renderWithTheme(<Header {...defaultProps} />);
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      fireEvent.keyDown(logo, { key: "Tab" });
      expect(mockReload).not.toHaveBeenCalled();
    });
  });

  // =============================================================================
  // Dark Mode Toggle Tests
  // =============================================================================

  describe("dark mode toggle", () => {
    it("should call onToggleDarkMode when dark mode button is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const darkModeButton = screen.getByLabelText("Switch to dark mode");
      await user.click(darkModeButton);

      expect(defaultProps.onToggleDarkMode).toHaveBeenCalledTimes(1);
    });

    it("should show Sun icon in dark mode", () => {
      renderWithTheme(<Header {...defaultProps} />, { darkMode: true });
      const darkModeButton = screen.getByLabelText("Switch to light mode");
      // In dark mode, Sun icon should be visible
      expect(darkModeButton).toHaveClass("text-yellow-400");
    });

    it("should show Moon icon in light mode", () => {
      renderWithTheme(<Header {...defaultProps} />, { darkMode: false });
      const darkModeButton = screen.getByLabelText("Switch to dark mode");
      expect(darkModeButton).toHaveClass("text-slate-700");
    });
  });

  // =============================================================================
  // Refresh Button Tests
  // =============================================================================

  describe("refresh button", () => {
    it("should call onRefresh when refresh button is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const refreshButton = screen.getByLabelText("Refresh data");
      await user.click(refreshButton);

      expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1);
    });

    it("should disable refresh button when isLoading is true", () => {
      renderWithTheme(<Header {...defaultProps} isLoading={true} />);
      const refreshButton = screen.getByLabelText("Refresh data");
      expect(refreshButton).toBeDisabled();
    });

    it("should enable refresh button when isLoading is false", () => {
      renderWithTheme(<Header {...defaultProps} isLoading={false} />);
      const refreshButton = screen.getByLabelText("Refresh data");
      expect(refreshButton).not.toBeDisabled();
    });

    it("should show spinning animation when loading", () => {
      const { container } = renderWithTheme(
        <Header {...defaultProps} isLoading={true} />,
      );
      const spinningIcon = container.querySelector(".animate-spin");
      expect(spinningIcon).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Notes Button Tests
  // =============================================================================

  describe("notes button", () => {
    it("should call onOpenNotes when notes button is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const notesButton = screen.getByLabelText("Open notes");
      await user.click(notesButton);

      expect(defaultProps.onOpenNotes).toHaveBeenCalledTimes(1);
    });
  });

  // =============================================================================
  // Menu Dropdown Tests
  // =============================================================================

  describe("menu dropdown", () => {
    it("should open dropdown when menu button is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const menuButton = screen.getByLabelText("Open menu");
      await user.click(menuButton);

      expect(screen.getByText("Export Data (CSV)")).toBeInTheDocument();
      expect(screen.getByText("Export Data (JSON)")).toBeInTheDocument();
    });

    it("should close dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const menuButton = screen.getByLabelText("Open menu");
      await user.click(menuButton);

      expect(screen.getByText("Export Data (CSV)")).toBeInTheDocument();

      // Click on the backdrop
      const backdrop = document.querySelector(".fixed.inset-0");
      if (backdrop) {
        await user.click(backdrop);
      }
    });

    it("should call onExportCSV and close dropdown when CSV option is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const menuButton = screen.getByLabelText("Open menu");
      await user.click(menuButton);

      const csvButton = screen.getByText("Export Data (CSV)");
      await user.click(csvButton);

      expect(defaultProps.onExportCSV).toHaveBeenCalledTimes(1);
    });

    it("should call onExportJSON and close dropdown when JSON option is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const menuButton = screen.getByLabelText("Open menu");
      await user.click(menuButton);

      const jsonButton = screen.getByText("Export Data (JSON)");
      await user.click(jsonButton);

      expect(defaultProps.onExportJSON).toHaveBeenCalledTimes(1);
    });

    it("should toggle dropdown open and closed", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const menuButton = screen.getByLabelText("Open menu");

      // Open
      await user.click(menuButton);
      expect(screen.getByText("Export Data (CSV)")).toBeInTheDocument();

      // Close
      await user.click(menuButton);
      await waitFor(() => {
        expect(screen.queryByText("Export Data (CSV)")).not.toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe("dark mode styling", () => {
    it("should apply dark theme button classes in dark mode", () => {
      renderWithTheme(<Header {...defaultProps} />, { darkMode: true });
      const refreshButton = screen.getByLabelText("Refresh data");
      expect(refreshButton).toHaveClass("bg-slate-800/60");
    });

    it("should apply light theme button classes in light mode", () => {
      renderWithTheme(<Header {...defaultProps} />, { darkMode: false });
      const refreshButton = screen.getByLabelText("Refresh data");
      expect(refreshButton).toHaveClass("bg-white/90");
    });

    it("should apply dark theme text color to title in dark mode", () => {
      renderWithTheme(<Header {...defaultProps} />, { darkMode: true });
      const title = screen.getByText("ZOOLAB");
      expect(title).toHaveClass("text-white");
    });

    it("should apply light theme text color to title in light mode", () => {
      renderWithTheme(<Header {...defaultProps} />, { darkMode: false });
      const title = screen.getByText("ZOOLAB");
      expect(title).toHaveClass("text-slate-800");
    });

    it("should apply dark theme icon background in dark mode", () => {
      const { container } = renderWithTheme(<Header {...defaultProps} />, {
        darkMode: true,
      });
      const iconContainer = container.querySelector(".bg-emerald-900\\/30");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should apply light theme icon background in light mode", () => {
      const { container } = renderWithTheme(<Header {...defaultProps} />, {
        darkMode: false,
      });
      const iconContainer = container.querySelector(".bg-emerald-100");
      expect(iconContainer).toBeInTheDocument();
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      renderWithTheme(<Header {...defaultProps} darkMode={true} />, {
        darkMode: false,
      });
      const title = screen.getByText("ZOOLAB");
      expect(title).toHaveClass("text-white");
    });

    it("should use darkMode override when provided (false)", () => {
      renderWithTheme(<Header {...defaultProps} darkMode={false} />, {
        darkMode: true,
      });
      const title = screen.getByText("ZOOLAB");
      expect(title).toHaveClass("text-slate-800");
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe("accessibility", () => {
    it("should have aria-label on all action buttons", () => {
      renderWithTheme(<Header {...defaultProps} />);
      expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
      expect(screen.getByLabelText("Refresh data")).toBeInTheDocument();
      expect(screen.getByLabelText("Open notes")).toBeInTheDocument();
      expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
    });

    it("should have proper heading structure", () => {
      renderWithTheme(<Header {...defaultProps} />);
      const title = screen.getByText("ZOOLAB");
      expect(title.tagName).toBe("H1");
    });

    it("should have focusable logo with tabIndex", () => {
      const { container } = renderWithTheme(<Header {...defaultProps} />);
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      expect(logo).toHaveAttribute("tabIndex", "0");
    });
  });

  // =============================================================================
  // Responsive Classes Tests
  // =============================================================================

  describe("responsive classes", () => {
    it("should have responsive padding classes on buttons", () => {
      renderWithTheme(<Header {...defaultProps} />);
      const refreshButton = screen.getByLabelText("Refresh data");
      expect(refreshButton).toHaveClass("p-2");
      expect(refreshButton).toHaveClass("sm:p-2.5");
      expect(refreshButton).toHaveClass("md:p-3");
    });

    it("should have responsive text sizes for title", () => {
      renderWithTheme(<Header {...defaultProps} />);
      const title = screen.getByText("ZOOLAB");
      expect(title).toHaveClass("text-2xl");
      expect(title).toHaveClass("sm:text-3xl");
      expect(title).toHaveClass("md:text-4xl");
      expect(title).toHaveClass("lg:text-5xl");
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

      render(<Header {...defaultProps} darkMode={true} />);
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<Header {...defaultProps} />);
      const title = screen.getByText("ZOOLAB");
      expect(title).toHaveClass("text-slate-800");

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should handle rapid clicks on menu button", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const menuButton = screen.getByLabelText("Open menu");

      // Rapid clicks
      await user.click(menuButton);
      await user.click(menuButton);
      await user.click(menuButton);

      // Should still function properly
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();
    });

    it("should handle multiple export clicks", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header {...defaultProps} />);

      const menuButton = screen.getByLabelText("Open menu");
      await user.click(menuButton);

      const csvButton = screen.getByText("Export Data (CSV)");
      await user.click(csvButton);

      // Menu should close, reopen it
      await user.click(menuButton);
      const jsonButton = screen.getByText("Export Data (JSON)");
      await user.click(jsonButton);

      expect(defaultProps.onExportCSV).toHaveBeenCalledTimes(1);
      expect(defaultProps.onExportJSON).toHaveBeenCalledTimes(1);
    });
  });
});

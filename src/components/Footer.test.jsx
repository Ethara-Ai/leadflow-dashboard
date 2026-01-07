/**
 * Unit Tests for Footer Component
 * Tests the application footer with navigation links and theme support
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "./Footer";
import ThemeProvider from "../hooks/ThemeProvider";

// =============================================================================
// Test Helpers
// =============================================================================

const renderWithTheme = (ui, { darkMode = false } = {}) => {
  return render(<ThemeProvider defaultDarkMode={darkMode}>{ui}</ThemeProvider>);
};

const defaultProps = {
  onOpenProductModal: vi.fn(),
  onOpenResourcesModal: vi.fn(),
  onOpenCompanyModal: vi.fn(),
};

// Mock framer-motion to simplify testing
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
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

describe("Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic rendering", () => {
    it("should render the ZOOLAB logo text", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();
    });

    it("should render the footer description", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(
        screen.getByText(
          /Professional zoo animal monitoring and management system/,
        ),
      ).toBeInTheDocument();
    });

    it("should render the copyright text", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(
        screen.getByText("© 2025 ZOOLAB. All rights reserved."),
      ).toBeInTheDocument();
    });

    it("should render the Made with heart text", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText("Made with")).toBeInTheDocument();
      expect(screen.getByText("for wildlife conservation")).toBeInTheDocument();
    });

    it("should render the Heart icon", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const heartIcon = container.querySelector(".text-red-500");
      expect(heartIcon).toBeInTheDocument();
    });

    it("should render the PawPrint icon", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Navigation Sections Tests
  // =============================================================================

  describe("navigation sections", () => {
    it("should render Product section heading", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText("Product")).toBeInTheDocument();
    });

    it("should render Resources section heading", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText("Resources")).toBeInTheDocument();
    });

    it("should render Company section heading", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText("Company")).toBeInTheDocument();
    });

    it("should render Product links", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText("Features")).toBeInTheDocument();
      expect(screen.getByText("Support")).toBeInTheDocument();
    });

    it("should render Resources links", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText("Community")).toBeInTheDocument();
      expect(screen.getByText("Case Studies")).toBeInTheDocument();
    });

    it("should render Company links", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      expect(screen.getByText("Privacy")).toBeInTheDocument();
      expect(screen.getByText("Terms")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Logo Interaction Tests
  // =============================================================================

  describe("logo interactions", () => {
    it("should reload page when logo is clicked", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      // Find the logo container (div with role="button" and cursor-pointer)
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      fireEvent.click(logo);
      expect(mockReload).toHaveBeenCalled();
    });

    it("should reload page when Enter is pressed on logo", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      fireEvent.keyDown(logo, { key: "Enter" });
      expect(mockReload).toHaveBeenCalled();
    });

    it("should reload page when Space is pressed on logo", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      fireEvent.keyDown(logo, { key: " " });
      expect(mockReload).toHaveBeenCalled();
    });

    it("should not reload page for other keys", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      fireEvent.keyDown(logo, { key: "Tab" });
      expect(mockReload).not.toHaveBeenCalled();
    });

    it("should have tabIndex 0 for keyboard accessibility", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const logo = container.querySelector('[role="button"][tabindex="0"]');
      expect(logo).toHaveAttribute("tabIndex", "0");
    });
  });

  // =============================================================================
  // Navigation Link Click Tests
  // =============================================================================

  describe("navigation link clicks", () => {
    it("should call onOpenProductModal when Features is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Footer {...defaultProps} />);

      const featuresLink = screen.getByText("Features");
      await user.click(featuresLink);

      expect(defaultProps.onOpenProductModal).toHaveBeenCalledTimes(1);
    });

    it("should call onOpenProductModal when Support is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Footer {...defaultProps} />);

      const supportLink = screen.getByText("Support");
      await user.click(supportLink);

      expect(defaultProps.onOpenProductModal).toHaveBeenCalledTimes(1);
    });

    it("should call onOpenResourcesModal when Community is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Footer {...defaultProps} />);

      const communityLink = screen.getByText("Community");
      await user.click(communityLink);

      expect(defaultProps.onOpenResourcesModal).toHaveBeenCalledTimes(1);
    });

    it("should call onOpenResourcesModal when Case Studies is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Footer {...defaultProps} />);

      const caseStudiesLink = screen.getByText("Case Studies");
      await user.click(caseStudiesLink);

      expect(defaultProps.onOpenResourcesModal).toHaveBeenCalledTimes(1);
    });

    it("should call onOpenCompanyModal when Privacy is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Footer {...defaultProps} />);

      const privacyLink = screen.getByText("Privacy");
      await user.click(privacyLink);

      expect(defaultProps.onOpenCompanyModal).toHaveBeenCalledTimes(1);
    });

    it("should call onOpenCompanyModal when Terms is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Footer {...defaultProps} />);

      const termsLink = screen.getByText("Terms");
      await user.click(termsLink);

      expect(defaultProps.onOpenCompanyModal).toHaveBeenCalledTimes(1);
    });
  });

  // =============================================================================
  // Theme Styling Tests
  // =============================================================================

  describe("dark mode styling", () => {
    it("should apply dark theme background in dark mode", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />, {
        darkMode: true,
      });
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("bg-slate-900/50");
    });

    it("should apply light theme background in light mode", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />, {
        darkMode: false,
      });
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("bg-white/80");
    });

    it("should apply dark theme border in dark mode", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />, {
        darkMode: true,
      });
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("border-slate-800");
    });

    it("should apply light theme border in light mode", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />, {
        darkMode: false,
      });
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("border-slate-200");
    });

    it("should apply dark theme text color to headings in dark mode", () => {
      renderWithTheme(<Footer {...defaultProps} />, { darkMode: true });
      const productHeading = screen.getByText("Product");
      expect(productHeading).toHaveClass("text-slate-200");
    });

    it("should apply light theme text color to headings in light mode", () => {
      renderWithTheme(<Footer {...defaultProps} />, { darkMode: false });
      const productHeading = screen.getByText("Product");
      expect(productHeading).toHaveClass("text-slate-700");
    });

    it("should apply dark theme icon background in dark mode", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />, {
        darkMode: true,
      });
      const iconContainer = container.querySelector(".bg-emerald-900\\/30");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should apply light theme icon background in light mode", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />, {
        darkMode: false,
      });
      const iconContainer = container.querySelector(".bg-emerald-100");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should apply dark theme logo text color in dark mode", () => {
      renderWithTheme(<Footer {...defaultProps} />, { darkMode: true });
      const logo = screen.getByText("ZOOLAB");
      expect(logo).toHaveClass("text-slate-100");
    });

    it("should apply light theme logo text color in light mode", () => {
      renderWithTheme(<Footer {...defaultProps} />, { darkMode: false });
      const logo = screen.getByText("ZOOLAB");
      expect(logo).toHaveClass("text-slate-800");
    });
  });

  // =============================================================================
  // darkMode Override Prop Tests
  // =============================================================================

  describe("darkMode override prop", () => {
    it("should use darkMode override when provided (true)", () => {
      const { container } = renderWithTheme(
        <Footer {...defaultProps} darkMode={true} />,
        { darkMode: false },
      );
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("bg-slate-900/50");
    });

    it("should use darkMode override when provided (false)", () => {
      const { container } = renderWithTheme(
        <Footer {...defaultProps} darkMode={false} />,
        { darkMode: true },
      );
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("bg-white/80");
    });

    it("should use context value when darkMode override is undefined", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />, {
        darkMode: true,
      });
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("bg-slate-900/50");
    });
  });

  // =============================================================================
  // Accessibility Tests
  // =============================================================================

  describe("accessibility", () => {
    it("should render navigation links as buttons", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const buttons = container.querySelectorAll("button");
      // 6 navigation links (logo is a div with role="button")
      expect(buttons.length).toBeGreaterThanOrEqual(6);
    });

    it("should have proper heading structure for section titles", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      const productHeading = screen.getByText("Product");
      expect(productHeading.tagName).toBe("H4");
    });

    it("should have semantic footer element", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      expect(container.querySelector("footer")).toBeInTheDocument();
    });

    it("should have cursor-pointer on clickable links", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      const featuresLink = screen.getByText("Features");
      expect(featuresLink).toHaveClass("cursor-pointer");
    });
  });

  // =============================================================================
  // Responsive Classes Tests
  // =============================================================================

  describe("responsive classes", () => {
    it("should have responsive margin classes on footer", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("mt-8");
      expect(footer).toHaveClass("sm:mt-12");
      expect(footer).toHaveClass("md:mt-16");
    });

    it("should have responsive padding classes", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const innerDiv = container.querySelector(".max-w-7xl");
      expect(innerDiv).toHaveClass("px-3");
      expect(innerDiv).toHaveClass("sm:px-4");
    });

    it("should have responsive grid layout", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-2");
      expect(grid).toHaveClass("lg:grid-cols-4");
    });

    it("should have responsive text sizes for headings", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      const productHeading = screen.getByText("Product");
      expect(productHeading).toHaveClass("text-sm");
      expect(productHeading).toHaveClass("sm:text-base");
      expect(productHeading).toHaveClass("md:text-lg");
    });

    it("should have responsive text sizes for links", () => {
      renderWithTheme(<Footer {...defaultProps} />);
      const featuresLink = screen.getByText("Features");
      expect(featuresLink).toHaveClass("text-xs");
      expect(featuresLink).toHaveClass("sm:text-sm");
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

      render(<Footer {...defaultProps} darkMode={true} />);
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("should default to light mode when outside ThemeProvider without darkMode prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = render(<Footer {...defaultProps} />);
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("bg-white/80");

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // Edge Cases
  // =============================================================================

  describe("edge cases", () => {
    it("should handle multiple clicks on same link", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Footer {...defaultProps} />);

      const featuresLink = screen.getByText("Features");
      await user.click(featuresLink);
      await user.click(featuresLink);
      await user.click(featuresLink);

      expect(defaultProps.onOpenProductModal).toHaveBeenCalledTimes(3);
    });

    it("should handle clicks on different sections", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Footer {...defaultProps} />);

      await user.click(screen.getByText("Features"));
      await user.click(screen.getByText("Community"));
      await user.click(screen.getByText("Privacy"));

      expect(defaultProps.onOpenProductModal).toHaveBeenCalledTimes(1);
      expect(defaultProps.onOpenResourcesModal).toHaveBeenCalledTimes(1);
      expect(defaultProps.onOpenCompanyModal).toHaveBeenCalledTimes(1);
    });

    it("should render all elements without missing props", () => {
      renderWithTheme(<Footer {...defaultProps} />);

      // Verify all main elements are present
      expect(screen.getByText("ZOOLAB")).toBeInTheDocument();
      expect(screen.getByText("Product")).toBeInTheDocument();
      expect(screen.getByText("Resources")).toBeInTheDocument();
      expect(screen.getByText("Company")).toBeInTheDocument();
      expect(
        screen.getByText("© 2025 ZOOLAB. All rights reserved."),
      ).toBeInTheDocument();
    });
  });

  // =============================================================================
  // Styling Classes Tests
  // =============================================================================

  describe("styling classes", () => {
    it("should have backdrop blur class", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("backdrop-blur-lg");
    });

    it("should have transition classes", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("transition-all");
      expect(footer).toHaveClass("duration-300");
    });

    it("should have border-t class for top border", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("border-t");
    });

    it("should have max-width constraint", () => {
      const { container } = renderWithTheme(<Footer {...defaultProps} />);
      const innerDiv = container.querySelector(".max-w-7xl");
      expect(innerDiv).toBeInTheDocument();
    });
  });
});

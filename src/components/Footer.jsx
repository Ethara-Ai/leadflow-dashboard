import { memo } from 'react';
import PropTypes from 'prop-types';
import { Zap, Heart } from 'lucide-react';
import { fontFamily, fontFamilyHeading } from '../constants';
import useThemeSafe from '../hooks/useThemeSafe';

/**
 * Footer Component
 * Application footer with branding, navigation links, and copyright information.
 *
 * @param {Object} props - Component props
 * @param {function} props.onOpenProductModal - Callback when product link is clicked
 * @param {function} props.onOpenResourcesModal - Callback when resources link is clicked
 * @param {function} props.onOpenCompanyModal - Callback when company link is clicked
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const Footer = memo(function Footer({
  onOpenProductModal,
  onOpenResourcesModal,
  onOpenCompanyModal,
  darkMode: darkModeOverride,
}) {
  // Use safe theme hook with optional override
  const { isDark } = useThemeSafe(darkModeOverride);

  // Handler for logo click - reload page
  const handleLogoClick = () => {
    window.location.reload();
  };

  // Handler for logo keyboard interaction
  const handleLogoKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.reload();
    }
  };

  // Theme-based classes
  const headingClasses = isDark ? 'text-neutral-200' : 'text-slate-700';
  const textClasses = isDark ? 'text-neutral-400' : 'text-slate-600';
  const linkClasses = isDark
    ? 'text-neutral-400 hover:text-neutral-200'
    : 'text-slate-600 hover:text-slate-800';

  return (
    <footer
      className={`mt-8 sm:mt-12 md:mt-16 border-t transition-all duration-300 ${
        isDark
          ? 'bg-neutral-950/90 border-neutral-800 backdrop-blur-lg'
          : 'bg-white/80 border-slate-200 backdrop-blur-lg'
      }`}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-2 sm:space-y-3 md:space-y-4">
            <div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer w-fit"
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyDown={handleLogoKeyDown}
              aria-label="Reload page"
            >
              <div
                className={`p-2 sm:p-2.5 md:p-3 rounded-xl ${isDark ? 'bg-neutral-800/60' : 'bg-blue-100'}`}
              >
                <Zap
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                  aria-hidden="true"
                />
              </div>
              <span
                className={`text-lg sm:text-xl md:text-2xl font-bold ${isDark ? 'text-neutral-100' : 'text-slate-800'}`}
                style={{ fontFamily: fontFamilyHeading }}
              >
                LeadFlow
              </span>
            </div>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${textClasses}`}
              style={{ fontFamily }}
            >
              Professional lead generation and management platform for sales teams, marketing
              professionals, and business development specialists.
            </p>
          </div>

          {/* Product Section */}
          <nav
            className="space-y-2 sm:space-y-3 md:space-y-4"
            aria-labelledby="footer-product-heading"
          >
            <h4
              id="footer-product-heading"
              className={`text-sm sm:text-base md:text-lg font-bold ${headingClasses}`}
              style={{ fontFamily }}
            >
              Product
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              {['Features', 'Support'].map((link) => (
                <li key={link}>
                  <button
                    onClick={onOpenProductModal}
                    className={`text-xs sm:text-sm transition-colors cursor-pointer text-left ${linkClasses}`}
                    style={{ fontFamily }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources Section */}
          <nav
            className="space-y-2 sm:space-y-3 md:space-y-4"
            aria-labelledby="footer-resources-heading"
          >
            <h4
              id="footer-resources-heading"
              className={`text-sm sm:text-base md:text-lg font-bold ${headingClasses}`}
              style={{ fontFamily }}
            >
              Resources
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              {['Community', 'Case Studies'].map((link) => (
                <li key={link}>
                  <button
                    onClick={onOpenResourcesModal}
                    className={`text-xs sm:text-sm transition-colors cursor-pointer text-left ${linkClasses}`}
                    style={{ fontFamily }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Section */}
          <nav
            className="space-y-2 sm:space-y-3 md:space-y-4"
            aria-labelledby="footer-company-heading"
          >
            <h4
              id="footer-company-heading"
              className={`text-sm sm:text-base md:text-lg font-bold ${headingClasses}`}
              style={{ fontFamily }}
            >
              Company
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              {['Privacy', 'Terms'].map((link) => (
                <li key={link}>
                  <button
                    onClick={onOpenCompanyModal}
                    className={`text-xs sm:text-sm transition-colors cursor-pointer text-left ${linkClasses}`}
                    style={{ fontFamily }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-6 sm:mt-8 md:mt-12 pt-4 sm:pt-6 md:pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 ${
            isDark ? 'border-neutral-800' : 'border-slate-200'
          }`}
        >
          <p
            className={`text-xs sm:text-sm text-center sm:text-left ${textClasses}`}
            style={{ fontFamily }}
          >
            © {new Date().getFullYear()} LeadFlow. All rights reserved.
          </p>
          <div className="flex items-center space-x-1">
            <span className={`text-xs sm:text-sm ${textClasses}`} style={{ fontFamily }}>
              Made with
            </span>
            <Heart
              className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mx-0.5 sm:mx-1"
              aria-label="love"
            />
            <span className={`text-xs sm:text-sm ${textClasses}`} style={{ fontFamily }}>
              for business growth
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.propTypes = {
  onOpenProductModal: PropTypes.func.isRequired,
  onOpenResourcesModal: PropTypes.func.isRequired,
  onOpenCompanyModal: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
};

export default Footer;

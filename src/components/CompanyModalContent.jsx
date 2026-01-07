import { fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * CompanyModalContent Component
 * Displays company information, privacy policy, and terms of service with theme support.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const CompanyModalContent = ({ darkMode: darkModeOverride }) => {
  // Use theme context with optional override for backward compatibility
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = darkModeOverride !== undefined ? darkModeOverride : theme.isDark;
  } catch {
    // Fallback if used outside ThemeProvider (backward compatibility)
    isDark = darkModeOverride ?? false;
  }

  // Theme-based classes
  const headingClasses = isDark ? "text-slate-200" : "text-slate-700";
  const textClasses = isDark ? "text-slate-400" : "text-slate-600";
  const cardClasses = isDark ? "bg-slate-700/30" : "bg-slate-50";

  return (
    <div className="space-y-6">
      {/* Privacy Policy Section */}
      <div className="space-y-4">
        <h4
          className={`text-lg font-bold ${headingClasses}`}
          style={{ fontFamily }}
        >
          Privacy Policy
        </h4>
        <div className={`p-4 rounded-xl ${cardClasses}`}>
          <div className="space-y-3">
            <div>
              <h6
                className={`font-medium ${headingClasses}`}
                style={{ fontFamily }}
              >
                Data Protection
              </h6>
              <p
                className={`text-sm mt-1 ${textClasses}`}
                style={{ fontFamily }}
              >
                We employ enterprise-grade encryption and security measures to
                protect your animal records, veterinary data, and zoo
                observations.
              </p>
            </div>
            <div>
              <h6
                className={`font-medium ${headingClasses}`}
                style={{ fontFamily }}
              >
                Data Ownership
              </h6>
              <p
                className={`text-sm mt-1 ${textClasses}`}
                style={{ fontFamily }}
              >
                Your zoo data belongs to you. We provide tools for easy export
                and maintain strict data portability standards for regulatory
                compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service Section */}
      <div className="space-y-4">
        <h4
          className={`text-lg font-bold ${headingClasses}`}
          style={{ fontFamily }}
        >
          Terms of Service
        </h4>
        <div className={`p-4 rounded-xl ${cardClasses}`}>
          <div className="space-y-3">
            <div>
              <h6
                className={`font-medium ${headingClasses}`}
                style={{ fontFamily }}
              >
                Professional License
              </h6>
              <p
                className={`text-sm mt-1 ${textClasses}`}
                style={{ fontFamily }}
              >
                Licensed for accredited zoos, wildlife sanctuaries, and
                conservation organizations. Custom enterprise plans available
                for large facilities.
              </p>
            </div>
            <div>
              <h6
                className={`font-medium ${headingClasses}`}
                style={{ fontFamily }}
              >
                Animal Welfare Standards
              </h6>
              <p
                className={`text-sm mt-1 ${textClasses}`}
                style={{ fontFamily }}
              >
                Committed to AZA (Association of Zoos and Aquariums) standards
                and promoting responsible animal care, welfare, and conservation
                practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div
        className={`p-4 rounded-xl border ${
          isDark
            ? "bg-emerald-900/20 border-emerald-800/30"
            : "bg-emerald-50 border-emerald-200"
        }`}
      >
        <p
          className={`text-sm ${
            isDark ? "text-emerald-300" : "text-emerald-700"
          } text-center`}
          style={{ fontFamily }}
        >
          For detailed legal documents, contact: legal@zoolab.wildlife
        </p>
      </div>
    </div>
  );
};

export default CompanyModalContent;

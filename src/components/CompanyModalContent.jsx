import { fontFamily } from '../constants';
import useTheme from '../hooks/useTheme';

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
  const headingClasses = isDark ? 'text-neutral-200' : 'text-slate-700';
  const textClasses = isDark ? 'text-neutral-400' : 'text-slate-600';
  const cardClasses = isDark ? 'bg-neutral-800/40' : 'bg-slate-50';

  return (
    <div className="space-y-6">
      {/* Privacy Policy Section */}
      <div className="space-y-4">
        <h4 className={`text-lg font-bold ${headingClasses}`} style={{ fontFamily }}>
          Privacy Policy
        </h4>
        <div className={`p-4 rounded-xl ${cardClasses}`}>
          <div className="space-y-3">
            <div>
              <h6 className={`font-medium ${headingClasses}`} style={{ fontFamily }}>
                Data Protection
              </h6>
              <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
                We employ enterprise-grade encryption and security measures to protect your lead
                records, sales data, and customer information.
              </p>
            </div>
            <div>
              <h6 className={`font-medium ${headingClasses}`} style={{ fontFamily }}>
                Data Ownership
              </h6>
              <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
                Your sales data belongs to you. We provide tools for easy export and maintain strict
                data portability standards for regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service Section */}
      <div className="space-y-4">
        <h4 className={`text-lg font-bold ${headingClasses}`} style={{ fontFamily }}>
          Terms of Service
        </h4>
        <div className={`p-4 rounded-xl ${cardClasses}`}>
          <div className="space-y-3">
            <div>
              <h6 className={`font-medium ${headingClasses}`} style={{ fontFamily }}>
                Professional License
              </h6>
              <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
                Licensed for sales teams, marketing agencies, and business development
                organizations. Custom enterprise plans available for large teams.
              </p>
            </div>
            <div>
              <h6 className={`font-medium ${headingClasses}`} style={{ fontFamily }}>
                Data Compliance Standards
              </h6>
              <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
                Committed to GDPR, CCPA, and SOC 2 compliance standards, ensuring responsible data
                handling, customer privacy, and secure business practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div
        className={`p-4 rounded-xl border ${
          isDark ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200'
        }`}
      >
        <p
          className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'} text-center`}
          style={{ fontFamily }}
        >
          For detailed legal documents, contact: legal@leadflow.io
        </p>
      </div>
    </div>
  );
};

export default CompanyModalContent;

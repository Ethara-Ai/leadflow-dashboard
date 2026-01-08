import { fontFamily } from "../constants";
import useTheme from "../hooks/useTheme";

/**
 * ProductModalContent Component
 * Displays product information and support services with theme support.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const ProductModalContent = ({ darkMode: darkModeOverride }) => {
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
      <div className="space-y-4">
        <h4
          className={`text-lg font-bold ${headingClasses}`}
          style={{ fontFamily }}
        >
          Advanced Features
        </h4>
        <div className="space-y-3">
          <div className={`p-4 rounded-xl ${cardClasses}`}>
            <h5
              className={`font-semibold ${headingClasses}`}
              style={{ fontFamily }}
            >
              Real-time Lead Tracking
            </h5>
            <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
              Track leads across your pipeline, monitor conversion rates, call
              activities, and meeting schedules with live updates and historical
              data analysis.
            </p>
          </div>
          <div className={`p-4 rounded-xl ${cardClasses}`}>
            <h5
              className={`font-semibold ${headingClasses}`}
              style={{ fontFamily }}
            >
              Advanced Analytics Dashboard
            </h5>
            <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
              Interactive charts, conversion rate metrics, and lead source
              distribution analysis with exportable reports for sales
              performance reviews.
            </p>
          </div>
          <div className={`p-4 rounded-xl ${cardClasses}`}>
            <h5
              className={`font-semibold ${headingClasses}`}
              style={{ fontFamily }}
            >
              Smart Alert System
            </h5>
            <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
              Automated lead monitoring with customizable alerts for follow-up
              reminders, deal updates, meeting schedules, and pipeline
              milestones.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4
          className={`text-lg font-bold ${headingClasses}`}
          style={{ fontFamily }}
        >
          Support Services
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className={`p-3 rounded-lg ${
              isDark ? "bg-blue-900/20" : "bg-blue-50"
            }`}
          >
            <h6
              className={`font-medium ${
                isDark ? "text-blue-400" : "text-blue-700"
              }`}
              style={{ fontFamily }}
            >
              24/7 Technical Support
            </h6>
            <p className={`text-xs mt-1 ${textClasses}`} style={{ fontFamily }}>
              Expert assistance available
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              isDark ? "bg-emerald-900/20" : "bg-emerald-50"
            }`}
          >
            <h6
              className={`font-medium ${
                isDark ? "text-emerald-400" : "text-emerald-700"
              }`}
              style={{ fontFamily }}
            >
              Sales Team Training
            </h6>
            <p className={`text-xs mt-1 ${textClasses}`} style={{ fontFamily }}>
              Complete team onboarding program
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModalContent;

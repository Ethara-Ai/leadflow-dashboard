import { fontFamily } from '../constants';
import useTheme from '../hooks/useTheme';

/**
 * ResourcesModalContent Component
 * Displays community resources and case studies with theme support.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.darkMode] - Override theme context (optional, for edge cases)
 */
const ResourcesModalContent = ({ darkMode: darkModeOverride }) => {
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
  const headingClasses = isDark ? 'text-slate-200' : 'text-slate-700';
  const textClasses = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardClasses = isDark ? 'bg-slate-700/30' : 'bg-slate-50';

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className={`text-lg font-bold ${headingClasses}`} style={{ fontFamily }}>
          Community Hub
        </h4>
        <div className="space-y-3">
          <div className={`p-4 rounded-xl ${cardClasses}`}>
            <h5 className={`font-semibold ${headingClasses}`} style={{ fontFamily }}>
              Global Sales Network
            </h5>
            <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
              Connect with sales professionals, business development experts, and marketing
              specialists worldwide. Share best practices and collaborate on lead generation
              strategies.
            </p>
          </div>
          <div className={`p-4 rounded-xl ${cardClasses}`}>
            <h5 className={`font-semibold ${headingClasses}`} style={{ fontFamily }}>
              Discussion Forums
            </h5>
            <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
              Active community discussions on sales techniques, lead nurturing strategies, CRM best
              practices, and conversion optimization.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className={`text-lg font-bold ${headingClasses}`} style={{ fontFamily }}>
          Case Studies
        </h4>
        <div className="space-y-3">
          <div
            className={`p-4 rounded-xl border-l-4 ${
              isDark ? 'bg-amber-900/20 border-amber-500' : 'bg-amber-50 border-amber-400'
            }`}
          >
            <h6
              className={`font-medium ${isDark ? 'text-amber-300' : 'text-amber-700'}`}
              style={{ fontFamily }}
            >
              TechCorp Enterprise Solutions
            </h6>
            <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
              How leading enterprises use LeadFlow for comprehensive pipeline management and
              achieved 40% increase in conversion rates.
            </p>
          </div>
          <div
            className={`p-4 rounded-xl border-l-4 ${
              isDark ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-400'
            }`}
          >
            <h6
              className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}
              style={{ fontFamily }}
            >
              StartupX Growth Story
            </h6>
            <p className={`text-sm mt-1 ${textClasses}`} style={{ fontFamily }}>
              Real-world applications in scaling sales operations, automating lead qualification,
              and building predictable revenue pipelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesModalContent;

import { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { fontFamily } from '../../constants/index.js';

/**
 * ChartErrorBoundary Component
 * A specialized error boundary for chart components that displays
 * a user-friendly fallback UI when a chart fails to render.
 *
 * This prevents chart-specific errors (often caused by malformed data
 * or recharts rendering issues) from crashing the entire application.
 *
 * @example
 * <ChartErrorBoundary chartName="Lead Activity">
 *   <ActivityChart data={data} />
 * </ChartErrorBoundary>
 */
class ChartErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging
    if (import.meta.env.DEV) {
      console.error(
        `ChartErrorBoundary caught an error in "${this.props.chartName || 'Chart'}":`,
        error,
        errorInfo
      );
    }

    // Track error count for retry limiting
    this.setState((prev) => ({
      errorCount: prev.errorCount + 1,
    }));

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.props.chartName);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const {
      children,
      chartName = 'Chart',
      height = '300px',
      showRetry = true,
      maxRetries = 3,
      fallback,
      isDark = false,
    } = this.props;

    const { hasError, error, errorCount } = this.state;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return typeof fallback === 'function'
          ? fallback({ error, retry: this.handleRetry, chartName })
          : fallback;
      }

      const canRetry = showRetry && errorCount < maxRetries;

      // Theme-based styling
      const containerClasses = isDark
        ? 'bg-slate-800/80 border-slate-600/50'
        : 'bg-white/90 border-slate-200/60';
      const iconBgClasses = isDark ? 'bg-red-900/30' : 'bg-red-100';
      const iconClasses = isDark ? 'text-red-400' : 'text-red-500';
      const titleClasses = isDark ? 'text-slate-200' : 'text-slate-700';
      const textClasses = isDark ? 'text-slate-400' : 'text-slate-600';
      const buttonClasses = isDark
        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-700';

      return (
        <div
          className={`${containerClasses} backdrop-blur-lg rounded-2xl border p-6 flex flex-col items-center justify-center`}
          style={{ minHeight: height }}
          role="alert"
          aria-live="polite"
        >
          <div
            className={`w-12 h-12 ${iconBgClasses} rounded-full flex items-center justify-center mb-4`}
          >
            <AlertTriangle className={`w-6 h-6 ${iconClasses}`} />
          </div>

          <h3 className={`text-lg font-bold ${titleClasses} mb-2`} style={{ fontFamily }}>
            {chartName} Error
          </h3>

          <p className={`text-sm ${textClasses} text-center mb-4 max-w-xs`} style={{ fontFamily }}>
            Unable to render this chart. This may be due to invalid data or a temporary issue.
          </p>

          {import.meta.env.DEV && error && (
            <details className="mb-4 w-full max-w-sm">
              <summary
                className={`cursor-pointer text-xs ${textClasses} hover:underline`}
                style={{ fontFamily }}
              >
                Technical details
              </summary>
              <pre
                className={`mt-2 p-2 ${isDark ? 'bg-slate-900' : 'bg-slate-100'} rounded text-xs ${iconClasses} overflow-auto max-h-20`}
              >
                {error.toString()}
              </pre>
            </details>
          )}

          {canRetry && (
            <button
              onClick={this.handleRetry}
              className={`${buttonClasses} px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2`}
              style={{ fontFamily }}
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again {errorCount > 0 && `(${maxRetries - errorCount} left)`}
            </button>
          )}

          {!canRetry && errorCount >= maxRetries && (
            <p className={`text-xs ${textClasses}`} style={{ fontFamily }}>
              Maximum retries reached. Please refresh the page.
            </p>
          )}
        </div>
      );
    }

    return children;
  }
}

ChartErrorBoundary.propTypes = {
  /** Child components (the chart to render) */
  children: PropTypes.node.isRequired,
  /** Name of the chart for display in error messages */
  chartName: PropTypes.string,
  /** Minimum height for the error fallback container */
  height: PropTypes.string,
  /** Whether to show the retry button */
  showRetry: PropTypes.bool,
  /** Maximum number of retries before disabling the button */
  maxRetries: PropTypes.number,
  /** Custom fallback component or render function */
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  /** Whether dark mode is active */
  isDark: PropTypes.bool,
  /** Callback when an error is caught */
  onError: PropTypes.func,
};

export default ChartErrorBoundary;

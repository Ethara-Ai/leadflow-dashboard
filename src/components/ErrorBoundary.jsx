import { Component } from "react";
import PropTypes from "prop-types";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { fontFamily } from "../constants";

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @example
 * <ErrorBoundary fallback={<CustomError />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, send to error reporting service)
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional onReset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, FallbackComponent, showDetails = false } = this.props;

    if (hasError) {
      // Custom fallback component takes priority
      if (FallbackComponent) {
        return <FallbackComponent error={error} resetErrorBoundary={this.handleReset} />;
      }

      // Custom fallback element
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-64 flex items-center justify-center p-6" role="alert" aria-live="assertive">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2" style={{ fontFamily }}>
              Something went wrong
            </h2>

            <p className="text-slate-600 mb-6" style={{ fontFamily }}>
              An error occurred while rendering this component. Please try refreshing the page.
            </p>

            {showDetails && error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700" style={{ fontFamily }}>
                  Error details
                </summary>
                <pre className="mt-2 p-3 bg-slate-100 rounded-lg text-xs text-red-600 overflow-auto max-h-32">
                  {error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
                style={{ fontFamily }}
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
                style={{ fontFamily }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  /** Child components to render */
  children: PropTypes.node.isRequired,
  /** Custom fallback element to render on error */
  fallback: PropTypes.node,
  /** Custom fallback component to render on error (receives error and resetErrorBoundary props) */
  FallbackComponent: PropTypes.elementType,
  /** Whether to show error details (useful in development) */
  showDetails: PropTypes.bool,
  /** Callback function called when an error is caught */
  onError: PropTypes.func,
  /** Callback function called when the error boundary is reset */
  onReset: PropTypes.func,
};

export default ErrorBoundary;

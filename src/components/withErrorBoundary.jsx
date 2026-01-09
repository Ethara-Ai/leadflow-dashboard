import ErrorBoundary from './ErrorBoundary';

/**
 * Higher-order component to wrap any component with an ErrorBoundary
 * @param {React.ComponentType} WrappedComponent - Component to wrap
 * @param {Object} errorBoundaryProps - Props to pass to ErrorBoundary
 * @returns {React.ComponentType} Wrapped component with error boundary
 */
const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundary = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithErrorBoundary;
};

export default withErrorBoundary;

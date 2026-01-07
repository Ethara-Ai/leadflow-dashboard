import useTheme from "./useTheme";

/**
 * Higher-order component to inject theme props into class components
 * @param {React.ComponentType} Component - Component to wrap
 * @returns {React.ComponentType} Wrapped component with theme props
 */
const withTheme = (Component) => {
  const WrappedComponent = (props) => {
    const theme = useTheme();
    return <Component {...props} {...theme} />;
  };

  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
};

export default withTheme;

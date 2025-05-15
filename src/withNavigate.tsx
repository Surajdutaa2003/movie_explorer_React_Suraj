import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

// Define the props type for the wrapped component
interface WithNavigateProps {
  navigate: NavigateFunction;
}

// Higher-Order Component to inject navigate function
export const withNavigate = <P extends object>(
  Component: React.ComponentType<P & WithNavigateProps>
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
  return WrappedComponent;
};
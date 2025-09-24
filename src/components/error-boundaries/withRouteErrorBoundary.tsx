import React from "react";
import { RouteErrorBoundary, type RouteErrorBoundaryProps } from "./RouteErrorBoundary";

/**
 * HOC, apvyniojantis route komponentą su `RouteErrorBoundary`.
 */
export function withRouteErrorBoundary<P extends object>(
  routePath: string,
  routeName?: string,
  options: Partial<RouteErrorBoundaryProps> = {}
) {
  return function (WrappedComponent: React.ComponentType<P>): React.ComponentType<P> {
    const ComponentWithRouteErrorBoundary = (props: P) => (
      <RouteErrorBoundary
        routePath={routePath}
        routeName={routeName || WrappedComponent.displayName || WrappedComponent.name}
        {...options}
      >
        <WrappedComponent {...props} />
      </RouteErrorBoundary>
    );

    ComponentWithRouteErrorBoundary.displayName = `withRouteErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

    return ComponentWithRouteErrorBoundary;
  };
}

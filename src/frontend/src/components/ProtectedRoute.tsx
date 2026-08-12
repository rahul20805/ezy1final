import { Navigate } from "@tanstack/react-router";
import { useIsAuthenticated, useUserRole } from "../lib/auth";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const role = useUserRole();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  if (requiredRole && role !== requiredRole) {
    if (requiredRole === "vendor" && role === "service_partner") {
      // Allow service_partner in vendor routes for now (they share the partner portal)
      return <>{children}</>;
    }
    
    // Also allow customer to access user routes
    if (requiredRole === "user" && role === "customer") {
      return <>{children}</>;
    }

    if (requiredRole === "vendor") {
      return <Navigate to="/partner-login" />;
    }
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
}

export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="user" redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}

export function VendorRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="vendor" redirectTo="/partner-login">
      {children}
    </ProtectedRoute>
  );
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}

export default ProtectedRoute;

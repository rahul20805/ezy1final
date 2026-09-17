import { useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { useIsAuthenticated, useUserRole } from "../lib/auth";
import { usePartnerAuth, getPartnerToken } from "../lib/partnerAuthStore";
import { hasProviderAccess } from "../lib/permissions";
import { AccessRestrictedPage } from "../pages/AccessRestrictedPage";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({
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
      return <>{children}</>;
    }
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

// Strict Partner Route (Verifies partner authentication token)
export function PartnerRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentPartner, fetchMe } = usePartnerAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getPartnerToken();
    if (token && !currentPartner) {
      fetchMe().finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-medium">Verifying partner credentials...</p>
        </div>
      </div>
    );
  }

  const token = getPartnerToken();
  if (!isAuthenticated || !token || !currentPartner) {
    return <Navigate to="/partner-login" />;
  }

  return <>{children}</>;
}

export function VendorRoute({ children }: { children: React.ReactNode }) {
  return <ProviderRoute allowedTypes={["GROCERY", "VENDOR"]}>{children}</ProviderRoute>;
}

export function HospitalRoute({ children }: { children: React.ReactNode }) {
  return <ProviderRoute allowedTypes={["HOSPITAL"]}>{children}</ProviderRoute>;
}

export function PharmacyRoute({ children }: { children: React.ReactNode }) {
  return <ProviderRoute allowedTypes={["PHARMACY"]}>{children}</ProviderRoute>;
}

export function DeliveryRoute({ children }: { children: React.ReactNode }) {
  return <ProviderRoute allowedTypes={["DELIVERY", "DRIVER"]}>{children}</ProviderRoute>;
}

export function ServiceProviderRoute({ children }: { children: React.ReactNode }) {
  return <ProviderRoute allowedTypes={["SERVICE_PROVIDER"]}>{children}</ProviderRoute>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProviderRoute allowedTypes={["ADMIN"]}>{children}</ProviderRoute>;
}

export function ProviderRoute({
  children,
  allowedTypes,
}: {
  children: React.ReactNode;
  allowedTypes: string[];
}) {
  const { isAuthenticated, currentPartner, fetchMe } = usePartnerAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getPartnerToken();
    if (token && !currentPartner) {
      fetchMe().finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-medium">Verifying authorization permissions...</p>
        </div>
      </div>
    );
  }

  const token = getPartnerToken();
  if (!isAuthenticated || !token || !currentPartner) {
    return <Navigate to="/partner-login" />;
  }

  // Check if partner is authorized for this provider module
  const isAuthorized = hasProviderAccess(currentPartner, allowedTypes);
  if (!isAuthorized) {
    return <AccessRestrictedPage requiredProviderTypes={allowedTypes} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

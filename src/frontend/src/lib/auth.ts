import { useAuth } from "./AuthContext";
import type { UserRole } from "../types";

const ROLE_STORAGE_KEY = "ezy1_user_role";

export function getCurrentRole(): UserRole {
  const stored = localStorage.getItem(ROLE_STORAGE_KEY);
  if (
    stored === "vendor" ||
    stored === "service_partner" ||
    stored === "admin" ||
    stored === "user" ||
    stored === "customer" ||
    stored === "guest"
  ) {
    return stored as UserRole;
  }
  return "guest";
}

export function setCurrentRole(role: UserRole): void {
  localStorage.setItem(ROLE_STORAGE_KEY, role);
}

export function clearRole(): void {
  localStorage.removeItem(ROLE_STORAGE_KEY);
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useUserRole(): UserRole {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) return "guest";
  return getCurrentRole();
}

export function useCurrentUser() {
  const { identity, isAuthenticated, login, logout } = useAuth();
  const role = useUserRole();

  return {
    identity,
    isAuthenticated,
    role,
    login,
    logout,
    principalText: identity?.getPrincipal().toText() ?? null,
  };
}

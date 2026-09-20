import type { Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  type UserProfile,
  getAuthToken,
  getStoredUser,
  setAuthToken,
  setStoredUser,
  clearAuthSession,
  requestOtp as apiRequestOtp,
  verifyOtpCode as apiVerifyOtpCode,
  loginWithGoogle as apiLoginWithGoogle,
  loginWithPassword,
  registerAccount,
  fetchCurrentUser,
  logoutCustomer,
} from "./api";
import { setCurrentRole, clearRole } from "./auth";
import { useNotificationStore } from "./notificationStore";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  identity: Identity | null;
  signInWithPassword: (username: string, password: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  signUp: (payload: { name: string; username: string; password: string; confirmPassword?: string; phone?: string; email?: string }) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; message?: string; debugOtp?: string }>;
  verifyPhoneOtp: (phone: string, otp: string, name?: string) => Promise<{ success: boolean; user?: UserProfile }>;
  signInWithGoogle: (payload: { email?: string; name?: string; googleId?: string; avatar?: string; phone?: string }) => Promise<{ success: boolean; user?: UserProfile }>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  const { initSseConnection, closeSseConnection } = useNotificationStore();

  useEffect(() => {
    async function init() {
      // 1. Check custom JWT token session
      const storedToken = getAuthToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        setCurrentRole((storedUser.role?.toLowerCase() as any) || "customer");
        initSseConnection();

        // Background profile refresh
        fetchCurrentUser()
          .then((res) => {
            if (res.user) {
              setUser(res.user);
              setStoredUser(res.user);
            }
          })
          .catch(() => {
            // Token may have expired
          });
      }

      // 2. Initialize Internet Identity client if present
      try {
        const client = await AuthClient.create();
        setAuthClient(client);

        if (await client.isAuthenticated()) {
          setIsAuthenticated(true);
          setIdentity(client.getIdentity());
        }
      } catch (e) {
        // Continue if II is not active in local environment
      }
    }

    init();

    return () => {
      closeSseConnection();
    };
  }, []);

  const signInWithPassword = async (username: string, password: string) => {
    try {
      const res = await loginWithPassword(username, password);
      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setIsAuthenticated(true);
        setCurrentRole((res.user.role?.toLowerCase() as any) || "customer");
        initSseConnection();
        return { success: true, user: res.user };
      }
      return { success: false, error: res.message || "Failed to sign in" };
    } catch (err: any) {
      return { success: false, error: err.message || "Invalid credentials" };
    }
  };

  const signUp = async (payload: {
    name: string;
    username: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
    email?: string;
  }) => {
    try {
      const res = await registerAccount(payload);
      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setIsAuthenticated(true);
        setCurrentRole((res.user.role?.toLowerCase() as any) || "customer");
        initSseConnection();
        return { success: true, user: res.user };
      }
      return { success: false, error: res.message || "Registration failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to create account" };
    }
  };

  const sendPhoneOtp = async (phone: string) => {
    const res = await apiRequestOtp(phone);
    return res;
  };

  const verifyPhoneOtp = async (phone: string, otp: string, name?: string) => {
    const res = await apiVerifyOtpCode(phone, otp, name);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      setCurrentRole((res.user.role?.toLowerCase() as any) || "customer");
      initSseConnection();
      return { success: true, user: res.user };
    }
    return { success: false };
  };

  const signInWithGoogle = async (payload: {
    email?: string;
    name?: string;
    googleId?: string;
    avatar?: string;
    phone?: string;
  }) => {
    const res = await apiLoginWithGoogle(payload);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      setCurrentRole((res.user.role?.toLowerCase() as any) || "customer");
      initSseConnection();
      return { success: true, user: res.user };
    }
    return { success: false };
  };

  // Navigate directly to standard phone OTP login
  const login = async () => {
    window.location.href = "/login";
  };

  const logout = async () => {
    try {
      await logoutCustomer();
    } catch {}
    if (authClient) {
      await authClient.logout();
    }
    clearAuthSession();
    clearRole();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setIdentity(null);
    closeSseConnection();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        identity,
        signInWithPassword,
        signUp,
        sendPhoneOtp,
        verifyPhoneOtp,
        signInWithGoogle,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a safe no-op context instead of crashing the whole app
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      identity: null,
      signInWithPassword: async () => ({ success: false, error: "Not in AuthProvider" }),
      signUp: async () => ({ success: false, error: "Not in AuthProvider" }),
      sendPhoneOtp: async () => ({ success: false, message: "Not in AuthProvider" }),
      verifyPhoneOtp: async () => ({ success: false }),
      signInWithGoogle: async () => ({ success: false }),
      login: async () => { window.location.href = "/login"; },
      logout: async () => {},
    } as AuthContextType;
  }
  return context;
}

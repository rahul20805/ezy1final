import type { Identity } from "@dfinity/agent";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  type UserProfile,
  loginWithGoogle as apiLoginWithGoogle,
  requestOtp as apiRequestOtp,
  verifyOtpCode as apiVerifyOtpCode,
  requestEmailOtp as apiRequestEmailOtp,
  verifyEmailOtpCode as apiVerifyEmailOtpCode,
  forgotPasswordRequest as apiForgotPasswordRequest,
  verifyResetOtpCode as apiVerifyResetOtpCode,
  resetPasswordSubmit as apiResetPasswordSubmit,
  clearAuthSession,
  fetchCurrentUser,
  getAuthToken,
  getStoredUser,
  loginWithPassword,
  logoutCustomer,
  registerAccount,
  setAuthToken,
  setStoredUser,
} from "./api";
import { clearRole, setCurrentRole } from "./auth";
import { useNotificationStore } from "./notificationStore";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  identity: Identity | null;
  signInWithPassword: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  signUp: (payload: {
    name: string;
    username: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
    email?: string;
  }) => Promise<{ success: boolean; user?: UserProfile; error?: string; message?: string }>;
  sendPhoneOtp: (
    phone: string,
  ) => Promise<{ success: boolean; message?: string; debugOtp?: string }>;
  verifyPhoneOtp: (
    phone: string,
    otp: string,
    name?: string,
  ) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  sendEmailOtp: (
    email: string,
    purpose?: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
    name?: string,
  ) => Promise<{ success: boolean; message?: string }>;
  verifyEmailOtp: (
    email: string,
    otp: string,
  ) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; message?: string }>;
  verifyResetOtp: (
    email: string,
    otp: string,
  ) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string,
  ) => Promise<{ success: boolean; message?: string }>;
  signInWithGoogle: (payload: {
    email?: string;
    name?: string;
    googleId?: string;
    avatar?: string;
    phone?: string;
  }) => Promise<{ success: boolean; user?: UserProfile }>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [identity] = useState<Identity | null>(null);

  const { initSseConnection, closeSseConnection } = useNotificationStore();

  useEffect(() => {
    async function init() {
      try {
        // Restore JWT session from localStorage
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
              // Token may have expired — that's fine, user stays logged in locally
            });
        }
      } catch (e) {
        // Auth init failure — continue as guest
        console.warn("[AuthProvider] Init error:", e);
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
        return { success: true, user: res.user, message: res.message };
      }
      return { success: false, error: res.message || "Registration failed" };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to create account",
      };
    }
  };

  const sendPhoneOtp = async (phone: string) => {
    const res = await apiRequestOtp(phone);
    return res;
  };

  const verifyPhoneOtp = async (phone: string, otp: string, name?: string) => {
    try {
      const res = await apiVerifyOtpCode(phone, otp, name);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setIsAuthenticated(true);
        setCurrentRole((res.user.role?.toLowerCase() as any) || "customer");
        initSseConnection();
        return { success: true, user: res.user };
      }
      return { success: false, error: res.message || "Verification failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Verification failed" };
    }
  };

  const sendEmailOtp = async (
    email: string,
    purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET" = "EMAIL_VERIFICATION",
    name?: string,
  ) => {
    const res = await apiRequestEmailOtp(email, purpose, name);
    return res;
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    try {
      const res = await apiVerifyEmailOtpCode(email, otp);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setIsAuthenticated(true);
        setCurrentRole((res.user.role?.toLowerCase() as any) || "customer");
        initSseConnection();
        return { success: true, user: res.user };
      }
      return { success: false, error: res.message || "Email verification failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Email verification failed" };
    }
  };

  const forgotPassword = async (email: string) => {
    return apiForgotPasswordRequest(email);
  };

  const verifyResetOtp = async (email: string, otp: string) => {
    return apiVerifyResetOtpCode(email, otp);
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    return apiResetPasswordSubmit(email, otp, newPassword);
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

  // Navigate directly to standard login
  const login = async () => {
    window.location.href = "/login";
  };

  const logout = async () => {
    try {
      await logoutCustomer();
    } catch {}
    clearAuthSession();
    clearRole();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
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
        sendEmailOtp,
        verifyEmailOtp,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
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
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      identity: null,
      signInWithPassword: async () => ({
        success: false,
        error: "Not in AuthProvider",
      }),
      signUp: async () => ({ success: false, error: "Not in AuthProvider" }),
      sendPhoneOtp: async () => ({
        success: false,
        message: "Not in AuthProvider",
      }),
      verifyPhoneOtp: async () => ({ success: false }),
      sendEmailOtp: async () => ({ success: false }),
      verifyEmailOtp: async () => ({ success: false }),
      forgotPassword: async () => ({ success: false, message: "" }),
      verifyResetOtp: async () => ({ success: false, message: "" }),
      resetPassword: async () => ({ success: false, message: "" }),
      signInWithGoogle: async () => ({ success: false }),
      login: async () => {
        window.location.href = "/login";
      },
      logout: async () => {},
    } as AuthContextType;
  }
  return context;
}

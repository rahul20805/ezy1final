import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  RefreshCw,
  Shield,
  Smartphone,
  Sparkles,
  User,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { Ezy1Logo } from "../components/Ezy1Logo";
import Layout from "../components/Layout";
import { getAdminPortalUrl, getPartnerPortalUrl } from "../config/links";
import { useAuth } from "../lib/AuthContext";
import { checkUsernameAvailability } from "../lib/api";
import { useTranslation } from "../lib/i18n/useTranslation";

export default function LoginPage() {
  const { t } = useTranslation();
  const {
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
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();

  // Auth Modes: "SIGNIN" | "SIGNUP" | "OTP" | "FORGOT_PASSWORD" | "EMAIL_VERIFY"
  const [mode, setMode] = useState<"SIGNIN" | "SIGNUP" | "OTP" | "FORGOT_PASSWORD" | "EMAIL_VERIFY">("SIGNIN");

  // Sign In State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up State
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message?: string;
  }>({ checking: false });

  // Email Verification State (After Sign Up)
  const [verifyEmail, setVerifyEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [emailCooldown, setEmailCooldown] = useState(0);

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<"EMAIL" | "OTP" | "NEW_PASSWORD">("EMAIL");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [forgotCooldown, setForgotCooldown] = useState(0);

  // Phone OTP Fallback State
  const [otpStep, setOtpStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [otpName, setOtpName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);

  // Global Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Google Modal State
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      const redirectTarget = params.get("redirect") || "/";
      navigate({ to: redirectTarget as any });
    }
  }, [isAuthenticated, navigate]);

  // Resend Countdown Timers
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  useEffect(() => {
    if (emailCooldown <= 0) return;
    const interval = setInterval(() => setEmailCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [emailCooldown]);

  useEffect(() => {
    if (forgotCooldown <= 0) return;
    const interval = setInterval(() => setForgotCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [forgotCooldown]);

  // Live username availability check
  useEffect(() => {
    const cleanU = regUsername.trim().toLowerCase();
    if (cleanU.length < 3) {
      setUsernameStatus({ checking: false });
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,25}$/.test(cleanU)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "Use 3-25 letters, numbers, or _",
      });
      return;
    }

    setUsernameStatus({ checking: true });
    const timer = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailability(cleanU);
        setUsernameStatus({
          checking: false,
          available: res.available,
          message: res.message,
        });
      } catch {
        setUsernameStatus({ checking: false });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [regUsername]);

  // 1. Handle Sign In (Returning User)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim()) {
      toast.error("Please enter your Username, Email, or Mobile number");
      return;
    }
    if (!loginPassword) {
      toast.error("Please enter your Password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signInWithPassword(loginUsername.trim(), loginPassword);
      if (res.success) {
        toast.success(`Welcome back, ${res.user?.name || loginUsername}! 👋`);
        navigate({ to: "/" });
      } else {
        toast.error(res.error || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Sign Up (First Time User)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    const cleanUsername = regUsername.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (usernameStatus.available === false) {
      toast.error(usernameStatus.message || "Please choose an available username");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUp({
        name: regName.trim(),
        username: cleanUsername,
        password: regPassword,
        confirmPassword: regConfirmPassword,
        phone: regPhone.trim(),
        email: regEmail.trim(),
      });

      if (res.success) {
        if (regEmail.trim()) {
          setVerifyEmail(regEmail.trim());
          setEmailCooldown(30);
          setEmailOtp(["", "", "", "", "", ""]);
          setMode("EMAIL_VERIFY");
          toast.success("Account created! Enter the verification code sent to your email.");
        } else {
          toast.success(`Account created! Welcome to Ezy1, ${res.user?.name}! 🎉`);
          navigate({ to: "/" });
        }
      } else {
        toast.error(res.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Email OTP Verification
  const handleVerifyEmailOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = emailOtp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyEmailOtp(verifyEmail, fullOtp);
      if (res.success) {
        toast.success(`Email verified! Welcome to Ezy1, ${res.user?.name || "Customer"}! 🎉`);
        navigate({ to: "/" });
      } else {
        toast.error(res.error || "Verification failed. Please check the code.");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmailOtp = async () => {
    if (!verifyEmail) return;
    setIsLoading(true);
    try {
      const res = await sendEmailOtp(verifyEmail, "EMAIL_VERIFICATION", regName);
      if (res.success) {
        toast.success("New verification code sent to your email!");
        setEmailCooldown(30);
        setEmailOtp(["", "", "", "", "", ""]);
      } else {
        toast.error(res.message || "Failed to resend code");
      }
    } catch (err: any) {
      toast.error(err.message || "Error resending code");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Forgot Password Flow
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes("@")) {
      toast.error("Please enter a valid registered email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(forgotEmail.trim());
      toast.success(res.message || "Password recovery code sent!");
      setForgotStep("OTP");
      setForgotCooldown(30);
      setForgotOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      toast.error(err.message || "Failed to process recovery request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = forgotOtp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the 6-digit recovery code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyResetOtp(forgotEmail.trim(), fullOtp);
      if (res.success) {
        toast.success("Recovery code verified! Enter your new password.");
        setForgotStep("NEW_PASSWORD");
      } else {
        toast.error(res.message || "Invalid recovery code");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid or expired recovery code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const fullOtp = forgotOtp.join("");
      const res = await resetPassword(forgotEmail.trim(), fullOtp, newPassword);
      if (res.success) {
        toast.success("Password reset successfully! Please sign in with your new password.");
        setMode("SIGNIN");
        setLoginUsername(forgotEmail.trim());
        setLoginPassword("");
        setForgotStep("EMAIL");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Handle Phone OTP Fallback
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendPhoneOtp(cleanPhone);
      toast.success(res.message || "OTP code generated!");
      setPhone(cleanPhone);
      setOtpStep("OTP");
      setCooldown(30);
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyPhoneOtp(phone, fullOtp, otpName);
      if (res.success) {
        toast.success(`Welcome back, ${res.user?.name || "Customer"}! 🎉`);
        navigate({ to: "/" });
      } else {
        toast.error(res.error || "Verification failed. Please check the code.");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP code");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for 6-box OTP input
  const handleOtpBoxChange = (
    index: number,
    value: string,
    currentOtp: string[],
    setOtpFn: (val: string[]) => void,
    prefixId: string,
  ) => {
    if (value.length > 1) {
      const pasted = value.replace(/[^0-9]/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newArr = [...currentOtp];
        for (let i = 0; i < pasted.length; i++) {
          newArr[i] = pasted[i];
        }
        setOtpFn(newArr);
        const nextIdx = Math.min(pasted.length, 5);
        document.getElementById(`${prefixId}-${nextIdx}`)?.focus();
        return;
      }
    }

    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const newArr = [...currentOtp];
    newArr[index] = digit;
    setOtpFn(newArr);

    if (digit && index < 5) {
      document.getElementById(`${prefixId}-${index + 1}`)?.focus();
    }
  };

  const handleOtpBoxKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    currentOtp: string[],
    prefixId: string,
  ) => {
    if (e.key === "Backspace" && !currentOtp[index] && index > 0) {
      document.getElementById(`${prefixId}-${index - 1}`)?.focus();
    }
  };

  // Google Sign-In Simulation
  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes("@")) {
      toast.error("Please enter a valid Google email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signInWithGoogle({
        email: googleEmail,
        name: googleName || googleEmail.split("@")[0],
        googleId: "google_" + btoa(googleEmail).substring(0, 12),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${googleEmail}`,
      });

      if (res.success) {
        setGoogleModalOpen(false);
        toast.success(`Signed in as ${res.user?.name || googleEmail}! 🚀`);
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-background via-muted/20 to-background flex items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-md space-y-5">
          {/* Header Brand */}
          <div className="text-center space-y-2 flex flex-col items-center">
            <Ezy1Logo size="xl" asLink={false} />
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xs px-2">
              Instant Groceries, Healthcare, Bus Tracking & On-Demand Services
            </p>
          </div>

          {/* Clean Tab Switcher (When not in Forgot Password or Email Verify) */}
          {mode !== "FORGOT_PASSWORD" && mode !== "EMAIL_VERIFY" && (
            <div className="flex bg-muted p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setMode("SIGNIN")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                  mode === "SIGNIN"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                {t("auth.login")}
              </button>
              <button
                type="button"
                onClick={() => setMode("SIGNUP")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                  mode === "SIGNUP"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                {t("auth.signup")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("OTP");
                  setOtpStep("PHONE");
                }}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                  mode === "OTP"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                {t("auth.sendOtp")}
              </button>
            </div>
          )}

          <Card className="shadow-elevated border-border overflow-hidden bg-card/95 backdrop-blur-xs">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 w-full" />
            <CardContent className="p-4 sm:p-6 space-y-4">

              {/* MODE 1: RETURNING USER - SIGN IN */}
              {mode === "SIGNIN" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Username / Email / Mobile Number
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. user@example.com or rahul_yadav"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="h-11 text-base font-medium"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                        {t("auth.password")}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("FORGOT_PASSWORD");
                          setForgotStep("EMAIL");
                          setForgotEmail(loginUsername.includes("@") ? loginUsername : "");
                        }}
                        className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder={t("auth.passwordPlaceholder")}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-11 text-base font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold text-sm shadow-sm cursor-pointer"
                    disabled={isLoading || !loginUsername.trim() || !loginPassword}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {t("common.loading")}
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        {t("auth.login")}
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </Button>

                  <p className="text-[11px] text-muted-foreground text-center px-1 pt-1 leading-relaxed">
                    By signing in, you agree to EZY1&apos;s{" "}
                    <a
                      href="/legal/ezy1-user-terms-and-conditions.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline font-medium inline-flex items-center gap-0.5"
                    >
                      User Terms <span className="text-[9px]">↗</span>
                    </a>{" "}
                    &amp;{" "}
                    <a
                      href="/legal/ezy1-universal-privacy-policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline font-medium inline-flex items-center gap-0.5"
                    >
                      Privacy Policy <span className="text-[9px]">↗</span>
                    </a>.
                  </p>

                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      Don't have an account yet?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("SIGNUP")}
                        className="font-semibold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Create an Account
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* MODE 2: FIRST-TIME USER - SIGN UP */}
              {mode === "SIGNUP" && (
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Rahul Yadav"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="h-10 text-sm font-medium"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Create Username *
                      </label>
                      {usernameStatus.checking && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Checking...
                        </span>
                      )}
                      {!usernameStatus.checking && usernameStatus.available === true && (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Available
                        </span>
                      )}
                      {!usernameStatus.checking && usernameStatus.available === false && (
                        <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {usernameStatus.message || "Taken"}
                        </span>
                      )}
                    </div>
                    <Input
                      type="text"
                      placeholder="e.g. rahul_yadav"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toLowerCase())}
                      className={`h-10 text-sm font-medium ${
                        usernameStatus.available === true
                          ? "border-emerald-500 focus-visible:ring-emerald-500/20"
                          : usernameStatus.available === false
                            ? "border-rose-500 focus-visible:ring-rose-500/20"
                            : ""
                      }`}
                      required
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Only letters, numbers, and underscores (3-25 chars)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="h-10 text-sm font-medium"
                      required
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Verification code will be sent to this email
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Mobile Number (Optional)
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center px-2.5 py-1 bg-muted rounded-lg border border-border text-xs font-semibold text-foreground shrink-0">
                        🇮🇳 +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="10-digit number"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="h-10 text-sm font-medium"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Password *
                      </label>
                      <div className="relative">
                        <Input
                          type={showRegPassword ? "text" : "password"}
                          placeholder="Min 6 chars"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="h-10 text-sm font-medium pr-9"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                          tabIndex={-1}
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Input
                          type={showRegConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="h-10 text-sm font-medium pr-9"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                          tabIndex={-1}
                        >
                          {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold text-sm shadow-sm mt-2 cursor-pointer"
                    disabled={
                      isLoading ||
                      !regName.trim() ||
                      regUsername.trim().length < 3 ||
                      usernameStatus.available === false ||
                      regPassword.length < 6 ||
                      regPassword !== regConfirmPassword
                    }
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Create Account & Verify
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-1">
                    <p className="text-xs text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("SIGNIN")}
                        className="font-semibold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Sign In here
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* MODE 3: EMAIL VERIFICATION (AFTER SIGNUP) */}
              {mode === "EMAIL_VERIFY" && (
                <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMode("SIGNUP")}
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Back to Sign Up
                    </button>
                    <span className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">
                      {verifyEmail}
                    </span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="inline-flex p-2.5 rounded-full bg-emerald-500/10 text-emerald-600 mb-1">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Verify Your Email Address</h3>
                    <p className="text-xs text-muted-foreground">
                      We sent a 6-digit verification code to <strong>{verifyEmail}</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between gap-1.5 sm:gap-2">
                      {emailOtp.map((digit, index) => (
                        <input
                          key={index}
                          id={`email-otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpBoxChange(index, e.target.value, emailOtp, setEmailOtp, "email-otp")
                          }
                          onKeyDown={(e) => handleOtpBoxKeyDown(index, e, emailOtp, "email-otp")}
                          className="w-11 h-12 text-center text-xl font-bold rounded-lg border border-border bg-background focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-emerald-600 text-white hover:bg-emerald-700 gap-2 font-semibold text-sm shadow-sm cursor-pointer"
                    disabled={isLoading || emailOtp.join("").length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Verify & Complete Signup
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-2">
                    {emailCooldown > 0 ? (
                      <span className="text-xs text-muted-foreground">
                        Resend code in {emailCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendEmailOtp}
                        className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                      >
                        Resend Verification Code
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* MODE 4: FORGOT PASSWORD RECOVERY */}
              {mode === "FORGOT_PASSWORD" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMode("SIGNIN")}
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Back to Sign In
                    </button>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Password Recovery
                    </span>
                  </div>

                  {forgotStep === "EMAIL" && (
                    <form onSubmit={handleForgotSendOtp} className="space-y-4">
                      <div className="text-center space-y-1">
                        <div className="inline-flex p-2.5 rounded-full bg-amber-500/10 text-amber-600 mb-1">
                          <KeyRound className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">Forgot Your Password?</h3>
                        <p className="text-xs text-muted-foreground">
                          Enter your registered email address to receive a secure recovery code.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Registered Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="e.g. user@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="h-11 text-base font-medium"
                          autoFocus
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold text-sm shadow-sm cursor-pointer"
                        disabled={isLoading || !forgotEmail.trim() || !forgotEmail.includes("@")}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Sending Recovery Code...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4" />
                            Send Recovery Code
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  {forgotStep === "OTP" && (
                    <form onSubmit={handleForgotVerifyOtp} className="space-y-4">
                      <div className="text-center space-y-1">
                        <h3 className="text-base font-bold text-foreground">Enter Recovery Code</h3>
                        <p className="text-xs text-muted-foreground">
                          A 6-digit code has been sent to <strong>{forgotEmail}</strong>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between gap-1.5 sm:gap-2">
                          {forgotOtp.map((digit, index) => (
                            <input
                              key={index}
                              id={`forgot-otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleOtpBoxChange(index, e.target.value, forgotOtp, setForgotOtp, "forgot-otp")
                              }
                              onKeyDown={(e) => handleOtpBoxKeyDown(index, e, forgotOtp, "forgot-otp")}
                              className="w-11 h-12 text-center text-xl font-bold rounded-lg border border-border bg-background focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                              autoFocus={index === 0}
                            />
                          ))}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-600 text-white hover:bg-emerald-700 gap-2 font-semibold text-sm shadow-sm cursor-pointer"
                        disabled={isLoading || forgotOtp.join("").length !== 6}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Verify Code
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </>
                        )}
                      </Button>

                      <div className="text-center pt-1">
                        {forgotCooldown > 0 ? (
                          <span className="text-xs text-muted-foreground">
                            Resend code in {forgotCooldown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleForgotSendOtp}
                            className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {forgotStep === "NEW_PASSWORD" && (
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                      <div className="text-center space-y-1">
                        <h3 className="text-base font-bold text-foreground">Set New Password</h3>
                        <p className="text-xs text-muted-foreground">
                          Choose a strong password for your EZY1 account.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          New Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="At least 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-10 text-sm font-medium pr-9"
                            required
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                            tabIndex={-1}
                          >
                            {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showConfirmNewPassword ? "text" : "password"}
                            placeholder="Re-enter new password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="h-10 text-sm font-medium pr-9"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                            tabIndex={-1}
                          >
                            {showConfirmNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold text-sm shadow-sm mt-2 cursor-pointer"
                        disabled={isLoading || newPassword.length < 6 || newPassword !== confirmNewPassword}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Updating Password...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Update Password & Sign In
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {/* MODE 5: PHONE OTP FALLBACK */}
              {mode === "OTP" && (
                <div>
                  {otpStep === "PHONE" ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Mobile Phone Number
                        </label>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center px-3 py-2 bg-muted rounded-lg border border-border text-sm font-semibold text-foreground shrink-0">
                            🇮🇳 +91
                          </div>
                          <Input
                            type="tel"
                            placeholder="Enter 10-digit number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-11 text-base font-medium tracking-wide"
                            maxLength={10}
                            autoFocus
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Your Name{" "}
                          <span className="text-muted-foreground/60 font-normal">
                            (Optional for new customers)
                          </span>
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={otpName}
                          onChange={(e) => setOtpName(e.target.value)}
                          className="h-10 text-sm"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-600 text-white hover:bg-emerald-700 gap-2 font-semibold text-sm shadow-sm cursor-pointer"
                        disabled={
                          isLoading || phone.replace(/[^0-9]/g, "").length < 10
                        }
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Sending Security Code...
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-4 h-4" />
                            Get Verification Code (OTP)
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setOtpStep("PHONE")}
                          className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Change number
                        </button>
                        <span className="text-xs text-muted-foreground font-medium">
                          Code sent to +91{" "}
                          {phone.length >= 10
                            ? `${phone.slice(-10, -5)} ${phone.slice(-5)}`
                            : phone}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center block">
                          Enter 6-Digit Verification Code
                        </label>
                        <div className="flex justify-between gap-1.5 sm:gap-2">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`phone-otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleOtpBoxChange(index, e.target.value, otp, setOtp, "phone-otp")
                              }
                              onKeyDown={(e) => handleOtpBoxKeyDown(index, e, otp, "phone-otp")}
                              className="w-11 h-12 text-center text-xl font-bold rounded-lg border border-border bg-background focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                              autoFocus={index === 0}
                            />
                          ))}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-600 text-white hover:bg-emerald-700 gap-2 font-semibold text-sm shadow-sm cursor-pointer"
                        disabled={isLoading || otp.join("").length !== 6}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Verify & Enter Ezy1
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </>
                        )}
                      </Button>

                      <div className="text-center pt-2">
                        {cooldown > 0 ? (
                          <span className="text-xs text-muted-foreground">
                            Resend code in {cooldown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendOtp()}
                            className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                          >
                            Resend OTP Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Alternative Divider & Google OAuth (Visible on main modes) */}
              {(mode === "SIGNIN" || mode === "SIGNUP") && (
                <>
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 gap-2.5 font-medium border-border hover:bg-muted text-xs cursor-pointer"
                    onClick={() => setGoogleModalOpen(true)}
                  >
                    <FaGoogle className="w-3.5 h-3.5 text-rose-500" />
                    Sign in with Google
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Security & Partner Links Footer */}
          <div className="space-y-2 text-xs text-muted-foreground px-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div className="flex items-center gap-1.5 justify-center">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL Secure Auth</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <a
                  href={getPartnerPortalUrl()}
                  className="font-medium hover:text-primary hover:underline transition-colors"
                  title="Partner Portal (partner.ezy1.site)"
                >
                  Partner Login
                </a>
                <span>•</span>
                <a
                  href={getAdminPortalUrl()}
                  className="font-medium hover:text-primary hover:underline transition-colors"
                  title="Admin Portal (admin.ezy1.site)"
                >
                  Admin Console
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <a
                href="/legal/ezy1-user-terms-and-conditions.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-1"
                title="User Terms & Conditions (PDF)"
              >
                <span>User Terms</span>
                <span className="text-[9px] text-muted-foreground/70">↗</span>
              </a>
              <span>•</span>
              <a
                href="/legal/ezy1-universal-privacy-policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-1"
                title="Universal Privacy Policy (PDF)"
              >
                <span>Privacy Policy</span>
                <span className="text-[9px] text-muted-foreground/70">↗</span>
              </a>
              <span>•</span>
              <a
                href="/legal/ezy1-master-partner-agreement.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-1"
                title="Master Partner Agreement (PDF)"
              >
                <span>Partner Terms</span>
                <span className="text-[9px] text-muted-foreground/70">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Google Login Dialog */}
      <Dialog open={googleModalOpen} onOpenChange={setGoogleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaGoogle className="w-5 h-5 text-rose-500" />
              Sign in with Google
            </DialogTitle>
            <DialogDescription>
              Connect your Google profile to sign in instantly without password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGoogleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold">
                Google Account Email
              </label>
              <Input
                type="email"
                placeholder="your.name@gmail.com"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Your Display Name</label>
              <Input
                type="text"
                placeholder="Rahul Yadav"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isLoading}
            >
              Continue to Ezy1
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

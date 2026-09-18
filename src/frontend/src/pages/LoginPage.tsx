import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Shield,
  Smartphone,
  CheckCircle2,
  XCircle,
  Lock,
  User,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  KeyRound,
  UserPlus,
  LogIn,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import Layout from "../components/Layout";
import { Ezy1Logo } from "../components/Ezy1Logo";
import { useAuth } from "../lib/AuthContext";
import { checkUsernameAvailability } from "../lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const {
    signInWithPassword,
    signUp,
    sendPhoneOtp,
    verifyPhoneOtp,
    signInWithGoogle,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();

  // Auth Modes: "SIGNIN" (Username+Password), "SIGNUP" (Register), "OTP" (Phone OTP fallback)
  const [mode, setMode] = useState<"SIGNIN" | "SIGNUP" | "OTP">("SIGNIN");

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
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message?: string;
  }>({ checking: false });

  // OTP Fallback State
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
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  // Resend Cooldown Countdown Timer for OTP
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Debounced live check for username availability during signup
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

  // Handle Sign In (Returning User)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim()) {
      toast.error("Please enter your Username or Mobile number");
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
        navigate({ to: "/dashboard" });
      } else {
        toast.error(res.error || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up (First Time User)
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
      });

      if (res.success) {
        toast.success(`Account created! Welcome to Ezy1, ${res.user?.name}! 🎉`);
        navigate({ to: "/dashboard" });
      } else {
        toast.error(res.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 1: Send OTP (Phone Fallback)
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
      toast.success(res.message || "OTP sent successfully!");
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

  // Handle Step 2: Verify OTP
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
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Verification failed. Please check the code.");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/[^0-9]/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) {
          newOtp[i] = pasted[i];
        }
        setOtp(newOtp);
        const nextIdx = Math.min(pasted.length, 5);
        document.getElementById(`otp-input-${nextIdx}`)?.focus();
        return;
      }
    }

    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  // Google Sign-In Mock / Modal
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
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-background via-muted/20 to-background flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <Ezy1Logo size="xl" asLink={false} />
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xs">
              Instant Groceries, Healthcare, Bus Tracking & On-Demand Services
            </p>
          </div>

          {/* Blinkit-Style Clean Tab Switcher */}
          <div className="flex bg-muted p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setMode("SIGNIN")}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "SIGNIN"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("SIGNUP")}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "SIGNUP"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              New Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("OTP");
                setOtpStep("PHONE");
              }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "OTP"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile OTP
            </button>
          </div>

          <Card className="shadow-elevated border-border overflow-hidden bg-card/95 backdrop-blur-xs">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 w-full" />
            <CardContent className="p-6 space-y-5">
              {/* MODE 1: RETURNING USER - SIGN IN */}
              {mode === "SIGNIN" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Username / Mobile Number
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. rahul_yadav or 9876543210"
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
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <Input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold text-sm shadow-sm"
                    disabled={isLoading || !loginUsername.trim() || !loginPassword}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </Button>

                  {/* Switch to Sign Up */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      Don't have an account yet?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("SIGNUP")}
                        className="font-semibold text-emerald-600 hover:underline"
                      >
                        Create an Account
                      </button>
                    </p>
                  </div>

                  {/* Quick Test Demo Account */}
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Quick Test Account:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginUsername("sharma_grocery");
                        setLoginPassword("partner123");
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors text-xs text-foreground cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-semibold">sharma_grocery</span>
                        <span className="text-muted-foreground">(Password: partner123)</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-background">
                        Click to Fill
                      </Badge>
                    </button>
                  </div>
                </form>
              )}

              {/* MODE 2: FIRST-TIME USER - SIGN UP */}
              {mode === "SIGNUP" && (
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Rahul Yadav"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="h-10 text-sm font-medium"
                      autoFocus
                    />
                  </div>

                  {/* Create Username */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Create Username
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
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Only letters, numbers, and underscores (3-25 chars)
                    </p>
                  </div>

                  {/* Create Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Create Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showRegPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="h-10 text-sm font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        tabIndex={-1}
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Confirm Password
                      </label>
                      {regConfirmPassword && (
                        regPassword === regConfirmPassword ? (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Passwords match
                          </span>
                        ) : (
                          <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Does not match
                          </span>
                        )
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        type={showRegConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="h-10 text-sm font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        tabIndex={-1}
                      >
                        {showRegConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile Number (Optional) */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Mobile Number <span className="text-muted-foreground/60 font-normal">(Optional for delivery updates)</span>
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

                  <Button
                    type="submit"
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold text-sm shadow-sm mt-2"
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
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </Button>

                  {/* Switch back to Sign In */}
                  <div className="text-center pt-1">
                    <p className="text-xs text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("SIGNIN")}
                        className="font-semibold text-emerald-600 hover:underline"
                      >
                        Sign In here
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* MODE 3: PHONE OTP FALLBACK */}
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
                          Your Name <span className="text-muted-foreground/60 font-normal">(Optional for new customers)</span>
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
                        className="w-full h-11 bg-emerald-600 text-white hover:bg-emerald-700 gap-2 font-semibold text-sm shadow-sm"
                        disabled={isLoading || phone.replace(/[^0-9]/g, "").length < 10}
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
                          className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Change number
                        </button>
                        <span className="text-xs text-muted-foreground font-medium">
                          Code sent to +91 {phone.length >= 10 ? `${phone.slice(-10, -5)} ${phone.slice(-5)}` : phone}
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
                              id={`otp-input-${index}`}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              className="w-11 h-12 text-center text-xl font-bold rounded-lg border border-border bg-background focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                              autoFocus={index === 0}
                            />
                          ))}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-600 text-white hover:bg-emerald-700 gap-2 font-semibold text-sm shadow-sm"
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
                            className="text-xs text-emerald-600 hover:underline font-semibold"
                          >
                            Resend OTP Code
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Alternative Divider & Google OAuth */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 gap-2.5 font-medium border-border hover:bg-muted text-xs"
                onClick={() => setGoogleModalOpen(true)}
              >
                <FaGoogle className="w-3.5 h-3.5 text-rose-500" />
                Sign in with Google
              </Button>
            </CardContent>
          </Card>

          {/* Security & Partner Links Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit SSL Secure Auth</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/partner-login"
                className="font-medium hover:text-foreground hover:underline transition-colors"
              >
                Merchant Login
              </a>
              <span>•</span>
              <a
                href="/admin"
                className="font-medium hover:text-foreground hover:underline transition-colors"
              >
                Admin Console
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Google Login Simulation Dialog */}
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
              <label className="text-xs font-semibold">Google Account Email</label>
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

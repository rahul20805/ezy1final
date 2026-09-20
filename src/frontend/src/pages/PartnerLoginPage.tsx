import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
  User,
  AlertCircle,
  HelpCircle,
  Building2,
  Crown,
} from "lucide-react";
import Layout from "../components/Layout";
import { usePartnerAuth } from "../lib/partnerAuthStore";
import { useStoreData } from "../lib/storeData";
import { getCustomerPlatformUrl, getAdminPortalUrl } from "../config/links";
import { toast } from "sonner";

export type PortalType = "merchant" | "owner" | "admin";

export default function PartnerLoginPage() {
  const navigate = useNavigate();
  const store = useStoreData();
  const { login, changePassword, forgotPassword, resetPassword, isAuthenticated, currentPartner, logout } = usePartnerAuth();

  // Determine initial portal type from URL query string if present
  const getInitialPortal = (): PortalType => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("portal")?.toLowerCase();
      if (p === "owner") return "owner";
      if (p === "admin") return "admin";
    }
    return "merchant";
  };

  const [portalType, setPortalType] = useState<PortalType>(getInitialPortal);

  // Form State
  const [partnerUserId, setPartnerUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forced Password Change Modal State
  const [isForceChangeOpen, setIsForceChangeOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
  const [resetTokenReceived, setResetTokenReceived] = useState<string | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState("");

  // Sync portalType with URL query parameter changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handlePopState = () => {
        const params = new URLSearchParams(window.location.search);
        const p = params.get("portal")?.toLowerCase();
        if (p === "owner") setPortalType("owner");
        else if (p === "admin") setPortalType("admin");
        else setPortalType("merchant");
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  // Handle portal selection from the top 3 cards
  const handlePortalSelect = (selected: PortalType) => {
    setErrorMessage(null);
    setPortalType(selected);

    // Update browser URL query param cleanly without reloading
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (selected === "merchant") {
        url.searchParams.delete("portal");
      } else {
        url.searchParams.set("portal", selected);
      }
      window.history.pushState({}, "", url.pathname + url.search);
    }

    // If already authenticated, directly navigate if user has permissions
    if (isAuthenticated && currentPartner) {
      const role = (currentPartner.role || "").toUpperCase();
      if (selected === "owner") {
        if (role === "OWNER" || role === "SUPER_OWNER" || role === "ADMIN" || role === "SUPER_ADMIN") {
          navigate({ to: "/owner" });
        } else {
          toast.info("Logged in as merchant. Owner credentials required for Control Centre.");
        }
      } else if (selected === "admin") {
        if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "SUPER_OWNER") {
          navigate({ to: "/admin" });
        } else {
          toast.info("Logged in as partner. Admin credentials required for Super Admin Console.");
        }
      } else {
        navigate({ to: "/partner-dashboard" });
      }
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = partnerUserId.trim();
    const cleanPw = password.trim();

    if (!cleanId || !cleanPw) {
      setErrorMessage("Please enter both Partner/Admin ID and Password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(cleanId, cleanPw);
      setIsLoading(false);

      if (res.success) {
        const partner = usePartnerAuth.getState().currentPartner;
        const role = (partner?.role || "").toUpperCase();

        if (res.mustChangePassword) {
          setIsForceChangeOpen(true);
          toast.info("First login detected. Please set a new password.");
        } else {
          toast.success(`Welcome, ${partner?.name || partner?.businessName || "Partner"}!`);
          
          // Role-aware destination navigation
          if (portalType === "owner" || role === "OWNER" || role === "SUPER_OWNER") {
            navigate({ to: "/owner" });
          } else if (portalType === "admin" || role === "ADMIN" || role === "SUPER_ADMIN") {
            navigate({ to: "/admin" });
          } else {
            navigate({ to: "/partner-dashboard" });
          }
        }
      } else {
        const errorText = res.error || "Invalid credentials. Please verify ID and password.";
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch {
      setIsLoading(false);
      const errorText = "An error occurred during sign in. Please try again.";
      setErrorMessage(errorText);
      toast.error(errorText);
    }
  };

  // Handle Force Change Password Submit
  const handleForceChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword("", newPassword);
      setIsChangingPassword(false);

      if (res.success) {
        toast.success("Password updated successfully! Welcome to your dashboard.");
        setIsForceChangeOpen(false);

        const partner = usePartnerAuth.getState().currentPartner;
        const role = (partner?.role || "").toUpperCase();
        if (portalType === "owner" || role === "OWNER" || role === "SUPER_OWNER") {
          navigate({ to: "/owner" });
        } else if (portalType === "admin" || role === "ADMIN" || role === "SUPER_ADMIN") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/partner-dashboard" });
        }
      } else {
        toast.error(res.error || "Failed to update password.");
      }
    } catch {
      setIsChangingPassword(false);
      toast.error("Failed to update password. Please try again.");
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      toast.error("Please enter your Partner ID or email.");
      return;
    }

    setIsSubmittingForgot(true);
    try {
      const res = await forgotPassword(forgotIdentifier);
      setIsSubmittingForgot(false);

      if (res.success) {
        if (res.resetToken) {
          setResetTokenReceived(res.resetToken);
          toast.success("Identity verified! Set your new password.");
        } else {
          toast.info(res.message || "Password recovery instructions generated.");
          setIsForgotModalOpen(false);
        }
      } else {
        toast.error(res.error || "Account not found with this identifier.");
      }
    } catch {
      setIsSubmittingForgot(false);
      toast.error("Failed to process password recovery.");
    }
  };

  // Handle Reset Password with Token
  const handleResetWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTokenReceived) return;

    if (resetNewPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmittingForgot(true);
    try {
      const res = await resetPassword(resetTokenReceived, resetNewPassword);
      setIsSubmittingForgot(false);

      if (res.success) {
        toast.success("Password reset successfully! Please log in.");
        setIsForgotModalOpen(false);
        setResetTokenReceived(null);
        setResetNewPassword("");
        setPassword("");
      } else {
        toast.error(res.error || "Failed to reset password.");
      }
    } catch {
      setIsSubmittingForgot(false);
      toast.error("Failed to reset password.");
    }
  };

  // Dynamic portal configurations
  const portalConfigs = {
    merchant: {
      badge: "🔒 EZY1 Merchant & Partner Portal",
      title: "Merchant & Partner Sign In",
      description: "Enter your verified Partner User ID to manage orders, inventory, and customer fulfillment.",
      idLabel: "Partner User ID *",
      idPlaceholder: "e.g. EZY-P-10002 or username",
      buttonText: "Sign In to Partner Portal",
      perksTitle: "Merchant & Partner Portal Features",
      perks: [
        "Manage your store products, services & fleet from a centralized console",
        "Real-time customer dispatch alerts & live order tracking",
        "Instant digital wallet settlements & sales analytics",
        "Dedicated merchant support and automated tax invoicing",
      ],
      color: "primary",
    },
    owner: {
      badge: "👑 Platform Owner Control Centre",
      title: "Owner Control Centre Sign In",
      description: "Master operations console for catalog management, multi-vendor controls, and cross-sector oversight.",
      idLabel: "Owner User ID or Username *",
      idPlaceholder: "e.g. EZY-P-10000 or owner",
      buttonText: "Sign In to Owner Control Centre",
      perksTitle: "Owner Control Centre Features",
      perks: [
        "Complete visibility across all 12 operational business sectors",
        "Master inventory catalog, merchant onboarding, and commission settings",
        "Live orders, bookings, enquiries, and customer dispute management",
        "Granular access control and owner financial oversight",
      ],
      color: "amber",
    },
    admin: {
      badge: "⚡ Super Admin Console",
      title: "Super Admin Console Sign In",
      description: "Centralized governance console for high-privilege system administration, security, and auditing.",
      idLabel: "Super Admin User ID or Username *",
      idPlaceholder: "e.g. EZY-P-10001 or admin",
      buttonText: "Sign In to Super Admin Console",
      perksTitle: "Super Admin Console Features",
      perks: [
        "Platform-wide governance, API integration management, and audit logs",
        "System security settings, partner verification, and user management",
        "Marketplace analytics, promotional campaigns, and financial payouts",
        "Real-time service health, delivery tracking, and WhatsApp notifications",
      ],
      color: "indigo",
    },
  };

  const currentConfig = portalConfigs[portalType];

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] bg-muted/20 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Ecosystem Domain Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <a
              href={getCustomerPlatformUrl()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors bg-card border border-border/80 px-3 py-1.5 rounded-full shadow-xs"
              title="Return to Customer Platform"
            >
              <span>← Back to Customer Platform (ezy1.site)</span>
            </a>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[11px] font-mono bg-primary/5 text-primary border-primary/20">
                🌐 partner.ezy1.site
              </Badge>
            </div>
          </div>

          {/* Header Banner */}
          <div className="text-center space-y-2">
            <Badge className="bg-primary/15 text-primary border-primary/30 text-xs px-3.5 py-1 rounded-full font-semibold">
              🔒 EZY1 Partner Portal
            </Badge>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-foreground tracking-tight">
              EZY1 Partner & Operations Portal
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Dedicated partner gateway at <span className="font-mono font-semibold text-foreground">partner.ezy1.site</span>. Sign in below with your verified credentials.
            </p>
          </div>

          {/* Three-Level Management Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Merchant Login */}
            <button
              type="button"
              onClick={() => handlePortalSelect("merchant")}
              className={`p-3.5 rounded-2xl text-left transition-all flex items-center gap-3 w-full group ${
                portalType === "merchant"
                  ? "bg-card border-2 border-primary shadow-sm ring-1 ring-primary/30"
                  : "bg-card hover:bg-muted/50 border border-border"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                  portalType === "merchant"
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-foreground block truncate">1. Merchant Login</span>
                <span
                  className={`text-[10px] font-semibold block truncate ${
                    portalType === "merchant" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {portalType === "merchant" ? "Current Portal (Active)" : "Service & Vendor Portal"}
                </span>
              </div>
            </button>

            {/* 2. Owner Control Center */}
            <button
              type="button"
              onClick={() => handlePortalSelect("owner")}
              className={`p-3.5 rounded-2xl text-left transition-all flex items-center gap-3 w-full group ${
                portalType === "owner"
                  ? "bg-card border-2 border-amber-500 shadow-sm ring-1 ring-amber-500/30"
                  : "bg-card hover:bg-muted/50 border border-border"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                  portalType === "owner"
                    ? "bg-amber-500 text-white"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                <Crown className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className={`text-xs font-bold block truncate transition-colors ${
                    portalType === "owner" ? "text-amber-600 dark:text-amber-400" : "text-foreground group-hover:text-primary"
                  }`}
                >
                  2. Owner Control Centre →
                </span>
                <span
                  className={`text-[10px] block truncate ${
                    portalType === "owner" ? "text-amber-600 font-semibold dark:text-amber-400" : "text-muted-foreground"
                  }`}
                >
                  {portalType === "owner" ? "Current Portal (Active)" : "Operations & Merchants"}
                </span>
              </div>
            </button>

            {/* 3. Super Admin Console */}
            <button
              type="button"
              onClick={() => handlePortalSelect("admin")}
              className={`p-3.5 rounded-2xl text-left transition-all flex items-center gap-3 w-full group ${
                portalType === "admin"
                  ? "bg-card border-2 border-indigo-500 shadow-sm ring-1 ring-indigo-500/30"
                  : "bg-card hover:bg-muted/50 border border-border"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                  portalType === "admin"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                }`}
              >
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className={`text-xs font-bold block truncate transition-colors ${
                    portalType === "admin" ? "text-indigo-600 dark:text-indigo-400" : "text-foreground group-hover:text-primary"
                  }`}
                >
                  3. Super Admin Console →
                </span>
                <span
                  className={`text-[10px] block truncate ${
                    portalType === "admin" ? "text-indigo-600 font-semibold dark:text-indigo-400" : "text-muted-foreground"
                  }`}
                >
                  {portalType === "admin" ? "Current Portal (Active)" : "System & Security"}
                </span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Card: Dynamic Secure Login Form */}
            <Card className="lg:col-span-7 rounded-3xl border-border bg-card shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      portalType === "owner"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        : portalType === "admin"
                        ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/30"
                        : "bg-primary/10 text-primary border-primary/30"
                    }`}
                  >
                    {currentConfig.badge}
                  </Badge>
                  {isAuthenticated && currentPartner && (
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Authenticated
                    </span>
                  )}
                </div>

                <CardTitle className="text-lg font-display font-bold flex items-center gap-2 mt-2">
                  <ShieldCheck
                    className={`w-5 h-5 ${
                      portalType === "owner"
                        ? "text-amber-500"
                        : portalType === "admin"
                        ? "text-indigo-500"
                        : "text-primary"
                    }`}
                  />
                  {currentConfig.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {currentConfig.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-xs text-destructive font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      {currentConfig.idLabel}
                    </Label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        required
                        type="text"
                        placeholder={currentConfig.idPlaceholder}
                        value={partnerUserId}
                        onChange={(e) => setPartnerUserId(e.target.value)}
                        className="pl-9 rounded-xl font-mono text-sm tracking-wide"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">
                        Password *
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setForgotIdentifier(partnerUserId);
                          setIsForgotModalOpen(true);
                        }}
                        className="text-[11px] text-primary hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-9 rounded-xl font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-11 rounded-xl text-white font-semibold text-sm gap-2 shadow-sm transition-colors ${
                      portalType === "owner"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : portalType === "admin"
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying credentials...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        {currentConfig.buttonText}
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 256-Bit Encrypted
                  </span>
                  <span>Role-Based Access Control</span>
                </div>
              </CardContent>
            </Card>

            {/* Right Card: Dynamic Features & Help */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-base text-foreground">
                  {currentConfig.perksTitle}
                </h3>
                <ul className="space-y-3">
                  {currentConfig.perks.map((perk, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium leading-relaxed">
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs space-y-1">
                  <p className="font-bold text-primary flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Credential & Access Support
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    User IDs and authentication tokens are cryptographically signed. If you require role adjustments or encounter login issues, please reach out to platform governance.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Force Change Password Modal */}
      <Dialog open={isForceChangeOpen} onOpenChange={setIsForceChangeOpen}>
        <DialogContent className="max-w-md bg-card border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Set Your New Password
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              For security reasons, temporary or initial credentials must be updated before accessing the Dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForceChangeSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">New Password * (Min. 8 characters)</Label>
              <Input
                type="password"
                required
                placeholder="Enter strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl font-mono text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Confirm New Password *</Label>
              <Input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl font-mono text-sm"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="submit"
                disabled={isChangingPassword || newPassword.length < 8}
                className="w-full rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {isChangingPassword ? "Saving..." : "Save Password & Proceed to Dashboard"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={isForgotModalOpen} onOpenChange={setIsForgotModalOpen}>
        <DialogContent className="max-w-md bg-card border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Account Password Recovery
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter your User ID, email, or registered phone to recover your account.
            </DialogDescription>
          </DialogHeader>

          {!resetTokenReceived ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">User ID or Email *</Label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. EZY-P-10002 or partner@ezy1.in"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingForgot || !forgotIdentifier.trim()}
                  className="rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  {isSubmittingForgot ? "Verifying..." : "Request Reset Link"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <form onSubmit={handleResetWithToken} className="space-y-4 pt-2">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300">
                Identity verified. Enter your new permanent password below.
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Password * (Min. 8 characters)</Label>
                <Input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  className="rounded-xl font-mono text-sm"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmittingForgot || resetNewPassword.length < 8}
                  className="w-full rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  {isSubmittingForgot ? "Resetting..." : "Reset Password & Login"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

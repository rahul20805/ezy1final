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
} from "lucide-react";
import Layout from "../components/Layout";
import { usePartnerAuth } from "../lib/partnerAuthStore";
import { useStoreData } from "../lib/storeData";
import { toast } from "sonner";

export default function PartnerLoginPage() {
  const navigate = useNavigate();
  const store = useStoreData();
  const { login, changePassword, forgotPassword, resetPassword, isAuthenticated } = usePartnerAuth();

  // Form State
  const [partnerUserId, setPartnerUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forced Password Change Modal State (For First Login or Temporary Passwords)
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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/partner-dashboard" });
    }
  }, [isAuthenticated, navigate]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = partnerUserId.trim();
    const cleanPw = password.trim();

    if (!cleanId || !cleanPw) {
      setErrorMessage("Please enter both Partner User ID and Password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(cleanId, cleanPw);
      setIsLoading(false);

      if (res.success) {
        if (res.mustChangePassword) {
          setIsForceChangeOpen(true);
          toast.info("First login detected. Please set a new password.");
        } else {
          toast.success("Welcome to the EZY1 Partner Portal!");
          navigate({ to: "/partner-dashboard" });
        }
      } else {
        const errorText = res.error || "Invalid Partner ID or password.";
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
        navigate({ to: "/partner-dashboard" });
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
      toast.error("Please enter your Partner User ID or registered Email.");
      return;
    }

    setIsSubmittingForgot(true);
    try {
      const res = await forgotPassword(forgotIdentifier);
      setIsSubmittingForgot(false);

      if (res.success) {
        toast.success(res.message || "Reset instructions generated.");
        if (res.resetToken) {
          setResetTokenReceived(res.resetToken);
        }
      }
    } catch {
      setIsSubmittingForgot(false);
      toast.error("Unable to process password reset request.");
    }
  };

  // Handle Reset Password with Token
  const handleResetWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTokenReceived || resetNewPassword.length < 8) {
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

  const perks = [
    "Manage your store products, services & fleet from a centralized console",
    "Real-time customer dispatch alerts & live order tracking",
    "Instant digital wallet settlements & sales analytics",
    "Dedicated merchant support and automated tax invoicing",
  ];

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] bg-muted/20 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Header Banner */}
          <div className="text-center space-y-2">
            <Badge className="bg-primary/15 text-primary border-primary/30 text-xs px-3.5 py-1 rounded-full font-semibold">
              🔒 EZY1 Management Ecosystem
            </Badge>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-foreground tracking-tight">
              EZY1 Management Portals
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Select your authorization portal or sign in below with your verified credentials.
            </p>
          </div>

          {/* Three-Level Management Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-card border-2 border-primary shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-foreground block truncate">1. Merchant Login</span>
                <span className="text-[10px] text-primary font-semibold block truncate">Current Portal (Service Login)</span>
              </div>
            </div>

            <Link
              to="/owner"
              className="p-3.5 rounded-2xl bg-card hover:bg-muted/50 border border-border transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-foreground block truncate group-hover:text-primary transition-colors">
                  2. Owner Control Center →
                </span>
                <span className="text-[10px] text-muted-foreground block truncate">Operations & Merchants</span>
              </div>
            </Link>

            <Link
              to="/admin"
              className="p-3.5 rounded-2xl bg-card hover:bg-muted/50 border border-border transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-foreground block truncate group-hover:text-primary transition-colors">
                  3. Super Admin Console →
                </span>
                <span className="text-[10px] text-muted-foreground block truncate">System & Security</span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Card: Secure Login Form */}
            <Card className="lg:col-span-7 rounded-3xl border-border bg-card shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Secure Partner Authentication
                </CardTitle>
                <CardDescription className="text-xs">
                  Enter the Partner User ID assigned by EZY1 Administration.
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
                      Partner User ID *
                    </Label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        required
                        type="text"
                        placeholder="e.g. EZY-P-10001"
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
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm gap-2 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Sign In to Partner Portal
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

            {/* Right Card: Perks & Info */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-base text-foreground">
                  Partner Portal Features
                </h3>
                <ul className="space-y-3">
                  {perks.map((perk, i) => (
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
                    New Partner Onboarding
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Partner User IDs and initial credentials are created and managed by EZY1 platform administrators. Contact your regional coordinator to get registered.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Force Change Password Modal (First Login or Temporary Password) */}
      <Dialog open={isForceChangeOpen} onOpenChange={setIsForceChangeOpen}>
        <DialogContent className="max-w-md bg-card border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Set Your New Password
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              For security reasons, temporary or initial credentials must be updated before accessing the Partner Dashboard.
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
              Partner Password Recovery
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter your Partner User ID or registered email address to recover your account.
            </DialogDescription>
          </DialogHeader>

          {!resetTokenReceived ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Partner User ID or Email *</Label>
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


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
  Lock,
  RefreshCw,
  Sparkles,
  Store,
  ChevronLeft,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import Layout from "../components/Layout";
import { useAuth } from "../lib/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const { sendPhoneOtp, verifyPhoneOtp, signInWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

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

  // Resend Cooldown Countdown Timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Handle Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent, customPhone?: string) => {
    if (e) e.preventDefault();
    const targetPhone = customPhone || phone;
    const cleanPhone = targetPhone.replace(/[^0-9]/g, "");

    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);

    try {
      const res = await sendPhoneOtp(cleanPhone);
      toast.success(res.message || "OTP sent successfully!");
      setPhone(cleanPhone);
      setStep("OTP");
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
      const res = await verifyPhoneOtp(phone, fullOtp, name);
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

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of entire OTP
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

    // Auto-advance focus to next input
    if (digit && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  // Google Login Submit
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

  // Quick One-Click Demo Login
  const handleQuickDemoLogin = (demoPhone: string, demoName: string) => {
    setPhone(demoPhone);
    setName(demoName);
    handleSendOtp(undefined, demoPhone);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-background via-muted/20 to-background flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-elevated mb-1">
              <span className="text-primary-foreground font-display font-black text-2xl tracking-tight">
                e1
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
              Welcome to ezy<span className="text-primary">1</span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Instant Groceries, Healthcare, Bus Tracking & On-Demand Services
            </p>
          </div>

          <Card className="shadow-elevated border-border overflow-hidden bg-card/95 backdrop-blur-xs">
            <div className="h-1 bg-gradient-to-r from-primary via-orange-500 to-amber-500 w-full" />
            <CardContent className="p-6 space-y-5">
              {step === "PHONE" ? (
                /* Step 1: Mobile Phone Input */
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold text-sm shadow-sm"
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

                  {/* Fast One-Click Demo Account Chip */}
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Quick Test / Demo Customer:
                    </p>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin("9876543210", "Rahul Sharma")}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors text-xs text-foreground cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-semibold">+91 9876543210</span>
                        <span className="text-muted-foreground">(Rahul Sharma)</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-background">
                        OTP: 123456
                      </Badge>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with</span>
                    </div>
                  </div>

                  {/* Google OAuth Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 gap-2.5 font-medium border-border hover:bg-muted"
                    onClick={() => setGoogleModalOpen(true)}
                  >
                    <FaGoogle className="w-4 h-4 text-rose-500" />
                    Sign in with Google
                  </Button>
                </form>
              ) : (
                /* Step 2: 6-Digit OTP Verification */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep("PHONE")}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
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
                          className="w-11 h-12 text-center text-xl font-bold rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold text-sm shadow-sm"
                    disabled={isLoading || otp.join("").length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying Secure Token...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Verify & Access EZY1
                      </>
                    )}
                  </Button>

                  {/* Resend Cooldown */}
                  <div className="text-center pt-1">
                    {cooldown > 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Resend code in <span className="font-bold text-foreground">{cooldown}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp(undefined, phone)}
                        className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                        disabled={isLoading}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Resend OTP Code
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/40">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-medium text-muted-foreground">256-Bit SSL</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/40">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-medium text-muted-foreground">Zero Password</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/40">
                  <Smartphone className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-medium text-muted-foreground">Instant OTP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner & Merchant Redirect Notice */}
          <div className="p-3.5 rounded-xl bg-card border border-border text-center space-y-1 shadow-xs">
            <p className="text-xs text-muted-foreground">
              Are you a merchant, store owner, or delivery fleet partner?
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-primary hover:text-primary gap-1.5 h-8"
              onClick={() => navigate({ to: "/partner-login" })}
            >
              <Store className="w-3.5 h-3.5" />
              Go to Partner & Merchant Portal →
            </Button>
          </div>
        </div>
      </div>

      {/* Google OAuth Interactive Dialog */}
      <Dialog open={googleModalOpen} onOpenChange={setGoogleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <FaGoogle className="text-rose-500 w-5 h-5" />
              Sign in with Google
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Connect your Google account for single-click customer login.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGoogleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Google Email Address</label>
              <Input
                type="email"
                placeholder="you@gmail.com"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
              <Input
                type="text"
                placeholder="Your Name"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
              />
            </div>

            {/* Quick Demo Pre-fill */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setGoogleEmail("rahul.sharma@gmail.com");
                  setGoogleName("Rahul Sharma");
                }}
                className="text-[11px] px-2.5 py-1 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground"
              >
                Fill rahul.sharma@gmail.com
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setGoogleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground gap-2" disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FaGoogle className="w-3.5 h-3.5" />}
                Authorize & Login
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

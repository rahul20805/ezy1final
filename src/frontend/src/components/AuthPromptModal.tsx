import React, { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../lib/AuthContext";
import { Smartphone, CheckCircle, ArrowRight, ShieldCheck, Lock } from "lucide-react";

interface PendingAction {
  title: string;
  description: string;
  onSuccess: () => void;
}

interface AuthPromptContextType {
  requireAuth: (action: PendingAction | (() => void)) => boolean;
}

const AuthPromptContext = createContext<AuthPromptContextType | null>(null);

export function AuthPromptProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  // OTP Form States
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const requireAuth = (action: PendingAction | (() => void)): boolean => {
    const actObj: PendingAction =
      typeof action === "function"
        ? { title: "Complete Action", description: "Please sign in to proceed", onSuccess: action }
        : action;
    if (isAuthenticated) {
      actObj.onSuccess();
      return true;
    }
    setPendingAction(actObj);
    setIsOpen(true);
    setStep("phone");
    setError(null);
    return false;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await sendPhoneOtp(phone.trim());
      if (res.success) {
        setStep("otp");
        if (res.debugOtp) setDevOtp(res.debugOtp);
      } else {
        setError(res.message || "Could not send OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit OTP code");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await verifyPhoneOtp(phone.trim(), otp.trim(), name.trim() || undefined);
      if (res.success) {
        setIsOpen(false);
        // Execute the pending action immediately
        if (pendingAction) {
          pendingAction.onSuccess();
          setPendingAction(null);
        }
      } else {
        setError("Invalid OTP code. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPromptContext.Provider value={{ requireAuth }}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-card border-border shadow-2xl p-6">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-display font-bold text-foreground">
              {pendingAction?.title || "Sign in to Continue"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {pendingAction?.description || "Experience 1-click ordering, live tracking, and quick appointments."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                    +91
                  </span>
                  <Input
                    type="tel"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="pl-14 h-12 rounded-xl text-base font-medium tracking-wide bg-background border-border"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Full Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl bg-background border-border"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl font-bold font-display bg-primary text-primary-foreground shadow-sm hover:opacity-95"
              >
                {loading ? "Sending Code..." : "Continue with OTP"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Your details are 100% private and protected.</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 mt-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Change Number
                  </button>
                </div>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="h-12 rounded-xl text-center text-xl font-bold tracking-widest bg-background border-border"
                  autoFocus
                />
                {devOtp && (
                  <p className="text-[11px] text-primary font-mono mt-1 text-center bg-primary/10 py-1 rounded-md">
                    Demo Mode OTP: <strong>{devOtp}</strong>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl font-bold font-display bg-primary text-primary-foreground shadow-sm hover:opacity-95"
              >
                {loading ? "Verifying..." : "Verify & Complete Action"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AuthPromptContext.Provider>
  );
}

export function useRequireAuth() {
  const context = useContext(AuthPromptContext);
  if (!context) {
    // Return a no-op instead of crashing the app
    return {
      requireAuth: (_action: any) => false,
    } as AuthPromptContextType;
  }
  return context;
}

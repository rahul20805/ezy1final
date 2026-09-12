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
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  Truck,
  User,
  Wrench,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { usePartnerAuth } from "../lib/partnerAuthStore";
import { useStoreData } from "../lib/storeData";

export default function PartnerLoginPage() {
  const navigate = useNavigate();
  const store = useStoreData();
  const { partners, login } = usePartnerAuth();

  const [partnerId, setPartnerId] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerId.trim() || !password.trim()) {
      toast.error("Please enter both Admin/Partner ID and Password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(partnerId, password);
      setIsLoading(false);

      if (res.success) {
        toast.success(
          `Welcome to ${store.settings.brandName} Owner & Partner Portal!`,
        );
        navigate({ to: "/owner" });
      } else {
        toast.error(res.error || "Invalid Partner ID or Password.");
      }
    } catch {
      setIsLoading(false);
      toast.error("An unexpected error occurred during login. Please try again.");
    }
  };

  const fillDemoAccount = (id: string, pass: string) => {
    setPartnerId(id);
    setPassword(pass);
    toast.info(`Loaded credentials for: ${id}`);
  };

  const perks = [
    "Complete control over your products, inventory & pricing",
    "Real-time order notifications & customer dispatch tracking",
    "Digital instant settlements & live sales insights",
    "Zero coding needed - manage your entire store effortlessly",
  ];

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] bg-muted/20 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Header Banner */}
          <div className="text-center space-y-2">
            <Badge className="bg-primary/15 text-primary hover:bg-primary/25 border-primary/30 text-xs px-3.5 py-1 rounded-full font-semibold">
              ✨ Partner & Master Owner Access
            </Badge>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-foreground tracking-tight">
              Manage Your Business on{" "}
              <span className="text-primary">{store.settings.brandName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Enter your unique Partner Admin ID and Password to manage
              inventory, bookings, live orders, website content, and owner
              settings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Card: Secure Login Form */}
            <Card className="lg:col-span-7 rounded-3xl border-border bg-card shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Partner Admin
                  Login
                </CardTitle>
                <CardDescription className="text-xs">
                  Each partner has individual credentials and role-specific
                  access.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Partner / Admin ID *
                    </Label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        required
                        type="text"
                        placeholder="e.g. admin or sharma_grocery"
                        value={partnerId}
                        onChange={(e) => setPartnerId(e.target.value)}
                        className="pl-9 rounded-xl font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">
                        Password *
                      </Label>
                      <span className="text-[11px] text-muted-foreground">
                        Default: admin123 / partner123
                      </span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
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
                    {isLoading ? "Authenticating..." : "Access Owner Portal"}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>

                {/* Quick Auto-Fill Credentials Bar */}
                <div className="mt-6 pt-5 border-t border-border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> 1-Click
                      Quick Demo Logins:
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Click any to auto-fill
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoAccount("admin", "admin123")}
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        partnerId === "admin"
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border bg-muted/40 hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <p className="font-bold truncate">👑 Master Owner</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        admin
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        fillDemoAccount("sharma_grocery", "partner123")
                      }
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        partnerId === "sharma_grocery"
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border bg-muted/40 hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <p className="font-bold truncate">🛒 Grocery Partner</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        sharma_grocery
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        fillDemoAccount("nair_pharma", "partner123")
                      }
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        partnerId === "nair_pharma"
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border bg-muted/40 hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <p className="font-bold truncate">💊 Pharmacy</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        nair_pharma
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        fillDemoAccount("suresh_services", "partner123")
                      }
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        partnerId === "suresh_services"
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border bg-muted/40 hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <p className="font-bold truncate">🔧 Home Services</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        suresh_services
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        fillDemoAccount("rajesh_transport", "partner123")
                      }
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        partnerId === "rajesh_transport"
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border bg-muted/40 hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <p className="font-bold truncate">🚗 Transport / Cabs</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        rajesh_transport
                      </p>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Card: Perks & Features */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="rounded-3xl border-border bg-card p-6 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-base text-foreground">
                  Why Partners Love {store.settings.brandName}
                </h3>
                <ul className="space-y-3">
                  {perks.map((perk, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium leading-relaxed">
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs space-y-1">
                  <p className="font-bold text-primary">
                    Need a New Partner Account?
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Log in as Master Admin (
                    <span className="font-mono font-bold">
                      admin / admin123
                    </span>
                    ) to generate custom login IDs and assign permissions in
                    Owner Settings.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

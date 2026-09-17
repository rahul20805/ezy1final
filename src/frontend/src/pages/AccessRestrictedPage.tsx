import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShieldAlert, ArrowRight, LogOut, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePartnerAuth } from "../lib/partnerAuthStore";
import { getProviderLabel, getProviderDashboardUrl } from "../lib/permissions";

interface AccessRestrictedPageProps {
  requiredProviderTypes?: string[];
}

export function AccessRestrictedPage({ requiredProviderTypes = [] }: AccessRestrictedPageProps) {
  const { currentPartner, logout } = usePartnerAuth();
  const navigate = useNavigate();

  const providerType = currentPartner?.providerType || currentPartner?.partnerType || "GROCERY";
  const providerLabel = getProviderLabel(providerType);
  const dashboardUrl = getProviderDashboardUrl(providerType);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
          <span className="text-primary-foreground font-display font-black text-base">e1</span>
        </div>
        <div>
          <span className="font-display font-black text-xl tracking-tight text-foreground">EZY1</span>
          <span className="text-xs ml-1.5 font-bold uppercase tracking-widest text-primary">Partner Security</span>
        </div>
      </div>

      <Card className="max-w-md w-full border-border/80 shadow-lg rounded-3xl bg-card overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-primary" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4 ring-8 ring-amber-500/5">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-display font-bold text-foreground">
            Access Restricted
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1.5">
            You don't have permission to access this section.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-2 pb-8 px-6">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Account User ID:</span>
              <span className="font-mono font-bold text-foreground">
                {currentPartner?.partnerUserId || currentPartner?.id || "N/A"}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Registered Role:</span>
              <Badge variant="secondary" className="font-semibold text-[11px] bg-primary/10 text-primary border-primary/20">
                {providerLabel}
              </Badge>
            </div>

            {requiredProviderTypes.length > 0 && (
              <div className="flex justify-between items-center text-xs pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Section Requirements:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {requiredProviderTypes.join(" / ")} Only
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 rounded-2xl gap-2 shadow-xs"
              onClick={() => navigate({ to: dashboardUrl })}
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Your Authorized Dashboard
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link to="/">
                <Button variant="outline" className="w-full h-10 rounded-2xl text-xs gap-1.5 font-medium">
                  <Home className="w-3.5 h-3.5" />
                  EZY1 Home
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full h-10 rounded-2xl text-xs gap-1.5 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  logout();
                  navigate({ to: "/partner-login" });
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default AccessRestrictedPage;

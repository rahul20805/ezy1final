import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Fingerprint, Shield, Smartphone } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../lib/AuthContext";
import { setCurrentRole } from "../lib/auth";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isLoading = false; // We can improve this state later

  const handleLogin = async () => {
    await login();
    setCurrentRole("user");
    navigate({ to: "/dashboard" });
  };

  return (
    <Layout>
      <div
        className="min-h-[calc(100vh-8rem)] bg-background flex items-center justify-center p-6"
        data-ocid="login.page"
      >
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center shadow-elevated mb-4">
              <span className="text-primary-foreground font-display font-black text-2xl">
                e1
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              Welcome to ezy<span className="text-primary">1</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Sign in to access your personalized dashboard
            </p>
          </div>

          <Card className="shadow-elevated border-border">
            <CardContent className="p-6 space-y-4">
              <Button
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 gap-3 text-base font-semibold"
                onClick={handleLogin}
                disabled={isLoading}
                data-ocid="login.submit_button"
              >
                <Fingerprint className="w-5 h-5" />
                {isLoading ? "Connecting..." : "Login with Internet Identity"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-auto" />}
              </Button>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Shield, label: "Secure" },
                  { icon: Smartphone, label: "Mobile Friendly" },
                  { icon: Fingerprint, label: "No Password" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 p-3 bg-muted/40 rounded-lg"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground text-center">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            New to Ezy1?{" "}
            <button
              type="button"
              className="text-primary font-medium cursor-pointer"
              onClick={handleLogin}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            >
              Create an account →
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
}

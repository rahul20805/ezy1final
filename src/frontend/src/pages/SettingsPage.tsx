import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ShoppingBag,
  Truck,
  Bus,
  Stethoscope,
  Wrench,
  Tag,
  AlertCircle,
  Smartphone,
  Mail,
  Shield,
  User,
  LogOut,
  Save,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import UserLayout from "../components/UserLayout";
import { useAuth } from "../lib/AuthContext";
import { useNotificationStore } from "../lib/notificationStore";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { preferences, loadPreferences, savePreferences } = useNotificationStore();

  useEffect(() => {
    loadPreferences();
  }, []);

  const handleToggle = (key: string, value: boolean) => {
    savePreferences({ [key]: value ? 1 : 0 });
  };

  const notificationCategories = [
    {
      id: "orders",
      title: "Order & Purchase Updates",
      description: "Get notified when orders are received, prepared, and ready for pickup.",
      icon: ShoppingBag,
      color: "text-emerald-500",
    },
    {
      id: "delivery",
      title: "Delivery & Rider Tracking",
      description: "Real-time updates when delivery partner is assigned, out for delivery, and arriving nearby.",
      icon: Truck,
      color: "text-blue-500",
    },
    {
      id: "bus",
      title: "Bus Schedules & Delay Alerts",
      description: "Live bus stop proximity alerts, approaching reminders, and route delay notifications.",
      icon: Bus,
      color: "text-amber-500",
    },
    {
      id: "doctor",
      title: "Healthcare & Doctor Appointments",
      description: "Appointment confirmations, clinic schedule reminders, and medical alerts.",
      icon: Stethoscope,
      color: "text-rose-500",
    },
    {
      id: "services",
      title: "Home & Professional Services",
      description: "Service expert assignment, estimated arrival time, and job completion notices.",
      icon: Wrench,
      color: "text-teal-500",
    },
    {
      id: "offers",
      title: "Promotional Discounts & Coupons",
      description: "Special seasonal discounts, cashbacks, and flash sale announcements.",
      icon: Tag,
      color: "text-purple-500",
    },
    {
      id: "announcements",
      title: "System Alerts & Platform News",
      description: "Important security alerts, login notifications, and platform maintenance updates.",
      icon: AlertCircle,
      color: "text-primary",
    },
  ];

  return (
    <UserLayout title="Account & Preferences">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Profile Card */}
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">{user?.name || "Customer"}</h3>
                    <Badge variant="secondary" className="text-[10px] font-semibold bg-primary/10 text-primary uppercase">
                      {user?.role || "CUSTOMER"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {user?.phone ? `+91 ${user.phone}` : user?.email || "Authenticated User"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1.5 self-start sm:self-auto"
                onClick={() => logout()}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Notification Preferences */}
        <Card className="border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription className="text-xs">
                  Choose which alerts and category updates you want to receive across EZY1.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="divide-y divide-border">
              {notificationCategories.map((cat) => {
                const Icon = cat.icon;
                const isChecked = preferences
                  ? Boolean((preferences as any)[cat.id] ?? 1)
                  : true;

                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between py-3.5 gap-4 transition-colors hover:bg-muted/30 px-2 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted shrink-0 mt-0.5">
                        <Icon className={`w-4 h-4 ${cat.color}`} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">{cat.title}</h4>
                        <p className="text-xs text-muted-foreground">{cat.description}</p>
                      </div>
                    </div>

                    <Switch
                      checked={isChecked}
                      onCheckedChange={(val) => handleToggle(cat.id, val)}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Channels */}
        <Card className="border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Delivery Channels</CardTitle>
                <CardDescription className="text-xs">
                  Manage how urgent notices and transactional receipts are transmitted.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-primary" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">In-App & Real-Time Push</h4>
                  <p className="text-xs text-muted-foreground">Instant SSE toasts and browser push notifications</p>
                </div>
              </div>
              <Switch
                checked={preferences ? Boolean(preferences.pushEnabled ?? 1) : true}
                onCheckedChange={(val) => handleToggle("pushEnabled", val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">SMS Text Alerts</h4>
                  <p className="text-xs text-muted-foreground">Critical OTP verification and high-priority delivery codes</p>
                </div>
              </div>
              <Switch
                checked={preferences ? Boolean(preferences.smsEnabled ?? 1) : true}
                onCheckedChange={(val) => handleToggle("smsEnabled", val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">Email Summaries</h4>
                  <p className="text-xs text-muted-foreground">Monthly invoice summaries and promotional discounts</p>
                </div>
              </div>
              <Switch
                checked={preferences ? Boolean(preferences.emailEnabled ?? 1) : true}
                onCheckedChange={(val) => handleToggle("emailEnabled", val)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal & Platform Policies */}
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Legal &amp; Platform Policies</CardTitle>
                <CardDescription className="text-xs">
                  Review terms of service, consumer rights, data privacy protocols, and partner covenants.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">User Terms &amp; Conditions</h4>
                <p className="text-xs text-muted-foreground">General marketplace rules, consumer rights &amp; refund guidelines</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/legal/ezy1-user-terms-and-conditions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
                <a
                  href="/legal/ezy1-user-terms-and-conditions.pdf"
                  download="EZY1_User_Terms_and_Conditions.pdf"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Universal Privacy Policy</h4>
                <p className="text-xs text-muted-foreground">DPDP Act 2023 compliance, data retention &amp; grievance redressal</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/legal/ezy1-universal-privacy-policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
                <a
                  href="/legal/ezy1-universal-privacy-policy.pdf"
                  download="EZY1_Universal_Privacy_Policy.pdf"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Master Partner Agreement</h4>
                <p className="text-xs text-muted-foreground">Framework for merchants, vendors, transport operators &amp; professionals</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/legal/ezy1-master-partner-agreement.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
                <a
                  href="/legal/ezy1-master-partner-agreement.pdf"
                  download="EZY1_Master_Partner_Agreement.pdf"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Users,
  Zap,
  Radio,
  FileText,
  Clock,
  Filter,
  Search,
  Inbox,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";

export function NotificationsBroadcastAdmin() {
  const [stats, setStats] = useState<any>({
    brevo: { active: true, credits: 300, email: "support@ezy1.site", plan: "Free (Marketing)" },
    msg91: { active: true, provider: "MSG91 DLT Gateway" },
    razorpay: { active: true, keyId: "rzp_test_TczDqkkmBd54pY" }
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Email Broadcaster State
  const [emailSubject, setEmailSubject] = useState("Exclusive 20% OFF on All Essentials — EZY1 Flash Sale!");
  const [emailContent, setEmailContent] = useState(
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
  <div style="background: #FF5100; color: #fff; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">EZY1 Flash Sale is Live!</h1>
    <p style="margin: 5px 0 0 0;">Everything You Need, One Platform</p>
  </div>
  <div style="padding: 24px; color: #333; line-height: 1.6;">
    <p>Dear Valued Customer,</p>
    <p>Enjoy up to <strong>20% discount</strong> on all daily groceries, fresh produce, home services, and healthcare bookings today!</p>
    <div style="text-align: center; margin: 25px 0;">
      <a href="https://ezy1.site" style="background: #FF5100; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Shop Now on EZY1</a>
    </div>
  </div>
</div>`
  );
  const [emailAudience, setEmailAudience] = useState<"all" | "partners" | "custom">("all");
  const [customEmails, setCustomEmails] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // SMS Broadcaster State
  const [smsMessage, setSmsMessage] = useState(
    "Special offer on EZY1! Flat Rs.100 OFF on your next grocery order. Use code FESTIVE100 at https://ezy1.site"
  );
  const [smsAudience, setSmsAudience] = useState<"all" | "partners" | "custom">("all");
  const [customPhones, setCustomPhones] = useState("");
  const [isSendingSms, setIsSendingSms] = useState(false);

  // Instant Test Terminal State
  const [testEmailAddress, setTestEmailAddress] = useState("anyanant7115@gmail.com");
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState("9876543210");
  const [isSendingTestSms, setIsSendingTestSms] = useState(false);

  // Campaign History Log
  const [campaignHistory, setCampaignHistory] = useState<any[]>([
    {
      id: "cmp_001",
      type: "EMAIL",
      title: "Welcome to EZY1 Verified Platform",
      audience: "All Users & Partners",
      recipients: 12,
      status: "DELIVERED",
      time: "Just now"
    }
  ]);

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState<"campaigns" | "audit_logs" | "feedbacks">("campaigns");

  // Email Audit Logs State
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [logFilterType, setLogFilterType] = useState<string>("all");
  const [logFilterStatus, setLogFilterStatus] = useState<string>("all");
  const [logSearch, setLogSearch] = useState<string>("");
  const [senderIdentities, setSenderIdentities] = useState<any>({});

  // ImprovX Customer Feedbacks State
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch("/api/admin/marketing/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn("Failed to load marketing stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchEmailLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch("/api/admin/email/logs");
      if (res.ok) {
        const data = await res.json();
        setEmailLogs(data.logs || []);
        if (data.senders) setSenderIdentities(data.senders);
      }
    } catch (err) {
      console.warn("Failed to load email logs:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const fetchFeedbacks = async () => {
    setIsLoadingFeedbacks(true);
    try {
      const res = await fetch("/api/admin/email/feedbacks");
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data.feedbacks || []);
      }
    } catch (err) {
      console.warn("Failed to load feedbacks:", err);
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchEmailLogs();
    fetchFeedbacks();
  }, []);

  const handleSendBroadcastEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast.error("Subject and HTML content are required.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const recipientsArray = customEmails
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.includes("@"));

      const res = await fetch("/api/admin/marketing/broadcast-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          htmlContent: emailContent,
          audience: emailAudience,
          customRecipients: recipientsArray,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch broadcast email");
      }

      toast.success(data.message || `Dispatched to ${data.recipientCount} recipients!`);
      setCampaignHistory((prev) => [
        {
          id: `cmp_${Date.now()}`,
          type: "EMAIL",
          title: emailSubject,
          audience: emailAudience.toUpperCase(),
          recipients: data.recipientCount || 1,
          status: "DELIVERED",
          time: "Just now",
        },
        ...prev,
      ]);
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || "Email broadcast failed");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendBroadcastSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim()) {
      toast.error("SMS message text is required.");
      return;
    }

    setIsSendingSms(true);
    try {
      const phonesArray = customPhones
        .split(",")
        .map((s) => s.trim().replace(/[^0-9]/g, ""))
        .filter((s) => s.length >= 10);

      const res = await fetch("/api/admin/marketing/broadcast-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: smsMessage,
          audience: smsAudience,
          customPhones: phonesArray,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch broadcast SMS");
      }

      toast.success(data.message || "SMS broadcast dispatched!");
      setCampaignHistory((prev) => [
        {
          id: `cmp_${Date.now()}`,
          type: "SMS",
          title: smsMessage.slice(0, 35) + "...",
          audience: smsAudience.toUpperCase(),
          recipients: data.recipientCount || 1,
          status: "SENT",
          time: "Just now",
        },
        ...prev,
      ]);
    } catch (err: any) {
      toast.error(err.message || "SMS broadcast failed");
    } finally {
      setIsSendingSms(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress || !testEmailAddress.includes("@")) {
      toast.error("Enter a valid test email address.");
      return;
    }
    setIsSendingTestEmail(true);
    try {
      const res = await fetch("/api/admin/marketing/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmailAddress,
          subject: "EZY1 Notification Gateway Verification Test",
          message: "<p>Congratulations! Real email dispatch from <strong>support@ezy1.site</strong> via Brevo REST API is 100% active and operational.</p>",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Test email delivered to ${testEmailAddress}!`);
      } else {
        toast.error(data.error || "Test email failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error sending test email");
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleSendTestSms = async () => {
    if (!testPhoneNumber) {
      toast.error("Enter a 10-digit phone number.");
      return;
    }
    setIsSendingTestSms(true);
    try {
      const res = await fetch("/api/admin/marketing/test-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: testPhoneNumber,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Test SMS dispatched to ${testPhoneNumber}!`);
      } else {
        toast.error(data.error || "Test SMS failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error sending test SMS");
    } finally {
      setIsSendingTestSms(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Notifications &amp; Marketing Broadcast Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Live Razorpay payment portal, transactional order alerts, Brevo bulk ad mail, and MSG91 broadcast engine.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchStats}
          disabled={isLoadingStats}
          className="rounded-xl text-xs gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? "animate-spin" : ""}`} />
          Refresh Gateway Status
        </Button>
      </div>

      {/* 1. Live Gateways Status Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Razorpay Gateway */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground">Razorpay Gateway</span>
                <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Runnable (Live)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                Key: {stats?.razorpay?.keyId || "rzp_test_TczDqkkmBd54pY"}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                UPI, QR, Cards, Netbanking Active
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Brevo Email Gateway */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground">Brevo Email Engine</span>
                <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Active ({stats?.brevo?.credits ?? 300} credits)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Sender: <strong className="text-foreground">support@ezy1.site</strong>
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Owner: anyanant7115@gmail.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* MSG91 SMS Gateway */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground">MSG91 SMS Gateway</span>
                <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  DLT Connected
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                AuthKey: <span className="font-mono">572045...15P1</span>
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                High-Speed OTP &amp; SMS Route Active
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={activeTab === "campaigns" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("campaigns")}
            className="rounded-xl text-xs gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            Broadcast Campaigns &amp; Testing
          </Button>
          <Button
            type="button"
            variant={activeTab === "audit_logs" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveTab("audit_logs");
              fetchEmailLogs();
            }}
            className="rounded-xl text-xs gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            Email Delivery Audit ({emailLogs.length})
          </Button>
          <Button
            type="button"
            variant={activeTab === "feedbacks" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveTab("feedbacks");
              fetchFeedbacks();
            }}
            className="rounded-xl text-xs gap-1.5"
          >
            <Inbox className="w-3.5 h-3.5" />
            Customer Inbound Replies ({feedbacks.length})
          </Button>
        </div>

        {activeTab === "audit_logs" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchEmailLogs}
            disabled={isLoadingLogs}
            className="rounded-xl text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? "animate-spin" : ""}`} />
            Refresh Logs
          </Button>
        )}
        {activeTab === "feedbacks" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchFeedbacks}
            disabled={isLoadingFeedbacks}
            className="rounded-xl text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFeedbacks ? "animate-spin" : ""}`} />
            Refresh Inbound
          </Button>
        )}
      </div>

      {/* VIEW 1: CAMPAIGNS & LIVE TESTING */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
      {/* 2. Main Broadcast Consoles: Email & SMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Broadcaster */}
        <Card className="rounded-3xl border-border bg-card shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-display font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  EZY1 Ad &amp; Bulk Email Campaign
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Broadcast marketing promotions &amp; newsletters via verified sender support@ezy1.site.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                Brevo REST v3
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSendBroadcastEmail} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Subject Line *</Label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="rounded-xl text-xs"
                  placeholder="e.g. 20% OFF on All Grocery & Health Essentials!"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Target Audience</Label>
                  <span className="text-[11px] text-muted-foreground">
                    {emailAudience === "all" ? "All Customers & Partners" : emailAudience === "partners" ? "Verified Merchants Only" : "Custom List"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailAudience("all")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      emailAudience === "all" ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailAudience("partners")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      emailAudience === "partners" ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    Partners Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailAudience("custom")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      emailAudience === "custom" ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    Custom List
                  </button>
                </div>
              </div>

              {emailAudience === "custom" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Recipient Emails (Comma Separated)</Label>
                  <Input
                    value={customEmails}
                    onChange={(e) => setCustomEmails(e.target.value)}
                    className="rounded-xl text-xs font-mono"
                    placeholder="customer1@gmail.com, partner2@gmail.com"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Email HTML Body / Template</Label>
                  <span className="text-[11px] text-muted-foreground">Responsive HTML Supported</span>
                </div>
                <Textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={6}
                  className="rounded-xl text-xs font-mono"
                  placeholder="Enter HTML content or paste message..."
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSendingEmail}
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5"
              >
                {isSendingEmail ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Dispatching Campaign...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Send Live Bulk Ad Campaign Now
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* SMS Broadcaster */}
        <Card className="rounded-3xl border-border bg-card shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-display font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  EZY1 Promotional &amp; Bulk SMS Broadcast
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Send instant promotional or transactional text messages to customers via MSG91.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                MSG91 Gateway
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSendBroadcastSms} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Target Mobile Audience</Label>
                  <span className="text-[11px] text-muted-foreground">
                    {smsAudience === "all" ? "All Verified Mobile Users" : smsAudience === "partners" ? "Merchant Phones Only" : "Custom Mobile Numbers"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSmsAudience("all")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      smsAudience === "all" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 font-bold" : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmsAudience("partners")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      smsAudience === "partners" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 font-bold" : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    Partners
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmsAudience("custom")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      smsAudience === "custom" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 font-bold" : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    Custom Phones
                  </button>
                </div>
              </div>

              {smsAudience === "custom" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">10-Digit Mobile Numbers (Comma Separated)</Label>
                  <Input
                    value={customPhones}
                    onChange={(e) => setCustomPhones(e.target.value)}
                    className="rounded-xl text-xs font-mono"
                    placeholder="9876543210, 9988776655"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">SMS Message Text *</Label>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {smsMessage.length} chars (approx {Math.ceil(smsMessage.length / 160) || 1} SMS)
                  </span>
                </div>
                <Textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={6}
                  className="rounded-xl text-xs"
                  placeholder="Type your promotional SMS alert here..."
                  required
                />
              </div>

              <div className="p-3 bg-muted/40 rounded-xl text-[11px] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>India DLT header &amp; compliant transactional route automatically applied.</span>
              </div>

              <Button
                type="submit"
                disabled={isSendingSms}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5"
              >
                {isSendingSms ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Broadcasting SMS...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Broadcast Real SMS Now
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 3. Instant Live Test Terminal */}
      <Card className="rounded-3xl border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-display font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Instant Live Gateway Verification Terminal
          </CardTitle>
          <CardDescription className="text-xs">
            Send live single test email or SMS to verify real-world inbox and handset delivery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Email */}
            <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-bold text-xs text-foreground">Test Live Email Delivery</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="rounded-xl text-xs font-mono flex-1"
                  placeholder="your-email@gmail.com"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail}
                  className="rounded-xl text-xs font-semibold bg-primary text-primary-foreground"
                >
                  {isSendingTestEmail ? "Sending..." : "Send Test Email"}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Sends real message from <strong>support@ezy1.site</strong> over Brevo REST API.
              </p>
            </div>

            {/* Test SMS */}
            <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-foreground">Test Live SMS / OTP Delivery</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  className="rounded-xl text-xs font-mono flex-1"
                  placeholder="10-digit mobile number"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSendTestSms}
                  disabled={isSendingTestSms}
                  className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSendingTestSms ? "Sending..." : "Send Test SMS"}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Sends real SMS via <strong>MSG91 AuthKey 572045...15P1</strong> to Indian telecom networks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Campaign History Log */}
      <Card className="rounded-3xl border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-display font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Recent Marketing Broadcast History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 font-semibold">Campaign Title / Snippet</th>
                  <th className="pb-2 font-semibold">Audience</th>
                  <th className="pb-2 font-semibold">Recipients</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Dispatched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {campaignHistory.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5">
                      <Badge variant="outline" className={`text-[10px] ${c.type === "EMAIL" ? "text-primary border-primary/30" : "text-emerald-600 border-emerald-500/30"}`}>
                        {c.type}
                      </Badge>
                    </td>
                    <td className="py-2.5 font-medium text-foreground max-w-xs truncate">
                      {c.title}
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {c.audience}
                    </td>
                    <td className="py-2.5 font-mono font-semibold text-foreground">
                      {c.recipients}
                    </td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" /> {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {c.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )}

  {/* VIEW 2: EMAIL AUDIT & DELIVERY LOGS */}
  {activeTab === "audit_logs" && (
    <div className="space-y-6">
      {/* Sender Domain Identities Badge Row */}
      <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
        <div className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Authenticated Sender Identities (ezy1.site Domain)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <div className="p-2 rounded-xl bg-muted/40 border border-border text-center">
            <span className="text-[10px] text-muted-foreground block">Customer Support</span>
            <span className="text-[11px] font-mono font-bold text-foreground">support@ezy1.site</span>
          </div>
          <div className="p-2 rounded-xl bg-muted/40 border border-border text-center">
            <span className="text-[10px] text-muted-foreground block">Orders &amp; Bookings</span>
            <span className="text-[11px] font-mono font-bold text-foreground">orders@ezy1.site</span>
          </div>
          <div className="p-2 rounded-xl bg-muted/40 border border-border text-center">
            <span className="text-[10px] text-muted-foreground block">OTP &amp; Security</span>
            <span className="text-[11px] font-mono font-bold text-foreground">no-reply@ezy1.site</span>
          </div>
          <div className="p-2 rounded-xl bg-muted/40 border border-border text-center">
            <span className="text-[10px] text-muted-foreground block">Team Operations</span>
            <span className="text-[11px] font-mono font-bold text-foreground">team@ezy1.site</span>
          </div>
          <div className="p-2 rounded-xl bg-muted/40 border border-border text-center">
            <span className="text-[10px] text-muted-foreground block">System Admin</span>
            <span className="text-[11px] font-mono font-bold text-foreground">admin@ezy1.site</span>
          </div>
          <div className="p-2 rounded-xl bg-muted/40 border border-border text-center">
            <span className="text-[10px] text-muted-foreground block">Management</span>
            <span className="text-[11px] font-mono font-bold text-foreground">owner@ezy1.site</span>
          </div>
          <div className="p-2 rounded-xl bg-muted/40 border border-border text-center">
            <span className="text-[10px] text-muted-foreground block">Ad Campaigns</span>
            <span className="text-[11px] font-mono font-bold text-foreground">offers@ezy1.site</span>
          </div>
        </div>
      </Card>

      {/* Filters Bar */}
      <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Filter by recipient, subject or order ID..."
              className="pl-8 text-xs rounded-xl"
            />
          </div>

          <select
            value={logFilterType}
            onChange={(e) => setLogFilterType(e.target.value)}
            className="text-xs rounded-xl border border-input bg-background px-3 py-2 font-medium"
          >
            <option value="all">All Email Types</option>
            <option value="OTP">OTP &amp; Authentication</option>
            <option value="ORDER_CONFIRMATION">Order Confirmations</option>
            <option value="PAYMENT_FAILED">Payment Failures</option>
            <option value="BOOKING_CONFIRMED">Booking Confirmations</option>
            <option value="PARTNER_REGISTRATION">Partner Applications</option>
            <option value="SUPPORT_TICKET">Support Tickets</option>
            <option value="PROMOTIONAL_OFFER">Promotional Offers</option>
          </select>

          <select
            value={logFilterStatus}
            onChange={(e) => setLogFilterStatus(e.target.value)}
            className="text-xs rounded-xl border border-input bg-background px-3 py-2 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent / Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed / Transport Error</option>
            <option value="suppressed">Suppressed (Duplicate / Idempotent)</option>
          </select>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card className="rounded-3xl border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-display font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Central Email Service Audit &amp; Event Logs
              </CardTitle>
              <CardDescription className="text-xs">
                Every transactional and marketing email dispatched through central service with zero API key exposure.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {emailLogs.length} Events Logged
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {emailLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No email audit logs found yet. Dispatches will automatically stream here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-2 font-semibold">Time</th>
                    <th className="pb-2 font-semibold">Type</th>
                    <th className="pb-2 font-semibold">Recipient</th>
                    <th className="pb-2 font-semibold">Sender Identity</th>
                    <th className="pb-2 font-semibold">Subject</th>
                    <th className="pb-2 font-semibold">Reference</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {emailLogs
                    .filter((log) => {
                      if (logFilterType !== "all" && log.type !== logFilterType) return false;
                      if (logFilterStatus !== "all" && log.status !== logFilterStatus) return false;
                      if (logSearch) {
                        const term = logSearch.toLowerCase();
                        return (
                          (log.recipient || "").toLowerCase().includes(term) ||
                          (log.subject || "").toLowerCase().includes(term) ||
                          (log.orderId || "").toLowerCase().includes(term)
                        );
                      }
                      return true;
                    })
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 text-muted-foreground font-mono whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </td>
                        <td className="py-2.5">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {log.type}
                          </Badge>
                        </td>
                        <td className="py-2.5 font-mono font-medium text-foreground">
                          {log.recipient}
                        </td>
                        <td className="py-2.5 text-[11px] font-mono text-muted-foreground">
                          {log.sender || "support@ezy1.site"}
                        </td>
                        <td className="py-2.5 font-medium text-foreground max-w-xs truncate">
                          {log.subject}
                        </td>
                        <td className="py-2.5 font-mono text-[11px] text-muted-foreground">
                          {log.orderId ? `Order #${log.orderId}` : log.userId ? `User #${log.userId}` : "—"}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                              log.status === "delivered" || log.status === "sent"
                                ? "text-emerald-600"
                                : log.status === "suppressed"
                                ? "text-amber-500"
                                : "text-rose-500"
                            }`}
                          >
                            {log.status === "delivered" || log.status === "sent" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : log.status === "suppressed" ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {log.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )}

  {/* VIEW 3: CUSTOMER INBOUND REPLIES (IMPROVX) */}
  {activeTab === "feedbacks" && (
    <div className="space-y-6">
      <Card className="rounded-3xl border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-display font-bold flex items-center gap-2">
                <Inbox className="w-4 h-4 text-primary" />
                Customer Inbound Feedback &amp; Replies (ImprovX Gateway)
              </CardTitle>
              <CardDescription className="text-xs">
                Inbound customer emails delivered to support@ezy1.site and captured via ImprovX API.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono text-emerald-600 border-emerald-500/30">
              ImprovX API Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {feedbacks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold text-foreground">No customer inbound feedback received yet</p>
              <p className="text-[11px] mt-1 max-w-md mx-auto">
                When customers reply to order confirmations or support emails sent from support@ezy1.site, ImprovX webhook routes their responses here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((fb, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground font-mono">{fb.sender}</span>
                      {fb.orderId && (
                        <Badge variant="secondary" className="text-[10px]">
                          Order #{fb.orderId}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {new Date(fb.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground">{fb.subject}</div>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {fb.body}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <a
                      href={`mailto:${fb.sender}?subject=Re: ${encodeURIComponent(fb.subject)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      Reply via support@ezy1.site <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )}
    </div>
  );
}

import React, { useState } from "react";
import Layout from "../components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Mail,
  AlertTriangle,
  Download,
  Printer,
  ExternalLink,
  Search,
  CheckCircle2,
  FileText,
  Lock,
  PhoneCall,
  Sparkles,
  Building,
  ChevronRight,
  Send
} from "lucide-react";
import { toast } from "sonner";

interface NoticeItem {
  id: string;
  refNo: string;
  title: string;
  category: "security" | "partner" | "general" | "compliance";
  date: string;
  isImportant?: boolean;
  summary: string;
  content?: string;
}

const NOTICES: NoticeItem[] = [
  {
    id: "notice-001",
    refNo: "EZY1/SEC/2026/09-AUTH",
    title: "Official Public Advisory: Verified Sender Brand & Communication Directory",
    category: "security",
    date: "September 24, 2026 (Active & Ongoing)",
    isImportant: true,
    summary:
      "All legitimate email communications from EZY1 originate strictly from authenticated addresses ending in @ezy1.site protected by SPF, DKIM, and DMARC encryption.",
  },
  {
    id: "notice-002",
    refNo: "EZY1/PRT/2026/08-KYC",
    title: "Merchant & Service Partner Quality Standards & KYC Guidelines",
    category: "partner",
    date: "September 15, 2026",
    summary:
      "Mandatory adherence to genuine pricing, food hygiene, prescription verification for pharmacies, and licensed driver dispatch on EZY1 ecosystem.",
  },
  {
    id: "notice-003",
    refNo: "EZY1/GOV/2026/08-PAY",
    title: "Customer Protection Notice: No OTP or Sensitive PIN Sharing Advisory",
    category: "compliance",
    date: "August 28, 2026",
    summary:
      "EZY1 customer service representatives will never ask for your account password, UPI PIN, or 6-digit OTP code over phone, email, or WhatsApp.",
  },
];

const DIRECTORY = [
  {
    dept: "Orders, Bookings & Receipts",
    email: "orders@ezy1.site",
    purpose: "Order confirmations, digital invoices, live delivery tracking, booking confirmations",
    badge: "Transactional",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200",
  },
  {
    dept: "Customer Care & Inquiries",
    email: "support@ezy1.site",
    purpose: "Customer support tickets, order assistance, refund requests, feedback",
    badge: "24/7 Helpline",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    dept: "Merchant & Partner Onboarding",
    email: "partner@ezy1.site",
    purpose: "Store registration, hospital tie-ups, fleet driver onboarding, vendor portal help",
    badge: "B2B Support",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200",
  },
  {
    dept: "Security, OTP & Password Reset",
    email: "no-reply@ezy1.site",
    purpose: "Automated 6-digit signup OTP, login verification, security alerts (Do Not Reply)",
    badge: "Automated",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200",
  },
  {
    dept: "Promotions, Offers & Deals",
    email: "offers@ezy1.site",
    purpose: "Exclusive discounts, coupon codes, festive promotions, seasonal newsletters",
    badge: "Marketing",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200",
  },
  {
    dept: "Corporate & Executive Affairs",
    email: "owner@ezy1.site",
    purpose: "Executive governance, legal inquiries, high-priority platform escalations",
    badge: "Executive",
    color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200",
  },
  {
    dept: "Platform Administration",
    email: "admin@ezy1.site",
    purpose: "System administration, merchant verification approvals, security audits",
    badge: "Internal",
    color: "text-slate-600 bg-slate-50 dark:bg-slate-900 border-slate-200",
  },
];

export default function NoticeBoardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success(`Copied ${email} to clipboard!`);
  };

  const filteredNotices = NOTICES.filter((n) => {
    if (selectedCategory !== "all" && n.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.refNo.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header Hero */}
        <section className="bg-gradient-to-b from-orange-500/10 via-background to-background border-b border-border py-12 px-4 sm:px-6">
          <div className="container max-w-6xl mx-auto space-y-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 text-xs">
                🏛️ EZY1 Official Bulletin
              </Badge>
              <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Notices
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
                  Official Public Notice Board
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Certified public advisories, authenticated communication directory, and consumer protection circulars from <strong>EZY1 Platform Technologies Pvt. Ltd.</strong>
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Notices
                </Button>
                <a
                  href="/ezy1-official-notice.jpg"
                  download="EZY1-Official-Notice-A4.jpg"
                  className="inline-flex"
                >
                  <Button size="sm" className="rounded-xl text-xs gap-1.5 bg-primary text-primary-foreground font-semibold">
                    <Download className="w-3.5 h-3.5" />
                    Download A4 Document
                  </Button>
                </a>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notices by keyword or reference..."
                  className="pl-9 rounded-xl text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <Button
                  type="button"
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="rounded-xl text-xs h-8"
                >
                  All Notices
                </Button>
                <Button
                  type="button"
                  variant={selectedCategory === "security" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("security")}
                  className="rounded-xl text-xs h-8"
                >
                  Security &amp; Fraud
                </Button>
                <Button
                  type="button"
                  variant={selectedCategory === "partner" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("partner")}
                  className="rounded-xl text-xs h-8"
                >
                  Merchants &amp; Partners
                </Button>
                <Button
                  type="button"
                  variant={selectedCategory === "compliance" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("compliance")}
                  className="rounded-xl text-xs h-8"
                >
                  Compliance
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
          {/* FEATURED NOTICE CARD */}
          <Card className="rounded-3xl border-2 border-primary/20 bg-card shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/15 via-primary/10 to-amber-500/10 p-6 sm:p-8 border-b border-border">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary text-primary-foreground">
                    FEATURED ADVISORY
                  </span>
                  <Badge variant="outline" className="text-xs font-mono">
                    Ref: EZY1/SEC/2026/09-AUTH
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  SPF • DKIM • DMARC Authenticated
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-foreground">
                Public Advisory: Verified Sender Identities &amp; Anti-Phishing Email Directory
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
                To guarantee safety across the EZY1 ecosystem, all genuine communications originate exclusively from <strong>@ezy1.site</strong>. Use this official directory to verify correspondence.
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-8">
              {/* 2-Column Document Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Official A4 Document Preview */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Certified 1-Page A4 Document
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border border-border shadow-md bg-muted/40 group">
                    <img
                      src="/EZY1_Official_Communication_Security_Notice_2026.jpeg"
                      alt="EZY1 Certified A4 Notice Document"
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <a
                        href="/EZY1_Official_Communication_Security_Notice_2026.jpeg"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Full Size View
                      </a>
                      <a
                        href="/EZY1_Official_Communication_Security_Notice_2026.jpeg"
                        download="EZY1_Official_Communication_Security_Notice_2026.jpeg"
                        className="px-3.5 py-2 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center">
                    Contains official holographic seal and background security watermark.
                  </p>
                </div>

                {/* Right Column: Interactive Directory */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Official Department Channels Directory
                    </span>
                    <span className="text-[11px] font-normal text-muted-foreground">Click email to copy</span>
                  </div>

                  <div className="space-y-2.5">
                    {DIRECTORY.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-foreground">{item.dept}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${item.color}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {item.purpose}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy(item.email)}
                            className="font-mono text-xs font-bold text-foreground hover:text-primary transition-colors underline decoration-dotted"
                            title="Click to copy"
                          >
                            {item.email}
                          </button>
                          <a
                            href={`mailto:${item.email}?subject=Inquiry to ${encodeURIComponent(item.dept)}`}
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                            title="Send email"
                          >
                            <Send className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security Advisory Guidelines */}
              <div className="pt-6 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Always Check the Domain
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Official emails always end in <strong>@ezy1.site</strong>. EZY1 never communicates from free email providers (@gmail.com, @yahoo.com).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <Lock className="w-4 h-4 text-primary" />
                    Zero Password &amp; OTP Requests
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    EZY1 support and delivery riders will <strong>never ask</strong> for your login password, UPI PIN, or 6-digit OTP code over phone or chat.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Report Suspicious Activity
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Forward suspicious emails to <strong>support@ezy1.site</strong> with subject line <em>[FRAUD REPORT]</em> for immediate incident response.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECONDARY NOTICES STREAM */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              Recent Notices &amp; Circulars
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotices.slice(1).map((n) => (
                <Card key={n.id} className="rounded-2xl border-border bg-card shadow-xs hover:border-primary/30 transition-all">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span className="font-mono text-[11px] font-semibold">{n.refNo}</span>
                      <span>{n.date}</span>
                    </div>
                    <CardTitle className="text-sm font-bold text-foreground">
                      {n.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {n.summary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import {
  Bot,
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuth } from "../lib/AuthContext";
import { setCurrentRole } from "../lib/auth";
import { useStoreData } from "../lib/storeData";
import { MOCK_WALLET_BALANCE } from "../mock-data";

import { useLocationStore } from "../lib/locationStore";
import { LocationModal } from "./location/LocationModal";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Healthcare", href: "/#healthcare" },
  { label: "Transport", href: "/#transport" },
  { label: "Partner Portal", href: "/partner-login" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const store = useStoreData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const { currentLocation } = useLocationStore();
  const [waMessages, setWaMessages] = useState<
    { from: "bot" | "user"; text: string }[]
  >([
    {
      from: "bot",
      text: 'Welcome to EZY1! 🛍️\nSend your order here. Try:\n"I want 2kg rice and 1 amul butter"',
    },
  ]);
  const [assistantMessages, setAssistantMessages] = useState<
    { from: "bot" | "user"; text: string }[]
  >([
    {
      from: "bot",
      text: "Hi! I'm your Ezy1 Assistant. I can help you find products, book services, or track your orders. How can I help you today?",
    },
  ]);
  const isMobile = useIsMobile();
  const { isAuthenticated, login, logout } = useAuth();
  const handleLogin = async () => {
    await login();
    setCurrentRole("user");
  };

  const handleLogout = () => {
    logout();
    setCurrentRole("guest");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Announcement Ticker */}
      {store.settings.enableAnnouncementBar &&
        store.settings.announcementBarText && (
          <div className="bg-primary text-primary-foreground py-1.5 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <span>{store.settings.announcementBarText}</span>
          </div>
        )}

      {/* Saffron accent bar */}
      <div className="h-1 bg-primary w-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
        <div className="container flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.logo_link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-xs">
              <span className="text-primary-foreground font-display font-black text-sm">
                e1
              </span>
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              ezy<span className="text-primary">1</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav
              className="flex items-center gap-1"
              data-ocid="nav.desktop_links"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-muted"
                  data-ocid={`nav.link.${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Global Search */}
          {!isMobile && (
            <div className="flex-1 max-w-md mx-4 relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search groceries, doctors, services..."
                className="w-full h-9 pl-9 pr-4 rounded-full bg-muted/50 border border-transparent focus:border-primary focus:bg-background transition-smooth text-sm outline-none"
              />
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Location pill */}
            <button
              type="button"
              onClick={() => setLocationDropdown(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-smooth border border-border max-w-[210px]"
              data-ocid="nav.location_toggle"
              title={currentLocation.formattedAddress}
            >
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate font-medium">
                {currentLocation.locality || currentLocation.city || "Select Location"}
              </span>
              <ChevronDown className="w-3 h-3 shrink-0" />
            </button>

            <LocationModal
              open={locationDropdown}
              onOpenChange={setLocationDropdown}
            />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" data-ocid="nav.dashboard_link">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
                    <User className="w-4 h-4" />
                    {!isMobile && <span>Dashboard</span>}
                  </Button>
                </Link>
                <Link to="/dashboard/wallet" data-ocid="nav.wallet_link">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-sm hidden sm:flex"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="text-primary font-semibold">
                      ₹{MOCK_WALLET_BALANCE.toLocaleString("en-IN")}
                    </span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 text-sm text-muted-foreground"
                  data-ocid="nav.logout_button"
                >
                  <LogOut className="w-4 h-4" />
                  {!isMobile && <span>Logout</span>}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogin}
                  className="text-sm"
                  data-ocid="nav.login_button"
                >
                  Login
                </Button>
                <Link
                  to="/partner-login"
                  className="hidden sm:block"
                  data-ocid="nav.partner_login_link"
                >
                  <Button
                    size="sm"
                    className="text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Partner
                    <Badge
                      variant="secondary"
                      className="ml-1.5 text-xs px-1.5 py-0 bg-primary-foreground/20 text-primary-foreground"
                    >
                      Join
                    </Badge>
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="nav.mobile_menu_button"
                  >
                    {mobileOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-card p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile menu header */}
                    <div className="flex items-center gap-2 p-4 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-display font-black text-sm">
                          e1
                        </span>
                      </div>
                      <span className="font-display font-bold text-xl text-foreground">
                        ezy<span className="text-primary">1</span>
                      </span>
                    </div>

                    {/* Location */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        setLocationDropdown(true);
                      }}
                      className="flex items-center gap-2.5 px-4 py-3 bg-muted/40 border-b border-border text-left hover:bg-muted/70 transition-colors w-full cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground">Deliver To</p>
                        <p className="text-sm text-foreground font-medium truncate">
                          {currentLocation.locality || currentLocation.city || "Select Location"}
                        </p>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0" />
                    </button>

                    {/* Nav links */}
                    <nav
                      className="flex flex-col p-3 gap-1"
                      data-ocid="nav.mobile_links"
                    >
                      {navLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="flex items-center px-3 py-3 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                          onClick={() => setMobileOpen(false)}
                          data-ocid={`nav.mobile_link.${link.label.toLowerCase()}`}
                        >
                          {link.label}
                        </a>
                      ))}
                      {isAuthenticated && (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-3 py-3 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_dashboard_link"
                          >
                            <User className="w-4 h-4 text-primary" />
                            My Dashboard
                          </Link>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-3 py-3 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_wallet_link"
                          >
                            <Wallet className="w-4 h-4 text-secondary" />
                            Wallet — ₹
                            {MOCK_WALLET_BALANCE.toLocaleString("en-IN")}
                          </Link>
                        </>
                      )}
                    </nav>

                    {/* Mobile auth */}
                    <div className="mt-auto p-4 border-t border-border">
                      {isAuthenticated ? (
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => {
                            handleLogout();
                            setMobileOpen(false);
                          }}
                          data-ocid="nav.mobile_logout_button"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => {
                              handleLogin();
                              setMobileOpen(false);
                            }}
                            data-ocid="nav.mobile_login_button"
                          >
                            Login / Sign Up
                          </Button>
                          <Link
                            to="/partner-login"
                            onClick={() => setMobileOpen(false)}
                          >
                            <Button
                              variant="outline"
                              className="w-full"
                              data-ocid="nav.mobile_partner_button"
                            >
                              Join as Partner
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="w-14 h-14 rounded-full shadow-elevated bg-[#25D366] hover:bg-[#20bd5a] hover:-translate-y-1 transition-transform"
            >
              <span className="text-2xl text-white">💬</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[400px] sm:w-[540px] flex flex-col p-0 border-l border-border bg-background"
          >
            <div className="p-4 border-b bg-[#075E54] text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🛒
              </div>
              <div>
                <h3 className="font-bold">Ezy1 WhatsApp Order</h3>
                <p className="text-xs opacity-90">Send a message to order</p>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#E5DDD5]">
              {waMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[80%] text-sm shadow-sm relative whitespace-pre-wrap ${msg.from === "user" ? "bg-[#DCF8C6] rounded-tr-sm" : "bg-white rounded-tl-sm"}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-[#f0f0f0]">
              <form
                className="flex items-center gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem(
                    "message",
                  ) as HTMLInputElement;
                  const msg = input.value;
                  if (!msg) return;

                  // Add user message
                  setWaMessages((prev) => [
                    ...prev,
                    { from: "user", text: msg },
                  ]);
                  input.value = "";

                  try {
                    await fetch("/api/whatsapp/webhook", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        object: "whatsapp_business_account",
                        entry: [
                          {
                            changes: [
                              {
                                value: {
                                  messages: [
                                    {
                                      from: "919999999999",
                                      text: { body: msg },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      }),
                    });

                    // Simulate bot response
                    setTimeout(() => {
                      setWaMessages((prev) => [
                        ...prev,
                        {
                          from: "bot",
                          text: `Got it! We've received your request for:\n"${msg}"\n\nWe are finding the best partner near you to fulfill this order.`,
                        },
                      ]);
                    }, 1000);
                  } catch (err) {
                    setWaMessages((prev) => [
                      ...prev,
                      {
                        from: "bot",
                        text: "Sorry, there was an error connecting to our server.",
                      },
                    ]);
                  }
                }}
              >
                <input
                  type="text"
                  name="message"
                  placeholder="Type a message"
                  className="w-full h-10 pl-4 pr-4 rounded-full border border-border bg-white focus:outline-none text-sm shadow-sm"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-[#075E54] hover:bg-[#128C7E] shrink-0"
                >
                  <span className="text-white">➤</span>
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="w-14 h-14 rounded-full shadow-elevated bg-primary hover:bg-primary/90 hover:-translate-y-1 transition-transform"
            >
              <Bot className="w-6 h-6 text-primary-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[400px] sm:w-[540px] flex flex-col p-0 border-l border-border bg-background"
          >
            <div className="p-4 border-b bg-primary text-primary-foreground flex items-center gap-3">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Ezy1 Assistant</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {assistantMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 text-sm shadow-sm relative ${msg.from === "user" ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm max-w-[80%]" : "bg-muted rounded-2xl rounded-tl-sm w-4/5"}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-card">
              <form
                className="relative flex items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem(
                    "assistantMsg",
                  ) as HTMLInputElement;
                  const msg = input.value;
                  if (!msg) return;

                  setAssistantMessages((prev) => [
                    ...prev,
                    { from: "user", text: msg },
                  ]);
                  input.value = "";

                  setTimeout(() => {
                    setAssistantMessages((prev) => [
                      ...prev,
                      {
                        from: "bot",
                        text: `I'm an AI assistant in training! I see you need help with "${msg}". I'll connect you with the right service shortly.`,
                      },
                    ]);
                  }, 1000);
                }}
              >
                <input
                  type="text"
                  name="assistantMsg"
                  placeholder="Ask me anything..."
                  className="w-full h-10 pl-4 pr-10 rounded-full border border-border bg-muted/50 focus:bg-background focus:border-primary outline-none text-sm transition-smooth"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 w-8 h-8 rounded-full text-muted-foreground hover:text-primary"
                >
                  <span className="text-lg">➤</span>
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="container px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-display font-black text-sm">
                    e1
                  </span>
                </div>
                <span className="font-display font-bold text-xl text-foreground">
                  ezy<span className="text-primary">1</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Everything App Connecting India. From daily essentials to
                digital services — all in one place for every Indian.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  🇮🇳 Made for India
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Available in Hindi & English
                </Badge>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3 text-sm">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/shop"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Browse Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    On-Demand Services
                  </Link>
                </li>
                <li>
                  <a
                    href="/#healthcare"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Healthcare & Doctors
                  </a>
                </li>
                <li>
                  <a
                    href="/#transport"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Transport & Fleet
                  </a>
                </li>
                <li>
                  <Link
                    to="/partner-login"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Partner & Merchant Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3 text-sm">
                Support & Admin
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard/wallet"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Digital Wallet & Balance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/partner-login"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Merchant Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/owner"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Owner Control Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Super Admin Console
                  </Link>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${(store.settings.whatsappNumber || "919876543210").replace(/[^0-9]/g, "")}?text=Hello%20EZY1%20Support`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
                  >
                    WhatsApp Helpline
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} EZY1. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                🔒 Secure & Trusted
              </span>
              <span className="text-xs text-muted-foreground">
                📍 Hyperlocal First
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// used in active path detection
export { navLinks };

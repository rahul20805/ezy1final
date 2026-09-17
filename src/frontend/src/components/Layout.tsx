import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import {
  Bell,
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
  ShoppingCart,
  Package,
  Calendar,
  CreditCard,
  Settings,
  History,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuth } from "../lib/AuthContext";
import { setCurrentRole } from "../lib/auth";
import { useStoreData } from "../lib/storeData";
import { MOCK_WALLET_BALANCE } from "../mock-data";
import { useNotificationStore } from "../lib/notificationStore";
import { useCartStore } from "../lib/cartStore";

import { useLocationStore } from "../lib/locationStore";
import { LocationModal } from "./location/LocationModal";
import { NAVAEIN_URL } from "../config/links";

const navLinks = [
  { label: "All Services", href: "/dashboard" },
  { label: "Quick Commerce", href: "/dashboard/commerce" },
  { label: "Hospitals & Care", href: "/hospitals" },
  { label: "Rides & Parcel", href: "/dashboard/transport" },
  { label: "Famous in City", href: "/famous" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const store = useStoreData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const { currentLocation } = useLocationStore();
  const { unreadCount } = useNotificationStore();
  const { totalItems } = useCartStore();
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
  const { isAuthenticated, user, login, logout } = useAuth();
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
              <Link to="/search" className="block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  readOnly
                  placeholder="Search products, food, doctors, services & more..."
                  className="w-full h-9 pl-9 pr-4 rounded-full bg-muted/50 border border-transparent hover:border-primary/40 cursor-pointer focus:border-primary focus:bg-background transition-smooth text-xs outline-none"
                />
              </Link>
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

            {/* Live Cart Button with Floating Item Counter */}
            <Link to="/dashboard/cart" data-ocid="nav.cart_link">
              <Button
                variant="outline"
                size="sm"
                className="relative gap-1.5 rounded-full h-9 px-3 border-border hover:border-primary/50 text-xs font-semibold"
              >
                <ShoppingCart className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline font-display font-bold">Cart</span>
                {totalItems > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground font-black text-[10px] shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                {/* Notifications Bell */}
                <Link to="/dashboard/notifications" data-ocid="nav.notifications_link">
                  <Button variant="ghost" size="sm" className="relative p-2 rounded-full h-9 w-9" title="Notifications">
                    <Bell className="w-4 h-4 text-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[15px] h-3.5 px-1 rounded-full bg-rose-500 text-white font-bold text-[8px] animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* Unified Customer Navigation Dropdown (8 Essential Sections) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full h-9 px-3 border-border hover:border-primary/50 text-xs font-semibold"
                      data-ocid="nav.user_dropdown_trigger"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="max-w-[100px] truncate hidden sm:inline font-display">
                        {user?.name?.split(" ")[0] || "My Account"}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 p-1.5 shadow-elevated rounded-2xl border-border bg-card">
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="text-xs font-bold text-foreground truncate">{user?.name || "Customer Account"}</div>
                      <div className="text-[11px] text-muted-foreground font-mono truncate">{user?.phone || user?.email || "customer@ezy1.in"}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* 1. Wallet */}
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/wallet" className="flex items-center justify-between px-3 py-2 cursor-pointer rounded-xl text-xs font-semibold">
                        <span className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-amber-500" />
                          Wallet
                        </span>
                        <Badge variant="secondary" className="text-[10px] font-bold px-1.5 py-0 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          ₹{MOCK_WALLET_BALANCE.toLocaleString("en-IN")}
                        </Badge>
                      </Link>
                    </DropdownMenuItem>

                    {/* 2. Cart */}
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/cart" className="flex items-center justify-between px-3 py-2 cursor-pointer rounded-xl text-xs font-semibold">
                        <span className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-emerald-500" />
                          My Cart
                        </span>
                        {totalItems > 0 && (
                          <Badge variant="secondary" className="text-[10px] font-bold px-1.5 py-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {totalItems} items
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>

                    {/* 3. History / Bookings */}
                    <DropdownMenuItem asChild>
                      <Link to="/my-bookings" className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl text-xs font-semibold">
                        <History className="w-4 h-4 text-blue-500" />
                        <span>History & Bookings</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* 4. Orders */}
                    <DropdownMenuItem asChild>
                      <Link to="/my-orders" className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl text-xs font-semibold">
                        <Package className="w-4 h-4 text-indigo-500" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* 5. Payments */}
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl text-xs font-semibold">
                        <CreditCard className="w-4 h-4 text-violet-500" />
                        <span>Payments & Cards</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* 6. My Account */}
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl text-xs font-semibold">
                        <User className="w-4 h-4 text-primary" />
                        <span>My Profile & Account</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* 7. Settings */}
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl text-xs font-semibold">
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Account Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* 8. Notifications */}
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/notifications" className="flex items-center justify-between px-3 py-2 cursor-pointer rounded-xl text-xs font-semibold">
                        <span className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-purple-500" />
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                        )}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold hover:bg-rose-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleLogin}
                  className="text-xs font-bold font-display rounded-full px-4 bg-primary text-primary-foreground shadow-sm"
                  data-ocid="nav.login_button"
                >
                  Login / Sign Up
                </Button>
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
                        <div className="mt-2 pt-2 border-t border-border space-y-0.5">
                          <p className="px-3 py-1 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                            My Account & Services
                          </p>

                          {/* 1. Wallet */}
                          <Link
                            to="/dashboard/wallet"
                            className="flex items-center justify-between px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_wallet_link"
                          >
                            <span className="flex items-center gap-2.5">
                              <Wallet className="w-4 h-4 text-amber-500" />
                              Wallet
                            </span>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                              ₹{MOCK_WALLET_BALANCE.toLocaleString("en-IN")}
                            </span>
                          </Link>

                          {/* 2. Cart */}
                          <Link
                            to="/dashboard/cart"
                            className="flex items-center justify-between px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_cart_link"
                          >
                            <span className="flex items-center gap-2.5">
                              <ShoppingCart className="w-4 h-4 text-emerald-500" />
                              My Cart
                            </span>
                            {totalItems > 0 && (
                              <Badge className="text-[10px] font-bold px-1.5 py-0 bg-primary">
                                {totalItems}
                              </Badge>
                            )}
                          </Link>

                          {/* 3. History */}
                          <Link
                            to="/my-bookings"
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_bookings_link"
                          >
                            <History className="w-4 h-4 text-blue-500" />
                            History & Bookings
                          </Link>

                          {/* 4. Orders */}
                          <Link
                            to="/my-orders"
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_orders_link"
                          >
                            <Package className="w-4 h-4 text-indigo-500" />
                            My Orders
                          </Link>

                          {/* 5. Payments */}
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_payments_link"
                          >
                            <CreditCard className="w-4 h-4 text-violet-500" />
                            Payments & Cards
                          </Link>

                          {/* 6. My Account */}
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_dashboard_link"
                          >
                            <User className="w-4 h-4 text-primary" />
                            Profile & Account
                          </Link>

                          {/* 7. Settings */}
                          <Link
                            to="/dashboard/settings"
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_settings_link"
                          >
                            <Settings className="w-4 h-4 text-slate-500" />
                            Account Settings
                          </Link>

                          {/* 8. Notifications */}
                          <Link
                            to="/dashboard/notifications"
                            className="flex items-center justify-between px-3 py-2.5 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth"
                            onClick={() => setMobileOpen(false)}
                            data-ocid="nav.mobile_notifications_link"
                          >
                            <span className="flex items-center gap-2.5">
                              <Bell className="w-4 h-4 text-purple-500" />
                              Notifications
                            </span>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                                {unreadCount}
                              </Badge>
                            )}
                          </Link>
                        </div>
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
                  <a
                    href={NAVAEIN_URL}
                    className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-1.5"
                  >
                    <span>NavaeIn — Art • Craft</span>
                    <span className="text-[10px] text-orange-500 font-bold">↗</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Business & Support */}
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3 text-sm">
                Business & Support
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
                  <a
                    href={`https://wa.me/${(store.settings.whatsappNumber || "919876543210").replace(/[^0-9]/g, "")}?text=Hello%20EZY1%20Support`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
                  >
                    WhatsApp Helpline
                  </a>
                </li>
                <li>
                  <Link
                    to="/partner-login"
                    className="text-sm font-medium text-primary hover:underline transition-colors flex items-center gap-1"
                    data-ocid="footer.partner_login_link"
                  >
                    <span>Partner Login</span>
                    <span className="text-xs">→</span>
                  </Link>
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

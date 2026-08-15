import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  Lock,
  Menu,
  Moon,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  OwnerSectionId,
  OwnerSidebar,
} from "../components/owner/OwnerSidebar";
import { CategoriesSection } from "../components/owner/sections/CategoriesSection";
import { ClassesBookingsSection } from "../components/owner/sections/ClassesBookingsSection";
import { CustomersSection } from "../components/owner/sections/CustomersSection";
import { DashboardSection } from "../components/owner/sections/DashboardSection";
import { EnquiriesSection } from "../components/owner/sections/EnquiriesSection";
import { GallerySection } from "../components/owner/sections/GallerySection";
import { InventorySection } from "../components/owner/sections/InventorySection";
import { OrdersSection } from "../components/owner/sections/OrdersSection";
import { OwnerSettingsSection } from "../components/owner/sections/OwnerSettingsSection";
import { ReviewsSection } from "../components/owner/sections/ReviewsSection";
import { ServicesSection } from "../components/owner/sections/ServicesSection";
import { WebsiteContentSection } from "../components/owner/sections/WebsiteContentSection";
import { usePartnerAuth } from "../lib/partnerAuthStore";
import { useStoreData } from "../lib/storeData";

export default function OwnerPortalPage() {
  const navigate = useNavigate();
  const store = useStoreData();
  const { currentPartner, partners, login, logout, isAuthenticated } = usePartnerAuth();

  const [currentSection, setCurrentSection] = useState<OwnerSectionId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // If partner is not logged in, redirect to login
  if (!isAuthenticated || !currentPartner) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-card border border-border text-center shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold">Partner Access Required</h2>
          <p className="text-xs text-muted-foreground">
            Please log in with your assigned Partner or Master Owner credentials to access the management portal.
          </p>
          <Button
            onClick={() => navigate({ to: "/partner-login" })}
            className="w-full rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Go to Partner Login
          </Button>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardSection onNavigateSection={(sec) => setCurrentSection(sec)} />;
      case "inventory":
        return <InventorySection />;
      case "bookings":
        return <ClassesBookingsSection />;
      case "orders":
        return <OrdersSection />;
      case "enquiries":
        return <EnquiriesSection />;
      case "customers":
        return <CustomersSection />;
      case "services":
        return <ServicesSection />;
      case "gallery":
        return <GallerySection />;
      case "reviews":
        return <ReviewsSection />;
      case "content":
        return <WebsiteContentSection />;
      case "categories":
        return <CategoriesSection />;
      case "settings":
        return <OwnerSettingsSection />;
      default:
        return <DashboardSection onNavigateSection={(sec) => setCurrentSection(sec)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-row overflow-hidden antialiased selection:bg-primary/20">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <OwnerSidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Drawer Sheet */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-card border-border">
          <OwnerSidebar
            currentSection={currentSection}
            onSelectSection={(sec) => {
              setCurrentSection(sec);
              setMobileDrawerOpen(false);
            }}
            collapsed={false}
            onToggleCollapse={() => {}}
            onCloseMobile={() => setMobileDrawerOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden h-9 w-9 p-0 text-muted-foreground rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-sm sm:text-base text-foreground leading-none capitalize">
                  {currentSection.replace(/_/g, " ")}
                </h2>
                <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
                  Live Synced
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block mt-0.5">
                {currentPartner.businessName} • ID: {currentPartner.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Demo Partner Account Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs rounded-xl gap-1.5 border-border bg-card"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="truncate max-w-[110px] sm:max-w-[160px] font-semibold">
                    {currentPartner.ownerName.split(" ")[0]} ({currentPartner.id})
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-card border-border rounded-2xl p-1.5 shadow-xl">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Switch Active Partner Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {partners.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => {
                      login(p.id, p.password);
                      toast.success(`Switched to partner view: ${p.businessName}`);
                    }}
                    className={`rounded-xl text-xs flex items-center justify-between p-2 cursor-pointer ${
                      currentPartner.id === p.id ? "bg-primary/10 font-bold text-primary" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-foreground">{p.businessName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">ID: {p.id}</p>
                    </div>
                    {currentPartner.id === p.id && <span className="text-xs">✓</span>}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate({ to: "/partner-login" });
                  }}
                  className="rounded-xl text-xs text-destructive cursor-pointer"
                >
                  Log out of portal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Live Store */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Store</span>
            </a>
          </div>
        </header>

        {/* Dynamic Section Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-background/50">
          <div className="max-w-7xl mx-auto pb-12">{renderActiveSection()}</div>
        </main>
      </div>
    </div>
  );
}

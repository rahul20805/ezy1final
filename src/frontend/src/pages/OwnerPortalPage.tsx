import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  OwnerSidebar,
  type OwnerSectionId,
} from "../components/owner/OwnerSidebar";
import { DashboardSection } from "../components/owner/sections/DashboardSection";
import { InventorySection } from "../components/owner/sections/InventorySection";
import { ClassesBookingsSection } from "../components/owner/sections/ClassesBookingsSection";
import { OrdersSection } from "../components/owner/sections/OrdersSection";
import { EnquiriesSection } from "../components/owner/sections/EnquiriesSection";
import { CustomersSection } from "../components/owner/sections/CustomersSection";
import { ServicesSection } from "../components/owner/sections/ServicesSection";
import { GallerySection } from "../components/owner/sections/GallerySection";
import { ReviewsSection } from "../components/owner/sections/ReviewsSection";
import { WebsiteContentSection } from "../components/owner/sections/WebsiteContentSection";
import { CategoriesSection } from "../components/owner/sections/CategoriesSection";
import { OwnerSettingsSection } from "../components/owner/sections/OwnerSettingsSection";
import { usePartnerAuth } from "../lib/partnerAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  ShieldCheck,
  Building2,
  LogOut,
  ExternalLink,
  Lock,
} from "lucide-react";

export default function OwnerPortalPage() {
  const navigate = useNavigate();
  const { currentPartner, isAuthenticated, logout } = usePartnerAuth();
  const [currentSection, setCurrentSection] = useState<OwnerSectionId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // RBAC Guard
  const role = (currentPartner?.role || "").toUpperCase();
  const isAuthorized =
    isAuthenticated &&
    (role === "OWNER" ||
      role === "SUPER_OWNER" ||
      role === "ADMIN" ||
      role === "SUPER_ADMIN");

  if (!isAuthorized && typeof window !== "undefined") {
    // If partner is logged in but not an owner/admin, redirect to their default dashboard
    if (isAuthenticated && currentPartner) {
      return (
        <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-card border border-border text-center shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Owner Access Restricted</h2>
            <p className="text-xs text-muted-foreground">
              Your partner account ({currentPartner.partnerUserId}) does not have Platform Owner privileges.
            </p>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => navigate({ to: "/partner-dashboard" })}
                className="flex-1 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Go to Partner Portal
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate({ to: "/partner-login" });
                }}
                className="flex-1 rounded-xl"
              >
                Sign In as Owner
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  const renderSection = () => {
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
    <div className="h-screen max-h-screen bg-background flex flex-row overflow-hidden antialiased selection:bg-primary/20">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block flex-shrink-0 h-screen overflow-hidden">
        <OwnerSidebar
          currentSection={currentSection}
          onSelectSection={(sec) => setCurrentSection(sec)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer Sheet */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex w-72 flex-col bg-card border-r border-border p-0 shadow-2xl z-10">
            <OwnerSidebar
              currentSection={currentSection}
              onSelectSection={(sec) => {
                setCurrentSection(sec);
                setMobileSidebarOpen(false);
              }}
              collapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Administrative Control Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Operational Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden h-9 w-9 p-0 text-muted-foreground rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h2 className="font-display font-bold text-sm sm:text-base text-foreground leading-none capitalize">
                  {currentSection.replace(/_/g, " ")}
                </h2>
                <Badge
                  variant="outline"
                  className="text-[10px] hidden sm:inline-flex text-amber-600 border-amber-300 bg-amber-500/10 font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 animate-pulse" />
                  Owner Control Centre
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block mt-0.5">
                {currentPartner?.businessName || "EZY1 Platform Headquarters"} • ID: {currentPartner?.partnerUserId || "EZY-P-10000"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/dashboard"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Store</span>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate({ to: "/partner-login" });
              }}
              className="h-8 text-xs rounded-xl gap-1.5 border-border bg-card shadow-xs text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-background/50">
          <div className="max-w-7xl mx-auto pb-12">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}

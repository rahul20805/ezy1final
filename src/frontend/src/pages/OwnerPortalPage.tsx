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
  ChevronRight,
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
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <ShieldCheck className="w-12 h-12 text-amber-500 mb-4" />
          <h1 className="text-xl font-bold">Owner Access Restricted</h1>
          <p className="text-slate-400 text-sm max-w-md mt-2">
            Your partner account ({currentPartner.partnerUserId}) does not have Platform Owner privileges.
          </p>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => navigate({ to: "/partner-dashboard" })}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Partner Portal
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate({ to: "/partner-login" });
              }}
            >
              Sign In as Owner
            </Button>
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
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Desktop & Collapsible Sidebar */}
      <div
        className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <OwnerSidebar
          currentSection={currentSection}
          onSelectSection={(sec) => setCurrentSection(sec)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex w-72 flex-col bg-slate-900 border-r border-slate-800 p-0 shadow-2xl z-10">
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

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <h1 className="font-semibold text-slate-100 text-sm sm:text-base tracking-wide">
                Owner Control Centre
              </h1>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex text-[10px] tracking-wider uppercase bg-indigo-950/60 border-indigo-700/60 text-indigo-300 font-semibold px-2 py-0.5"
              >
                Super Owner
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 border border-slate-800 bg-slate-800/40 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentPartner?.businessName || "EZY1 Platform Owner"}</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-300">{currentPartner?.partnerUserId || "EZY-P-10000"}</span>
            </div>

            <Link
              to="/dashboard"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-800 transition"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate({ to: "/partner-login" });
              }}
              className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Section View Container */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}

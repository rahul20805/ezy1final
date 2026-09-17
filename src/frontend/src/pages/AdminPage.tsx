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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ChevronDown,
  ExternalLink,
  Lock,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

// Sidebar & Types
import {
  type AdminSectionId,
  AdminSidebar,
} from "../components/admin/AdminSidebar";

// 1. Main Modules
import { AnalyticsModule } from "../components/admin/modules/main/AnalyticsModule";
import { DashboardHome } from "../components/admin/modules/main/DashboardHome";
import { LiveActivityModule } from "../components/admin/modules/main/LiveActivityModule";

// 2. Marketplace Modules
import { CartsManager } from "../components/admin/modules/marketplace/CartsManager";
import { CouponsManager } from "../components/admin/modules/marketplace/CouponsManager";
import { DealsPromotions } from "../components/admin/modules/marketplace/DealsPromotions";
import { MyInformationModule } from "../components/admin/modules/marketplace/MyInformationModule";
import { OrdersManager } from "../components/admin/modules/marketplace/OrdersManager";
import { PartnerApplications } from "../components/admin/modules/marketplace/PartnerApplications";
import { PartnersManager } from "../components/admin/modules/marketplace/PartnersManager";
import { ProductsManager } from "../components/admin/modules/marketplace/ProductsManager";
import { ShopsManager } from "../components/admin/modules/marketplace/ShopsManager";

// 3. Bookings & Services Modules
import { BookingsManager } from "../components/admin/modules/bookings/BookingsManager";
import { DoctorsManager } from "../components/admin/modules/bookings/DoctorsManager";
import { HospitalBedsManager } from "../components/admin/modules/bookings/HospitalBedsManager";
import { HospitalsManager } from "../components/admin/modules/bookings/HospitalsManager";
import { ServiceProviders } from "../components/admin/modules/bookings/ServiceProviders";
import { ServicesManager } from "../components/admin/modules/bookings/ServicesManager";
import { TransportManager } from "../components/admin/modules/bookings/TransportManager";

// 4. Customers Modules
import { CustomersManager } from "../components/admin/modules/customers/CustomersManager";
import { DisputesManager } from "../components/admin/modules/customers/DisputesManager";
import { SupportTickets } from "../components/admin/modules/customers/SupportTickets";

// 5. Delivery Modules
import { DeliveryPartners } from "../components/admin/modules/delivery/DeliveryPartners";
import { DeliveryZonesAndCharges } from "../components/admin/modules/delivery/DeliveryZonesAndCharges";
import { LiveDeliveryTracker } from "../components/admin/modules/delivery/LiveDeliveryTracker";

// 6. Content & CMS Modules
import { BannersManager } from "../components/admin/modules/content/BannersManager";
import { GiftCategories } from "../components/admin/modules/content/GiftCategories";
import { SeoManager } from "../components/admin/modules/content/SeoManager";

// 7. Finance Modules
import { CommissionsManager } from "../components/admin/modules/finance/CommissionsManager";
import { PartnerPayouts } from "../components/admin/modules/finance/PartnerPayouts";
import { PaymentsManager } from "../components/admin/modules/finance/PaymentsManager";
import { RefundsManager } from "../components/admin/modules/finance/RefundsManager";

// 8. Communication Modules
import { WhatsAppAdmin } from "../components/admin/modules/communication/WhatsAppAdmin";

// 9. Reviews & Quality Modules
import { PartnerVerification } from "../components/admin/modules/quality/PartnerVerification";
import { ReportedReviews } from "../components/admin/modules/quality/ReportedReviews";

// 10. System & Governance Modules
import { AdminUsersManager } from "../components/admin/modules/system/AdminUsersManager";
import { ApiIntegrations } from "../components/admin/modules/system/ApiIntegrations";
import { AuditLogsManager } from "../components/admin/modules/system/AuditLogsManager";

// Reused Existing Core Section Views
import { CategoriesSection } from "../components/owner/sections/CategoriesSection";
import { EnquiriesSection } from "../components/owner/sections/EnquiriesSection";
import { GallerySection } from "../components/owner/sections/GallerySection";
import { OwnerSettingsSection } from "../components/owner/sections/OwnerSettingsSection";
import { ReviewsSection } from "../components/owner/sections/ReviewsSection";
import { WebsiteContentSection } from "../components/owner/sections/WebsiteContentSection";

// Auth & Store
import { usePartnerAuth } from "../lib/partnerAuthStore";
import { useStoreData } from "../lib/storeData";

export default function AdminPage() {
  const navigate = useNavigate();
  const store = useStoreData();
  const { currentPartner, partners, login, logout, isAuthenticated } =
    usePartnerAuth();

  const [currentSection, setCurrentSection] =
    useState<AdminSectionId>("dashboard");
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
          <h2 className="text-2xl font-display font-bold">
            Admin Authorization Required
          </h2>
          <p className="text-xs text-muted-foreground">
            Please authenticate with your assigned Admin ID and Password to
            access the central platform control center.
          </p>
          <Button
            onClick={() => navigate({ to: "/partner-login" })}
            className="w-full rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Authenticate at Portal Login
          </Button>
        </div>
      </div>
    );
  }

  const role = (currentPartner.role || "").toUpperCase();
  const isAdmin =
    role === "ADMIN" ||
    role === "SUPER_ADMIN" ||
    role === "SUPER_OWNER" ||
    (currentPartner.providerType || "").toUpperCase() === "ADMIN";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-card border border-border text-center shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold">
            Access Restricted
          </h2>
          <p className="text-xs text-muted-foreground">
            Your partner account ({currentPartner.partnerUserId}) does not have Platform Administrator privileges.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => navigate({ to: "/partner-dashboard" })}
              className="flex-1 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Partner Portal
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate({ to: "/partner-login" });
              }}
              className="flex-1 rounded-xl"
            >
              Sign In as Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (currentSection) {
      // 1. Main
      case "dashboard":
        return (
          <DashboardHome onNavigateSection={(sec) => setCurrentSection(sec)} />
        );
      case "my_information":
        return <MyInformationModule />;
      case "analytics":
        return <AnalyticsModule />;
      case "live_activity":
        return <LiveActivityModule />;

      // 2. Marketplace
      case "shops":
        return <ShopsManager />;
      case "products":
        return <ProductsManager />;
      case "categories":
        return <CategoriesSection />;
      case "partners":
        return <PartnersManager />;
      case "partner_applications":
        return <PartnerApplications />;
      case "orders":
        return <OrdersManager />;
      case "abandoned_carts":
        return <CartsManager />;
      case "coupons":
        return <CouponsManager />;
      case "deals_promotions":
        return <DealsPromotions />;

      // 3. Bookings & Services
      case "bookings":
        return <BookingsManager />;
      case "services":
        return <ServicesManager />;
      case "service_providers":
        return <ServiceProviders />;
      case "transport":
        return <TransportManager />;
      case "doctors":
        return <DoctorsManager />;
      case "hospitals":
        return <HospitalsManager />;
      case "hospital_beds":
        return <HospitalBedsManager />;

      // 4. Customers
      case "customers":
        return <CustomersManager />;
      case "support_tickets":
        return <SupportTickets />;
      case "enquiries":
        return <EnquiriesSection />;
      case "disputes":
        return <DisputesManager />;

      // 5. Delivery
      case "delivery_orders":
        return <OrdersManager />;
      case "delivery_partners":
        return <DeliveryPartners />;
      case "delivery_zones":
      case "delivery_charges":
        return <DeliveryZonesAndCharges />;
      case "live_tracking":
        return <LiveDeliveryTracker />;

      // 6. Content & CMS
      case "gallery":
        return <GallerySection />;
      case "website_content":
        return <WebsiteContentSection />;
      case "banners":
        return <BannersManager />;
      case "gift_categories":
        return <GiftCategories />;
      case "faqs":
        return <WebsiteContentSection />;
      case "seo":
        return <SeoManager />;

      // 7. Finance
      case "payments":
      case "transactions":
        return <PaymentsManager />;
      case "refunds":
        return <RefundsManager />;
      case "wallet":
        return <CustomersManager />;
      case "partner_payouts":
        return <PartnerPayouts />;
      case "commissions":
        return <CommissionsManager />;

      // 8. Communication
      case "notifications":
        return <WhatsAppAdmin />;
      case "whatsapp_admin":
        return <WhatsAppAdmin />;
      case "customer_messages":
        return <SupportTickets />;

      // 9. Reviews & Quality
      case "reviews":
        return <ReviewsSection />;
      case "reported_reviews":
        return <ReportedReviews />;
      case "partner_verification":
        return <PartnerVerification />;

      // 10. System & Governance
      case "owner_settings":
        return <OwnerSettingsSection />;
      case "admin_users":
        return <AdminUsersManager />;
      case "audit_logs":
        return <AuditLogsManager />;
      case "api_integrations":
        return <ApiIntegrations />;

      default:
        return (
          <DashboardHome onNavigateSection={(sec) => setCurrentSection(sec)} />
        );
    }
  };

  return (
    <div className="h-screen max-h-screen bg-background flex flex-row overflow-hidden antialiased selection:bg-primary/20">
      {/* Desktop Persistent 10-Group Sidebar */}
      <div className="hidden md:block flex-shrink-0 h-screen overflow-hidden">
        <AdminSidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Drawer Sheet */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-card border-border">
          <AdminSidebar
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

      {/* Main Administrative Control Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Operational Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
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
                <Badge
                  variant="outline"
                  className="text-[10px] hidden sm:inline-flex text-emerald-600 border-emerald-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Live Reactive
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block mt-0.5">
                {currentPartner.businessName} • Operator ID: {currentPartner.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Authenticated Account Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs rounded-xl gap-1.5 border-border bg-card shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="truncate max-w-[120px] sm:max-w-[160px] font-semibold">
                    {(currentPartner?.ownerName || currentPartner?.businessName || "Partner").split(" ")[0]} (
                    {currentPartner?.partnerUserId || currentPartner?.id})
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 bg-card border-border rounded-2xl p-1.5 shadow-xl"
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Authenticated Session
                </DropdownMenuLabel>
                <div className="p-2 space-y-1">
                  <p className="font-semibold text-xs text-foreground">{currentPartner?.businessName}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">User ID: {currentPartner?.partnerUserId || currentPartner?.id}</p>
                  <Badge className="text-[9px] uppercase font-bold bg-primary/10 text-primary">{currentPartner?.role || "PARTNER"}</Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate({ to: "/partner-login" });
                  }}
                  className="rounded-xl text-xs text-destructive cursor-pointer font-medium"
                >
                  Log out of Partner Control Center
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Live Store Button */}
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

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-background/50">
          <div className="max-w-7xl mx-auto pb-12">{renderActiveSection()}</div>
        </main>
      </div>
    </div>
  );
}

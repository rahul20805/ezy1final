import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertOctagon,
  Award,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileCheck,
  FileCode,
  FileQuestion,
  FileSpreadsheet,
  FileText,
  Gift,
  HelpCircle,
  History,
  Home,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  LogOut,
  Map,
  MapPin,
  MessageCircle,
  MessageSquare,
  Package,
  Percent,
  Radio,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Stethoscope,
  Store,
  Tag,
  Ticket,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
  type PartnerAccount,
  usePartnerAuth,
} from "../../lib/partnerAuthStore";
import { useStoreData } from "../../lib/storeData";
import { Ezy1Logo } from "../Ezy1Logo";

export type AdminSectionId =
  // 1. Main
  | "dashboard"
  | "my_information"
  | "analytics"
  | "live_activity"
  // 2. Marketplace
  | "shops"
  | "products"
  | "categories"
  | "partners"
  | "partner_applications"
  | "orders"
  | "abandoned_carts"
  | "coupons"
  | "deals_promotions"
  // 3. Bookings & Services
  | "bookings"
  | "services"
  | "service_providers"
  | "transport"
  | "doctors"
  | "hospitals"
  | "hospital_beds"
  // 4. Customers
  | "customers"
  | "support_tickets"
  | "enquiries"
  | "disputes"
  // 5. Delivery
  | "delivery_orders"
  | "delivery_partners"
  | "delivery_zones"
  | "delivery_charges"
  | "live_tracking"
  // 6. Content
  | "gallery"
  | "website_content"
  | "banners"
  | "gift_categories"
  | "faqs"
  | "seo"
  // 7. Finance
  | "payments"
  | "transactions"
  | "refunds"
  | "wallet"
  | "partner_payouts"
  | "commissions"
  // 8. Communication
  | "notifications"
  | "whatsapp_admin"
  | "customer_messages"
  // 9. Reviews & Quality
  | "reviews"
  | "reported_reviews"
  | "partner_verification"
  // 10. System
  | "owner_settings"
  | "admin_users"
  | "audit_logs"
  | "api_integrations";

export interface NavSubItem {
  id: AdminSectionId;
  label: string;
  icon: React.ElementType;
  getBadge?: (
    store: ReturnType<typeof useStoreData.getState>,
  ) => string | number | null;
  badgeVariant?: "default" | "destructive" | "secondary" | "outline";
}

export interface NavGroup {
  name: string;
  icon: React.ElementType;
  items: NavSubItem[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    name: "Main",
    icon: LayoutDashboard,
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "my_information", label: "My Information", icon: UserCheck },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      {
        id: "live_activity",
        label: "Live Activity",
        icon: Activity,
        getBadge: (s) => s.liveEvents.length,
        badgeVariant: "default",
      },
    ],
  },
  {
    name: "Marketplace",
    icon: Store,
    items: [
      {
        id: "shops",
        label: "Inventory / Shops",
        icon: Store,
        getBadge: (s) => s.shops.length,
      },
      {
        id: "products",
        label: "Products Catalog",
        icon: Package,
        getBadge: (s) => s.products.length,
      },
      {
        id: "categories",
        label: "Categories & Taxonomy",
        icon: Layers,
        getBadge: (s) => s.categories.length,
      },
      { id: "partners", label: "Vendors & Partners", icon: UserCheck },
      {
        id: "partner_applications",
        label: "Partner Applications",
        icon: FileCheck,
        getBadge: (s) =>
          s.partnerApplications.filter(
            (a) => a.status === "PENDING" || a.status === "UNDER_REVIEW",
          ).length || null,
        badgeVariant: "destructive",
      },
      {
        id: "orders",
        label: "Orders Pipeline",
        icon: ShoppingBag,
        getBadge: (s) =>
          s.orders.filter(
            (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED",
          ).length || null,
        badgeVariant: "default",
      },
      { id: "abandoned_carts", label: "Carts & Recovery", icon: ShoppingCart },
      {
        id: "coupons",
        label: "Coupons & Discounts",
        icon: Ticket,
        getBadge: (s) => s.coupons.length,
      },
      { id: "deals_promotions", label: "Deals & Promotions", icon: Zap },
    ],
  },
  {
    name: "Bookings & Services",
    icon: Calendar,
    items: [
      {
        id: "bookings",
        label: "Classes & Bookings",
        icon: Calendar,
        getBadge: (s) => s.bookings.length,
      },
      {
        id: "services",
        label: "On-Demand Services",
        icon: Wrench,
        getBadge: (s) => s.services.length,
      },
      { id: "service_providers", label: "Service Providers", icon: Users },
      {
        id: "transport",
        label: "Transport & Fleet",
        icon: MapPin,
        getBadge: (s) => s.transportListings.length,
      },
      {
        id: "doctors",
        label: "Doctors Roster",
        icon: Stethoscope,
        getBadge: (s) => s.doctors.length,
      },
      {
        id: "hospitals",
        label: "Hospitals Directory",
        icon: Building2,
        getBadge: (s) => s.hospitals.length,
      },
      {
        id: "hospital_beds",
        label: "Hospital Beds Tracker",
        icon: Radio,
        getBadge: (s) =>
          s.hospitalBeds.reduce((acc, b) => acc + b.availableBeds, 0) + " Free",
        badgeVariant: "secondary",
      },
    ],
  },
  {
    name: "Customers",
    icon: Users,
    items: [
      {
        id: "customers",
        label: "Customer Directory",
        icon: Users,
        getBadge: (s) => s.customers.length,
      },
      {
        id: "support_tickets",
        label: "Support Tickets",
        icon: LifeBuoy,
        getBadge: (s) =>
          s.supportTickets.filter(
            (t) => t.status === "OPEN" || t.status === "IN_PROGRESS",
          ).length || null,
        badgeVariant: "destructive",
      },
      { id: "enquiries", label: "Leads & Enquiries", icon: HelpCircle },
      {
        id: "disputes",
        label: "Disputes Resolution",
        icon: ShieldAlert,
        getBadge: (s) =>
          s.disputes.filter(
            (d) => d.status === "PENDING" || d.status === "INVESTIGATING",
          ).length || null,
        badgeVariant: "destructive",
      },
    ],
  },
  {
    name: "Delivery",
    icon: Truck,
    items: [
      { id: "delivery_orders", label: "Delivery Orders", icon: Truck },
      {
        id: "delivery_partners",
        label: "Delivery Drivers",
        icon: Users,
        getBadge: (s) =>
          s.deliveryPartners.filter((d) => d.currentStatus === "ONLINE")
            .length + " Online",
        badgeVariant: "secondary",
      },
      { id: "delivery_zones", label: "Delivery Zones", icon: Map },
      { id: "delivery_charges", label: "Delivery Charges", icon: Tag },
      { id: "live_tracking", label: "Live Visual Tracker", icon: Radio },
    ],
  },
  {
    name: "Content & CMS",
    icon: ImageIcon,
    items: [
      {
        id: "gallery",
        label: "Media & Gallery",
        icon: ImageIcon,
        getBadge: (s) => s.gallery.length,
      },
      { id: "website_content", label: "Website CMS", icon: FileText },
      {
        id: "banners",
        label: "Promo Banners",
        icon: Sparkles,
        getBadge: (s) => s.heroSlides.length,
      },
      { id: "gift_categories", label: "Gift Categories", icon: Gift },
      {
        id: "faqs",
        label: "FAQs Management",
        icon: FileQuestion,
        getBadge: (s) => s.faqs.length,
      },
      { id: "seo", label: "SEO & Social Meta", icon: Search },
    ],
  },
  {
    name: "Finance",
    icon: CreditCard,
    items: [
      { id: "payments", label: "Payments & Gateway", icon: CreditCard },
      {
        id: "transactions",
        label: "Financial Ledger",
        icon: FileSpreadsheet,
        getBadge: (s) => s.transactions.length,
      },
      {
        id: "refunds",
        label: "Refunds Processing",
        icon: History,
        getBadge: (s) =>
          s.refunds.filter((r) => r.status === "PENDING").length || null,
        badgeVariant: "destructive",
      },
      { id: "wallet", label: "Digital Wallet", icon: Wallet },
      {
        id: "partner_payouts",
        label: "Partner Payouts",
        icon: TrendingUp,
        getBadge: (s) =>
          s.partnerPayouts.filter((p) => p.status === "PENDING").length || null,
        badgeVariant: "destructive",
      },
      { id: "commissions", label: "Commissions & GST", icon: Percent },
    ],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    items: [
      { id: "notifications", label: "Notifications & Alerts", icon: Bell },
      {
        id: "whatsapp_admin",
        label: "WhatsApp Business Bot",
        icon: MessageCircle,
      },
      { id: "customer_messages", label: "Customer Inbox", icon: MessageSquare },
    ],
  },
  {
    name: "Reviews & Quality",
    icon: Star,
    items: [
      {
        id: "reviews",
        label: "Reviews & Ratings",
        icon: Star,
        getBadge: (s) => s.reviews.length,
      },
      {
        id: "reported_reviews",
        label: "Reported Content",
        icon: AlertOctagon,
        getBadge: (s) => s.reviews.filter((r) => r.isReported).length || null,
        badgeVariant: "destructive",
      },
      {
        id: "partner_verification",
        label: "KYC & Verification",
        icon: ShieldCheck,
      },
    ],
  },
  {
    name: "System & Governance",
    icon: Settings,
    items: [
      { id: "owner_settings", label: "Master Owner Settings", icon: Settings },
      { id: "admin_users", label: "Admin Users & RBAC", icon: Shield },
      {
        id: "audit_logs",
        label: "Audit Logs Trail",
        icon: History,
        getBadge: (s) => s.auditLogs.length,
      },
      { id: "api_integrations", label: "API & Webhooks", icon: FileCode },
    ],
  },
];

interface AdminSidebarProps {
  currentSection: AdminSectionId;
  onSelectSection: (section: AdminSectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  currentSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  onCloseMobile,
}: AdminSidebarProps) {
  const store = useStoreData();
  const { currentPartner, logout } = usePartnerAuth();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      Main: true,
      Marketplace: true,
      "Bookings & Services": true,
      Customers: true,
      Delivery: true,
      "Content & CMS": true,
      Finance: true,
      Communication: true,
      "Reviews & Quality": true,
      "System & Governance": true,
    },
  );

  const [searchQuery, setSearchQuery] = useState("");

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const filteredGroups = ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <aside
      className={`h-screen max-h-screen bg-card border-r border-border flex flex-col transition-all duration-300 select-none z-30 shadow-sm overflow-hidden ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-border flex items-center justify-between flex-shrink-0">
        {!collapsed ? (
          <Ezy1Logo
            size="md"
            showWordmark={true}
            subtitle="Central Admin OS"
            to="/"
          />
        ) : (
          <div className="mx-auto">
            <Ezy1Logo
              size="sm"
              showWordmark={false}
              to="/"
            />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Search Bar in Sidebar */}
      {!collapsed && (
        <div className="p-3 border-b border-border/60 flex-shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Navigation Groups List - 100% Smooth Up-to-Down Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-3 custom-scrollbar space-y-4 overscroll-contain">
        {filteredGroups.map((group) => {
          const isExpanded = expandedGroups[group.name] ?? true;

          return (
            <div key={group.name} className="space-y-1">
              {!collapsed ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <group.icon className="w-3 h-3 text-primary/70" />
                    <span>{group.name}</span>
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${isExpanded ? "" : "-rotate-90 text-muted-foreground/50"}`}
                  />
                </button>
              ) : (
                <div className="h-px bg-border/60 my-2 mx-1" />
              )}

              {(isExpanded || collapsed) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = currentSection === item.id;
                    const badgeVal = item.getBadge
                      ? item.getBadge(store)
                      : null;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectSection(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-primary"
                          }`}
                        />

                        {!collapsed && (
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <span className="truncate">{item.label}</span>
                            {badgeVal !== null && badgeVal !== undefined && (
                              <Badge
                                variant={
                                  item.badgeVariant ||
                                  (isActive ? "secondary" : "outline")
                                }
                                className={`text-[9px] px-1.5 py-0 h-4 font-bold rounded-md ${
                                  isActive
                                    ? "bg-white/20 text-white border-0"
                                    : ""
                                }`}
                              >
                                {badgeVal}
                              </Badge>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin User Footer Profile */}
      <div className="p-3 border-t border-border flex-shrink-0 bg-muted/20">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                {currentPartner?.ownerName?.charAt(0) || "A"}
              </div>
              <div className="truncate">
                <p className="font-display font-bold text-xs text-foreground truncate">
                  {currentPartner?.ownerName || "Super Administrator"}
                </p>
                <span className="text-[10px] text-muted-foreground font-mono truncate block">
                  Role:{" "}
                  {currentPartner?.role?.replace(/_/g, " ") || "SUPER ADMIN"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

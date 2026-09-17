import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderTree,
  Globe,
  GraduationCap,
  HeartHandshake,
  Image,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Users,
  Wrench,
} from "lucide-react";
import type React from "react";
import {
  type PartnerAccount,
  usePartnerAuth,
} from "../../lib/partnerAuthStore";
import { useStoreData } from "../../lib/storeData";

export type OwnerSectionId =
  | "dashboard"
  | "inventory"
  | "bookings"
  | "orders"
  | "enquiries"
  | "customers"
  | "services"
  | "gallery"
  | "reviews"
  | "content"
  | "categories"
  | "settings";

interface SidebarItem {
  id: OwnerSectionId;
  label: string;
  icon: React.ElementType;
  permissionKey?: keyof PartnerAccount["permissions"];
  getBadge?: (
    store: ReturnType<typeof useStoreData.getState>,
  ) => string | number | null;
}

export const OWNER_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "inventory",
    label: "Inventory / Shop",
    icon: Package,
    permissionKey: "canManageShop",
    getBadge: (s) => s.products.length,
  },
  {
    id: "bookings",
    label: "Classes / Bookings",
    icon: GraduationCap,
    permissionKey: "canManageBookings",
    getBadge: (s) =>
      s.bookings.filter(
        (b) => b.status === "CONFIRMED" || b.status === "PENDING",
      ).length,
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    permissionKey: "canManageOrders",
    getBadge: (s) =>
      s.orders.filter((o) => o.status === "NEW" || o.status === "ACCEPTED")
        .length || null,
  },
  {
    id: "enquiries",
    label: "Enquiries & Leads",
    icon: MessageSquare,
    permissionKey: "canManageEnquiries",
    getBadge: (s) =>
      s.enquiries.filter((e) => e.status === "new").length || null,
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    permissionKey: "canManageCustomers",
    getBadge: (s) => s.customers.length,
  },
  {
    id: "services",
    label: "Services",
    icon: Wrench,
    permissionKey: "canManageServices",
    getBadge: (s) => s.services.length,
  },
  {
    id: "gallery",
    label: "Media & Gallery",
    icon: Image,
    permissionKey: "canManageGallery",
    getBadge: (s) => s.gallery.length,
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: Sparkles,
    permissionKey: "canManageReviews",
    getBadge: (s) =>
      s.reviews.filter((r) => r.status === "pending").length || null,
  },
  {
    id: "content",
    label: "Website Content",
    icon: Globe,
    permissionKey: "canManageWebsiteContent",
  },
  {
    id: "categories",
    label: "Categories",
    icon: FolderTree,
    permissionKey: "canManageCategories",
    getBadge: (s) => s.categories.length,
  },
  {
    id: "settings",
    label: "Owner Settings",
    icon: Settings,
    permissionKey: "canManageOwnerSettings",
  },
];

interface OwnerSidebarProps {
  currentSection: OwnerSectionId;
  onSelectSection: (section: OwnerSectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

export function OwnerSidebar({
  currentSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  onCloseMobile,
}: OwnerSidebarProps) {
  const { currentPartner, logout } = usePartnerAuth();
  const store = useStoreData();

  const role = (currentPartner?.role || "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN" || role === "SUPER_OWNER" || role === "super_owner";
  const pType = (currentPartner?.providerType || currentPartner?.partnerType || "GROCERY").toUpperCase();

  const availableItems = OWNER_SIDEBAR_ITEMS.filter((item) => {
    if (isAdmin) return true;
    if (item.id === "dashboard") return true;

    if (pType === "GROCERY" || pType === "VENDOR") {
      return ["dashboard", "inventory", "orders", "customers", "reviews", "settings"].includes(item.id);
    }
    if (pType === "HOSPITAL") {
      return ["dashboard", "bookings", "enquiries", "services", "reviews", "settings"].includes(item.id);
    }
    if (pType === "SERVICE_PROVIDER") {
      return ["dashboard", "services", "bookings", "enquiries", "reviews", "settings"].includes(item.id);
    }
    if (pType === "PHARMACY") {
      return ["dashboard", "inventory", "orders", "customers", "reviews", "settings"].includes(item.id);
    }
    if (pType === "RESTAURANT") {
      return ["dashboard", "inventory", "orders", "reviews", "settings"].includes(item.id);
    }
    if (pType === "DELIVERY" || pType === "DRIVER") {
      return ["dashboard", "orders", "settings"].includes(item.id);
    }

    if (Array.isArray(currentPartner?.permissions)) {
      if (currentPartner.permissions.includes("*")) return true;
      return true;
    }

    if (item.permissionKey && typeof currentPartner?.permissions === "object") {
      return currentPartner.permissions[item.permissionKey] === true;
    }

    return true;
  });

  return (
    <aside
      className={`h-screen flex flex-col bg-card border-r border-border transition-all duration-300 z-30 ${
        collapsed ? "w-16" : "w-64 sm:w-72"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-2">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display font-black text-lg shadow-sm flex-shrink-0">
              e1
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-sm text-foreground truncate leading-tight">
                {currentPartner?.businessName || store.settings.brandName}
              </h2>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-muted-foreground truncate capitalize">
                  {isAdmin
                    ? "Master Owner Portal"
                    : `${currentPartner?.providerType || currentPartner?.category || "Business"} Partner`}
                </span>
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display font-black text-lg shadow-sm mx-auto">
            e1
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="hidden sm:flex h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
        {availableItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          const badgeVal = item.getBadge ? item.getBadge(store) : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectSection(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-transform ${
                  isActive
                    ? "text-primary-foreground scale-110"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!collapsed && badgeVal !== null && (
                <Badge
                  variant={isActive ? "outline" : "secondary"}
                  className={`text-[10px] px-1.5 py-0 h-5 min-w-[20px] rounded-full flex items-center justify-center font-bold ${
                    isActive
                      ? "border-primary-foreground/40 text-primary-foreground bg-primary-foreground/15"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {badgeVal}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Partner Info & Quick Links */}
      <div className="p-3 border-t border-border space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
          title="View Live Public Store"
        >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && <span>View Public Website</span>}
        </a>

        <div
          className={`flex items-center justify-between pt-2 border-t border-border/60 ${collapsed ? "flex-col gap-2" : ""}`}
        >
          {!collapsed && (
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-foreground truncate">
                {currentPartner?.ownerName || "Administrator"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate font-mono">
                ID: {currentPartner?.id || "admin"}
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5 text-xs rounded-lg"
            title="Log Out of Partner Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  Car,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  LayoutDashboard,
  MapPin,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Store,
  TrendingUp,
  User,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Ezy1Logo } from "./Ezy1Logo";

const VENDOR_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/vendor-dashboard",
    badge: null,
  },
  {
    icon: Package,
    label: "My Listings",
    href: "/vendor-dashboard",
    badge: null,
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/vendor-dashboard",
    badge: "3",
  },
  {
    icon: TrendingUp,
    label: "Earnings",
    href: "/vendor-dashboard",
    badge: null,
  },
  { icon: Store, label: "My Store", href: "/vendor-dashboard", badge: null },
  { icon: User, label: "Profile", href: "/vendor-dashboard", badge: null },
];

const DRIVER_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/driver-dashboard",
    badge: null,
  },
  {
    icon: MapPin,
    label: "Active Rides",
    href: "/driver-dashboard",
    badge: "1",
  },
  {
    icon: Clock,
    label: "Ride History",
    href: "/driver-dashboard",
    badge: null,
  },
  {
    icon: TrendingUp,
    label: "Earnings",
    href: "/driver-dashboard",
    badge: null,
  },
  { icon: Car, label: "Vehicle", href: "/driver-dashboard", badge: null },
  { icon: User, label: "Profile", href: "/driver-dashboard", badge: null },
];

const SP_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/service-provider-dashboard",
    badge: null,
  },
  {
    icon: Wrench,
    label: "My Services",
    href: "/service-provider-dashboard",
    badge: null,
  },
  {
    icon: CalendarCheck,
    label: "Requests",
    href: "/service-provider-dashboard",
    badge: "2",
  },
  {
    icon: Clock,
    label: "History",
    href: "/service-provider-dashboard",
    badge: null,
  },
  {
    icon: TrendingUp,
    label: "Earnings",
    href: "/service-provider-dashboard",
    badge: null,
  },
  {
    icon: User,
    label: "Profile",
    href: "/service-provider-dashboard",
    badge: null,
  },
];

function getNavConfig(path: string) {
  if (path.includes("driver")) {
    return {
      items: DRIVER_ITEMS,
      type: "driver",
      icon: Car,
      title: "Driver Portal",
      storeName: "Rajesh (Driver)",
    };
  }
  if (path.includes("service-provider")) {
    return {
      items: SP_ITEMS,
      type: "sp",
      icon: Wrench,
      title: "SP Portal",
      storeName: "Suresh Electricals",
    };
  }
  return {
    items: VENDOR_ITEMS,
    type: "vendor",
    icon: Store,
    title: "Partner Portal",
    storeName: "Sharma Kirana Store",
  };
}

const bottomItems = [
  {
    icon: Bell,
    label: "Notifications",
    href: "#",
  },
  { icon: Settings, label: "Settings", href: "#" },
];

interface VendorLayoutProps {
  children: React.ReactNode;
  title?: string;
}

function VendorSidebarContent({
  collapsed,
  onLinkClick,
}: {
  collapsed?: boolean;
  onLinkClick?: () => void;
}) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const config = getNavConfig(currentPath);
  const PortalIcon = config.icon;

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Brand header */}
      <div
        className={`p-4 border-b border-sidebar-border flex items-center ${collapsed ? "justify-center" : ""}`}
      >
        <Ezy1Logo
          size={collapsed ? "sm" : "md"}
          showWordmark={!collapsed}
          subtitle={config.title}
          to="/"
        />
      </div>

      {/* Status badge */}
      {!collapsed && (
        <div className="px-4 py-2.5 border-b border-sidebar-border bg-muted/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Store Status</span>
            <Badge className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
              ● Active
            </Badge>
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav
        className="flex-1 p-3 space-y-1 overflow-y-auto"
        data-ocid="vendor_sidebar.nav"
      >
        {config.items.map((item) => {
          const Icon = item.icon;
          // Very simple active check since they all map to the base route in this demo,
          // but in a real app each would have a distinct sub-route.
          const isActive = item.label === "Dashboard";
          return (
            <Link
              key={item.href}
              to={item.href as "/vendor-dashboard"}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-smooth ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-secondary text-secondary-foreground shadow-xs"
                  : "text-sidebar-foreground hover:bg-muted"
              }`}
              onClick={onLinkClick}
              data-ocid={`vendor_sidebar.link.${item.label.toLowerCase().replace(" ", "_")}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <span className="flex-1 min-w-0 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <Badge className="text-xs px-1.5 py-0 bg-primary text-primary-foreground border-0">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom nav */}
      <div className="p-3 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href as "/vendor-dashboard"}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body text-sidebar-foreground hover:bg-muted transition-smooth ${
                collapsed ? "justify-center" : ""
              }`}
              onClick={onLinkClick}
              data-ocid={`vendor_sidebar.link.${item.label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <Link to="/" data-ocid="vendor_sidebar.home_link">
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-xs text-muted-foreground justify-start"
            >
              <Home className="w-3.5 h-3.5" />
              Back to Home
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VendorLayout({ children, title }: VendorLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const config = getNavConfig(currentPath);
  const PortalIcon = config.icon;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside
          className={`relative flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
          data-ocid="vendor_sidebar.panel"
        >
          <VendorSidebarContent collapsed={collapsed} />
          <button
            type="button"
            className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-xs hover:bg-muted transition-smooth z-10"
            onClick={() => setCollapsed(!collapsed)}
            data-ocid="vendor_sidebar.collapse_toggle"
          >
            {collapsed ? (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        </aside>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-60 p-0">
            <VendorSidebarContent onLinkClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-card border-b border-border px-4 h-14 flex items-center gap-3 shadow-subtle">
          {isMobile && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="vendor_sidebar.mobile_open_button"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
          )}

          {/* Vendor accent bar */}
          <div className="w-1.5 h-6 rounded-full bg-secondary flex-shrink-0" />

          {title && (
            <h1
              className="font-display font-semibold text-lg text-foreground truncate"
              data-ocid="vendor_page.title"
            >
              {title}
            </h1>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex text-xs gap-1">
              <PortalIcon className="w-3 h-3" />
              {config.storeName}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="vendor_topbar.notifications_button"
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

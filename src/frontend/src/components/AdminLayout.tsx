import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart,
  Bell,
  Car,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  HeartPulse,
  Home,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";

const ADMIN_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin?tab=users" },
  {
    icon: Store,
    label: "Vendors & Partners",
    href: "/admin?tab=vendors",
    badge: "5",
  },
  { icon: Package, label: "Products & Categories", href: "/admin?tab=catalog" },
  { icon: ShoppingCart, label: "Orders & Bookings", href: "/admin?tab=orders" },
  { icon: HeartPulse, label: "Healthcare", href: "/admin?tab=healthcare" },
  { icon: Car, label: "Transport & Vehicles", href: "/admin?tab=transport" },
  { icon: Wrench, label: "Workers & Services", href: "/admin?tab=services" },
  { icon: CreditCard, label: "Payments", href: "/admin?tab=payments" },
  {
    icon: MessageSquare,
    label: "Reviews & Complaints",
    href: "/admin?tab=feedback",
  },
  {
    icon: ShieldCheck,
    label: "Verification",
    href: "/admin?tab=verification",
    badge: "3",
  },
  { icon: BarChart, label: "Reports", href: "/admin?tab=reports" },
  { icon: Megaphone, label: "Promotions", href: "/admin?tab=promotions" },
  { icon: Settings, label: "Platform Settings", href: "/admin?tab=settings" },
];

function AdminSidebarContent({
  collapsed,
  onLinkClick,
}: {
  collapsed?: boolean;
  onLinkClick?: () => void;
}) {
  const routerState = useRouterState();
  const searchParams = new URLSearchParams(
    routerState.location.search as string,
  );
  const currentTab = searchParams.get("tab") || "overview";

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Brand header */}
      <div
        className={`flex items-center gap-2 p-4 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}
      >
        <div className="w-8 h-8 rounded-lg bg-accent flex-shrink-0 flex items-center justify-center shadow-xs">
          <ShieldCheck className="w-4 h-4 text-accent-foreground" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-display font-bold text-sm text-sidebar-foreground leading-none">
              ezy<span className="text-primary">1</span>
            </div>
            <div className="text-xs text-muted-foreground leading-none mt-0.5">
              Super Admin
            </div>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav
        className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar"
        data-ocid="admin_sidebar.nav"
      >
        {ADMIN_ITEMS.map((item) => {
          const Icon = item.icon;
          const isOverview = item.label === "Overview";
          const itemTab = item.href.split("=")[1] || "overview";
          const isActive = currentTab === itemTab;

          return (
            <Link
              key={item.href}
              to={isOverview ? "/admin" : item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-smooth ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-sidebar-foreground hover:bg-muted"
              }`}
              onClick={onLinkClick}
              data-ocid={`admin_sidebar.link.${item.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <span className="flex-1 min-w-0 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <Badge className="text-xs px-1.5 py-0 bg-destructive text-destructive-foreground border-0">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {!collapsed && (
        <div className="p-3">
          <Link to="/" data-ocid="admin_sidebar.home_link">
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-xs text-muted-foreground justify-start"
            >
              <Home className="w-3.5 h-3.5" />
              Back to App Home
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({
  children,
  title,
}: { children: React.ReactNode; title?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside
          className={`relative flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
          data-ocid="admin_sidebar.panel"
        >
          <AdminSidebarContent collapsed={collapsed} />
          <button
            type="button"
            className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-xs hover:bg-muted transition-smooth z-10"
            onClick={() => setCollapsed(!collapsed)}
            data-ocid="admin_sidebar.collapse_toggle"
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
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebarContent onLinkClick={() => setMobileOpen(false)} />
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
                  data-ocid="admin_sidebar.mobile_open_button"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
          )}

          {/* Admin accent bar */}
          <div className="w-1.5 h-6 rounded-full bg-accent flex-shrink-0" />

          {title && (
            <h1
              className="font-display font-semibold text-lg text-foreground truncate"
              data-ocid="admin_page.title"
            >
              {title}
            </h1>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Badge
              variant="outline"
              className="hidden sm:flex text-xs gap-1 bg-destructive/10 text-destructive border-destructive/20"
            >
              <ShieldCheck className="w-3 h-3" />
              Super Admin Mode
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              data-ocid="admin_topbar.notifications_button"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-muted/10">{children}</main>
      </div>
    </div>
  );
}

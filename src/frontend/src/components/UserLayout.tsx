import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bus,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  ShoppingBag,
  Stethoscope,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard", badge: null },
  {
    icon: Stethoscope,
    label: "Healthcare",
    href: "/dashboard/healthcare",
    badge: null,
  },
  { icon: Bus, label: "Transport", href: "/dashboard/transport", badge: null },
  {
    icon: ShoppingBag,
    label: "Commerce",
    href: "/dashboard/commerce",
    badge: "New",
  },
  {
    icon: ShoppingBag,
    label: "Cart",
    href: "/dashboard/cart",
    badge: null,
  },
  { icon: Wallet, label: "My Wallet", href: "/dashboard/wallet", badge: null },
  {
    icon: MessageSquare,
    label: "AI Chat",
    href: "/dashboard/chat",
    badge: "AI",
  },
  { icon: User, label: "My Account", href: "/my-dashboard", badge: null },
];

const bottomItems = [
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

interface UserLayoutProps {
  children: React.ReactNode;
  title?: string;
}

function SidebarContent({
  collapsed,
  onLinkClick,
}: {
  collapsed?: boolean;
  onLinkClick?: () => void;
}) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Brand header */}
      <div
        className={`flex items-center gap-2 p-4 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}
      >
        <div className="w-8 h-8 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center shadow-xs">
          <span className="text-primary-foreground font-display font-black text-sm">
            e1
          </span>
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-lg text-sidebar-foreground">
            ezy<span className="text-primary">1</span>
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav
        className="flex-1 p-3 space-y-1 overflow-y-auto"
        data-ocid="sidebar.nav"
      >
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.href ||
            (item.href !== "/dashboard" && currentPath.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href as "/dashboard"}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-smooth ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-sidebar-foreground hover:bg-muted"
              }`}
              onClick={onLinkClick}
              data-ocid={`sidebar.link.${item.label.toLowerCase().replace(" ", "_")}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <span className="flex-1 min-w-0 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <Badge className="text-xs px-1.5 py-0 bg-secondary text-secondary-foreground border-0">
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
              to={item.href as "/dashboard"}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body text-sidebar-foreground hover:bg-muted transition-smooth ${
                collapsed ? "justify-center" : ""
              }`}
              onClick={onLinkClick}
              data-ocid={`sidebar.link.${item.label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Back to landing */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <Link to="/" data-ocid="sidebar.home_link">
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

export default function UserLayout({ children, title }: UserLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside
          className={`relative flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
          data-ocid="sidebar.panel"
        >
          <SidebarContent collapsed={collapsed} />
          {/* Collapse toggle */}
          <button
            type="button"
            className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-xs hover:bg-muted transition-smooth z-10"
            onClick={() => setCollapsed(!collapsed)}
            data-ocid="sidebar.collapse_toggle"
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
            <SidebarContent onLinkClick={() => setMobileOpen(false)} />
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
                  data-ocid="sidebar.mobile_open_button"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
          )}
          {title && (
            <h1
              className="font-display font-semibold text-lg text-foreground truncate"
              data-ocid="page.title"
            >
              {title}
            </h1>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Link to="/dashboard/cart" data-ocid="topbar.cart_link">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-sm hidden sm:flex"
              >
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold">2 items</span>
              </Button>
            </Link>
            <Link to="/dashboard/wallet" data-ocid="topbar.wallet_link">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-sm hidden sm:flex"
              >
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold">₹1,935</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="topbar.notifications_button"
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

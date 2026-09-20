/**
 * EZY1 Partner Portal Layout
 * Shared sidebar + topbar layout for all service-specific partner portals
 */
import { useState } from "react";
import { usePartnerAuth } from "../../lib/partnerAuthStore";
import { getProviderLabel } from "../../lib/permissions";
import { getCustomerPlatformUrl } from "../../config/links";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Bell,
  User, LogOut, Menu, X, Settings, ChevronRight,
  Building2, Pill, UtensilsCrossed, Truck, Wrench, Shield
} from "lucide-react";

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
}

interface PartnerLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  accentColor?: string;
  portalIcon?: React.ComponentType<{ className?: string }>;
  portalTitle?: string;
}

const PROVIDER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GROCERY: Package,
  VENDOR: Package,
  HOSPITAL: Building2,
  CLINIC: Building2,
  PHARMACY: Pill,
  RESTAURANT: UtensilsCrossed,
  DELIVERY: Truck,
  SERVICE_PROVIDER: Wrench,
  ADMIN: Shield,
};

export default function PartnerLayout({
  children,
  navItems,
  activeSection,
  onSectionChange,
  accentColor = "hsl(var(--primary))",
  portalIcon: PortalIcon,
  portalTitle,
}: PartnerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentPartner, logout } = usePartnerAuth();

  const pt = (currentPartner?.providerType || currentPartner?.partnerType || "GROCERY").toUpperCase();
  const DefaultIcon = PROVIDER_ICONS[pt] || LayoutDashboard;
  const FinalIcon = PortalIcon || DefaultIcon;
  const finalTitle = portalTitle || getProviderLabel(pt);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Brand */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accentColor }}>
              <FinalIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground leading-none">EZY1</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">Partner Portal</p>
            </div>
          </div>
          {/* Partner info */}
          <div className="mt-4 p-3 rounded-xl bg-muted/60">
            <p className="text-xs font-semibold text-foreground truncate">{currentPartner?.businessName || "Partner"}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{currentPartner?.partnerUserId}</p>
            <Badge variant="outline" className="mt-1.5 text-[9px] py-0 h-4">
              {getProviderLabel(pt)}
            </Badge>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onSectionChange(item.id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-medium
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-1">
          <a
            href={getCustomerPlatformUrl()}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-all border border-primary/20"
            title="Open Customer Platform (ezy1.site)"
          >
            <span>Customer Platform</span>
            <span className="text-[10px]">↗</span>
          </a>
          <button
            onClick={() => onSectionChange("settings")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center gap-4 px-4 sticky top-0 z-10">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-foreground truncate">{finalTitle}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground capitalize truncate">{activeSection.replace("-", " ")}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={getCustomerPlatformUrl()}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-border"
              title="Open Customer Platform (ezy1.site)"
            >
              <span>Customer App</span>
              <span className="text-[10px]">↗</span>
            </a>
            <Badge variant="secondary" className="text-[10px] hidden sm:flex">
              {currentPartner?.status || "ACTIVE"}
            </Badge>
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

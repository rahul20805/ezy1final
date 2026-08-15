import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  CreditCard,
  DollarSign,
  GraduationCap,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import React from "react";
import { usePartnerAuth } from "../../../lib/partnerAuthStore";
import { useStoreData } from "../../../lib/storeData";
import type { OwnerSectionId } from "../OwnerSidebar";

interface DashboardSectionProps {
  onNavigateSection: (section: OwnerSectionId) => void;
}

export function DashboardSection({ onNavigateSection }: DashboardSectionProps) {
  const store = useStoreData();
  const { currentPartner } = usePartnerAuth();

  const totalRevenue = store.orders.reduce((sum, o) => (o.paymentStatus === "paid" ? sum + o.totalAmount : sum), 0);
  const totalOrdersCount = store.orders.length;
  const totalProductsCount = store.products.length;
  const totalCustomersCount = store.customers.length;
  const activeBookingsCount = store.bookings.filter((b) => b.status === "open").length;
  const pendingOrdersCount = store.orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
  const newEnquiriesCount = store.enquiries.filter((e) => e.status === "new").length;

  const kpis = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+18.4% this month",
      isPositive: true,
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      title: "Total Orders",
      value: totalOrdersCount,
      change: `${pendingOrdersCount} pending fulfillment`,
      isPositive: true,
      icon: ShoppingCart,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      title: "Live Inventory Items",
      value: totalProductsCount,
      change: `${store.products.filter((p) => !p.inStock).length} out of stock`,
      isPositive: store.products.filter((p) => !p.inStock).length === 0,
      icon: Package,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      title: "Registered Customers",
      value: totalCustomersCount,
      change: "+12 new this week",
      isPositive: true,
      icon: Users,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/15 via-primary/5 to-card border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Live Business Overview
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground mt-2">
            Welcome back, {currentPartner?.ownerName || "Store Owner"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Here is what is happening in <span className="font-semibold text-foreground">{currentPartner?.businessName || store.settings.brandName}</span> today. All changes save live and sync with your public store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onNavigateSection("inventory")}
            className="gap-1.5 text-xs font-semibold rounded-xl h-9"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateSection("orders")}
            className="gap-1.5 text-xs font-semibold rounded-xl h-9 bg-card"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> View Orders
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="rounded-2xl border-border/80 shadow-xs hover:border-primary/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{kpi.title}</span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl font-display font-black text-foreground">{kpi.value}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className="text-[11px] text-muted-foreground">{kpi.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Shortcut Banners & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-bold text-foreground">Recent Orders</h3>
            <Button
              variant="link"
              size="sm"
              onClick={() => onNavigateSection("orders")}
              className="text-xs text-primary p-0 h-auto font-semibold"
            >
              View All ({store.orders.length}) →
            </Button>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
            {store.orders.slice(0, 5).map((order, idx) => (
              <div
                key={order.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  idx !== 0 ? "border-t border-border/60" : ""
                } hover:bg-muted/40 transition-colors`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{order.orderNumber}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-bold px-2 py-0 rounded-md ${
                        order.status === "delivered"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : order.status === "out_for_delivery"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : order.status === "confirmed"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                      }`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {order.customerName} • {order.items.length} item(s) • {order.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-display font-bold text-sm text-foreground">
                    ₹{order.totalAmount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigateSection("orders")}
                    className="h-7 text-xs px-2.5 rounded-lg"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="space-y-4">
          <h3 className="text-base font-display font-bold text-foreground">Management Shortcuts</h3>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onNavigateSection("inventory")}
              className="w-full p-3.5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Manage Products & Stock
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {store.products.length} items in catalog
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground group-hover:translate-x-0.5 transition-transform">→</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection("bookings")}
              className="w-full p-3.5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Classes & Consultations
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {activeBookingsCount} active sessions
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground group-hover:translate-x-0.5 transition-transform">→</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection("services")}
              className="w-full p-3.5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Local & Home Services
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {store.services.length} services offered
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground group-hover:translate-x-0.5 transition-transform">→</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection("settings")}
              className="w-full p-3.5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Owner Settings & Policies
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Brand, WhatsApp, SEO & rules
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

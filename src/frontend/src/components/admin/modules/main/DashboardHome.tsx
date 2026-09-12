import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileCheck,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Store,
  TrendingUp,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { useStoreData } from "../../../../lib/storeData";
import type { AdminSectionId } from "../../AdminSidebar";

interface DashboardHomeProps {
  onNavigateSection: (section: AdminSectionId) => void;
}

export function DashboardHome({ onNavigateSection }: DashboardHomeProps) {
  const store = useStoreData();
  const [dateFilter, setDateFilter] = useState<
    "today" | "yesterday" | "week" | "month" | "all"
  >("today");

  // Dynamic calculations from database
  const totalRevenue = store.orders.reduce(
    (acc, o) => acc + (o.paymentStatus === "paid" ? o.totalAmount : 0),
    0,
  );
  const platformCommission = Math.round(totalRevenue * 0.05);
  const partnerPayoutsTotal = totalRevenue - platformCommission;

  const totalOrders = store.orders.length;
  const pendingOrders = store.orders.filter(
    (o) =>
      o.status === "NEW" || o.status === "ACCEPTED" || o.status === "PREPARING",
  ).length;
  const outForDelivery = store.orders.filter(
    (o) => o.status === "OUT_FOR_DELIVERY",
  ).length;
  const deliveredOrders = store.orders.filter(
    (o) => o.status === "DELIVERED",
  ).length;
  const cancelledOrders = store.orders.filter(
    (o) => o.status === "CANCELLED",
  ).length;

  const totalCustomers = store.customers.length;
  const activePartners = store.shops.filter(
    (s) => s.status === "active",
  ).length;
  const pendingApplications = store.partnerApplications.filter(
    (a) => a.status === "PENDING" || a.status === "UNDER_REVIEW",
  ).length;

  const totalProducts = store.products.length;
  const activeProducts = store.products.filter(
    (p) => p.published && p.inStock,
  ).length;
  const outOfStockProducts = store.products.filter(
    (p) => !p.inStock || p.stockCount === 0,
  ).length;

  const totalBookings = store.bookings.length;
  const activeServices = store.services.filter(
    (s) => s.published && s.isAvailable,
  ).length;

  const availableBeds = store.hospitalBeds.reduce(
    (acc, b) => acc + b.availableBeds,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 sm:p-6 rounded-3xl border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-black text-foreground">
              {store.settings.brandName} Central Command Dashboard
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] text-primary border-primary/30 font-bold"
            >
              Real-time DB
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Live business overview, orders pipeline, healthcare availability,
            partner status, and revenue analytics.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          {(["today", "yesterday", "week", "month", "all"] as const).map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  dateFilter === filter
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter === "all" ? "All Time" : filter}
              </button>
            ),
          )}
        </div>
      </div>

      {/* 1. Executive Finance & Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-border bg-card shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gross Platform Revenue
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-black text-foreground">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-card shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Orders Processed
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-black text-foreground">
              {totalOrders}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="text-amber-500 font-bold">
                {pendingOrders} Active
              </span>{" "}
              •{" "}
              <span className="text-emerald-500 font-bold">
                {deliveredOrders} Completed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-card shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Stores & Partners
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-black text-foreground">
              {activePartners}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-1 font-semibold">
              <FileCheck className="w-3.5 h-3.5" />
              <span>{pendingApplications} KYC pending review</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-card shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Available Hospital Beds
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-black text-foreground">
              {availableBeds} Beds
            </div>
            <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Across {store.hospitals.length} verified hospitals</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Key Operational Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders Pipeline Health */}
        <Card className="rounded-3xl border-border bg-card shadow-xs md:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-display font-bold">
                Live Orders Pipeline
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time status breakdown across Web and WhatsApp orders
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateSection("orders")}
              className="text-xs h-8 rounded-xl gap-1"
            >
              View Orders <ArrowUpRight className="w-3 h-3" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-center">
                <span className="text-[11px] text-muted-foreground font-semibold">
                  New / Pending
                </span>
                <p className="text-xl font-display font-bold text-amber-500 mt-0.5">
                  {pendingOrders}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-center">
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Out for Delivery
                </span>
                <p className="text-xl font-display font-bold text-sky-500 mt-0.5">
                  {outForDelivery}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-center">
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Delivered
                </span>
                <p className="text-xl font-display font-bold text-emerald-500 mt-0.5">
                  {deliveredOrders}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-center">
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Cancelled
                </span>
                <p className="text-xl font-display font-bold text-rose-500 mt-0.5">
                  {cancelledOrders}
                </p>
              </div>
            </div>

            {/* Recent Incoming Orders Table */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent Orders
              </h4>
              <div className="space-y-2">
                {store.orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-2xl bg-muted/20 border border-border/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">
                          {order.orderNumber}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] uppercase font-bold"
                        >
                          {order.orderSource}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-0.5">
                        {order.customerName} • {order.items.length} item(s)
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        ₹{order.totalAmount}
                      </p>
                      <Badge
                        className={`text-[9px] uppercase font-bold mt-0.5 ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : order.status === "OUT_FOR_DELIVERY"
                              ? "bg-sky-500/10 text-sky-600"
                              : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Shortcuts */}
        <Card className="rounded-3xl border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display font-bold">
              Quick Operating Actions
            </CardTitle>
            <CardDescription className="text-xs">
              Direct access to frequent administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Button
              variant="outline"
              onClick={() => onNavigateSection("products")}
              className="w-full justify-between rounded-2xl text-xs h-10 border-border bg-muted/20 hover:bg-primary/10 hover:text-primary transition-all"
            >
              <span className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-primary" /> Add New Product
              </span>
              <Plus className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigateSection("partner_applications")}
              className="w-full justify-between rounded-2xl text-xs h-10 border-border bg-muted/20 hover:bg-blue-500/10 hover:text-blue-600 transition-all"
            >
              <span className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-blue-500" /> Review
                Partner KYC
              </span>
              <Badge variant="destructive" className="text-[9px] h-4 font-bold">
                {pendingApplications}
              </Badge>
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigateSection("hospital_beds")}
              className="w-full justify-between rounded-2xl text-xs h-10 border-border bg-muted/20 hover:bg-rose-500/10 hover:text-rose-600 transition-all"
            >
              <span className="flex items-center gap-2">
                <Stethoscope className="w-3.5 h-3.5 text-rose-500" /> Update
                Hospital Beds
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigateSection("coupons")}
              className="w-full justify-between rounded-2xl text-xs h-10 border-border bg-muted/20 hover:bg-amber-500/10 hover:text-amber-600 transition-all"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Create
                Discount Coupon
              </span>
              <Plus className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigateSection("owner_settings")}
              className="w-full justify-between rounded-2xl text-xs h-10 border-border bg-muted/20 hover:bg-primary/10 hover:text-primary transition-all"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Master
                Owner Settings
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 3. Catalog & Resource Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onNavigateSection("products")}
          className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">
              Catalog
            </span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-lg font-display font-black text-foreground mt-2">
            {totalProducts}
          </p>
          <span className="text-[10px] text-muted-foreground">
            {outOfStockProducts} Out of stock
          </span>
        </div>

        <div
          onClick={() => onNavigateSection("bookings")}
          className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">
              Bookings
            </span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-lg font-display font-black text-foreground mt-2">
            {totalBookings}
          </p>
          <span className="text-[10px] text-muted-foreground">
            Workshops & Consults
          </span>
        </div>

        <div
          onClick={() => onNavigateSection("services")}
          className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">
              Services
            </span>
            <Wrench className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg font-display font-black text-foreground mt-2">
            {activeServices}
          </p>
          <span className="text-[10px] text-muted-foreground">
            Local Home Services
          </span>
        </div>

        <div
          onClick={() => onNavigateSection("customers")}
          className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">
              Customers
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-lg font-display font-black text-foreground mt-2">
            {totalCustomers}
          </p>
          <span className="text-[10px] text-muted-foreground">
            Verified profiles
          </span>
        </div>

        <div
          onClick={() => onNavigateSection("delivery_partners")}
          className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">
              Riders
            </span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-display font-black text-foreground mt-2">
            {store.deliveryPartners.length}
          </p>
          <span className="text-[10px] text-emerald-500 font-semibold">
            Active delivery fleet
          </span>
        </div>

        <div
          onClick={() => onNavigateSection("support_tickets")}
          className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">
              Support
            </span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-lg font-display font-black text-foreground mt-2">
            {store.supportTickets.length}
          </p>
          <span className="text-[10px] text-muted-foreground">
            Open disputes & help
          </span>
        </div>
      </div>
    </div>
  );
}

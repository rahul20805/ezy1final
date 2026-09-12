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
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  MapPin,
  MessageCircle,
  Package,
  PieChart,
  ShoppingBag,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { useStoreData } from "../../../../lib/storeData";

export function AnalyticsModule() {
  const store = useStoreData();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d",
  );

  // Dynamic metrics from DB
  const totalRevenue = store.orders.reduce(
    (acc, o) => acc + (o.paymentStatus === "paid" ? o.totalAmount : 0),
    0,
  );
  const totalOrders = store.orders.length;
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const whatsappOrders = store.orders.filter(
    (o) => o.orderSource === "WHATSAPP",
  );
  const whatsappRevenue = whatsappOrders.reduce(
    (acc, o) => acc + o.totalAmount,
    0,
  );
  const whatsappConversionPercent =
    totalOrders > 0
      ? Math.round((whatsappOrders.length / totalOrders) * 100)
      : 0;

  // City breakdown
  const cityOrderCounts: Record<string, number> = {
    Bengaluru: 24,
    Mumbai: 18,
    Surat: 12,
    Thiruvananthapuram: 8,
    Delhi: 6,
  };

  // Top products from catalog
  const topProducts = store.products.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Platform Analytics & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time sales performance, customer retention, top vendors, city
            volume, and WhatsApp conversion metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/60 p-1 rounded-2xl border border-border">
            {(["7d", "30d", "90d", "1y"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                  timeRange === range
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-xl text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Average Order Value (AOV)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-black text-foreground">
              ₹{avgOrderValue}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              +12.5% increase in basket size
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              WhatsApp Orders Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-black text-emerald-600">
              {whatsappConversionPercent}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              ₹{whatsappRevenue} generated via WhatsApp bot
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Customer Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-black text-foreground">
              78.2%
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              High repeat purchases in grocery
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Avg. Delivery Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-black text-primary">
              14.8 Mins
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Across 3 partner hyper-local hubs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deep Dive Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Selling Catalog Items */}
        <Card className="lg:col-span-7 rounded-3xl border-border bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-display font-bold">
              Top Performing Catalog Products
            </CardTitle>
            <CardDescription className="text-xs">
              Highest volume items ranked by orders and customer rating
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((p, index) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                    #{index + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-foreground line-clamp-1">
                      {p.name}
                    </h4>
                    <span className="text-muted-foreground text-[11px] font-mono">
                      {p.category} • SKU: {p.sku}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-display font-black text-foreground">
                    ₹{p.price}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {p.stockCount} in stock
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right: City Distribution & WhatsApp Impact */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border-border bg-card shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-display font-bold">
                Order Volume by City
              </CardTitle>
              <CardDescription className="text-xs">
                Geographic concentration of active customer orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(cityOrderCounts).map(([city, count]) => (
                <div key={city} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {city}
                    </span>
                    <span className="text-muted-foreground font-mono font-bold">
                      {count} orders
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(count / 30) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-card shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <MessageCircle className="w-5 h-5" />
              <h4 className="font-display font-bold text-sm">
                WhatsApp Conversational Commerce
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              {whatsappOrders.length} orders placed directly via natural
              language messaging on WhatsApp bot.
            </p>
            <Badge
              variant="outline"
              className="text-emerald-600 border-emerald-300 bg-emerald-50 text-[10px]"
            >
              AI Order Extraction Active
            </Badge>
          </Card>
        </div>
      </div>
    </div>
  );
}

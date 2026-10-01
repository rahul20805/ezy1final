import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Flame,
  MessageCircle,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useStoreData } from "../../lib/storeData";

interface PartnerCustomerActivityProps {
  category?: string; // e.g. "Grocery", "Food", "Pharmacy", "Hospital", "Services"
  partnerId?: string;
  partnerName?: string;
}

export default function PartnerCustomerActivity({
  category = "",
  partnerId = "",
  partnerName = "",
}: PartnerCustomerActivityProps) {
  const store = useStoreData();
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"searches" | "cart" | "customers">(
    "searches",
  );

  const normalizedCategory = category.toLowerCase().trim();

  // 1. Filtered User Searches for this partner's category
  const relevantSearches = useMemo(() => {
    return store.userSearches.filter((s) => {
      const matchCat =
        !normalizedCategory ||
        !s.category ||
        s.category.toLowerCase().includes(normalizedCategory) ||
        normalizedCategory.includes(s.category.toLowerCase());
      const matchPartner = !partnerId || !s.partnerId || s.partnerId === partnerId;
      const matchText =
        !searchFilter ||
        s.query.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (s.userName && s.userName.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchCat && matchPartner && matchText;
    });
  }, [store.userSearches, normalizedCategory, partnerId, searchFilter]);

  // Top searched terms summary
  const searchKeywordsSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    relevantSearches.forEach((s) => {
      const q = s.query.trim().toLowerCase();
      if (q) counts[q] = (counts[q] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [relevantSearches]);

  // 2. Filtered Cart Activity
  const relevantCartActivity = useMemo(() => {
    return store.cartActivity.filter((c) => {
      const matchCat =
        !normalizedCategory ||
        !c.category ||
        c.category.toLowerCase().includes(normalizedCategory) ||
        normalizedCategory.includes(c.category.toLowerCase());
      const matchPartner = !partnerId || !c.partnerId || c.partnerId === partnerId;
      const matchText =
        !searchFilter ||
        (c.itemName || c.productName || "").toLowerCase().includes(searchFilter.toLowerCase()) ||
        (c.userName && c.userName.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchCat && matchPartner && matchText;
    });
  }, [store.cartActivity, normalizedCategory, partnerId, searchFilter]);

  // 3. Customers who order or have active carts in this category
  const relevantCustomers = useMemo(() => {
    return store.customers.filter((cust) => {
      const hasCategoryOrder =
        !normalizedCategory ||
        (cust.frequentlyOrderedItems &&
          cust.frequentlyOrderedItems.some(
            (it) =>
              it.category?.toLowerCase().includes(normalizedCategory) ||
              normalizedCategory.includes(it.category?.toLowerCase() || ""),
          ));
      const hasActiveCart =
        cust.activeCartItems && cust.activeCartItems.length > 0;
      const matchText =
        !searchFilter ||
        cust.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        cust.phone.includes(searchFilter) ||
        cust.email.toLowerCase().includes(searchFilter.toLowerCase());
      return (hasCategoryOrder || hasActiveCart || true) && matchText;
    });
  }, [store.customers, normalizedCategory, searchFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <Badge
              variant="outline"
              className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30"
            >
              Real-Time Customer Intelligence
            </Badge>
          </div>
          <h2 className="text-xl font-black font-display tracking-tight text-foreground mt-1">
            Customer Activity & Demand Radar
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor live user search queries, active shopping cart additions, and customer demand trends in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search activity, query, user..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-52 h-9 text-xs rounded-xl bg-background/80"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Refreshed customer activity")}
            className="h-9 rounded-xl gap-1 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Top Demand Keywords Bar */}
      {searchKeywordsSummary.length > 0 && (
        <Card className="rounded-2xl border-border bg-card/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-foreground">
              Trending Demand in your Category (What Customers Are Searching Right Now):
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchKeywordsSummary.map(([term, count]) => (
              <Badge
                key={term}
                variant="secondary"
                className="px-3 py-1 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1.5"
              >
                <Search className="w-3 h-3" />
                <span className="capitalize">{term}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 font-mono font-bold">
                  {count}x
                </span>
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          onClick={() => setActiveTab("searches")}
          className={`cursor-pointer transition-all rounded-2xl border-border p-4 hover:border-primary/50 ${
            activeTab === "searches" ? "ring-2 ring-primary bg-primary/5" : "bg-card"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">User Search Queries</span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black mt-2 text-foreground">
            {relevantSearches.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Matching customer searches recorded
          </p>
        </Card>

        <Card
          onClick={() => setActiveTab("cart")}
          className={`cursor-pointer transition-all rounded-2xl border-border p-4 hover:border-primary/50 ${
            activeTab === "cart" ? "ring-2 ring-primary bg-primary/5" : "bg-card"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Live Cart Additions</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black mt-2 text-foreground">
            {relevantCartActivity.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Active high-intent shoppers
          </p>
        </Card>

        <Card
          onClick={() => setActiveTab("customers")}
          className={`cursor-pointer transition-all rounded-2xl border-border p-4 hover:border-primary/50 ${
            activeTab === "customers" ? "ring-2 ring-primary bg-primary/5" : "bg-card"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Customer Profiles & Repeat Orders</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black mt-2 text-foreground">
            {relevantCustomers.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Customers with order history
          </p>
        </Card>
      </div>

      {/* Tabs Content */}
      {activeTab === "searches" && (
        <Card className="rounded-3xl border-border bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                Live Customer Search Queries
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {relevantSearches.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {relevantSearches.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No search queries recorded yet</p>
                <p className="text-xs">Customer searches will appear here live when users look for items.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {relevantSearches.map((s) => (
                  <div key={s.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Search className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">"{s.query}"</span>
                          {s.category && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-semibold">
                              {s.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(s.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {s.userName && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {s.userName} {s.userPhone && `(${s.userPhone})`}
                            </span>
                          )}
                          <span>{s.resultsCount} results found</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
                      Live Search
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "cart" && (
        <Card className="rounded-3xl border-border bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-500" />
                Live Shopping Bag Additions
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {relevantCartActivity.length} Events
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {relevantCartActivity.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No active cart additions yet</p>
                <p className="text-xs">When users add your items to their cart, it will notify you here immediately.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {relevantCartActivity.map((c) => (
                  <div key={c.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{c.itemName || c.productName}</span>
                          <span className="text-xs font-semibold text-emerald-600">₹{c.price}</span>
                          <span className="text-xs text-muted-foreground font-mono">Qty: {c.quantity}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {c.userName && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {c.userName} {c.userPhone && `(${c.userPhone})`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`text-[10px] font-bold uppercase ${
                        String(c.action).toUpperCase() === "ADD"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : String(c.action).toUpperCase() === "CHECKOUT"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/30"
                            : "bg-sky-500/10 text-sky-600 border-sky-500/30"
                      }`}
                    >
                      {String(c.action).toUpperCase() === "ADD" ? "Added to Cart" : c.action}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "customers" && (
        <Card className="rounded-3xl border-border bg-card">
          <CardHeader className="p-5 pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                Customer Profiles, Demand & Frequently Ordered Items
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {relevantCustomers.length} Customers
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {relevantCustomers.map((cust) => (
                <div key={cust.id} className="p-5 hover:bg-muted/30 transition-colors space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          {cust.name}
                          <Badge variant="secondary" className="text-[10px] py-0 font-normal">
                            {cust.role || "User"}
                          </Badge>
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 font-mono">
                          <span>{cust.phone}</span>
                          <span>•</span>
                          <span>{cust.email}</span>
                          <span>•</span>
                          <span>{cust.city || "Local"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-xl">
                        ₹{cust.totalSpent.toLocaleString()} Spent
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                        {cust.totalOrders} total orders
                      </p>
                    </div>
                  </div>

                  {/* Frequently Ordered Items */}
                  {cust.frequentlyOrderedItems && cust.frequentlyOrderedItems.length > 0 && (
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1.5">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Frequently Ordered Items:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cust.frequentlyOrderedItems.map((it) => (
                          <Badge
                            key={it.id}
                            variant="secondary"
                            className="text-xs rounded-xl bg-background border border-border font-medium px-2 py-0.5 gap-1"
                          >
                            <span>{it.name}</span>
                            <span className="text-[10px] font-bold text-primary">({it.orderCount || it.count}x)</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {cust.recentSearches && cust.recentSearches.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="text-[10px] font-semibold uppercase">Recent Searches:</span>
                      <div className="flex flex-wrap gap-1">
                        {cust.recentSearches.slice(0, 4).map((q, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-muted text-[11px] text-foreground font-mono"
                          >
                            "{q}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

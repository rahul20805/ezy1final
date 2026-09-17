import { useState } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  FileText,
  HelpCircle,
  ArrowRight,
  Package,
  UtensilsCrossed,
  Pill,
  Car
} from "lucide-react";

interface OrderItem {
  id: string;
  category: "Grocery" | "Food" | "Pharmacy" | "Ride" | "Parcel";
  providerName: string;
  items: string[];
  totalAmount: number;
  date: string;
  status: "DELIVERED" | "ON_THE_WAY" | "PREPARING";
}

const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: "EZY-ORD-8821",
    category: "Grocery",
    providerName: "Sharma Kirana Store",
    items: ["Aashirvaad Atta (5kg)", "Amul Butter (100g)", "Tata Toor Dal (1kg)"],
    totalAmount: 468,
    date: "Today, 02:15 PM",
    status: "ON_THE_WAY",
  },
  {
    id: "EZY-ORD-7719",
    category: "Food",
    providerName: "Royal Biryani House",
    items: ["Hyderabadi Chicken Biryani (Serves 2)", "Mirchi Ka Salan"],
    totalAmount: 340,
    date: "Yesterday, 08:30 PM",
    status: "DELIVERED",
  },
  {
    id: "EZY-ORD-6623",
    category: "Pharmacy",
    providerName: "City Care Pharmacy",
    items: ["Dolo 650 (15 Tabs)", "Limcee Vitamin C (15 Tabs)"],
    totalAmount: 55,
    date: "14 Apr 2026",
    status: "DELIVERED",
  },
  {
    id: "EZY-ORD-5512",
    category: "Ride",
    providerName: "EZY Cab • Ramesh K.",
    items: ["Trip from Indiranagar to Whitefield (18 km)"],
    totalAmount: 220,
    date: "12 Apr 2026",
    status: "DELIVERED",
  },
];

export default function MyOrdersPage() {
  const [selectedTab, setSelectedTab] = useState<string>("All");

  const filteredOrders = SAMPLE_ORDERS.filter((ord) => {
    if (selectedTab === "All") return true;
    return ord.category.toLowerCase() === selectedTab.toLowerCase();
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md">
          <div className="container max-w-4xl py-8 px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              My Orders & Activity
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track live deliveries, review order details, download invoices, and reorder with 1-click.
            </p>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-6 overflow-x-auto scrollbar-hide text-xs">
              {["All", "Grocery", "Food", "Pharmacy", "Ride", "Parcel"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-smooth whitespace-nowrap ${
                    selectedTab === tab
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/70 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="container max-w-4xl py-8 px-4 sm:px-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-bold text-base text-foreground mb-1">No orders found</h3>
              <p className="text-xs text-muted-foreground">
                You have not placed any orders in this category yet.
              </p>
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <Card
                key={ord.id}
                className="rounded-2xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {ord.id}
                      </span>
                      <span className="text-xs text-muted-foreground">• {ord.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {ord.status === "ON_THE_WAY" ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs font-semibold gap-1">
                          <Truck className="w-3.5 h-3.5 animate-pulse" />
                          On The Way (Arriving in 8 mins)
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-semibold gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Delivered
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="py-4">
                    <h4 className="font-bold text-sm text-foreground mb-1">
                      {ord.providerName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {ord.items.join(" • ")}
                    </p>
                    <div className="mt-3 text-sm font-bold text-foreground font-display">
                      Total Paid: ₹{ord.totalAmount}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert(`Downloading official invoice for ${ord.id}...`)}
                        className="rounded-xl h-8 px-3 text-xs gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Invoice
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert(`Connecting to 24/7 EZY Support for ${ord.id}...`)}
                        className="rounded-xl h-8 px-3 text-xs gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        Get Help
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => alert(`Added items from ${ord.id} to cart!`)}
                      className="rounded-xl h-8 px-4 text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Buy Again / Reorder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

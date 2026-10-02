import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  HelpCircle,
  Package,
  Pill,
  Printer,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { useCartStore } from "../lib/cartStore";
import { useStoreData } from "../lib/storeData";

interface OrderItem {
  id: string;
  category: "Grocery" | "Food" | "Pharmacy" | "Ride" | "Parcel";
  providerName: string;
  items: { id?: number | string; name: string; price?: number; quantity?: number }[];
  totalAmount: number;
  date: string;
  status: "DELIVERED" | "ON_THE_WAY" | "PREPARING" | "CONFIRMED";
  address?: string;
  paymentMethod?: string;
}

const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: "EZY-ORD-8821",
    category: "Grocery",
    providerName: "Sharma Kirana Store",
    items: [
      { name: "Aashirvaad Atta (5kg)", price: 235, quantity: 1 },
      { name: "Amul Butter (100g)", price: 58, quantity: 1 },
      { name: "Tata Toor Dal (1kg)", price: 175, quantity: 1 },
    ],
    totalAmount: 468,
    date: "Today, 02:15 PM",
    status: "ON_THE_WAY",
    address: "Flat 402, Green Glen Layout, Bengaluru",
    paymentMethod: "UPI / Razorpay",
  },
  {
    id: "EZY-ORD-7719",
    category: "Food",
    providerName: "Royal Biryani House",
    items: [
      { name: "Hyderabadi Chicken Biryani (Serves 2)", price: 280, quantity: 1 },
      { name: "Mirchi Ka Salan", price: 60, quantity: 1 },
    ],
    totalAmount: 340,
    date: "Yesterday, 08:30 PM",
    status: "DELIVERED",
    address: "Flat 402, Green Glen Layout, Bengaluru",
    paymentMethod: "EZY1 Wallet",
  },
  {
    id: "EZY-ORD-6623",
    category: "Pharmacy",
    providerName: "City Care Pharmacy",
    items: [
      { name: "Dolo 650 (15 Tabs)", price: 30, quantity: 1 },
      { name: "Limcee Vitamin C (15 Tabs)", price: 25, quantity: 1 },
    ],
    totalAmount: 55,
    date: "14 Apr 2026",
    status: "DELIVERED",
    address: "Flat 402, Green Glen Layout, Bengaluru",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "EZY-ORD-5512",
    category: "Ride",
    providerName: "EZY Cab • Ramesh K.",
    items: [{ name: "Trip from Indiranagar to Whitefield (18 km)", price: 220, quantity: 1 }],
    totalAmount: 220,
    date: "12 Apr 2026",
    status: "DELIVERED",
    address: "Whitefield, Bengaluru",
    paymentMethod: "UPI / Razorpay",
  },
];

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [invoiceOrder, setInvoiceOrder] = useState<OrderItem | null>(null);

  const storeOrders = useStoreData((s) => s.orders);
  const whatsappNumber = useStoreData((s) => s.settings?.whatsappNumber);
  const { addItem } = useCartStore();

  // Combine live customer orders with sample orders
  const allOrders = useMemo(() => {
    const formattedStoreOrders: OrderItem[] = (storeOrders || []).map((ord) => ({
      id: ord.orderNumber || `EZY-${String(ord.id).slice(-4)}`,
      category: "Grocery",
      providerName: "EZY1 Partner Network",
      items: (ord.items || []).map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      totalAmount: ord.totalAmount,
      date: ord.createdAt || "Just now",
      status:
        ord.status === "DELIVERED"
          ? "DELIVERED"
          : ord.status === "ACCEPTED" || ord.status === "PREPARING" || (ord.status as string) === "CONFIRMED"
            ? "PREPARING"
            : "ON_THE_WAY",
      address: ord.deliveryAddress || "Saved Delivery Location",
      paymentMethod: ord.paymentMethod || "UPI",
    }));

    const existingIds = new Set(formattedStoreOrders.map((o) => o.id));
    const sampleRemaining = SAMPLE_ORDERS.filter((s) => !existingIds.has(s.id));
    return [...formattedStoreOrders, ...sampleRemaining];
  }, [storeOrders]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((ord) => {
      if (selectedTab === "All") return true;
      return ord.category.toLowerCase() === selectedTab.toLowerCase();
    });
  }, [allOrders, selectedTab]);

  const handleReorder = (ord: OrderItem) => {
    let count = 0;
    ord.items.forEach((it) => {
      const numId = Math.abs(
        (it.name || "Item").split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0),
      );
      addItem({
        id: numId,
        vendorId: 1,
        name: it.name,
        description: it.name,
        price: it.price || 99,
        mrp: it.price || 99,
        images: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"],
        category: ord.category.toLowerCase(),
        categoryIds: [1],
        inStock: true,
        stockCount: 50,
        isAvailable: true,
        rating: 4.8,
        totalReviews: 45,
      });
      count++;
    });

    toast.success(`Added ${count} items from ${ord.id} to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => navigate({ to: "/dashboard/cart" }),
      },
    });
  };

  const handleGetHelp = (ord: OrderItem) => {
    const wa = (whatsappNumber || "919876543210").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello EZY1 Support! I need assistance with my Order #${ord.id} (${ord.providerName}, Total: ₹${ord.totalAmount}).`,
    );
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md">
          <div className="container max-w-4xl py-6 sm:py-8 px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              My Orders &amp; Activity
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Track live deliveries, review order details, download invoices, and reorder with 1-click.
            </p>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-5 overflow-x-auto scrollbar-none touch-pan-x text-xs">
              {["All", "Grocery", "Food", "Pharmacy", "Ride", "Parcel"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-smooth whitespace-nowrap shrink-0 ${
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
        <div className="container max-w-4xl py-6 sm:py-8 px-3 sm:px-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border p-8">
              <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-bold text-base text-foreground mb-1">No orders found</h3>
              <p className="text-xs text-muted-foreground mb-4">
                You have not placed any orders in this category yet.
              </p>
              <Button
                onClick={() => navigate({ to: "/category/grocery" as any })}
                className="rounded-xl font-bold text-xs"
              >
                Browse Catalog
              </Button>
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <Card
                key={ord.id}
                className="rounded-2xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-primary">{ord.id}</span>
                      <span className="text-xs text-muted-foreground">• {ord.date}</span>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold py-0">
                        {ord.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {ord.status === "ON_THE_WAY" ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs font-semibold gap-1">
                          <Truck className="w-3.5 h-3.5 animate-pulse" />
                          On The Way (15 mins)
                        </Badge>
                      ) : ord.status === "PREPARING" ? (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs font-semibold gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Store Preparing Order
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
                  <div className="py-3 sm:py-4">
                    <h4 className="font-bold text-sm text-foreground mb-1">{ord.providerName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {ord.items.map((i) => i.name).join(" • ")}
                    </p>
                    <div className="mt-2.5 text-sm font-bold text-foreground font-display flex items-center justify-between">
                      <span>Total Paid: ₹{ord.totalAmount}</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        via {ord.paymentMethod || "UPI"}
                      </span>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInvoiceOrder(ord)}
                        className="rounded-xl h-8 px-3 text-xs gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Invoice</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGetHelp(ord)}
                        className="rounded-xl h-8 px-3 text-xs gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>24/7 Help</span>
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleReorder(ord)}
                      className="rounded-xl h-8 px-4 text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-sm ml-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Invoice Modal Dialog */}
      {invoiceOrder && (
        <Dialog open={Boolean(invoiceOrder)} onOpenChange={() => setInvoiceOrder(null)}>
          <DialogContent className="max-w-lg bg-card border-border rounded-3xl p-6">
            <DialogHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                    Official Tax Invoice
                  </Badge>
                  <DialogTitle className="text-lg font-bold font-display mt-1">
                    Invoice #{invoiceOrder.id}
                  </DialogTitle>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">EZY1 Platform Pvt Ltd</p>
                  <p>GSTIN: 29AABCE1234F1Z5</p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted/40 rounded-xl">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Order Date &amp; Time</span>
                  <span className="font-semibold text-foreground">{invoiceOrder.date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Payment Method</span>
                  <span className="font-semibold text-foreground">
                    {invoiceOrder.paymentMethod || "UPI / Prepaid"}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-border/60">
                  <span className="text-muted-foreground block text-[10px]">Delivery Address</span>
                  <span className="font-medium text-foreground">{invoiceOrder.address}</span>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-muted/70 px-3 py-2 font-bold flex justify-between text-[11px]">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>
                <div className="divide-y divide-border">
                  {invoiceOrder.items.map((it, idx) => (
                    <div key={idx} className="px-3 py-2 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-foreground">{it.name}</span>
                        {it.quantity && it.quantity > 1 && (
                          <span className="text-muted-foreground ml-1">x{it.quantity}</span>
                        )}
                      </div>
                      <span className="font-mono font-bold">₹{it.price || 99}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono">
                    ₹{Math.max(0, invoiceOrder.totalAmount - 30)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery &amp; Packaging Fee</span>
                  <span className="font-mono">₹30</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Applicable GST (Included)</span>
                  <span className="font-mono">
                    ₹{Math.round(invoiceOrder.totalAmount * 0.05)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-foreground pt-2 border-t border-border">
                  <span>Total Amount Paid</span>
                  <span className="text-primary font-mono font-extrabold">
                    ₹{invoiceOrder.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2 border-t border-border flex flex-row justify-between items-center">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Digitally Generated Invoice
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / PDF
                </Button>
                <Button
                  size="sm"
                  onClick={() => setInvoiceOrder(null)}
                  className="rounded-xl text-xs font-bold"
                >
                  Done
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  ShoppingCart,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { DataTable } from "../../../owner/DataTable";

interface AbandonedCartItem {
  id: number;
  customerName: string;
  phone: string;
  items: string[];
  totalValue: number;
  lastActive: string;
  status: "Abandoned" | "Recovered" | "In Progress";
}

const initialAbandonedCarts: AbandonedCartItem[] = [
  {
    id: 1,
    customerName: "Vikram Malhotra",
    phone: "9876500991",
    items: ["Aashirvaad Atta 5kg", "Amul Butter 500g", "Fresh Farm Onions 2kg"],
    totalValue: 560,
    lastActive: "45 mins ago",
    status: "Abandoned",
  },
  {
    id: 2,
    customerName: "Sneha Mukherjee",
    phone: "9820011445",
    items: ["Organic Raw Mountain Honey 500g", "Dolo 650mg Tabs"],
    totalValue: 412,
    lastActive: "2 hours ago",
    status: "Abandoned",
  },
  {
    id: 3,
    customerName: "Karan Johar",
    phone: "9811224466",
    items: ["Pottery & Clay Mastery Workshop Slot"],
    totalValue: 1200,
    lastActive: "Yesterday",
    status: "Recovered",
  },
];

export function CartsManager() {
  const [carts, setCarts] = React.useState<AbandonedCartItem[]>(initialAbandonedCarts);

  const sendRecoveryWhatsApp = (cart: AbandonedCartItem) => {
    toast.success(`WhatsApp recovery reminder sent to ${cart.customerName} (${cart.phone}) with code "EZYBACK10"!`);
    setCarts((prev) =>
      prev.map((c) => (c.id === cart.id ? { ...c, status: "In Progress" } : c))
    );
  };

  return (
    <div className="space-y-6">
      <DataTable<AbandonedCartItem>
        title="Active & Abandoned Cart Recovery"
        description="Monitor high-intent customer carts and trigger automated WhatsApp/SMS recovery nudges."
        data={carts}
        searchPlaceholder="Search customer, phone, item in cart..."
        searchFilter={(item, query) =>
          item.customerName.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.items.some((i) => i.toLowerCase().includes(query))
        }
        filterOptions={[
          {
            key: "status",
            label: "Cart State",
            options: [
              { label: "Abandoned", value: "Abandoned" },
              { label: "In Progress", value: "In Progress" },
              { label: "Recovered", value: "Recovered" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Value (High to Low)", value: "val_desc" },
          { label: "Most Recent", value: "id_desc" },
        ]}
        defaultSort="val_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "val_desc") return list.sort((a, b) => b.totalValue - a.totalValue);
          return list.sort((a, b) => b.id - a.id);
        }}
        pageSize={6}
        renderItem={(cart) => (
          <Card key={cart.id} className="rounded-3xl border-border bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground">{cart.customerName}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{cart.phone} • Last active: {cart.lastActive}</p>
                </div>
              </div>

              <Badge
                className={`text-[10px] uppercase font-bold ${
                  cart.status === "Recovered"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : cart.status === "In Progress"
                    ? "bg-sky-500/10 text-sky-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {cart.status}
              </Badge>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs my-3 space-y-1">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Items in Bag:</span>
              <ul className="list-disc list-inside text-foreground space-y-0.5">
                {cart.items.map((it, idx) => (
                  <li key={idx} className="truncate">{it}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="font-display font-black text-base text-foreground">₹{cart.totalValue}</span>
              {cart.status !== "Recovered" && (
                <Button
                  size="sm"
                  onClick={() => sendRecoveryWhatsApp(cart)}
                  className="h-8 px-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Send WhatsApp Nudge
                </Button>
              )}
            </div>
          </Card>
        )}
      />
    </div>
  );
}

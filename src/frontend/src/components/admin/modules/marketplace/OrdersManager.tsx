import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Printer,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ServerDataTable } from "../../ServerDataTable";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  deliveryAddress?: string;
  vendorId?: number;
  vendorName?: string;
  totalAmount: number;
  status: "NEW" | "ACCEPTED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentMethod?: string;
  paymentStatus?: string;
  items?: OrderItem[];
  createdAt?: string;
  orderSource?: string;
  assignedDriverName?: string;
}

export function OrdersManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const handleStatusChange = async (orderId: number, nextStatus: OrderRecord["status"]) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status on server.");

      toast.success(`Order #${orderId} updated to: ${nextStatus.replace(/_/g, " ")}`);
      setRefreshTrigger((prev) => prev + 1);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status.");
    }
  };

  const getStatusColor = (status: OrderRecord["status"]) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "OUT_FOR_DELIVERY":
        return "bg-sky-500/10 text-sky-600 border-sky-500/20";
      case "PREPARING":
      case "ACCEPTED":
      case "READY":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "NEW":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <ServerDataTable<OrderRecord>
        title="Live Orders Management Pipeline"
        description="Track and fulfill real-time orders from Web, Mobile, and WhatsApp directly connected to database."
        fetchUrl="/api/orders"
        refreshTrigger={refreshTrigger}
        searchPlaceholder="Search order number, customer name, phone, address..."
        filterOptions={[
          {
            key: "status",
            label: "Order Status",
            options: [
              { label: "New Incoming", value: "NEW" },
              { label: "Accepted", value: "ACCEPTED" },
              { label: "Preparing", value: "PREPARING" },
              { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
              { label: "Delivered", value: "DELIVERED" },
              { label: "Cancelled", value: "CANCELLED" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Order ID (Newest)", value: "id_desc", sortBy: "id", sortOrder: "desc" },
          { label: "Amount (High to Low)", value: "totalAmount_desc", sortBy: "totalAmount", sortOrder: "desc" },
          { label: "Amount (Low to High)", value: "totalAmount_asc", sortBy: "totalAmount", sortOrder: "asc" },
        ]}
        defaultSort="id_desc"
        defaultPageSize={25}
        renderItem={(order) => {
          const itemsList = order.items || [];
          return (
            <Card
              key={order.id}
              className={`rounded-3xl border transition-all hover:shadow-md ${
                order.status === "NEW"
                  ? "border-amber-500/40 bg-amber-500/5"
                  : order.status === "DELIVERED"
                    ? "border-border/60 bg-card opacity-85"
                    : "border-border/80 bg-card"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-foreground">
                        {order.orderNumber}
                      </span>
                      <Badge variant="outline" className="text-[9px] uppercase font-bold">
                        {order.orderSource || "WEB"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.customerName} ({order.customerPhone || "N/A"}) •{" "}
                      {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                    </p>
                  </div>

                  <Badge className={`text-[10px] uppercase font-bold ${getStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </div>

                {/* Items Summary */}
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-semibold text-muted-foreground text-[10px] uppercase">
                    <span>Ordered Items</span>
                    <span>Qty × Price</span>
                  </div>
                  {itemsList.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-foreground">
                      <span className="truncate max-w-[200px]">{it.name}</span>
                      <span className="font-mono font-medium">
                        {it.quantity} × ₹{it.price} = ₹{it.quantity * it.price}
                      </span>
                    </div>
                  ))}
                  {itemsList.length === 0 && (
                    <p className="text-muted-foreground italic">Standard order bundle</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{order.deliveryAddress || "Standard Delivery Address"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CreditCard className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate uppercase font-bold text-foreground">
                      {order.paymentMethod || "UPI"} • {order.paymentStatus || "paid"}
                    </span>
                  </div>
                </div>

                {/* Order Status Controller */}
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block">Order Total</span>
                    <span className="font-display font-black text-lg text-primary">
                      ₹{order.totalAmount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsInvoiceOpen(true);
                      }}
                      className="h-8 px-2.5 text-xs rounded-xl gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Printer className="w-3.5 h-3.5" /> Invoice
                    </Button>

                    <Select
                      value={order.status}
                      onValueChange={(val) => handleStatusChange(order.id, val as OrderRecord["status"])}
                    >
                      <SelectTrigger className="h-8 w-36 rounded-xl text-xs font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border">
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="ACCEPTED">Accept</SelectItem>
                        <SelectItem value="PREPARING">Preparing</SelectItem>
                        <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Invoice Modal */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Tax Invoice & Receipt
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Official customer invoice for fulfillment and tax documentation.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-4 text-xs">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Invoice No:</span>
                  <span className="font-mono font-bold text-foreground">
                    INV-{selectedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-foreground">
                    {selectedOrder.customerName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-foreground truncate max-w-[200px]">
                    {selectedOrder.deliveryAddress}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment:</span>
                  <span className="uppercase font-mono font-bold text-emerald-600">
                    {selectedOrder.paymentMethod} • {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 border-y border-border/60 py-3">
                <div className="flex justify-between text-muted-foreground font-semibold uppercase text-[10px]">
                  <span>Item</span>
                  <span>Amount</span>
                </div>
                {(selectedOrder.items || []).map((it, i) => (
                  <div key={i} className="flex justify-between text-foreground">
                    <span>
                      {it.name} × {it.quantity}
                    </span>
                    <span className="font-mono font-semibold">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-bold pt-1">
                <span>Grand Total (incl. Taxes)</span>
                <span className="font-display font-black text-lg text-primary">
                  ₹{selectedOrder.totalAmount}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInvoiceOpen(false)}
              className="rounded-xl text-xs"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                window.print();
              }}
              className="rounded-xl text-xs bg-primary text-primary-foreground font-semibold gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Tax Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

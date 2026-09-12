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
import { type StoredOrder, useStoreData } from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function OrdersManager() {
  const store = useStoreData();

  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");

  const handleStatusChange = (
    orderId: number,
    nextStatus: StoredOrder["status"],
  ) => {
    store.updateOrderStatus(
      orderId,
      nextStatus,
      `Updated to ${nextStatus} by admin`,
    );
    toast.success(`Order status updated to: ${nextStatus.replace(/_/g, " ")}`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(store.orders.find((o) => o.id === orderId) || null);
    }
  };

  const handleAssignDriver = (orderId: number) => {
    const driver = store.deliveryPartners.find(
      (d) => d.id === Number(selectedDriverId),
    );
    if (!driver) {
      toast.error("Please select a delivery rider.");
      return;
    }
    store.assignDriverToOrder(orderId, driver.id, driver.name);
    toast.success(`Assigned rider ${driver.name} to order!`);
    setSelectedDriverId("");
  };

  const getStatusColor = (status: StoredOrder["status"]) => {
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
      <DataTable<StoredOrder>
        title="Live Orders Management Pipeline"
        description="Track and fulfill real-time orders from Web, Mobile, and WhatsApp. Assign delivery drivers and print receipts."
        data={store.orders}
        searchPlaceholder="Search order ID, customer name, phone, address..."
        searchFilter={(item, query) =>
          item.orderNumber.toLowerCase().includes(query) ||
          item.customerName.toLowerCase().includes(query) ||
          item.customerPhone.includes(query) ||
          item.deliveryAddress.toLowerCase().includes(query) ||
          (item.vendorName || "").toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "orderSource",
            label: "Order Source",
            options: [
              { label: "WhatsApp Bot", value: "WHATSAPP" },
              { label: "Web Checkout", value: "WEB" },
              { label: "Mobile App", value: "MOBILE" },
            ],
          },
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
          { label: "Order ID (Newest)", value: "id_desc" },
          { label: "Amount (High to Low)", value: "amount_desc" },
          { label: "Amount (Low to High)", value: "amount_asc" },
        ]}
        defaultSort="id_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "amount_desc")
            return list.sort((a, b) => b.totalAmount - a.totalAmount);
          if (sortVal === "amount_asc")
            return list.sort((a, b) => a.totalAmount - b.totalAmount);
          return list.sort((a, b) => b.id - a.id);
        }}
        pageSize={6}
        renderItem={(order) => (
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
                    <Badge
                      variant="outline"
                      className={`text-[9px] uppercase font-bold ${
                        order.orderSource === "WHATSAPP"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : ""
                      }`}
                    >
                      {order.orderSource === "WHATSAPP" && (
                        <MessageCircle className="w-2.5 h-2.5 mr-1" />
                      )}
                      {order.orderSource}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.customerName} ({order.customerPhone}) •{" "}
                    {order.createdAt}
                  </p>
                </div>

                <Badge
                  className={`text-[10px] uppercase font-bold ${getStatusColor(order.status)}`}
                >
                  {order.status.replace(/_/g, " ")}
                </Badge>
              </div>

              {/* Items Summary */}
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-muted-foreground text-[10px] uppercase">
                  <span>Ordered Items</span>
                  <span>Qty × Price</span>
                </div>
                {order.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-foreground"
                  >
                    <span className="truncate max-w-[200px]">{it.name}</span>
                    <span className="font-mono font-medium">
                      {it.quantity} × ₹{it.price} = ₹{it.quantity * it.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{order.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CreditCard className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate uppercase font-bold text-foreground">
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Driver & Delivery Information */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-muted/30 border border-border/60 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    Rider:{" "}
                    <span className="font-bold text-foreground">
                      {order.assignedDriverName || "Not assigned yet"}
                    </span>
                  </span>
                </div>

                {!order.assignedDriverName &&
                  order.status !== "DELIVERED" &&
                  order.status !== "CANCELLED" && (
                    <div className="flex items-center gap-1">
                      <select
                        value={selectedDriverId}
                        onChange={(e) => setSelectedDriverId(e.target.value)}
                        className="h-7 text-xs rounded-lg border border-border bg-background px-2"
                      >
                        <option value="">Select Rider...</option>
                        {store.deliveryPartners.map((dp) => (
                          <option key={dp.id} value={dp.id}>
                            {dp.name} ({dp.currentStatus})
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        onClick={() => handleAssignDriver(order.id)}
                        className="h-7 px-2 text-[10px] rounded-lg"
                      >
                        Assign
                      </Button>
                    </div>
                  )}
              </div>

              {/* Status Update & Invoice Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Status:
                  </span>
                  <Select
                    value={order.status}
                    onValueChange={(val: any) =>
                      handleStatusChange(order.id, val)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xl w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New Order</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="PREPARING">Preparing</SelectItem>
                      <SelectItem value="READY">Ready for Pickup</SelectItem>
                      <SelectItem value="OUT_FOR_DELIVERY">
                        Out for Delivery
                      </SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-sm text-foreground">
                    ₹{order.totalAmount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsInvoiceOpen(true);
                    }}
                    className="h-8 px-2.5 text-xs rounded-xl gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Invoice Modal */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl p-6">
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-display font-black text-lg text-primary">
                    {store.settings.brandName}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Invoice #{selectedOrder.orderNumber}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs font-mono font-bold"
                >
                  {selectedOrder.createdAt}
                </Badge>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-semibold text-foreground">
                  Customer: {selectedOrder.customerName}
                </p>
                <p className="text-muted-foreground">
                  Phone: {selectedOrder.customerPhone}
                </p>
                <p className="text-muted-foreground">
                  Address: {selectedOrder.deliveryAddress}
                </p>
              </div>

              <div className="border border-border rounded-2xl p-3 text-xs space-y-2">
                <h4 className="font-bold text-foreground">Items Ordered:</h4>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-mono">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-bold text-sm">
                  <span>Grand Total</span>
                  <span className="text-primary">
                    ₹{selectedOrder.totalAmount}
                  </span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsInvoiceOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    window.print();
                  }}
                  className="rounded-xl text-xs bg-primary text-primary-foreground font-semibold gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

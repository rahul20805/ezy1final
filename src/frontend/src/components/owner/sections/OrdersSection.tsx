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
  Package,
  Phone,
  Printer,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { usePartnerAuth } from "../../../lib/partnerAuthStore";
import { type StoredOrder, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { DataTable } from "../DataTable";

export function OrdersSection() {
  const store = useStoreData();
  const { currentPartner } = usePartnerAuth();

  const partnerOrders =
    currentPartner?.role === "super_owner"
      ? store.orders
      : store.orders.filter(
          (o) => o.vendorId === currentPartner?.vendorId || o.vendorId === 0,
        );

  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleStatusChange = (
    orderId: number,
    newStatus: StoredOrder["status"],
  ) => {
    store.updateOrderStatus(orderId, newStatus);
    toast.success(`Order status updated to "${newStatus.replace(/_/g, " ")}"`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : null,
      );
    }
  };

  const handlePaymentStatusChange = (
    orderId: number,
    paymentStatus: StoredOrder["paymentStatus"],
  ) => {
    store.updateOrderPaymentStatus(orderId, paymentStatus);
    toast.success(`Payment status marked as "${paymentStatus}"`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus } : null));
    }
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteOrder(deleteConfirmId);
      toast.success("Order record removed.");
      setDeleteConfirmId(null);
      if (selectedOrder?.id === deleteConfirmId) setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredOrder>
        title="Customer Orders Pipeline"
        description="Monitor live incoming orders, update dispatch states, track payments and print invoices."
        data={partnerOrders}
        searchPlaceholder="Search by Order #, customer name, phone, address..."
        searchFilter={(item, query) =>
          item.orderNumber.toLowerCase().includes(query) ||
          item.customerName.toLowerCase().includes(query) ||
          item.customerPhone.includes(query) ||
          item.deliveryAddress.toLowerCase().includes(query) ||
          item.items.some((i) => i.name.toLowerCase().includes(query))
        }
        filterOptions={[
          {
            key: "status",
            label: "Order Status",
            options: [
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Preparing", value: "preparing" },
              { label: "Out for Delivery", value: "out_for_delivery" },
              { label: "Delivered", value: "delivered" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
          {
            key: "paymentMethod",
            label: "Payment Method",
            options: [
              { label: "UPI", value: "UPI" },
              { label: "Wallet", value: "Wallet" },
              { label: "Cash on Delivery", value: "COD" },
            ],
          },
          {
            key: "paymentStatus",
            label: "Payment Status",
            options: [
              { label: "Paid", value: "paid" },
              { label: "Pending", value: "pending" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Amount: High to Low", value: "amount_desc" },
          { label: "Amount: Low to High", value: "amount_asc" },
        ]}
        defaultSort="newest"
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
            className="rounded-2xl border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all"
          >
            <div className="p-4 border-b border-border/60 flex items-center justify-between gap-2 bg-muted/20">
              <div>
                <span className="font-mono text-xs font-bold text-foreground">
                  {order.orderNumber}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {order.createdAt}
                </p>
              </div>
              <Badge
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                  order.status === "DELIVERED"
                    ? "bg-emerald-500 text-white"
                    : order.status === "OUT_FOR_DELIVERY"
                      ? "bg-blue-500 text-white"
                      : order.status === "ACCEPTED" ||
                          order.status === "PREPARING" ||
                          order.status === "READY"
                        ? "bg-amber-500 text-white"
                        : order.status === "CANCELLED"
                          ? "bg-destructive text-white"
                          : "bg-purple-500 text-white"
                }`}
              >
                {order.status.replace(/_/g, " ")}
              </Badge>
            </div>

            <CardContent className="p-4 space-y-3">
              {/* Customer Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <User className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                  <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5 text-muted-foreground" />
                  <span className="line-clamp-1">{order.deliveryAddress}</span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Ordered Items ({order.items.length})
                </span>
                <div className="space-y-0.5">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="truncate text-foreground font-medium">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-muted-foreground font-mono">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-[10px] text-muted-foreground italic">
                      +{order.items.length - 2} more item(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Payment */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground">
                    Total Bill
                  </span>
                  <p className="font-display font-black text-lg text-foreground">
                    ₹{order.totalAmount}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {order.paymentMethod} • {order.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Status Selector & Invoice Action */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                <Select
                  value={order.status}
                  onValueChange={(val: any) =>
                    handleStatusChange(order.id, val)
                  }
                >
                  <SelectTrigger className="h-8 text-xs rounded-xl flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="out_for_delivery">
                      Out for Delivery
                    </SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                  className="h-8 px-2.5 text-xs rounded-xl gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> Details
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmId(order.id)}
                  className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Order Detail & Invoice Modal */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-lg bg-card border-border shadow-2xl rounded-3xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-display font-bold">
                    Invoice: {selectedOrder.orderNumber}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Placed on {selectedOrder.createdAt}
                  </DialogDescription>
                </div>
                <Badge
                  className={`text-xs uppercase font-bold ${
                    selectedOrder.status === "DELIVERED"
                      ? "bg-emerald-500 text-white"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {selectedOrder.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Customer Box */}
              <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs space-y-1">
                <p className="font-semibold text-foreground">
                  {selectedOrder.customerName}
                </p>
                <p className="text-muted-foreground">
                  {selectedOrder.customerPhone}{" "}
                  {selectedOrder.customerEmail
                    ? `• ${selectedOrder.customerEmail}`
                    : ""}
                </p>
                <p className="text-muted-foreground">
                  {selectedOrder.deliveryAddress}
                </p>
                {selectedOrder.notes && (
                  <p className="text-primary font-medium pt-1">
                    Note: {selectedOrder.notes}
                  </p>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="border border-border rounded-2xl overflow-hidden">
                <div className="p-2.5 bg-muted/60 text-[11px] font-bold text-muted-foreground flex justify-between">
                  <span>ITEM</span>
                  <span>TOTAL</span>
                </div>
                <div className="divide-y divide-border">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono font-bold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-muted/30 border-t border-border flex items-center justify-between text-sm font-bold">
                  <span>Grand Total</span>
                  <span className="text-primary font-display text-base">
                    ₹{selectedOrder.totalAmount}
                  </span>
                </div>
              </div>

              {/* Status Update Quick Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Fulfillment Status
                  </span>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val: any) =>
                      handleStatusChange(selectedOrder.id, val)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="out_for_delivery">
                        Out for Delivery
                      </SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Payment Status
                  </span>
                  <Select
                    value={selectedOrder.paymentStatus}
                    onValueChange={(val: any) =>
                      handlePaymentStatusChange(selectedOrder.id, val)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.print();
                }}
                className="gap-1.5 text-xs rounded-xl"
              >
                <Printer className="w-3.5 h-3.5" /> Print Invoice
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedOrder(null)}
                className="text-xs rounded-xl bg-primary text-primary-foreground"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Order Record?"
        description="Are you sure you want to delete this order record? This will remove it from the pipeline."
      />
    </div>
  );
}

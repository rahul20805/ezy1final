import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Navigation,
  Phone,
  Radio,
  RefreshCw,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useStoreData } from "../../../../lib/storeData";

export function LiveDeliveryTracker() {
  const store = useStoreData();
  const activeDeliveries = store.orders.filter(
    (o) => o.status === "OUT_FOR_DELIVERY",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
              Live Fleet & Order Delivery Dispatch
            </h1>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time visual tracking of active couriers, route telemetry, and
            customer drop-off milestones.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast.success("Live fleet GPS coordinates re-calibrated.")
          }
          className="h-8 rounded-xl text-xs gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh GPS Telemetry
        </Button>
      </div>

      {activeDeliveries.length === 0 ? (
        <Card className="rounded-3xl border-border bg-card p-12 text-center shadow-xs">
          <Truck className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-foreground">
            No Dispatches Currently in Transit
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            When an order is marked as "Out for Delivery" and assigned to a
            driver, its live GPS waypoint appears here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDeliveries.map((order) => (
            <Card
              key={order.id}
              className="rounded-3xl border-sky-500/40 bg-card p-5 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-foreground">
                      {order.orderNumber}
                    </span>
                    <Badge className="bg-sky-500/10 text-sky-600 border-sky-300 text-[10px] font-bold">
                      <Navigation className="w-2.5 h-2.5 mr-1 animate-pulse" />{" "}
                      Out for Delivery
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customer:{" "}
                    <span className="font-semibold text-foreground">
                      {order.customerName}
                    </span>{" "}
                    ({order.customerPhone})
                  </p>
                </div>

                <span className="font-display font-black text-base text-primary">
                  ₹{order.totalAmount}
                </span>
              </div>

              {/* Visual simulated progress tracker */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-3">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-primary" /> Rider:{" "}
                    <span className="font-bold text-foreground">
                      {order.assignedDriverName || "Akash Kumar"}
                    </span>
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">
                    ETA ~ 9 mins
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full w-3/4 animate-pulse" />
                </div>

                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{order.deliveryAddress}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  onClick={() => {
                    store.updateOrderStatus(
                      order.id,
                      "DELIVERED",
                      "Confirmed delivered by dispatch operator",
                    );
                    toast.success(
                      `Order ${order.orderNumber} marked as Delivered!`,
                    );
                  }}
                  className="w-full text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-xs"
                >
                  Confirm Customer Delivery Complete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

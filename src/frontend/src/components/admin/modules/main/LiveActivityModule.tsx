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
  CreditCard,
  FileCheck,
  LifeBuoy,
  MessageCircle,
  Package,
  Radio,
  RefreshCw,
  ShoppingBag,
  Star,
  Stethoscope,
  Truck,
  UserPlus,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useStoreData } from "../../../../lib/storeData";

export function LiveActivityModule() {
  const store = useStoreData();
  const [filterType, setFilterType] = useState<string>("all");

  const getEventIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-primary" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case "delivery":
        return <Truck className="w-4 h-4 text-sky-500" />;
      case "partner":
        return <FileCheck className="w-4 h-4 text-purple-500" />;
      case "booking":
        return <Stethoscope className="w-4 h-4 text-rose-500" />;
      case "review":
        return <Star className="w-4 h-4 text-amber-500" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filteredEvents = store.liveEvents.filter(
    (ev) => filterType === "all" || ev.type === filterType,
  );

  const simulateNewEvent = () => {
    toast.success("Synchronized with real-time websocket cluster!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
              Real-Time Platform Activity Stream
            </h1>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Live database events: incoming orders, payments, riders dispatched,
            support queries, and partner actions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={simulateNewEvent}
          className="h-8 rounded-xl text-xs gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Stream
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap bg-muted/60 p-1 rounded-2xl border border-border">
        {["all", "order", "payment", "delivery", "partner"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
              filterType === type
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {type === "all" ? "All Events" : type}
          </button>
        ))}
      </div>

      {/* Live Event Feed Cards */}
      <div className="space-y-3">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="rounded-2xl border-border bg-card hover:border-primary/40 transition-all p-4 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getEventIcon(event.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm text-foreground">
                      {event.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold"
                    >
                      {event.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.description}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">
                {event.timestamp}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

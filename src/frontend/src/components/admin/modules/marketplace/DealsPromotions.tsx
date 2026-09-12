import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Flame, Percent, Plus, Sparkles, Tag, Zap } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useStoreData } from "../../../../lib/storeData";

export function DealsPromotions() {
  const store = useStoreData();
  const [flashDeals, setFlashDeals] = useState([
    {
      id: 1,
      title: "Flash 50% Off on Farm Vegetables",
      category: "Fresh Produce",
      discount: "50% OFF",
      endsIn: "04h 32m",
      active: true,
    },
    {
      id: 2,
      title: "Weekend Pottery Workshop Early Bird Special",
      category: "Workshops",
      discount: "Flat ₹300 OFF",
      endsIn: "18h 10m",
      active: true,
    },
    {
      id: 3,
      title: "Monsoon Health Checkup & Doctor Consult Combo",
      category: "Healthcare",
      discount: "30% OFF",
      endsIn: "2 days",
      active: true,
    },
  ]);

  const toggleDeal = (id: number) => {
    setFlashDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)),
    );
    toast.success("Deal status updated live.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" /> Flash
            Deals & Promotional Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage limited-time flash sales, countdown deals, and homepage
            promotional spotlights.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => toast.info("New Flash Sale Campaign builder opened.")}
          className="h-9 rounded-xl text-xs bg-primary text-primary-foreground font-semibold gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Launch Flash Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {flashDeals.map((deal) => (
          <Card
            key={deal.id}
            className={`rounded-3xl border transition-all p-5 space-y-3 ${
              deal.active
                ? "border-amber-500/40 bg-card"
                : "border-border/60 bg-muted/20 opacity-70"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] font-bold">
                <Flame className="w-3 h-3 mr-1 fill-amber-500" />{" "}
                {deal.discount}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono">
                <Clock className="w-3 h-3 mr-1 text-muted-foreground" />{" "}
                {deal.endsIn}
              </Badge>
            </div>

            <h3 className="font-display font-bold text-sm text-foreground">
              {deal.title}
            </h3>
            <p className="text-xs text-muted-foreground">{deal.category}</p>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <span
                className={`text-xs font-semibold ${deal.active ? "text-emerald-600" : "text-muted-foreground"}`}
              >
                {deal.active ? "● Live on App" : "○ Inactive"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleDeal(deal.id)}
                className="h-8 px-2.5 text-xs rounded-xl"
              >
                {deal.active ? "Pause Deal" : "Resume Deal"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Car,
  CheckCircle2,
  DollarSign,
  Flame,
  Map,
  MapPin,
  Plus,
  Radio,
  Save,
  Tag,
  Truck,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useStoreData } from "../../../../lib/storeData";

export function DeliveryZonesAndCharges() {
  const store = useStoreData();

  // Settings State
  const [minOrder, setMinOrder] = useState(store.settings.minimumOrderAmount);
  const [freeThreshold, setFreeThreshold] = useState(
    store.settings.freeDeliveryThreshold,
  );
  const [stdFee, setStdFee] = useState(store.settings.standardDeliveryFee);
  const [expressFee, setExpressFee] = useState(
    store.settings.expressDeliveryFee,
  );
  const [radius, setRadius] = useState(store.settings.deliveryRadiusKm);

  // New Zone Form
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneCity, setNewZoneCity] = useState("Bengaluru");
  const [newZoneRadius, setNewZoneRadius] = useState<number>(6);

  const handleSaveDeliveryRules = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      minimumOrderAmount: Number(minOrder),
      freeDeliveryThreshold: Number(freeThreshold),
      standardDeliveryFee: Number(stdFee),
      expressDeliveryFee: Number(expressFee),
      deliveryRadiusKm: Number(radius),
    });
    toast.success(
      "Delivery fee structure & distance rules saved to live website!",
    );
  };

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;

    store.addDeliveryZone({
      name: newZoneName.trim(),
      city: newZoneCity.trim(),
      radiusKm: Number(newZoneRadius),
      active: true,
    });
    toast.success(`Delivery Zone "${newZoneName}" created!`);
    setNewZoneName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Delivery Zones, Charges & Dynamic Rules
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure base delivery fees, distance-based thresholds, free
            delivery limits, and geographic hubs.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSaveDeliveryRules}
          className="h-9 rounded-xl text-xs bg-primary text-primary-foreground font-semibold gap-1.5 shadow-xs"
        >
          <Save className="w-3.5 h-3.5" /> Save Delivery Rules
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Fee Structure Config */}
        <Card className="lg:col-span-7 rounded-3xl border-border bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-display font-bold">
              Delivery Pricing & Minimums
            </CardTitle>
            <CardDescription className="text-xs">
              These rules directly calculate delivery charges at customer
              checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Minimum Basket Amount (₹) *
                </Label>
                <Input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="rounded-xl font-bold font-mono text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  Orders below this will not be accepted.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Free Delivery Above (₹) *
                </Label>
                <Input
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="rounded-xl font-bold font-mono text-sm text-emerald-600"
                />
                <p className="text-[10px] text-muted-foreground">
                  Cart total qualifying for zero delivery fee.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Standard Delivery Fee (₹)
                </Label>
                <Input
                  type="number"
                  value={stdFee}
                  onChange={(e) => setStdFee(Number(e.target.value))}
                  className="rounded-xl font-bold text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Express 10-Min Fee (₹)
                </Label>
                <Input
                  type="number"
                  value={expressFee}
                  onChange={(e) => setExpressFee(Number(e.target.value))}
                  className="rounded-xl font-bold text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Max Radius (km)</Label>
                <Input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="rounded-xl font-bold text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Active Geographic Zones */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border-border bg-card shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base">
                Geographic Delivery Zones
              </h3>
              <Badge variant="outline" className="text-[10px] font-bold">
                {store.deliveryZones.length} Zones Active
              </Badge>
            </div>

            <div className="space-y-2">
              {store.deliveryZones.map((z) => (
                <div
                  key={z.id}
                  className="p-3 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <div>
                      <h4 className="font-bold text-foreground">{z.name}</h4>
                      <span className="text-[10px] text-muted-foreground">
                        {z.city} • Radius: {z.radiusKm} km
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px] font-bold">
                    Active
                  </Badge>
                </div>
              ))}
            </div>

            {/* Add Zone Inline */}
            <form
              onSubmit={handleCreateZone}
              className="pt-3 border-t border-border/60 space-y-2.5"
            >
              <span className="text-xs font-bold text-foreground">
                Add New Delivery Zone
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Zone name (e.g. Koramangala)"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="rounded-xl text-xs"
                />
                <Input
                  type="number"
                  placeholder="Radius (km)"
                  value={newZoneRadius}
                  onChange={(e) => setNewZoneRadius(Number(e.target.value))}
                  className="rounded-xl text-xs font-mono"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="w-full text-xs rounded-xl font-semibold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Zone
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

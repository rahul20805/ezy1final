import { useState } from "react";
import Layout from "../components/Layout";
import { useRequireAuth } from "../components/AuthPromptModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Truck,
  Weight
} from "lucide-react";

export default function ParcelPage() {
  const [pickup, setPickup] = useState("Indiranagar 100ft Road, Bengaluru");
  const [drop, setDrop] = useState("Bellandur Green Glen, Bengaluru");
  const [weightCategory, setWeightCategory] = useState<"light" | "medium" | "heavy">("light");
  const [bookedSuccess, setBookedSuccess] = useState<string | null>(null);

  const { requireAuth } = useRequireAuth();

  const fareMap = {
    light: { label: "Up to 3 kg (Documents, Food, Clothes)", price: 65, eta: "35 mins" },
    medium: { label: "3 to 10 kg (Electronics, Groceries, Boxes)", price: 110, eta: "45 mins" },
    heavy: { label: "10 to 20 kg (Bulk items, Heavy equipment)", price: 190, eta: "60 mins" },
  };

  const handleBookParcel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !drop) return;

    requireAuth({
      title: "Confirm EZY Parcel Pickup",
      description: `Pickup from ${pickup.slice(0, 20)}... • Estimated Delivery in ${fareMap[weightCategory].eta} • Total ₹${fareMap[weightCategory].price}`,
      onSuccess: () => {
        setBookedSuccess(`Parcel delivery booked! Rider assigned in 2 mins. Tracking ID: EZY-PK-${Date.now().toString().slice(-4)}`);
        setTimeout(() => setBookedSuccess(null), 6000);
      }
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md">
          <div className="container max-w-4xl py-8 px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold">
                Instant City Courier
              </Badge>
              <span className="text-xs text-muted-foreground">Pick up in 10 mins</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              EZY Parcel — Send Packages Across City
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Deliver keys, forgotten chargers, documents, home-cooked food, or business orders instantly with live GPS tracking.
            </p>

            {bookedSuccess && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{bookedSuccess}</span>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="container max-w-4xl py-8 px-4 sm:px-6">
          <Card className="rounded-2xl border-border bg-card shadow-md">
            <CardContent className="p-6">
              <form onSubmit={handleBookParcel} className="space-y-6">
                {/* Pickup & Drop Addresses */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Pickup Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                      <Input
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="Enter pickup address, house/flat no..."
                        className="pl-10 h-12 rounded-xl bg-background border-border text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                      <Input
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                        placeholder="Enter recipient's address, street name..."
                        className="pl-10 h-12 rounded-xl bg-background border-border text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Package Size / Weight Selector */}
                <div>
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Weight className="w-4 h-4 text-primary" />
                    Package Weight / Size
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(["light", "medium", "heavy"] as const).map((w) => {
                      const details = fareMap[w];
                      const isSelected = weightCategory === w;

                      return (
                        <div
                          key={w}
                          onClick={() => setWeightCategory(w)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-smooth ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-border/80 bg-muted/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold capitalize text-foreground">
                              {w} Pack
                            </span>
                            <span className="text-base font-bold font-display text-primary">
                              ₹{details.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {details.label}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-2">
                            <Clock className="w-3 h-3" />
                            ETA ~{details.eta}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Booking Summary & Submit */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Total Delivery Fare</div>
                    <div className="text-2xl font-bold font-display text-foreground">
                      ₹{fareMap[weightCategory].price}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium">
                      ✓ No hidden charges • Live GPS sharing enabled
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold font-display hover:opacity-95 shadow-sm"
                  >
                    Request Pickup ({fareMap[weightCategory].eta})
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Building2,
  CheckCircle2,
  Minus,
  Plus,
  Radio,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ServerDataTable } from "../../ServerDataTable";

interface HospitalBedRecord {
  id: number;
  businessName?: string;
  name?: string;
  city?: string;
  totalBeds?: number;
  availableBeds?: number;
  icuBedsAvailable?: number;
  departments?: string | string[];
}

export function HospitalBedsManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBedAdjust = async (hosp: HospitalBedRecord, delta: number) => {
    const total = hosp.totalBeds || 100;
    const current = hosp.availableBeds || 0;
    const nextAvailable = Math.max(0, Math.min(total, current + delta));

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      const res = await fetch(`/api/vendors/${hosp.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ availableBeds: nextAvailable }),
      });

      if (!res.ok) throw new Error("Failed to update bed count in database.");

      toast.success(
        `Updated ${hosp.businessName || hosp.name} available beds to ${nextAvailable}`
      );
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to update bed count.");
    }
  };

  return (
    <div className="space-y-6">
      <ServerDataTable<HospitalBedRecord>
        title="Live Hospital Beds Administration Tracker"
        description="Real-time availability of ICU ventilators, General Wards, and Emergency Trauma beds across verified hospitals."
        fetchUrl="/api/hospitals"
        refreshTrigger={refreshTrigger}
        searchPlaceholder="Search hospital, city, department..."
        sortOptions={[
          { label: "Available Beds", value: "availableBeds_desc", sortBy: "availableBeds", sortOrder: "desc" },
          { label: "Hospital Name", value: "businessName_asc", sortBy: "businessName", sortOrder: "asc" },
        ]}
        defaultSort="availableBeds_desc"
        defaultPageSize={25}
        renderItem={(hosp) => {
          const hospName = hosp.businessName || hosp.name || "Hospital";
          const total = hosp.totalBeds || 100;
          const available = hosp.availableBeds || 0;
          const occupied = Math.max(0, total - available);
          const percentOccupied = Math.round((occupied / total) * 100);

          return (
            <Card
              key={hosp.id}
              className="rounded-3xl border-border bg-card p-5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    {hospName}
                  </h3>
                  <p className="text-xs text-primary font-medium mt-0.5">
                    {hosp.city || "Bengaluru"}
                  </p>
                </div>

                <Badge className="bg-purple-500/10 text-purple-600 text-[10px] uppercase font-bold">
                  {hosp.icuBedsAvailable || 0} ICU Beds
                </Badge>
              </div>

              {/* Progress & Live Occupancy */}
              <div className="space-y-1.5 my-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Occupancy: {percentOccupied}%
                  </span>
                  <span className="font-mono text-muted-foreground">Live DB</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentOccupied >= 90
                        ? "bg-rose-500"
                        : percentOccupied >= 70
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${percentOccupied}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-muted/40 border border-border/60 text-center text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">
                    Total
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {total}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">
                    Occupied
                  </span>
                  <span className="font-mono font-bold text-amber-500">
                    {occupied}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">
                    Available
                  </span>
                  <span className="font-mono font-black text-emerald-600 text-sm">
                    {available}
                  </span>
                </div>
              </div>

              {/* Real-time Adjuster */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Adjust Available:
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBedAdjust(hosp, -1)}
                    disabled={available <= 0}
                    className="h-8 w-8 p-0 rounded-xl"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-mono font-bold text-xs w-6 text-center">
                    {available}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBedAdjust(hosp, 1)}
                    disabled={available >= total}
                    className="h-8 w-8 p-0 rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        }}
      />
    </div>
  );
}

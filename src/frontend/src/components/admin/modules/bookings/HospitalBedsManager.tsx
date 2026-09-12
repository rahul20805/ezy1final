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
import React from "react";
import { toast } from "sonner";
import {
  type StoredHospitalBed,
  useStoreData,
} from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function HospitalBedsManager() {
  const store = useStoreData();

  const handleBedAdjust = (bed: StoredHospitalBed, delta: number) => {
    const nextAvailable = Math.max(
      0,
      Math.min(bed.totalBeds, bed.availableBeds + delta),
    );
    const nextOccupied = bed.totalBeds - nextAvailable;

    store.updateHospitalBedCount(bed.id, nextAvailable, nextOccupied);
    toast.success(
      `Updated ${bed.hospitalName} (${bed.department}) available beds to ${nextAvailable}`,
    );
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredHospitalBed>
        title="Live Hospital Beds Administration Tracker"
        description="Real-time availability of ICU ventilators, General Wards, and Emergency Trauma beds across verified hospitals."
        data={store.hospitalBeds}
        searchPlaceholder="Search hospital, department, bed type..."
        searchFilter={(item, query) =>
          item.hospitalName.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.bedType.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "bedType",
            label: "Bed Category",
            options: [
              { label: "ICU / Ventilator", value: "ICU / Ventilator" },
              { label: "Emergency", value: "Emergency" },
              { label: "General Ward", value: "General Ward" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Available Beds", value: "avail_desc" },
          { label: "Hospital Name", value: "name_asc" },
        ]}
        defaultSort="avail_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "avail_desc")
            return list.sort((a, b) => b.availableBeds - a.availableBeds);
          return list.sort((a, b) =>
            a.hospitalName.localeCompare(b.hospitalName),
          );
        }}
        pageSize={6}
        renderItem={(bed) => {
          const percentOccupied = Math.round(
            (bed.occupiedBeds / bed.totalBeds) * 100,
          );

          return (
            <Card
              key={bed.id}
              className="rounded-3xl border-border bg-card p-5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    {bed.hospitalName}
                  </h3>
                  <p className="text-xs text-primary font-medium mt-0.5">
                    {bed.department}
                  </p>
                </div>

                <Badge
                  className={`text-[10px] uppercase font-bold ${
                    bed.bedType === "ICU / Ventilator"
                      ? "bg-purple-500/10 text-purple-600"
                      : bed.bedType === "Emergency"
                        ? "bg-rose-500/10 text-rose-600"
                        : "bg-muted text-foreground"
                  }`}
                >
                  {bed.bedType}
                </Badge>
              </div>

              {/* Progress & Live Occupancy */}
              <div className="space-y-1.5 my-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Occupancy: {percentOccupied}%
                  </span>
                  <span className="font-mono text-muted-foreground">
                    Updated: {bed.lastUpdated}
                  </span>
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
                    {bed.totalBeds}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">
                    Occupied
                  </span>
                  <span className="font-mono font-bold text-amber-500">
                    {bed.occupiedBeds}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">
                    Available
                  </span>
                  <span className="font-mono font-black text-emerald-600 text-sm">
                    {bed.availableBeds}
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
                    onClick={() => handleBedAdjust(bed, -1)}
                    disabled={bed.availableBeds <= 0}
                    className="h-8 w-8 p-0 rounded-xl"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-mono font-bold text-xs w-6 text-center">
                    {bed.availableBeds}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBedAdjust(bed, 1)}
                    disabled={bed.availableBeds >= bed.totalBeds}
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

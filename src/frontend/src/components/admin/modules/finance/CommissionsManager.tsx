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
import { Percent, Plus, Save, ShieldCheck, Tag } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useStoreData } from "../../../../lib/storeData";

export function CommissionsManager() {
  const store = useStoreData();

  const [commissions, setCommissions] = useState([
    { category: "Grocery & Retail", percent: 5, fixedFee: 0 },
    { category: "Pharmacy & Wellness", percent: 6, fixedFee: 0 },
    { category: "On-Demand Home Services", percent: 10, fixedFee: 20 },
    { category: "Workshops & Classes", percent: 8, fixedFee: 0 },
    { category: "Doctor Consultations", percent: 5, fixedFee: 15 },
    { category: "Transport & Rides", percent: 7, fixedFee: 5 },
  ]);

  const handleUpdateCommission = (
    index: number,
    field: "percent" | "fixedFee",
    value: number,
  ) => {
    setCommissions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );
  };

  const handleSaveRules = () => {
    toast.success(
      "Platform commission rates updated and applied across all partner settlements!",
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" /> Platform Commission &
            GST Rules
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure category-specific take rates, fixed booking fees, and GST
            tax invoice rules.
          </p>
        </div>

        <Button
          onClick={handleSaveRules}
          className="h-9 rounded-xl text-xs bg-primary text-primary-foreground font-semibold gap-1.5 shadow-xs"
        >
          <Save className="w-3.5 h-3.5" /> Save Commission Rules
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {commissions.map((comm, idx) => (
          <Card
            key={idx}
            className="rounded-3xl border-border bg-card p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-foreground">
                {comm.category}
              </h3>
              <Badge variant="outline" className="text-[10px] font-bold">
                {comm.percent}% Commission
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Percentage (%)</Label>
                <Input
                  type="number"
                  value={comm.percent}
                  onChange={(e) =>
                    handleUpdateCommission(
                      idx,
                      "percent",
                      Number(e.target.value),
                    )
                  }
                  className="rounded-xl font-bold text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Fixed Fee (₹)</Label>
                <Input
                  type="number"
                  value={comm.fixedFee}
                  onChange={(e) =>
                    handleUpdateCommission(
                      idx,
                      "fixedFee",
                      Number(e.target.value),
                    )
                  }
                  className="rounded-xl font-bold text-xs"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

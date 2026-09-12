import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  CheckCircle2,
  HeartPulse,
  MapPin,
  Phone,
  Radio,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import React, { useState } from "react";
import { ServerDataTable } from "../../ServerDataTable";

interface HospitalVendor {
  id: number;
  businessName: string;
  name?: string;
  city: string;
  address?: string;
  phone: string;
  emergencyPhone?: string;
  hasEmergency24x7?: boolean;
  totalBeds?: number;
  availableBeds?: number;
  icuBedsAvailable?: number;
  departments?: string | string[];
  verified?: boolean;
}

export function HospitalsManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="space-y-6">
      <ServerDataTable<HospitalVendor>
        title="Verified Hospitals & Emergency Directory"
        description="Multi-specialty hospital listings, 24x7 emergency contacts, departments and real-time bed statistics directly from database."
        fetchUrl="/api/hospitals"
        refreshTrigger={refreshTrigger}
        searchPlaceholder="Search hospital name, city, department..."
        sortOptions={[
          { label: "Hospital Name (A-Z)", value: "businessName_asc", sortBy: "businessName", sortOrder: "asc" },
          { label: "Available Beds", value: "availableBeds_desc", sortBy: "availableBeds", sortOrder: "desc" },
          { label: "Newest Added", value: "id_desc", sortBy: "id", sortOrder: "desc" },
        ]}
        defaultSort="businessName_asc"
        defaultPageSize={25}
        renderItem={(hosp) => {
          const hospName = hosp.businessName || hosp.name || "Hospital";
          const deptList = Array.isArray(hosp.departments)
            ? hosp.departments
            : typeof hosp.departments === "string"
              ? hosp.departments.split(",").map((d) => d.trim())
              : ["Emergency", "General Medicine"];

          return (
            <Card
              key={hosp.id}
              className="rounded-3xl border-border bg-card p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-base text-foreground">
                          {hospName}
                        </h3>
                        {hosp.verified !== false && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {hosp.address || ""}, {hosp.city}
                      </p>
                    </div>
                  </div>

                  {hosp.hasEmergency24x7 && (
                    <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30 text-[10px] font-bold">
                      <HeartPulse className="w-3 h-3 mr-1" /> 24x7 Emergency
                    </Badge>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs my-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Emergency Contact:</span>
                    <span className="font-mono font-bold text-rose-600">
                      {hosp.emergencyPhone || hosp.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ICU Beds Available:</span>
                    <span className="font-bold text-emerald-600">
                      {hosp.icuBedsAvailable || 0} ICU Beds
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {deptList.map((dept, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5 rounded-lg"
                    >
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-3">
                <span className="text-xs text-muted-foreground">
                  Total Capacity:{" "}
                  <span className="font-bold text-foreground">
                    {hosp.totalBeds || 100} Beds
                  </span>
                </span>
                <Badge
                  variant="outline"
                  className="text-xs font-bold text-emerald-600 border-emerald-300"
                >
                  {hosp.availableBeds || 0} Beds Available
                </Badge>
              </div>
            </Card>
          );
        }}
      />
    </div>
  );
}

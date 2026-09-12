import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  MapPin,
  Phone,
  Power,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ServerDataTable } from "../../ServerDataTable";

interface ServiceSpecialist {
  id: number;
  businessName: string;
  ownerName: string;
  category: string;
  city: string;
  phone: string;
  rating?: number;
  available?: boolean;
  verified?: boolean;
  status: string;
  joinedAt?: string;
  hourlyRate?: number;
}

export function ServiceProviders() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const toggleAvailability = async (specialist: ServiceSpecialist) => {
    const nextAvail = specialist.available === false ? true : false;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      const res = await fetch(`/api/vendors/${specialist.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ available: nextAvail }),
      });

      if (!res.ok) throw new Error("Failed to update availability.");

      toast.success(
        `Provider #${specialist.id} marked ${nextAvail ? "AVAILABLE" : "UNAVAILABLE"}`
      );
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle provider availability.");
    }
  };

  return (
    <div className="space-y-6">
      <ServerDataTable<ServiceSpecialist>
        title="Verified Service Specialists Roster"
        description="Electricians, plumbers, deep cleaners, appliance technicians, and carpenters directly querying live database."
        fetchUrl="/api/vendors?category=Services"
        refreshTrigger={refreshTrigger}
        searchPlaceholder="Search technician name, trade, city, phone..."
        filterOptions={[
          {
            key: "city",
            label: "Location",
            options: [
              { label: "Bengaluru", value: "Bengaluru" },
              { label: "Mumbai", value: "Mumbai" },
              { label: "Thiruvananthapuram", value: "Thiruvananthapuram" },
              { label: "Delhi NCR", value: "Delhi" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Name (A-Z)", value: "businessName_asc", sortBy: "businessName", sortOrder: "asc" },
          { label: "Highest Rated", value: "rating_desc", sortBy: "rating", sortOrder: "desc" },
          { label: "Newest Joined", value: "id_desc", sortBy: "id", sortOrder: "desc" },
        ]}
        defaultSort="rating_desc"
        defaultPageSize={25}
        renderItem={(specialist) => {
          const isAvail = specialist.available !== false;
          return (
            <Card
              key={specialist.id}
              className={`rounded-3xl border transition-all hover:shadow-md ${
                isAvail
                  ? "border-border/80 bg-card"
                  : "border-muted bg-muted/20 opacity-70"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-display font-black text-lg flex-shrink-0">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                          {specialist.businessName || specialist.ownerName}
                        </h3>
                        {specialist.verified !== false && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Specialist:{" "}
                        <span className="font-medium text-foreground">
                          {specialist.ownerName || "Master Technician"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`text-[10px] font-bold ${
                      isAvail
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isAvail ? "Active / Available" : "Off-Duty"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{specialist.city || "Bengaluru"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{specialist.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <span className="font-semibold text-foreground">
                      {specialist.rating || 4.8} / 5.0
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="truncate font-semibold text-emerald-600">
                      Background Checked
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-xs font-mono text-muted-foreground">
                    Partner ID: #{specialist.id}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAvailability(specialist)}
                    className={`h-8 px-2.5 text-xs rounded-xl font-semibold ${
                      isAvail ? "hover:text-destructive" : "text-emerald-600"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5 mr-1" />
                    {isAvail ? "Set Off-Duty" : "Set Available"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />
    </div>
  );
}

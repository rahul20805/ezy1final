import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  MapPin,
  Phone,
  Plus,
  Power,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredServiceProvider, useStoreData } from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

const defaultProviders: StoredServiceProvider[] = [
  {
    id: 1,
    name: "Suresh Sharma",
    category: "Electrical Master",
    phone: "9812345670",
    city: "Bengaluru",
    rating: 4.9,
    jobsCompleted: 142,
    isAvailable: true,
    verified: true,
    experienceYears: 12,
    hourlyRate: 299,
    joinedAt: "2025-10-01",
  },
  {
    id: 2,
    name: "Ramesh Verma",
    category: "Certified Plumber",
    phone: "9845001122",
    city: "Bengaluru",
    rating: 4.8,
    jobsCompleted: 98,
    isAvailable: true,
    verified: true,
    experienceYears: 8,
    hourlyRate: 249,
    joinedAt: "2025-11-15",
  },
  {
    id: 3,
    name: "Manoj Carpenter",
    category: "Woodwork & Furniture",
    phone: "9712334455",
    city: "Mumbai",
    rating: 4.7,
    jobsCompleted: 64,
    isAvailable: false,
    verified: true,
    experienceYears: 10,
    hourlyRate: 350,
    joinedAt: "2026-01-10",
  },
];

export function ServiceProviders() {
  const [providers, setProviders] = useState<StoredServiceProvider[]>(defaultProviders);

  const toggleAvailability = (id: number) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
    toast.success("Provider availability updated live.");
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredServiceProvider>
        title="Verified Service Specialists Roster"
        description="Electricians, plumbers, deep cleaners, appliance technicians, and carpenters."
        data={providers}
        searchPlaceholder="Search technician name, trade, city..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "category",
            label: "Trade Specialization",
            options: [
              { label: "Electrical Master", value: "Electrical Master" },
              { label: "Certified Plumber", value: "Certified Plumber" },
              { label: "Woodwork & Furniture", value: "Woodwork & Furniture" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Rating (High to Low)", value: "rating_desc" },
          { label: "Jobs Completed", value: "jobs_desc" },
        ]}
        defaultSort="rating_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "jobs_desc") return list.sort((a, b) => b.jobsCompleted - a.jobsCompleted);
          return list.sort((a, b) => b.rating - a.rating);
        }}
        pageSize={6}
        renderItem={(provider) => (
          <Card key={provider.id} className="rounded-3xl border-border bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-display font-black text-lg">
                  {provider.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm text-foreground">{provider.name}</h3>
                    {provider.verified && <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{provider.category}</p>
                </div>
              </div>

              <Badge
                className={`text-[10px] font-bold ${
                  provider.isAvailable ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                }`}
              >
                {provider.isAvailable ? "Available Now" : "On Leave / Busy"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs my-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                <span className="font-bold text-foreground">{provider.rating}</span>
                <span>({provider.jobsCompleted} jobs)</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{provider.city}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{provider.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Wrench className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{provider.experienceYears} Years Exp</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <span className="font-display font-black text-sm text-foreground">₹{provider.hourlyRate}</span>
                <span className="text-[10px] text-muted-foreground"> / hour</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAvailability(provider.id)}
                className="h-8 px-2.5 text-xs rounded-xl"
              >
                <Power className="w-3.5 h-3.5 mr-1" />
                {provider.isAvailable ? "Mark Busy" : "Mark Available"}
              </Button>
            </div>
          </Card>
        )}
      />
    </div>
  );
}

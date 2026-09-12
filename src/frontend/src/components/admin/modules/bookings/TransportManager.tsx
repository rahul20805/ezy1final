import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Car,
  Clock,
  Edit2,
  MapPin,
  Plus,
  Power,
  ShieldCheck,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ServerDataTable } from "../../ServerDataTable";

interface TransportVendor {
  id: number;
  businessName: string;
  ownerName?: string;
  category?: string;
  city?: string;
  phone?: string;
  rating?: number;
  status: string;
  totalOrders?: number;
  openingHours?: string;
}

export function TransportManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TransportVendor | null>(null);

  // Form State
  const [businessName, setBusinessName] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [phone, setPhone] = useState("");
  const [operatingHours, setOperatingHours] = useState("06:00 AM - 11:00 PM");

  const openAddDialog = () => {
    setEditingItem(null);
    setBusinessName("");
    setOperatorName("");
    setCity("Bengaluru");
    setPhone("9900112233");
    setOperatingHours("06:00 AM - 11:00 PM");
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: TransportVendor) => {
    setEditingItem(item);
    setBusinessName(item.businessName);
    setOperatorName(item.ownerName || "");
    setCity(item.city || "Bengaluru");
    setPhone(item.phone || "");
    setOperatingHours(item.openingHours || "06:00 AM - 11:00 PM");
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      toast.error("Transport service name is required.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      if (editingItem) {
        const res = await fetch(`/api/vendors/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            businessName: businessName.trim(),
            ownerName: operatorName.trim(),
            city: city.trim(),
            phone: phone.trim(),
            openingHours: operatingHours.trim(),
          }),
        });

        if (!res.ok) throw new Error("Failed to update transport service.");
        toast.success(`Transport route "${businessName}" updated!`);
      } else {
        const res = await fetch("/api/partner-applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: businessName.trim(),
            ownerName: operatorName.trim() || "Fleet Manager",
            category: "Transport",
            partnerType: "transport_driver",
            email: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}@transport.ezy1.in`,
            phone: phone.trim(),
            city: city.trim(),
            operatingHours: operatingHours.trim(),
          }),
        });

        if (!res.ok) throw new Error("Failed to register transport listing.");
        toast.success(`Transport service "${businessName}" registered!`);
      }

      setIsDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to save transport.");
    }
  };

  const toggleStatus = async (item: TransportVendor) => {
    const nextStatus = item.status === "suspended" ? "approved" : "suspended";
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      const res = await fetch(`/api/vendors/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Could not update status.");
      toast.success(`Transport fleet #${item.id} is now ${nextStatus.toUpperCase()}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <ServerDataTable<TransportVendor>
        title="Bus, Auto & Cab Transit Fleet"
        description="Manage shared autos, intercity buses, local shuttles, and verified on-demand cab fleets."
        fetchUrl="/api/transport"
        refreshTrigger={refreshTrigger}
        onAddNew={openAddDialog}
        addNewLabel="Add Fleet / Route"
        searchPlaceholder="Search fleet name, operator, city, phone..."
        sortOptions={[
          { label: "Fleet Name (A-Z)", value: "businessName_asc", sortBy: "businessName", sortOrder: "asc" },
          { label: "Newest Added", value: "id_desc", sortBy: "id", sortOrder: "desc" },
        ]}
        defaultSort="businessName_asc"
        defaultPageSize={25}
        renderItem={(fleet) => {
          const isActive = fleet.status === "approved" || fleet.status === "active";
          return (
            <Card
              key={fleet.id}
              className={`rounded-3xl border transition-all hover:shadow-md ${
                isActive ? "border-border/80 bg-card" : "border-muted bg-muted/20 opacity-75"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                          {fleet.businessName}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Operator:{" "}
                        <span className="font-medium text-foreground">
                          {fleet.ownerName || "Fleet Partner"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`text-[10px] font-bold ${
                      isActive ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive ? "Active Route" : "Suspended"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{fleet.city || "Bengaluru"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{fleet.openingHours || "Daily service"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{fleet.totalOrders || 0} Total Trips</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="font-mono text-muted-foreground">
                      ID: #{fleet.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(fleet)}
                    className="h-8 px-2.5 text-xs rounded-xl gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(fleet)}
                    className={`h-8 px-2.5 text-xs rounded-xl font-semibold ${
                      isActive ? "hover:text-destructive" : "text-emerald-600"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5 mr-1" />
                    {isActive ? "Suspend" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-bold">
                {editingItem ? "Edit Fleet / Route" : "Register New Transit Fleet"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Fleet operations and transit schedules update live across passenger apps.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Service / Route Name *</Label>
                <Input
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Mumbai Metro Connect EV Cabs"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Fleet Operator</Label>
                  <Input
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Operating City</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9900112233"
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Timings / Frequency</Label>
                  <Input
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="06:00 AM - 11:00 PM"
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {editingItem ? "Update Fleet" : "Register Fleet"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

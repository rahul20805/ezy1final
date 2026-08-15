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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  CheckCircle2,
  Edit2,
  Navigation,
  Phone,
  Plus,
  Power,
  ShieldCheck,
  Star,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredDeliveryPartner, useStoreData } from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function DeliveryPartners() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<StoredDeliveryPartner | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState<StoredDeliveryPartner["vehicleType"]>("Electric Scooter");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [currentStatus, setCurrentStatus] = useState<StoredDeliveryPartner["currentStatus"]>("ONLINE");

  const openAddDialog = () => {
    setEditingPartner(null);
    setName("");
    setPhone("");
    setVehicleType("Electric Scooter");
    setVehicleNumber("KA-01-EZ-1122");
    setCurrentStatus("ONLINE");
    setIsDialogOpen(true);
  };

  const openEditDialog = (dp: StoredDeliveryPartner) => {
    setEditingPartner(dp);
    setName(dp.name);
    setPhone(dp.phone);
    setVehicleType(dp.vehicleType);
    setVehicleNumber(dp.vehicleNumber);
    setCurrentStatus(dp.currentStatus);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and Phone number are required.");
      return;
    }

    if (editingPartner) {
      store.updateDeliveryPartner(editingPartner.id, {
        name: name.trim(),
        phone: phone.trim(),
        vehicleType,
        vehicleNumber: vehicleNumber.trim(),
        currentStatus,
      });
      toast.success(`Rider profile "${name}" updated!`);
    } else {
      store.addDeliveryPartner({
        name: name.trim(),
        phone: phone.trim(),
        vehicleType,
        vehicleNumber: vehicleNumber.trim(),
        currentStatus,
        ordersDelivered: 0,
        rating: 5.0,
        earningsToday: 0,
        verified: true,
      });
      toast.success(`New Delivery Rider "${name}" registered!`);
    }

    setIsDialogOpen(false);
  };

  const toggleRiderStatus = (dp: StoredDeliveryPartner) => {
    const nextStatus = dp.currentStatus === "ONLINE" ? "OFFLINE" : "ONLINE";
    store.updateDeliveryPartner(dp.id, { currentStatus: nextStatus });
    toast.success(`Rider ${dp.name} marked as: ${nextStatus}`);
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredDeliveryPartner>
        title="Delivery Fleet & Drivers Directory"
        description="Electric scooter riders, bike couriers, live online status, daily earnings and ratings."
        data={store.deliveryPartners}
        searchPlaceholder="Search rider name, phone, vehicle number..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.vehicleNumber.toLowerCase().includes(query) ||
          item.vehicleType.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "currentStatus",
            label: "Driver Status",
            options: [
              { label: "Online & Ready", value: "ONLINE" },
              { label: "On Active Delivery", value: "BUSY" },
              { label: "Offline", value: "OFFLINE" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Orders Delivered (High to Low)", value: "orders_desc" },
          { label: "Rating (High to Low)", value: "rating_desc" },
          { label: "Driver Name (A-Z)", value: "name_asc" },
        ]}
        defaultSort="orders_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "orders_desc") return list.sort((a, b) => b.ordersDelivered - a.ordersDelivered);
          if (sortVal === "rating_desc") return list.sort((a, b) => b.rating - a.rating);
          return list.sort((a, b) => a.name.localeCompare(b.name));
        }}
        onAddNew={openAddDialog}
        addNewLabel="Register Driver"
        pageSize={6}
        renderItem={(dp) => (
          <Card key={dp.id} className="rounded-3xl border-border bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-base text-foreground">{dp.name}</h3>
                    {dp.verified && <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {dp.vehicleType} • <span className="font-mono">{dp.vehicleNumber}</span>
                  </p>
                </div>
              </div>

              <Badge
                className={`text-[10px] uppercase font-bold ${
                  dp.currentStatus === "ONLINE"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : dp.currentStatus === "BUSY"
                    ? "bg-sky-500/10 text-sky-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {dp.currentStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs my-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                <span className="font-bold text-foreground">{dp.rating}</span>
                <span>({dp.ordersDelivered} delivered)</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{dp.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-muted/40 border border-border/60 text-xs">
              <span className="text-muted-foreground">Earnings Today:</span>
              <span className="font-display font-bold text-emerald-600 text-sm">₹{dp.earningsToday}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleRiderStatus(dp)}
                className="h-8 px-2.5 text-xs rounded-xl gap-1"
              >
                <Power className="w-3.5 h-3.5" />
                {dp.currentStatus === "ONLINE" ? "Mark Offline" : "Mark Online"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(dp)}
                className="h-8 px-2.5 text-xs rounded-xl"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        )}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingPartner ? "Edit Driver Details" : "Register Delivery Rider"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enter driver contact, vehicle registration number and initial status.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Driver Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Akash Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Phone Number *</Label>
                  <Input
                    required
                    placeholder="9876500112"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Vehicle Type</Label>
                  <Select value={vehicleType} onValueChange={(val: any) => setVehicleType(val)}>
                    <SelectTrigger className="rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electric Scooter">Electric Scooter</SelectItem>
                      <SelectItem value="2-Wheeler (Bike)">2-Wheeler (Bike)</SelectItem>
                      <SelectItem value="Auto / 3-Wheeler">Auto / 3-Wheeler</SelectItem>
                      <SelectItem value="Van / Mini-Truck">Van / Mini-Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Vehicle Registration Number</Label>
                <Input
                  required
                  placeholder="KA-01-EZ-4411"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="rounded-xl font-mono text-xs uppercase"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                {editingPartner ? "Save Changes" : "Register Driver"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

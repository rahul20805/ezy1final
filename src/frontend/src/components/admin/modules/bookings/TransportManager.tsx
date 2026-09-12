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
  Clock,
  Edit2,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type StoredTransportListing,
  useStoreData,
} from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";

export function TransportManager() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoredTransportListing | null>(
    null,
  );

  // Form State
  const [operatorName, setOperatorName] = useState("");
  const [vehicleType, setVehicleType] =
    useState<StoredTransportListing["vehicleType"]>("Auto");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [routeName, setRouteName] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [timings, setTimings] = useState("");
  const [fare, setFare] = useState<number>(50);
  const [totalSeats, setTotalSeats] = useState<number>(3);
  const [availableSeats, setAvailableSeats] = useState<number>(3);
  const [status, setStatus] =
    useState<StoredTransportListing["status"]>("Active");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingItem(null);
    setOperatorName("");
    setVehicleType("Auto");
    setVehicleNumber("KA-01-EA-1234");
    setRouteName("Indiranagar ⇄ MG Road Shuttle");
    setFromLocation("Indiranagar Metro");
    setToLocation("MG Road Station");
    setTimings("Every 10 mins");
    setFare(50);
    setTotalSeats(3);
    setAvailableSeats(3);
    setStatus("Active");
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: StoredTransportListing) => {
    setEditingItem(item);
    setOperatorName(item.operatorName);
    setVehicleType(item.vehicleType);
    setVehicleNumber(item.vehicleNumber);
    setRouteName(item.routeName);
    setFromLocation(item.fromLocation);
    setToLocation(item.toLocation);
    setTimings(item.timings);
    setFare(item.fare);
    setTotalSeats(item.totalSeats);
    setAvailableSeats(item.availableSeats);
    setStatus(item.status);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorName.trim() || !routeName.trim()) {
      toast.error("Operator Name and Route Name are required.");
      return;
    }

    if (editingItem) {
      store.updateTransportListing(editingItem.id, {
        operatorName: operatorName.trim(),
        vehicleType,
        vehicleNumber: vehicleNumber.trim(),
        routeName: routeName.trim(),
        fromLocation: fromLocation.trim(),
        toLocation: toLocation.trim(),
        timings: timings.trim(),
        fare: Number(fare),
        totalSeats: Number(totalSeats),
        availableSeats: Number(availableSeats),
        status,
      });
      toast.success(`Transport route "${routeName}" updated!`);
    } else {
      store.addTransportListing({
        operatorName: operatorName.trim(),
        vehicleType,
        vehicleNumber: vehicleNumber.trim(),
        routeName: routeName.trim(),
        fromLocation: fromLocation.trim(),
        toLocation: toLocation.trim(),
        timings: timings.trim(),
        fare: Number(fare),
        totalSeats: Number(totalSeats),
        availableSeats: Number(availableSeats),
        verified: true,
        status,
      });
      toast.success(`New Transport listing created!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteTransportListing(deleteConfirmId);
      toast.success("Transport listing deleted.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredTransportListing>
        title="Transport & Fleet Management"
        description="Electric autos, express buses, airport shuttles, and luxury on-demand cabs."
        data={store.transportListings}
        searchPlaceholder="Search operator, route name, vehicle type..."
        searchFilter={(item, query) =>
          item.operatorName.toLowerCase().includes(query) ||
          item.routeName.toLowerCase().includes(query) ||
          item.fromLocation.toLowerCase().includes(query) ||
          item.toLocation.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "vehicleType",
            label: "Vehicle Type",
            options: [
              { label: "Auto / 3-Wheeler", value: "Auto" },
              { label: "Bus / Airport Express", value: "Bus" },
              { label: "Cab / Taxi", value: "Cab" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Fare (Low to High)", value: "fare_asc" },
          { label: "Fare (High to Low)", value: "fare_desc" },
          { label: "Operator (A-Z)", value: "name_asc" },
        ]}
        defaultSort="fare_asc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "fare_asc")
            return list.sort((a, b) => a.fare - b.fare);
          if (sortVal === "fare_desc")
            return list.sort((a, b) => b.fare - a.fare);
          return list.sort((a, b) =>
            a.operatorName.localeCompare(b.operatorName),
          );
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add Vehicle / Route"
        pageSize={6}
        renderItem={(item) => (
          <Card
            key={item.id}
            className="rounded-3xl border-border bg-card p-5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm text-foreground">
                      {item.routeName}
                    </h3>
                    {item.verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.operatorName} •{" "}
                    <span className="font-mono">{item.vehicleNumber}</span>
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold"
              >
                {item.vehicleType}
              </Badge>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs my-3 space-y-1">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>
                  {item.fromLocation} ➔ {item.toLocation}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground pt-1">
                <span>Timings: {item.timings}</span>
                <span className="font-mono font-bold text-foreground">
                  {item.availableSeats} / {item.totalSeats} seats open
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="font-display font-black text-base text-foreground">
                ₹{item.fare}
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(item)}
                  className="h-8 px-2.5 text-xs rounded-xl"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="h-8 px-2.5 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
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
                {editingItem
                  ? "Edit Route Details"
                  : "Add Transport Vehicle / Route"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set route origin, destination, vehicle number, capacity and
                ticket fare.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Route / Shuttle Title *
                </Label>
                <Input
                  required
                  placeholder="e.g. Indiranagar ⇄ Koramangala Shuttle"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Operator Name</Label>
                  <Input
                    required
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Vehicle Number
                  </Label>
                  <Input
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="rounded-xl font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">From Location</Label>
                  <Input
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    To Destination
                  </Label>
                  <Input
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Ticket Fare (₹)
                  </Label>
                  <Input
                    type="number"
                    value={fare}
                    onChange={(e) => setFare(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Total Seats</Label>
                  <Input
                    type="number"
                    value={totalSeats}
                    onChange={(e) => {
                      setTotalSeats(Number(e.target.value));
                      setAvailableSeats(Number(e.target.value));
                    }}
                    className="rounded-xl"
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
                {editingItem ? "Save Changes" : "Create Route"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Transport Route?"
        description="Are you sure you want to remove this vehicle listing?"
      />
    </div>
  );
}

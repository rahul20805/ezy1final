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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Power,
  Star,
  Trash2,
  User,
  Wrench,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { ImageUploader } from "../../../owner/ImageUploader";
import { ServerDataTable } from "../../ServerDataTable";

interface ServiceRecord {
  id: number;
  name: string;
  description: string;
  category: string;
  price?: number;
  pricePerHour?: number;
  providerName?: string;
  vendorId?: number;
  isAvailable?: boolean;
  published?: boolean;
  rating?: number;
  duration?: string;
  image?: string;
}

export function ServicesManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [pricePerHour, setPricePerHour] = useState<number>(299);
  const [providerName, setProviderName] = useState("Suresh Sharma");
  const [isAvailable, setIsAvailable] = useState(true);
  const [published, setPublished] = useState(true);
  const [image, setImage] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingService(null);
    setName("");
    setDescription("");
    setCategory("Electrical");
    setPricePerHour(299);
    setProviderName("Suresh Sharma");
    setIsAvailable(true);
    setPublished(true);
    setImage("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (svc: ServiceRecord) => {
    setEditingService(svc);
    setName(svc.name);
    setDescription(svc.description || "");
    setCategory(svc.category || "Electrical");
    setPricePerHour(svc.price ?? svc.pricePerHour ?? 299);
    setProviderName(svc.providerName || "");
    setIsAvailable(svc.isAvailable !== false);
    setPublished(svc.published !== false);
    setImage(svc.image || "");
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Service Name is required.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      if (editingService) {
        const res = await fetch(`/api/services/${editingService.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            category,
            price: Number(pricePerHour),
            pricePerHour: Number(pricePerHour),
            providerName: providerName.trim(),
            isAvailable,
            published,
            image: image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
          }),
        });

        if (!res.ok) throw new Error("Failed to update service on server.");
        toast.success(`Service "${name}" updated!`);
      } else {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            category,
            price: Number(pricePerHour),
            pricePerHour: Number(pricePerHour),
            providerName: providerName.trim(),
            vendorId: 3,
            isAvailable,
            published,
            image: image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
          }),
        });

        if (!res.ok) throw new Error("Failed to create new service on server.");
        toast.success(`New on-demand service "${name}" registered!`);
      }

      setIsDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to save service.");
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      const res = await fetch(`/api/services/${deleteConfirmId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Could not delete service from database.");
      toast.success("Service removed successfully.");
      setDeleteConfirmId(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete service.");
    }
  };

  const toggleServiceAvailability = async (svc: ServiceRecord) => {
    const nextAvail = svc.isAvailable === false ? true : false;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      const res = await fetch(`/api/services/${svc.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isAvailable: nextAvail }),
      });

      if (!res.ok) throw new Error("Failed to update availability.");
      toast.success(`Service is now ${nextAvail ? "AVAILABLE" : "UNAVAILABLE"}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Could not toggle availability.");
    }
  };

  return (
    <div className="space-y-6">
      <ServerDataTable<ServiceRecord>
        title="On-Demand Local Services"
        description="Manage electricians, certified plumbers, cleaning specialists, technicians and home maintenance services."
        fetchUrl="/api/services"
        refreshTrigger={refreshTrigger}
        onAddNew={openAddDialog}
        addNewLabel="Add New Service"
        searchPlaceholder="Search service name, category, specialist..."
        filterOptions={[
          {
            key: "category",
            label: "Category",
            options: [
              { label: "Electrical", value: "Electrical" },
              { label: "Plumbing", value: "Plumbing" },
              { label: "Carpentry", value: "Carpentry" },
              { label: "Cleaning", value: "Cleaning" },
              { label: "Appliances", value: "Appliances" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Service Name (A-Z)", value: "name_asc", sortBy: "name", sortOrder: "asc" },
          { label: "Price (Low to High)", value: "price_asc", sortBy: "price", sortOrder: "asc" },
          { label: "Price (High to Low)", value: "price_desc", sortBy: "price", sortOrder: "desc" },
          { label: "Newest Added", value: "id_desc", sortBy: "id", sortOrder: "desc" },
        ]}
        defaultSort="id_asc"
        defaultPageSize={25}
        renderItem={(svc) => {
          const isAvail = svc.isAvailable !== false;
          const displayPrice = svc.price ?? svc.pricePerHour ?? 299;
          return (
            <Card
              key={svc.id}
              className={`rounded-3xl border transition-all hover:shadow-md flex flex-col justify-between ${
                isAvail ? "border-border/80 bg-card" : "border-muted bg-muted/20 opacity-75"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                          {svc.name}
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {svc.category}
                      </Badge>
                    </div>
                  </div>

                  <Badge
                    className={`text-[10px] font-bold ${
                      isAvail ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isAvail ? "Available" : "Offline"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {svc.description}
                </p>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Base Rate:</span>
                    <span className="font-display font-bold text-base text-primary">
                      ₹{displayPrice}
                    </span>
                    <span className="text-[10px] text-muted-foreground"> / visit</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block">Specialist:</span>
                    <span className="font-semibold text-foreground">
                      {svc.providerName || "Master Tech"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(svc)}
                      className="h-8 px-2 text-xs rounded-xl text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(svc.id)}
                      className="h-8 px-2 text-xs rounded-xl text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleServiceAvailability(svc)}
                    className={`h-8 px-2.5 text-xs rounded-xl font-semibold ${
                      isAvail ? "hover:text-destructive" : "text-emerald-600"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5 mr-1" />
                    {isAvail ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Edit / Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-bold">
                {editingService ? "Edit Service" : "Register On-Demand Service"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configured rates and availability will immediately update on customer apps.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Service Name *</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Full House Electrical Inspection"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Electrical"
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Price (₹)</Label>
                  <Input
                    type="number"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(Number(e.target.value))}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Specialist / Provider Name</Label>
                <Input
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Suresh Sharma"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed scope of service..."
                  className="rounded-xl text-xs"
                  rows={3}
                />
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
                {editingService ? "Update Service" : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Service"
        description="Are you sure you want to permanently remove this service listing?"
        confirmText="Delete"
        isDestructive={true}
        onConfirm={handleDelete}
      />
    </div>
  );
}

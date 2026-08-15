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
import { type StoredService, useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";
import { ImageUploader } from "../../../owner/ImageUploader";

export function ServicesManager() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<StoredService | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [pricePerHour, setPricePerHour] = useState<number>(299);
  const [providerName, setProviderName] = useState("Suresh Sharma");
  const [duration, setDuration] = useState("1-2 Hours");
  const [isAvailable, setIsAvailable] = useState(true);
  const [published, setPublished] = useState(true);
  const [image, setImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingService(null);
    setName("");
    setDescription("");
    setCategory("Electrical");
    setPricePerHour(299);
    setProviderName("Suresh Sharma");
    setDuration("1-2 Hours");
    setIsAvailable(true);
    setPublished(true);
    setImage("");
    setTagsInput("Wiring, Repair, Inspection");
    setIsDialogOpen(true);
  };

  const openEditDialog = (svc: StoredService) => {
    setEditingService(svc);
    setName(svc.name);
    setDescription(svc.description);
    setCategory(svc.category);
    setPricePerHour(svc.pricePerHour);
    setProviderName(svc.providerName);
    setDuration(svc.duration || "1-2 Hours");
    setIsAvailable(svc.isAvailable);
    setPublished(svc.published);
    setImage(svc.image || "");
    setTagsInput((svc.tags || []).join(", "));
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Service Name is required.");
      return;
    }

    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingService) {
      store.updateService(editingService.id, {
        name: name.trim(),
        description: description.trim(),
        category,
        pricePerHour: Number(pricePerHour),
        providerName: providerName.trim(),
        duration,
        isAvailable,
        published,
        image: image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
        tags,
      });
      toast.success(`Service "${name}" updated!`);
    } else {
      store.addService({
        name: name.trim(),
        description: description.trim(),
        category,
        pricePerHour: Number(pricePerHour),
        providerName: providerName.trim(),
        vendorId: 4,
        isAvailable,
        published,
        rating: 5.0,
        totalReviews: 0,
        duration,
        image: image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
        tags,
      });
      toast.success(`New on-demand service "${name}" registered!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteService(deleteConfirmId);
      toast.success("Service removed.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredService>
        title="On-Demand Local Services"
        description="Manage electricians, certified plumbers, cleaning specialists, technicians and home maintenance services."
        data={store.services}
        searchPlaceholder="Search service name, category, specialist..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.providerName.toLowerCase().includes(query) ||
          (item.tags || []).some((t) => t.toLowerCase().includes(query))
        }
        filterOptions={[
          {
            key: "category",
            label: "Trade Category",
            options: [
              { label: "Electrical", value: "Electrical" },
              { label: "Plumbing", value: "Plumbing" },
              { label: "Cleaning", value: "Cleaning" },
              { label: "Carpentry", value: "Carpentry" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Rate (High to Low)", value: "rate_desc" },
          { label: "Rate (Low to High)", value: "rate_asc" },
          { label: "Name (A-Z)", value: "name_asc" },
        ]}
        defaultSort="name_asc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "rate_desc") return list.sort((a, b) => b.pricePerHour - a.pricePerHour);
          if (sortVal === "rate_asc") return list.sort((a, b) => a.pricePerHour - b.pricePerHour);
          return list.sort((a, b) => a.name.localeCompare(b.name));
        }}
        onAddNew={openAddDialog}
        addNewLabel="Register Service"
        pageSize={6}
        renderItem={(svc) => (
          <Card
            key={svc.id}
            className={`rounded-3xl border transition-all hover:shadow-md ${
              svc.published ? "border-border/80 bg-card" : "border-border/50 bg-muted/20 opacity-70"
            }`}
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={svc.image || "https://placehold.co/100x100?text=Service"}
                    alt={svc.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-border/80 flex-shrink-0 shadow-xs"
                  />
                  <div>
                    <h3 className="font-display font-bold text-sm text-foreground line-clamp-1">
                      {svc.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Specialist: <span className="font-medium text-foreground">{svc.providerName}</span>
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px] uppercase font-bold">
                  {svc.category}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">{svc.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(svc.tags || []).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5 rounded-lg">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div>
                  <span className="font-display font-black text-base text-foreground">₹{svc.pricePerHour}</span>
                  <span className="text-[10px] text-muted-foreground"> / hour</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      store.toggleServicePublish(svc.id);
                      toast.success(svc.published ? `"${svc.name}" hidden.` : `"${svc.name}" published live!`);
                    }}
                    className="h-8 px-2 text-xs rounded-xl"
                  >
                    {svc.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-emerald-500" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(svc)}
                    className="h-8 px-2 text-xs rounded-xl"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirmId(svc.id)}
                    className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl bg-card border-border shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingService ? "Edit Service" : "Register On-Demand Service"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set trade category, hourly rate, specialist assignment, and tags.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Service Name *</Label>
                <Input
                  required
                  placeholder="e.g. Complete Home Electrical Repair & Inspection"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Rate Per Hour (₹) *</Label>
                  <Input
                    type="number"
                    required
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Specialist Provider</Label>
                  <Input
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Description</Label>
                <Textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown of work included..."
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Search Tags (Comma-separated)</Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Wiring, Leakage, Deep Clean, Painting"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Service Cover Photo</Label>
                <ImageUploader currentImage={image} onImageChange={setImage} label="Service Photo" />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                {editingService ? "Save Changes" : "Register Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Service?"
        description="Are you sure you want to remove this service? Existing active requests will not be cancelled."
      />
    </div>
  );
}

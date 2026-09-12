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
  Clock,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Star,
  Tag,
  Trash2,
  User,
  Wrench,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { type StoredService, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { DataTable } from "../DataTable";
import { ImageUploader } from "../ImageUploader";

export function ServicesSection() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<StoredService | null>(
    null,
  );

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [pricePerHour, setPricePerHour] = useState<number>(299);
  const [providerName, setProviderName] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [published, setPublished] = useState(true);
  const [duration, setDuration] = useState("1 Hour");
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
    setIsAvailable(true);
    setPublished(true);
    setDuration("1-2 Hours");
    setImage(
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
    );
    setTagsInput("Wiring, Repair, Emergency");
    setIsDialogOpen(true);
  };

  const openEditDialog = (svc: StoredService) => {
    setEditingService(svc);
    setName(svc.name);
    setDescription(svc.description);
    setCategory(svc.category);
    setPricePerHour(svc.pricePerHour);
    setProviderName(svc.providerName);
    setIsAvailable(svc.isAvailable);
    setPublished(svc.published);
    setDuration(svc.duration || "1 Hour");
    setImage(svc.image || "");
    setTagsInput(svc.tags?.join(", ") || "");
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Service name is required.");
      return;
    }

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingService) {
      store.updateService(editingService.id, {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        pricePerHour: Number(pricePerHour),
        providerName: providerName.trim(),
        isAvailable,
        published,
        duration: duration.trim(),
        image,
        tags: tagsArray,
      });
      toast.success(`Service "${name}" updated!`);
    } else {
      store.addService({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        pricePerHour: Number(pricePerHour),
        providerName: providerName.trim(),
        vendorId: 4,
        isAvailable,
        published,
        rating: 4.8,
        totalReviews: 1,
        duration: duration.trim(),
        image: image || "https://placehold.co/600x400?text=Service",
        tags: tagsArray,
      });
      toast.success(`New service "${name}" added!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteService(deleteConfirmId);
      toast.success("Service deleted.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredService>
        title="Local & Home Services"
        description="Manage on-demand home repair, plumbing, electrical, cleaning and specialist services."
        data={store.services}
        searchPlaceholder="Search by service name, category, specialist..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.providerName.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.tags?.some((t) => t.toLowerCase().includes(query)) ?? false)
        }
        filterOptions={[
          {
            key: "category",
            label: "Category",
            options: [
              { label: "Electrical", value: "Electrical" },
              { label: "Plumbing", value: "Plumbing" },
              { label: "Cleaning", value: "Cleaning" },
              { label: "Carpentry", value: "Carpentry" },
              { label: "Appliances", value: "Appliances" },
            ],
          },
          {
            key: "isAvailable",
            label: "Availability",
            options: [
              { label: "Available Now", value: "true" },
              { label: "Unavailable", value: "false" },
            ],
          },
          {
            key: "published",
            label: "Visibility",
            options: [
              { label: "Published (Live)", value: "true" },
              { label: "Draft / Hidden", value: "false" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Price: Low to High", value: "price_asc" },
          { label: "Price: High to Low", value: "price_desc" },
          { label: "Highest Rated", value: "rating_desc" },
        ]}
        defaultSort="newest"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "price_asc")
            return list.sort((a, b) => a.pricePerHour - b.pricePerHour);
          if (sortVal === "price_desc")
            return list.sort((a, b) => b.pricePerHour - a.pricePerHour);
          if (sortVal === "rating_desc")
            return list.sort((a, b) => b.rating - a.rating);
          return list.sort((a, b) => b.id - a.id);
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add Service"
        pageSize={6}
        renderItem={(svc) => (
          <Card
            key={svc.id}
            className={`rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-md ${
              svc.published
                ? "border-border/80 bg-card"
                : "border-border/50 bg-muted/20 opacity-80"
            }`}
          >
            <div className="relative aspect-video bg-muted/60 overflow-hidden group">
              <img
                src={svc.image || "https://placehold.co/600x400?text=Service"}
                alt={svc.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400?text=Service";
                }}
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                <Badge className="bg-primary text-primary-foreground font-semibold text-[10px]">
                  {svc.category}
                </Badge>
              </div>

              <div className="absolute top-2.5 right-2.5">
                <Badge
                  className={`text-[10px] font-bold ${
                    svc.isAvailable
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {svc.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-display font-bold text-sm text-foreground line-clamp-1 leading-snug">
                  {svc.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {svc.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{svc.providerName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-foreground">
                    {svc.rating}
                  </span>
                  <span>({svc.totalReviews})</span>
                </div>
              </div>

              {/* Tags */}
              {svc.tags && svc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {svc.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 font-normal"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Price & Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div>
                  <span className="font-display font-black text-lg text-foreground">
                    ₹{svc.pricePerHour}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    / hour
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      store.toggleServicePublish(svc.id);
                      toast.success(
                        svc.published
                          ? `"${svc.name}" hidden from public website.`
                          : `"${svc.name}" published live!`,
                      );
                    }}
                    className="h-8 px-2 text-xs rounded-xl"
                  >
                    {svc.published ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    )}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl custom-scrollbar rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingService
                  ? "Edit Service Offering"
                  : "Add New Local Service"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set rates, specialist assignment, availability and description.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Service Name *</Label>
                <Input
                  required
                  placeholder="e.g., Complete Home Electrical Repair & Inspection"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Input
                    placeholder="Electrical, Plumbing..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Rate (₹ / hr) *
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(Number(e.target.value))}
                    className="rounded-xl font-display font-bold text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Estimated Duration
                  </Label>
                  <Input
                    placeholder="e.g., 1-2 Hours, 45 Mins"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Assigned Specialist / Provider *
                  </Label>
                  <Input
                    required
                    placeholder="e.g., Suresh Sharma / Master Plumbers"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Tags (comma separated)
                  </Label>
                  <Input
                    placeholder="Wiring, Fan Fix, Leakage, Drainage"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Service Description & Scope
                </Label>
                <Textarea
                  rows={3}
                  placeholder="Outline what is included, spare parts policy, inspection process..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl text-xs sm:text-sm"
                />
              </div>

              <ImageUploader
                label="Service Image"
                value={image}
                onChange={setImage}
                previewHeight="h-40"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-muted/40 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold">
                      Instant Availability
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Ready to take on jobs
                    </p>
                  </div>
                  <Switch
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold">
                      Publish Live
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Visible on public directory
                    </p>
                  </div>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2 border-t border-border">
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
                {editingService ? "Save Changes" : "Create Service"}
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
        description="Are you sure you want to delete this service offering?"
      />
    </div>
  );
}

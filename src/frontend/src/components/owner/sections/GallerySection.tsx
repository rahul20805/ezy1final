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
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { type StoredGalleryItem, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { DataTable } from "../DataTable";
import { ImageUploader } from "../ImageUploader";

export function GallerySection() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StoredGalleryItem | null>(
    null,
  );

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Art & Studio");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [published, setPublished] = useState(true);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setTitle("");
    setCategory("Art & Studio");
    setImageUrl(
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80",
    );
    setCaption("");
    setTagsInput("Pottery, Handcrafted");
    setPublished(true);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      toast.error("Please provide an image title and upload an image.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    store.addGalleryItem({
      title: title.trim(),
      category: category.trim(),
      imageUrl: imageUrl.trim(),
      caption: caption.trim(),
      tags,
      published,
    });

    toast.success("New media item added to showcase gallery!");
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteGalleryItem(deleteConfirmId);
      toast.success("Gallery item deleted.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredGalleryItem>
        title="Showcase Media & Gallery"
        description="Upload portfolio photos, store banners, workshop moments, and artisan product highlights."
        data={store.gallery}
        searchPlaceholder="Search by title, tag, category..."
        searchFilter={(item, query) =>
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.caption?.toLowerCase().includes(query) ?? false) ||
          item.tags.some((t) => t.toLowerCase().includes(query))
        }
        filterOptions={[
          {
            key: "category",
            label: "Category",
            options: [
              { label: "Art & Studio", value: "Art & Studio" },
              { label: "Storefront", value: "Storefront" },
              { label: "Delivery Fleet", value: "Delivery Fleet" },
              { label: "Workshops", value: "Workshops" },
            ],
          },
        ]}
        onAddNew={openAddDialog}
        addNewLabel="Upload Image"
        pageSize={8}
        renderItem={(item) => (
          <Card
            key={item.id}
            className={`rounded-2xl overflow-hidden border transition-all hover:shadow-md ${
              item.published
                ? "border-border/80 bg-card"
                : "border-border/50 bg-muted/20 opacity-70"
            }`}
          >
            <div
              className="relative aspect-video bg-muted/60 overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400?text=Gallery";
                }}
              />
              <div className="absolute top-2.5 left-2.5">
                <Badge className="bg-card/90 backdrop-blur-xs text-foreground text-[10px] border-border">
                  {item.category}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-2.5">
              <div>
                <h3 className="font-display font-bold text-sm text-foreground line-clamp-1 leading-snug">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {item.caption}
                  </p>
                )}
              </div>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-muted-foreground font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-[11px] text-muted-foreground">
                  {item.uploadedAt}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      store.toggleGalleryPublish(item.id);
                      toast.success(
                        item.published
                          ? "Image hidden from live gallery."
                          : "Image published live!",
                      );
                    }}
                    className="h-8 px-2 text-xs rounded-xl"
                  >
                    {item.published ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirmId(item.id)}
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

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                Upload Showcase Photo
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Add high-resolution photos to your public store gallery.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Image Title *</Label>
                <Input
                  required
                  placeholder="e.g. Hand-carved Ceramic Vase"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Input
                    placeholder="Art & Studio, Storefront..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Tags (comma separated)
                  </Label>
                  <Input
                    placeholder="Pottery, Decor, Handmade"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <ImageUploader
                label="Upload Photo *"
                value={imageUrl}
                onChange={setImageUrl}
                previewHeight="h-44"
              />

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Caption / Story</Label>
                <Textarea
                  rows={2}
                  placeholder="Short description of this moment or piece..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                <div>
                  <Label className="text-xs font-semibold">Publish Live</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Visible on public gallery
                  </p>
                </div>
                <Switch checked={published} onCheckedChange={setPublished} />
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
                Upload & Publish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lightbox / Preview Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-2xl bg-card border-border shadow-2xl rounded-3xl p-0 overflow-hidden">
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base">
                  {selectedImage.title}
                </h3>
                <Badge variant="outline">{selectedImage.category}</Badge>
              </div>
              {selectedImage.caption && (
                <p className="text-xs text-muted-foreground">
                  {selectedImage.caption}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Image?"
        description="Are you sure you want to permanently delete this media item?"
      />
    </div>
  );
}

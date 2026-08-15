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
import {
  Calendar,
  Edit2,
  ExternalLink,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredHeroSlide, useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";
import { ImageUploader } from "../../../owner/ImageUploader";

export function BannersManager() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<StoredHeroSlide | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [buttonText, setButtonText] = useState("Shop Now");
  const [buttonLink, setButtonLink] = useState("/shop");
  const [published, setPublished] = useState(true);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingBanner(null);
    setTitle("");
    setSubtitle("");
    setBadge("⚡ Special Deal");
    setImageUrl("");
    setButtonText("Shop Now");
    setButtonLink("/shop");
    setPublished(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (banner: StoredHeroSlide) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setBadge(banner.badge || "");
    setImageUrl(banner.imageUrl);
    setButtonText(banner.buttonText);
    setButtonLink(banner.buttonLink);
    setPublished(banner.published);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Banner title is required.");
      return;
    }

    if (editingBanner) {
      store.updateHeroSlide(editingBanner.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        badge: badge.trim(),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
        buttonText: buttonText.trim() || "Explore",
        buttonLink: buttonLink.trim() || "/shop",
        published,
      });
      toast.success(`Banner "${title}" updated!`);
    } else {
      store.addHeroSlide({
        title: title.trim(),
        subtitle: subtitle.trim(),
        badge: badge.trim(),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
        buttonText: buttonText.trim() || "Explore",
        buttonLink: buttonLink.trim() || "/shop",
        published,
      });
      toast.success(`New Hero Banner created and live!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteHeroSlide(deleteConfirmId);
      toast.success("Banner deleted.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredHeroSlide>
        title="Promotional Banners & Hero Showcase"
        description="Homepage animated slider slides, headline copy, CTA destinations, and seasonal artwork."
        data={store.heroSlides}
        searchPlaceholder="Search banner title, subtitle..."
        searchFilter={(item, query) =>
          item.title.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query)
        }
        filterOptions={[]}
        sortOptions={[{ label: "Banner Title (A-Z)", value: "title_asc" }]}
        defaultSort="title_asc"
        onSort={(items) => [...items].sort((a, b) => a.title.localeCompare(b.title))}
        onAddNew={openAddDialog}
        addNewLabel="Add Banner"
        pageSize={6}
        renderItem={(banner) => (
          <Card key={banner.id} className="rounded-3xl border-border bg-card overflow-hidden shadow-xs">
            <div className="aspect-[21/9] bg-muted/30 relative overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                {banner.badge && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] w-fit mb-1 border-0 font-bold">
                    {banner.badge}
                  </Badge>
                )}
                <h3 className="font-display font-black text-base line-clamp-1">{banner.title}</h3>
                <p className="text-xs text-white/80 line-clamp-1">{banner.subtitle}</p>
              </div>
            </div>

            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">CTA:</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {banner.buttonText} ➔ {banner.buttonLink}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(banner)}
                  className="h-8 px-2.5 text-xs rounded-xl"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmId(banner.id)}
                  className="h-8 px-2.5 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
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
                {editingBanner ? "Edit Promotional Banner" : "Add Hero Banner Slide"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set headline title, subtitle, CTA text, destination URL, and high-res graphic.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs font-semibold">Banner Heading *</Label>
                  <Input
                    required
                    placeholder="Everything You Need, Delivered in Minutes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <Label className="text-xs font-semibold">Badge Tag</Label>
                  <Input
                    placeholder="⚡ 10-Min Delivery"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Subtitle Description</Label>
                <Input
                  placeholder="Fresh groceries, pharmacy, doctors and artisan workshops..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">CTA Button Text</Label>
                  <Input
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">CTA Link Destination</Label>
                  <Input
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    className="rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Banner Graphic</Label>
                <ImageUploader currentImage={imageUrl} onImageChange={setImageUrl} label="Slide Image" />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                {editingBanner ? "Save Changes" : "Create Slide"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Banner Slide?"
        description="Are you sure you want to remove this hero slide from the homepage rotation?"
      />
    </div>
  );
}

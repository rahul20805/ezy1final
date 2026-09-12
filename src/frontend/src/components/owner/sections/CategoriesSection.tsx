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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Eye, EyeOff, FolderTree, Plus, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { type StoredCategory, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { DataTable } from "../DataTable";

export function CategoriesSection() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<StoredCategory | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("📦");
  const [type, setType] = useState<StoredCategory["type"]>("product");
  const [published, setPublished] = useState(true);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingCat(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("🛒");
    setType("product");
    setPublished(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (cat: StoredCategory) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setType(cat.type);
    setPublished(cat.published);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    const autoSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    if (editingCat) {
      store.updateCategory(editingCat.id, {
        name: name.trim(),
        slug: autoSlug,
        description: description.trim(),
        image: image.trim() || "📦",
        type,
        published,
      });
      toast.success(`Category "${name}" updated!`);
    } else {
      store.addCategory({
        name: name.trim(),
        slug: autoSlug,
        description: description.trim(),
        image: image.trim() || "📦",
        type,
        published,
        orderIndex: store.categories.length + 1,
      });
      toast.success(`New Category "${name}" created!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteCategory(deleteConfirmId);
      toast.success("Category deleted.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredCategory>
        title="Department & Product Categories"
        description="Organize catalog taxonomy for grocery items, home services, healthcare, workshops and rides."
        data={store.categories}
        searchPlaceholder="Search category name, slug, description..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "type",
            label: "Scope Type",
            options: [
              { label: "Products / Goods", value: "product" },
              { label: "Services", value: "service" },
              { label: "Bookings & Classes", value: "booking" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Order Index", value: "order" },
          { label: "Name A-Z", value: "name_asc" },
        ]}
        defaultSort="order"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "name_asc")
            return list.sort((a, b) => a.name.localeCompare(b.name));
          return list.sort((a, b) => a.orderIndex - b.orderIndex);
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add Category"
        pageSize={8}
        renderItem={(cat) => {
          const productCount = store.products.filter(
            (p) =>
              p.category.toLowerCase() === cat.name.toLowerCase() ||
              p.categoryIds.includes(cat.id),
          ).length;

          return (
            <Card
              key={cat.id}
              className={`rounded-2xl border transition-all hover:shadow-md ${
                cat.published
                  ? "border-border/80 bg-card"
                  : "border-border/50 bg-muted/20 opacity-70"
              }`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                      {cat.image}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-foreground line-clamp-1">
                        {cat.name}
                      </h3>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        /{cat.slug}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold"
                  >
                    {cat.type}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                  {cat.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-semibold"
                  >
                    {productCount} item(s) listed
                  </Badge>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        store.toggleCategoryPublish(cat.id);
                        toast.success(
                          cat.published
                            ? `Category "${cat.name}" hidden.`
                            : `Category "${cat.name}" published!`,
                        );
                      }}
                      className="h-8 px-2 text-xs rounded-xl"
                    >
                      {cat.published ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(cat)}
                      className="h-8 px-2 text-xs rounded-xl"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Add / Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingCat ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Define the department name, emoji icon, slug and description.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1 col-span-1">
                  <Label className="text-xs font-semibold">Icon / Emoji</Label>
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="rounded-xl text-center text-lg"
                    placeholder="🍎"
                  />
                </div>
                <div className="space-y-1 col-span-3">
                  <Label className="text-xs font-semibold">
                    Category Name *
                  </Label>
                  <Input
                    required
                    placeholder="e.g. Fresh Produce & Fruits"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingCat) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, ""),
                        );
                      }
                    }}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">URL Slug</Label>
                  <Input
                    placeholder="fresh-produce"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="rounded-xl font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Scope</Label>
                  <Select
                    value={type}
                    onValueChange={(val: any) => setType(val)}
                  >
                    <SelectTrigger className="rounded-xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Products / Shop</SelectItem>
                      <SelectItem value="service">Services</SelectItem>
                      <SelectItem value="booking">
                        Classes & Bookings
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Description</Label>
                <Textarea
                  rows={2}
                  placeholder="Short tagline explaining what is in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                <Label className="text-xs font-semibold">Publish Live</Label>
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
                {editingCat ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        description="Are you sure you want to delete this category? Products assigned to it will remain in database."
      />
    </div>
  );
}

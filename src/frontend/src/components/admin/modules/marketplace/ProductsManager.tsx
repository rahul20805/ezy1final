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
import {
  CheckSquare,
  Edit2,
  Eye,
  EyeOff,
  Layers,
  Package,
  Plus,
  Power,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { type StoredProduct, useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";
import { ImageUploader } from "../../../owner/ImageUploader";

export function ProductsManager() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoredProduct | null>(
    null,
  );

  // Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [category, setCategory] = useState("Atta, Rice & Dal");
  const [subcategory, setSubcategory] = useState("Flour & Grains");
  const [vendorId, setVendorId] = useState(1);
  const [stockCount, setStockCount] = useState<number>(50);
  const [minOrderQty, setMinOrderQty] = useState<number>(1);
  const [maxOrderQty, setMaxOrderQty] = useState<number>(10);
  const [taxPercent, setTaxPercent] = useState<number>(5);
  const [inStock, setInStock] = useState(true);
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [unit, setUnit] = useState("1 kg");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const openAddDialog = () => {
    setEditingProduct(null);
    setName("");
    setSku(`PROD-${Math.floor(1000 + Math.random() * 9000)}`);
    setDescription("");
    setPrice(100);
    setMrp(120);
    setCategory(store.categories[0]?.name || "Atta, Rice & Dal");
    setSubcategory("Staples");
    setVendorId(store.shops[0]?.id || 1);
    setStockCount(50);
    setMinOrderQty(1);
    setMaxOrderQty(10);
    setTaxPercent(5);
    setInStock(true);
    setPublished(true);
    setFeatured(false);
    setUnit("1 pack");
    setImageUrl("");
    setTagsInput("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: StoredProduct) => {
    setEditingProduct(product);
    setName(product.name);
    setSku(product.sku);
    setDescription(product.description);
    setPrice(product.price);
    setMrp(product.mrp);
    setCategory(product.category);
    setSubcategory(product.subcategory || "");
    setVendorId(product.vendorId);
    setStockCount(product.stockCount);
    setMinOrderQty(product.minOrderQty || 1);
    setMaxOrderQty(product.maxOrderQty || 10);
    setTaxPercent(product.taxPercent || 5);
    setInStock(product.inStock);
    setPublished(product.published);
    setFeatured(product.featured || false);
    setUnit(product.unit || "1 unit");
    setImageUrl(product.images[0] || "");
    setTagsInput((product.tags || []).join(", "));
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const vendorObj = store.shops.find((s) => s.id === vendorId);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProduct) {
      store.updateProduct(editingProduct.id, {
        name: name.trim(),
        sku: sku.trim(),
        description: description.trim(),
        price: Number(price),
        mrp: Number(mrp),
        discountPercent: discount,
        category,
        subcategory,
        vendorId,
        vendorName: vendorObj?.businessName || "EZY1 Partner",
        stockCount: Number(stockCount),
        minOrderQty: Number(minOrderQty),
        maxOrderQty: Number(maxOrderQty),
        taxPercent: Number(taxPercent),
        inStock: stockCount > 0 && inStock,
        published,
        featured,
        unit,
        images: imageUrl ? [imageUrl] : editingProduct.images,
        tags,
      });
      toast.success(`Product "${name}" updated successfully!`);
    } else {
      store.addProduct({
        name: name.trim(),
        sku: sku.trim(),
        description: description.trim(),
        price: Number(price),
        mrp: Number(mrp),
        discountPercent: discount,
        category,
        subcategory,
        categoryIds: [1],
        vendorId,
        vendorName: vendorObj?.businessName || "EZY1 Partner",
        stockCount: Number(stockCount),
        minOrderQty: Number(minOrderQty),
        maxOrderQty: Number(maxOrderQty),
        taxPercent: Number(taxPercent),
        inStock: stockCount > 0 && inStock,
        isAvailable: true,
        published,
        featured,
        unit,
        rating: 5.0,
        totalReviews: 0,
        images: [
          imageUrl ||
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
        ],
        tags,
      });
      toast.success(`Product "${name}" added to marketplace!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteProduct(deleteConfirmId);
      toast.success("Product deleted.");
      setDeleteConfirmId(null);
    }
  };

  const handleBulkPublish = (publish: boolean) => {
    if (selectedIds.length === 0) {
      toast.error("Please select products first.");
      return;
    }
    store.bulkUpdateProducts(selectedIds, { published: publish });
    toast.success(
      `${selectedIds.length} products ${publish ? "published" : "hidden"}.`,
    );
    setSelectedIds([]);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-6">
      {/* Bulk Action Header Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <span className="font-bold text-primary">
            {selectedIds.length} product(s) selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleBulkPublish(true)}
              className="h-7 text-xs rounded-xl"
            >
              Publish Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkPublish(false)}
              className="h-7 text-xs rounded-xl"
            >
              Hide Selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="h-7 text-xs rounded-xl"
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      <DataTable<StoredProduct>
        title="Universal Product Catalog"
        description="Manage stock inventory, pricing, MRP discounts, SKU identifiers, tags, and publish status."
        data={store.products}
        searchPlaceholder="Search product name, SKU, category, tag..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.tags || []).some((t) => t.toLowerCase().includes(query))
        }
        filterOptions={[
          {
            key: "category",
            label: "Department",
            options: store.categories.map((c) => ({
              label: c.name,
              value: c.name,
            })),
          },
        ]}
        sortOptions={[
          { label: "Price (High to Low)", value: "price_desc" },
          { label: "Price (Low to High)", value: "price_asc" },
          { label: "Stock (Low to High)", value: "stock_asc" },
          { label: "Name (A-Z)", value: "name_asc" },
        ]}
        defaultSort="name_asc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "price_desc")
            return list.sort((a, b) => b.price - a.price);
          if (sortVal === "price_asc")
            return list.sort((a, b) => a.price - b.price);
          if (sortVal === "stock_asc")
            return list.sort((a, b) => a.stockCount - b.stockCount);
          return list.sort((a, b) => a.name.localeCompare(b.name));
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add Product"
        pageSize={8}
        renderItem={(product) => {
          const isSelected = selectedIds.includes(product.id);

          return (
            <Card
              key={product.id}
              className={`rounded-3xl border transition-all hover:shadow-md ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : product.published
                    ? "border-border/80 bg-card"
                    : "border-border/50 bg-muted/20 opacity-70"
              }`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded-md border-border text-primary cursor-pointer w-4 h-4"
                    />
                    <img
                      src={
                        product.images[0] ||
                        "https://placehold.co/100x100?text=Item"
                      }
                      alt={product.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-border/80 flex-shrink-0 shadow-xs"
                    />
                    <div>
                      <h3 className="font-display font-bold text-sm text-foreground line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {product.sku}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          • {product.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="font-display font-black text-sm text-foreground">
                        ₹{product.price}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          ₹{product.mrp}
                        </span>
                      )}
                    </div>
                    {product.discountPercent ? (
                      <Badge
                        variant="secondary"
                        className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10"
                      >
                        {product.discountPercent}% OFF
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <Badge variant="outline" className="text-[10px] font-medium">
                    {product.category}
                  </Badge>

                  <span
                    className={`text-[11px] font-bold ${
                      product.stockCount === 0
                        ? "text-destructive"
                        : product.stockCount < 10
                          ? "text-amber-500"
                          : "text-emerald-600"
                    }`}
                  >
                    {product.stockCount === 0
                      ? "Out of Stock"
                      : `${product.stockCount} in stock`}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        store.toggleProductPublish(product.id);
                        toast.success(
                          product.published
                            ? `"${product.name}" hidden from shop.`
                            : `"${product.name}" published live!`,
                        );
                      }}
                      className="h-8 px-2 text-xs rounded-xl"
                    >
                      {product.published ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                      className="h-8 px-2 text-xs rounded-xl"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirmId(product.id)}
                    className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Add / Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl bg-card border-border shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingProduct
                  ? "Edit Marketplace Product"
                  : "Add New Marketplace Product"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set product name, SKU, category, pricing, stock levels and
                upload high-res image.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Product Name *
                  </Label>
                  <Input
                    required
                    placeholder="e.g. Aashirvaad Shudh Chakki Atta (5kg)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    SKU Identifier
                  </Label>
                  <Input
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Selling Price (₹) *
                  </Label>
                  <Input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">MRP (₹) *</Label>
                  <Input
                    type="number"
                    required
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Stock Quantity *
                  </Label>
                  <Input
                    type="number"
                    required
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Department</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {store.categories.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.name}
                          className="text-xs"
                        >
                          {c.image} {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Pack Unit</Label>
                  <Input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 500g, 1L, Pack of 6"
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Tax GST %</Label>
                  <Input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
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
                  placeholder="Key features, ingredients, or usage guidelines..."
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Search Tags (Comma-separated)
                </Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="organic, staple, fresh, breakfast"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Product Image</Label>
                <ImageUploader
                  currentImage={imageUrl}
                  onImageChange={setImageUrl}
                  label="Product Photo"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                  <Label className="text-xs font-semibold">Publish Live</Label>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                  <Label className="text-xs font-semibold">
                    Feature on Home
                  </Label>
                  <Switch checked={featured} onCheckedChange={setFeatured} />
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
                {editingProduct ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        description="Are you sure you want to remove this product from the marketplace?"
      />
    </div>
  );
}

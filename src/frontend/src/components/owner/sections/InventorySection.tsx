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
  Check,
  Edit2,
  Eye,
  EyeOff,
  Package,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { usePartnerAuth } from "../../../lib/partnerAuthStore";
import { type StoredProduct, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { DataTable } from "../DataTable";
import { ImageUploader } from "../ImageUploader";

export function InventorySection() {
  const store = useStoreData();
  const { currentPartner } = usePartnerAuth();

  // Partner Scope Filter
  const partnerProducts =
    currentPartner?.role === "super_owner"
      ? store.products
      : store.products.filter((p) => p.vendorId === currentPartner?.vendorId);

  // Dialog State for Add/Edit
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoredProduct | null>(
    null,
  );

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [stockCount, setStockCount] = useState<number>(50);
  const [inStock, setInStock] = useState(true);
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [unit, setUnit] = useState("1 unit");
  const [sku, setSku] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice(100);
    setMrp(120);
    setCategory(store.categories[0]?.name || "Groceries");
    setStockCount(50);
    setInStock(true);
    setPublished(true);
    setFeatured(false);
    setUnit("1 unit");
    setSku(`SKU-${Date.now().toString().slice(-4)}`);
    setImageUrl(
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
    );
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: StoredProduct) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setMrp(product.mrp);
    setCategory(product.category);
    setStockCount(product.stockCount);
    setInStock(product.inStock);
    setPublished(product.published);
    setFeatured(product.featured || false);
    setUnit(product.unit || "1 unit");
    setSku(product.sku || "");
    setImageUrl(product.images[0] || "");
    setIsDialogOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (price <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    const categoryObj = store.categories.find((c) => c.name === category);
    const categoryIds = categoryObj ? [categoryObj.id] : [1];

    if (editingProduct) {
      store.updateProduct(editingProduct.id, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        mrp: Number(mrp) || Number(price),
        category,
        categoryIds,
        stockCount: Number(stockCount),
        inStock: Number(stockCount) > 0 ? inStock : false,
        published,
        featured,
        unit,
        sku,
        images: imageUrl ? [imageUrl] : editingProduct.images,
        discountPercent:
          mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0,
      });
      toast.success(`Product "${name}" updated successfully!`);
    } else {
      store.addProduct({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        mrp: Number(mrp) || Number(price),
        category,
        categoryIds,
        vendorId: currentPartner?.vendorId || 1,
        stockCount: Number(stockCount),
        inStock: Number(stockCount) > 0 ? inStock : false,
        isAvailable: true,
        published,
        featured,
        rating: 5.0,
        totalReviews: 1,
        unit,
        sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
        images: imageUrl
          ? [imageUrl]
          : ["https://placehold.co/500x500?text=Product"],
        discountPercent:
          mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0,
      });
      toast.success(`New product "${name}" added to catalog!`);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteProduct = () => {
    if (deleteConfirmId !== null) {
      store.deleteProduct(deleteConfirmId);
      toast.success("Product permanently deleted from catalog.");
      setDeleteConfirmId(null);
    }
  };

  const uniqueCategories = Array.from(
    new Set(store.categories.map((c) => c.name)),
  );

  return (
    <div className="space-y-6">
      <DataTable<StoredProduct>
        title="Inventory & Shop Products"
        description="Add, edit, manage stock, publish or hide items from the live customer storefront."
        data={partnerProducts}
        searchPlaceholder="Search by product name, SKU, category..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.sku?.toLowerCase().includes(query) ?? false) ||
          item.description.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "category",
            label: "Category",
            options: uniqueCategories.map((c) => ({ label: c, value: c })),
          },
          {
            key: "inStock",
            label: "Stock Status",
            options: [
              { label: "In Stock", value: "true" },
              { label: "Out of Stock", value: "false" },
            ],
          },
          {
            key: "published",
            label: "Visibility",
            options: [
              { label: "Published (Live)", value: "true" },
              { label: "Draft (Hidden)", value: "false" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Price: Low to High", value: "price_asc" },
          { label: "Price: High to Low", value: "price_desc" },
          { label: "Name: A to Z", value: "name_asc" },
          { label: "Stock: High to Low", value: "stock_desc" },
        ]}
        defaultSort="newest"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "price_asc")
            return list.sort((a, b) => a.price - b.price);
          if (sortVal === "price_desc")
            return list.sort((a, b) => b.price - a.price);
          if (sortVal === "name_asc")
            return list.sort((a, b) => a.name.localeCompare(b.name));
          if (sortVal === "stock_desc")
            return list.sort((a, b) => b.stockCount - a.stockCount);
          return list.sort((a, b) => b.id - a.id);
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add Product"
        pageSize={8}
        renderItem={(product) => (
          <Card
            key={product.id}
            className={`rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-md ${
              product.published
                ? "border-border/80 bg-card"
                : "border-border/50 bg-muted/20 opacity-80"
            }`}
          >
            {/* Product Image & Badges */}
            <div className="relative aspect-video sm:aspect-square bg-muted/60 overflow-hidden group">
              <img
                src={
                  product.images[0] ||
                  "https://placehold.co/400x400?text=No+Image"
                }
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x400?text=Product";
                }}
              />

              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                <Badge
                  variant={product.published ? "default" : "secondary"}
                  className="text-[10px] px-2 py-0.5 rounded-md font-semibold backdrop-blur-md shadow-xs"
                >
                  {product.published ? "Live" : "Draft / Hidden"}
                </Badge>
                {product.featured && (
                  <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 rounded-md font-semibold">
                    ⭐ Featured
                  </Badge>
                )}
              </div>

              <div className="absolute top-2.5 right-2.5">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-xs ${
                    product.inStock && product.stockCount > 0
                      ? "bg-emerald-500/90 text-white border-transparent"
                      : "bg-destructive/90 text-white border-transparent"
                  }`}
                >
                  {product.inStock && product.stockCount > 0
                    ? `${product.stockCount} in stock`
                    : "Out of Stock"}
                </Badge>
              </div>
            </div>

            {/* Product Details */}
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="truncate font-medium">
                    {product.category}
                  </span>
                  {product.sku && (
                    <span className="font-mono text-[10px]">{product.sku}</span>
                  )}
                </div>
                <h3 className="font-display font-bold text-sm text-foreground mt-1 line-clamp-1 leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {product.description}
                </p>
              </div>

              {/* Price & Unit */}
              <div className="flex items-baseline gap-2 pt-1 border-t border-border/60">
                <span className="font-display font-black text-lg text-foreground">
                  ₹{product.price}
                </span>
                {product.mrp > product.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{product.mrp}
                  </span>
                )}
                {product.unit && (
                  <span className="text-[11px] text-muted-foreground ml-auto">
                    {product.unit}
                  </span>
                )}
              </div>

              {/* Action Buttons: Toggle Publish, Edit, Delete */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    store.toggleProductPublish(product.id);
                    toast.success(
                      product.published
                        ? `"${product.name}" is now hidden from public site.`
                        : `"${product.name}" is now published live!`,
                    );
                  }}
                  className="flex-1 h-8 text-xs gap-1 rounded-xl"
                  title={
                    product.published
                      ? "Hide from Storefront"
                      : "Publish to Storefront"
                  }
                >
                  {product.published ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-500" /> Publish
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(product)}
                  className="h-8 px-2.5 text-xs rounded-xl"
                  title="Edit Product"
                >
                  <Edit2 className="w-3.5 h-3.5 text-foreground" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmId(product.id)}
                  className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                  title="Delete Product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Add / Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl custom-scrollbar rounded-3xl">
          <form onSubmit={handleSaveProduct}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold text-foreground">
                {editingProduct
                  ? "Edit Product Details"
                  : "Add New Inventory Product"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Fill in product details, pricing, stock levels and images.
                Changes reflect live on your store.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Product Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Product Title / Name *
                </Label>
                <Input
                  required
                  placeholder="e.g., Aashirvaad Whole Wheat Atta 5kg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Description</Label>
                <Textarea
                  rows={3}
                  placeholder="Describe the product, ingredients, weight, specifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl text-xs sm:text-sm"
                />
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Selling Price (₹) *
                  </Label>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="rounded-xl font-display font-bold text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">MRP Price (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Unit / Packaging
                  </Label>
                  <Input
                    placeholder="e.g., 500g, 1 kg, Pack of 2"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Category & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl text-sm">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    SKU / Item Code
                  </Label>
                  <Input
                    placeholder="e.g. GROC-ATT-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="rounded-xl font-mono text-sm uppercase"
                  />
                </div>
              </div>

              {/* Stock Management */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-muted/40 border border-border/80">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Inventory Stock Count
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="rounded-xl text-sm bg-background"
                  />
                </div>
                <div className="flex items-center justify-between pt-4 sm:pt-6">
                  <div>
                    <Label className="text-xs font-semibold cursor-pointer">
                      In Stock Status
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Available for immediate purchase
                    </p>
                  </div>
                  <Switch
                    checked={inStock && stockCount > 0}
                    onCheckedChange={setInStock}
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <ImageUploader
                label="Product Showcase Image"
                value={imageUrl}
                onChange={setImageUrl}
                previewHeight="h-44"
              />

              {/* Visibility and Featured Toggles */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-muted/30 border border-border/80">
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div>
                    <Label className="text-xs font-semibold">
                      Publish to Website
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Visible on public store
                    </p>
                  </div>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div>
                    <Label className="text-xs font-semibold">
                      Feature on Homepage
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Highlight in featured carousel
                    </p>
                  </div>
                  <Switch checked={featured} onCheckedChange={setFeatured} />
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
                {editingProduct ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteProduct}
        title="Delete Product?"
        description="Are you sure you want to permanently delete this product? This action cannot be undone and will immediately remove it from your live shop."
      />
    </div>
  );
}

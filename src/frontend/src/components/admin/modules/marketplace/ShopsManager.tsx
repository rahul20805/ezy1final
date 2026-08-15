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
import {
  Building2,
  CheckCircle,
  Clock,
  Edit2,
  Eye,
  MapPin,
  Phone,
  Plus,
  Power,
  ShieldCheck,
  Star,
  Store,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredShop, useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";
import { ImageUploader } from "../../../owner/ImageUploader";

export function ShopsManager() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<StoredShop | null>(null);

  // Form State
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [category, setCategory] = useState("Grocery & Staples");
  const [city, setCity] = useState("Bengaluru");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"active" | "suspended" | "pending">("active");
  const [openingHours, setOpeningHours] = useState("07:00 AM - 10:00 PM");
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(8);
  const [image, setImage] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingShop(null);
    setBusinessName("");
    setOwnerName("");
    setCategory("Grocery & Staples");
    setCity("Bengaluru");
    setAddress("");
    setPhone("");
    setEmail("");
    setStatus("active");
    setOpeningHours("07:00 AM - 10:00 PM");
    setDeliveryRadiusKm(8);
    setImage("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (shop: StoredShop) => {
    setEditingShop(shop);
    setBusinessName(shop.businessName);
    setOwnerName(shop.ownerName);
    setCategory(shop.category);
    setCity(shop.city);
    setAddress(shop.address);
    setPhone(shop.phone);
    setEmail(shop.email);
    setStatus(shop.status);
    setOpeningHours(shop.openingHours);
    setDeliveryRadiusKm(shop.deliveryRadiusKm);
    setImage(shop.image || "");
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      toast.error("Business Name is required.");
      return;
    }

    if (editingShop) {
      store.updateShop(editingShop.id, {
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        category,
        city,
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim(),
        status,
        openingHours,
        deliveryRadiusKm,
        image: image || "https://placehold.co/500x500?text=Shop",
      });
      toast.success(`Store "${businessName}" updated!`);
    } else {
      store.addShop({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        category,
        city,
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim(),
        status,
        rating: 5.0,
        totalOrders: 0,
        totalRevenue: 0,
        openingHours,
        deliveryRadiusKm,
        verified: true,
        image: image || "https://placehold.co/500x500?text=Shop",
      });
      toast.success(`New Store "${businessName}" created and registered!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteShop(deleteConfirmId);
      toast.success("Shop deleted from platform.");
      setDeleteConfirmId(null);
    }
  };

  const toggleShopStatus = (shop: StoredShop) => {
    const nextStatus = shop.status === "active" ? "suspended" : "active";
    store.updateShop(shop.id, { status: nextStatus });
    toast.success(`Store status changed to: ${nextStatus.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredShop>
        title="Registered Shops & Merchants Directory"
        description="Search, filter, edit operational hours, radius, suspension and verification for all merchant partners."
        data={store.shops}
        searchPlaceholder="Search store name, owner, city, category..."
        searchFilter={(item, query) =>
          item.businessName.toLowerCase().includes(query) ||
          item.ownerName.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Store Status",
            options: [
              { label: "Active & Open", value: "active" },
              { label: "Suspended", value: "suspended" },
              { label: "Pending Verification", value: "pending" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Orders (High to Low)", value: "orders_desc" },
          { label: "Revenue (High to Low)", value: "revenue_desc" },
          { label: "Rating (High to Low)", value: "rating_desc" },
          { label: "Store Name (A-Z)", value: "name_asc" },
        ]}
        defaultSort="orders_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "revenue_desc") return list.sort((a, b) => b.totalRevenue - a.totalRevenue);
          if (sortVal === "rating_desc") return list.sort((a, b) => b.rating - a.rating);
          if (sortVal === "name_asc") return list.sort((a, b) => a.businessName.localeCompare(b.businessName));
          return list.sort((a, b) => b.totalOrders - a.totalOrders);
        }}
        onAddNew={openAddDialog}
        addNewLabel="Register New Store"
        pageSize={6}
        renderItem={(shop) => (
          <Card
            key={shop.id}
            className={`rounded-3xl border transition-all hover:shadow-md ${
              shop.status === "active"
                ? "border-border/80 bg-card"
                : "border-destructive/30 bg-destructive/5 opacity-80"
            }`}
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={shop.image || "https://placehold.co/100x100?text=Shop"}
                    alt={shop.businessName}
                    className="w-14 h-14 rounded-2xl object-cover border border-border/80 flex-shrink-0 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                        {shop.businessName}
                      </h3>
                      {shop.verified && <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Owner: <span className="font-medium text-foreground">{shop.ownerName}</span> • ID: #{shop.id}
                    </p>
                  </div>
                </div>

                <Badge
                  className={`text-[10px] uppercase font-bold ${
                    shop.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {shop.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Store className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{shop.category}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{shop.city} ({shop.deliveryRadiusKm}km)</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{shop.openingHours}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{shop.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Total Revenue</span>
                  <span className="font-display font-bold text-foreground">₹{shop.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Orders Processed</span>
                  <span className="font-display font-bold text-primary">{shop.totalOrders}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleShopStatus(shop)}
                  className={`h-8 px-2.5 text-xs rounded-xl gap-1 font-semibold ${
                    shop.status === "active" ? "hover:text-destructive" : "text-emerald-600"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {shop.status === "active" ? "Suspend Store" : "Reactivate"}
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(shop)}
                    className="h-8 px-2.5 text-xs rounded-xl"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirmId(shop.id)}
                    className="h-8 px-2.5 text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Add / Edit Shop Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl bg-card border-border shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingShop ? "Edit Merchant Store Profile" : "Register New Merchant Store"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Define the merchant's business details, category, operational hours and delivery coverage.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Store / Business Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Sharma Kirana Store"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="rounded-xl text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Owner Full Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl text-xs"
                    placeholder="Grocery, Pharmacy, etc."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">City</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-xl text-xs"
                    placeholder="Bengaluru"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Delivery Radius (km)</Label>
                  <Input
                    type="number"
                    value={deliveryRadiusKm}
                    onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
                    className="rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Contact Phone</Label>
                  <Input
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="store@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Store Address & Landmark</Label>
                <Input
                  placeholder="Full physical street address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Store Image</Label>
                <ImageUploader currentImage={image} onImageChange={setImage} label="Storefront Banner Photo" />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                {editingShop ? "Save Changes" : "Register Store"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Store Profile?"
        description="Are you sure you want to remove this shop? Its existing order history will remain preserved in the ledger."
      />
    </div>
  );
}

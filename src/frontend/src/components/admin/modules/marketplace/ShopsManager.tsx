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
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { ImageUploader } from "../../../owner/ImageUploader";
import { ServerDataTable } from "../../ServerDataTable";

interface ShopVendor {
  id: number;
  businessName: string;
  ownerName: string;
  category: string;
  city: string;
  address?: string;
  phone: string;
  email: string;
  status: "approved" | "suspended" | "pending" | "active";
  rating?: number;
  totalOrders?: number;
  totalRevenue?: number;
  openingHours?: string;
  deliveryRadiusKm?: number;
  verified?: boolean;
  image?: string;
}

export function ShopsManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<ShopVendor | null>(null);

  // Form State
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [category, setCategory] = useState("Grocery");
  const [city, setCity] = useState("Bengaluru");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"approved" | "suspended" | "pending">("approved");
  const [openingHours, setOpeningHours] = useState("07:00 AM - 10:00 PM");
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(8);
  const [image, setImage] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingShop(null);
    setBusinessName("");
    setOwnerName("");
    setCategory("Grocery");
    setCity("Bengaluru");
    setAddress("");
    setPhone("");
    setEmail("");
    setStatus("approved");
    setOpeningHours("07:00 AM - 10:00 PM");
    setDeliveryRadiusKm(8);
    setImage("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (shop: ShopVendor) => {
    setEditingShop(shop);
    setBusinessName(shop.businessName);
    setOwnerName(shop.ownerName || "");
    setCategory(shop.category);
    setCity(shop.city || "Bengaluru");
    setAddress(shop.address || "");
    setPhone(shop.phone || "");
    setEmail(shop.email || "");
    setStatus(shop.status === "suspended" ? "suspended" : "approved");
    setOpeningHours(shop.openingHours || "07:00 AM - 10:00 PM");
    setDeliveryRadiusKm(shop.deliveryRadiusKm || 8);
    setImage(shop.image || "");
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      toast.error("Business Name is required.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_partner_token") || localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      if (editingShop) {
        const res = await fetch(`/api/vendors/${editingShop.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
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
            image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to update store in database.");
        }
        toast.success(`Store "${businessName}" updated successfully!`);
      } else {
        const res = await fetch("/api/partner-applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessName: businessName.trim(),
            ownerName: ownerName.trim() || "Store Manager",
            category,
            partnerType: "shop_owner",
            email: email.trim() || `${businessName.toLowerCase().replace(/\s+/g, "")}@partner.ezy1.in`,
            phone: phone.trim() || "9800000000",
            address: address.trim(),
            city,
            operatingHours: openingHours,
            deliveryRadius: deliveryRadiusKm,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to register new store.");
        }
        toast.success(`Store registration submitted for "${businessName}"!`);
      }

      setIsDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to save store.");
    }
  };

  const toggleShopStatus = async (shop: ShopVendor) => {
    const nextStatus = shop.status === "suspended" ? "approved" : "suspended";
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_partner_token") || localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      const res = await fetch(`/api/vendors/${shop.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Could not update store status.");

      toast.success(`Store #${shop.id} is now ${nextStatus.toUpperCase()}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBulkAction = async (selectedIds: (string | number)[], action: string) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_partner_token") || localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    const res = await fetch("/api/admin/vendors/bulk-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        vendorIds: selectedIds.map(Number),
        action,
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Bulk action failed on server.");
    }

    toast.success(`Bulk updated ${json.successful} shops.`);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <ServerDataTable<ShopVendor>
        title="Store & Merchant Listings"
        description="Manage verified physical retail stores, supermarkets, pharmacies, and outlets across all operational cities."
        fetchUrl="/api/vendors"
        refreshTrigger={refreshTrigger}
        onAddNew={openAddDialog}
        addNewLabel="Register New Store"
        searchPlaceholder="Search store name, owner, city, category..."
        filterOptions={[
          {
            key: "category",
            label: "Store Category",
            options: [
              { label: "Grocery & Staples", value: "Grocery" },
              { label: "Pharmacy & Health", value: "Pharmacy" },
              { label: "Home Services", value: "Services" },
              { label: "Healthcare Clinic", value: "Healthcare" },
              { label: "Transport", value: "Transport" },
            ],
          },
          {
            key: "status",
            label: "Operating Status",
            options: [
              { label: "Active / Approved", value: "approved" },
              { label: "Suspended", value: "suspended" },
              { label: "Pending Review", value: "pending" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Store Name (A-Z)", value: "businessName_asc", sortBy: "businessName", sortOrder: "asc" },
          { label: "Store Name (Z-A)", value: "businessName_desc", sortBy: "businessName", sortOrder: "desc" },
          { label: "Rating (High to Low)", value: "rating_desc", sortBy: "rating", sortOrder: "desc" },
          { label: "Newest Registered", value: "id_desc", sortBy: "id", sortOrder: "desc" },
        ]}
        defaultSort="id_asc"
        defaultPageSize={25}
        bulkActions={[
          { label: "Approve Selected", action: "approve" },
          { label: "Suspend Selected", action: "suspend", variant: "destructive" },
          { label: "Verify Selected", action: "verify" },
        ]}
        onBulkAction={handleBulkAction}
        renderItem={(shop, _idx, isSelected, onToggleSelect) => {
          const isActive = shop.status === "approved" || shop.status === "active";
          return (
            <Card
              key={shop.id}
              className={`rounded-3xl border transition-all hover:shadow-md overflow-hidden flex flex-col ${
                isSelected ? "ring-2 ring-primary border-primary" : ""
              } ${
                isActive
                  ? "border-border/80 bg-card"
                  : "border-destructive/30 bg-destructive/5 opacity-80"
              }`}
            >
              <div className="relative h-36 w-full bg-muted overflow-hidden">
                <img
                  src={
                    shop.image ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"
                  }
                  alt={shop.businessName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <Badge className="bg-background/90 text-foreground backdrop-blur-md font-mono text-[10px] font-bold">
                    #{shop.id}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <Badge
                    className={`text-[10px] font-bold uppercase ${
                      isActive
                        ? "bg-emerald-500 text-white"
                        : "bg-destructive text-white"
                    }`}
                  >
                    {shop.status}
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="text-white">
                    <p className="text-xs font-semibold opacity-90">{shop.category}</p>
                    <h3 className="font-display font-bold text-base leading-tight drop-shadow-sm line-clamp-1">
                      {shop.businessName}
                    </h3>
                  </div>
                  {shop.rating && (
                    <div className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
                      <Star className="w-3 h-3 fill-current" />
                      {shop.rating}
                    </div>
                  )}
                </div>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{shop.address || shop.city || "Bengaluru"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{shop.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{shop.openingHours || "07:00 AM - 10:00 PM"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(shop)}
                    className="h-8 px-2.5 text-xs rounded-xl gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleShopStatus(shop)}
                    className={`h-8 px-2.5 text-xs rounded-xl font-semibold ${
                      isActive ? "hover:text-destructive" : "text-emerald-600"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {isActive ? "Suspend" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Edit / Add Store Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl bg-card border-border shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingShop ? "Edit Store Listing" : "Register New Physical Store"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Ensure details are verified. Updates will persist directly to the database.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Store Image URL</Label>
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Business Name *</Label>
                  <Input
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Modern Bazaar"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Owner / Manager Name</Label>
                  <Input
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="Grocery">Grocery & Staples</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy & Health</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                      <SelectItem value="Healthcare">Healthcare Clinic</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">City</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-semibold">Full Address</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 12, MG Road, Ward 4"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Contact Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Contact Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="store@partner.ezy1.in"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Operating Hours</Label>
                  <Input
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="07:00 AM - 10:00 PM"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Delivery Radius (km)</Label>
                  <Input
                    type="number"
                    value={deliveryRadiusKm}
                    onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
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
                {editingShop ? "Update Store" : "Register Store"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

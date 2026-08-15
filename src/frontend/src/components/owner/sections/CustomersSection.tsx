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
  Calendar,
  Edit2,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  User,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredCustomer, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { DataTable } from "../DataTable";

export function CustomersSection() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<StoredCustomer | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<StoredCustomer["status"]>("active");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingCustomer(null);
    setName("");
    setEmail("");
    setPhone("");
    setCity("Bengaluru");
    setAddress("");
    setStatus("active");
    setIsDialogOpen(true);
  };

  const openEditDialog = (cust: StoredCustomer) => {
    setEditingCustomer(cust);
    setName(cust.name);
    setEmail(cust.email);
    setPhone(cust.phone);
    setCity(cust.city);
    setAddress(cust.address || "");
    setStatus(cust.status);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Customer name and phone number are required.");
      return;
    }

    if (editingCustomer) {
      store.updateCustomer(editingCustomer.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        status,
      });
      toast.success(`Customer "${name}" updated!`);
    } else {
      store.addCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        totalOrders: 0,
        totalSpent: 0,
        walletBalance: 0,
        status,
      });
      toast.success(`Customer "${name}" added to directory!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteCustomer(deleteConfirmId);
      toast.success("Customer removed from records.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredCustomer>
        title="Customer Directory & Insights"
        description="View customer profiles, contact info, total orders placed and spending metrics."
        data={store.customers}
        searchPlaceholder="Search by customer name, phone, email, city..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Blocked", value: "blocked" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Newest Joined", value: "newest" },
          { label: "Most Orders", value: "orders_desc" },
          { label: "Highest Spent", value: "spent_desc" },
          { label: "Name A-Z", value: "name_asc" },
        ]}
        defaultSort="newest"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "orders_desc") return list.sort((a, b) => b.totalOrders - a.totalOrders);
          if (sortVal === "spent_desc") return list.sort((a, b) => b.totalSpent - a.totalSpent);
          if (sortVal === "name_asc") return list.sort((a, b) => a.name.localeCompare(b.name));
          return list.sort((a, b) => b.id - a.id);
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add Customer"
        pageSize={8}
        renderItem={(customer) => (
          <Card
            key={customer.id}
            className="rounded-2xl border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-display font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                    {customer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-foreground line-clamp-1">
                      {customer.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{customer.city}</span>
                    </div>
                  </div>
                </div>

                <Badge
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    customer.status === "active"
                      ? "bg-emerald-500 text-white"
                      : customer.status === "inactive"
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive text-white"
                  }`}
                >
                  {customer.status}
                </Badge>
              </div>

              {/* Contact Details */}
              <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="font-mono">{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span>Joined: {customer.joinedAt}</span>
                </div>
              </div>

              {/* Spending Stats */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/60 text-center">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Orders</span>
                  <p className="font-display font-black text-sm text-foreground">{customer.totalOrders}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Spent</span>
                  <p className="font-display font-black text-sm text-primary">₹{customer.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(customer)}
                  className="h-8 text-xs rounded-xl gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmId(customer.id)}
                  className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
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
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingCustomer ? "Edit Customer Details" : "Add New Customer Profile"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enter contact and address information.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Customer Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Phone Number *</Label>
                  <Input
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Email</Label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">City</Label>
                  <Input
                    placeholder="Bengaluru, Mumbai..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Account Status</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="rounded-xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Delivery Address</Label>
                <Input
                  placeholder="Apartment, Street, Area..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                {editingCustomer ? "Save Changes" : "Create Customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Customer Profile?"
        description="Are you sure you want to delete this customer record?"
      />
    </div>
  );
}

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
  CreditCard,
  Edit2,
  Mail,
  MapPin,
  Phone,
  Power,
  ShoppingBag,
  Trash2,
  User,
  Users,
  Wallet,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredCustomer, useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";

export function CustomersManager() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<StoredCustomer | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [address, setAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [status, setStatus] = useState<StoredCustomer["status"]>("active");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingCustomer(null);
    setName("");
    setEmail("");
    setPhone("");
    setCity("Bengaluru");
    setAddress("");
    setWalletBalance(500);
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
    setWalletBalance(cust.walletBalance);
    setStatus(cust.status);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and Phone number are required.");
      return;
    }

    if (editingCustomer) {
      store.updateCustomer(editingCustomer.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        walletBalance: Number(walletBalance),
        status,
      });
      toast.success(`Customer profile "${name}" updated!`);
    } else {
      store.addCustomer({
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, "")}@customer.ezy1.in`,
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        walletBalance: Number(walletBalance),
        totalOrders: 0,
        totalSpent: 0,
        status,
      });
      toast.success(`Customer "${name}" created!`);
    }

    setIsDialogOpen(false);
  };

  const toggleCustomerStatus = (cust: StoredCustomer) => {
    const nextStatus = cust.status === "active" ? "suspended" : "active";
    store.updateCustomer(cust.id, { status: nextStatus });
    toast.success(`Customer account marked as: ${nextStatus.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredCustomer>
        title="Verified Customer Directory"
        description="Search customer profiles, addresses, order history, lifetime spend and digital wallet balances."
        data={store.customers}
        searchPlaceholder="Search customer name, phone, email, city..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Account Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Suspended", value: "suspended" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Total Spent (High to Low)", value: "spent_desc" },
          { label: "Orders Count", value: "orders_desc" },
          { label: "Wallet Balance", value: "wallet_desc" },
          { label: "Name (A-Z)", value: "name_asc" },
        ]}
        defaultSort="spent_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "spent_desc") return list.sort((a, b) => b.totalSpent - a.totalSpent);
          if (sortVal === "orders_desc") return list.sort((a, b) => b.totalOrders - a.totalOrders);
          if (sortVal === "wallet_desc") return list.sort((a, b) => b.walletBalance - a.walletBalance);
          return list.sort((a, b) => a.name.localeCompare(b.name));
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add Customer"
        pageSize={6}
        renderItem={(cust) => (
          <Card
            key={cust.id}
            className={`rounded-3xl border transition-all hover:shadow-md ${
              cust.status === "active"
                ? "border-border/80 bg-card"
                : "border-destructive/30 bg-destructive/5 opacity-80"
            }`}
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-display font-black text-lg flex-shrink-0 shadow-xs">
                    {cust.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground">{cust.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      Joined: {cust.joinedAt} • ID: #{cust.id}
                    </p>
                  </div>
                </div>

                <Badge
                  className={`text-[10px] uppercase font-bold ${
                    cust.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {cust.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{cust.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{cust.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{cust.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Wallet className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate font-bold text-foreground">Wallet: ₹{cust.walletBalance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Lifetime Spend</span>
                  <span className="font-display font-black text-foreground">₹{cust.totalSpent.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Orders Placed</span>
                  <span className="font-display font-bold text-primary">{cust.totalOrders} Orders</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCustomerStatus(cust)}
                  className={`h-8 px-2.5 text-xs rounded-xl font-semibold ${
                    cust.status === "active" ? "hover:text-destructive" : "text-emerald-600"
                  }`}
                >
                  <Power className="w-3.5 h-3.5 mr-1" />
                  {cust.status === "active" ? "Suspend User" : "Activate"}
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(cust)}
                    className="h-8 px-2.5 text-xs rounded-xl"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Edit Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-bold">
                {editingCustomer ? "Edit Customer Details" : "Add Customer Profile"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Manage contact info, saved address and digital wallet balance.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Customer Full Name *</Label>
                <Input
                  required
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">City</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Wallet Balance Credit (₹)</Label>
                <Input
                  type="number"
                  value={walletBalance}
                  onChange={(e) => setWalletBalance(Number(e.target.value))}
                  className="rounded-xl font-bold font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Saved Delivery Address</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                {editingCustomer ? "Save Changes" : "Create Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

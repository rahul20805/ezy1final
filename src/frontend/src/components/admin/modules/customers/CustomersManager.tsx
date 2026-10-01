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
  Eye,
  Mail,
  MapPin,
  Phone,
  Power,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  User,
  Users,
  Wallet,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { type StoredCustomer, useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";

export function CustomersManager() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<StoredCustomer | null>(
    null,
  );
  const [detailCustomer, setDetailCustomer] = useState<StoredCustomer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
        email:
          email.trim() ||
          `${name.toLowerCase().replace(/\s+/g, "")}@customer.ezy1.in`,
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
          if (sortVal === "spent_desc")
            return list.sort((a, b) => b.totalSpent - a.totalSpent);
          if (sortVal === "orders_desc")
            return list.sort((a, b) => b.totalOrders - a.totalOrders);
          if (sortVal === "wallet_desc")
            return list.sort((a, b) => b.walletBalance - a.walletBalance);
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
                    <h3 className="font-display font-bold text-base text-foreground">
                      {cust.name}
                    </h3>
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
                  <span className="truncate font-bold text-foreground">
                    Wallet: ₹{cust.walletBalance}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">
                    Lifetime Spend
                  </span>
                  <span className="font-display font-black text-foreground">
                    ₹{cust.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">
                    Orders Placed
                  </span>
                  <span className="font-display font-bold text-primary">
                    {cust.totalOrders} Orders
                  </span>
                </div>
              </div>

              {/* Frequently Ordered Items Breakdown */}
              {cust.frequentlyOrderedItems && cust.frequentlyOrderedItems.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Frequently Ordered:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cust.frequentlyOrderedItems.slice(0, 3).map((it, idx) => (
                      <span
                        key={idx}
                        className="bg-primary/10 text-primary border border-primary/20 text-[10px] px-2 py-0.5 rounded-full font-medium"
                      >
                        {it.name} <b className="text-primary font-bold">({it.count}x)</b>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {cust.recentSearches && cust.recentSearches.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <Search className="w-3 h-3 text-cyan-500" /> Recent Searches:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cust.recentSearches.slice(0, 3).map((q, idx) => (
                      <span
                        key={idx}
                        className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full"
                      >
                        "{q}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Cart State */}
              {cust.activeCartItems && cust.activeCartItems.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-xl">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{cust.activeCartItems.length} items currently in cart</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCustomerStatus(cust)}
                  className={`h-8 px-2.5 text-xs rounded-xl font-semibold ${
                    cust.status === "active"
                      ? "hover:text-destructive"
                      : "text-emerald-600"
                  }`}
                >
                  <Power className="w-3.5 h-3.5 mr-1" />
                  {cust.status === "active" ? "Suspend User" : "Activate"}
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDetailCustomer(cust);
                      setIsDetailOpen(true);
                    }}
                    className="h-8 px-2.5 text-xs rounded-xl text-primary border-primary/30 hover:bg-primary/10 font-semibold"
                    title="View Full Customer Intelligence"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Insights
                  </Button>
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
                {editingCustomer
                  ? "Edit Customer Details"
                  : "Add Customer Profile"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Manage contact info, saved address and digital wallet balance.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Customer Full Name *
                </Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Phone Number *
                  </Label>
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
                <Label className="text-xs font-semibold">
                  Wallet Balance Credit (₹)
                </Label>
                <Input
                  type="number"
                  value={walletBalance}
                  onChange={(e) => setWalletBalance(Number(e.target.value))}
                  className="rounded-xl font-bold font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Saved Delivery Address
                </Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl text-xs"
                />
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
                {editingCustomer ? "Save Changes" : "Create Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Intelligence & Profile Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg bg-card border-border shadow-2xl rounded-3xl p-6">
          {detailCustomer && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                    {detailCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold font-display">
                      {detailCustomer.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground font-mono">
                      Customer ID: #{detailCustomer.id} • Joined: {detailCustomer.joinedAt}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Contact & Spend Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Contact</span>
                  <p className="font-semibold text-foreground mt-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-primary" /> {detailCustomer.phone}
                  </p>
                  <p className="text-muted-foreground text-[11px] truncate flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3 text-primary" /> {detailCustomer.email}
                  </p>
                  <p className="text-muted-foreground text-[11px] flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-primary" /> {detailCustomer.city}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Lifetime Activity</span>
                  <p className="font-display font-black text-lg text-emerald-600 mt-1">
                    ₹{detailCustomer.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    {detailCustomer.totalOrders} Completed Orders
                  </p>
                  <p className="text-[11px] text-muted-foreground font-bold mt-0.5">
                    Wallet: ₹{detailCustomer.walletBalance}
                  </p>
                </div>
              </div>

              {/* Frequently Ordered Items */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Frequently Ordered Products
                </h4>
                {detailCustomer.frequentlyOrderedItems && detailCustomer.frequentlyOrderedItems.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {detailCustomer.frequentlyOrderedItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-muted/40 text-xs">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] font-bold">
                            Ordered {item.count} times
                          </Badge>
                          <span className="font-bold text-foreground">₹{item.price * item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No order history recorded yet.</p>
                )}
              </div>

              {/* Recent Searches */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-cyan-500" /> Recent Search Queries
                </h4>
                {detailCustomer.recentSearches && detailCustomer.recentSearches.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {detailCustomer.recentSearches.map((q, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs font-medium py-1 px-2.5">
                        "{q}"
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No search history recorded yet.</p>
                )}
              </div>

              {/* Active Cart Items */}
              {detailCustomer.activeCartItems && detailCustomer.activeCartItems.length > 0 && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                  <h4 className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5" /> Items Currently In Cart (Live)
                  </h4>
                  <div className="space-y-1">
                    {detailCustomer.activeCartItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-foreground">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Close Insights
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

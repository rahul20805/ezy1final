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
  Calendar,
  Edit2,
  Percent,
  Plus,
  Power,
  Sparkles,
  Ticket,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredCoupon, useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";

export function CouponsManager() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<StoredCoupon | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(199);
  const [maxDiscount, setMaxDiscount] = useState<number>(100);
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [active, setActive] = useState(true);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingCoupon(null);
    setCode("");
    setTitle("");
    setDiscountType("percentage");
    setDiscountValue(10);
    setMinOrderAmount(199);
    setMaxDiscount(100);
    setExpiryDate("2026-12-31");
    setUsageLimit(500);
    setActive(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (coupon: StoredCoupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setTitle(coupon.title);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setMinOrderAmount(coupon.minOrderAmount);
    setMaxDiscount(coupon.maxDiscount || 100);
    setExpiryDate(coupon.expiryDate);
    setUsageLimit(coupon.usageLimit);
    setActive(coupon.active);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Coupon code is required.");
      return;
    }

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (editingCoupon) {
      store.updateCoupon(editingCoupon.id, {
        code: cleanCode,
        title: title.trim() || `Discount Code ${cleanCode}`,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        maxDiscount: Number(maxDiscount),
        expiryDate,
        usageLimit: Number(usageLimit),
        active,
      });
      toast.success(`Coupon "${cleanCode}" updated!`);
    } else {
      store.addCoupon({
        code: cleanCode,
        title: title.trim() || `Discount Code ${cleanCode}`,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        maxDiscount: Number(maxDiscount),
        expiryDate,
        usageLimit: Number(usageLimit),
        active,
      });
      toast.success(`New coupon code "${cleanCode}" created!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteCoupon(deleteConfirmId);
      toast.success("Coupon deleted.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredCoupon>
        title="Coupons & Discount Vouchers"
        description="Create promotional codes, percentage or flat discounts, usage limits and minimum order thresholds."
        data={store.coupons}
        searchPlaceholder="Search coupon code, description..."
        searchFilter={(item, query) =>
          item.code.toLowerCase().includes(query) || item.title.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "discountType",
            label: "Discount Type",
            options: [
              { label: "Percentage %", value: "percentage" },
              { label: "Fixed Amount ₹", value: "fixed" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Code (A-Z)", value: "code_asc" },
          { label: "Usage Count", value: "usage_desc" },
        ]}
        defaultSort="code_asc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "usage_desc") return list.sort((a, b) => b.usedCount - a.usedCount);
          return list.sort((a, b) => a.code.localeCompare(b.code));
        }}
        onAddNew={openAddDialog}
        addNewLabel="Create Coupon"
        pageSize={6}
        renderItem={(coupon) => (
          <Card
            key={coupon.id}
            className={`rounded-3xl border transition-all hover:shadow-md ${
              coupon.active ? "border-border/80 bg-card" : "border-border/50 bg-muted/20 opacity-70"
            }`}
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-mono font-black text-lg flex-shrink-0 shadow-xs">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-base text-foreground">{coupon.code}</h3>
                    <p className="text-xs text-muted-foreground">{coupon.title}</p>
                  </div>
                </div>

                <Badge
                  className={`text-[10px] font-bold ${
                    coupon.discountType === "percentage"
                      ? "bg-purple-500/10 text-purple-600"
                      : "bg-emerald-500/10 text-emerald-600"
                  }`}
                >
                  {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                </Badge>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Order Value:</span>
                  <span className="font-bold text-foreground">₹{coupon.minOrderAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usage Progress:</span>
                  <span className="font-mono font-semibold text-primary">
                    {coupon.usedCount} / {coupon.usageLimit} redeemed
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until:</span>
                  <span className="font-mono">{coupon.expiryDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <Badge
                  variant={coupon.active ? "default" : "outline"}
                  className={`text-[10px] ${coupon.active ? "bg-emerald-600 text-white" : "text-muted-foreground"}`}
                >
                  {coupon.active ? "Active" : "Disabled"}
                </Badge>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(coupon)}
                    className="h-8 px-2.5 text-xs rounded-xl"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirmId(coupon.id)}
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

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingCoupon ? "Edit Coupon" : "Create Promotional Coupon"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Define the discount code, percentage/fixed value, and expiration date.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Coupon Code *</Label>
                <Input
                  required
                  placeholder="e.g. SUPER50"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="rounded-xl font-mono text-sm font-bold uppercase"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Campaign Title / Description</Label>
                <Input
                  placeholder="Flat 50 OFF on fresh groceries"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Discount Type</Label>
                  <Select value={discountType} onValueChange={(val: any) => setDiscountType(val)}>
                    <SelectTrigger className="rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Flat Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Discount Value *</Label>
                  <Input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Min Order Amount (₹)</Label>
                  <Input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Usage Limit</Label>
                  <Input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                <Label className="text-xs font-semibold">Active Voucher</Label>
                <Switch checked={active} onCheckedChange={setActive} />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                {editingCoupon ? "Save Changes" : "Create Voucher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Coupon Code?"
        description="Are you sure you want to delete this coupon? Customers will no longer be able to apply it at checkout."
      />
    </div>
  );
}

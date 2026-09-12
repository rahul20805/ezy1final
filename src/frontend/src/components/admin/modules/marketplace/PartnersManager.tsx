import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  Building2,
  FileCheck,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  Power,
  RotateCcw,
  ShieldCheck,
  Star,
  User,
  UserCheck,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ServerDataTable } from "../../ServerDataTable";

interface VendorRecord {
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
  verified?: boolean;
  totalOrders?: number;
  joinedAt?: string;
  userId?: number;
}

export function PartnersManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isResetPwOpen, setIsResetPwOpen] = useState(false);
  const [targetVendor, setTargetVendor] = useState<VendorRecord | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVendor || !newPassword.trim()) {
      toast.error("Please enter a new password.");
      return;
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
          : null;

      const res = await fetch(`/api/vendors/${targetVendor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tempPassword: newPassword.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to reset password on server.");
      }

      toast.success(`Password reset for partner ID: "${targetVendor.id}"`);
      setIsResetPwOpen(false);
      setNewPassword("");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    }
  };

  const togglePartnerStatus = async (vendor: VendorRecord) => {
    const nextStatus = vendor.status === "suspended" ? "approved" : "suspended";
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
          : null;

      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Status update failed.");
      }

      toast.success(`Partner #${vendor.id} is now ${nextStatus.toUpperCase()}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Could not update partner status.");
    }
  };

  const handleBulkAction = async (selectedIds: (string | number)[], action: string) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
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

    toast.success(
      `Bulk action applied: ${json.successful} updated, ${json.failed} failed.`
    );
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <ServerDataTable<VendorRecord>
        title="Vendors & Partners Directory"
        description="High-scale directory connected to live database with server pagination, indexing & bulk operations."
        fetchUrl="/api/vendors"
        refreshTrigger={refreshTrigger}
        searchPlaceholder="Search partner name, owner, city, phone, email..."
        filterOptions={[
          {
            key: "category",
            label: "Domain Scope",
            options: [
              { label: "Retail & Grocery", value: "Grocery" },
              { label: "Pharmacy & Wellness", value: "Pharmacy" },
              { label: "Home Services", value: "Services" },
              { label: "Healthcare & Hospitals", value: "Healthcare" },
              { label: "Transport & Rides", value: "Transport" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Approved / Active", value: "approved" },
              { label: "Suspended", value: "suspended" },
              { label: "Pending", value: "pending" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Business Name (A-Z)", value: "businessName_asc", sortBy: "businessName", sortOrder: "asc" },
          { label: "Business Name (Z-A)", value: "businessName_desc", sortBy: "businessName", sortOrder: "desc" },
          { label: "Newest Partners", value: "id_desc", sortBy: "id", sortOrder: "desc" },
          { label: "Oldest Partners", value: "id_asc", sortBy: "id", sortOrder: "asc" },
          { label: "Highest Rated", value: "rating_desc", sortBy: "rating", sortOrder: "desc" },
        ]}
        defaultSort="id_asc"
        defaultPageSize={25}
        bulkActions={[
          { label: "Approve Selected", action: "approve" },
          { label: "Suspend Selected", action: "suspend", variant: "destructive" },
          { label: "Verify KYC", action: "verify" },
        ]}
        onBulkAction={handleBulkAction}
        renderItem={(partner, _idx, isSelected, onToggleSelect) => {
          const isActive = partner.status === "approved" || partner.status === "active";
          return (
            <Card
              key={partner.id}
              className={`rounded-3xl border transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary border-primary" : ""
              } ${
                isActive
                  ? "border-border/80 bg-card"
                  : "border-destructive/30 bg-destructive/5 opacity-80"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={onToggleSelect}
                      className="rounded-md mr-1 border-border/80"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-display font-black text-lg flex-shrink-0 shadow-xs">
                      {partner.businessName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                          {partner.businessName}
                        </h3>
                        {partner.verified !== false && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Owner:{" "}
                        <span className="font-medium text-foreground">
                          {partner.ownerName || "Partner"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`text-[10px] uppercase font-bold ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    {partner.status}
                  </Badge>
                </div>

                {/* ID & Category Info */}
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Partner ID:</span>
                    <span className="font-bold text-foreground">#{partner.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-bold text-primary">{partner.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{partner.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{partner.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{partner.city || "India"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="truncate font-semibold text-emerald-600">
                      KYC Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetVendor(partner);
                      setNewPassword("");
                      setIsResetPwOpen(true);
                    }}
                    className="h-8 px-2.5 text-xs rounded-xl gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-primary" /> Reset PW
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePartnerStatus(partner)}
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

      {/* Reset Password Dialog */}
      <Dialog open={isResetPwOpen} onOpenChange={setIsResetPwOpen}>
        <DialogContent className="max-w-sm bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handlePasswordReset}>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-bold">
                Force Partner Password Reset
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set a new login password for {targetVendor?.businessName} (ID: #{targetVendor?.id}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">New Password *</Label>
                <Input
                  required
                  type="text"
                  placeholder="e.g. partner123"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl font-mono text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResetPwOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

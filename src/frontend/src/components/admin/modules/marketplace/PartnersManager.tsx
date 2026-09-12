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
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type PartnerAccount,
  usePartnerAuth,
} from "../../../../lib/partnerAuthStore";
import { useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";

export function PartnersManager() {
  const { partners, updatePartner, deletePartner } = usePartnerAuth();
  const store = useStoreData();

  const [isResetPwOpen, setIsResetPwOpen] = useState(false);
  const [targetPartner, setTargetPartner] = useState<PartnerAccount | null>(
    null,
  );
  const [newPassword, setNewPassword] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPartner || !newPassword.trim()) {
      toast.error("Please enter a new password.");
      return;
    }

    updatePartner(targetPartner.id, { password: newPassword.trim() });
    toast.success(`Password reset for partner ID: "${targetPartner.id}"`);
    setIsResetPwOpen(false);
    setNewPassword("");
  };

  const togglePartnerStatus = (partner: PartnerAccount) => {
    const nextStatus = partner.status === "active" ? "suspended" : "active";
    updatePartner(partner.id, { status: nextStatus });
    toast.success(
      `Partner ${partner.id} marked as: ${nextStatus.toUpperCase()}`,
    );
  };

  return (
    <div className="space-y-6">
      <DataTable<PartnerAccount>
        title="Vendors & Partners Directory"
        description="Manage verified merchant access, credentials, individual Admin IDs, and operational roles."
        data={partners}
        searchPlaceholder="Search partner ID, business name, owner name, category..."
        searchFilter={(item, query) =>
          item.id.toLowerCase().includes(query) ||
          item.businessName.toLowerCase().includes(query) ||
          item.ownerName.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "category",
            label: "Domain Scope",
            options: [
              { label: "Retail & Grocery", value: "Grocery" },
              { label: "Pharmacy", value: "Pharmacy" },
              { label: "Services", value: "Services" },
              { label: "Transport", value: "Transport" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Business Name (A-Z)", value: "name_asc" },
          { label: "Admin ID", value: "id_asc" },
        ]}
        defaultSort="name_asc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "id_asc")
            return list.sort((a, b) => a.id.localeCompare(b.id));
          return list.sort((a, b) =>
            a.businessName.localeCompare(b.businessName),
          );
        }}
        pageSize={6}
        renderItem={(partner) => (
          <Card
            key={partner.id}
            className={`rounded-3xl border transition-all hover:shadow-md ${
              partner.status === "active"
                ? "border-border/80 bg-card"
                : "border-destructive/30 bg-destructive/5 opacity-80"
            }`}
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-display font-black text-lg flex-shrink-0 shadow-xs">
                    {partner.businessName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                        {partner.businessName}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Contact:{" "}
                      <span className="font-medium text-foreground">
                        {partner.ownerName}
                      </span>
                    </p>
                  </div>
                </div>

                <Badge
                  className={`text-[10px] uppercase font-bold ${
                    partner.role === "super_owner"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {partner.category}
                </Badge>
              </div>

              {/* Login Credentials Box */}
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Admin Login ID:</span>
                  <span className="font-bold text-foreground">
                    {partner.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Password:</span>
                  <span className="font-bold text-primary">
                    {partner.password}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{partner.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{partner.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{partner.city}</span>
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
                    setTargetPartner(partner);
                    setNewPassword("");
                    setIsResetPwOpen(true);
                  }}
                  className="h-8 px-2.5 text-xs rounded-xl gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-primary" /> Reset
                  Password
                </Button>

                {partner.role !== "super_owner" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePartnerStatus(partner)}
                    className={`h-8 px-2.5 text-xs rounded-xl font-semibold ${
                      partner.status === "active"
                        ? "hover:text-destructive"
                        : "text-emerald-600"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {partner.status === "active" ? "Suspend" : "Activate"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Reset Password Dialog */}
      <Dialog open={isResetPwOpen} onOpenChange={setIsResetPwOpen}>
        <DialogContent className="max-w-sm bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handlePasswordReset}>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-bold">
                Force Password Reset
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set a new login password for {targetPartner?.businessName} (
                {targetPartner?.id}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">New Password *</Label>
                <Input
                  required
                  type="text"
                  placeholder="e.g. partner456"
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

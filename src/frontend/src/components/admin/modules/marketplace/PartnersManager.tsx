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
  CheckCircle,
  Copy,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Power,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ServerDataTable } from "../../ServerDataTable";
import { getPartnerToken } from "../../../../lib/partnerAuthStore";

interface PartnerRecord {
  id: number;
  partnerUserId: string;
  businessName: string;
  name: string;
  category: string;
  city: string;
  address?: string;
  phone: string;
  email: string;
  role?: string;
  isVerified?: boolean | number;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "approved" | "pending" | "suspended" | "active";
  mustChangePassword?: boolean | number;
  lastLoginAt?: string;
  createdAt?: string;
}

export function PartnersManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Add Partner Modal State
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerBusiness, setNewPartnerBusiness] = useState("");
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const [newPartnerPhone, setNewPartnerPhone] = useState("");
  const [newPartnerCategory, setNewPartnerCategory] = useState("Grocery");
  const [newProviderType, setNewProviderType] = useState("GROCERY");
  const [newPartnerCity, setNewPartnerCity] = useState("Bengaluru");
  const [newPartnerAddress, setNewPartnerAddress] = useState("");
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Credentials Display Modal (After Add / Reset)
  const [createdCredentials, setCreatedCredentials] = useState<{
    partnerUserId: string;
    temporaryPassword: string;
    businessName: string;
  } | null>(null);

  // Reset Password Modal State
  const [isResetPwOpen, setIsResetPwOpen] = useState(false);
  const [targetPartner, setTargetPartner] = useState<PartnerRecord | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Handle Add Partner
  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName || !newPartnerBusiness || !newPartnerEmail || !newPartnerPhone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmittingNew(true);
    const token = getPartnerToken();

    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: newPartnerName,
          businessName: newPartnerBusiness,
          email: newPartnerEmail,
          phone: newPartnerPhone,
          category: newPartnerCategory,
          providerType: newProviderType,
          partnerType: newProviderType,
          city: newPartnerCity,
          address: newPartnerAddress,
        }),
      });

      const data = await res.json();
      setIsSubmittingNew(false);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create partner.");
      }

      toast.success("Partner account created successfully!");
      setIsAddPartnerOpen(false);
      setCreatedCredentials({
        partnerUserId: data.credentials.partnerUserId,
        temporaryPassword: data.credentials.temporaryPassword,
        businessName: newPartnerBusiness,
      });

      // Reset form
      setNewPartnerName("");
      setNewPartnerBusiness("");
      setNewPartnerEmail("");
      setNewPartnerPhone("");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      setIsSubmittingNew(false);
      toast.error(err.message || "Failed to create partner account.");
    }
  };

  // Handle Force Password Reset by Admin
  const handlePasswordReset = async () => {
    if (!targetPartner) return;
    setIsResetting(true);
    const token = getPartnerToken();

    try {
      const res = await fetch(`/api/admin/partners/${targetPartner.id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      setIsResetting(false);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reset password.");
      }

      toast.success(`Temporary password generated for ${targetPartner.partnerUserId}`);
      setIsResetPwOpen(false);
      setCreatedCredentials({
        partnerUserId: data.credentials.partnerUserId,
        temporaryPassword: data.credentials.temporaryPassword,
        businessName: targetPartner.businessName,
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      setIsResetting(false);
      toast.error(err.message || "Failed to reset password.");
    }
  };

  // Toggle Partner Status (Activate / Suspend)
  const togglePartnerStatus = async (partner: PartnerRecord) => {
    const isCurrentlyActive = partner.status === "ACTIVE" || partner.status === "approved" || partner.status === "active";
    const nextStatus = isCurrentlyActive ? "SUSPENDED" : "ACTIVE";
    const token = getPartnerToken();

    try {
      const res = await fetch(`/api/admin/partners/${partner.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Status update failed.");
      }

      toast.success(`Partner ${partner.partnerUserId || partner.id} is now ${nextStatus}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Could not update partner status.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Add Partner Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-card to-muted/40 border border-border shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Partner & Merchant Credentials Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create unique Partner User IDs, assign temporary credentials, force password updates, and control access.
          </p>
        </div>

        <Button
          onClick={() => setIsAddPartnerOpen(true)}
          className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs gap-1.5 h-9 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Partner
        </Button>
      </div>

      <ServerDataTable<PartnerRecord>
        title="Active Partners & Authentication Records"
        description="Live partner directory with unique User ID credentials, verification status, and security controls."
        fetchUrl="/api/admin/partners"
        refreshTrigger={refreshTrigger}
        searchPlaceholder="Search Partner User ID (e.g. EZY-P-10001), name, business, city, phone..."
        filterOptions={[
          {
            key: "category",
            label: "Domain Scope",
            options: [
              { label: "Retail & Grocery", value: "Grocery" },
              { label: "Pharmacy & Wellness", value: "Pharmacy" },
              { label: "Home Services", value: "Services" },
              { label: "Healthcare & Clinics", value: "Healthcare" },
              { label: "Transport & Fleet", value: "Transport" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "ACTIVE" },
              { label: "Suspended", value: "SUSPENDED" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Partner User ID (Asc)", value: "id_asc", sortBy: "id", sortOrder: "asc" },
          { label: "Partner User ID (Desc)", value: "id_desc", sortBy: "id", sortOrder: "desc" },
          { label: "Business Name (A-Z)", value: "businessName_asc", sortBy: "businessName", sortOrder: "asc" },
        ]}
        defaultSort="id_asc"
        defaultPageSize={25}
        renderItem={(partner, _idx, isSelected, onToggleSelect) => {
          const isActive = partner.status === "ACTIVE" || partner.status === "approved" || partner.status === "active";
          const mustChange = Boolean(partner.mustChangePassword);

          return (
            <Card
              key={partner.id}
              className={`rounded-3xl border transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary border-primary" : ""
              } ${
                isActive
                  ? "border-border/80 bg-card"
                  : "border-destructive/30 bg-destructive/5 opacity-85"
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
                      {(partner.businessName || "P").charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                          {partner.businessName}
                        </h3>
                        {partner.isVerified !== false && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Contact:{" "}
                        <span className="font-medium text-foreground">
                          {partner.name || "Partner"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {mustChange && (
                      <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">
                        Temp Password
                      </Badge>
                    )}
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
                </div>

                {/* Partner User ID & Category Info */}
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Partner User ID:</span>
                    <span className="font-bold text-foreground text-sm tracking-wider text-primary">
                      {partner.partnerUserId || `EZY-P-${10000 + partner.id}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Domain Scope:</span>
                    <span className="font-semibold text-foreground">{partner.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Portal Login:</span>
                    <span className="text-muted-foreground font-sans text-[11px]">
                      {partner.lastLoginAt ? new Date(partner.lastLoginAt).toLocaleString("en-IN") : "Never logged in"}
                    </span>
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
                      ID Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetPartner(partner);
                      setIsResetPwOpen(true);
                    }}
                    className="h-8 px-2.5 text-xs rounded-xl gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-primary" /> Reset Password
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
                    {isActive ? "Disable Account" : "Activate Account"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Add Partner Dialog */}
      <Dialog open={isAddPartnerOpen} onOpenChange={setIsAddPartnerOpen}>
        <DialogContent className="max-w-md bg-card border-border rounded-3xl">
          <form onSubmit={handleAddPartner}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Register New Partner Account
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                The system will automatically generate a unique Partner User ID and temporary login credentials.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Business / Store Name *</Label>
                <Input
                  required
                  placeholder="e.g. Verma Supermarket"
                  value={newPartnerBusiness}
                  onChange={(e) => setNewPartnerBusiness(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Contact Person / Owner Name *</Label>
                <Input
                  required
                  placeholder="e.g. Anand Verma"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Email Address *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="partner@ezy1.in"
                    value={newPartnerEmail}
                    onChange={(e) => setNewPartnerEmail(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Phone Number *</Label>
                  <Input
                    required
                    type="tel"
                    placeholder="9876543210"
                    value={newPartnerPhone}
                    onChange={(e) => setNewPartnerPhone(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Provider Type (RBAC) *</Label>
                  <select
                    value={newProviderType}
                    onChange={(e) => {
                      setNewProviderType(e.target.value);
                      if (e.target.value === "GROCERY") setNewPartnerCategory("Grocery");
                      if (e.target.value === "HOSPITAL") setNewPartnerCategory("Healthcare");
                      if (e.target.value === "PHARMACY") setNewPartnerCategory("Pharmacy");
                      if (e.target.value === "RESTAURANT") setNewPartnerCategory("Restaurant");
                      if (e.target.value === "DELIVERY") setNewPartnerCategory("Transport");
                      if (e.target.value === "SERVICE_PROVIDER") setNewPartnerCategory("Services");
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-medium"
                  >
                    <option value="GROCERY">Grocery & Retail Partner</option>
                    <option value="HOSPITAL">Hospital & Healthcare Partner</option>
                    <option value="PHARMACY">Pharmacy & Medicines Partner</option>
                    <option value="RESTAURANT">Restaurant & Food Partner</option>
                    <option value="DELIVERY">Delivery Fleet Partner</option>
                    <option value="SERVICE_PROVIDER">Home & On-Demand Services</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">City *</Label>
                  <Input
                    required
                    placeholder="e.g. Bengaluru"
                    value={newPartnerCity}
                    onChange={(e) => setNewPartnerCity(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Business Address</Label>
                <Input
                  placeholder="Street / Locality"
                  value={newPartnerAddress}
                  onChange={(e) => setNewPartnerAddress(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddPartnerOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingNew}
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {isSubmittingNew ? "Creating Account..." : "Generate Partner ID & Credentials"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Generated Credentials Modal (After Create or Password Reset) */}
      <Dialog open={!!createdCredentials} onOpenChange={() => setCreatedCredentials(null)}>
        <DialogContent className="max-w-md bg-card border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-emerald-600">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Partner Credentials Generated
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide these initial credentials to the partner. They will be required to change their temporary password upon first login.
            </DialogDescription>
          </DialogHeader>

          {createdCredentials && (
            <div className="space-y-3 py-3">
              <div className="p-3 bg-muted rounded-xl space-y-2 font-mono text-sm border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Partner User ID:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-foreground tracking-wider">{createdCredentials.partnerUserId}</strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdCredentials.partnerUserId)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Temporary Password:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-primary tracking-wider">{createdCredentials.temporaryPassword}</strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdCredentials.temporaryPassword)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground">
                🔒 The temporary password is now securely hashed in the database and will not be displayed again.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setCreatedCredentials(null)}
              className="w-full rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force Reset Password Dialog */}
      <Dialog open={isResetPwOpen} onOpenChange={setIsResetPwOpen}>
        <DialogContent className="max-w-sm bg-card border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              Reset Partner Password
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Generate a new temporary password for {targetPartner?.businessName} ({targetPartner?.partnerUserId}).
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-muted-foreground py-2">
            The partner will be forced to change this temporary password upon their next sign-in.
          </p>

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
              type="button"
              disabled={isResetting}
              onClick={handlePasswordReset}
              className="rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              {isResetting ? "Generating..." : "Generate Temporary Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

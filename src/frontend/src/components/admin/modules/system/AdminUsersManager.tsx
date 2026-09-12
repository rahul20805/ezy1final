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
  CheckSquare,
  KeyRound,
  Lock,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  UserCheck,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type AdminRole,
  type PartnerAccount,
  usePartnerAuth,
} from "../../../../lib/partnerAuthStore";
import { DataTable } from "../../../owner/DataTable";

export function AdminUsersManager() {
  const { partners, addPartner, deletePartner } = usePartnerAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AdminRole>("ADMIN");
  const [email, setEmail] = useState("");

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !password.trim() || !fullName.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (
      partners.some((p) => p.id.toLowerCase() === adminId.trim().toLowerCase())
    ) {
      toast.error("An admin account with this ID already exists.");
      return;
    }

    addPartner({
      id: adminId.trim().toLowerCase(),
      password: password.trim(),
      businessName: "EZY1 Administration",
      ownerName: fullName.trim(),
      category: "System",
      role,
      phone: "+91 98765 00000",
      email: email.trim() || `${adminId.trim()}@admin.ezy1.in`,
      city: "Bengaluru",
      status: "active",
      permissions: {
        canManageShop: true,
        canManageServices: true,
        canManageBookings: true,
        canManageOrders: true,
        canManageEnquiries: true,
        canManageCustomers: true,
        canManageGallery: true,
        canManageReviews: true,
        canManageWebsiteContent:
          role === "SUPER_ADMIN" || role === "CONTENT_MANAGER",
        canManageCategories: role === "SUPER_ADMIN",
        canManageOwnerSettings:
          role === "SUPER_ADMIN" || role === "super_owner",
        canManageHealthcare: true,
        canManageTransport: true,
        canManageDelivery: true,
        canManageFinance: role === "SUPER_ADMIN" || role === "FINANCE_MANAGER",
        canManageAuditLogs: role === "SUPER_ADMIN",
        canManageAdmins: role === "SUPER_ADMIN" || role === "super_owner",
      },
    });

    toast.success(`New Admin user "${adminId}" created with role "${role}"!`);
    setIsDialogOpen(false);
    setAdminId("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="space-y-6">
      <DataTable<PartnerAccount>
        title="Admin Users & Granular RBAC Permissions"
        description="Create internal operator accounts, assign granular role-based permissions and manage access revocation."
        data={partners}
        searchPlaceholder="Search admin ID, name, role..."
        searchFilter={(item, query) =>
          item.id.toLowerCase().includes(query) ||
          item.ownerName.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query)
        }
        filterOptions={[]}
        sortOptions={[{ label: "Admin ID", value: "id_asc" }]}
        defaultSort="id_asc"
        onSort={(items) => [...items].sort((a, b) => a.id.localeCompare(b.id))}
        onAddNew={() => {
          setAdminId("");
          setPassword("");
          setFullName("");
          setEmail("");
          setRole("ADMIN");
          setIsDialogOpen(true);
        }}
        addNewLabel="Create Admin User"
        pageSize={6}
        renderItem={(admin) => (
          <Card
            key={admin.id}
            className="rounded-3xl border-border bg-card p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    {admin.ownerName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    ID: {admin.id}
                  </p>
                </div>
              </div>

              <Badge
                className={`text-[10px] uppercase font-bold ${
                  admin.role === "super_owner" || admin.role === "SUPER_ADMIN"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {admin.role.replace(/_/g, " ")}
              </Badge>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password:</span>
                <span className="font-bold text-primary">{admin.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground">{admin.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="text-xs text-emerald-600 font-semibold">
                ● Active Session
              </span>
              {admin.role !== "super_owner" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    deletePartner(admin.id);
                    toast.success(`Admin user ${admin.id} deleted.`);
                  }}
                  className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Revoke Access
                </Button>
              )}
            </div>
          </Card>
        )}
      />

      {/* Add Admin Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleCreateAdmin}>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-bold">
                Create Admin Operator Account
              </DialogTitle>
              <DialogDescription className="text-xs">
                Issue credentials with granular operational role access.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Admin Login ID *
                </Label>
                <Input
                  required
                  placeholder="e.g. order_manager_1"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="rounded-xl font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Password *</Label>
                <Input
                  required
                  placeholder="Enter strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Full Name *</Label>
                  <Input
                    required
                    placeholder="Operator Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Role Tier</Label>
                  <Select
                    value={role}
                    onValueChange={(val: any) => setRole(val)}
                  >
                    <SelectTrigger className="rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">SUPER ADMIN</SelectItem>
                      <SelectItem value="ADMIN">GENERAL ADMIN</SelectItem>
                      <SelectItem value="ORDER_MANAGER">
                        ORDER MANAGER
                      </SelectItem>
                      <SelectItem value="SUPPORT_AGENT">
                        SUPPORT AGENT
                      </SelectItem>
                      <SelectItem value="FINANCE_MANAGER">
                        FINANCE MANAGER
                      </SelectItem>
                      <SelectItem value="CONTENT_MANAGER">
                        CONTENT MANAGER
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs"
              >
                Create Admin User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

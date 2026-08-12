import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Phone,
  RefreshCw,
  Shield,
  Store,
  Users,
  XCircle,
  Package,
  Activity,
  HeartPulse,
  Wrench,
  CreditCard,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AdminLayout from "../components/AdminLayout";
import type { Vendor } from "../types";

// Extended vendor type for admin view
interface AdminVendor extends Vendor {
  type: "Shop" | "Driver" | "Service";
  contact: string;
  deactivated?: boolean;
  rejectionReason?: string;
}

const seedVendors = (): AdminVendor[] => [
  {
    id: 1,
    businessName: "Sharma Kirana Store",
    ownerName: "Ramesh Sharma",
    category: "Grocery",
    city: "Mumbai",
    address: "12, Andheri West Market",
    phone: "9876543210",
    status: "approved",
    rating: 4.5,
    totalOrders: 340,
    joinedAt: "2025-10-15",
    type: "Shop",
    contact: "9876543210",
  },
  {
    id: 2,
    businessName: "Nair Ayurveda Pharma",
    ownerName: "Krishnan Nair",
    category: "Pharmacy",
    city: "Thiruvananthapuram",
    address: "45, East Fort Road",
    phone: "9845012345",
    status: "approved",
    rating: 4.8,
    totalOrders: 215,
    joinedAt: "2025-11-02",
    type: "Shop",
    contact: "9845012345",
  },
  {
    id: 3,
    businessName: "Patel Fresh Vegetables",
    ownerName: "Hasmukh Patel",
    category: "Fresh Produce",
    city: "Surat",
    address: "Old Vegetable Market, Ring Road",
    phone: "9712200100",
    status: "pending",
    rating: 0,
    totalOrders: 0,
    joinedAt: "2026-04-12",
    type: "Shop",
    contact: "9712200100",
  },
  {
    id: 6,
    businessName: "Arvind Auto Rides",
    ownerName: "Arvind Kumar",
    category: "Transport",
    city: "Bengaluru",
    address: "Koramangala",
    phone: "9900112233",
    status: "pending",
    rating: 0,
    totalOrders: 0,
    joinedAt: "2026-04-13",
    type: "Driver",
    contact: "9900112233",
  },
  {
    id: 7,
    businessName: "CleanHome Services",
    ownerName: "Deepa Joshi",
    category: "Home Services",
    city: "Pune",
    address: "Kothrud",
    phone: "9988776655",
    status: "pending",
    rating: 0,
    totalOrders: 0,
    joinedAt: "2026-04-11",
    type: "Service",
    contact: "9988776655",
  },
];

function typeIcon(type: AdminVendor["type"]) {
  if (type === "Driver") return <Car className="w-4 h-4 text-secondary" />;
  if (type === "Service") return <Users className="w-4 h-4 text-accent" />;
  return <Store className="w-4 h-4 text-primary" />;
}

function typeBg(type: AdminVendor["type"]) {
  if (type === "Driver") return "bg-secondary/10";
  if (type === "Service") return "bg-accent/10";
  return "bg-primary/10";
}

export default function AdminPage() {
  const routerState = useRouterState();
  const searchParams = new URLSearchParams(routerState.location.search as string);
  const tab = searchParams.get("tab") || "overview";

  return (
    <AdminLayout title={getTitleForTab(tab)}>
      <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
        {tab === "overview" && <OverviewTab />}
        {tab === "verification" && <VerificationTab />}
        {tab !== "overview" && tab !== "verification" && <PlaceholderTab tab={tab} />}
      </div>
    </AdminLayout>
  );
}

function getTitleForTab(tab: string) {
  switch (tab) {
    case "overview": return "Platform Overview";
    case "users": return "Manage Users";
    case "vendors": return "Vendors & Partners";
    case "catalog": return "Product Catalog";
    case "orders": return "Orders & Bookings";
    case "healthcare": return "Healthcare Network";
    case "transport": return "Transport & Vehicles";
    case "services": return "Workers & Services";
    case "payments": return "Payments & Settlements";
    case "feedback": return "Reviews & Complaints";
    case "verification": return "Partner Verification";
    case "reports": return "Analytics & Reports";
    case "promotions": return "Promotions & Offers";
    case "settings": return "Platform Settings";
    default: return "Admin Dashboard";
  }
}

// ─── OVERVIEW TAB ──────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹2.4M" change="+12%" icon={CreditCard} color="text-green-600" bg="bg-green-100" />
        <StatCard title="Active Users" value="24,800" change="+5%" icon={Users} color="text-blue-600" bg="bg-blue-100" />
        <StatCard title="Active Partners" value="1,240" change="+18%" icon={Store} color="text-purple-600" bg="bg-purple-100" />
        <StatCard title="Pending Verifications" value="3" change="Urgent" icon={Shield} color="text-orange-600" bg="bg-orange-100" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityRow label="New user registrations" value="+145 today" />
              <ActivityRow label="Orders processed" value="3,420 today" />
              <ActivityRow label="Service bookings" value="890 today" />
              <ActivityRow label="Ride requests" value="4,120 today" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AlertRow message="High traffic in Bangalore cluster" type="warning" />
              <AlertRow message="Payment gateway latency detected" type="error" />
              <AlertRow message="3 partners require KYC verification" type="info" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color, bg }: any) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="font-display font-bold text-2xl text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground font-medium">{change}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0 border-border">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  );
}

function AlertRow({ message, type }: any) {
  const colors = {
    warning: "text-orange-600 bg-orange-100",
    error: "text-red-600 bg-red-100",
    info: "text-blue-600 bg-blue-100"
  };
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-2 h-2 rounded-full ${colors[type as keyof typeof colors].split(" ")[0].replace("text", "bg")}`} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// ─── PLACEHOLDER TAB ───────────────────────────────────────────────────────

function PlaceholderTab({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Settings className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-display font-semibold text-xl text-foreground mb-2 capitalize">
        {tab.replace("-", " ")} Management
      </h3>
      <p className="text-sm text-muted-foreground max-w-md">
        This module is currently connected to the Ezy1 Backend API. Live data will populate here once the backend canister is fully deployed.
      </p>
      <Button variant="outline" className="mt-6" disabled>
        <RefreshCw className="w-4 h-4 mr-2" /> Syncing Data...
      </Button>
    </div>
  );
}

// ─── VERIFICATION TAB ──────────────────────────────────────────────────────

function VerificationTab() {
  const [allVendors, setAllVendors] = useState<AdminVendor[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [pendingApprove, setPendingApprove] = useState<AdminVendor | null>(null);
  const [pendingReject, setPendingReject] = useState<AdminVendor | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");
  const [resubmitTarget, setResubmitTarget] = useState<AdminVendor | null>(null);

  // Fetch from backend
  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/partner-applications");
      const data = await res.json();
      const mapped = data.map((app: any) => ({
        id: app.id,
        businessName: app.business_name,
        ownerName: app.owner_name,
        category: app.category,
        city: app.city,
        address: app.address,
        phone: "N/A",
        status: app.status.toLowerCase(),
        rating: 0,
        totalOrders: 0,
        joinedAt: app.created_at,
        type: app.partner_type,
        contact: "N/A",
      }));
      setAllVendors([...mapped, ...seedVendors()]); // keep seed vendors for demo
    } catch (e) {
      console.error(e);
      setAllVendors(seedVendors());
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const pending = allVendors.filter((v) => v.status === "pending");
  const approved = allVendors.filter((v) => v.status === "approved");
  const rejected = allVendors.filter((v) => v.status === "rejected");

  async function handleApprove() {
    if (!pendingApprove) return;
    try {
      await fetch(`http://localhost:3000/api/partner-applications/${pendingApprove.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" })
      });
      setAllVendors((prev) =>
        prev.map((v) => (v.id === pendingApprove.id ? { ...v, status: "approved", deactivated: false } : v))
      );
      toast.success(`${pendingApprove.businessName} approved! Partner Account Activated.`);
    } catch (e) {
      toast.error("Failed to approve");
    }
    setPendingApprove(null);
  }

  async function handleReject() {
    if (!pendingReject) return;
    if (!rejectReason.trim()) {
      setRejectReasonError("Please provide a rejection reason.");
      return;
    }
    try {
      await fetch(`http://localhost:3000/api/partner-applications/${pendingReject.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" })
      });
      setAllVendors((prev) =>
        prev.map((v) => (v.id === pendingReject.id ? { ...v, status: "rejected", rejectionReason: rejectReason.trim() } : v))
      );
      toast.error(`${pendingReject.businessName} rejected.`);
    } catch (e) {
      toast.error("Failed to reject");
    }
    setPendingReject(null);
    setRejectReason("");
    setRejectReasonError("");
  }

  function handleDeactivateToggle(vendor: AdminVendor) {
    const next = !vendor.deactivated;
    setAllVendors((prev) => prev.map((v) => (v.id === vendor.id ? { ...v, deactivated: next } : v)));
    toast(next ? `${vendor.businessName} deactivated` : `${vendor.businessName} reactivated`);
  }

  function handleResubmit(vendor: AdminVendor) {
    setAllVendors((prev) => prev.map((v) => (v.id === vendor.id ? { ...v, status: "pending", rejectionReason: undefined } : v)));
    toast.success(`${vendor.businessName} moved to Pending`);
    setResubmitTarget(null);
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending
            {pending.length > 0 && <Badge className="ml-1 bg-destructive text-destructive-foreground text-xs px-1.5 py-0 h-4 rounded-full">{pending.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="gap-1.5"><XCircle className="w-3.5 h-3.5" /> Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground"><CheckCircle2 className="w-8 h-8 mb-2 opacity-50" /> No pending approvals.</div>
          ) : (
            pending.map((vendor, idx) => (
              <VendorCard key={vendor.id} vendor={vendor} expanded={expandedId === vendor.id} onToggleExpand={() => setExpandedId(expandedId === vendor.id ? null : vendor.id)} actions={
                <div className="flex items-center gap-2">
                  <Button size="sm" className="h-8 bg-primary text-primary-foreground gap-1.5" onClick={() => setPendingApprove(vendor)}><CheckCircle2 className="w-3.5 h-3.5" /> Approve</Button>
                  <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/40 gap-1.5" onClick={() => { setPendingReject(vendor); setRejectReason(""); setRejectReasonError(""); }}><XCircle className="w-3.5 h-3.5" /> Reject</Button>
                </div>
              } />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4 space-y-3">
          {approved.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">No approved vendors yet.</div>
          ) : (
            approved.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} expanded={expandedId === vendor.id} onToggleExpand={() => setExpandedId(expandedId === vendor.id ? null : vendor.id)} actions={
                <div className="flex items-center gap-3">
                  <Badge className={`text-xs ${vendor.deactivated ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary border-primary/20"}`}>{vendor.deactivated ? "Deactivated" : "Active"}</Badge>
                  <Switch checked={!vendor.deactivated} onCheckedChange={() => handleDeactivateToggle(vendor)} />
                </div>
              } />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-3">
          {rejected.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">No rejected vendors.</div>
          ) : (
            rejected.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} expanded={expandedId === vendor.id} onToggleExpand={() => setExpandedId(expandedId === vendor.id ? null : vendor.id)} reasonChip={
                vendor.rejectionReason && (
                  <div className="flex items-start gap-1.5 mt-1.5"><AlertTriangle className="w-3 h-3 text-destructive mt-0.5" /><span className="text-xs text-destructive">{vendor.rejectionReason}</span></div>
                )
              } actions={
                <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => setResubmitTarget(vendor)}><RefreshCw className="w-3.5 h-3.5" /> Resubmit</Button>
              } />
            ))
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!pendingApprove} onOpenChange={() => setPendingApprove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve vendor?</AlertDialogTitle>
            <AlertDialogDescription><strong>{pendingApprove?.businessName}</strong> will be listed on the platform.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-primary text-primary-foreground" onClick={handleApprove}>Yes, Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!pendingReject} onOpenChange={(open) => { if (!open) { setPendingReject(null); setRejectReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject vendor</DialogTitle>
            <DialogDescription>Provide a reason for rejecting <strong>{pendingReject?.businessName}</strong>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Rejection Reason</Label>
            <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            {rejectReasonError && <p className="text-xs text-destructive">{rejectReasonError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingReject(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!resubmitTarget} onOpenChange={() => setResubmitTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Allow resubmission?</AlertDialogTitle>
            <AlertDialogDescription><strong>{resubmitTarget?.businessName}</strong> will be moved back to the Pending queue.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => resubmitTarget && handleResubmit(resubmitTarget)}>Yes, Move to Pending</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function VendorCard({ vendor, expanded, onToggleExpand, actions, reasonChip }: any) {
  return (
    <Card className="border-border">
      <CardContent className="p-0">
        <div className="flex items-start gap-3 p-4">
          <div className={`w-10 h-10 rounded-xl ${typeBg(vendor.type)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            {typeIcon(vendor.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-semibold text-sm">{vendor.businessName}</span>
              <Badge variant="outline" className="text-xs">{vendor.type}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{vendor.ownerName} · {vendor.city}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Phone className="w-3 h-3" /> {vendor.contact}
            </div>
            {reasonChip}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {actions}
            <button type="button" className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground" onClick={onToggleExpand}>
              {expanded ? <>Less <ChevronUp className="w-3 h-3" /></> : <>Details <ChevronDown className="w-3 h-3" /></>}
            </button>
          </div>
        </div>
        {expanded && (
          <div className="border-t border-border bg-muted/30 px-4 py-3 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground text-xs block">Category</span>{vendor.category}</div>
            <div><span className="text-muted-foreground text-xs block">Address</span>{vendor.address}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

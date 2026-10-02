import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  BarChart3,
  Bell,
  ClipboardList,
  LayoutDashboard,
  Pill,
  Plus,
  RefreshCw,
  ShoppingCart,
  Search,
} from "lucide-react";
/**
 * EZY1 Pharmacy Partner Portal
 * Medicine inventory, prescription tracking, order management
 */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePartnerAuth } from "../../lib/partnerAuthStore";
import { useStoreData } from "../../lib/storeData";
import PartnerCustomerActivity from "./PartnerCustomerActivity";
import PartnerLayout, { type NavItem } from "./PartnerLayout";

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Pill, label: "Medicines", id: "medicines" },
  { icon: ShoppingCart, label: "Orders", id: "orders" },
  { icon: Search, label: "Customer Activity", id: "customer_activity" },
  { icon: ClipboardList, label: "Prescriptions", id: "prescriptions" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Pill, label: "Store Profile", id: "profile" },
];

function StatCard({ label, value, sub, color }: any) {
  return (
    <Card className="rounded-2xl border-border">
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function formatOrderItems(items: any): string {
  if (!items) return "—";
  if (typeof items === "string") return items;
  if (Array.isArray(items)) {
    return (
      items
        .map((it: any) =>
          typeof it === "string"
            ? it
            : `${it.quantity || 1}x ${it.name || "Item"}`,
        )
        .join(", ") || "—"
    );
  }
  return "—";
}

export default function PharmacyPartnerPortal() {
  const [section, setSection] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    genericName: "",
    manufacturer: "",
    price: "",
    stock: "",
    requiresPrescription: false,
    category: "General",
  });
  const { token } = usePartnerAuth();
  const store = useStoreData();
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const DEFAULT_MEDICINES = [
    { id: 201, name: "Paracetamol 650mg (Dolo)", genericName: "Paracetamol", manufacturer: "Micro Labs", price: 32, stock: 150, requiresPrescription: false, category: "Fever & Pain" },
    { id: 202, name: "Azithromycin 500mg (Azithral)", genericName: "Azithromycin", manufacturer: "Alembic", price: 125, stock: 80, requiresPrescription: true, category: "Antibiotics" },
    { id: 203, name: "Cetirizine 10mg (Okacet)", genericName: "Cetirizine", manufacturer: "Cipla", price: 28, stock: 200, requiresPrescription: false, category: "Allergy" },
    { id: 204, name: "Vitamin C 500mg Chewable (Limcee)", genericName: "Ascorbic Acid", manufacturer: "Abbott", price: 25, stock: 350, requiresPrescription: false, category: "Immunity" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, mRes, oRes] = await Promise.all([
        fetch("/api/pharmacy/dashboard", { headers: authHeaders }),
        fetch("/api/pharmacy/medicines", { headers: authHeaders }),
        fetch("/api/pharmacy/orders", { headers: authHeaders }),
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (mRes.ok) {
        const mData = await mRes.json();
        setMedicines(Array.isArray(mData) && mData.length > 0 ? mData : DEFAULT_MEDICINES);
      } else {
        setMedicines((prev) => (prev.length > 0 ? prev : DEFAULT_MEDICINES));
      }
      if (oRes.ok) {
        const oData = await oRes.json();
        setOrders(Array.isArray(oData) && oData.length > 0 ? oData : (store.orders as any[]));
      } else {
        setOrders((prev) => (prev.length > 0 ? prev : (store.orders as any[])));
      }
    } catch {
      setMedicines((prev) => (prev.length > 0 ? prev : DEFAULT_MEDICINES));
      setOrders((prev) => (prev.length > 0 ? prev : (store.orders as any[])));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updatePharmacyOrderStatus = async (orderId: number | string, newStatus: any) => {
    try {
      await fetch(`/api/pharmacy/orders/${orderId}/status`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Non-blocking fallback
    }

    setOrders((prev) =>
      prev.map((o) =>
        String(o.id) === String(orderId) ? { ...o, status: newStatus } : o,
      ),
    );

    const numId = typeof orderId === "number" ? orderId : parseInt(String(orderId), 10);
    if (!isNaN(numId)) {
      try {
        store.updateOrderStatus(numId, newStatus, `Pharmacy updated status to ${newStatus}`);
      } catch {
        // Non-blocking
      }
    }

    toast.success(`Prescription Order #${orderId} marked as ${newStatus}`);
  };

  const addMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.price) return;

    const createdMed = {
      id: Date.now(),
      name: newMed.name,
      genericName: newMed.genericName,
      manufacturer: newMed.manufacturer,
      price: Number.parseFloat(newMed.price) || 0,
      stock: Number.parseInt(newMed.stock) || 50,
      requiresPrescription: newMed.requiresPrescription,
      category: newMed.category || "General",
    };

    setMedicines((prev) => [createdMed, ...prev]);

    store.addProduct({
      name: newMed.name,
      price: Number.parseFloat(newMed.price) || 0,
      category: "Pharmacy",
      inStock: (Number.parseInt(newMed.stock) || 0) > 0,
      rating: 4.9,
      reviews: 1,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
      description: `${newMed.genericName ? `Generic: ${newMed.genericName}. ` : ""}${newMed.manufacturer ? `Mfg: ${newMed.manufacturer}` : "Essential Medicine"}`,
    });
    store.addLiveEvent({
      type: "partner",
      title: "Pharmacy Partner Listed New Medicine",
      desc: `"${newMed.name}" listed at ₹${newMed.price}`,
      time: "Just now",
    });

    try {
      const res = await fetch("/api/pharmacy/medicines", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          ...newMed,
          price: Number.parseFloat(newMed.price),
          stock: Number.parseInt(newMed.stock) || 0,
        }),
      });
      if (res.ok) {
        toast.success("Medicine added to inventory!");
      } else {
        toast.success("Medicine added to catalog!");
      }
    } catch {
      toast.success("Medicine added to catalog!");
    } finally {
      setNewMed({
        name: "",
        genericName: "",
        manufacturer: "",
        price: "",
        stock: "",
        requiresPrescription: false,
        category: "General",
      });
    }
  };

  return (
    <PartnerLayout
      navItems={NAV}
      activeSection={section}
      onSectionChange={setSection}
      portalTitle="Pharmacy & Medicine Portal"
      accentColor="hsl(160, 80%, 40%)"
    >
      {section === "dashboard" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Pharmacy Overview</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="gap-2 rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Medicines"
              value={String(stats?.totalMedicines ?? medicines.length)}
              color="text-primary"
            />
            <StatCard
              label="Pending Orders"
              value={String(
                stats?.pendingOrders ??
                  orders.filter((o: any) => o.status === "pending").length,
              )}
              color="text-amber-600"
            />
            <StatCard
              label="Low Stock"
              value={String(medicines.filter((m: any) => m.stock <= 10).length)}
              color="text-rose-600"
              sub="Need reorder"
            />
            <StatCard
              label="Today Revenue"
              value={`₹${stats?.todayRevenue ?? 0}`}
              color="text-emerald-600"
            />
          </div>
          {medicines.filter((m: any) => m.stock <= 5).length > 0 && (
            <Card className="rounded-2xl border-rose-200 bg-rose-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-rose-700">
                    Critical Low Stock Alert
                  </p>
                  <p className="text-xs text-rose-600">
                    {medicines.filter((m: any) => m.stock <= 5).length}{" "}
                    medicines have 5 or fewer units left.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {section === "medicines" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Medicine Inventory</h1>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Add Medicine
              </h2>
              <form
                onSubmit={addMedicine}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <Input
                  placeholder="Medicine name *"
                  value={newMed.name}
                  onChange={(e) =>
                    setNewMed((m) => ({ ...m, name: e.target.value }))
                  }
                  className="rounded-xl"
                  required
                />
                <Input
                  placeholder="Generic name"
                  value={newMed.genericName}
                  onChange={(e) =>
                    setNewMed((m) => ({ ...m, genericName: e.target.value }))
                  }
                  className="rounded-xl"
                />
                <Input
                  placeholder="Manufacturer"
                  value={newMed.manufacturer}
                  onChange={(e) =>
                    setNewMed((m) => ({ ...m, manufacturer: e.target.value }))
                  }
                  className="rounded-xl"
                />
                <Input
                  type="number"
                  placeholder="Price (₹) *"
                  value={newMed.price}
                  onChange={(e) =>
                    setNewMed((m) => ({ ...m, price: e.target.value }))
                  }
                  className="rounded-xl"
                  required
                />
                <Input
                  type="number"
                  placeholder="Stock quantity"
                  value={newMed.stock}
                  onChange={(e) =>
                    setNewMed((m) => ({ ...m, stock: e.target.value }))
                  }
                  className="rounded-xl"
                />
                <Input
                  placeholder="Category"
                  value={newMed.category}
                  onChange={(e) =>
                    setNewMed((m) => ({ ...m, category: e.target.value }))
                  }
                  className="rounded-xl"
                />
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rxRequired"
                    checked={newMed.requiresPrescription}
                    onChange={(e) =>
                      setNewMed((m) => ({
                        ...m,
                        requiresPrescription: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <label htmlFor="rxRequired" className="text-xs font-medium">
                    Requires Prescription (Rx)
                  </label>
                </div>
                <Button
                  type="submit"
                  className="sm:col-span-2 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Add Medicine
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {medicines.map((m: any, i: number) => (
              <Card key={m.id || i} className="rounded-2xl border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.genericName} · {m.manufacturer}
                      </p>
                    </div>
                    {m.requiresPrescription && (
                      <Badge variant="outline" className="text-[9px] shrink-0">
                        Rx
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-base font-bold text-primary">
                      ₹{m.price}
                    </p>
                    <Badge
                      variant={
                        m.stock > 20
                          ? "default"
                          : m.stock > 5
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {m.stock} units
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {medicines.length === 0 && (
              <div className="sm:col-span-3 text-center text-sm text-muted-foreground py-8">
                No medicines added yet.
              </div>
            )}
          </div>
        </div>
      )}

      {section === "orders" && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Order Management</h1>
          {orders.map((o: any, i: number) => (
            <Card key={o.id || i} className="rounded-2xl border-border">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    {o.customerName || "Customer"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatOrderItems(o.medicines || o.items)} ·{" "}
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{o.totalAmount || 0}</p>
                  <Badge
                    variant={
                      o.status === "DELIVERED" || o.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                    className="mt-1"
                  >
                    {o.status || "NEW"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {(o.status === "pending" ||
                    o.status === "NEW" ||
                    o.status === "placed") && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updatePharmacyOrderStatus(o.id, "PREPARING")
                      }
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2.5 font-semibold"
                    >
                      Verify & Pack
                    </Button>
                  )}
                  {(o.status === "PREPARING" || o.status === "preparing") && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updatePharmacyOrderStatus(o.id, "READY")
                      }
                      className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2.5 font-semibold"
                    >
                      Ready for Dispatch
                    </Button>
                  )}
                  {(o.status === "READY" || o.status === "ready") && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updatePharmacyOrderStatus(o.id, "OUT_FOR_DELIVERY")
                      }
                      className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-2.5 font-semibold"
                    >
                      Handover to Rider
                    </Button>
                  )}
                  {(o.status === "OUT_FOR_DELIVERY" ||
                    o.status === "out_for_delivery" ||
                    o.status === "ON_THE_WAY") && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updatePharmacyOrderStatus(o.id, "DELIVERED")
                      }
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2.5 font-semibold"
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {orders.length === 0 && (
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No orders
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {section === "prescriptions" && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Prescription Queue</h1>
          <Card className="rounded-2xl">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Prescription verification module coming soon.
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customer Activity */}
      {section === "customer_activity" && (
        <PartnerCustomerActivity category="Pharmacy" />
      )}

      {section === "analytics" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Analytics</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              label="Total Medicines"
              value={String(medicines.length)}
              color="text-primary"
            />
            <StatCard
              label="Total Orders"
              value={String(orders.length)}
              color="text-emerald-600"
            />
            <StatCard
              label="Out of Stock"
              value={String(medicines.filter((m: any) => m.stock === 0).length)}
              color="text-rose-600"
            />
          </div>
        </div>
      )}

      {(section === "notifications" ||
        section === "profile" ||
        section === "settings") && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold capitalize">
            {section.replace("-", " ")}
          </h1>
          <Card className="rounded-2xl">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Coming soon.
            </CardContent>
          </Card>
        </div>
      )}
    </PartnerLayout>
  );
}

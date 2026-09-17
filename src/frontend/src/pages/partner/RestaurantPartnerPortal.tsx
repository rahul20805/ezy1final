/**
 * EZY1 Restaurant Partner Portal
 * Menu management, order management, table management for restaurant/cafe/food partners
 */
import { useState, useEffect } from "react";
import PartnerLayout, { type NavItem } from "./PartnerLayout";
import { usePartnerAuth } from "../../lib/partnerAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingCart, Table2,
  BarChart3, Bell, Plus, RefreshCw, Star
} from "lucide-react";
import { toast } from "sonner";

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: UtensilsCrossed, label: "Menu", id: "menu" },
  { icon: ShoppingCart, label: "Orders", id: "orders" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: UtensilsCrossed, label: "Restaurant Profile", id: "profile" },
];

function StatCard({ label, value, color }: any) {
  return (
    <Card className="rounded-2xl border-border">
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

export default function RestaurantPartnerPortal() {
  const [section, setSection] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: "Main Course", isVeg: true, isAvailable: true });
  const { token } = usePartnerAuth();
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, mRes, oRes] = await Promise.all([
        fetch("/api/restaurant/dashboard", { headers: authHeaders }),
        fetch("/api/restaurant/menu", { headers: authHeaders }),
        fetch("/api/restaurant/orders", { headers: authHeaders }),
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (mRes.ok) setMenu(await mRes.json());
      if (oRes.ok) setOrders(await oRes.json());
    } catch { toast.error("Failed to load data"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const addMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    try {
      const res = await fetch("/api/restaurant/menu", {
        method: "POST", headers: authHeaders,
        body: JSON.stringify({ ...newItem, price: parseFloat(newItem.price) }),
      });
      if (res.ok) {
        toast.success("Menu item added!");
        setNewItem({ name: "", description: "", price: "", category: "Main Course", isVeg: true, isAvailable: true });
        fetchData();
      } else { const d = await res.json(); toast.error(d.error || "Failed to add item"); }
    } catch { toast.error("Network error"); }
  };

  return (
    <PartnerLayout navItems={NAV} activeSection={section} onSectionChange={setSection}
      portalTitle="Restaurant & Food Portal" accentColor="hsl(25, 90%, 50%)">

      {section === "dashboard" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Restaurant Overview</h1>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 rounded-xl"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Menu Items" value={String(menu.length)} color="text-primary" />
            <StatCard label="Active Orders" value={String(orders.filter((o: any) => o.status === "preparing" || o.status === "pending").length)} color="text-amber-600" />
            <StatCard label="Today Revenue" value={`₹${stats?.todayRevenue ?? 0}`} color="text-emerald-600" />
            <StatCard label="Avg Rating" value={`${stats?.avgRating ?? "4.5"}★`} color="text-amber-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold mb-3">Active Orders</h2>
            {orders.slice(0, 5).map((o: any, i: number) => (
              <Card key={o.id || i} className="rounded-xl border-border mb-2">
                <CardContent className="p-4 flex items-center gap-4">
                  <ShoppingCart className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{o.customerName || "Customer"} · Table {o.tableNumber || "Takeaway"}</p>
                    <p className="text-xs text-muted-foreground">{o.items || "Items"}</p>
                  </div>
                  <p className="text-sm font-bold">₹{o.totalAmount || 0}</p>
                  <Badge variant={o.status === "delivered" ? "default" : o.status === "preparing" ? "secondary" : "outline"}>{o.status || "pending"}</Badge>
                </CardContent>
              </Card>
            ))}
            {orders.length === 0 && <Card className="rounded-2xl"><CardContent className="p-6 text-center text-sm text-muted-foreground">No orders yet</CardContent></Card>}
          </div>
        </div>
      )}

      {section === "menu" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Menu Management</h1>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Add Menu Item</h2>
              <form onSubmit={addMenuItem} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Item name *" value={newItem.name} onChange={e => setNewItem(m => ({ ...m, name: e.target.value }))} className="rounded-xl" required />
                <Input type="number" placeholder="Price (₹) *" value={newItem.price} onChange={e => setNewItem(m => ({ ...m, price: e.target.value }))} className="rounded-xl" required />
                <Input placeholder="Description" value={newItem.description} onChange={e => setNewItem(m => ({ ...m, description: e.target.value }))} className="rounded-xl" />
                <Input placeholder="Category (Main Course, Starter...)" value={newItem.category} onChange={e => setNewItem(m => ({ ...m, category: e.target.value }))} className="rounded-xl" />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input type="radio" name="veg" checked={newItem.isVeg} onChange={() => setNewItem(m => ({ ...m, isVeg: true }))} /> Veg
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input type="radio" name="veg" checked={!newItem.isVeg} onChange={() => setNewItem(m => ({ ...m, isVeg: false }))} /> Non-Veg
                  </label>
                </div>
                <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">Add to Menu</Button>
              </form>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {menu.map((item: any, i: number) => (
              <Card key={item.id || i} className="rounded-2xl border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-full border-2 ${item.isVeg ? "border-emerald-600 bg-emerald-500" : "border-red-600 bg-red-500"}`} />
                        <p className="text-sm font-semibold">{item.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                      {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-base font-bold text-primary">₹{item.price}</p>
                    <Badge variant={item.isAvailable !== false ? "default" : "secondary"} className="text-[10px]">
                      {item.isAvailable !== false ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {menu.length === 0 && <div className="sm:col-span-3 text-center text-sm text-muted-foreground py-8">No menu items. Add your first dish above.</div>}
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
                  <p className="text-sm font-semibold">{o.customerName || "Customer"}</p>
                  <p className="text-xs text-muted-foreground">{o.items} · {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}</p>
                </div>
                <p className="font-bold text-sm">₹{o.totalAmount || 0}</p>
                <Badge variant={o.status === "delivered" ? "default" : "secondary"}>{o.status || "pending"}</Badge>
              </CardContent>
            </Card>
          ))}
          {orders.length === 0 && <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No orders</CardContent></Card>}
        </div>
      )}

      {section === "analytics" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Restaurant Analytics</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Menu Items" value={String(menu.length)} color="text-primary" />
            <StatCard label="Total Orders" value={String(orders.length)} color="text-emerald-600" />
            <StatCard label="Veg Items" value={String(menu.filter((m: any) => m.isVeg).length)} color="text-emerald-500" />
          </div>
        </div>
      )}

      {(section === "notifications" || section === "profile" || section === "settings") && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold capitalize">{section.replace("-", " ")}</h1>
          <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">Coming soon.</CardContent></Card>
        </div>
      )}
    </PartnerLayout>
  );
}

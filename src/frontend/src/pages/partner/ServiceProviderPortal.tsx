/**
 * EZY1 Service Provider Partner Portal
 * Home & professional services management
 */
import { useState, useEffect } from "react";
import PartnerLayout, { type NavItem } from "./PartnerLayout";
import { usePartnerAuth } from "../../lib/partnerAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard, Wrench, CalendarClock, BarChart3,
  Bell, Plus, RefreshCw, Star
} from "lucide-react";
import { toast } from "sonner";

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Wrench, label: "My Services", id: "services" },
  { icon: CalendarClock, label: "Bookings", id: "bookings" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Wrench, label: "Profile", id: "profile" },
];

export default function ServiceProviderPortal() {
  const [section, setSection] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [newService, setNewService] = useState({ name: "", description: "", price: "", duration: "60", category: "Cleaning" });
  const { token } = usePartnerAuth();
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = async () => {
    try {
      const [sRes, svRes, bRes] = await Promise.all([
        fetch("/api/services/dashboard", { headers: authHeaders }),
        fetch("/api/services/list", { headers: authHeaders }),
        fetch("/api/services/bookings", { headers: authHeaders }),
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (svRes.ok) setServices(await svRes.json());
      if (bRes.ok) setBookings(await bRes.json());
    } catch { toast.error("Failed to load data"); }
  };

  useEffect(() => { fetchData(); }, []);

  const addService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price) return;
    try {
      const res = await fetch("/api/services/list", {
        method: "POST", headers: authHeaders,
        body: JSON.stringify({ ...newService, price: parseFloat(newService.price), duration: parseInt(newService.duration) }),
      });
      if (res.ok) {
        toast.success("Service added!");
        setNewService({ name: "", description: "", price: "", duration: "60", category: "Cleaning" });
        fetchData();
      } else { const d = await res.json(); toast.error(d.error || "Failed"); }
    } catch { toast.error("Network error"); }
  };

  return (
    <PartnerLayout navItems={NAV} activeSection={section} onSectionChange={setSection}
      portalTitle="Home & Professional Services Portal" accentColor="hsl(340, 80%, 55%)">

      {section === "dashboard" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Services Overview</h1>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 rounded-xl"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Services", value: String(services.length), color: "text-primary" },
              { label: "Pending Bookings", value: String(bookings.filter((b: any) => b.status === "pending").length), color: "text-amber-600" },
              { label: "Today Bookings", value: String(stats?.todayBookings ?? 0), color: "text-emerald-600" },
              { label: "Rating", value: `${stats?.avgRating ?? "4.8"}★`, color: "text-amber-500" },
            ].map((s, i) => (
              <Card key={i} className="rounded-2xl border-border">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <h2 className="text-base font-semibold mb-3">Recent Bookings</h2>
            {bookings.slice(0, 5).map((b: any, i: number) => (
              <Card key={b.id || i} className="rounded-xl border-border mb-2">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{b.customerName || "Customer"}</p>
                    <p className="text-xs text-muted-foreground">{b.serviceName} · {b.scheduledDate}</p>
                  </div>
                  <p className="text-sm font-bold">₹{b.amount || 0}</p>
                  <Badge variant={b.status === "completed" ? "default" : "secondary"}>{b.status}</Badge>
                </CardContent>
              </Card>
            ))}
            {bookings.length === 0 && <Card className="rounded-2xl"><CardContent className="p-6 text-center text-sm text-muted-foreground">No bookings yet</CardContent></Card>}
          </div>
        </div>
      )}

      {section === "services" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">My Services</h1>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Add Service</h2>
              <form onSubmit={addService} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Service name *" value={newService.name} onChange={e => setNewService(s => ({ ...s, name: e.target.value }))} className="rounded-xl" required />
                <Input type="number" placeholder="Price (₹) *" value={newService.price} onChange={e => setNewService(s => ({ ...s, price: e.target.value }))} className="rounded-xl" required />
                <Input placeholder="Description" value={newService.description} onChange={e => setNewService(s => ({ ...s, description: e.target.value }))} className="rounded-xl" />
                <Input placeholder="Category (Cleaning, Plumbing...)" value={newService.category} onChange={e => setNewService(s => ({ ...s, category: e.target.value }))} className="rounded-xl" />
                <Input type="number" placeholder="Duration (minutes)" value={newService.duration} onChange={e => setNewService(s => ({ ...s, duration: e.target.value }))} className="rounded-xl" />
                <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">Add Service</Button>
              </form>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((s: any, i: number) => (
              <Card key={s.id || i} className="rounded-2xl border-border">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.category} · {s.duration} min</p>
                  {s.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>}
                  <p className="text-base font-bold text-primary mt-2">₹{s.price}</p>
                </CardContent>
              </Card>
            ))}
            {services.length === 0 && <div className="sm:col-span-2 text-center text-sm text-muted-foreground py-8">No services yet. Add above.</div>}
          </div>
        </div>
      )}

      {section === "bookings" && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Booking Management</h1>
          {bookings.map((b: any, i: number) => (
            <Card key={b.id || i} className="rounded-2xl border-border">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{b.customerName || "Customer"}</p>
                  <p className="text-xs text-muted-foreground">{b.serviceName} · {b.scheduledDate} {b.scheduledTime}</p>
                  {b.address && <p className="text-xs text-muted-foreground">{b.address}</p>}
                </div>
                <p className="font-bold text-sm shrink-0">₹{b.amount || 0}</p>
                <Badge variant={b.status === "completed" ? "default" : "secondary"} className="shrink-0">{b.status}</Badge>
              </CardContent>
            </Card>
          ))}
          {bookings.length === 0 && <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No bookings</CardContent></Card>}
        </div>
      )}

      {section === "analytics" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Analytics</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Services Listed", value: String(services.length), color: "text-primary" },
              { label: "Total Bookings", value: String(bookings.length), color: "text-emerald-600" },
              { label: "Completed", value: String(bookings.filter((b: any) => b.status === "completed").length), color: "text-violet-600" },
            ].map((s, i) => (
              <Card key={i} className="rounded-2xl border-border">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
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

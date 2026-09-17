/**
 * EZY1 Delivery Partner Portal
 * Trip management, earnings, delivery history
 */
import { useState, useEffect } from "react";
import PartnerLayout, { type NavItem } from "./PartnerLayout";
import { usePartnerAuth } from "../../lib/partnerAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard, Truck, IndianRupee, MapPin,
  BarChart3, Bell, RefreshCw, CheckCircle, Clock
} from "lucide-react";
import { toast } from "sonner";

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Truck, label: "My Trips", id: "trips" },
  { icon: IndianRupee, label: "Earnings", id: "earnings" },
  { icon: BarChart3, label: "History", id: "history" },
  { icon: Bell, label: "Notifications", id: "notifications" },
];

export default function DeliveryPartnerPortal() {
  const [section, setSection] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = usePartnerAuth();
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, tRes] = await Promise.all([
        fetch("/api/delivery/dashboard", { headers: authHeaders }),
        fetch("/api/delivery/trips", { headers: authHeaders }),
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (tRes.ok) setTrips(await tRes.json());
    } catch { toast.error("Failed to load data"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <PartnerLayout navItems={NAV} activeSection={section} onSectionChange={setSection}
      portalTitle="Delivery Fleet Portal" accentColor="hsl(280, 80%, 55%)">

      {section === "dashboard" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Fleet Overview</h1>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 rounded-xl"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Today Deliveries", value: String(stats?.todayDeliveries ?? trips.filter((t: any) => t.status === "completed").length), color: "text-primary" },
              { label: "Active Trips", value: String(stats?.activeTrips ?? trips.filter((t: any) => t.status === "in_progress").length), color: "text-amber-600" },
              { label: "Today Earnings", value: `₹${stats?.todayEarnings ?? 0}`, color: "text-emerald-600" },
              { label: "Total Deliveries", value: String(trips.length), color: "text-violet-600" },
            ].map((s, i) => (
              <Card key={i} className="rounded-2xl border-border">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(section === "trips" || section === "history") && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">{section === "trips" ? "My Trips" : "Delivery History"}</h1>
          {trips.map((trip: any, i: number) => (
            <Card key={trip.id || i} className="rounded-2xl border-border">
              <CardContent className="p-5 flex items-center gap-4">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{trip.pickupAddress || "Pickup"} → {trip.deliveryAddress || "Delivery"}</p>
                  <p className="text-xs text-muted-foreground">{trip.customerName} · {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : ""}</p>
                </div>
                <p className="text-sm font-bold shrink-0">₹{trip.earnings || trip.amount || 0}</p>
                <Badge variant={trip.status === "completed" ? "default" : "secondary"} className="shrink-0">{trip.status}</Badge>
              </CardContent>
            </Card>
          ))}
          {trips.length === 0 && <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No trips recorded</CardContent></Card>}
        </div>
      )}

      {section === "earnings" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Earnings</h1>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Today", value: `₹${stats?.todayEarnings ?? 0}`, color: "text-primary" },
              { label: "This Week", value: `₹${stats?.weekEarnings ?? 0}`, color: "text-emerald-600" },
              { label: "This Month", value: `₹${stats?.monthEarnings ?? 0}`, color: "text-violet-600" },
              { label: "Total", value: `₹${stats?.totalEarnings ?? trips.reduce((s: number, t: any) => s + (t.earnings || 0), 0)}`, color: "text-amber-600" },
            ].map((e, i) => (
              <Card key={i} className="rounded-2xl border-border">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground">{e.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${e.color}`}>{e.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(section === "notifications" || section === "settings") && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold capitalize">{section}</h1>
          <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">Coming soon.</CardContent></Card>
        </div>
      )}
    </PartnerLayout>
  );
}

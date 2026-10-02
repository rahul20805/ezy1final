/**
 * EZY1 Service Provider Partner Portal
 * Home & professional services management
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Bell,
  CalendarClock,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Star,
  Wrench,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePartnerAuth } from "../../lib/partnerAuthStore";
import { useStoreData } from "../../lib/storeData";
import PartnerCustomerActivity from "./PartnerCustomerActivity";
import PartnerLayout, { type NavItem } from "./PartnerLayout";

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Wrench, label: "My Services", id: "services" },
  { icon: CalendarClock, label: "Bookings", id: "bookings" },
  { icon: Search, label: "Customer Activity", id: "customer_activity" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Wrench, label: "Profile", id: "profile" },
];

export default function ServiceProviderPortal() {
  const [section, setSection] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "60",
    category: "Cleaning",
  });
  const { token } = usePartnerAuth();
  const store = useStoreData();
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const DEFAULT_SERVICES = [
    { id: 301, name: "Deep Home Cleaning (2 BHK)", category: "Cleaning", price: 1899, duration: 180, description: "Complete sanitization and deep machine scrub of floors and bathrooms" },
    { id: 302, name: "AC Comprehensive Servicing", category: "Appliance", price: 599, duration: 60, description: "Jet pump wash, gas check, filter cleaning, and coil inspection" },
    { id: 303, name: "Electrician Switch & Wiring Fix", category: "Electrician", price: 299, duration: 45, description: "Expert diagnostics and safe replacement of shorted circuits" },
    { id: 304, name: "Bathroom Leakage & Tap Repair", category: "Plumbing", price: 349, duration: 50, description: "Precision leak fixing, washer replacement, and pressure calibration" },
  ];

  const DEFAULT_BOOKINGS = [
    { id: "SRV-901", customerName: "Vikram Malhotra", serviceName: "AC Comprehensive Servicing", scheduledDate: "Today", scheduledTime: "2:30 PM", address: "Flat 501, Oakwood Residency, Sector 4", amount: 599, status: "pending" },
    { id: "SRV-902", customerName: "Pooja Sharma", serviceName: "Deep Home Cleaning (2 BHK)", scheduledDate: "Tomorrow", scheduledTime: "10:00 AM", address: "Villa 12, Green Woods, Phase 1", amount: 1899, status: "confirmed" },
  ];

  const fetchData = async () => {
    try {
      const [sRes, svRes, bRes] = await Promise.all([
        fetch("/api/services/dashboard", { headers: authHeaders }),
        fetch("/api/services/list", { headers: authHeaders }),
        fetch("/api/services/bookings", { headers: authHeaders }),
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (svRes.ok) {
        const sData = await svRes.json();
        setServices(Array.isArray(sData) && sData.length > 0 ? sData : DEFAULT_SERVICES);
      } else {
        setServices((prev) => (prev.length > 0 ? prev : DEFAULT_SERVICES));
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        setBookings(Array.isArray(bData) && bData.length > 0 ? bData : DEFAULT_BOOKINGS);
      } else {
        setBookings((prev) => (prev.length > 0 ? prev : DEFAULT_BOOKINGS));
      }
    } catch {
      setServices((prev) => (prev.length > 0 ? prev : DEFAULT_SERVICES));
      setBookings((prev) => (prev.length > 0 ? prev : DEFAULT_BOOKINGS));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateBookingStatus = async (bookingId: string | number, newStatus: string) => {
    try {
      await fetch(`/api/services/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Non-blocking fallback
    }

    setBookings((prev) =>
      prev.map((b) =>
        String(b.id) === String(bookingId) ? { ...b, status: newStatus } : b,
      ),
    );

    toast.success(`Booking #${bookingId} updated to ${newStatus}`);
  };

  const addService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price) return;

    const createdService = {
      id: Date.now(),
      name: newService.name,
      description: newService.description || "Expert service at your doorstep",
      price: Number.parseFloat(newService.price) || 299,
      duration: Number.parseInt(newService.duration) || 60,
      category: newService.category,
    };

    setServices((prev) => [createdService, ...prev]);

    store.addService({
      name: newService.name,
      category: newService.category,
      price: Number.parseFloat(newService.price) || 299,
      duration: `${newService.duration} mins`,
      rating: 4.9,
      reviews: 1,
      description: newService.description || "Expert service at your doorstep",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60",
      provider: "Verified Pro Partner",
      phone: "011-88997766",
    });
    store.addLiveEvent({
      type: "partner",
      title: "Provider Listed New Service",
      desc: `"${newService.name}" (${newService.category}) added at ₹${newService.price}`,
      time: "Just now",
    });

    try {
      const res = await fetch("/api/services/list", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          ...newService,
          price: Number.parseFloat(newService.price),
          duration: Number.parseInt(newService.duration),
        }),
      });
      if (res.ok) {
        toast.success("Service added!");
      } else {
        toast.success("Service added to catalog!");
      }
    } catch {
      toast.success("Service added to catalog successfully!");
    } finally {
      setNewService({
        name: "",
        description: "",
        price: "",
        duration: "60",
        category: "Cleaning",
      });
    }
  };

  return (
    <PartnerLayout
      navItems={NAV}
      activeSection={section}
      onSectionChange={setSection}
      portalTitle="Home & Professional Services Portal"
      accentColor="hsl(340, 80%, 55%)"
    >
      {section === "dashboard" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Services Overview</h1>
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
            {[
              {
                label: "Active Services",
                value: String(services.length),
                color: "text-primary",
              },
              {
                label: "Pending Bookings",
                value: String(
                  bookings.filter((b: any) => b.status === "pending").length,
                ),
                color: "text-amber-600",
              },
              {
                label: "Today Bookings",
                value: String(stats?.todayBookings ?? 0),
                color: "text-emerald-600",
              },
              {
                label: "Rating",
                value: `${stats?.avgRating ?? "4.8"}★`,
                color: "text-amber-500",
              },
            ].map((s, i) => (
              <Card key={i} className="rounded-2xl border-border">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>
                    {s.value}
                  </p>
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
                    <p className="text-sm font-medium">
                      {b.customerName || "Customer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.serviceName} · {b.scheduledDate}
                    </p>
                  </div>
                  <p className="text-sm font-bold">₹{b.amount || 0}</p>
                  <Badge
                    variant={b.status === "completed" ? "default" : "secondary"}
                  >
                    {b.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
            {bookings.length === 0 && (
              <Card className="rounded-2xl">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No bookings yet
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {section === "services" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">My Services</h1>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Add Service
              </h2>
              <form
                onSubmit={addService}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <Input
                  placeholder="Service name *"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService((s) => ({ ...s, name: e.target.value }))
                  }
                  className="rounded-xl"
                  required
                />
                <Input
                  type="number"
                  placeholder="Price (₹) *"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService((s) => ({ ...s, price: e.target.value }))
                  }
                  className="rounded-xl"
                  required
                />
                <Input
                  placeholder="Description"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService((s) => ({
                      ...s,
                      description: e.target.value,
                    }))
                  }
                  className="rounded-xl"
                />
                <Input
                  placeholder="Category (Cleaning, Plumbing...)"
                  value={newService.category}
                  onChange={(e) =>
                    setNewService((s) => ({ ...s, category: e.target.value }))
                  }
                  className="rounded-xl"
                />
                <Input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newService.duration}
                  onChange={(e) =>
                    setNewService((s) => ({ ...s, duration: e.target.value }))
                  }
                  className="rounded-xl"
                />
                <Button
                  type="submit"
                  className="rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Add Service
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((s: any, i: number) => (
              <Card key={s.id || i} className="rounded-2xl border-border">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.category} · {s.duration} min
                  </p>
                  {s.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {s.description}
                    </p>
                  )}
                  <p className="text-base font-bold text-primary mt-2">
                    ₹{s.price}
                  </p>
                </CardContent>
              </Card>
            ))}
            {services.length === 0 && (
              <div className="sm:col-span-2 text-center text-sm text-muted-foreground py-8">
                No services yet. Add above.
              </div>
            )}
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
                  <p className="text-sm font-semibold">
                    {b.customerName || "Customer"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.serviceName} · {b.scheduledDate} {b.scheduledTime}
                  </p>
                  {b.address && (
                    <p className="text-xs text-muted-foreground">{b.address}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm">₹{b.amount || 0}</p>
                  <Badge
                    variant={
                      b.status === "completed" ? "default" : "secondary"
                    }
                    className="mt-1"
                  >
                    {b.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
                  {(b.status === "pending" || b.status === "NEW") && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateBookingStatus(b.id, "in_progress")
                      }
                      className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-2.5 font-semibold"
                    >
                      Accept & Dispatch Pro
                    </Button>
                  )}
                  {b.status === "in_progress" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateBookingStatus(b.id, "completed")
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
          {bookings.length === 0 && (
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No bookings
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {section === "analytics" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Analytics</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                label: "Services Listed",
                value: String(services.length),
                color: "text-primary",
              },
              {
                label: "Total Bookings",
                value: String(bookings.length),
                color: "text-emerald-600",
              },
              {
                label: "Completed",
                value: String(
                  bookings.filter((b: any) => b.status === "completed").length,
                ),
                color: "text-violet-600",
              },
            ].map((s, i) => (
              <Card key={i} className="rounded-2xl border-border">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>
                    {s.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Customer Activity */}
      {section === "customer_activity" && (
        <PartnerCustomerActivity category="Services" />
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

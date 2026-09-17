/**
 * EZY1 Hospital Partner Portal
 * Self-service management portal for Hospital/Clinic/Healthcare partners
 */
import { useState, useEffect } from "react";
import PartnerLayout, { type NavItem } from "./PartnerLayout";
import { usePartnerAuth } from "../../lib/partnerAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard, Building2, Users, BedDouble, CalendarClock,
  BarChart3, Bell, Plus, RefreshCw, Stethoscope, User
} from "lucide-react";
import { toast } from "sonner";

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: BedDouble, label: "Bed Management", id: "beds" },
  { icon: Users, label: "Doctors", id: "doctors" },
  { icon: CalendarClock, label: "Appointments", id: "appointments" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Building2, label: "Hospital Profile", id: "profile" },
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

export default function HospitalPartnerPortal() {
  const [section, setSection] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [beds, setBeds] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "", qualification: "", fee: "" });
  const { token } = usePartnerAuth();
  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, bRes, dRes, aRes] = await Promise.all([
        fetch("/api/hospital/dashboard", { headers: authHeaders }),
        fetch("/api/hospital/beds", { headers: authHeaders }),
        fetch("/api/hospital/doctors", { headers: authHeaders }),
        fetch("/api/hospital/appointments", { headers: authHeaders }),
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (bRes.ok) setBeds(await bRes.json());
      if (dRes.ok) setDoctors(await dRes.json());
      if (aRes.ok) setAppointments(await aRes.json());
    } catch { toast.error("Failed to load data"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleBedStatus = async (bedId: number, currentStatus: string) => {
    const newStatus = currentStatus === "available" ? "occupied" : "available";
    try {
      const res = await fetch(`/api/hospital/beds/${bedId}/status`, {
        method: "PUT", headers: authHeaders,
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { toast.success(`Bed marked as ${newStatus}`); fetchData(); }
    } catch { toast.error("Failed to update bed"); }
  };

  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.specialty) return;
    try {
      const res = await fetch("/api/hospital/doctors", {
        method: "POST", headers: authHeaders,
        body: JSON.stringify({ ...newDoctor, fee: parseFloat(newDoctor.fee) || 0 }),
      });
      if (res.ok) {
        toast.success("Doctor added successfully!");
        setNewDoctor({ name: "", specialty: "", qualification: "", fee: "" });
        fetchData();
      } else { const d = await res.json(); toast.error(d.error || "Failed to add doctor"); }
    } catch { toast.error("Network error"); }
  };

  return (
    <PartnerLayout navItems={NAV} activeSection={section} onSectionChange={setSection}
      portalTitle="Hospital & Healthcare Portal" accentColor="hsl(200, 90%, 50%)">

      {/* Dashboard */}
      {section === "dashboard" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Hospital Overview</h1>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 rounded-xl">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Beds" value={String(stats?.totalBeds ?? beds.length)} color="text-primary" />
            <StatCard label="Available Beds" value={String(stats?.availableBeds ?? beds.filter(b => b.status === "available").length)} color="text-emerald-600" />
            <StatCard label="Today Appointments" value={String(stats?.todayAppointments ?? appointments.length)} color="text-amber-600" />
            <StatCard label="Active Doctors" value={String(stats?.activeDoctors ?? doctors.length)} color="text-violet-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold mb-3">Recent Appointments</h2>
            {appointments.slice(0, 5).map((a: any, i: number) => (
              <Card key={a.id || i} className="rounded-xl border-border mb-2">
                <CardContent className="p-4 flex items-center gap-4">
                  <CalendarClock className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.patientName || "Patient"}</p>
                    <p className="text-xs text-muted-foreground">{a.doctorName} · {a.appointmentDate}</p>
                  </div>
                  <Badge variant={a.status === "confirmed" ? "default" : "secondary"}>{a.status}</Badge>
                </CardContent>
              </Card>
            ))}
            {appointments.length === 0 && <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No appointments yet</CardContent></Card>}
          </div>
        </div>
      )}

      {/* Bed Management */}
      {section === "beds" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Bed Management</h1>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 rounded-xl"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
          </div>
          {beds.length === 0 ? (
            <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No beds registered. Contact EZY1 admin to configure.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {beds.map((bed: any, i: number) => (
                <Card key={bed.id || i} className={`rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${bed.status === "available" ? "border-emerald-500/50 bg-emerald-500/5" : "border-rose-500/50 bg-rose-500/5"}`}
                  onClick={() => toggleBedStatus(bed.id, bed.status)}>
                  <CardContent className="p-4 text-center">
                    <BedDouble className={`w-6 h-6 mx-auto mb-1 ${bed.status === "available" ? "text-emerald-600" : "text-rose-600"}`} />
                    <p className="text-xs font-bold">{bed.bedNumber || `Bed ${i + 1}`}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{bed.ward || "General"}</p>
                    <Badge className={`mt-1.5 text-[9px] ${bed.status === "available" ? "bg-emerald-600" : "bg-rose-600"}`}>
                      {bed.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Doctors */}
      {section === "doctors" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Doctor Management</h1>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Add New Doctor</h2>
              <form onSubmit={addDoctor} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Doctor name *" value={newDoctor.name} onChange={e => setNewDoctor(d => ({ ...d, name: e.target.value }))} className="rounded-xl" required />
                <Input placeholder="Specialty *" value={newDoctor.specialty} onChange={e => setNewDoctor(d => ({ ...d, specialty: e.target.value }))} className="rounded-xl" required />
                <Input placeholder="Qualification (MBBS, MD...)" value={newDoctor.qualification} onChange={e => setNewDoctor(d => ({ ...d, qualification: e.target.value }))} className="rounded-xl" />
                <Input type="number" placeholder="Consultation fee (₹)" value={newDoctor.fee} onChange={e => setNewDoctor(d => ({ ...d, fee: e.target.value }))} className="rounded-xl" />
                <Button type="submit" className="sm:col-span-2 rounded-xl bg-primary text-primary-foreground font-semibold">Add Doctor</Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {doctors.map((doc: any, i: number) => (
              <Card key={doc.id || i} className="rounded-xl border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">Dr. {doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty} · {doc.qualification}</p>
                  </div>
                  {doc.fee > 0 && <p className="text-sm font-bold text-primary shrink-0">₹{doc.fee}</p>}
                  <Badge variant={doc.isAvailable ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {doc.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
            {doctors.length === 0 && <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No doctors added yet</CardContent></Card>}
          </div>
        </div>
      )}

      {/* Appointments */}
      {section === "appointments" && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Appointment Management</h1>
          {appointments.map((a: any, i: number) => (
            <Card key={a.id || i} className="rounded-2xl border-border">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{a.patientName || "Patient"}</p>
                  <p className="text-xs text-muted-foreground">Dr. {a.doctorName} · {a.appointmentDate} {a.appointmentTime}</p>
                  {a.notes && <p className="text-xs text-muted-foreground mt-1">Note: {a.notes}</p>}
                </div>
                <Badge variant={a.status === "confirmed" ? "default" : a.status === "pending" ? "secondary" : "outline"}>{a.status}</Badge>
              </CardContent>
            </Card>
          ))}
          {appointments.length === 0 && <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">No appointments scheduled</CardContent></Card>}
        </div>
      )}

      {/* Analytics */}
      {section === "analytics" && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Hospital Analytics</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Appointments" value={String(appointments.length)} color="text-primary" />
            <StatCard label="Total Doctors" value={String(doctors.length)} color="text-violet-600" />
            <StatCard label="Bed Occupancy" value={beds.length > 0 ? `${Math.round((beds.filter(b => b.status === "occupied").length / beds.length) * 100)}%` : "0%"} color="text-amber-600" />
          </div>
        </div>
      )}

      {(section === "notifications" || section === "profile" || section === "settings") && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold capitalize">{section.replace("-", " ")}</h1>
          <Card className="rounded-2xl"><CardContent className="p-8 text-center text-sm text-muted-foreground">Coming soon. Contact EZY1 support for assistance.</CardContent></Card>
        </div>
      )}
    </PartnerLayout>
  );
}

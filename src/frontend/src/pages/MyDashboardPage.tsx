import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bike,
  BookOpen,
  Briefcase,
  Bus,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Edit2,
  Globe,
  Home,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  Plus,
  Stethoscope,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UserLayout from "../components/UserLayout";
import {
  useAppointments,
  useCurrentUserProfile,
  useRides,
} from "../lib/backend-hooks";
import type { Appointment, RideRequest } from "../types";

// ── Status Badge ─────────────────────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  confirmed: "bg-green-500/10 text-green-700 border-green-500/20",
  completed: "bg-secondary/10 text-secondary border-secondary/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  accepted: "bg-green-500/10 text-green-700 border-green-500/20",
  ongoing: "bg-primary/10 text-primary border-primary/20",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={`text-xs capitalize ${statusStyles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </Badge>
  );
}

const vehicleIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  auto: Car,
  bike: Bike,
  cab: Car,
};

// ── Bookings Tab ─────────────────────────────────────────────────────────────
function BookingsTab() {
  const { data: appointments, isLoading: apptLoading } = useAppointments();
  const { data: rides, isLoading: ridesLoading } = useRides();

  const isLoading = apptLoading || ridesLoading;

  type BookingItem =
    | { kind: "appointment"; data: Appointment }
    | { kind: "ride"; data: RideRequest };

  const bookings: BookingItem[] = [
    ...(appointments ?? []).map(
      (a): BookingItem => ({ kind: "appointment", data: a }),
    ),
    ...(rides ?? []).map((r): BookingItem => ({ kind: "ride", data: r })),
  ].sort((a, b) => {
    const dateA = a.kind === "appointment" ? a.data.date : a.data.requestedAt;
    const dateB = b.kind === "appointment" ? b.data.date : b.data.requestedAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const isActive = (status: string) =>
    ["pending", "confirmed", "accepted", "ongoing"].includes(status);

  function handleCancel(id: string) {
    toast.success(`Booking #${id} cancellation requested.`);
  }

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="bookings.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-muted-foreground"
        data-ocid="bookings.empty_state"
      >
        <BookOpen className="w-12 h-12 mb-4 text-muted-foreground/40" />
        <p className="font-medium">No bookings yet</p>
        <p className="text-sm mt-1">
          Your appointments and rides will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="bookings.list">
      {bookings.map((item, idx) => {
        if (item.kind === "appointment") {
          const a = item.data;
          return (
            <Card
              key={`appt-${a.id}`}
              className="border-border"
              data-ocid={`bookings.item.${idx + 1}`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Stethoscope className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display font-semibold text-foreground text-sm">
                        {a.doctorName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.specialty}
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {a.date} · {a.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IndianRupee className="w-3 h-3" />₹{a.fee}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs text-muted-foreground"
                    >
                      Healthcare
                    </Badge>
                  </div>
                </div>
                {isActive(a.status) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs px-2 flex-shrink-0"
                    onClick={() => handleCancel(String(a.id))}
                    data-ocid={`bookings.cancel_button.${idx + 1}`}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        }

        const r = item.data;
        const VehicleIcon = vehicleIcons[r.vehicleType] ?? Bus;
        return (
          <Card
            key={`ride-${r.id}`}
            className="border-border"
            data-ocid={`bookings.item.${idx + 1}`}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <VehicleIcon className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-display font-semibold text-foreground text-sm capitalize">
                      {r.vehicleType} Ride
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {r.from} → {r.to}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {r.distance} km
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <IndianRupee className="w-3 h-3" />₹{r.fare}
                  </span>
                  {r.driverName && (
                    <span className="text-xs text-muted-foreground">
                      Driver: {r.driverName}
                    </span>
                  )}
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    Transport
                  </Badge>
                </div>
              </div>
              {isActive(r.status) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs px-2 flex-shrink-0"
                  onClick={() => handleCancel(String(r.id))}
                  data-ocid={`bookings.cancel_button.${idx + 1}`}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Saved Addresses Tab ───────────────────────────────────────────────────────
type AddressType = "home" | "work" | "custom";

interface SavedAddress {
  id: number;
  type: AddressType;
  label: string;
  address: string;
}

const addressIcons: Record<
  AddressType,
  React.ComponentType<{ className?: string }>
> = {
  home: Home,
  work: Briefcase,
  custom: MapPin,
};

const addressColors: Record<AddressType, string> = {
  home: "bg-primary/10 text-primary",
  work: "bg-secondary/10 text-secondary",
  custom: "bg-accent/10 text-accent",
};

const initialAddresses: SavedAddress[] = [
  {
    id: 1,
    type: "home",
    label: "Home",
    address: "34, Indiranagar 1st Cross, Bengaluru, Karnataka 560038",
  },
  {
    id: 2,
    type: "work",
    label: "Office",
    address: "Embassy Tech Village, Bellandur, Bengaluru, Karnataka 560103",
  },
  {
    id: 3,
    type: "custom",
    label: "Mom's Place",
    address: "12A, Rajajinagar, Bengaluru, Karnataka 560010",
  },
];

function AddressesTab() {
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState<AddressType>("custom");
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");

  function startEdit(addr: SavedAddress) {
    setEditingId(addr.id);
    setEditText(addr.address);
  }

  function saveEdit(id: number) {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, address: editText } : a)),
    );
    setEditingId(null);
    toast.success("Address updated");
  }

  function deleteAddress(id: number) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed");
  }

  function addAddress() {
    if (!newAddress.trim()) {
      toast.error("Please enter an address");
      return;
    }
    const label =
      newLabel.trim() ||
      (newType === "home" ? "Home" : newType === "work" ? "Work" : "Custom");
    setAddresses((prev) => [
      ...prev,
      { id: Date.now(), type: newType, label, address: newAddress.trim() },
    ]);
    setNewType("custom");
    setNewLabel("");
    setNewAddress("");
    setShowAdd(false);
    toast.success("Address saved");
  }

  return (
    <div className="space-y-3" data-ocid="addresses.section">
      {addresses.map((addr, idx) => {
        const Icon = addressIcons[addr.type];
        const colorClass = addressColors[addr.type];
        return (
          <Card
            key={addr.id}
            className="border-border"
            data-ocid={`addresses.item.${idx + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground mb-0.5">
                    {addr.label}
                  </div>
                  {editingId === addr.id ? (
                    <div className="space-y-2 mt-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="text-sm"
                        data-ocid={`addresses.edit_input.${idx + 1}`}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => saveEdit(addr.id)}
                          data-ocid={`addresses.save_button.${idx + 1}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => setEditingId(null)}
                          data-ocid={`addresses.cancel_button.${idx + 1}`}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {addr.address}
                    </p>
                  )}
                </div>
                {editingId !== addr.id && (
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(addr)}
                      data-ocid={`addresses.edit_button.${idx + 1}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteAddress(addr.id)}
                      data-ocid={`addresses.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {showAdd ? (
        <Card
          className="border-primary/30 bg-primary/5"
          data-ocid="addresses.add_form"
        >
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold text-sm text-foreground">
              Add New Address
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select
                  value={newType}
                  onValueChange={(v) => setNewType(v as AddressType)}
                >
                  <SelectTrigger
                    className="h-9 text-sm"
                    data-ocid="addresses.type_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">🏠 Home</SelectItem>
                    <SelectItem value="work">💼 Work</SelectItem>
                    <SelectItem value="custom">📍 Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Label (optional)</Label>
                <Input
                  placeholder="e.g. Gym, School"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="h-9 text-sm"
                  data-ocid="addresses.label_input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Full Address</Label>
              <Input
                placeholder="Street, Area, City, State, PIN"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="text-sm"
                data-ocid="addresses.address_input"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gap-1 text-xs"
                onClick={addAddress}
                data-ocid="addresses.submit_button"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save Address
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setShowAdd(false)}
                data-ocid="addresses.cancel_add_button"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full border-dashed gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => setShowAdd(true)}
          data-ocid="addresses.add_button"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </Button>
      )}
    </div>
  );
}

// ── Profile Tab ───────────────────────────────────────────────────────────────
const LANGUAGES = [
  "English",
  "Hindi",
  "Kannada",
  "Tamil",
  "Telugu",
  "Marathi",
  "Bengali",
  "Gujarati",
];

function ProfileTab() {
  const { data: user, isLoading } = useCurrentUserProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Amit Verma",
    email: "amit.verma@email.com",
    phone: "9876543210",
    city: "Bengaluru",
    language: "English",
  });

  function handleEdit() {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        language: "English",
      });
    }
    setEditing(true);
  }

  function handleSave() {
    setEditing(false);
    toast.success("Profile updated successfully");
  }

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="profile.loading_state">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const profileFields = [
    { icon: User, label: "Full Name", key: "name" as const, type: "text" },
    {
      icon: Mail,
      label: "Email Address",
      key: "email" as const,
      type: "email",
    },
    { icon: Phone, label: "Phone Number", key: "phone" as const, type: "tel" },
    { icon: MapPin, label: "City", key: "city" as const, type: "text" },
  ];

  return (
    <div className="space-y-4" data-ocid="profile.section">
      {/* Avatar card */}
      <Card className="border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-display font-black text-2xl flex-shrink-0 shadow-elevated">
            {form.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-foreground text-lg">
              {form.name}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {form.city}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Member since September 2025
            </div>
          </div>
          {!editing && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 flex-shrink-0"
              onClick={handleEdit}
              data-ocid="profile.edit_button"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Info form */}
      <Card className="border-border" data-ocid="profile.info_card">
        <CardContent className="p-4 space-y-4">
          {profileFields.map(({ icon: Icon, label, key, type }) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Label>
              {editing ? (
                <Input
                  type={type}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                  className="text-sm"
                  data-ocid={`profile.${key}_input`}
                />
              ) : (
                <div className="text-sm font-medium text-foreground bg-muted/30 rounded-lg px-3 py-2">
                  {form[key]}
                </div>
              )}
            </div>
          ))}

          <Separator />

          {/* Language */}
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
              <Globe className="w-3.5 h-3.5" />
              Preferred Language
            </Label>
            {editing ? (
              <Select
                value={form.language}
                onValueChange={(v) => setForm((p) => ({ ...p, language: v }))}
              >
                <SelectTrigger
                  className="text-sm"
                  data-ocid="profile.language_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm font-medium text-foreground bg-muted/30 rounded-lg px-3 py-2">
                {form.language}
              </div>
            )}
          </div>

          {editing && (
            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1 gap-1.5"
                onClick={handleSave}
                data-ocid="profile.save_button"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditing(false)}
                data-ocid="profile.cancel_button"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MyDashboardPage() {
  return (
    <UserLayout title="My Account">
      <div className="max-w-2xl mx-auto" data-ocid="my-dashboard.page">
        <Tabs defaultValue="bookings" data-ocid="my-dashboard.tabs">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger
              value="bookings"
              className="gap-1.5 text-xs sm:text-sm"
              data-ocid="my-dashboard.bookings_tab"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bookings &amp; Orders</span>
              <span className="sm:hidden">Bookings</span>
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="gap-1.5 text-xs sm:text-sm"
              data-ocid="my-dashboard.addresses_tab"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved Addresses</span>
              <span className="sm:hidden">Addresses</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="gap-1.5 text-xs sm:text-sm"
              data-ocid="my-dashboard.profile_tab"
            >
              <User className="w-3.5 h-3.5" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" data-ocid="my-dashboard.bookings_panel">
            <BookingsTab />
          </TabsContent>
          <TabsContent
            value="addresses"
            data-ocid="my-dashboard.addresses_panel"
          >
            <AddressesTab />
          </TabsContent>
          <TabsContent value="profile" data-ocid="my-dashboard.profile_panel">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}

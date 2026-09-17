import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserLayout from "../components/UserLayout";
import { RelatedPagesBar } from "../components/RelatedPagesBar";
import { doctors, appointments as initialAppointments } from "../mock-data";
import type { Appointment, Doctor } from "../types";

// ─── Types & Constants ────────────────────────────────────────────────────────

type VisitType = "all" | "clinic" | "home";
type AvailFilter = "all" | "today" | "week";
type SpecFilter =
  | "All"
  | "General"
  | "Cardiology"
  | "Orthopedics"
  | "Dentistry"
  | "Dermatology"
  | "Pediatrics";

const TIME_SLOTS = {
  morning: [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ],
  afternoon: [
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
  ],
  evening: [
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
  ],
};

const SPEC_MAP: Record<SpecFilter, string[]> = {
  All: [],
  General: ["General Physician"],
  Cardiology: ["Cardiologist"],
  Orthopedics: ["Orthopedic"],
  Dentistry: ["Dentist"],
  Dermatology: ["Dermatologist"],
  Pediatrics: ["Pediatrician"],
};

const AVATAR_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-chart-4 text-primary-foreground",
  "bg-chart-5 text-primary-foreground",
];

const STATUS_CONFIG: Record<
  Appointment["status"],
  { label: string; className: string }
> = {
  confirmed: {
    label: "Scheduled",
    className: "bg-secondary/20 text-secondary border-secondary/30",
  },
  pending: {
    label: "Pending",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  completed: {
    label: "Completed",
    className: "bg-muted text-muted-foreground border-border",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= Math.round(rating)
              ? "fill-primary text-primary"
              : "text-border fill-border"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

function DoctorAvatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      className={`w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-lg flex-shrink-0 ${colorClass}`}
    >
      {initials}
    </div>
  );
}

function EmergencySOSButton() {
  return (
    <a href="tel:112" data-ocid="healthcare.sos_button">
      <Button
        className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold shadow-elevated"
        size="sm"
      >
        <AlertTriangle className="w-4 h-4" />
        Emergency SOS
      </Button>
    </a>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────

interface BookingModalProps {
  doctor: Doctor | null;
  open: boolean;
  onClose: () => void;
  onBooked: (appt: Appointment) => void;
}

function BookingModal({ doctor, open, onClose, onBooked }: BookingModalProps) {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [period, setPeriod] = useState<"morning" | "afternoon" | "evening">(
    "morning",
  );
  const [visitType, setVisitType] = useState<"clinic" | "home">("clinic");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  function handleConfirm() {
    if (!date || !timeSlot) {
      toast.error("Please select a date and time slot.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newAppt: Appointment = {
        id: Date.now(),
        doctorId: doctor!.id,
        doctorName: doctor!.name,
        specialty: doctor!.specialty,
        date,
        time: timeSlot,
        status: "confirmed",
        fee: doctor!.fee,
      };
      onBooked(newAppt);
      toast.success("Appointment booked successfully!", {
        description: `${doctor!.name} · ${date} at ${timeSlot}`,
        duration: 5000,
      });
      setDate("");
      setTimeSlot("");
      setNotes("");
      onClose();
    }, 900);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        data-ocid="healthcare.booking_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Book Appointment
          </DialogTitle>
          {doctor && (
            <p className="text-sm text-muted-foreground">
              {doctor.name} · {doctor.specialty} · ₹{doctor.fee}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium" htmlFor="appt-date">
              Select Date
            </Label>
            <input
              id="appt-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="healthcare.date_input"
            />
          </div>

          {/* Time period tabs */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Time Period</Label>
            <div className="flex gap-2">
              {(["morning", "afternoon", "evening"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPeriod(p);
                    setTimeSlot("");
                  }}
                  className={`flex-1 py-1.5 text-xs rounded-lg border font-medium capitalize transition-smooth ${
                    period === p
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-background text-muted-foreground border-input hover:border-secondary/50"
                  }`}
                  data-ocid={`healthcare.period_${p}`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Time slot grid */}
            <div
              className="grid grid-cols-3 gap-1.5"
              data-ocid="healthcare.timeslot_grid"
            >
              {TIME_SLOTS[period].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-1.5 text-xs rounded-lg border transition-smooth ${
                    timeSlot === slot
                      ? "bg-primary text-primary-foreground border-primary font-semibold"
                      : "bg-background text-foreground border-input hover:border-primary/50"
                  }`}
                  data-ocid={`healthcare.slot.${slot.replace(/[: ]/g, "_")}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Visit type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Visit Type</Label>
            <RadioGroup
              value={visitType}
              onValueChange={(v) => setVisitType(v as "clinic" | "home")}
              className="flex gap-4"
              data-ocid="healthcare.visit_type_radio"
            >
              <Label
                htmlFor="vt-clinic"
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <RadioGroupItem value="clinic" id="vt-clinic" />
                <span className="text-sm flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-secondary" /> Clinic
                </span>
              </Label>
              <Label
                htmlFor="vt-home"
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <RadioGroupItem value="home" id="vt-home" />
                <span className="text-sm flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-primary" /> Home Visit
                </span>
              </Label>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium" htmlFor="appt-notes">
              Notes (optional)
            </Label>
            <Textarea
              id="appt-notes"
              placeholder="Describe your symptoms or any special requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none text-sm"
              data-ocid="healthcare.notes_textarea"
            />
          </div>

          {/* Fee summary */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <span className="text-sm text-muted-foreground">
              Consultation Fee
            </span>
            <span className="font-display font-bold text-primary text-base">
              ₹{doctor?.fee}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-ocid="healthcare.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
              onClick={handleConfirm}
              disabled={loading}
              data-ocid="healthcare.confirm_button"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Doctor Card ──────────────────────────────────────────────────────────────

function DoctorCard({
  doctor,
  index,
  onBook,
}: {
  doctor: Doctor;
  index: number;
  onBook: (d: Doctor) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Card
        className="border border-border hover:border-secondary/40 transition-smooth hover:shadow-elevated"
        data-ocid={`healthcare.doctor_card.${index + 1}`}
      >
        <CardContent className="p-4">
          <div className="flex gap-3">
            <DoctorAvatar name={doctor.name} index={index} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-sm text-foreground truncate">
                    {doctor.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs mt-0.5 border-secondary/40 text-secondary bg-secondary/10 px-1.5 py-0"
                  >
                    {doctor.specialty}
                  </Badge>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    doctor.available
                      ? "bg-secondary/15 text-secondary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {doctor.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <StarRating rating={doctor.rating} />
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" /> {doctor.experience} yrs
                    exp
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {doctor.hospital}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {doctor.city}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-muted-foreground">Fee</span>
                  <p className="font-display font-bold text-primary text-base leading-tight">
                    ₹{doctor.fee}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    title="Clinic Visit"
                    className="w-6 h-6 rounded-md bg-secondary/10 flex items-center justify-center"
                  >
                    <Building2 className="w-3.5 h-3.5 text-secondary" />
                  </span>
                  <span
                    title="Home Visit"
                    className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"
                  >
                    <Home className="w-3.5 h-3.5 text-primary" />
                  </span>
                  <Button
                    size="sm"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-xs h-8"
                    disabled={!doctor.available}
                    onClick={() => onBook(doctor)}
                    data-ocid={`healthcare.book_button.${index + 1}`}
                  >
                    Book
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────────────

function AppointmentCard({
  appt,
  index,
  onCancel,
}: {
  appt: Appointment;
  index: number;
  onCancel: (id: number) => void;
}) {
  const cfg = STATUS_CONFIG[appt.status];
  const isUpcoming = appt.status === "confirmed" || appt.status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.07 }}
    >
      <Card
        className="border border-border"
        data-ocid={`healthcare.appointment_card.${index + 1}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-display font-semibold text-sm text-foreground">
                  {appt.doctorName}
                </h4>
                <Badge
                  variant="outline"
                  className={`text-xs px-1.5 py-0 ${cfg.className}`}
                >
                  {cfg.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {appt.specialty}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(appt.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {appt.time}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-display font-bold text-primary text-base">
                ₹{appt.fee}
              </p>
              {isUpcoming && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-7 text-xs text-destructive hover:bg-destructive/10 px-2"
                  onClick={() => onCancel(appt.id)}
                  data-ocid={`healthcare.cancel_appt_button.${index + 1}`}
                >
                  Cancel
                </Button>
              )}
              {appt.status === "completed" && (
                <CheckCircle2 className="w-4 h-4 text-secondary ml-auto mt-1" />
              )}
              {appt.status === "cancelled" && (
                <XCircle className="w-4 h-4 text-destructive ml-auto mt-1" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HealthcarePage() {
  const [specialization, setSpecialization] = useState<SpecFilter>("All");
  const [visitFilter, setVisitFilter] = useState<VisitType>("all");
  const [availFilter, setAvailFilter] = useState<AvailFilter>("all");
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [apptList, setApptList] = useState<Appointment[]>(initialAppointments);
  const [doctorList, setDoctorList] = useState<Doctor[]>(doctors);
  const [hospitalsList, setHospitalsList] = useState<any[]>([]);

  useEffect(() => {
    async function loadDynamicHealthcare() {
      try {
        const docRes = await fetch("/api/doctors");
        if (docRes.ok) {
          const dynamicDocs = await docRes.json();
          if (Array.isArray(dynamicDocs) && dynamicDocs.length > 0) {
            setDoctorList((prev) => {
              const liveIds = new Set(dynamicDocs.map((d: any) => d.id));
              const remaining = prev.filter((d) => !liveIds.has(d.id));
              return [...dynamicDocs, ...remaining];
            });
          }
        }

        const hospRes = await fetch("/api/hospitals");
        if (hospRes.ok) {
          const dynamicHosps = await hospRes.json();
          if (Array.isArray(dynamicHosps)) {
            setHospitalsList(dynamicHosps);
          }
        }
      } catch (err) {
        console.warn("Failed to load dynamic healthcare records, using fallback:", err);
      }
    }
    loadDynamicHealthcare();
  }, []);

  const filteredDoctors = doctorList.filter((d) => {
    const specMatch =
      specialization === "All" ||
      SPEC_MAP[specialization].some((s) =>
        d.specialty.toLowerCase().includes(s.toLowerCase()),
      );
    const availMatch =
      availFilter === "all" || (availFilter === "today" ? d.available : true);
    return specMatch && availMatch;
  });

  const upcomingAppts = apptList.filter(
    (a) => a.status === "confirmed" || a.status === "pending",
  );
  const pastAppts = apptList.filter(
    (a) => a.status === "completed" || a.status === "cancelled",
  );

  function handleBook(doctor: Doctor) {
    setBookingDoctor(doctor);
    setModalOpen(true);
  }

  function handleBooked(appt: Appointment) {
    setApptList((prev) => [appt, ...prev]);
  }

  function handleCancel(id: number) {
    setApptList((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "cancelled" as const } : a,
      ),
    );
    toast.success("Appointment cancelled.");
  }

  return (
    <UserLayout title="Healthcare">
      <RelatedPagesBar domain="healthcare" activeId="pharmacy" className="mb-4 rounded-xl" />
      {/* Floating Emergency SOS on mobile */}
      <div className="fixed bottom-6 right-4 z-50 md:hidden">
        <EmergencySOSButton />
      </div>

      <div className="max-w-4xl mx-auto space-y-5">
        {/* Page header */}
        <div
          className="flex items-center justify-between gap-3 flex-wrap"
          data-ocid="healthcare.page_header"
        >
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground">
              Healthcare
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Book doctors, manage appointments, emergency access
            </p>
          </div>
          <div className="hidden md:block">
            <EmergencySOSButton />
          </div>
        </div>

        {/* Emergency strip */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl border border-destructive/30 bg-destructive/5"
          data-ocid="healthcare.emergency_strip"
        >
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-destructive">
              Medical Emergency?
            </p>
            <p className="text-xs text-muted-foreground">
              Call 112 or tap Emergency SOS for immediate help
            </p>
          </div>
          <a href="tel:108" data-ocid="healthcare.ambulance_link">
            <Button
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5 text-xs flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5" /> 108 Ambulance
            </Button>
          </a>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="doctors" data-ocid="healthcare.tabs">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger
              value="doctors"
              className="flex-1 sm:flex-none"
              data-ocid="healthcare.doctors_tab"
            >
              Find Doctors
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="flex-1 sm:flex-none"
              data-ocid="healthcare.appointments_tab"
            >
              My Appointments
              {upcomingAppts.length > 0 && (
                <Badge className="ml-1.5 text-xs px-1.5 py-0 bg-primary text-primary-foreground">
                  {upcomingAppts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="hospitals"
              className="flex-1 sm:flex-none"
              data-ocid="healthcare.hospitals_tab"
            >
              Hospitals & Bed Status
              {hospitalsList.length > 0 && (
                <Badge className="ml-1.5 text-xs px-1.5 py-0 bg-emerald-600 text-white">
                  Live
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Find Doctors ── */}
          <TabsContent value="doctors" className="mt-4 space-y-4">
            {/* Filter bar */}
            <div
              className="flex flex-wrap gap-2 p-3 rounded-xl bg-card border border-border"
              data-ocid="healthcare.filter_bar"
            >
              <Select
                value={specialization}
                onValueChange={(v) => setSpecialization(v as SpecFilter)}
              >
                <SelectTrigger
                  className="w-full sm:w-48 h-8 text-sm"
                  data-ocid="healthcare.spec_filter_select"
                >
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SPEC_MAP) as SpecFilter[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "All" ? "All Specializations" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Visit type toggle */}
              <div className="flex rounded-lg border border-input overflow-hidden h-8">
                {(["all", "clinic", "home"] as VisitType[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisitFilter(v)}
                    className={`px-3 text-xs capitalize transition-smooth ${
                      visitFilter === v
                        ? "bg-secondary text-secondary-foreground font-semibold"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                    data-ocid={`healthcare.visit_filter.${v}`}
                  >
                    {v === "all"
                      ? "All"
                      : v === "clinic"
                        ? "Clinic"
                        : "Home Visit"}
                  </button>
                ))}
              </div>

              {/* Availability toggle */}
              <div className="flex rounded-lg border border-input overflow-hidden h-8">
                {(["all", "today", "week"] as AvailFilter[]).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvailFilter(a)}
                    className={`px-3 text-xs capitalize transition-smooth ${
                      availFilter === a
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                    data-ocid={`healthcare.avail_filter.${a}`}
                  >
                    {a === "all"
                      ? "All"
                      : a === "today"
                        ? "Today"
                        : "This Week"}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground px-1">
              {filteredDoctors.length} doctor
              {filteredDoctors.length !== 1 ? "s" : ""} found
            </p>

            {filteredDoctors.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="healthcare.doctors_empty_state"
              >
                <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No doctors match your filters</p>
                <p className="text-sm mt-1">
                  Try changing the specialization or availability filters
                </p>
              </div>
            ) : (
              <div
                className="grid gap-3 sm:grid-cols-2"
                data-ocid="healthcare.doctors_list"
              >
                {filteredDoctors.map((doc, i) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    index={i}
                    onBook={handleBook}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── My Appointments ── */}
          <TabsContent value="appointments" className="mt-4 space-y-6">
            {/* Upcoming */}
            <section data-ocid="healthcare.upcoming_section">
              <h3 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Upcoming Appointments
              </h3>
              {upcomingAppts.length === 0 ? (
                <div
                  className="text-center py-10 rounded-xl border border-dashed border-border text-muted-foreground"
                  data-ocid="healthcare.upcoming_empty_state"
                >
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No upcoming appointments</p>
                  <p className="text-xs mt-1">
                    Book a doctor from the Find Doctors tab
                  </p>
                </div>
              ) : (
                <div className="space-y-2" data-ocid="healthcare.upcoming_list">
                  {upcomingAppts.map((a, i) => (
                    <AppointmentCard
                      key={a.id}
                      appt={a}
                      index={i}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            <section data-ocid="healthcare.past_section">
              <h3 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Past Appointments
              </h3>
              {pastAppts.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="healthcare.past_empty_state"
                >
                  <p className="text-sm">No past appointments</p>
                </div>
              ) : (
                <div
                  className="space-y-2 opacity-80"
                  data-ocid="healthcare.past_list"
                >
                  {pastAppts.map((a, i) => (
                    <AppointmentCard
                      key={a.id}
                      appt={a}
                      index={i}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          {/* ── Hospitals & Live Bed Tracking ── */}
          <TabsContent value="hospitals" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitalsList.map((hosp) => (
                <Card key={hosp.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-foreground">{hosp.businessName}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-primary" /> {hosp.address}, {hosp.city}
                        </p>
                      </div>
                      {hosp.hasEmergency24x7 && (
                        <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] whitespace-nowrap">
                          24x7 Emergency
                        </Badge>
                      )}
                    </div>

                    {/* Bed Counts Display */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-muted/40 border border-border/60">
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Available Beds</p>
                        <p className="text-lg font-black text-emerald-600">
                          {hosp.availableBeds ?? "—"} <span className="text-xs font-normal text-muted-foreground">/ {hosp.totalBeds ?? "—"}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">ICU Beds</p>
                        <p className="text-lg font-black text-rose-600">
                          {hosp.icuBedsAvailable ?? "—"}
                        </p>
                      </div>
                    </div>

                    {hosp.departments && (
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase">Key Departments</p>
                        <p className="text-xs text-foreground mt-0.5">{hosp.departments}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        {hosp.openingHours || "24x7"}
                      </div>
                      <a href={`tel:${hosp.emergencyPhone || hosp.phone}`}>
                        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs rounded-xl">
                          <Phone className="w-3 h-3 text-primary" /> Call Hospital
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Modal */}
      <BookingModal
        doctor={bookingDoctor}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onBooked={handleBooked}
      />
    </UserLayout>
  );
}

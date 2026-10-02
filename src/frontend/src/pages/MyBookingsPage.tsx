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
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  MapPin,
  Microscope,
  Phone,
  RotateCcw,
  Stethoscope,
  Wrench,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { useStoreData } from "../lib/storeData";

export interface BookingItem {
  id: string;
  type: "Doctor" | "Hospital Bed" | "Lab Test" | "Service" | "Stay" | "Tour";
  title: string;
  subtitle: string;
  timeSlot: string;
  location: string;
  fee: number;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  phone?: string;
}

const DEFAULT_BOOKINGS: BookingItem[] = [
  {
    id: "EZY-BK-9102",
    type: "Doctor",
    title: "Dr. Priya Sharma (General Physician)",
    subtitle: "Consultation & Health Review",
    timeSlot: "Today, 10:30 AM",
    location: "Apollo Clinic, Bengaluru",
    fee: 300,
    status: "CONFIRMED",
    phone: "+919876543210",
  },
  {
    id: "EZY-BK-8201",
    type: "Lab Test",
    title: "Complete Master Health Checkup",
    subtitle: "Home Sample Collection (Phlebotomist assigned)",
    timeSlot: "Tomorrow, 07:30 AM",
    location: "Home Address • Indiranagar",
    fee: 999,
    status: "CONFIRMED",
    phone: "+919876543210",
  },
  {
    id: "EZY-BK-7303",
    type: "Service",
    title: "Rajesh Kumar (Electrician)",
    subtitle: "Ceiling Fan & Switchboard Repair",
    timeSlot: "12 Apr 2026, 03:00 PM",
    location: "Home Address",
    fee: 250,
    status: "COMPLETED",
    phone: "+919876543210",
  },
];

export default function MyBookingsPage() {
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [bookings, setBookings] = useState<BookingItem[]>(DEFAULT_BOOKINGS);
  const [rescheduleBooking, setRescheduleBooking] = useState<BookingItem | null>(null);
  const [newSlot, setNewSlot] = useState("Tomorrow, 10:00 AM");

  const whatsappNumber = useStoreData((s) => s.settings?.whatsappNumber);

  // Load custom bookings from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ezy1_user_bookings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p) => p.id));
          const rest = DEFAULT_BOOKINGS.filter((d) => !ids.has(d.id));
          setBookings([...parsed, ...rest]);
        }
      }
    } catch {
      // Non-blocking
    }
  }, []);

  const saveBookings = (updated: BookingItem[]) => {
    setBookings(updated);
    try {
      localStorage.setItem("ezy1_user_bookings", JSON.stringify(updated));
    } catch {
      // Non-blocking
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (selectedTab === "All") return true;
      return b.type.toLowerCase().includes(selectedTab.toLowerCase());
    });
  }, [bookings, selectedTab]);

  const handleConfirmReschedule = () => {
    if (!rescheduleBooking) return;
    const updated = bookings.map((b) =>
      b.id === rescheduleBooking.id ? { ...b, timeSlot: newSlot } : b,
    );
    saveBookings(updated);
    toast.success(`Booking ${rescheduleBooking.id} rescheduled to ${newSlot}!`);
    setRescheduleBooking(null);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: "CANCELLED" as const } : b,
    );
    saveBookings(updated);
    toast.info(`Booking ${bookingId} has been cancelled.`);
  };

  const handleContactProvider = (b: BookingItem) => {
    const wa = (whatsappNumber || "919876543210").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello EZY1! I have an enquiry regarding my Booking #${b.id} with ${b.title} scheduled for ${b.timeSlot}.`,
    );
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md">
          <div className="container max-w-4xl py-6 sm:py-8 px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              My Appointments &amp; Bookings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              View upcoming doctor consultations, lab test visits, hospital beds, and home service bookings.
            </p>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-5 overflow-x-auto scrollbar-none touch-pan-x text-xs">
              {["All", "Doctor", "Lab Test", "Service", "Stay", "Tour"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-smooth whitespace-nowrap shrink-0 ${
                    selectedTab === tab
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/70 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="container max-w-4xl py-6 sm:py-8 px-3 sm:px-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border p-8">
              <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-bold text-base text-foreground mb-1">No appointments found</h3>
              <p className="text-xs text-muted-foreground mb-4">
                You have no active bookings in this section.
              </p>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <Card
                key={b.id}
                className="rounded-2xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{b.id}</span>
                      <Badge
                        variant="outline"
                        className="text-[11px] font-semibold bg-primary/5 text-primary border-primary/20"
                      >
                        {b.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === "CONFIRMED" ? (
                        <Badge className="text-xs font-semibold gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmed
                        </Badge>
                      ) : b.status === "COMPLETED" ? (
                        <Badge className="text-xs font-semibold gap-1 bg-muted text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="text-xs font-semibold gap-1 bg-rose-500/10 text-rose-600 border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" />
                          Cancelled
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="py-3 sm:py-4">
                    <h4 className="font-bold text-base text-foreground mb-0.5">{b.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{b.subtitle}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>Slot: {b.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{b.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-sm text-foreground font-display">
                      Fee: ₹{b.fee}
                    </span>

                    <div className="flex items-center gap-2">
                      {b.status === "CONFIRMED" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRescheduleBooking(b);
                              setNewSlot(b.timeSlot);
                            }}
                            className="rounded-xl h-8 px-3 text-xs"
                          >
                            Reschedule
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancelBooking(b.id)}
                            className="rounded-xl h-8 px-2 text-xs text-rose-600 hover:bg-rose-500/10"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactProvider(b)}
                        className="rounded-xl h-8 px-3 text-xs gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Contact</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Reschedule Dialog Modal */}
      {rescheduleBooking && (
        <Dialog open={Boolean(rescheduleBooking)} onOpenChange={() => setRescheduleBooking(null)}>
          <DialogContent className="max-w-md bg-card border-border rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Reschedule {rescheduleBooking.type} Booking
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Select a new slot for {rescheduleBooking.title}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <span className="font-semibold block text-foreground">Available Time Slots:</span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Tomorrow, 10:00 AM - 11:00 AM",
                  "Tomorrow, 02:30 PM - 03:30 PM",
                  "Tomorrow, 05:00 PM - 06:00 PM",
                  "Day After Tomorrow, 11:30 AM",
                  "Day After Tomorrow, 04:00 PM",
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setNewSlot(slot)}
                    className={`p-2.5 rounded-xl border text-left transition-all font-medium ${
                      newSlot === slot
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border bg-card hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    ✓ {slot}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRescheduleBooking(null)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmReschedule}
                className="rounded-xl bg-primary text-primary-foreground font-bold"
              >
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}

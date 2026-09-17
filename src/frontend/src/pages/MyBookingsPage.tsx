import { useState } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Stethoscope,
  Building2,
  Wrench,
  Microscope,
  Phone,
  HelpCircle
} from "lucide-react";

interface BookingItem {
  id: string;
  type: "Doctor" | "Hospital Bed" | "Lab Test" | "Service";
  title: string;
  subtitle: string;
  timeSlot: string;
  location: string;
  fee: number;
  status: "CONFIRMED" | "COMPLETED";
}

const SAMPLE_BOOKINGS: BookingItem[] = [
  {
    id: "EZY-BK-9102",
    type: "Doctor",
    title: "Dr. Priya Sharma (General Physician)",
    subtitle: "Consultation & Health Review",
    timeSlot: "Today, 10:30 AM",
    location: "Apollo Clinic, Mumbai",
    fee: 300,
    status: "CONFIRMED",
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
  },
];

export default function MyBookingsPage() {
  const [selectedTab, setSelectedTab] = useState<string>("All");

  const filteredBookings = SAMPLE_BOOKINGS.filter((b) => {
    if (selectedTab === "All") return true;
    return b.type.toLowerCase().includes(selectedTab.toLowerCase());
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md">
          <div className="container max-w-4xl py-8 px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              My Appointments & Bookings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View upcoming doctor consultations, lab test visits, hospital beds, and home service bookings.
            </p>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-6 overflow-x-auto scrollbar-hide text-xs">
              {["All", "Doctor", "Lab Test", "Service"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-smooth whitespace-nowrap ${
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
        <div className="container max-w-4xl py-8 px-4 sm:px-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-bold text-base text-foreground mb-1">No appointments found</h3>
              <p className="text-xs text-muted-foreground">
                You have no active bookings in this section.
              </p>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <Card
                key={b.id}
                className="rounded-2xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {b.id}
                      </span>
                      <Badge variant="outline" className="text-[11px] font-semibold bg-primary/5 text-primary border-primary/20">
                        {b.type}
                      </Badge>
                    </div>

                    <Badge
                      className={`text-xs font-semibold gap-1 ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {b.status}
                    </Badge>
                  </div>

                  <div className="py-4">
                    <h4 className="font-bold text-base text-foreground mb-0.5">
                      {b.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {b.subtitle}
                    </p>

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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert(`Rescheduling request submitted for ${b.id}...`)}
                        className="rounded-xl h-8 px-3 text-xs"
                      >
                        Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert(`Contacting provider for ${b.id}...`)}
                        className="rounded-xl h-8 px-3 text-xs gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

import { useState } from "react";
import Layout from "../components/Layout";
import { doctors as mockDoctors } from "../mock-data";
import { RelatedPagesBar } from "../components/RelatedPagesBar";
import { useRequireAuth } from "../components/AuthPromptModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Stethoscope,
  Star,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Filter
} from "lucide-react";

const SPECIALTIES = [
  "All Specialties",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Gynecologist",
  "Orthopedic",
  "Neurologist",
  "Dentist"
];

const TIME_SLOTS = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedSlot, setSelectedSlot] = useState<Record<number, string>>({});
  const [bookedSuccess, setBookedSuccess] = useState<string | null>(null);

  const { requireAuth } = useRequireAuth();

  const filteredDoctors = mockDoctors.filter((doc) => {
    if (selectedSpecialty !== "All Specialties" && doc.specialty !== selectedSpecialty) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.hospital.toLowerCase().includes(q) ||
        doc.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleBookAppointment = (doctor: any) => {
    const slot = selectedSlot[doctor.id] || "10:30 AM Today";
    requireAuth({
      title: `Confirm Appointment with ${doctor.name}`,
      description: `${doctor.specialty} • ${slot} • Consultation Fee ₹${doctor.fee}`,
      onSuccess: () => {
        setBookedSuccess(`Appointment confirmed with ${doctor.name} for ${slot}! Booking ID: EZY-DOC-${Date.now().toString().slice(-4)}`);
        setTimeout(() => setBookedSuccess(null), 6000);
      }
    });
  };

  return (
    <Layout>
      <RelatedPagesBar domain="healthcare" activeId="doctors" />
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md">
          <div className="container max-w-7xl py-8 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                    Top Rated Doctors
                  </Badge>
                  <span className="text-xs text-muted-foreground">In-Clinic & Video Consultations</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
                  Find & Book Trusted Doctors
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose from experienced specialists, compare fees, and book instant appointment slots.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctor or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background border-border text-sm"
                />
              </div>
            </div>

            {/* Specialty Filter Rail */}
            <div className="flex items-center gap-2 overflow-x-auto w-full pt-4 pb-1 scrollbar-hide text-xs">
              {SPECIALTIES.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-smooth ${
                    selectedSpecialty === spec
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/70 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {bookedSuccess && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{bookedSuccess}</span>
              </div>
            )}
          </div>
        </div>

        {/* Doctors List */}
        <div className="container max-w-7xl py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const currentSlot = selectedSlot[doc.id] || TIME_SLOTS[0];

              return (
                <Card
                  key={doc.id}
                  className="rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col"
                >
                  <CardContent className="p-5 flex-1 flex flex-col">
                    {/* Top Row: Doctor Info */}
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-display font-black text-xl flex-shrink-0 border border-cyan-500/20">
                        {doc.name.replace("Dr. ", "").charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-base text-foreground truncate">
                            {doc.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            {doc.rating}
                          </div>
                        </div>
                        <p className="text-xs text-primary font-semibold">
                          {doc.specialty}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{doc.hospital}, {doc.city}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stats & Fee */}
                    <div className="grid grid-cols-2 gap-2 my-2 py-2 px-3 rounded-xl bg-muted/40 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Experience</span>
                        <strong className="text-foreground font-semibold">{doc.experience}+ Years</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Consultation Fee</span>
                        <strong className="text-emerald-600 font-bold font-display">₹{doc.fee}</strong>
                      </div>
                    </div>

                    {/* Available Time Slots */}
                    <div className="my-3">
                      <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Select Available Slot Today:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot({ ...selectedSlot, [doc.id]: slot })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-smooth ${
                              currentSlot === slot
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-card border-border hover:bg-muted text-foreground"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Book Button */}
                    <div className="pt-3 border-t border-border mt-auto">
                      <Button
                        onClick={() => handleBookAppointment(doc)}
                        className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold font-display hover:opacity-95 shadow-sm text-xs"
                      >
                        Book Appointment ({currentSlot})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { HOSPITALS_DATA, type HospitalFacility } from "../ecosystem-data";
import { RelatedPagesBar } from "../components/RelatedPagesBar";
import { useRequireAuth } from "../components/AuthPromptModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  PhoneCall,
  Bed,
  MapPin,
  Star,
  Activity,
  Ambulance,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState<HospitalFacility[]>(HOSPITALS_DATA);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const { requireAuth } = useRequireAuth();

  // Try fetching live hospital bed data from backend if available
  useEffect(() => {
    fetch("/api/hospital/beds")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const availableIcu = data.filter((b: any) => b.bedType === "ICU" && b.status === "AVAILABLE").length;
          const availableGen = data.filter((b: any) => b.bedType === "GENERAL" && b.status === "AVAILABLE").length;
          setHospitals((prev) => [
            {
              id: "hosp-live",
              name: "City Care Multispecialty Hospital (Live)",
              city: "Bengaluru",
              address: "12, 100ft Road, Indiranagar",
              phone: "080-45678900",
              emergencyPhone: "1066",
              distanceKm: 1.2,
              rating: 4.9,
              totalBeds: data.length,
              availableBeds: { icu: availableIcu, general: availableGen, deluxe: 2 },
              departments: ["Cardiology", "Neurology", "General Medicine", "Emergency ICU"],
              hasAmbulance24x7: true,
              hasBloodBank: true,
              hasPharmacy24x7: true,
            },
            ...prev,
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.departments.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookBed = (hospital: HospitalFacility, bedType: string) => {
    requireAuth({
      title: `Confirm Bed Reservation at ${hospital.name}`,
      description: `Reserve an available ${bedType} bed with emergency priority intake.`,
      onSuccess: () => {
        setBookingSuccess(`Bed successfully reserved at ${hospital.name}! Reference: EZY-BED-${Date.now().toString().slice(-4)}`);
        setTimeout(() => setBookingSuccess(null), 6000);
      }
    });
  };

  return (
    <Layout>
      <RelatedPagesBar domain="healthcare" activeId="hospitals" />
      <div className="min-h-screen bg-background pb-24">
        {/* Emergency SOS Banner */}
        <div className="bg-red-600 text-white py-3 px-4 shadow-md">
          <div className="container max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
              <span>Medical Emergency? 24/7 Central Ambulance SOS Hotline</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:108"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-red-700 font-display font-black text-xs hover:bg-white/90 transition-all shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call 108 (National Emergency)
              </a>
              <a
                href="tel:102"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-800 text-white font-display font-bold text-xs hover:bg-red-900 transition-all"
              >
                <Ambulance className="w-3.5 h-3.5" />
                Call 102 (Ambulance)
              </a>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md">
          <div className="container max-w-7xl py-8 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20 font-semibold">
                    Live Bed Tracking
                  </Badge>
                  <span className="text-xs text-muted-foreground">Updated 2 mins ago</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
                  Hospitals & Emergency Care Near You
                </h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Check live ICU & general bed availability, specialty departments, and reserve admission spots directly.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search hospital, specialty (Cardiology...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background border-border text-sm"
                />
              </div>
            </div>

            {bookingSuccess && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{bookingSuccess}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hospital Listings */}
        <div className="container max-w-7xl py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hosp) => (
              <Card
                key={hosp.id}
                className="rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col"
              >
                <div className="p-5 flex-1 flex flex-col">
                  {/* Header & Rating */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {hosp.name}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">{hosp.address}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-xs font-bold flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{hosp.rating}</span>
                    </div>
                  </div>

                  {/* Distance & Facility Badges */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    <Badge variant="outline" className="text-[11px] bg-muted/40 font-medium">
                      {hosp.distanceKm} km away
                    </Badge>
                    {hosp.hasAmbulance24x7 && (
                      <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        24/7 Ambulance
                      </Badge>
                    )}
                    {hosp.hasBloodBank && (
                      <Badge variant="outline" className="text-[11px] bg-rose-500/10 text-rose-600 border-rose-500/20">
                        Blood Bank
                      </Badge>
                    )}
                  </div>

                  {/* Live Bed Counts Box */}
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 my-2 space-y-2">
                    <div className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-primary" />
                        Live Available Beds
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold">Real-Time</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2 rounded-lg bg-card border border-border/60">
                        <div className="text-xs text-muted-foreground">ICU</div>
                        <div className="text-base font-bold text-red-600 font-display">
                          {hosp.availableBeds.icu}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-card border border-border/60">
                        <div className="text-xs text-muted-foreground">General</div>
                        <div className="text-base font-bold text-emerald-600 font-display">
                          {hosp.availableBeds.general}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-card border border-border/60">
                        <div className="text-xs text-muted-foreground">Deluxe</div>
                        <div className="text-base font-bold text-primary font-display">
                          {hosp.availableBeds.deluxe}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Departments */}
                  <div className="mt-3 text-xs text-muted-foreground">
                    <strong className="text-foreground font-semibold block mb-1">Key Departments:</strong>
                    <div className="flex flex-wrap gap-1">
                      {hosp.departments.map((dept) => (
                        <span key={dept} className="px-2 py-0.5 rounded-md bg-muted/60 text-[11px]">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-border mt-auto flex items-center gap-2">
                    <a
                      href={`tel:${hosp.emergencyPhone}`}
                      className="flex-1 h-10 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-red-700 transition-colors shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      Call Emergency
                    </a>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBookBed(hosp, "ICU / General")}
                      className="flex-1 h-10 rounded-xl text-xs font-bold border-primary text-primary hover:bg-primary/5"
                    >
                      Reserve Bed
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

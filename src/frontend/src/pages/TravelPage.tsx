import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRequireAuth } from "../components/AuthPromptModal";
import { useAuth } from "../lib/AuthContext";
import { toast } from "sonner";
import {
  Compass,
  MapPin,
  Clock,
  Star,
  Users,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Phone,
  Building,
  Info
} from "lucide-react";

interface TravelPackage {
  id: number;
  title: string;
  agencyName: string;
  agencyPhone: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  itinerary: string;
  includedAmenities: string;
  image: string;
  type: string;
  availableSeats: number;
}

interface ExplorePlace {
  id: number;
  name: string;
  city: string;
  category: string;
  description: string;
  openingHours: string;
  entryFee: number;
  directions: string;
  localTips: string;
  rating: number;
  image: string;
}

export default function TravelPage() {
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [places, setPlaces] = useState<ExplorePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("packages");
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);

  // Booking Form State
  const [travelerName, setTravelerName] = useState(user?.name || "");
  const [travelerPhone, setTravelerPhone] = useState(user?.phone || "");
  const [travelDate, setTravelDate] = useState("This Weekend");
  const [travelersCount, setTravelersCount] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pkgRes, plcRes] = await Promise.all([
          fetch("/api/travel"),
          fetch("/api/explore"),
        ]);
        const pkgData = await pkgRes.json();
        const plcData = await plcRes.json();
        setPackages(Array.isArray(pkgData) ? pkgData : []);
        setPlaces(Array.isArray(plcData) ? plcData : []);
      } catch (err) {
        toast.error("Failed to load travel data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleBookPackage = (pkg: TravelPackage) => {
    requireAuth(() => {
      setSelectedPackage(pkg);
      setBookingSuccess(null);
    });
  };

  const handleConfirmPackageBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    if (!travelerName || !travelerPhone) {
      toast.error("Please enter traveler name and phone.");
      return;
    }

    try {
      setIsSubmitting(true);
      const totalAmount = selectedPackage.price * travelersCount;
      const res = await fetch("/api/travel/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          travelerName,
          travelerPhone,
          travelDate,
          travelersCount,
          totalAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingSuccess(data.booking);
        toast.success("Tour package booked successfully!");
      } else {
        toast.error(data.error || "Failed to book tour");
      }
    } catch (err) {
      toast.error("Booking error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-sky-500/15 via-background to-blue-500/10 border-b border-border py-8 px-4 sm:px-6">
          <div className="container max-w-7xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-500 text-white font-bold text-xs px-2.5 py-0.5">
                ✈️ EZY Travel & Guide
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">
                Tour Packages • Local Guides • Sightseeing • City Secrets
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              Explore City Heritage, Day Trips & Tour Packages
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Curated itineraries from verified travel agencies with certified local guides, guaranteed departures, and authentic local food tours.
            </p>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-2">
              <TabsList className="bg-card border border-border p-1 rounded-xl">
                <TabsTrigger value="packages" className="rounded-lg text-xs font-bold px-4 py-1.5">
                  ✈️ Tour Packages & Sightseeing
                </TabsTrigger>
                <TabsTrigger value="explore" className="rounded-lg text-xs font-bold px-4 py-1.5">
                  🧭 Local Guide & Attractions
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
          {activeTab === "packages" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-500" />
                  Curated Tour Packages ({packages.length})
                </h2>
                <span className="text-xs text-muted-foreground">Certified Agencies</span>
              </div>

              {loading ? (
                <div className="text-center py-12 text-sm text-muted-foreground">Loading tours...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <Card key={pkg.id} className="rounded-3xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col">
                      <div className="relative aspect-video w-full bg-muted">
                        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" loading="lazy" />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm">
                          {pkg.duration}
                        </span>
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-sky-600 text-white text-[10px] font-bold">
                          {pkg.availableSeats} seats left
                        </span>
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-bold text-base text-foreground line-clamp-1">{pkg.title}</h3>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-500" /> {pkg.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>{pkg.destination}</span>
                          <span className="mx-1">•</span>
                          <span className="truncate">{pkg.agencyName}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-muted/40 text-xs space-y-1.5 mb-4">
                          <div>
                            <span className="font-bold text-foreground block text-[11px]">Itinerary:</span>
                            <p className="text-muted-foreground line-clamp-2">{pkg.itinerary}</p>
                          </div>
                          <div>
                            <span className="font-bold text-foreground block text-[11px]">Inclusions:</span>
                            <p className="text-muted-foreground truncate">{pkg.includedAmenities}</p>
                          </div>
                        </div>

                        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">per person</span>
                            <span className="text-lg font-black text-foreground">₹{pkg.price}</span>
                          </div>
                          <Button
                            onClick={() => handleBookPackage(pkg)}
                            className="rounded-xl font-bold text-xs bg-primary text-primary-foreground h-9 px-4"
                          >
                            Book Tour
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
                  <Compass className="w-5 h-5 text-purple-500" />
                  Local Attractions & City Guide ({places.length})
                </h2>
                <span className="text-xs text-muted-foreground">Bengaluru, Karnataka</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {places.map((place) => (
                  <Card key={place.id} className="rounded-3xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth flex flex-col sm:flex-row">
                    <img src={place.image} alt={place.name} className="w-full sm:w-48 h-48 sm:h-auto object-cover bg-muted flex-shrink-0" />
                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                            {place.category.replace("_", " ")}
                          </span>
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                            ★ {place.rating}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-foreground mb-1">{place.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{place.description}</p>
                        
                        <div className="text-[11px] text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                            <span>{place.openingHours}</span>
                            <span className="mx-1">•</span>
                            <span>Fee: {place.entryFee === 0 ? "Free Entry" : `₹${place.entryFee}`}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Info className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span className="italic text-foreground/80">{place.localTips}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Metro & Bus routes available</span>
                        <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg font-bold">
                          Directions ↗
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tour Booking Dialog */}
        <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display font-black text-lg">
                {bookingSuccess ? "Tour Confirmed! 🎒" : `Book ${selectedPackage?.title}`}
              </DialogTitle>
            </DialogHeader>

            {bookingSuccess ? (
              <div className="space-y-4 py-3">
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center space-y-1">
                  <span className="text-xs font-bold text-sky-600 block">Tour Confirmation Pass</span>
                  <span className="text-lg font-mono font-black text-foreground">
                    EZY-TRV-{bookingSuccess.id.toString().padStart(5, "0")}
                  </span>
                  <p className="text-xs text-muted-foreground pt-1">
                    Confirmed for {bookingSuccess.travelerName} ({bookingSuccess.travelersCount} travelers)
                  </p>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <div className="flex justify-between"><span>Tour:</span> <b className="text-foreground">{bookingSuccess.packageTitle}</b></div>
                  <div className="flex justify-between"><span>Travel Date:</span> <b className="text-foreground">{bookingSuccess.travelDate}</b></div>
                  <div className="flex justify-between"><span>Total Amount:</span> <b className="text-foreground font-bold">₹{bookingSuccess.totalAmount}</b></div>
                </div>
                <Button onClick={() => setSelectedPackage(null)} className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleConfirmPackageBooking} className="space-y-3.5 py-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Primary Traveler Name</Label>
                  <Input
                    required
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="Enter traveler name"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Phone Number</Label>
                  <Input
                    required
                    value={travelerPhone}
                    onChange={(e) => setTravelerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Travel Date</Label>
                    <Input
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Travelers Count</Label>
                    <Input
                      type="number"
                      min={1}
                      max={selectedPackage?.availableSeats || 10}
                      value={travelersCount}
                      onChange={(e) => setTravelersCount(Number(e.target.value))}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Fare (Pay at Departure):</span>
                  <span className="text-base font-bold text-foreground">
                    ₹{(selectedPackage?.price || 0) * travelersCount}
                  </span>
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground"
                  >
                    {isSubmitting ? "Confirming..." : "Confirm Tour Booking"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

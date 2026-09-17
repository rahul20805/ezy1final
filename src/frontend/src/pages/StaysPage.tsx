import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRequireAuth } from "../components/AuthPromptModal";
import { useAuth } from "../lib/AuthContext";
import { toast } from "sonner";
import {
  Building,
  MapPin,
  Star,
  Search,
  Wifi,
  Coffee,
  Check,
  Calendar,
  Users,
  BedDouble,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface Hotel {
  id: number;
  name: string;
  type: string;
  city: string;
  address: string;
  rating: number;
  pricePerNight: number;
  originalPrice?: number;
  amenities: string;
  image: string;
  availableRooms: number;
  totalRooms: number;
}

export default function StaysPage() {
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Booking Modal Form State
  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestPhone, setGuestPhone] = useState(user?.phone || "");
  const [checkInDate, setCheckInDate] = useState("Tomorrow");
  const [checkOutDate, setCheckOutDate] = useState("Day after tomorrow");
  const [roomsCount, setRoomsCount] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      let url = "/api/stays";
      const params = new URLSearchParams();
      if (searchCity) params.append("city", searchCity);
      if (selectedType !== "ALL") params.append("type", selectedType);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [selectedType]);

  const handleBookClick = (hotel: Hotel) => {
    requireAuth(() => {
      setSelectedHotel(hotel);
      setBookingSuccess(null);
    });
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;
    if (!guestName || !guestPhone) {
      toast.error("Please enter guest name and phone number.");
      return;
    }

    try {
      setIsSubmitting(true);
      const totalAmount = selectedHotel.pricePerNight * roomsCount;
      const res = await fetch("/api/stays/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: selectedHotel.id,
          guestName,
          guestPhone,
          checkInDate,
          checkOutDate,
          roomsCount,
          totalAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingSuccess(data.booking);
        toast.success("Stay booked successfully!");
        fetchHotels();
      } else {
        toast.error(data.error || "Booking failed");
      }
    } catch (err) {
      toast.error("Error confirming booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-amber-500/15 via-background to-orange-500/10 border-b border-border py-8 px-4 sm:px-6">
          <div className="container max-w-7xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-white font-bold text-xs px-2.5 py-0.5">
                🏨 EZY Stay
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">
                Hotels • Resorts • Homestays • Hostels
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              Book Verified Stays with Instant Confirmation
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Clean rooms, zero hidden charges, transparent check-in policies, and verified guest reviews.
            </p>

            {/* City Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Search by city or area (e.g. Bengaluru, Coorg)..."
                  className="pl-9 h-11 rounded-xl bg-card border-border text-sm"
                  onKeyDown={(e) => e.key === "Enter" && fetchHotels()}
                />
              </div>
              <Button onClick={fetchHotels} className="h-11 px-6 rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                Find Stays
              </Button>
            </div>

            {/* Stay Type Filters */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["ALL", "HOTEL", "HOMESTAY", "HOSTEL", "RESORT"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {type === "ALL" ? "All Accommodations" : type.charAt(0) + type.slice(1).toLowerCase() + "s"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hotel Grid Feed */}
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-500" />
              Available Accommodations ({hotels.length})
            </h2>
            <span className="text-xs text-muted-foreground">Price includes taxes & WiFi</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Loading verified stays...</div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border p-8">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h3 className="font-bold text-base text-foreground">No stays found</h3>
              <p className="text-xs text-muted-foreground mt-1">Try searching for "Bengaluru" or "Coorg".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="rounded-3xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col">
                  <div className="relative aspect-video w-full bg-muted">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm uppercase">
                      {hotel.type}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold">
                      {hotel.availableRooms} rooms left
                    </span>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base text-foreground line-clamp-1">{hotel.name}</h3>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {hotel.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{hotel.address}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hotel.amenities?.split(",").map((amenity, i) => (
                        <span key={i} className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md font-medium">
                          {amenity.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">per night</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-foreground">₹{hotel.pricePerNight}</span>
                          {hotel.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">₹{hotel.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleBookClick(hotel)}
                        className="rounded-xl font-bold text-xs bg-primary text-primary-foreground h-9 px-4"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Booking Dialog */}
        <Dialog open={!!selectedHotel} onOpenChange={() => setSelectedHotel(null)}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display font-black text-lg">
                {bookingSuccess ? "Booking Confirmed! 🎉" : `Book ${selectedHotel?.name}`}
              </DialogTitle>
            </DialogHeader>

            {bookingSuccess ? (
              <div className="space-y-4 py-3">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-600 block">Booking Reference</span>
                  <span className="text-lg font-mono font-black text-foreground">
                    EZY-STAY-{bookingSuccess.id.toString().padStart(5, "0")}
                  </span>
                  <p className="text-xs text-muted-foreground pt-1">
                    Confirmed for {bookingSuccess.guestName} at {bookingSuccess.hotelName}
                  </p>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <div className="flex justify-between"><span>Check-In:</span> <b className="text-foreground">{bookingSuccess.checkInDate}</b></div>
                  <div className="flex justify-between"><span>Check-Out:</span> <b className="text-foreground">{bookingSuccess.checkOutDate}</b></div>
                  <div className="flex justify-between"><span>Total Amount:</span> <b className="text-foreground font-bold">₹{bookingSuccess.totalAmount}</b></div>
                </div>
                <Button onClick={() => setSelectedHotel(null)} className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-3.5 py-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Guest Full Name</Label>
                  <Input
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter guest name"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Phone Number</Label>
                  <Input
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Check-In</Label>
                    <Input
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Check-Out</Label>
                    <Input
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Number of Rooms</Label>
                  <Input
                    type="number"
                    min={1}
                    max={selectedHotel?.availableRooms || 5}
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total to Pay (Pay at Hotel):</span>
                  <span className="text-base font-bold text-foreground">
                    ₹{(selectedHotel?.pricePerNight || 0) * roomsCount}
                  </span>
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground"
                  >
                    {isSubmitting ? "Confirming..." : "Confirm Reservation"}
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

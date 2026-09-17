import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { RelatedPagesBar } from "../components/RelatedPagesBar";
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
  Car,
  MapPin,
  Clock,
  ShieldCheck,
  Users,
  Plus,
  Calendar,
  CheckCircle2,
  Phone
} from "lucide-react";

interface SharedRide {
  id: number;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  sourceCity: string;
  destinationCity: string;
  pickupPoint: string;
  dropPoint: string;
  departureDate: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  farePerSeat: number;
  verifiedStatus: string;
}

export default function ShareRidePage() {
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [rides, setRides] = useState<SharedRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<SharedRide | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Join Ride State
  const [passengerName, setPassengerName] = useState(user?.name || "");
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || "");
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [joinSuccess, setJoinSuccess] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Offer Ride State
  const [newPickup, setNewPickup] = useState("");
  const [newDrop, setNewDrop] = useState("");
  const [newVehicle, setNewVehicle] = useState("Sedan");
  const [newSeats, setNewSeats] = useState(3);
  const [newFare, setNewFare] = useState(120);
  const [newTime, setNewTime] = useState("09:00 AM");

  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/rides/shared");
      const data = await res.json();
      setRides(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load shared rides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleJoinClick = (ride: SharedRide) => {
    requireAuth(() => {
      setSelectedRide(ride);
      setJoinSuccess(null);
    });
  };

  const handleOfferClick = () => {
    requireAuth(() => {
      setIsOfferModalOpen(true);
    });
  };

  const handleConfirmJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRide) return;
    if (!passengerName || !passengerPhone) {
      toast.error("Please enter passenger details");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/rides/shared/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rideId: selectedRide.id,
          passengerName,
          passengerPhone,
          seatsBooked,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setJoinSuccess(data);
        toast.success("Ride seat confirmed!");
        fetchRides();
      } else {
        toast.error(data.error || "Failed to book seat");
      }
    } catch (err) {
      toast.error("Error joining ride");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPickup || !newDrop) {
      toast.error("Please specify pickup and drop points");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/rides/shared", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverName: user?.name || "Verified Member",
          driverPhone: user?.phone || "+91 9845000000",
          vehicleType: newVehicle,
          pickupPoint: newPickup,
          dropPoint: newDrop,
          departureTime: newTime,
          totalSeats: newSeats,
          farePerSeat: newFare,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Ride published successfully!");
        setIsOfferModalOpen(false);
        fetchRides();
      } else {
        toast.error(data.error || "Failed to publish ride");
      }
    } catch (err) {
      toast.error("Error creating ride");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <RelatedPagesBar domain="transport" activeId="share-ride" />
      <div className="min-h-screen bg-background pb-20">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-emerald-500/15 via-background to-teal-500/10 border-b border-border py-8 px-4 sm:px-6">
          <div className="container max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5">
                    🚗 EZY Share Ride
                  </Badge>
                  <span className="text-xs text-muted-foreground font-semibold">
                    Verified Carpool • Split Costs • Eco-Friendly Commute
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
                  Find & Share Daily Rides Across the City
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                  Carpool with verified corporate professionals. Save up to 60% on cab fares and reduce road traffic.
                </p>
              </div>

              <Button onClick={handleOfferClick} className="rounded-xl font-bold text-xs bg-primary text-primary-foreground h-10 px-5 shadow-sm">
                <Plus className="w-4 h-4 mr-1.5" /> Offer a Ride
              </Button>
            </div>
          </div>
        </div>

        {/* Available Rides */}
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-600" />
              Available Shared Rides ({rides.length})
            </h2>
            <span className="text-xs text-muted-foreground">Verified identity & phone checks</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Loading carpools...</div>
          ) : rides.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border p-8">
              <Car className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h3 className="font-bold text-base text-foreground">No shared rides right now</h3>
              <p className="text-xs text-muted-foreground mt-1">Be the first to offer a carpool ride!</p>
              <Button onClick={handleOfferClick} className="mt-4 text-xs rounded-xl font-bold">
                Offer a Ride Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rides.map((ride) => (
                <Card key={ride.id} className="rounded-3xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth flex flex-col">
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Driver & Status */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm text-foreground block">{ride.driverName}</span>
                          <span className="text-[11px] text-muted-foreground">{ride.vehicleType}</span>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 mr-1" /> {ride.verifiedStatus}
                        </Badge>
                      </div>

                      {/* Route */}
                      <div className="p-3 rounded-2xl bg-muted/40 space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="text-[10px] text-muted-foreground block">Pickup</span>
                            <span className="font-medium text-foreground">{ride.pickupPoint}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="text-[10px] text-muted-foreground block">Drop</span>
                            <span className="font-medium text-foreground">{ride.dropPoint}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>{ride.departureTime} ({ride.departureDate})</span>
                        </div>
                        <span className="text-emerald-600 font-bold">{ride.availableSeats} seats left</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">per seat</span>
                        <span className="text-lg font-black text-foreground">₹{ride.farePerSeat}</span>
                      </div>
                      <Button
                        onClick={() => handleJoinClick(ride)}
                        disabled={ride.availableSeats === 0}
                        className="rounded-xl font-bold text-xs bg-primary text-primary-foreground h-9 px-4"
                      >
                        Join Ride
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Join Ride Dialog */}
        <Dialog open={!!selectedRide} onOpenChange={() => setSelectedRide(null)}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display font-black text-lg">
                {joinSuccess ? "Seat Confirmed! 🚗" : `Join Ride with ${selectedRide?.driverName}`}
              </DialogTitle>
            </DialogHeader>

            {joinSuccess ? (
              <div className="space-y-4 py-3">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-600 block">Carpool Confirmation</span>
                  <span className="text-lg font-mono font-black text-foreground">EZY-POOL-#{joinSuccess.bookingId}</span>
                  <p className="text-xs text-muted-foreground pt-1">
                    Pickup: {selectedRide?.pickupPoint} at {selectedRide?.departureTime}
                  </p>
                </div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div className="flex justify-between"><span>Driver:</span> <b className="text-foreground">{selectedRide?.driverName}</b></div>
                  <div className="flex justify-between"><span>Seats:</span> <b className="text-foreground">{seatsBooked}</b></div>
                  <div className="flex justify-between"><span>Total Share:</span> <b className="text-foreground font-bold">₹{joinSuccess.totalFare}</b></div>
                </div>
                <Button onClick={() => setSelectedRide(null)} className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleConfirmJoin} className="space-y-3.5 py-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Passenger Full Name</Label>
                  <Input
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Phone Number</Label>
                  <Input
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Number of Seats</Label>
                  <Input
                    type="number"
                    min={1}
                    max={selectedRide?.availableSeats || 3}
                    value={seatsBooked}
                    onChange={(e) => setSeatsBooked(Number(e.target.value))}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Contribution:</span>
                  <span className="text-base font-bold text-foreground">
                    ₹{(selectedRide?.farePerSeat || 0) * seatsBooked}
                  </span>
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground"
                  >
                    {isSubmitting ? "Confirming..." : "Confirm & Join"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Offer Ride Dialog */}
        <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display font-black text-lg">Offer a Carpool Ride</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateRide} className="space-y-3 py-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Pickup Landmark / Metro</Label>
                <Input
                  required
                  value={newPickup}
                  onChange={(e) => setNewPickup(e.target.value)}
                  placeholder="e.g. Indiranagar Metro Station"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Destination / Office Park</Label>
                <Input
                  required
                  value={newDrop}
                  onChange={(e) => setNewDrop(e.target.value)}
                  placeholder="e.g. Electronic City Phase 1"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Vehicle</Label>
                  <Input
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Departure Time</Label>
                  <Input
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Available Seats</Label>
                  <Input
                    type="number"
                    min={1}
                    max={6}
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Fare Per Seat (₹)</Label>
                  <Input
                    type="number"
                    min={30}
                    value={newFare}
                    onChange={(e) => setNewFare(Number(e.target.value))}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <DialogFooter className="pt-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground"
                >
                  {isSubmitting ? "Publishing..." : "Publish Carpool Ride"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

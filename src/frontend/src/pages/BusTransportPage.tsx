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
  Bus,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
  QrCode,
  Calendar,
  Zap
} from "lucide-react";

interface BusSchedule {
  id: number;
  busNumber: string;
  operatorName: string;
  busType: string;
  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  totalSeats: number;
  availableSeats: number;
  runningStatus: string;
  liveLocation?: string;
  stops: string;
}

export default function BusTransportPage() {
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [buses, setBuses] = useState<BusSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCity, setFromCity] = useState("Bengaluru");
  const [toCity, setToCity] = useState("Mysore");
  const [selectedBus, setSelectedBus] = useState<BusSchedule | null>(null);

  // Seat Selection State
  const [selectedSeats, setSelectedSeats] = useState<string[]>(["S12"]);
  const [passengerName, setPassengerName] = useState(user?.name || "");
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || "");
  const [ticketSuccess, setTicketSuccess] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      let url = "/api/buses";
      const params = new URLSearchParams();
      if (fromCity) params.append("sourceCity", fromCity);
      if (toCity) params.append("destinationCity", toCity);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setBuses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load bus schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleSelectBus = (bus: BusSchedule) => {
    requireAuth(() => {
      setSelectedBus(bus);
      setSelectedSeats(["S12"]);
      setTicketSuccess(null);
    });
  };

  const toggleSeat = (seatNum: string) => {
    if (selectedSeats.includes(seatNum)) {
      if (selectedSeats.length === 1) {
        toast.error("Select at least one seat.");
        return;
      }
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
    } else {
      if (selectedSeats.length >= 4) {
        toast.error("Maximum 4 seats per booking.");
        return;
      }
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  const handleConfirmTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBus) return;
    if (!passengerName || !passengerPhone) {
      toast.error("Please enter passenger details");
      return;
    }

    try {
      setIsSubmitting(true);
      const totalAmount = selectedBus.fare * selectedSeats.length;
      const res = await fetch("/api/buses/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          busId: selectedBus.id,
          passengerName,
          passengerPhone,
          travelDate: "Today",
          seatNumbers: selectedSeats.join(", "),
          totalAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketSuccess(data.booking);
        toast.success("Bus ticket booked!");
        fetchBuses();
      } else {
        toast.error(data.error || "Failed to book ticket");
      }
    } catch (err) {
      toast.error("Booking error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <RelatedPagesBar domain="transport" activeId="bus" />
      <div className="min-h-screen bg-background pb-20">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-blue-500/15 via-background to-cyan-500/10 border-b border-border py-8 px-4 sm:px-6">
          <div className="container max-w-7xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5">
                🚌 EZY Bus
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">
                City Bus • Intercity Volvo • Digital QR Tickets • Live Status
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              Regional Bus Schedules & Instant Seat Booking
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Real-time route schedules, zero booking fees, confirmed seat allocation, and live GPS tracking for state and private carriers.
            </p>

            {/* Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 max-w-2xl">
              <div>
                <Label className="text-[11px] font-bold text-muted-foreground">From</Label>
                <Input
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="Source City..."
                  className="h-10 text-xs rounded-xl bg-card border-border"
                />
              </div>
              <div>
                <Label className="text-[11px] font-bold text-muted-foreground">To</Label>
                <Input
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="Destination City..."
                  className="h-10 text-xs rounded-xl bg-card border-border"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchBuses} className="h-10 w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                  <Search className="w-3.5 h-3.5 mr-1.5" /> Search Buses
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bus List */}
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <Bus className="w-5 h-5 text-blue-600" />
              Available Buses ({buses.length})
            </h2>
            <span className="text-xs text-muted-foreground">Showing verified departures</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Finding running buses...</div>
          ) : buses.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border p-8">
              <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h3 className="font-bold text-base text-foreground">No buses found</h3>
              <p className="text-xs text-muted-foreground mt-1">Try resetting From to "Bengaluru" and To to "Mysore".</p>
              <Button onClick={() => { setFromCity("Bengaluru"); setToCity("Mysore"); fetchBuses(); }} variant="outline" className="mt-4 text-xs rounded-xl">
                Reset Search
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {buses.map((bus) => (
                <Card key={bus.id} className="rounded-3xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Operator & Type */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-foreground">{bus.operatorName}</span>
                          <Badge variant="outline" className="text-[10px] font-bold uppercase">
                            {bus.busType.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Vehicle: {bus.busNumber}</p>
                        {bus.liveLocation && (
                          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold pt-1">
                            <Zap className="w-3 h-3" /> Live GPS: {bus.liveLocation}
                          </div>
                        )}
                      </div>

                      {/* Timings */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <span className="text-lg font-black text-foreground block">{bus.departureTime}</span>
                          <span className="text-xs text-muted-foreground">{bus.sourceCity}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] text-muted-foreground block">{bus.duration}</span>
                          <div className="w-16 h-0.5 bg-border my-1 relative">
                            <ArrowRight className="w-3 h-3 text-muted-foreground absolute top-1/2 -right-1 -translate-y-1/2" />
                          </div>
                          <span className="text-[9px] text-emerald-600 font-bold">{bus.runningStatus}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-lg font-black text-foreground block">{bus.arrivalTime}</span>
                          <span className="text-xs text-muted-foreground">{bus.destinationCity}</span>
                        </div>
                      </div>

                      {/* Price & Book */}
                      <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-muted-foreground block">per seat</span>
                          <span className="text-xl font-black text-foreground">₹{bus.fare}</span>
                          <span className="text-[10px] text-sky-600 block font-semibold">{bus.availableSeats} seats left</span>
                        </div>
                        <Button
                          onClick={() => handleSelectBus(bus)}
                          className="h-10 px-5 rounded-xl font-bold text-xs bg-primary text-primary-foreground"
                        >
                          Select Seats
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-[11px] text-muted-foreground">
                      <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="truncate">Stops: {bus.stops}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Seat Booking Dialog */}
        <Dialog open={!!selectedBus} onOpenChange={() => setSelectedBus(null)}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display font-black text-lg">
                {ticketSuccess ? "Digital Ticket Issued! 🎫" : `Select Seats — ${selectedBus?.operatorName}`}
              </DialogTitle>
            </DialogHeader>

            {ticketSuccess ? (
              <div className="space-y-4 py-3">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center space-y-1">
                  <div className="w-12 h-12 rounded-xl bg-card border border-border mx-auto flex items-center justify-center mb-1">
                    <QrCode className="w-8 h-8 text-foreground" />
                  </div>
                  <span className="text-xs font-bold text-blue-600 block">Boarding Pass & PNR</span>
                  <span className="text-lg font-mono font-black text-foreground">{ticketSuccess.ticketNumber}</span>
                  <p className="text-xs text-muted-foreground pt-1">
                    Passenger: {ticketSuccess.passengerName} • Seats: {ticketSuccess.seatNumbers}
                  </p>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <div className="flex justify-between"><span>Bus:</span> <b className="text-foreground">{ticketSuccess.operatorName} ({ticketSuccess.busNumber})</b></div>
                  <div className="flex justify-between"><span>Route:</span> <b className="text-foreground">{ticketSuccess.sourceCity} → {ticketSuccess.destinationCity}</b></div>
                  <div className="flex justify-between"><span>Departure:</span> <b className="text-foreground">{ticketSuccess.departureTime}</b></div>
                  <div className="flex justify-between"><span>Total Fare:</span> <b className="text-foreground font-bold">₹{ticketSuccess.totalAmount}</b></div>
                </div>
                <Button onClick={() => setSelectedBus(null)} className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleConfirmTicket} className="space-y-4 py-2">
                {/* Visual Seat Map */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold flex justify-between">
                    <span>Choose Seat(s)</span>
                    <span className="text-primary">{selectedSeats.join(", ")}</span>
                  </Label>
                  <div className="grid grid-cols-6 gap-2 p-3 bg-muted/40 rounded-xl">
                    {["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13", "S14", "S15", "S16", "S17", "S18"].map((seat) => {
                      const isSelected = selectedSeats.includes(seat);
                      const isOccupied = ["S2", "S5", "S9"].includes(seat);
                      return (
                        <button
                          key={seat}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => toggleSeat(seat)}
                          className={`h-9 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${
                            isOccupied
                              ? "bg-muted text-muted-foreground/40 cursor-not-allowed"
                              : isSelected
                              ? "bg-primary text-primary-foreground shadow-xs scale-105"
                              : "bg-card border border-border hover:border-primary text-foreground"
                          }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-muted-foreground block text-center">Driver Side ← Front</span>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Passenger Full Name</Label>
                  <Input
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Enter passenger name"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Mobile Phone (For SMS ticket)</Label>
                  <Input
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Fare ({selectedSeats.length} seats):</span>
                  <span className="text-base font-bold text-foreground">
                    ₹{(selectedBus?.fare || 0) * selectedSeats.length}
                  </span>
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground"
                  >
                    {isSubmitting ? "Issuing Ticket..." : "Book & Issue Ticket"}
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

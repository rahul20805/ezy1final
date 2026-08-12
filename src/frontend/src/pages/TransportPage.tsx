import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bus,
  Car,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Search,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserLayout from "../components/UserLayout";
import { busRoutes, rides } from "../mock-data";
import type { BusRoute, RideRequest } from "../types";

// ─── Types ─────────────────────────────────────────────────────────────────

type RideType = "economy" | "premium" | "shared";

interface RideTypeOption {
  id: RideType;
  label: string;
  icon: React.ReactNode;
  description: string;
  basePrice: number;
  eta: string;
}

type TrackingStep = "searching" | "found" | "onway" | "arrived";

interface TrackingState {
  step: TrackingStep;
  driverName: string;
  vehicleType: string;
  plate: string;
  eta: number;
}

type StarRatings = Record<number, number>;

// ─── Constants ─────────────────────────────────────────────────────────────

const RIDE_TYPES: RideTypeOption[] = [
  {
    id: "economy",
    label: "Economy",
    icon: <Car className="w-5 h-5" />,
    description: "Affordable AC cab",
    basePrice: 80,
    eta: "4–6 min",
  },
  {
    id: "premium",
    label: "Premium",
    icon: <Zap className="w-5 h-5" />,
    description: "Luxury sedan",
    basePrice: 180,
    eta: "3–5 min",
  },
  {
    id: "shared",
    label: "Shared / Pooled",
    icon: <Users className="w-5 h-5" />,
    description: "Share & save",
    basePrice: 45,
    eta: "6–9 min",
  },
];

const TRACKING_STEPS: { key: TrackingStep; label: string }[] = [
  { key: "searching", label: "Searching for driver…" },
  { key: "found", label: "Driver Found" },
  { key: "onway", label: "On the Way" },
  { key: "arrived", label: "Arrived" },
];

const MOCK_DRIVERS = [
  { name: "Arjun Rao", vehicleType: "Swift Dzire", plate: "KA 01 AB 1234" },
  { name: "Suresh Kumar", vehicleType: "Honda Amaze", plate: "MH 14 XZ 5678" },
  { name: "Pradeep M.", vehicleType: "Maruti Ertiga", plate: "DL 7C AA 9012" },
];

function trackingStepIndex(step: TrackingStep): number {
  return ["searching", "found", "onway", "arrived"].indexOf(step);
}

// ─── Book a Ride Tab ────────────────────────────────────────────────────────

function BookRideTab() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [rideType, setRideType] = useState<RideType>("economy");
  const [tracking, setTracking] = useState<TrackingState | null>(null);

  const selectedOption = RIDE_TYPES.find((r) => r.id === rideType)!;
  const estimatedFare =
    selectedOption.basePrice + passengers * 10 + (pickup && dropoff ? 20 : 0);

  function handleFindRide() {
    const driver =
      MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)];
    setTracking({
      step: "searching",
      driverName: driver.name,
      vehicleType: driver.vehicleType,
      plate: driver.plate,
      eta: 5,
    });
  }

  useEffect(() => {
    if (!tracking) return;
    const steps: TrackingStep[] = ["searching", "found", "onway", "arrived"];
    const idx = steps.indexOf(tracking.step);
    if (idx < steps.length - 1) {
      const delay = idx === 0 ? 2500 : 3500;
      const t = setTimeout(() => {
        setTracking((prev) =>
          prev
            ? { ...prev, step: steps[idx + 1], eta: Math.max(0, prev.eta - 1) }
            : null,
        );
      }, delay);
      return () => clearTimeout(t);
    }
  }, [tracking]);

  if (tracking) {
    return (
      <div
        className="space-y-5 max-w-lg mx-auto"
        data-ocid="ride.tracking_card"
      >
        <Card className="border-2 border-primary/30 shadow-elevated overflow-hidden">
          <div className="gradient-primary px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-xs font-body uppercase tracking-wider">
                  Live Tracking
                </p>
                <p className="text-primary-foreground font-display font-bold text-xl mt-0.5">
                  ETA: {tracking.eta} min
                </p>
              </div>
              <Navigation className="w-8 h-8 text-primary-foreground/70 animate-pulse" />
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3 bg-muted/60 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Car className="w-5 h-5 text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  {tracking.driverName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tracking.vehicleType} · {tracking.plate}
                </p>
              </div>
              <Badge className="ml-auto bg-secondary/10 text-secondary border-secondary/30 text-xs">
                ★ 4.8
              </Badge>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
              <div className="space-y-4">
                {TRACKING_STEPS.map(({ key, label }) => {
                  const done =
                    trackingStepIndex(tracking.step) > trackingStepIndex(key);
                  const active = tracking.step === key;
                  return (
                    <div
                      key={key}
                      className={`relative flex items-center gap-3 pl-8 transition-smooth ${
                        done
                          ? "opacity-70"
                          : active
                            ? "opacity-100"
                            : "opacity-30"
                      }`}
                      data-ocid={`ride.step.${key}`}
                    >
                      <span className="absolute left-2.5 -translate-x-1/2">
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-secondary" />
                        ) : active ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </span>
                      <span
                        className={`text-sm font-body ${active ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            <Button
              variant="outline"
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={() => setTracking(null)}
              data-ocid="ride.cancel_button"
            >
              Cancel Ride
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <Card data-ocid="ride.booking_card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">
            Where do you want to go?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="pickup"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Pickup Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                id="pickup"
                placeholder="Enter pickup location"
                className="pl-9"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                data-ocid="ride.pickup_input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="dropoff"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Dropoff Location
            </Label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <Input
                id="dropoff"
                placeholder="Enter destination"
                className="pl-9"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                data-ocid="ride.dropoff_input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="rideDate"
                className="text-xs text-muted-foreground uppercase tracking-wide"
              >
                Date
              </Label>
              <Input
                id="rideDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="ride.date_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="rideTime"
                className="text-xs text-muted-foreground uppercase tracking-wide"
              >
                Time
              </Label>
              <Input
                id="rideTime"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                data-ocid="ride.time_input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Passengers
            </Label>
            <div
              className="flex items-center gap-2"
              data-ocid="ride.passengers_selector"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPassengers(n)}
                  className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-smooth ${
                    passengers === n
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-foreground hover:border-primary"
                  }`}
                  data-ocid={`ride.passenger.${n}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ride type selector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
          Choose Ride Type
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RIDE_TYPES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRideType(opt.id)}
              className={`text-left rounded-xl border-2 p-3.5 transition-smooth ${
                rideType === opt.id
                  ? "border-primary bg-primary/5 shadow-elevated"
                  : "border-border bg-card hover:border-primary/40"
              }`}
              data-ocid={`ride.type.${opt.id}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`${rideType === opt.id ? "text-primary" : "text-muted-foreground"}`}
                >
                  {opt.icon}
                </span>
                <span className="font-display font-semibold text-sm text-foreground">
                  {opt.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {opt.description}
              </p>
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-foreground text-sm">
                  ₹{opt.basePrice}
                  <span className="font-normal text-xs text-muted-foreground">
                    +
                  </span>
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {opt.eta}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fare estimate + CTA */}
      <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Estimated Fare</p>
          <p className="font-display font-bold text-xl text-foreground">
            ₹{estimatedFare}
          </p>
        </div>
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-elevated"
          onClick={handleFindRide}
          disabled={!pickup || !dropoff}
          data-ocid="ride.find_button"
        >
          Find Ride
        </Button>
      </div>
    </div>
  );
}

// ─── Bus Schedules Tab ──────────────────────────────────────────────────────

function BusSchedulesTab() {
  const [query, setQuery] = useState("");

  const filtered = busRoutes.filter(
    (r: BusRoute) =>
      query.trim() === "" ||
      r.from.toLowerCase().includes(query.toLowerCase()) ||
      r.to.toLowerCase().includes(query.toLowerCase()) ||
      r.routeNumber.toLowerCase().includes(query.toLowerCase()) ||
      r.operator.toLowerCase().includes(query.toLowerCase()),
  );

  const typeColor: Record<BusRoute["type"], string> = {
    express: "bg-primary/10 text-primary border-primary/30",
    sleeper: "bg-accent/10 text-accent border-accent/30",
    ordinary: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by route, city, or operator…"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-ocid="bus.search_input"
        />
      </div>

      {filtered.length === 0 ? (
        <div
          className="text-center py-14 text-muted-foreground"
          data-ocid="bus.empty_state"
        >
          <Bus className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No routes found</p>
          <p className="text-sm mt-1">
            Try searching for a different city or route
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((route: BusRoute, idx: number) => (
            <Card
              key={route.id}
              className="border border-border hover:border-secondary/40 hover:shadow-elevated transition-smooth"
              data-ocid={`bus.route.item.${idx + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-display font-bold text-sm text-foreground">
                        {route.routeNumber}
                      </span>
                      <Badge
                        className={`text-xs capitalize border ${typeColor[route.type]}`}
                        variant="outline"
                      >
                        {route.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-foreground">
                        {route.from}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold text-foreground">
                        {route.to}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.departure} – {route.arrival}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bus className="w-3 h-3" />
                        {route.operator}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="font-display font-bold text-lg text-foreground">
                      ₹{route.fare}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {route.seats} seats left
                    </p>
                    <Button
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs font-semibold"
                      disabled={route.seats === 0}
                      onClick={() =>
                        toast.success(
                          "Seat booked! Your booking confirmation will arrive shortly.",
                        )
                      }
                      data-ocid={`bus.book_button.${idx + 1}`}
                    >
                      Book Seat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Ride History Tab ───────────────────────────────────────────────────────

function RideHistoryTab() {
  const [ratings, setRatings] = useState<StarRatings>({});

  const statusStyles: Record<RideRequest["status"], string> = {
    completed: "bg-secondary/10 text-secondary border-secondary/30",
    pending: "bg-primary/10 text-primary border-primary/30",
    accepted: "bg-accent/10 text-accent border-accent/30",
    ongoing: "bg-accent/10 text-accent border-accent/30",
    cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {rides.length === 0 ? (
        <div
          className="text-center py-14 text-muted-foreground"
          data-ocid="history.empty_state"
        >
          <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No ride history</p>
          <p className="text-sm mt-1">
            Book your first ride to see history here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rides.map((ride: RideRequest, idx: number) => {
            const dateObj = new Date(ride.requestedAt);
            const formatted = dateObj.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const timeStr = dateObj.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const rideRating = ratings[ride.id] ?? 0;
            const isCompleted = ride.status === "completed";

            return (
              <Card
                key={ride.id}
                className="border border-border"
                data-ocid={`history.ride.item.${idx + 1}`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {formatted} · {timeStr}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-sm text-foreground truncate">
                          {ride.from}
                        </span>
                        <span className="text-muted-foreground text-xs">→</span>
                        <span className="font-semibold text-sm text-foreground truncate">
                          {ride.to}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Badge
                        className={`text-xs capitalize border ${statusStyles[ride.status]}`}
                        variant="outline"
                        data-ocid={`history.status.${idx + 1}`}
                      >
                        {ride.status}
                      </Badge>
                      <p className="font-display font-bold text-base text-foreground">
                        ₹{ride.fare}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="capitalize bg-muted px-2 py-0.5 rounded">
                      {ride.vehicleType}
                    </span>
                    {ride.driverName && (
                      <span className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        {ride.driverName}
                      </span>
                    )}
                    <span>{ride.distance} km</span>
                  </div>

                  {isCompleted && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Rate driver:
                        </span>
                        <div
                          className="flex items-center gap-0.5"
                          data-ocid={`history.rating.${idx + 1}`}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setRatings((prev) => ({
                                  ...prev,
                                  [ride.id]: star,
                                }))
                              }
                              className="transition-smooth hover:scale-110"
                              aria-label={`Rate ${star} star`}
                              data-ocid={`history.star.${idx + 1}.${star}`}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= rideRating
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        {rideRating > 0 && (
                          <span className="text-xs text-primary font-semibold">
                            {rideRating}/5
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function TransportPage() {
  return (
    <UserLayout title="Transport">
      <div className="space-y-6" data-ocid="transport.page">
        {/* Page header */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
              <Bus className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">
                Transport
              </h2>
              <p className="text-sm text-muted-foreground">
                Book rides, check bus schedules, and track your journeys
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="book"
          className="space-y-5"
          data-ocid="transport.tabs"
        >
          <TabsList className="w-full grid grid-cols-3 bg-muted/60">
            <TabsTrigger
              value="book"
              className="font-body text-sm"
              data-ocid="transport.tab.book"
            >
              Book a Ride
            </TabsTrigger>
            <TabsTrigger
              value="bus"
              className="font-body text-sm"
              data-ocid="transport.tab.bus"
            >
              Bus Schedules
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="font-body text-sm"
              data-ocid="transport.tab.history"
            >
              Ride History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book">
            <BookRideTab />
          </TabsContent>

          <TabsContent value="bus">
            <BusSchedulesTab />
          </TabsContent>

          <TabsContent value="history">
            <RideHistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}

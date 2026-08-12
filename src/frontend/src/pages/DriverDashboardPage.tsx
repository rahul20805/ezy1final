import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  CheckCircle,
  IndianRupee,
  MapPin,
  Star,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import VendorLayout from "../components/VendorLayout";

const DRIVER_INFO = {
  name: "Rajesh Kumar",
  vehicleType: "Car",
  vehicleModel: "Maruti Swift",
  plate: "KA 01 MN 4567",
  rating: 4.8,
  totalTrips: 312,
};

const MOCK_RIDE_REQUESTS = [
  {
    id: 1,
    pickup: "Indiranagar",
    dropoff: "Whitefield",
    passengers: 2,
    fare: 220,
    requestedAt: "2 min ago",
  },
  {
    id: 2,
    pickup: "Koramangala 6th Block",
    dropoff: "MG Road Metro",
    passengers: 1,
    fare: 90,
    requestedAt: "5 min ago",
  },
  {
    id: 3,
    pickup: "HSR Layout Sector 2",
    dropoff: "Electronic City Phase 1",
    passengers: 3,
    fare: 310,
    requestedAt: "8 min ago",
  },
];

const RIDE_HISTORY = [
  {
    id: 1,
    passenger: "Priya S.",
    from: "Indiranagar",
    to: "Whitefield",
    date: "Apr 13",
    fare: 220,
    rating: 5,
  },
  {
    id: 2,
    passenger: "Rahul K.",
    from: "Jayanagar",
    to: "Hebbal",
    date: "Apr 12",
    fare: 180,
    rating: 4,
  },
  {
    id: 3,
    passenger: "Meena R.",
    from: "Koramangala",
    to: "MG Road",
    date: "Apr 11",
    fare: 85,
    rating: 5,
  },
  {
    id: 4,
    passenger: "Arjun M.",
    from: "BTM Layout",
    to: "Silk Board",
    date: "Apr 10",
    fare: 60,
    rating: 4,
  },
];

const DAILY_EARNINGS = [
  { day: "Mon", amount: 680 },
  { day: "Tue", amount: 920 },
  { day: "Wed", amount: 540 },
  { day: "Thu", amount: 1100 },
  { day: "Fri", amount: 1350 },
  { day: "Sat", amount: 1600 },
  { day: "Sun", amount: 430 },
];

export default function DriverDashboardPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [rideRequests, setRideRequests] = useState(MOCK_RIDE_REQUESTS);
  const [activeTab, setActiveTab] = useState("active");

  const todayEarnings = DAILY_EARNINGS[5].amount;
  const maxAmount = Math.max(...DAILY_EARNINGS.map((d) => d.amount));

  function handleRideAction(id: number, action: "accept" | "reject") {
    setRideRequests((prev) => prev.filter((r) => r.id !== id));
    if (action === "accept") {
      // In a real app, navigate to active ride screen
    }
  }

  return (
    <VendorLayout title="Driver Dashboard">
      {/* Vehicle info header */}
      <Card
        className="mb-6 border-2 border-secondary/20"
        data-ocid="driver_dashboard.vehicle_card"
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Car className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <div className="font-display font-bold text-base text-foreground">
                  {DRIVER_INFO.vehicleModel}
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {DRIVER_INFO.plate}
                </div>
                <div className="text-xs text-muted-foreground">
                  {DRIVER_INFO.vehicleType} · {DRIVER_INFO.name}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {isOnline ? "Online" : "Offline"}
              </span>
              <Switch
                checked={isOnline}
                onCheckedChange={setIsOnline}
                data-ocid="driver_dashboard.online_toggle"
              />
              <Badge
                className={
                  isOnline
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-muted text-muted-foreground border-border"
                }
              >
                {isOnline ? "● Online" : "○ Offline"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card data-ocid="driver_dashboard.stat.trips">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-2">
              <Car className="w-4 h-4 text-secondary" />
            </div>
            <div className="font-display font-bold text-lg text-foreground">
              {DRIVER_INFO.totalTrips}
            </div>
            <div className="text-xs text-muted-foreground">Total Trips</div>
          </CardContent>
        </Card>
        <Card data-ocid="driver_dashboard.stat.rating">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <div className="font-display font-bold text-lg text-foreground">
              {DRIVER_INFO.rating}
            </div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </CardContent>
        </Card>
        <Card data-ocid="driver_dashboard.stat.today_earnings">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <IndianRupee className="w-4 h-4 text-primary" />
            </div>
            <div className="font-display font-bold text-lg text-foreground">
              ₹{todayEarnings}
            </div>
            <div className="text-xs text-muted-foreground">Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        data-ocid="driver_dashboard.tabs"
      >
        <TabsList className="mb-5">
          <TabsTrigger value="active" data-ocid="driver_dashboard.tab.active">
            Active Rides
            {rideRequests.length > 0 && (
              <Badge className="ml-2 text-xs bg-primary text-primary-foreground border-0 px-1.5 py-0">
                {rideRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" data-ocid="driver_dashboard.tab.history">
            Ride History
          </TabsTrigger>
          <TabsTrigger
            value="earnings"
            data-ocid="driver_dashboard.tab.earnings"
          >
            Earnings
          </TabsTrigger>
        </TabsList>

        {/* Active Rides */}
        <TabsContent value="active">
          {!isOnline && (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="driver_dashboard.offline_state"
            >
              <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-body text-sm">
                You are offline. Toggle online to receive ride requests.
              </p>
            </div>
          )}
          {isOnline && rideRequests.length === 0 && (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="driver_dashboard.no_rides_state"
            >
              <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-body text-sm">
                No pending ride requests right now.
              </p>
            </div>
          )}
          {isOnline && (
            <div className="space-y-4">
              {rideRequests.map((ride, i) => (
                <Card
                  key={ride.id}
                  className="border-2 border-primary/10"
                  data-ocid={`driver_dashboard.ride_request.item.${i + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate">
                            {ride.pickup}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground truncate">
                            {ride.dropoff}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-display font-bold text-base text-primary">
                          ₹{ride.fare}
                        </div>
                        <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground mt-0.5">
                          <Users className="w-3 h-3" />
                          <span>{ride.passengers}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {ride.requestedAt}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1 text-primary border-primary/30 hover:bg-primary/10"
                        onClick={() => handleRideAction(ride.id, "accept")}
                        data-ocid={`driver_dashboard.accept_ride_button.${i + 1}`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleRideAction(ride.id, "reject")}
                        data-ocid={`driver_dashboard.reject_ride_button.${i + 1}`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Ride History */}
        <TabsContent value="history">
          <div className="space-y-3">
            {RIDE_HISTORY.map((ride, i) => (
              <Card
                key={ride.id}
                data-ocid={`driver_dashboard.ride_history.item.${i + 1}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Car className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground">
                      {ride.passenger}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {ride.from} → {ride.to}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ride.date}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-sm text-foreground">
                      ₹{ride.fare}
                    </div>
                    <div className="flex items-center gap-0.5 justify-end mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= ride.rating ? "text-primary fill-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Earnings */}
        <TabsContent value="earnings">
          <Card className="mb-5" data-ocid="driver_dashboard.earnings_chart">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Daily Earnings (This Week)
                </h3>
              </div>
              <div className="flex items-end gap-2 h-36">
                {DAILY_EARNINGS.map((day) => {
                  const height = (day.amount / maxAmount) * 100;
                  const isToday = day.day === "Sat";
                  return (
                    <div
                      key={day.day}
                      className="flex-1 flex flex-col items-center gap-1.5"
                      data-ocid={`driver_dashboard.bar.${day.day.toLowerCase()}`}
                    >
                      <div className="text-xs text-muted-foreground font-mono">
                        ₹
                        {day.amount >= 1000
                          ? `${(day.amount / 1000).toFixed(1)}k`
                          : day.amount}
                      </div>
                      <div
                        className={`w-full rounded-t-lg transition-smooth ${isToday ? "bg-primary" : "bg-secondary/40"}`}
                        style={{ height: `${height}%` }}
                      />
                      <div
                        className={`text-xs font-body ${isToday ? "text-primary font-semibold" : "text-muted-foreground"}`}
                      >
                        {day.day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <Card data-ocid="driver_dashboard.earnings_summary.today">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Today</div>
                <div className="font-display font-bold text-base text-foreground">
                  ₹{todayEarnings}
                </div>
              </CardContent>
            </Card>
            <Card data-ocid="driver_dashboard.earnings_summary.week">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  This Week
                </div>
                <div className="font-display font-bold text-base text-foreground">
                  ₹
                  {DAILY_EARNINGS.reduce(
                    (a, b) => a + b.amount,
                    0,
                  ).toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>
            <Card data-ocid="driver_dashboard.earnings_summary.trips">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  Total Trips
                </div>
                <div className="font-display font-bold text-base text-foreground">
                  {DRIVER_INFO.totalTrips}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </VendorLayout>
  );
}

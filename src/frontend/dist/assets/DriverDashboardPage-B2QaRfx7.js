import { r as reactExports, j as jsxRuntimeExports } from "./index-GEfUMtq2.js";
import { B as Badge, a as Button } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { S as Switch } from "./switch-u-QYo-AU.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, d as TabsContent } from "./tabs-iPOSN1gI.js";
import { V as VendorLayout } from "./VendorLayout-BEQTnqav.js";
import { C as Car } from "./car-BjdlUOmQ.js";
import { S as Star } from "./star-DBKcwqmk.js";
import { I as IndianRupee } from "./indian-rupee-Djooemvo.js";
import { M as MapPin } from "./map-pin-BIsfF69s.js";
import { U as Users } from "./users-C8iVPovn.js";
import { C as CircleCheckBig } from "./circle-check-big-J2sAcsAA.js";
import { C as CircleX } from "./circle-x-BhCwsmLJ.js";
import { T as TrendingUp } from "./trending-up-Ccfrjoep.js";
import "./index--B7DhM78.js";
import "./index-CqG-1QED.js";
import "./use-mobile-D6poQPa6.js";
import "./separator-MnlSgxQn.js";
import "./index-BhtksvJ9.js";
import "./settings-Cdee9qyh.js";
import "./store-D2Qp7_w_.js";
import "./package-zWNh2T3t.js";
import "./shopping-cart-DwTwGXD5.js";
const DRIVER_INFO = {
  name: "Rajesh Kumar",
  vehicleType: "Car",
  vehicleModel: "Maruti Swift",
  plate: "KA 01 MN 4567",
  rating: 4.8,
  totalTrips: 312
};
const MOCK_RIDE_REQUESTS = [
  {
    id: 1,
    pickup: "Indiranagar",
    dropoff: "Whitefield",
    passengers: 2,
    fare: 220,
    requestedAt: "2 min ago"
  },
  {
    id: 2,
    pickup: "Koramangala 6th Block",
    dropoff: "MG Road Metro",
    passengers: 1,
    fare: 90,
    requestedAt: "5 min ago"
  },
  {
    id: 3,
    pickup: "HSR Layout Sector 2",
    dropoff: "Electronic City Phase 1",
    passengers: 3,
    fare: 310,
    requestedAt: "8 min ago"
  }
];
const RIDE_HISTORY = [
  {
    id: 1,
    passenger: "Priya S.",
    from: "Indiranagar",
    to: "Whitefield",
    date: "Apr 13",
    fare: 220,
    rating: 5
  },
  {
    id: 2,
    passenger: "Rahul K.",
    from: "Jayanagar",
    to: "Hebbal",
    date: "Apr 12",
    fare: 180,
    rating: 4
  },
  {
    id: 3,
    passenger: "Meena R.",
    from: "Koramangala",
    to: "MG Road",
    date: "Apr 11",
    fare: 85,
    rating: 5
  },
  {
    id: 4,
    passenger: "Arjun M.",
    from: "BTM Layout",
    to: "Silk Board",
    date: "Apr 10",
    fare: 60,
    rating: 4
  }
];
const DAILY_EARNINGS = [
  { day: "Mon", amount: 680 },
  { day: "Tue", amount: 920 },
  { day: "Wed", amount: 540 },
  { day: "Thu", amount: 1100 },
  { day: "Fri", amount: 1350 },
  { day: "Sat", amount: 1600 },
  { day: "Sun", amount: 430 }
];
function DriverDashboardPage() {
  const [isOnline, setIsOnline] = reactExports.useState(true);
  const [rideRequests, setRideRequests] = reactExports.useState(MOCK_RIDE_REQUESTS);
  const [activeTab, setActiveTab] = reactExports.useState("active");
  const todayEarnings = DAILY_EARNINGS[5].amount;
  const maxAmount = Math.max(...DAILY_EARNINGS.map((d) => d.amount));
  function handleRideAction(id, action) {
    setRideRequests((prev) => prev.filter((r) => r.id !== id));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VendorLayout, { title: "Driver Dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "mb-6 border-2 border-secondary/20",
        "data-ocid": "driver_dashboard.vehicle_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-7 h-7 text-secondary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-base text-foreground", children: DRIVER_INFO.vehicleModel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground font-mono", children: DRIVER_INFO.plate }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                DRIVER_INFO.vehicleType,
                " · ",
                DRIVER_INFO.name
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: isOnline ? "Online" : "Offline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: isOnline,
                onCheckedChange: setIsOnline,
                "data-ocid": "driver_dashboard.online_toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: isOnline ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border",
                children: isOnline ? "● Online" : "○ Offline"
              }
            )
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "driver_dashboard.stat.trips", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-4 h-4 text-secondary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-lg text-foreground", children: DRIVER_INFO.totalTrips }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total Trips" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "driver_dashboard.stat.rating", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-lg text-foreground", children: DRIVER_INFO.rating }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Rating" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "driver_dashboard.stat.today_earnings", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-lg text-foreground", children: [
          "₹",
          todayEarnings
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Today" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: activeTab,
        onValueChange: setActiveTab,
        "data-ocid": "driver_dashboard.tabs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "active", "data-ocid": "driver_dashboard.tab.active", children: [
              "Active Rides",
              rideRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 text-xs bg-primary text-primary-foreground border-0 px-1.5 py-0", children: rideRequests.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "history", "data-ocid": "driver_dashboard.tab.history", children: "Ride History" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "earnings",
                "data-ocid": "driver_dashboard.tab.earnings",
                children: "Earnings"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "active", children: [
            !isOnline && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-10 text-muted-foreground",
                "data-ocid": "driver_dashboard.offline_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm", children: "You are offline. Toggle online to receive ride requests." })
                ]
              }
            ),
            isOnline && rideRequests.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-10 text-muted-foreground",
                "data-ocid": "driver_dashboard.no_rides_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm", children: "No pending ride requests right now." })
                ]
              }
            ),
            isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: rideRequests.map((ride, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border-2 border-primary/10",
                "data-ocid": `driver_dashboard.ride_request.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 mb-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate", children: ride.pickup })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground truncate", children: ride.dropoff })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-base text-primary", children: [
                        "₹",
                        ride.fare
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end text-xs text-muted-foreground mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ride.passengers })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-3", children: ride.requestedAt }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "flex-1 gap-1 text-primary border-primary/30 hover:bg-primary/10",
                        onClick: () => handleRideAction(ride.id),
                        "data-ocid": `driver_dashboard.accept_ride_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" }),
                          " Accept"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "flex-1 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10",
                        onClick: () => handleRideAction(ride.id),
                        "data-ocid": `driver_dashboard.reject_ride_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                          " Reject"
                        ]
                      }
                    )
                  ] })
                ] })
              },
              ride.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: RIDE_HISTORY.map((ride, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              "data-ocid": `driver_dashboard.ride_history.item.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-4 h-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm text-foreground", children: ride.passenger }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                    ride.from,
                    " → ",
                    ride.to
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: ride.date })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-sm text-foreground", children: [
                    "₹",
                    ride.fare
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 justify-end mt-0.5", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Star,
                    {
                      className: `w-3 h-3 ${star <= ride.rating ? "text-primary fill-primary" : "text-muted-foreground"}`
                    },
                    star
                  )) })
                ] })
              ] })
            },
            ride.id
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "earnings", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-5", "data-ocid": "driver_dashboard.earnings_chart", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-secondary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Daily Earnings (This Week)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-2 h-36", children: DAILY_EARNINGS.map((day) => {
                const height = day.amount / maxAmount * 100;
                const isToday = day.day === "Sat";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex-1 flex flex-col items-center gap-1.5",
                    "data-ocid": `driver_dashboard.bar.${day.day.toLowerCase()}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-mono", children: [
                        "₹",
                        day.amount >= 1e3 ? `${(day.amount / 1e3).toFixed(1)}k` : day.amount
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-full rounded-t-lg transition-smooth ${isToday ? "bg-primary" : "bg-secondary/40"}`,
                          style: { height: `${height}%` }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `text-xs font-body ${isToday ? "text-primary font-semibold" : "text-muted-foreground"}`,
                          children: day.day
                        }
                      )
                    ]
                  },
                  day.day
                );
              }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "driver_dashboard.earnings_summary.today", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Today" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-base text-foreground", children: [
                  "₹",
                  todayEarnings
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "driver_dashboard.earnings_summary.week", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "This Week" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-base text-foreground", children: [
                  "₹",
                  DAILY_EARNINGS.reduce(
                    (a, b) => a + b.amount,
                    0
                  ).toLocaleString("en-IN")
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "driver_dashboard.earnings_summary.trips", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Total Trips" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-base text-foreground", children: DRIVER_INFO.totalTrips })
              ] }) })
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  DriverDashboardPage as default
};

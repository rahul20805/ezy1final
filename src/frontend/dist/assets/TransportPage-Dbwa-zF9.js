import { j as jsxRuntimeExports, r as reactExports } from "./index-GEfUMtq2.js";
import { c as createLucideIcon, B as Badge, a as Button } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BrQXhyyZ.js";
import { I as Input } from "./input-C_cKZiLe.js";
import { L as Label } from "./label-DcRWHh-S.js";
import { S as Separator } from "./separator-MnlSgxQn.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, d as TabsContent } from "./tabs-iPOSN1gI.js";
import { u as ue } from "./index-Dm_dm9hF.js";
import { U as UserLayout } from "./UserLayout-3FFMMaon.js";
import { b as busRoutes, r as rides } from "./mock-data-QUu4nJep.js";
import { B as Bus } from "./shopping-bag-BzZn_4tB.js";
import { C as Car } from "./car-BjdlUOmQ.js";
import { C as CircleCheck } from "./circle-check-WCRvny-0.js";
import { C as Circle } from "./circle-Cq6B69M2.js";
import { M as MapPin } from "./map-pin-BIsfF69s.js";
import { C as Clock } from "./clock-DlZ5GBoQ.js";
import { S as Search } from "./search-XTrPKepb.js";
import { S as Star } from "./star-DBKcwqmk.js";
import { Z as Zap } from "./zap-CoNbWw7W.js";
import { U as Users } from "./users-C8iVPovn.js";
import "./index-BhtksvJ9.js";
import "./index-CqG-1QED.js";
import "./use-mobile-D6poQPa6.js";
import "./settings-Cdee9qyh.js";
import "./wallet-R4k-qtGw.js";
import "./stethoscope-D-aIEydT.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]
];
const Navigation = createLucideIcon("navigation", __iconNode);
const RIDE_TYPES = [
  {
    id: "economy",
    label: "Economy",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-5 h-5" }),
    description: "Affordable AC cab",
    basePrice: 80,
    eta: "4–6 min"
  },
  {
    id: "premium",
    label: "Premium",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }),
    description: "Luxury sedan",
    basePrice: 180,
    eta: "3–5 min"
  },
  {
    id: "shared",
    label: "Shared / Pooled",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5" }),
    description: "Share & save",
    basePrice: 45,
    eta: "6–9 min"
  }
];
const TRACKING_STEPS = [
  { key: "searching", label: "Searching for driver…" },
  { key: "found", label: "Driver Found" },
  { key: "onway", label: "On the Way" },
  { key: "arrived", label: "Arrived" }
];
const MOCK_DRIVERS = [
  { name: "Arjun Rao", vehicleType: "Swift Dzire", plate: "KA 01 AB 1234" },
  { name: "Suresh Kumar", vehicleType: "Honda Amaze", plate: "MH 14 XZ 5678" },
  { name: "Pradeep M.", vehicleType: "Maruti Ertiga", plate: "DL 7C AA 9012" }
];
function trackingStepIndex(step) {
  return ["searching", "found", "onway", "arrived"].indexOf(step);
}
function BookRideTab() {
  const [pickup, setPickup] = reactExports.useState("");
  const [dropoff, setDropoff] = reactExports.useState("");
  const [date, setDate] = reactExports.useState("");
  const [time, setTime] = reactExports.useState("");
  const [passengers, setPassengers] = reactExports.useState(1);
  const [rideType, setRideType] = reactExports.useState("economy");
  const [tracking, setTracking] = reactExports.useState(null);
  const selectedOption = RIDE_TYPES.find((r) => r.id === rideType);
  const estimatedFare = selectedOption.basePrice + passengers * 10 + (pickup && dropoff ? 20 : 0);
  function handleFindRide() {
    const driver = MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)];
    setTracking({
      step: "searching",
      driverName: driver.name,
      vehicleType: driver.vehicleType,
      plate: driver.plate,
      eta: 5
    });
  }
  reactExports.useEffect(() => {
    if (!tracking) return;
    const steps = ["searching", "found", "onway", "arrived"];
    const idx = steps.indexOf(tracking.step);
    if (idx < steps.length - 1) {
      const delay = idx === 0 ? 2500 : 3500;
      const t = setTimeout(() => {
        setTracking(
          (prev) => prev ? { ...prev, step: steps[idx + 1], eta: Math.max(0, prev.eta - 1) } : null
        );
      }, delay);
      return () => clearTimeout(t);
    }
  }, [tracking]);
  if (tracking) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "space-y-5 max-w-lg mx-auto",
        "data-ocid": "ride.tracking_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/30 shadow-elevated overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gradient-primary px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/80 text-xs font-body uppercase tracking-wider", children: "Live Tracking" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary-foreground font-display font-bold text-xl mt-0.5", children: [
                "ETA: ",
                tracking.eta,
                " min"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-8 h-8 text-primary-foreground/70 animate-pulse" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-muted/60 rounded-lg p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-5 h-5 text-secondary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: tracking.driverName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  tracking.vehicleType,
                  " · ",
                  tracking.plate
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto bg-secondary/10 text-secondary border-secondary/30 text-xs", children: "★ 4.8" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-4 top-4 bottom-4 w-0.5 bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: TRACKING_STEPS.map(({ key, label }) => {
                const done = trackingStepIndex(tracking.step) > trackingStepIndex(key);
                const active = tracking.step === key;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `relative flex items-center gap-3 pl-8 transition-smooth ${done ? "opacity-70" : active ? "opacity-100" : "opacity-30"}`,
                    "data-ocid": `ride.step.${key}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2.5 -translate-x-1/2", children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-secondary" }) : active ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 text-primary animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "w-4 h-4 text-muted-foreground" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `text-sm font-body ${active ? "text-foreground font-semibold" : "text-muted-foreground"}`,
                          children: label
                        }
                      )
                    ]
                  },
                  key
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "w-full text-destructive border-destructive/30 hover:bg-destructive/5",
                onClick: () => setTracking(null),
                "data-ocid": "ride.cancel_button",
                children: "Cancel Ride"
              }
            )
          ] })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 max-w-lg mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "ride.booking_card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Where do you want to go?" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "pickup",
              className: "text-xs text-muted-foreground uppercase tracking-wide",
              children: "Pickup Location"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "pickup",
                placeholder: "Enter pickup location",
                className: "pl-9",
                value: pickup,
                onChange: (e) => setPickup(e.target.value),
                "data-ocid": "ride.pickup_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "dropoff",
              className: "text-xs text-muted-foreground uppercase tracking-wide",
              children: "Dropoff Location"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "dropoff",
                placeholder: "Enter destination",
                className: "pl-9",
                value: dropoff,
                onChange: (e) => setDropoff(e.target.value),
                "data-ocid": "ride.dropoff_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "rideDate",
                className: "text-xs text-muted-foreground uppercase tracking-wide",
                children: "Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "rideDate",
                type: "date",
                value: date,
                onChange: (e) => setDate(e.target.value),
                "data-ocid": "ride.date_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "rideTime",
                className: "text-xs text-muted-foreground uppercase tracking-wide",
                children: "Time"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "rideTime",
                type: "time",
                value: time,
                onChange: (e) => setTime(e.target.value),
                "data-ocid": "ride.time_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Passengers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center gap-2",
              "data-ocid": "ride.passengers_selector",
              children: [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setPassengers(n),
                  className: `w-9 h-9 rounded-lg border text-sm font-semibold transition-smooth ${passengers === n ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:border-primary"}`,
                  "data-ocid": `ride.passenger.${n}`,
                  children: n
                },
                n
              ))
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1", children: "Choose Ride Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: RIDE_TYPES.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setRideType(opt.id),
          className: `text-left rounded-xl border-2 p-3.5 transition-smooth ${rideType === opt.id ? "border-primary bg-primary/5 shadow-elevated" : "border-border bg-card hover:border-primary/40"}`,
          "data-ocid": `ride.type.${opt.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `${rideType === opt.id ? "text-primary" : "text-muted-foreground"}`,
                  children: opt.icon
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground", children: opt.label })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: opt.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground text-sm", children: [
                "₹",
                opt.basePrice,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-xs text-muted-foreground", children: "+" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                opt.eta
              ] })
            ] })
          ]
        },
        opt.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Estimated Fare" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-xl text-foreground", children: [
          "₹",
          estimatedFare
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-elevated",
          onClick: handleFindRide,
          disabled: !pickup || !dropoff,
          "data-ocid": "ride.find_button",
          children: "Find Ride"
        }
      )
    ] })
  ] });
}
function BusSchedulesTab() {
  const [query, setQuery] = reactExports.useState("");
  const filtered = busRoutes.filter(
    (r) => query.trim() === "" || r.from.toLowerCase().includes(query.toLowerCase()) || r.to.toLowerCase().includes(query.toLowerCase()) || r.routeNumber.toLowerCase().includes(query.toLowerCase()) || r.operator.toLowerCase().includes(query.toLowerCase())
  );
  const typeColor = {
    express: "bg-primary/10 text-primary border-primary/30",
    sleeper: "bg-accent/10 text-accent border-accent/30",
    ordinary: "bg-muted text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search by route, city, or operator…",
          className: "pl-9",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          "data-ocid": "bus.search_input"
        }
      )
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-14 text-muted-foreground",
        "data-ocid": "bus.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "No routes found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Try searching for a different city or route" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((route, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "border border-border hover:border-secondary/40 hover:shadow-elevated transition-smooth",
        "data-ocid": `bus.route.item.${idx + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm text-foreground", children: route.routeNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: `text-xs capitalize border ${typeColor[route.type]}`,
                  variant: "outline",
                  children: route.type
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: route.from }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: route.to })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                route.departure,
                " – ",
                route.arrival
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { className: "w-3 h-3" }),
                route.operator
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-lg text-foreground", children: [
              "₹",
              route.fare
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              route.seats,
              " seats left"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs font-semibold",
                disabled: route.seats === 0,
                onClick: () => ue.success(
                  "Seat booked! Your booking confirmation will arrive shortly."
                ),
                "data-ocid": `bus.book_button.${idx + 1}`,
                children: "Book Seat"
              }
            )
          ] })
        ] }) })
      },
      route.id
    )) })
  ] });
}
function RideHistoryTab() {
  const [ratings, setRatings] = reactExports.useState({});
  const statusStyles = {
    completed: "bg-secondary/10 text-secondary border-secondary/30",
    pending: "bg-primary/10 text-primary border-primary/30",
    accepted: "bg-accent/10 text-accent border-accent/30",
    ongoing: "bg-accent/10 text-accent border-accent/30",
    cancelled: "bg-destructive/10 text-destructive border-destructive/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 max-w-2xl mx-auto", children: rides.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "text-center py-14 text-muted-foreground",
      "data-ocid": "history.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "No ride history" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Book your first ride to see history here" })
      ]
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: rides.map((ride, idx) => {
    const dateObj = new Date(ride.requestedAt);
    const formatted = dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    const timeStr = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
    const rideRating = ratings[ride.id] ?? 0;
    const isCompleted = ride.status === "completed";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "border border-border",
        "data-ocid": `history.ride.item.${idx + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                formatted,
                " · ",
                timeStr
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: ride.from }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "→" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: ride.to })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: `text-xs capitalize border ${statusStyles[ride.status]}`,
                  variant: "outline",
                  "data-ocid": `history.status.${idx + 1}`,
                  children: ride.status
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-base text-foreground", children: [
                "₹",
                ride.fare
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize bg-muted px-2 py-0.5 rounded", children: ride.vehicleType }),
            ride.driverName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-3 h-3" }),
              ride.driverName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              ride.distance,
              " km"
            ] })
          ] }),
          isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Rate driver:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex items-center gap-0.5",
                  "data-ocid": `history.rating.${idx + 1}`,
                  children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setRatings((prev) => ({
                        ...prev,
                        [ride.id]: star
                      })),
                      className: "transition-smooth hover:scale-110",
                      "aria-label": `Rate ${star} star`,
                      "data-ocid": `history.star.${idx + 1}.${star}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Star,
                        {
                          className: `w-4 h-4 ${star <= rideRating ? "fill-primary text-primary" : "text-muted-foreground"}`
                        }
                      )
                    },
                    star
                  ))
                }
              ),
              rideRating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary font-semibold", children: [
                rideRating,
                "/5"
              ] })
            ] })
          ] })
        ] })
      },
      ride.id
    );
  }) }) });
}
function TransportPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UserLayout, { title: "Transport", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "transport.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-5 border border-border shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { className: "w-5 h-5 text-secondary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Transport" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Book rides, check bus schedules, and track your journeys" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        defaultValue: "book",
        className: "space-y-5",
        "data-ocid": "transport.tabs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full grid grid-cols-3 bg-muted/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "book",
                className: "font-body text-sm",
                "data-ocid": "transport.tab.book",
                children: "Book a Ride"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "bus",
                className: "font-body text-sm",
                "data-ocid": "transport.tab.bus",
                children: "Bus Schedules"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "history",
                className: "font-body text-sm",
                "data-ocid": "transport.tab.history",
                children: "Ride History"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "book", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookRideTab, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "bus", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BusSchedulesTab, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RideHistoryTab, {}) })
        ]
      }
    )
  ] }) });
}
export {
  TransportPage as default
};

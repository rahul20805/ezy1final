import { r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-GEfUMtq2.js";
import { c as createLucideIcon, B as Badge } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { I as Input } from "./input-C_cKZiLe.js";
import { U as UserLayout } from "./UserLayout-3FFMMaon.js";
import { u as useCurrentUserProfile, a as useWallet } from "./backend-hooks-Dm6utCL2.js";
import { s as serviceCategories } from "./mock-data-QUu4nJep.js";
import { S as Stethoscope } from "./stethoscope-D-aIEydT.js";
import { B as Bus, S as ShoppingBag } from "./shopping-bag-BzZn_4tB.js";
import { U as UtensilsCrossed } from "./utensils-crossed-CS16vzH-.js";
import { S as ShoppingCart } from "./shopping-cart-DwTwGXD5.js";
import { Z as Zap } from "./zap-CoNbWw7W.js";
import { S as Search } from "./search-XTrPKepb.js";
import { m as motion } from "./proxy-Ch0o53Ij.js";
import { M as MapPin } from "./map-pin-BIsfF69s.js";
import { T as TriangleAlert } from "./triangle-alert-DqXmpED9.js";
import { B as Bot } from "./bot-Bzatjv4P.js";
import { T as TrendingUp } from "./trending-up-Ccfrjoep.js";
import { A as ArrowRight } from "./arrow-right-ZZA8QLW8.js";
import { L as Landmark } from "./landmark-Cj4ArL6a.js";
import { G as Globe } from "./globe-Cuy1i2SR.js";
import "./separator-MnlSgxQn.js";
import "./index-BhtksvJ9.js";
import "./use-mobile-D6poQPa6.js";
import "./settings-Cdee9qyh.js";
import "./wallet-R4k-qtGw.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M10 22v-6.57", key: "1wmca3" }],
  ["path", { d: "M12 11h.01", key: "z322tv" }],
  ["path", { d: "M12 7h.01", key: "1ivr5q" }],
  ["path", { d: "M14 15.43V22", key: "1q2vjd" }],
  ["path", { d: "M15 16a5 5 0 0 0-6 0", key: "o9wqvi" }],
  ["path", { d: "M16 11h.01", key: "xkw8gn" }],
  ["path", { d: "M16 7h.01", key: "1kdx03" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 7h.01", key: "1vti4s" }],
  ["rect", { x: "4", y: "2", width: "16", height: "20", rx: "2", key: "1uxh74" }]
];
const Hotel = createLucideIcon("hotel", __iconNode);
const iconMap = {
  Zap,
  MapPin,
  ShoppingBag,
  Globe,
  UtensilsCrossed,
  Landmark,
  Stethoscope,
  Bus
};
const aiRecommendations = [
  {
    id: 1,
    icon: Stethoscope,
    color: "bg-primary/10 text-primary",
    title: "Dr. Priya Sharma",
    description: "Best nearby general physician, ₹300 consult, next slot 10:30 AM",
    cta: "Book Now",
    link: "/dashboard/healthcare"
  },
  {
    id: 2,
    icon: Bus,
    color: "bg-secondary/10 text-secondary",
    title: "Express Bus to Mysuru",
    description: "Fastest KSRTC route departs 6:00 AM, 12 seats left at ₹180",
    cta: "View Route",
    link: "/dashboard/transport"
  },
  {
    id: 3,
    icon: UtensilsCrossed,
    color: "bg-accent/10 text-accent",
    title: "Reddy Tiffin Centre",
    description: "Popular restaurant near you, full thali ₹80, 4.3 ★ rated",
    cta: "Order Food",
    link: "/dashboard"
  },
  {
    id: 4,
    icon: ShoppingCart,
    color: "bg-primary/10 text-primary",
    title: "Sharma Kirana Store",
    description: "Trending grocery — Basmati Rice ₹120/kg, fresh stock today",
    cta: "Shop Now",
    link: "/dashboard"
  },
  {
    id: 5,
    icon: Hotel,
    color: "bg-secondary/10 text-secondary",
    title: "Hotel Sunrise Bengaluru",
    description: "Weekend deal ₹1,299/night, includes breakfast, 4.5 ★ rated",
    cta: "View Deal",
    link: "/dashboard"
  },
  {
    id: 6,
    icon: Zap,
    color: "bg-accent/10 text-accent",
    title: "Local Electrician",
    description: "Top-rated home repair service, available today, ₹250 visit",
    cta: "Book Service",
    link: "/dashboard"
  }
];
const trendingChips = [
  { label: "🏥 Healthcare", link: "/dashboard/healthcare" },
  { label: "🚌 Bus Tickets", link: "/dashboard/transport" },
  { label: "🛒 Groceries", link: "/dashboard" },
  { label: "⚡ Recharge", link: "/dashboard" },
  { label: "🍱 Food Order", link: "/dashboard" },
  { label: "💳 Payments", link: "/dashboard" },
  { label: "🏠 Home Services", link: "/dashboard" },
  { label: "📱 Digital Gov", link: "/dashboard" },
  { label: "🚗 Ride Share", link: "/dashboard/transport" },
  { label: "💊 Medicines", link: "/dashboard/healthcare" }
];
function getGreeting() {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
function DashboardPage() {
  var _a, _b;
  const { data: user, isLoading: userLoading } = useCurrentUserProfile();
  const { data: wallet } = useWallet();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const greeting = getGreeting();
  const filteredServices = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return serviceCategories;
    const q = searchQuery.toLowerCase();
    return serviceCategories.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);
  const filteredRecs = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return aiRecommendations;
    const q = searchQuery.toLowerCase();
    return aiRecommendations.filter(
      (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UserLayout, { title: "My Dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pb-6", "data-ocid": "dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": "dashboard.search_bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          placeholder: "Search services, doctors, rides...",
          className: "pl-10 bg-card border-border h-12 text-base rounded-xl shadow-sm",
          "data-ocid": "dashboard.search_input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        className: "bg-primary rounded-2xl p-5 text-primary-foreground shadow-elevated",
        "data-ocid": "dashboard.greeting_banner",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            userLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48 bg-primary-foreground/20" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl sm:text-2xl leading-tight", children: [
              greeting,
              ", ",
              ((_a = user == null ? void 0 : user.name) == null ? void 0 : _a.split(" ")[0]) ?? "Friend",
              " 👋"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs gap-1 hover:bg-primary-foreground/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
              "Serving you in ",
              (user == null ? void 0 : user.city) ?? "India"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/75 text-sm mt-2", children: "Your everything app — hyperlocal & national services" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-primary-foreground/70 mb-1", children: "Wallet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-xl text-primary-foreground", children: [
              "₹",
              ((_b = wallet == null ? void 0 : wallet.balance) == null ? void 0 : _b.toLocaleString()) ?? "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/wallet", "data-ocid": "dashboard.wallet_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-xs text-primary-foreground/70 hover:text-primary-foreground underline underline-offset-2 mt-1 transition-colors",
                children: "View Wallet →"
              }
            ) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.quick_actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-base text-foreground mb-3", children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/healthcare", "data-ocid": "dashboard.sos_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive hover:bg-destructive/20 transition-smooth group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-destructive flex items-center justify-center shadow-md group-hover:scale-105 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold leading-tight text-center", children: "Emergency SOS" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/dashboard/transport",
            "data-ocid": "dashboard.book_ride_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/25 hover:bg-primary/20 transition-smooth group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { className: "w-5 h-5 text-primary-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-foreground leading-tight text-center", children: "Book Ride" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", "data-ocid": "dashboard.order_food_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/10 border border-secondary/25 hover:bg-secondary/20 transition-smooth group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-md group-hover:scale-105 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-5 h-5 text-secondary-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-foreground leading-tight text-center", children: "Order Food" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/dashboard/healthcare",
            "data-ocid": "dashboard.book_doctor_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/25 hover:bg-accent/20 transition-smooth group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-md group-hover:scale-105 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "w-5 h-5 text-accent-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-foreground leading-tight text-center", children: "Book Doctor" })
                ]
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.recommendations_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5 text-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg text-foreground", children: "Recommended for You" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "ml-auto text-xs border-secondary/40 text-secondary gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3" }),
              " AI-Powered"
            ]
          }
        )
      ] }),
      filteredRecs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-8 text-muted-foreground text-sm",
          "data-ocid": "dashboard.recommendations.empty_state",
          children: "No recommendations match your search."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: filteredRecs.map((rec, i) => {
        const Icon = rec.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: i * 0.07 },
            "data-ocid": `dashboard.rec_card.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border hover:shadow-elevated hover:-translate-y-0.5 transition-smooth h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${rec.color}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-sm text-foreground leading-tight", children: rec.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2", children: rec.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: rec.link,
                    "data-ocid": `dashboard.rec_cta.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "mt-2 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors",
                        children: [
                          rec.cta,
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
                        ]
                      }
                    )
                  }
                )
              ] })
            ] }) }) })
          },
          rec.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.trending_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg text-foreground mb-3", children: "Trending Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1", children: trendingChips.map((chip, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: chip.link,
          "data-ocid": `dashboard.trending_chip.${i + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-smooth whitespace-nowrap cursor-pointer", children: chip.label })
        },
        chip.label
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.services_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg text-foreground mb-4", children: "All Services" }),
      filteredServices.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-8 text-muted-foreground text-sm",
          "data-ocid": "dashboard.services.empty_state",
          children: "No services match your search."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: filteredServices.map((svc, i) => {
        const Icon = iconMap[svc.icon] ?? Zap;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: svc.route,
            "data-ocid": `dashboard.service_card.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "hover:shadow-elevated hover:-translate-y-0.5 transition-smooth cursor-pointer border-border h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${svc.color === "primary" ? "bg-primary/10 text-primary border-primary/20" : svc.color === "secondary" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-accent/10 text-accent border-accent/20"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-sm text-foreground leading-tight", children: svc.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed", children: svc.description })
            ] }) })
          },
          svc.id
        );
      }) })
    ] })
  ] }) });
}
export {
  DashboardPage as default
};

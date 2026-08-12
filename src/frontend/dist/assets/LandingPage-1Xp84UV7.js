import { j as jsxRuntimeExports, L as Link, r as reactExports } from "./index-GEfUMtq2.js";
import { B as Badge, a as Button } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { L as Layout } from "./Layout-bisDsjVo.js";
import { d as doctors, b as busRoutes, t as testimonials } from "./mock-data-QUu4nJep.js";
import { A as ArrowRight } from "./arrow-right-ZZA8QLW8.js";
import { C as CircleCheckBig } from "./circle-check-big-J2sAcsAA.js";
import { M as MapPin } from "./map-pin-BIsfF69s.js";
import { B as Bus, S as ShoppingBag } from "./shopping-bag-BzZn_4tB.js";
import { S as Stethoscope } from "./stethoscope-D-aIEydT.js";
import { L as Landmark } from "./landmark-Cj4ArL6a.js";
import { U as UtensilsCrossed } from "./utensils-crossed-CS16vzH-.js";
import { G as Globe } from "./globe-Cuy1i2SR.js";
import { Z as Zap } from "./zap-CoNbWw7W.js";
import { T as TriangleAlert } from "./triangle-alert-DqXmpED9.js";
import { C as Clock } from "./clock-DlZ5GBoQ.js";
import { C as Car } from "./car-BjdlUOmQ.js";
import { S as Store } from "./store-D2Qp7_w_.js";
import { T as Truck } from "./truck-C2OQ8y4z.js";
import { S as Star } from "./star-DBKcwqmk.js";
import "./use-mobile-D6poQPa6.js";
import "./chevron-down-CzeR_bKM.js";
import "./wallet-R4k-qtGw.js";
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
const services = [
  {
    id: 1,
    icon: "Zap",
    name: "Recharge & Bills",
    desc: "Mobile top-ups, DTH, electricity, water & more",
    color: "primary",
    trending: true
  },
  {
    id: 2,
    icon: "MapPin",
    name: "Travel & Transport",
    desc: "Book flights, buses, trains, and hotels easily",
    color: "secondary",
    trending: true
  },
  {
    id: 3,
    icon: "Stethoscope",
    name: "Healthcare",
    desc: "Book doctors, order medicines, emergency access",
    color: "accent",
    trending: false
  },
  {
    id: 4,
    icon: "ShoppingBag",
    name: "Hotels & Booking",
    desc: "Find stays near you — budget to luxury",
    color: "primary",
    trending: false
  },
  {
    id: 5,
    icon: "UtensilsCrossed",
    name: "Local Services",
    desc: "Kirana stores, repair, beauty, and more",
    color: "secondary",
    trending: true
  }
];
const partnerPaths = [
  {
    icon: Store,
    title: "Shop Owner",
    desc: "List your kirana, pharmacy, or restaurant. Reach thousands of local customers instantly.",
    badge: "Most Popular"
  },
  {
    icon: Car,
    title: "Driver Partner",
    desc: "Drive autos, bikes, or cabs. Set your own hours, earn daily payouts.",
    badge: "₹0 Joining Fee"
  },
  {
    icon: Truck,
    title: "Service Provider",
    desc: "Offer plumbing, electrical, cleaning, tutoring, or any local service.",
    badge: "New Opportunity"
  }
];
const onboardingSteps = [
  {
    step: "1",
    label: "Register",
    desc: "Fill a simple form with your business details"
  },
  {
    step: "2",
    label: "Verify",
    desc: "Upload Aadhaar & GST for instant verification"
  },
  {
    step: "3",
    label: "Go Live",
    desc: "Start receiving orders within 24 hours"
  }
];
const appFeatures = [
  { emoji: "📍", label: "Hyperlocal Map" },
  { emoji: "💊", label: "Medicine Delivery" },
  { emoji: "🚌", label: "Bus Booking" },
  { emoji: "💳", label: "Ezy1 Wallet" },
  { emoji: "🤖", label: "AI Assistant" },
  { emoji: "🛒", label: "Local Shopping" }
];
function useScrollReveal() {
  const ref = reactExports.useRef(null);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}
function StarRating({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      className: `w-3.5 h-3.5 ${n <= Math.round(rating) ? "text-primary fill-primary" : "text-muted-foreground"}`
    },
    n
  )) });
}
function RevealSection({
  children,
  className = ""
}) {
  const { ref, visible } = useScrollReveal();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: `transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`,
      children
    }
  );
}
function LandingPage() {
  const scrollTo = (id) => {
    var _a;
    (_a = document.getElementById(id)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: "hero",
        "data-ocid": "landing.hero_section",
        className: "relative min-h-screen flex items-center overflow-hidden",
        style: {
          background: "linear-gradient(135deg, oklch(0.62 0.24 71) 0%, oklch(0.52 0.21 188) 100%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-16 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl",
              style: { background: "oklch(0.9 0.15 56)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl",
              style: { background: "oklch(0.3 0.18 262)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative container px-4 py-20 md:py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "mb-6 text-sm px-4 py-1.5 border-0",
                  style: { background: "rgba(255,255,255,0.2)", color: "white" },
                  children: "🇮🇳 India's Everything App"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "h1",
                {
                  className: "font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[1.04] mb-6",
                  style: { color: "white" },
                  children: [
                    "One App.",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "Every Service.",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.95 0.08 56)" }, children: "Anywhere." })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-lg md:text-xl leading-relaxed mb-8 max-w-md",
                  style: { color: "rgba(255,255,255,0.85)" },
                  children: "From cities to villages — Ezy1 connects everything. Groceries, doctors, buses, local shops — all in your pocket."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", "data-ocid": "landing.hero_explore_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "lg",
                    className: "h-13 px-8 text-base gap-2 w-full sm:w-auto font-semibold",
                    style: {
                      background: "oklch(0.62 0.24 71)",
                      color: "white",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
                    },
                    children: [
                      "Explore Services ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/partner-login",
                    "data-ocid": "landing.hero_partner_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "lg",
                        variant: "outline",
                        className: "h-13 px-8 text-base gap-2 w-full sm:w-auto font-semibold",
                        style: {
                          borderColor: "rgba(255,255,255,0.5)",
                          color: "white",
                          background: "rgba(255,255,255,0.12)"
                        },
                        children: "Partner With Us"
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4", children: [
                "5M+ Users",
                "500+ Cities",
                "50K+ Partners",
                "4.8★ Rated"
              ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "flex items-center gap-1.5 text-sm font-medium",
                  style: { color: "rgba(255,255,255,0.85)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheckBig,
                      {
                        className: "w-4 h-4",
                        style: { color: "oklch(0.95 0.08 56)" }
                      }
                    ),
                    t
                  ]
                },
                t
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center md:justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-72 md:w-80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative bg-card rounded-[2.5rem] shadow-2xl border-4 border-white/30 overflow-hidden",
                  style: { boxShadow: "0 32px 80px rgba(0,0,0,0.35)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "h-10 flex items-center justify-between px-5",
                        style: { background: "oklch(0.62 0.24 71)" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white font-medium", children: "9:41" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-5 bg-black rounded-full mx-auto" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white font-medium", children: "📶" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border flex items-center justify-between bg-card", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-black text-lg text-foreground", children: [
                        "ezy",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 text-primary" }),
                        "Bengaluru"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-background space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Quick Access" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: appFeatures.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex flex-col items-center gap-1 p-2 bg-card rounded-xl border border-border hover:border-primary/30 transition-smooth cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: f.emoji }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-center text-muted-foreground leading-tight font-medium", children: f.label })
                          ]
                        },
                        f.label
                      )) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/10 border border-secondary/20 rounded-xl p-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-secondary mb-2", children: "Near You" }),
                        ["Sharma Kirana · 0.3 km", "Apollo Clinic · 0.8 km"].map(
                          (item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: "flex items-center gap-2 text-[11px] text-foreground py-0.5",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" }),
                                item
                              ]
                            },
                            item
                          )
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "grid grid-cols-4 border-t border-border",
                        style: { background: "oklch(0.99 0.01 56)" },
                        children: ["🏠", "🗺️", "💊", "👤"].map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: `flex items-center justify-center py-3 text-lg ${i === 0 ? "border-t-2 border-primary" : ""}`,
                            children: e
                          },
                          e
                        ))
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "absolute -left-8 top-16 bg-card rounded-2xl px-3 py-2 shadow-elevated border border-border animate-bounce",
                  style: { animationDuration: "3s" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground", children: "🎉 Live Orders" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "2.3L+ today" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "absolute -right-6 bottom-24 bg-card rounded-2xl px-3 py-2 shadow-elevated border border-border animate-bounce",
                  style: { animationDuration: "4s", animationDelay: "1s" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-secondary", children: "📍 Detected" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Bengaluru, KA" })
                  ]
                }
              )
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => scrollTo("services"),
              className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer",
              style: { color: "rgba(255,255,255,0.7)" },
              "data-ocid": "landing.hero_scroll_down",
              "aria-label": "Scroll to services",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Scroll down" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-2.5 bg-white/60 rounded-full animate-bounce" }) })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "services",
        className: "bg-muted/30 py-20",
        "data-ocid": "landing.services_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(RevealSection, { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "mb-3", children: "Services Ecosystem" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-3xl md:text-4xl text-foreground mb-3", children: "Everything You Need, In One Place" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-lg mx-auto", children: "From recharge to doctors, groceries to buses — 50+ service categories designed for India." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4", children: services.map((svc, i) => {
            const Icon = iconMap[svc.icon] ?? Zap;
            const colorClass = {
              primary: "bg-primary/10 text-primary border-primary/20",
              secondary: "bg-secondary/10 text-secondary border-secondary/20",
              accent: "bg-accent/10 text-accent border-accent/20"
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsx(RevealSection, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", "data-ocid": `landing.service_card.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-elevated hover:-translate-y-1.5 transition-smooth cursor-pointer border-border h-full group relative overflow-hidden", children: [
              svc.trending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20", children: "🔥 Trending" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-smooth group-hover:scale-110 ${colorClass[svc.color]}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-foreground mb-1 text-base", children: svc.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground leading-relaxed", children: svc.desc })
              ] })
            ] }) }) }, svc.id);
          }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "hyperlocal",
        className: "bg-background py-20",
        "data-ocid": "landing.hyperlocal_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-14 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(RevealSection, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-secondary/10 text-secondary border-secondary/20 mb-4", children: "Hyperlocal Experience" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-3xl md:text-4xl text-foreground mb-5", children: "Services Where You Are" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: "Ezy1 auto-detects your location and surfaces the most relevant hyperlocal services — whether you're in South Mumbai, a small UP town, or a Rajasthan village." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 mb-8", children: [
              "Kirana stores delivering within 30 minutes",
              "Village milk delivery at your doorstep by 7 AM",
              "Local dhabas with live menu and delivery",
              "Supports 12 Indian regional languages"
            ].map((pt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-start gap-3 text-sm text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-secondary mt-0.5 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: pt })
                ]
              },
              pt
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90",
                onClick: () => scrollTo("hero"),
                "data-ocid": "landing.hyperlocal_cta_button",
                children: [
                  "Explore Near You ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RevealSection, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl p-5 border border-border shadow-elevated", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Bengaluru, KA" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Auto-detected · 2 min ago" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-secondary/10 text-secondary border-secondary/20 text-xs", children: "● Live" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-xl h-44 relative overflow-hidden mb-4 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 opacity-10",
                  style: {
                    backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 20px,currentColor 20px,currentColor 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,currentColor 20px,currentColor 21px)",
                    backgroundSize: "21px 21px"
                  }
                }
              ),
              [
                {
                  top: "22%",
                  left: "28%",
                  label: "Kirana Store",
                  color: "bg-primary"
                },
                {
                  top: "52%",
                  left: "58%",
                  label: "Doctor",
                  color: "bg-secondary"
                },
                {
                  top: "68%",
                  left: "22%",
                  label: "Bus Stop",
                  color: "bg-accent"
                }
              ].map(({ top, left, label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "absolute flex flex-col items-center",
                  style: { top, left },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-6 h-6 ${color} rounded-full flex items-center justify-center shadow-sm`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 text-white" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 bg-card text-[10px] px-2 py-0.5 rounded-full border border-border shadow-sm font-semibold text-foreground whitespace-nowrap", children: label })
                  ]
                },
                label
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Nearby Services" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
              {
                icon: ShoppingBag,
                name: "Sharma Kirana Store",
                dist: "0.3 km",
                tag: "Open",
                tagColor: "bg-secondary/10 text-secondary"
              },
              {
                icon: Stethoscope,
                name: "Dr. Priya Sharma",
                dist: "1.2 km",
                tag: "Clinic",
                tagColor: "bg-primary/10 text-primary"
              },
              {
                icon: Bus,
                name: "KSRTC Bus Stand",
                dist: "0.8 km",
                tag: "Bus Stop",
                tagColor: "bg-accent/10 text-accent"
              }
            ].map(({ icon: Icon, name, dist, tag, tagColor }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between py-2 border-b border-border last:border-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-medium", children: name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: dist }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: `text-[10px] px-1.5 py-0 border-0 ${tagColor}`,
                        children: tag
                      }
                    )
                  ] })
                ]
              },
              name
            )) })
          ] }) })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "healthcare",
        className: "bg-muted/30 py-20",
        "data-ocid": "landing.healthcare_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(RevealSection, { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20 mb-3", children: "Healthcare" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-3xl md:text-4xl text-foreground mb-3", children: "Your Health, Our Priority" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-lg mx-auto", children: "Book certified doctors, order medicines, and access emergency care — all from your phone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RevealSection, { className: "max-w-2xl mx-auto mb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 bg-destructive/10 border border-destructive/30 rounded-2xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-6 h-6 text-destructive-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-destructive text-lg", children: "Emergency SOS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "One tap to reach nearest ambulance, emergency contacts, and hospital ER." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", "data-ocid": "landing.sos_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-shrink-0", children: "SOS" }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: doctors.slice(0, 3).map((doc, i) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(RevealSection, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border-border hover:shadow-elevated transition-smooth h-full",
                "data-ocid": `landing.doctor_card.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-primary text-lg", children: ((_a = doc.name.split(" ")[1]) == null ? void 0 : _a[0]) ?? "D" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm leading-tight", children: doc.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-secondary font-medium mt-0.5", children: doc.specialty }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: doc.rating }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                          doc.rating,
                          " · ",
                          doc.experience,
                          " yrs"
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-secondary/10 text-secondary border-secondary/20 text-xs", children: "Clinic" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border-accent/20 text-xs", children: "Home Visit" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-primary", children: [
                      "₹",
                      doc.fee
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/login",
                      "data-ocid": `landing.doctor_book_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "sm",
                          className: "w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
                          children: "Book Now"
                        }
                      )
                    }
                  )
                ] })
              }
            ) }, doc.id);
          }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "transport",
        className: "bg-background py-20",
        "data-ocid": "landing.transport_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(RevealSection, { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-secondary/10 text-secondary border-secondary/20 mb-3", children: "Transport" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-3xl md:text-4xl text-foreground mb-3", children: "Move Smarter Across India" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-lg mx-auto", children: "Book buses, share rides, and track live journeys — state buses to city autos, all connected." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RevealSection, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border-border overflow-hidden",
                "data-ocid": "landing.transport_bus_table",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { className: "w-5 h-5 text-secondary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: "State Bus Booking" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Live seat availability" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Route" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Dep" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Arr" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Fare" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: busRoutes.slice(0, 3).map((route, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "tr",
                      {
                        className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
                        "data-ocid": `landing.bus_row.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-xs", children: [
                              route.from,
                              " → ",
                              route.to
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: route.operator })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-foreground font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-muted-foreground" }),
                            route.departure
                          ] }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: route.arrival }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary text-sm", children: [
                            "₹",
                            route.fare
                          ] }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Link,
                            {
                              to: "/login",
                              "data-ocid": `landing.bus_book_button.${i + 1}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Button,
                                {
                                  size: "sm",
                                  variant: "outline",
                                  className: "text-xs h-7 px-2.5 border-secondary/30 text-secondary hover:bg-secondary/10",
                                  children: "Book"
                                }
                              )
                            }
                          ) })
                        ]
                      },
                      route.id
                    )) })
                  ] }) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RevealSection, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border-border h-full",
                "data-ocid": "landing.transport_ride_card",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-5 h-5 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: "Ride Sharing" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Autos, bikes & cabs near you" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto bg-secondary/10 text-secondary border-secondary/20 text-xs", children: "● Live" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mb-5", children: [
                    {
                      type: "Auto",
                      emoji: "🛺",
                      fare: "₹50+",
                      time: "2 min"
                    },
                    { type: "Bike", emoji: "🏍️", fare: "₹30+", time: "3 min" },
                    {
                      type: "Cab",
                      emoji: "🚗",
                      fare: "₹120+",
                      time: "5 min"
                    }
                  ].map(({ type, emoji, fare, time }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "bg-muted/40 rounded-xl p-3 text-center border border-border hover:border-primary/30 transition-smooth cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl mb-1", children: emoji }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground", children: type }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-semibold", children: fare }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                          time,
                          " away"
                        ] })
                      ]
                    },
                    type
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl p-4 border border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Sample Estimate" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-primary" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-0.5 h-6 bg-border" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-secondary" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: "Indiranagar" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: "Whitefield · 18 km" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-right", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-xl text-primary", children: "₹220" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Cab estimate" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/login",
                      className: "block mt-4",
                      "data-ocid": "landing.ride_book_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2", children: [
                        "Book a Ride ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                      ] })
                    }
                  )
                ] })
              }
            ) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "partner",
        className: "py-20",
        "data-ocid": "landing.partner_section",
        style: { background: "oklch(0.3 0.18 262)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(RevealSection, { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: "mb-3 text-sm border-0",
                style: { background: "rgba(255,255,255,0.15)", color: "white" },
                children: "Partner With Us"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "font-display font-bold text-3xl md:text-4xl mb-3",
                style: { color: "white" },
                children: "Grow Your Business with Ezy1"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "max-w-lg mx-auto text-lg",
                style: { color: "rgba(255,255,255,0.75)" },
                children: "Join 50,000+ vendors, drivers, and service providers earning more every day."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 mb-14", children: partnerPaths.map(({ icon: Icon, title, desc, badge }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(RevealSection, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-0 h-full",
              style: {
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)"
              },
              "data-ocid": `landing.partner_card.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    style: { background: "rgba(255,255,255,0.15)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6", style: { color: "white" } })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: "mb-3 text-xs border-0",
                    style: {
                      background: "oklch(0.62 0.24 71)",
                      color: "white"
                    },
                    children: badge
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h3",
                  {
                    className: "font-display font-bold text-xl mb-2",
                    style: { color: "white" },
                    children: title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm mb-5 leading-relaxed",
                    style: { color: "rgba(255,255,255,0.7)" },
                    children: desc
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/partner-login",
                    "data-ocid": `landing.partner_register_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        className: "w-full border-0 gap-2",
                        style: {
                          background: "oklch(0.62 0.24 71)",
                          color: "white"
                        },
                        children: [
                          "Register Now ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                        ]
                      }
                    )
                  }
                )
              ] })
            }
          ) }, title)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RevealSection, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-center text-sm font-semibold mb-8 uppercase tracking-wider",
                style: { color: "rgba(255,255,255,0.6)" },
                children: "Simple 3-Step Onboarding"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 relative", children: onboardingSteps.map(({ step, label, desc }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center text-center relative",
                children: [
                  i < onboardingSteps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "hidden sm:block absolute top-6 left-1/2 w-full h-0.5",
                      style: { background: "rgba(255,255,255,0.2)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "relative w-12 h-12 rounded-full flex items-center justify-center mb-3 font-display font-black text-xl z-10",
                      style: {
                        background: "oklch(0.62 0.24 71)",
                        color: "white"
                      },
                      children: step
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-display font-bold text-base mb-1",
                      style: { color: "white" },
                      children: label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm",
                      style: { color: "rgba(255,255,255,0.65)" },
                      children: desc
                    }
                  )
                ]
              },
              step
            )) })
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "testimonials",
        className: "bg-muted/30 py-20",
        "data-ocid": "landing.testimonials_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(RevealSection, { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-3xl md:text-4xl text-foreground mb-3", children: "Trusted by Millions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Real stories from real Indians using Ezy1 every day" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: testimonials.slice(0, 4).map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(RevealSection, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-border hover:shadow-elevated transition-smooth h-full",
              "data-ocid": `landing.testimonial.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-primary", children: t.name[0] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: t.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 text-muted-foreground flex-shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: t.city }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-[10px] px-1 py-0 flex-shrink-0",
                          children: t.role
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: t.rating }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-foreground leading-relaxed", children: [
                  '"',
                  t.text,
                  '"'
                ] })
              ] })
            }
          ) }, t.id)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-20",
        "data-ocid": "landing.footer_cta_section",
        style: {
          background: "linear-gradient(135deg, oklch(0.62 0.24 71) 0%, oklch(0.52 0.21 188) 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container px-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(RevealSection, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm font-semibold mb-4 uppercase tracking-widest",
              style: { color: "rgba(255,255,255,0.65)" },
              children: "Start Today — It's Free"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "font-display font-black text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight",
              style: { color: "white" },
              children: "Join the Future of Services with Ezy1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-lg mb-10 max-w-md mx-auto",
              style: { color: "rgba(255,255,255,0.8)" },
              children: "One app for every service, every Indian, everywhere."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", "data-ocid": "landing.footer_cta_login_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "h-13 px-10 text-base font-semibold gap-2 w-full sm:w-auto",
                style: {
                  background: "white",
                  color: "oklch(0.62 0.24 71)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                },
                children: [
                  "Login / Sign Up ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/partner-login",
                "data-ocid": "landing.footer_cta_partner_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "lg",
                    variant: "outline",
                    className: "h-13 px-10 text-base font-semibold gap-2 w-full sm:w-auto",
                    style: {
                      borderColor: "rgba(255,255,255,0.5)",
                      color: "white",
                      background: "rgba(255,255,255,0.12)"
                    },
                    children: "Partner Login"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "mt-6 text-sm",
              style: { color: "rgba(255,255,255,0.55)" },
              children: "No credit card needed · Available in 12 Indian languages · Works on 2G/3G"
            }
          )
        ] }) })
      }
    )
  ] });
}
export {
  LandingPage as default
};

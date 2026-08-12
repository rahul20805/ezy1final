import { u as useInternetIdentity, a as useNavigate, j as jsxRuntimeExports, s as setCurrentRole } from "./index-GEfUMtq2.js";
import { B as Badge, a as Button } from "./index-DtH2l02M.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-BrQXhyyZ.js";
import { L as Layout } from "./Layout-bisDsjVo.js";
import { S as Store } from "./store-D2Qp7_w_.js";
import { T as Truck } from "./truck-C2OQ8y4z.js";
import { S as Stethoscope } from "./stethoscope-D-aIEydT.js";
import { W as Wrench } from "./wrench-D4Edno-4.js";
import { C as CircleCheckBig } from "./circle-check-big-J2sAcsAA.js";
import { A as ArrowRight } from "./arrow-right-ZZA8QLW8.js";
import "./use-mobile-D6poQPa6.js";
import "./mock-data-QUu4nJep.js";
import "./map-pin-BIsfF69s.js";
import "./chevron-down-CzeR_bKM.js";
import "./wallet-R4k-qtGw.js";
const partnerTypes = [
  { icon: Store, label: "Shop Owner", desc: "Groceries, pharmacy, retail" },
  { icon: Truck, label: "Driver / Rider", desc: "Auto, cab, bike delivery" },
  {
    icon: Stethoscope,
    label: "Healthcare Provider",
    desc: "Clinic, doctor, pharmacy"
  },
  {
    icon: Wrench,
    label: "Service Provider",
    desc: "Plumber, electrician, etc."
  }
];
const perks = [
  "Free listing on India's fastest-growing super app",
  "Reach customers in your area instantly",
  "Digital payments & instant settlements",
  "Dedicated partner support 24/7"
];
function PartnerLoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isLoading = loginStatus === "logging-in";
  const handlePartnerLogin = async () => {
    await login();
    setCurrentRole("vendor");
    navigate({ to: "/vendor-dashboard" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-[calc(100vh-8rem)] bg-muted/30 flex items-center justify-center p-6",
      "data-ocid": "partner_login.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-secondary/15 text-secondary-foreground border-secondary/30 mb-4 text-sm px-4 py-1.5", children: "Partner Portal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-3xl text-foreground", children: [
            "Grow Your Business with ezy",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Join thousands of vendors already earning more" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 mb-6", children: partnerTypes.map(({ icon: Icon, label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-4 bg-card border border-border rounded-xl hover:border-secondary/60 hover:shadow-subtle transition-smooth cursor-pointer group",
            "data-ocid": `partner_login.type_card.${label.toLowerCase().replace(/\s+\//g, "_").replace(/\s+/g, "_")}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6 text-secondary mb-2 group-hover:scale-110 transition-transform" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-sm text-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: desc })
            ]
          },
          label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-elevated border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display text-foreground", children: "Why partner with us?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: perks.map((perk) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-start gap-2.5 text-sm text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-secondary flex-shrink-0 mt-0.5" }),
                  perk
                ]
              },
              perk
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-3 text-base font-semibold mt-2",
                onClick: handlePartnerLogin,
                disabled: isLoading,
                "data-ocid": "partner_login.submit_button",
                children: [
                  isLoading ? "Connecting..." : "Join as Partner",
                  !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                ]
              }
            )
          ] })
        ] })
      ] })
    }
  ) });
}
export {
  PartnerLoginPage as default
};

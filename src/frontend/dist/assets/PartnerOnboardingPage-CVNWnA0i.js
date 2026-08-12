import { a as useNavigate, r as reactExports, j as jsxRuntimeExports, s as setCurrentRole } from "./index-GEfUMtq2.js";
import { a as Button, B as Badge, U as User } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { I as Input } from "./input-C_cKZiLe.js";
import { L as Label } from "./label-DcRWHh-S.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-yPjcByft.js";
import { T as Textarea } from "./textarea-B9ovXcnp.js";
import { C as CircleCheck } from "./circle-check-WCRvny-0.js";
import { C as Clock } from "./clock-DlZ5GBoQ.js";
import { S as Store } from "./store-D2Qp7_w_.js";
import { C as Car } from "./car-BjdlUOmQ.js";
import { W as Wrench } from "./wrench-D4Edno-4.js";
import { C as ChevronRight, S as Settings } from "./settings-Cdee9qyh.js";
import { M as MapPin } from "./map-pin-BIsfF69s.js";
import { P as Phone } from "./phone-BP-Fu9v9.js";
import "./index-BhtksvJ9.js";
import "./index-CqG-1QED.js";
import "./index--B7DhM78.js";
import "./chevron-down-CzeR_bKM.js";
import "./chevron-up-C5jdeDnv.js";
const ROLE_OPTIONS = [
  {
    id: "shop_owner",
    icon: Store,
    title: "Shop Owner",
    desc: "List your shop, grocery, restaurant or retail store and reach thousands of local customers.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30"
  },
  {
    id: "driver",
    icon: Car,
    title: "Driver",
    desc: "Join as a driver for rides, deliveries, or intercity transport. Set your own schedule.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/30"
  },
  {
    id: "service_provider",
    icon: Wrench,
    title: "Service Provider",
    desc: "Offer local services like plumbing, electrical, cleaning and grow your client base.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30"
  }
];
const STEPS = ["Choose Role", "Fill Details", "Review & Submit"];
function PartnerOnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const [selectedRole, setSelectedRole] = reactExports.useState(null);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [shopData, setShopData] = reactExports.useState({
    shopName: "",
    category: "",
    description: "",
    address: "",
    openingHours: "",
    phone: ""
  });
  const [driverData, setDriverData] = reactExports.useState({
    vehicleType: "",
    plateNumber: "",
    licenseNumber: "",
    experience: "",
    coverageAreas: ""
  });
  const [spData, setSpData] = reactExports.useState({
    serviceType: "",
    experience: "",
    serviceAreas: "",
    pricingPerHour: ""
  });
  function handleSubmit() {
    setCurrentRole("vendor");
    setSubmitted(true);
  }
  function goToDashboard() {
    navigate({ to: "/vendor-dashboard" });
  }
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center max-w-md",
        "data-ocid": "onboarding.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10 text-green-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground mb-3", children: "Application Submitted!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-2 font-body", children: [
            "Your application is now",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "pending review" }),
            " ",
            "by the Ezy1 team."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Estimated review time: 24–48 hours" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full",
              onClick: goToDashboard,
              "data-ocid": "onboarding.go_to_dashboard_button",
              children: "Go to Partner Dashboard"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-4 h-4 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg", children: [
          "ezy",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Partner Onboarding" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center justify-center mb-10",
          "data-ocid": "onboarding.steps",
          children: STEPS.map((label, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isDone = step > num;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-smooth ${isDone ? "bg-primary border-primary text-primary-foreground" : isActive ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground"}`,
                    "data-ocid": `onboarding.step_indicator.${num}`,
                    children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) : num
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs mt-1 font-body hidden sm:block ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`,
                    children: label
                  }
                )
              ] }),
              i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-0.5 w-16 sm:w-24 mx-2 mb-4 rounded transition-smooth ${step > num ? "bg-primary" : "bg-border"}`
                }
              )
            ] }, label);
          })
        }
      ),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "onboarding.choose_role_section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground text-center mb-2", children: "How do you want to partner with Ezy1?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center mb-8 font-body", children: "Choose the role that best fits your business" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: ROLE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedRole === opt.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: `cursor-pointer transition-smooth border-2 ${isSelected ? `${opt.border} shadow-elevated` : "border-border hover:border-muted-foreground/30"}`,
              onClick: () => setSelectedRole(opt.id),
              "data-ocid": `onboarding.role_card.${opt.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-14 h-14 rounded-xl ${opt.bg} flex items-center justify-center flex-shrink-0`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-7 h-7 ${opt.color}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-base text-foreground mb-1", children: opt.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body leading-snug", children: opt.desc })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-smooth ${isSelected ? "border-primary bg-primary" : "border-border"}`,
                    children: isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary-foreground" })
                  }
                )
              ] })
            },
            opt.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "w-full mt-8 gap-2",
            size: "lg",
            disabled: !selectedRole,
            onClick: () => setStep(2),
            "data-ocid": "onboarding.next_button.step1",
            children: [
              "Continue",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ]
          }
        )
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "onboarding.fill_details_section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-2xl text-foreground text-center mb-2", children: [
          "Tell us about your",
          " ",
          selectedRole === "shop_owner" ? "shop" : selectedRole === "driver" ? "vehicle" : "services"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center mb-8 font-body", children: "This information will be reviewed by the Ezy1 team" }),
        selectedRole === "shop_owner" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "shopName", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-3.5 h-3.5 inline mr-1" }),
                "Shop Name"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "shopName",
                  placeholder: "e.g. Sharma Kirana Store",
                  value: shopData.shopName,
                  onChange: (e) => setShopData({ ...shopData, shopName: e.target.value }),
                  "data-ocid": "onboarding.shop_name.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: shopData.category,
                  onValueChange: (v) => setShopData({ ...shopData, category: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        id: "category",
                        "data-ocid": "onboarding.shop_category.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Food", children: "Food" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Grocery", children: "Grocery" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Retail", children: "Retail" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Services", children: "Services" })
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "description",
                placeholder: "Describe what your shop sells...",
                rows: 3,
                value: shopData.description,
                onChange: (e) => setShopData({ ...shopData, description: e.target.value }),
                "data-ocid": "onboarding.shop_description.textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "address", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 inline mr-1" }),
              "Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "address",
                placeholder: "Full address with locality and city",
                value: shopData.address,
                onChange: (e) => setShopData({ ...shopData, address: e.target.value }),
                "data-ocid": "onboarding.shop_address.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "openingHours", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 inline mr-1" }),
                "Opening Hours"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "openingHours",
                  placeholder: "e.g. 8:00 AM – 9:00 PM",
                  value: shopData.openingHours,
                  onChange: (e) => setShopData({
                    ...shopData,
                    openingHours: e.target.value
                  }),
                  "data-ocid": "onboarding.shop_hours.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "phone", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5 inline mr-1" }),
                "Phone"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "phone",
                  placeholder: "+91 98765 43210",
                  value: shopData.phone,
                  onChange: (e) => setShopData({ ...shopData, phone: e.target.value }),
                  "data-ocid": "onboarding.shop_phone.input"
                }
              )
            ] })
          ] })
        ] }),
        selectedRole === "driver" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Vehicle Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: driverData.vehicleType,
                  onValueChange: (v) => setDriverData({ ...driverData, vehicleType: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "onboarding.vehicle_type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select vehicle" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Car", children: "Car" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Bike", children: "Bike" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Auto", children: "Auto" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "plateNumber", children: "Plate Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "plateNumber",
                  placeholder: "e.g. KA 01 AB 1234",
                  value: driverData.plateNumber,
                  onChange: (e) => setDriverData({
                    ...driverData,
                    plateNumber: e.target.value
                  }),
                  "data-ocid": "onboarding.plate_number.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "license", children: "License Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "license",
                  placeholder: "DL number",
                  value: driverData.licenseNumber,
                  onChange: (e) => setDriverData({
                    ...driverData,
                    licenseNumber: e.target.value
                  }),
                  "data-ocid": "onboarding.license_number.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "driverExp", children: "Years of Experience" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "driverExp",
                  type: "number",
                  placeholder: "e.g. 5",
                  value: driverData.experience,
                  onChange: (e) => setDriverData({
                    ...driverData,
                    experience: e.target.value
                  }),
                  "data-ocid": "onboarding.driver_experience.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "coverage", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 inline mr-1" }),
              "Coverage Areas"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "coverage",
                placeholder: "e.g. Bengaluru, Mysuru, Hassan",
                value: driverData.coverageAreas,
                onChange: (e) => setDriverData({
                  ...driverData,
                  coverageAreas: e.target.value
                }),
                "data-ocid": "onboarding.coverage_areas.input"
              }
            )
          ] })
        ] }),
        selectedRole === "service_provider" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Service Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: spData.serviceType,
                  onValueChange: (v) => setSpData({ ...spData, serviceType: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "onboarding.service_type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select service" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Plumber", children: "Plumber" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Electrician", children: "Electrician" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cleaner", children: "Cleaner" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "spExp", children: "Years of Experience" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "spExp",
                  type: "number",
                  placeholder: "e.g. 8",
                  value: spData.experience,
                  onChange: (e) => setSpData({ ...spData, experience: e.target.value }),
                  "data-ocid": "onboarding.sp_experience.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "spAreas", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 inline mr-1" }),
              "Service Areas"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "spAreas",
                placeholder: "e.g. Koramangala, HSR Layout, Indiranagar",
                value: spData.serviceAreas,
                onChange: (e) => setSpData({ ...spData, serviceAreas: e.target.value }),
                "data-ocid": "onboarding.service_areas.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pricing", children: "Pricing per Hour (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "pricing",
                type: "number",
                placeholder: "e.g. 300",
                value: spData.pricingPerHour,
                onChange: (e) => setSpData({ ...spData, pricingPerHour: e.target.value }),
                "data-ocid": "onboarding.pricing.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1",
              onClick: () => setStep(1),
              "data-ocid": "onboarding.back_button.step2",
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-2 flex-1 gap-2",
              onClick: () => setStep(3),
              "data-ocid": "onboarding.next_button.step2",
              children: [
                "Review Application",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              ]
            }
          )
        ] })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "onboarding.review_section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground text-center mb-2", children: "Review your application" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center mb-8 font-body", children: "Check your details before submitting" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pb-3 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center", children: [
              selectedRole === "shop_owner" && /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-5 h-5 text-primary" }),
              selectedRole === "driver" && /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-5 h-5 text-secondary" }),
              selectedRole === "service_provider" && /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "w-5 h-5 text-accent" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm text-foreground", children: selectedRole === "shop_owner" ? "Shop Owner" : selectedRole === "driver" ? "Driver" : "Service Provider" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Partner Role" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto text-xs bg-yellow-500/10 text-yellow-700 border-yellow-500/20", children: "Pending Review" })
          ] }),
          selectedRole === "shop_owner" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Store,
                label: "Shop Name",
                value: shopData.shopName || "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Settings,
                label: "Category",
                value: shopData.category || "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: MapPin,
                label: "Address",
                value: shopData.address || "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Clock,
                label: "Hours",
                value: shopData.openingHours || "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Phone,
                label: "Phone",
                value: shopData.phone || "—"
              }
            ),
            shopData.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: User,
                label: "Description",
                value: shopData.description
              }
            ) })
          ] }),
          selectedRole === "driver" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Car,
                label: "Vehicle Type",
                value: driverData.vehicleType || "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Settings,
                label: "Plate Number",
                value: driverData.plateNumber || "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: User,
                label: "License",
                value: driverData.licenseNumber || "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Clock,
                label: "Experience",
                value: driverData.experience ? `${driverData.experience} years` : "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: MapPin,
                label: "Coverage Areas",
                value: driverData.coverageAreas || "—"
              }
            )
          ] }),
          selectedRole === "service_provider" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Wrench,
                label: "Service Type",
                value: spData.serviceType || "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Clock,
                label: "Experience",
                value: spData.experience ? `${spData.experience} years` : "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: MapPin,
                label: "Service Areas",
                value: spData.serviceAreas || "—"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewRow,
              {
                icon: Settings,
                label: "Price/Hour",
                value: spData.pricingPerHour ? `₹${spData.pricingPerHour}` : "—"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mb-6 font-body", children: "By submitting, you agree to Ezy1's Partner Terms and conditions. Your application will be reviewed within 24–48 hours." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1",
              onClick: () => setStep(2),
              "data-ocid": "onboarding.back_button.step3",
              children: "Edit Details"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-1 gap-2",
              onClick: handleSubmit,
              "data-ocid": "onboarding.submit_button",
              children: [
                "Submit Application",
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" })
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function ReviewRow({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground truncate", children: value })
    ] })
  ] });
}
export {
  PartnerOnboardingPage as default
};

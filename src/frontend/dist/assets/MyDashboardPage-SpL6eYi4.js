import { j as jsxRuntimeExports, S as Skeleton, r as reactExports } from "./index-GEfUMtq2.js";
import { c as createLucideIcon, U as User, B as Badge, a as Button } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { I as Input } from "./input-C_cKZiLe.js";
import { L as Label } from "./label-DcRWHh-S.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-yPjcByft.js";
import { H as House, S as Separator } from "./separator-MnlSgxQn.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, d as TabsContent } from "./tabs-iPOSN1gI.js";
import { u as ue } from "./index-Dm_dm9hF.js";
import { U as UserLayout } from "./UserLayout-3FFMMaon.js";
import { b as useAppointments, c as useRides, u as useCurrentUserProfile } from "./backend-hooks-Dm6utCL2.js";
import { M as MapPin } from "./map-pin-BIsfF69s.js";
import { S as Stethoscope } from "./stethoscope-D-aIEydT.js";
import { C as Calendar } from "./calendar-Bvz1_IFC.js";
import { I as IndianRupee } from "./indian-rupee-Djooemvo.js";
import { C as CircleX } from "./circle-x-BhCwsmLJ.js";
import { C as Car } from "./car-BjdlUOmQ.js";
import { B as Bus } from "./shopping-bag-BzZn_4tB.js";
import { C as CircleCheck } from "./circle-check-WCRvny-0.js";
import { P as Pen, T as Trash2 } from "./trash-2-BfRM1amf.js";
import { P as Plus } from "./plus-Da-FwgP0.js";
import { C as Clock } from "./clock-DlZ5GBoQ.js";
import { P as Phone } from "./phone-BP-Fu9v9.js";
import { G as Globe } from "./globe-Cuy1i2SR.js";
import "./index-BhtksvJ9.js";
import "./index-CqG-1QED.js";
import "./index--B7DhM78.js";
import "./chevron-down-CzeR_bKM.js";
import "./chevron-up-C5jdeDnv.js";
import "./use-mobile-D6poQPa6.js";
import "./settings-Cdee9qyh.js";
import "./wallet-R4k-qtGw.js";
import "./mock-data-QUu4nJep.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "18.5", cy: "17.5", r: "3.5", key: "15x4ox" }],
  ["circle", { cx: "5.5", cy: "17.5", r: "3.5", key: "1noe27" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["path", { d: "M12 17.5V14l-3-3 4-3 2 3h2", key: "1npguv" }]
];
const Bike = createLucideIcon("bike", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = createLucideIcon("briefcase", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode);
const statusStyles = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  confirmed: "bg-green-500/10 text-green-700 border-green-500/20",
  completed: "bg-secondary/10 text-secondary border-secondary/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  accepted: "bg-green-500/10 text-green-700 border-green-500/20",
  ongoing: "bg-primary/10 text-primary border-primary/20"
};
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: `text-xs capitalize ${statusStyles[status] ?? "bg-muted text-muted-foreground"}`,
      children: status
    }
  );
}
const vehicleIcons = {
  auto: Car,
  bike: Bike,
  cab: Car
};
function BookingsTab() {
  const { data: appointments, isLoading: apptLoading } = useAppointments();
  const { data: rides, isLoading: ridesLoading } = useRides();
  const isLoading = apptLoading || ridesLoading;
  const bookings = [
    ...(appointments ?? []).map(
      (a) => ({ kind: "appointment", data: a })
    ),
    ...(rides ?? []).map((r) => ({ kind: "ride", data: r }))
  ].sort((a, b) => {
    const dateA = a.kind === "appointment" ? a.data.date : a.data.requestedAt;
    const dateB = b.kind === "appointment" ? b.data.date : b.data.requestedAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  const isActive = (status) => ["pending", "confirmed", "accepted", "ongoing"].includes(status);
  function handleCancel(id) {
    ue.success(`Booking #${id} cancellation requested.`);
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "bookings.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }, i)) });
  }
  if (!bookings.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-muted-foreground",
        "data-ocid": "bookings.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-12 h-12 mb-4 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No bookings yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Your appointments and rides will appear here" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "bookings.list", children: bookings.map((item, idx) => {
    if (item.kind === "appointment") {
      const a = item.data;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-border",
          "data-ocid": `bookings.item.${idx + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-foreground text-sm", children: a.doctorName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: a.specialty })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                  a.date,
                  " · ",
                  a.time
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3 h-3" }),
                  "₹",
                  a.fee
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs text-muted-foreground",
                    children: "Healthcare"
                  }
                )
              ] })
            ] }),
            isActive(a.status) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-destructive hover:text-destructive hover:bg-destructive/10 text-xs px-2 flex-shrink-0",
                onClick: () => handleCancel(String(a.id)),
                "data-ocid": `bookings.cancel_button.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 mr-1" }),
                  "Cancel"
                ]
              }
            )
          ] })
        },
        `appt-${a.id}`
      );
    }
    const r = item.data;
    const VehicleIcon = vehicleIcons[r.vehicleType] ?? Bus;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "border-border",
        "data-ocid": `bookings.item.${idx + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VehicleIcon, { className: "w-5 h-5 text-secondary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-semibold text-foreground text-sm capitalize", children: [
                  r.vehicleType,
                  " Ride"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                  r.from,
                  " → ",
                  r.to
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
                r.distance,
                " km"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3 h-3" }),
                "₹",
                r.fare
              ] }),
              r.driverName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "Driver: ",
                r.driverName
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs text-muted-foreground",
                  children: "Transport"
                }
              )
            ] })
          ] }),
          isActive(r.status) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-destructive hover:text-destructive hover:bg-destructive/10 text-xs px-2 flex-shrink-0",
              onClick: () => handleCancel(String(r.id)),
              "data-ocid": `bookings.cancel_button.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 mr-1" }),
                "Cancel"
              ]
            }
          )
        ] })
      },
      `ride-${r.id}`
    );
  }) });
}
const addressIcons = {
  home: House,
  work: Briefcase,
  custom: MapPin
};
const addressColors = {
  home: "bg-primary/10 text-primary",
  work: "bg-secondary/10 text-secondary",
  custom: "bg-accent/10 text-accent"
};
const initialAddresses = [
  {
    id: 1,
    type: "home",
    label: "Home",
    address: "34, Indiranagar 1st Cross, Bengaluru, Karnataka 560038"
  },
  {
    id: 2,
    type: "work",
    label: "Office",
    address: "Embassy Tech Village, Bellandur, Bengaluru, Karnataka 560103"
  },
  {
    id: 3,
    type: "custom",
    label: "Mom's Place",
    address: "12A, Rajajinagar, Bengaluru, Karnataka 560010"
  }
];
function AddressesTab() {
  const [addresses, setAddresses] = reactExports.useState(initialAddresses);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editText, setEditText] = reactExports.useState("");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [newType, setNewType] = reactExports.useState("custom");
  const [newLabel, setNewLabel] = reactExports.useState("");
  const [newAddress, setNewAddress] = reactExports.useState("");
  function startEdit(addr) {
    setEditingId(addr.id);
    setEditText(addr.address);
  }
  function saveEdit(id) {
    setAddresses(
      (prev) => prev.map((a) => a.id === id ? { ...a, address: editText } : a)
    );
    setEditingId(null);
    ue.success("Address updated");
  }
  function deleteAddress(id) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    ue.success("Address removed");
  }
  function addAddress() {
    if (!newAddress.trim()) {
      ue.error("Please enter an address");
      return;
    }
    const label = newLabel.trim() || (newType === "home" ? "Home" : newType === "work" ? "Work" : "Custom");
    setAddresses((prev) => [
      ...prev,
      { id: Date.now(), type: newType, label, address: newAddress.trim() }
    ]);
    setNewType("custom");
    setNewLabel("");
    setNewAddress("");
    setShowAdd(false);
    ue.success("Address saved");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "addresses.section", children: [
    addresses.map((addr, idx) => {
      const Icon = addressIcons[addr.type];
      const colorClass = addressColors[addr.type];
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-border",
          "data-ocid": `addresses.item.${idx + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground mb-0.5", children: addr.label }),
              editingId === addr.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: editText,
                    onChange: (e) => setEditText(e.target.value),
                    className: "text-sm",
                    "data-ocid": `addresses.edit_input.${idx + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "gap-1 text-xs",
                      onClick: () => saveEdit(addr.id),
                      "data-ocid": `addresses.save_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                        "Save"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "text-xs",
                      onClick: () => setEditingId(null),
                      "data-ocid": `addresses.cancel_button.${idx + 1}`,
                      children: "Cancel"
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: addr.address })
            ] }),
            editingId !== addr.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "w-8 h-8 p-0 text-muted-foreground hover:text-foreground",
                  onClick: () => startEdit(addr),
                  "data-ocid": `addresses.edit_button.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "w-8 h-8 p-0 text-muted-foreground hover:text-destructive",
                  onClick: () => deleteAddress(addr.id),
                  "data-ocid": `addresses.delete_button.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] }) })
        },
        addr.id
      );
    }),
    showAdd ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "border-primary/30 bg-primary/5",
        "data-ocid": "addresses.add_form",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground", children: "Add New Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: newType,
                  onValueChange: (v) => setNewType(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-9 text-sm",
                        "data-ocid": "addresses.type_select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "home", children: "🏠 Home" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "work", children: "💼 Work" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "custom", children: "📍 Custom" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Label (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. Gym, School",
                  value: newLabel,
                  onChange: (e) => setNewLabel(e.target.value),
                  className: "h-9 text-sm",
                  "data-ocid": "addresses.label_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Full Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Street, Area, City, State, PIN",
                value: newAddress,
                onChange: (e) => setNewAddress(e.target.value),
                className: "text-sm",
                "data-ocid": "addresses.address_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1 text-xs",
                onClick: addAddress,
                "data-ocid": "addresses.submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                  "Save Address"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-xs",
                onClick: () => setShowAdd(false),
                "data-ocid": "addresses.cancel_add_button",
                children: "Cancel"
              }
            )
          ] })
        ] })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        className: "w-full border-dashed gap-2 text-muted-foreground hover:text-foreground",
        onClick: () => setShowAdd(true),
        "data-ocid": "addresses.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          "Add New Address"
        ]
      }
    )
  ] });
}
const LANGUAGES = [
  "English",
  "Hindi",
  "Kannada",
  "Tamil",
  "Telugu",
  "Marathi",
  "Bengali",
  "Gujarati"
];
function ProfileTab() {
  const { data: user, isLoading } = useCurrentUserProfile();
  const [editing, setEditing] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "Amit Verma",
    email: "amit.verma@email.com",
    phone: "9876543210",
    city: "Bengaluru",
    language: "English"
  });
  function handleEdit() {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        language: "English"
      });
    }
    setEditing(true);
  }
  function handleSave() {
    setEditing(false);
    ue.success("Profile updated successfully");
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "profile.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" })
    ] });
  }
  const profileFields = [
    { icon: User, label: "Full Name", key: "name", type: "text" },
    {
      icon: Mail,
      label: "Email Address",
      key: "email",
      type: "email"
    },
    { icon: Phone, label: "Phone Number", key: "phone", type: "tel" },
    { icon: MapPin, label: "City", key: "city", type: "text" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "profile.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-gradient-to-r from-primary/5 to-secondary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-display font-black text-2xl flex-shrink-0 shadow-elevated", children: form.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-foreground text-lg", children: form.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
          form.city
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
          "Member since September 2025"
        ] })
      ] }),
      !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-1.5 flex-shrink-0",
          onClick: handleEdit,
          "data-ocid": "profile.edit_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" }),
            "Edit"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", "data-ocid": "profile.info_card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-4", children: [
      profileFields.map(({ icon: Icon, label, key, type }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1.5 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5" }),
          label
        ] }),
        editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type,
            value: form[key],
            onChange: (e) => setForm((p) => ({ ...p, [key]: e.target.value })),
            className: "text-sm",
            "data-ocid": `profile.${key}_input`
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground bg-muted/30 rounded-lg px-3 py-2", children: form[key] })
      ] }, key)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1.5 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5" }),
          "Preferred Language"
        ] }),
        editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.language,
            onValueChange: (v) => setForm((p) => ({ ...p, language: v })),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "text-sm",
                  "data-ocid": "profile.language_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: LANGUAGES.map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: lang, children: lang }, lang)) })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground bg-muted/30 rounded-lg px-3 py-2", children: form.language })
      ] }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "flex-1 gap-1.5",
            onClick: handleSave,
            "data-ocid": "profile.save_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
              "Save Changes"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "flex-1",
            onClick: () => setEditing(false),
            "data-ocid": "profile.cancel_button",
            children: "Cancel"
          }
        )
      ] })
    ] }) })
  ] });
}
function MyDashboardPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UserLayout, { title: "My Account", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto", "data-ocid": "my-dashboard.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "bookings", "data-ocid": "my-dashboard.tabs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full grid grid-cols-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsTrigger,
        {
          value: "bookings",
          className: "gap-1.5 text-xs sm:text-sm",
          "data-ocid": "my-dashboard.bookings_tab",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Bookings & Orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Bookings" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsTrigger,
        {
          value: "addresses",
          className: "gap-1.5 text-xs sm:text-sm",
          "data-ocid": "my-dashboard.addresses_tab",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Saved Addresses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Addresses" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsTrigger,
        {
          value: "profile",
          className: "gap-1.5 text-xs sm:text-sm",
          "data-ocid": "my-dashboard.profile_tab",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5" }),
            "Profile"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "bookings", "data-ocid": "my-dashboard.bookings_panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookingsTab, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsContent,
      {
        value: "addresses",
        "data-ocid": "my-dashboard.addresses_panel",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddressesTab, {})
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "profile", "data-ocid": "my-dashboard.profile_panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileTab, {}) })
  ] }) }) });
}
export {
  MyDashboardPage as default
};

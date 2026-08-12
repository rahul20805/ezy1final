import { r as reactExports, j as jsxRuntimeExports } from "./index-GEfUMtq2.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-C_kQCAO5.js";
import { B as Badge, a as Button, U as User } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { I as Input } from "./input-C_cKZiLe.js";
import { L as Label } from "./label-DcRWHh-S.js";
import { S as Switch } from "./switch-u-QYo-AU.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, d as TabsContent } from "./tabs-iPOSN1gI.js";
import { T as Textarea } from "./textarea-B9ovXcnp.js";
import { V as VendorLayout } from "./VendorLayout-BEQTnqav.js";
import { W as Wrench } from "./wrench-D4Edno-4.js";
import { S as Star } from "./star-DBKcwqmk.js";
import { P as Plus } from "./plus-Da-FwgP0.js";
import { P as Pen, T as Trash2 } from "./trash-2-BfRM1amf.js";
import { M as MapPin } from "./map-pin-BIsfF69s.js";
import { C as Clock } from "./clock-DlZ5GBoQ.js";
import { C as CircleCheckBig } from "./circle-check-big-J2sAcsAA.js";
import { C as CircleX } from "./circle-x-BhCwsmLJ.js";
import { I as IndianRupee } from "./indian-rupee-Djooemvo.js";
import "./use-mobile-D6poQPa6.js";
import "./index-BhtksvJ9.js";
import "./index--B7DhM78.js";
import "./index-CqG-1QED.js";
import "./separator-MnlSgxQn.js";
import "./settings-Cdee9qyh.js";
import "./store-D2Qp7_w_.js";
import "./package-zWNh2T3t.js";
import "./shopping-cart-DwTwGXD5.js";
import "./trending-up-Ccfrjoep.js";
const SP_INFO = {
  name: "Suresh Electricals",
  providerName: "Suresh Nair",
  serviceType: "Electrician",
  rating: 4.7,
  totalJobs: 187
};
const INITIAL_SERVICES = [
  {
    id: 1,
    name: "Home Wiring Repair",
    description: "Fix faulty home wiring and circuit breakers",
    price: 600,
    available: true
  },
  {
    id: 2,
    name: "Fan Installation",
    description: "Install ceiling or wall fans including wiring",
    price: 350,
    available: true
  },
  {
    id: 3,
    name: "Switchboard Replacement",
    description: "Replace old modular switchboards and sockets",
    price: 450,
    available: false
  }
];
const INITIAL_REQUESTS = [
  {
    id: 1,
    customer: "Priya S.",
    service: "Home Wiring Repair",
    location: "Koramangala, Bengaluru",
    date: "Apr 15, 2:00 PM",
    status: "pending"
  },
  {
    id: 2,
    customer: "Rahul K.",
    service: "Fan Installation",
    location: "HSR Layout, Bengaluru",
    date: "Apr 16, 10:00 AM",
    status: "pending"
  },
  {
    id: 3,
    customer: "Anita M.",
    service: "Switchboard Replacement",
    location: "Jayanagar, Bengaluru",
    date: "Apr 14, 4:00 PM",
    status: "accepted"
  }
];
const SERVICE_HISTORY = [
  {
    id: 1,
    customer: "Geeta Devi",
    service: "Home Wiring Repair",
    date: "Apr 10",
    amount: 600,
    review: "Very professional work. Highly recommend!",
    rating: 5
  },
  {
    id: 2,
    customer: "Arjun M.",
    service: "Fan Installation",
    date: "Apr 8",
    amount: 350,
    review: "Done quickly and cleanly. Good service.",
    rating: 4
  },
  {
    id: 3,
    customer: "Lakshmi R.",
    service: "Switchboard Replacement",
    date: "Apr 5",
    amount: 450,
    review: "Excellent work, very punctual.",
    rating: 5
  }
];
const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  available: true
};
const REQ_STATUS_CFG = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
  },
  accepted: {
    label: "Accepted",
    className: "bg-green-500/10 text-green-700 border-green-500/20"
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20"
  },
  completed: {
    label: "Completed",
    className: "bg-secondary/10 text-secondary border-secondary/20"
  }
};
function ServiceProviderDashboardPage() {
  const [services, setServices] = reactExports.useState(INITIAL_SERVICES);
  const [requests, setRequests] = reactExports.useState(INITIAL_REQUESTS);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = reactExports.useState("services");
  function openAddForm() {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }
  function openEditForm(svc) {
    setFormData({
      name: svc.name,
      description: svc.description,
      price: String(svc.price),
      available: svc.available
    });
    setEditingId(svc.id);
    setShowForm(true);
  }
  function handleSave() {
    if (editingId !== null) {
      setServices(
        (prev) => prev.map(
          (s) => s.id === editingId ? {
            ...s,
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            available: formData.available
          } : s
        )
      );
    } else {
      setServices((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          available: formData.available
        }
      ]);
    }
    setShowForm(false);
    setEditingId(null);
  }
  function handleDelete(id) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }
  function handleToggle(id) {
    setServices(
      (prev) => prev.map((s) => s.id === id ? { ...s, available: !s.available } : s)
    );
  }
  function handleRequestAction(id, action) {
    setRequests(
      (prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r)
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VendorLayout, { title: "Service Provider Dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "w-7 h-7 text-accent" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-lg text-foreground", children: SP_INFO.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            SP_INFO.providerName,
            " · ",
            SP_INFO.serviceType
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 text-yellow-500 fill-yellow-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: SP_INFO.rating }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "(",
              SP_INFO.totalJobs,
              " jobs)"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500/10 text-green-700 border-green-500/20", children: "● Active" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: activeTab,
        onValueChange: setActiveTab,
        "data-ocid": "sp_dashboard.tabs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "services", "data-ocid": "sp_dashboard.tab.services", children: "My Services" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "requests", "data-ocid": "sp_dashboard.tab.requests", children: [
              "Service Requests",
              requests.filter((r) => r.status === "pending").length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 text-xs bg-primary text-primary-foreground border-0 px-1.5 py-0", children: requests.filter((r) => r.status === "pending").length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "history", "data-ocid": "sp_dashboard.tab.history", children: "History" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "services", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                services.length,
                " services offered"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "gap-2",
                  onClick: openAddForm,
                  "data-ocid": "sp_dashboard.add_service_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    " Add Service"
                  ]
                }
              )
            ] }),
            showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "mb-4 border-2 border-accent/20",
                "data-ocid": "sp_dashboard.service_form",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: editingId ? "Edit Service" : "New Service" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Service Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          placeholder: "e.g. Fan Installation",
                          value: formData.name,
                          onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                          "data-ocid": "sp_dashboard.service_name.input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Price per Hour (₹)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          placeholder: "e.g. 400",
                          value: formData.price,
                          onChange: (e) => setFormData({ ...formData, price: e.target.value }),
                          "data-ocid": "sp_dashboard.service_price.input"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        placeholder: "Describe what this service includes...",
                        rows: 2,
                        value: formData.description,
                        onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                        "data-ocid": "sp_dashboard.service_description.textarea"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Switch,
                      {
                        checked: formData.available,
                        onCheckedChange: (v) => setFormData({ ...formData, available: v }),
                        "data-ocid": "sp_dashboard.service_availability.switch"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Currently Available" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        className: "flex-1",
                        onClick: () => setShowForm(false),
                        "data-ocid": "sp_dashboard.service_cancel_button",
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        className: "flex-1",
                        onClick: handleSave,
                        "data-ocid": "sp_dashboard.service_save_button",
                        children: editingId ? "Save Changes" : "Add Service"
                      }
                    )
                  ] })
                ] })
              }
            ),
            services.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-12 text-muted-foreground",
                "data-ocid": "sp_dashboard.services_empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm", children: "No services yet. Add your first service above." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: services.map((svc, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `sp_dashboard.service.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground truncate", children: svc.name }),
                      !svc.available && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-xs text-muted-foreground",
                          children: "Unavailable"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: svc.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-accent mt-1 block", children: [
                      "₹",
                      svc.price,
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground text-xs", children: "/hr" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Switch,
                      {
                        checked: svc.available,
                        onCheckedChange: () => handleToggle(svc.id),
                        "data-ocid": `sp_dashboard.availability_toggle.${i + 1}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        onClick: () => openEditForm(svc),
                        "data-ocid": `sp_dashboard.edit_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          "data-ocid": `sp_dashboard.delete_button.${i + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "sp_dashboard.delete_dialog", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Remove service?" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                            '"',
                            svc.name,
                            '" will be permanently removed from your offerings.'
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "sp_dashboard.delete_cancel_button", children: "Cancel" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            AlertDialogAction,
                            {
                              onClick: () => handleDelete(svc.id),
                              "data-ocid": "sp_dashboard.delete_confirm_button",
                              children: "Remove"
                            }
                          )
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              },
              svc.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "requests", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: requests.map((req, i) => {
            const cfg = REQ_STATUS_CFG[req.status];
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `sp_dashboard.request.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 flex-wrap mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground", children: req.customer })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-0.5", children: req.service }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
                        req.location
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                        req.date
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-xs ${cfg.className}`, children: cfg.label })
                  ] }),
                  req.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "flex-1 gap-1 text-green-700 border-green-500/30 hover:bg-green-500/10",
                        onClick: () => handleRequestAction(req.id, "accepted"),
                        "data-ocid": `sp_dashboard.accept_request_button.${i + 1}`,
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
                        onClick: () => handleRequestAction(req.id, "rejected"),
                        "data-ocid": `sp_dashboard.reject_request_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                          " Reject"
                        ]
                      }
                    )
                  ] })
                ] })
              },
              req.id
            );
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", children: SERVICE_HISTORY.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-12 text-muted-foreground",
              "data-ocid": "sp_dashboard.history_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm", children: "No completed services yet." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: SERVICE_HISTORY.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              "data-ocid": `sp_dashboard.history.item.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-sm text-foreground", children: item.customer }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                      item.service,
                      " · ",
                      item.date
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-sm text-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3 h-3 inline" }),
                      item.amount
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 justify-end mt-0.5", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Star,
                      {
                        className: `w-3 h-3 ${star <= item.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`
                      },
                      star
                    )) })
                  ] })
                ] }),
                item.review && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground italic bg-muted/40 rounded-lg px-3 py-2", children: [
                  '"',
                  item.review,
                  '"'
                ] })
              ] })
            },
            item.id
          )) }) })
        ]
      }
    )
  ] });
}
export {
  ServiceProviderDashboardPage as default
};

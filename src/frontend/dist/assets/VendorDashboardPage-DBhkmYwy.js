import { r as reactExports, j as jsxRuntimeExports } from "./index-GEfUMtq2.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-C_kQCAO5.js";
import { c as createLucideIcon, B as Badge, a as Button } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { I as Input } from "./input-C_cKZiLe.js";
import { L as Label } from "./label-DcRWHh-S.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-yPjcByft.js";
import { S as Switch } from "./switch-u-QYo-AU.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, d as TabsContent } from "./tabs-iPOSN1gI.js";
import { T as Textarea } from "./textarea-B9ovXcnp.js";
import { V as VendorLayout } from "./VendorLayout-BEQTnqav.js";
import { l as listings } from "./mock-data-QUu4nJep.js";
import { S as Star } from "./star-DBKcwqmk.js";
import { P as Package } from "./package-zWNh2T3t.js";
import { S as ShoppingCart } from "./shopping-cart-DwTwGXD5.js";
import { I as IndianRupee } from "./indian-rupee-Djooemvo.js";
import { P as Plus } from "./plus-Da-FwgP0.js";
import { P as Pen, T as Trash2 } from "./trash-2-BfRM1amf.js";
import { C as CircleCheckBig } from "./circle-check-big-J2sAcsAA.js";
import { C as CircleX } from "./circle-x-BhCwsmLJ.js";
import { T as TrendingUp } from "./trending-up-Ccfrjoep.js";
import "./use-mobile-D6poQPa6.js";
import "./index-BhtksvJ9.js";
import "./index-CqG-1QED.js";
import "./index--B7DhM78.js";
import "./chevron-down-CzeR_bKM.js";
import "./chevron-up-C5jdeDnv.js";
import "./separator-MnlSgxQn.js";
import "./settings-Cdee9qyh.js";
import "./store-D2Qp7_w_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
const VENDOR_STATUS = "pending";
const VENDOR_NAME = "Sharma Kirana Store";
const MOCK_ORDERS = [
  {
    id: 1,
    customer: "Ravi Kumar",
    item: "Basmati Rice × 5kg",
    date: "2026-04-14",
    status: "pending",
    amount: 600
  },
  {
    id: 2,
    customer: "Sunita Devi",
    item: "Toor Dal × 2kg",
    date: "2026-04-13",
    status: "completed",
    amount: 190
  },
  {
    id: 3,
    customer: "Arjun M.",
    item: "Basmati Rice × 2kg",
    date: "2026-04-12",
    status: "completed",
    amount: 240
  },
  {
    id: 4,
    customer: "Priya S.",
    item: "Toor Dal × 1kg",
    date: "2026-04-11",
    status: "rejected",
    amount: 95
  }
];
const EARNINGS = { today: 830, week: 4200, month: 14500 };
const EARNINGS_HISTORY = [
  {
    id: 1,
    customer: "Ravi Kumar",
    item: "Basmati Rice × 5kg",
    amount: 600,
    date: "2026-04-14"
  },
  {
    id: 2,
    customer: "Sunita Devi",
    item: "Toor Dal × 2kg",
    amount: 190,
    date: "2026-04-13"
  },
  {
    id: 3,
    customer: "Arjun M.",
    item: "Basmati Rice × 2kg",
    amount: 240,
    date: "2026-04-12"
  }
];
const STATUS_CONFIG = {
  pending: {
    label: "Pending Approval",
    className: "bg-muted text-muted-foreground border-border"
  },
  approved: {
    label: "Active",
    className: "bg-primary/10 text-primary border-primary/20"
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20"
  }
};
const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-border"
  },
  completed: {
    label: "Completed",
    className: "bg-primary/10 text-primary border-primary/20"
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20"
  }
};
const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  category: "",
  available: true
};
function VendorDashboardPage() {
  const [listings$1, setListings] = reactExports.useState(
    listings.filter((l) => l.vendorId === 1)
  );
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState(EMPTY_FORM);
  const [orders, setOrders] = reactExports.useState(MOCK_ORDERS);
  const [activeTab, setActiveTab] = reactExports.useState("listings");
  const stats = {
    totalListings: listings$1.length,
    activeOrders: orders.filter((o) => o.status === "pending").length,
    earnings: EARNINGS.month,
    rating: 4.5
  };
  function openAddForm() {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }
  function openEditForm(listing) {
    setFormData({
      title: listing.name,
      description: listing.description,
      price: String(listing.price),
      category: listing.category,
      available: listing.available
    });
    setEditingId(listing.id);
    setShowForm(true);
  }
  function handleSave() {
    if (editingId !== null) {
      setListings(
        (prev) => prev.map(
          (l) => l.id === editingId ? {
            ...l,
            name: formData.title,
            description: formData.description,
            price: Number(formData.price),
            category: formData.category,
            available: formData.available
          } : l
        )
      );
    } else {
      const newListing = {
        id: Date.now(),
        vendorId: 1,
        name: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        available: formData.available
      };
      setListings((prev) => [...prev, newListing]);
    }
    setShowForm(false);
    setEditingId(null);
  }
  function handleDelete(id) {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }
  function handleToggleAvailable(id) {
    setListings(
      (prev) => prev.map((l) => l.id === id ? { ...l, available: !l.available } : l)
    );
  }
  function handleOrderAction(id, action) {
    setOrders(
      (prev) => prev.map((o) => o.id === id ? { ...o, status: action } : o)
    );
  }
  const statusCfg = STATUS_CONFIG[VENDOR_STATUS];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VendorLayout, { title: "Vendor Dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-5 flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3",
        "data-ocid": "vendor_dashboard.pending_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-body text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Your application is under review." }),
            " ",
            "Ezy1 team will verify and activate your account within 24–48 hours."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: VENDOR_NAME }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: `mt-1 text-xs ${statusCfg.className}`, children: [
          "● ",
          statusCfg.label
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: stats.rating }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "rating" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: Package,
          label: "Total Listings",
          value: String(stats.totalListings),
          color: "text-secondary",
          bg: "bg-secondary/10",
          ocid: "vendor_dashboard.stat.listings"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: ShoppingCart,
          label: "Active Orders",
          value: String(stats.activeOrders),
          color: "text-primary",
          bg: "bg-primary/10",
          ocid: "vendor_dashboard.stat.orders"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: IndianRupee,
          label: "Total Earnings",
          value: `₹${stats.earnings.toLocaleString("en-IN")}`,
          color: "text-accent",
          bg: "bg-accent/10",
          ocid: "vendor_dashboard.stat.earnings"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: Star,
          label: "Rating",
          value: String(stats.rating),
          color: "text-primary",
          bg: "bg-primary/10",
          ocid: "vendor_dashboard.stat.rating"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: activeTab,
        onValueChange: setActiveTab,
        "data-ocid": "vendor_dashboard.tabs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "listings",
                "data-ocid": "vendor_dashboard.tab.listings",
                children: "My Listings"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "orders", "data-ocid": "vendor_dashboard.tab.orders", children: "Orders / Requests" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "earnings",
                "data-ocid": "vendor_dashboard.tab.earnings",
                children: "Earnings"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "listings", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                listings$1.length,
                " listings"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "gap-2",
                  onClick: openAddForm,
                  "data-ocid": "vendor_dashboard.add_listing_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    " Add New Listing"
                  ]
                }
              )
            ] }),
            showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "mb-4 border-2 border-primary/20",
                "data-ocid": "vendor_dashboard.listing_form",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: editingId ? "Edit Listing" : "New Listing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          placeholder: "Product name",
                          value: formData.title,
                          onChange: (e) => setFormData({ ...formData, title: e.target.value }),
                          "data-ocid": "vendor_dashboard.listing_title.input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Price (₹)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          placeholder: "e.g. 120",
                          value: formData.price,
                          onChange: (e) => setFormData({ ...formData, price: e.target.value }),
                          "data-ocid": "vendor_dashboard.listing_price.input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: formData.category,
                          onValueChange: (v) => setFormData({ ...formData, category: v }),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "vendor_dashboard.listing_category.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Grocery", children: "Grocery" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Food", children: "Food" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pharmacy", children: "Pharmacy" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Electronics", children: "Electronics" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                            ] })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Switch,
                        {
                          checked: formData.available,
                          onCheckedChange: (v) => setFormData({ ...formData, available: v }),
                          "data-ocid": "vendor_dashboard.listing_availability.switch"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Available" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        placeholder: "Describe the product...",
                        rows: 2,
                        value: formData.description,
                        onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                        "data-ocid": "vendor_dashboard.listing_description.textarea"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        className: "flex-1",
                        onClick: () => setShowForm(false),
                        "data-ocid": "vendor_dashboard.listing_cancel_button",
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        className: "flex-1",
                        onClick: handleSave,
                        "data-ocid": "vendor_dashboard.listing_save_button",
                        children: editingId ? "Save Changes" : "Add Listing"
                      }
                    )
                  ] })
                ] })
              }
            ),
            listings$1.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-12 text-muted-foreground",
                "data-ocid": "vendor_dashboard.listings_empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body", children: "No listings yet. Add your first product above." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: listings$1.map((listing, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `vendor_dashboard.listing.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground truncate", children: listing.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: listing.category })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: listing.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-primary mt-1 block", children: [
                      "₹",
                      listing.price
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Switch,
                      {
                        checked: listing.available,
                        onCheckedChange: () => handleToggleAvailable(listing.id),
                        "data-ocid": `vendor_dashboard.availability_toggle.${i + 1}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        onClick: () => openEditForm(listing),
                        "data-ocid": `vendor_dashboard.edit_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          "data-ocid": `vendor_dashboard.delete_button.${i + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "vendor_dashboard.delete_dialog", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete listing?" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                            '"',
                            listing.name,
                            '" will be permanently removed.'
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "vendor_dashboard.delete_cancel_button", children: "Cancel" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            AlertDialogAction,
                            {
                              onClick: () => handleDelete(listing.id),
                              "data-ocid": "vendor_dashboard.delete_confirm_button",
                              children: "Delete"
                            }
                          )
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              },
              listing.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "orders", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.map((order, i) => {
            const cfg = ORDER_STATUS_CONFIG[order.status];
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `vendor_dashboard.order.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-sm text-foreground", children: order.customer }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: order.item }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: order.date })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-sm text-foreground", children: [
                        "₹",
                        order.amount
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-xs ${cfg.className}`, children: cfg.label })
                    ] })
                  ] }),
                  order.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "flex-1 gap-1 text-primary border-primary/30 hover:bg-primary/10",
                        onClick: () => handleOrderAction(order.id, "completed"),
                        "data-ocid": `vendor_dashboard.order_accept_button.${i + 1}`,
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
                        onClick: () => handleOrderAction(order.id, "rejected"),
                        "data-ocid": `vendor_dashboard.order_reject_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                          " Reject"
                        ]
                      }
                    )
                  ] })
                ] })
              },
              order.id
            );
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "earnings", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "vendor_dashboard.earnings.today", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Today" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-lg text-foreground", children: [
                  "₹",
                  EARNINGS.today.toLocaleString("en-IN")
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "vendor_dashboard.earnings.week", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "This Week" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-lg text-foreground", children: [
                  "₹",
                  EARNINGS.week.toLocaleString("en-IN")
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "vendor_dashboard.earnings.month", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "This Month" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-lg text-primary", children: [
                  "₹",
                  EARNINGS.month.toLocaleString("en-IN")
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-secondary" }),
              " Recent Transactions"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: EARNINGS_HISTORY.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                "data-ocid": `vendor_dashboard.earnings_tx.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground", children: t.customer }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                      t.item,
                      " · ",
                      t.date
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-sm text-primary", children: [
                    "+₹",
                    t.amount
                  ] })
                ] })
              },
              t.id
            )) })
          ] })
        ]
      }
    )
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": ocid, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${color}` })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-base text-foreground", children: value })
    ] })
  ] }) });
}
export {
  VendorDashboardPage as default
};

import { r as reactExports, j as jsxRuntimeExports } from "./index-GEfUMtq2.js";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-C_kQCAO5.js";
import { B as Badge, a as Button } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter, B as Building2 } from "./dialog-DZpLDYFt.js";
import { L as Label } from "./label-DcRWHh-S.js";
import { S as Switch } from "./switch-u-QYo-AU.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, d as TabsContent } from "./tabs-iPOSN1gI.js";
import { T as Textarea } from "./textarea-B9ovXcnp.js";
import { u as ue } from "./index-Dm_dm9hF.js";
import { L as Layout } from "./Layout-bisDsjVo.js";
import { U as Users } from "./users-C8iVPovn.js";
import { S as Store } from "./store-D2Qp7_w_.js";
import { C as Car } from "./car-BjdlUOmQ.js";
import { C as Clock } from "./clock-DlZ5GBoQ.js";
import { S as Shield } from "./shield-BzTw_sn8.js";
import { C as CircleCheck } from "./circle-check-WCRvny-0.js";
import { C as CircleX } from "./circle-x-BhCwsmLJ.js";
import { R as RefreshCw } from "./refresh-cw-9FNq-DtI.js";
import { T as TriangleAlert } from "./triangle-alert-DqXmpED9.js";
import { P as Phone } from "./phone-BP-Fu9v9.js";
import { C as ChevronUp } from "./chevron-up-C5jdeDnv.js";
import { C as ChevronDown } from "./chevron-down-CzeR_bKM.js";
import "./use-mobile-D6poQPa6.js";
import "./index-BhtksvJ9.js";
import "./index--B7DhM78.js";
import "./index-CqG-1QED.js";
import "./mock-data-QUu4nJep.js";
import "./map-pin-BIsfF69s.js";
import "./wallet-R4k-qtGw.js";
const seedVendors = () => [
  {
    id: 1,
    businessName: "Sharma Kirana Store",
    ownerName: "Ramesh Sharma",
    category: "Grocery",
    city: "Mumbai",
    address: "12, Andheri West Market",
    phone: "9876543210",
    status: "approved",
    rating: 4.5,
    totalOrders: 340,
    joinedAt: "2025-10-15",
    type: "Shop",
    contact: "9876543210"
  },
  {
    id: 2,
    businessName: "Nair Ayurveda Pharma",
    ownerName: "Krishnan Nair",
    category: "Pharmacy",
    city: "Thiruvananthapuram",
    address: "45, East Fort Road",
    phone: "9845012345",
    status: "approved",
    rating: 4.8,
    totalOrders: 215,
    joinedAt: "2025-11-02",
    type: "Shop",
    contact: "9845012345"
  },
  {
    id: 3,
    businessName: "Patel Fresh Vegetables",
    ownerName: "Hasmukh Patel",
    category: "Fresh Produce",
    city: "Surat",
    address: "Old Vegetable Market, Ring Road",
    phone: "9712200100",
    status: "pending",
    rating: 0,
    totalOrders: 0,
    joinedAt: "2026-04-12",
    type: "Shop",
    contact: "9712200100"
  },
  {
    id: 4,
    businessName: "Reddy Tiffin Centre",
    ownerName: "Suresh Reddy",
    category: "Food",
    city: "Hyderabad",
    address: "78, Begumpet",
    phone: "9703000555",
    status: "approved",
    rating: 4.3,
    totalOrders: 1200,
    joinedAt: "2025-09-01",
    type: "Shop",
    contact: "9703000555"
  },
  {
    id: 5,
    businessName: "Singh Electronics",
    ownerName: "Harpreet Singh",
    category: "Electronics",
    city: "Amritsar",
    address: "Golden Market, Hall Gate",
    phone: "9814700600",
    status: "rejected",
    rating: 0,
    totalOrders: 0,
    joinedAt: "2026-03-28",
    type: "Shop",
    contact: "9814700600",
    rejectionReason: "Incomplete KYC documents submitted"
  },
  {
    id: 6,
    businessName: "Arvind Auto Rides",
    ownerName: "Arvind Kumar",
    category: "Transport",
    city: "Bengaluru",
    address: "Koramangala",
    phone: "9900112233",
    status: "pending",
    rating: 0,
    totalOrders: 0,
    joinedAt: "2026-04-13",
    type: "Driver",
    contact: "9900112233"
  },
  {
    id: 7,
    businessName: "CleanHome Services",
    ownerName: "Deepa Joshi",
    category: "Home Services",
    city: "Pune",
    address: "Kothrud",
    phone: "9988776655",
    status: "pending",
    rating: 0,
    totalOrders: 0,
    joinedAt: "2026-04-11",
    type: "Service",
    contact: "9988776655"
  },
  {
    id: 8,
    businessName: "FastBike Delivery",
    ownerName: "Manoj Tiwari",
    category: "Delivery",
    city: "Lucknow",
    address: "Hazratganj",
    phone: "9765432100",
    status: "rejected",
    rating: 0,
    totalOrders: 0,
    joinedAt: "2026-03-15",
    type: "Driver",
    contact: "9765432100",
    rejectionReason: "Vehicle documents not valid"
  }
];
function typeIcon(type) {
  if (type === "Driver") return /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-4 h-4 text-secondary" });
  if (type === "Service") return /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-accent" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-4 h-4 text-primary" });
}
function typeBg(type) {
  if (type === "Driver") return "bg-secondary/10";
  if (type === "Service") return "bg-accent/10";
  return "bg-primary/10";
}
function AdminPage() {
  const [allVendors, setAllVendors] = reactExports.useState(seedVendors);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [pendingApprove, setPendingApprove] = reactExports.useState(
    null
  );
  const [pendingReject, setPendingReject] = reactExports.useState(null);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [rejectReasonError, setRejectReasonError] = reactExports.useState("");
  const [resubmitTarget, setResubmitTarget] = reactExports.useState(
    null
  );
  const pending = allVendors.filter((v) => v.status === "pending");
  const approved = allVendors.filter((v) => v.status === "approved");
  const rejected = allVendors.filter((v) => v.status === "rejected");
  const totalUsers = 24800;
  const totalDrivers = allVendors.filter((v) => v.type === "Driver").length + 142;
  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString("en-IN"),
      icon: Users,
      bg: "bg-secondary/10",
      color: "text-secondary"
    },
    {
      label: "Active Vendors",
      value: approved.length,
      icon: Store,
      bg: "bg-primary/10",
      color: "text-primary"
    },
    {
      label: "Drivers",
      value: totalDrivers,
      icon: Car,
      bg: "bg-accent/10",
      color: "text-accent"
    },
    {
      label: "Pending Approvals",
      value: pending.length,
      icon: Clock,
      bg: "bg-destructive/10",
      color: "text-destructive"
    }
  ];
  function handleApprove() {
    if (!pendingApprove) return;
    setAllVendors(
      (prev) => prev.map(
        (v) => v.id === pendingApprove.id ? { ...v, status: "approved", deactivated: false } : v
      )
    );
    ue.success(`${pendingApprove.businessName} approved!`, {
      description: "Vendor is now live on the platform."
    });
    setPendingApprove(null);
  }
  function handleReject() {
    if (!pendingReject) return;
    if (!rejectReason.trim()) {
      setRejectReasonError("Please provide a rejection reason.");
      return;
    }
    setAllVendors(
      (prev) => prev.map(
        (v) => v.id === pendingReject.id ? { ...v, status: "rejected", rejectionReason: rejectReason.trim() } : v
      )
    );
    ue.error(`${pendingReject.businessName} rejected.`, {
      description: "Vendor has been notified."
    });
    setPendingReject(null);
    setRejectReason("");
    setRejectReasonError("");
  }
  function handleDeactivateToggle(vendor) {
    const next = !vendor.deactivated;
    setAllVendors(
      (prev) => prev.map((v) => v.id === vendor.id ? { ...v, deactivated: next } : v)
    );
    ue(
      next ? `${vendor.businessName} deactivated` : `${vendor.businessName} reactivated`,
      {
        description: next ? "Vendor is now hidden from platform." : "Vendor is active again."
      }
    );
  }
  function handleResubmit(vendor) {
    setAllVendors(
      (prev) => prev.map(
        (v) => v.id === vendor.id ? { ...v, status: "pending", rejectionReason: void 0 } : v
      )
    );
    ue.success(`${vendor.businessName} moved to Pending`, {
      description: "Vendor will need to update their documents."
    });
    setResubmitTarget(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "container px-4 py-8 space-y-6 max-w-5xl",
        "data-ocid": "admin.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-accent-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Admin Panel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Manage vendors, approvals, and platform health" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 md:grid-cols-4 gap-3",
              "data-ocid": "admin.stats_row",
              children: stats.map(({ label, value, icon: Icon, bg, color }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Card,
                {
                  className: "border-border",
                  "data-ocid": `admin.stat.${label.toLowerCase().replace(/\s+/g, "_")}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${color}` })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-2xl text-foreground leading-none mb-1", children: value }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label })
                  ] })
                },
                label
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "pending", "data-ocid": "admin.tabs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full md:w-auto", "data-ocid": "admin.tabs_list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "pending",
                  className: "flex-1 md:flex-none gap-1.5",
                  "data-ocid": "admin.tab.pending",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                    "Pending",
                    pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 bg-destructive text-destructive-foreground text-xs px-1.5 py-0 h-4 rounded-full", children: pending.length })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "approved",
                  className: "flex-1 md:flex-none gap-1.5",
                  "data-ocid": "admin.tab.approved",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                    "Approved"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: "rejected",
                  className: "flex-1 md:flex-none gap-1.5",
                  "data-ocid": "admin.tab.rejected",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                    "Rejected"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsContent,
              {
                value: "pending",
                className: "mt-4 space-y-3",
                "data-ocid": "admin.pending_panel",
                children: pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center justify-center py-16 text-center",
                    "data-ocid": "admin.pending_empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-muted-foreground" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "All caught up!" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No pending approvals at this time." })
                    ]
                  }
                ) : pending.map((vendor, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  VendorCard,
                  {
                    vendor,
                    idx,
                    expanded: expandedId === vendor.id,
                    onToggleExpand: () => setExpandedId(expandedId === vendor.id ? null : vendor.id),
                    actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "sm",
                          className: "h-8 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5",
                          onClick: () => setPendingApprove(vendor),
                          "data-ocid": `admin.approve_button.${idx + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                            "Approve"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          className: "h-8 text-destructive border-destructive/40 hover:bg-destructive/10 gap-1.5",
                          onClick: () => {
                            setPendingReject(vendor);
                            setRejectReason("");
                            setRejectReasonError("");
                          },
                          "data-ocid": `admin.reject_button.${idx + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                            "Reject"
                          ]
                        }
                      )
                    ] })
                  },
                  vendor.id
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsContent,
              {
                value: "approved",
                className: "mt-4 space-y-3",
                "data-ocid": "admin.approved_panel",
                children: approved.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-col items-center justify-center py-16 text-center",
                    "data-ocid": "admin.approved_empty_state",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No approved vendors yet." })
                  }
                ) : approved.map((vendor, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  VendorCard,
                  {
                    vendor,
                    idx,
                    expanded: expandedId === vendor.id,
                    onToggleExpand: () => setExpandedId(expandedId === vendor.id ? null : vendor.id),
                    actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: `text-xs ${vendor.deactivated ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary border-primary/20"}`,
                          children: vendor.deactivated ? "Deactivated" : "Active"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Switch,
                        {
                          checked: !vendor.deactivated,
                          onCheckedChange: () => handleDeactivateToggle(vendor),
                          "aria-label": `Toggle ${vendor.businessName} status`,
                          "data-ocid": `admin.deactivate_toggle.${idx + 1}`
                        }
                      ) })
                    ] }),
                    meta: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      vendor.totalOrders,
                      " orders · ★ ",
                      vendor.rating
                    ] })
                  },
                  vendor.id
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsContent,
              {
                value: "rejected",
                className: "mt-4 space-y-3",
                "data-ocid": "admin.rejected_panel",
                children: rejected.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-col items-center justify-center py-16 text-center",
                    "data-ocid": "admin.rejected_empty_state",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No rejected vendors." })
                  }
                ) : rejected.map((vendor, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  VendorCard,
                  {
                    vendor,
                    idx,
                    expanded: expandedId === vendor.id,
                    onToggleExpand: () => setExpandedId(expandedId === vendor.id ? null : vendor.id),
                    reasonChip: vendor.rejectionReason ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5 mt-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3 text-destructive flex-shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive line-clamp-2", children: vendor.rejectionReason })
                    ] }) : void 0,
                    actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "h-8 gap-1.5 flex-shrink-0",
                        onClick: () => setResubmitTarget(vendor),
                        "data-ocid": `admin.resubmit_button.${idx + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                          "Resubmit"
                        ]
                      }
                    )
                  },
                  vendor.id
                ))
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!pendingApprove,
        onOpenChange: () => setPendingApprove(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "admin.approve_dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Approve vendor?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: pendingApprove == null ? void 0 : pendingApprove.businessName }),
              " (",
              pendingApprove == null ? void 0 : pendingApprove.type,
              ") will be listed on the platform and can start receiving orders."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "admin.approve_dialog.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                className: "bg-primary text-primary-foreground hover:bg-primary/90",
                onClick: handleApprove,
                "data-ocid": "admin.approve_dialog.confirm_button",
                children: "Yes, Approve"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!pendingReject,
        onOpenChange: (open) => {
          if (!open) {
            setPendingReject(null);
            setRejectReason("");
            setRejectReasonError("");
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.reject_dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Reject vendor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
              "Provide a reason for rejecting",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: pendingReject == null ? void 0 : pendingReject.businessName }),
              ". They will be notified."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reject-reason", className: "text-sm font-medium", children: [
              "Rejection Reason ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "reject-reason",
                placeholder: "e.g. Incomplete KYC, invalid documents, duplicate listing...",
                value: rejectReason,
                onChange: (e) => {
                  setRejectReason(e.target.value);
                  if (rejectReasonError) setRejectReasonError("");
                },
                className: "resize-none min-h-[100px]",
                "data-ocid": "admin.reject_reason_input"
              }
            ),
            rejectReasonError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "admin.reject_reason.field_error",
                children: rejectReasonError
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  setPendingReject(null);
                  setRejectReason("");
                  setRejectReasonError("");
                },
                "data-ocid": "admin.reject_dialog.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: handleReject,
                "data-ocid": "admin.reject_dialog.confirm_button",
                children: "Reject Vendor"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!resubmitTarget,
        onOpenChange: () => setResubmitTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "admin.resubmit_dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Allow resubmission?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: resubmitTarget == null ? void 0 : resubmitTarget.businessName }),
              " will be moved back to the Pending queue so they can update and resubmit their information."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "admin.resubmit_dialog.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: () => resubmitTarget && handleResubmit(resubmitTarget),
                "data-ocid": "admin.resubmit_dialog.confirm_button",
                children: "Yes, Move to Pending"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function VendorCard({
  vendor,
  idx,
  expanded,
  onToggleExpand,
  actions,
  meta,
  reasonChip
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border overflow-hidden",
      "data-ocid": `admin.vendor_card.${idx + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-10 h-10 rounded-xl ${typeBg(vendor.type)} flex items-center justify-center flex-shrink-0 mt-0.5`,
              children: typeIcon(vendor.type)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground truncate", children: vendor.businessName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs px-1.5 py-0 h-5 border-border",
                  children: vendor.type
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
              vendor.ownerName,
              " · ",
              vendor.city,
              " · ",
              vendor.category
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3" }),
              vendor.contact,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-3 h-3" }),
              "Submitted ",
              vendor.joinedAt
            ] }),
            reasonChip,
            meta && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: meta })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 flex-shrink-0", children: [
            actions,
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
                onClick: onToggleExpand,
                "aria-label": expanded ? "Collapse details" : "Expand details",
                "data-ocid": `admin.expand_button.${idx + 1}`,
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  "Less ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  "Details ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5" })
                ] })
              }
            )
          ] })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-muted/30 px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Full Address", value: vendor.address }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Phone", value: vendor.phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Category", value: vendor.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "City", value: vendor.city }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Owner", value: vendor.ownerName }),
          vendor.rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailField,
            {
              label: "Rating",
              value: `★ ${vendor.rating} (${vendor.totalOrders} orders)`
            }
          )
        ] })
      ] })
    }
  );
}
function DetailField({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-0.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground break-words", children: value })
  ] });
}
export {
  AdminPage as default
};

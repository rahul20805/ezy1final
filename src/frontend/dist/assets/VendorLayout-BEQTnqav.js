import { r as reactExports, j as jsxRuntimeExports, b as useRouterState, L as Link } from "./index-GEfUMtq2.js";
import { a as Button, B as Badge, U as User } from "./index-DtH2l02M.js";
import { C as ChevronLeft, B as Bell, L as LayoutDashboard, S as Separator, H as House } from "./separator-MnlSgxQn.js";
import { u as useIsMobile, S as Sheet, a as SheetContent, b as SheetTrigger, M as Menu } from "./use-mobile-D6poQPa6.js";
import { C as ChevronRight, S as Settings } from "./settings-Cdee9qyh.js";
import { S as Store } from "./store-D2Qp7_w_.js";
import { P as Package } from "./package-zWNh2T3t.js";
import { S as ShoppingCart } from "./shopping-cart-DwTwGXD5.js";
import { T as TrendingUp } from "./trending-up-Ccfrjoep.js";
const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/vendor-dashboard",
    badge: null
  },
  {
    icon: Package,
    label: "My Listings",
    href: "/vendor-dashboard",
    badge: null
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/vendor-dashboard",
    badge: "3"
  },
  {
    icon: TrendingUp,
    label: "Earnings",
    href: "/vendor-dashboard",
    badge: null
  },
  {
    icon: Store,
    label: "My Store",
    href: "/vendor-dashboard",
    badge: null
  },
  {
    icon: User,
    label: "Profile",
    href: "/vendor-dashboard",
    badge: null
  }
];
const bottomItems = [
  {
    icon: Bell,
    label: "Notifications",
    href: "/vendor-dashboard"
  },
  { icon: Settings, label: "Settings", href: "/vendor-dashboard" }
];
function VendorSidebarContent({
  collapsed,
  onLinkClick
}) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-sidebar border-r border-sidebar-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex items-center gap-2 p-4 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-4 h-4 text-secondary-foreground" }) }),
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-sm text-sidebar-foreground leading-none", children: [
              "ezy",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground leading-none mt-0.5", children: "Partner Portal" })
          ] })
        ]
      }
    ),
    !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5 border-b border-sidebar-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Store Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20", children: "● Active" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "nav",
      {
        className: "flex-1 p-3 space-y-1 overflow-y-auto",
        "data-ocid": "vendor_sidebar.nav",
        children: sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || item.href !== "/vendor-dashboard" && currentPath.startsWith(item.href);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.href,
              className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-smooth ${collapsed ? "justify-center" : ""} ${isActive ? "bg-secondary text-secondary-foreground shadow-xs" : "text-sidebar-foreground hover:bg-muted"}`,
              onClick: onLinkClick,
              "data-ocid": `vendor_sidebar.link.${item.label.toLowerCase().replace(" ", "_")}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 flex-shrink-0" }),
                !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 min-w-0 truncate", children: item.label }),
                !collapsed && item.badge && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs px-1.5 py-0 bg-primary text-primary-foreground border-0", children: item.badge })
              ]
            },
            item.href
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-1", children: bottomItems.map((item) => {
      const Icon = item.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.href,
          className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body text-sidebar-foreground hover:bg-muted transition-smooth ${collapsed ? "justify-center" : ""}`,
          onClick: onLinkClick,
          "data-ocid": `vendor_sidebar.link.${item.label.toLowerCase()}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 flex-shrink-0" }),
            !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
          ]
        },
        item.href
      );
    }) }),
    !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", "data-ocid": "vendor_sidebar.home_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "w-full gap-2 text-xs text-muted-foreground justify-start",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-3.5 h-3.5" }),
          "Back to Home"
        ]
      }
    ) }) })
  ] });
}
function VendorLayout({ children, title }) {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const isMobile = useIsMobile();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
    !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: `relative flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`,
        "data-ocid": "vendor_sidebar.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(VendorSidebarContent, { collapsed }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-xs hover:bg-muted transition-smooth z-10",
              onClick: () => setCollapsed(!collapsed),
              "data-ocid": "vendor_sidebar.collapse_toggle",
              children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3 h-3 text-muted-foreground" })
            }
          )
        ]
      }
    ),
    isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: mobileOpen, onOpenChange: setMobileOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "left", className: "w-60 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorSidebarContent, { onLinkClick: () => setMobileOpen(false) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-40 bg-card border-b border-border px-4 h-14 flex items-center gap-3 shadow-subtle", children: [
        isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: mobileOpen, onOpenChange: setMobileOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            "data-ocid": "vendor_sidebar.mobile_open_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-6 rounded-full bg-secondary flex-shrink-0" }),
        title && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "font-display font-semibold text-lg text-foreground truncate",
            "data-ocid": "vendor_page.title",
            children: title
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "hidden sm:flex text-xs gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-3 h-3" }),
            "Sharma Kirana Store"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              "data-ocid": "vendor_topbar.notifications_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 md:p-6 overflow-auto", children })
    ] })
  ] });
}
export {
  VendorLayout as V
};

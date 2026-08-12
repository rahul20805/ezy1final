import { r as reactExports, j as jsxRuntimeExports, L as Link, b as useRouterState } from "./index-GEfUMtq2.js";
import { c as createLucideIcon, a as Button, U as User, B as Badge } from "./index-DtH2l02M.js";
import { C as ChevronLeft, B as Bell, L as LayoutDashboard, S as Separator, H as House } from "./separator-MnlSgxQn.js";
import { u as useIsMobile, S as Sheet, a as SheetContent, b as SheetTrigger, M as Menu } from "./use-mobile-D6poQPa6.js";
import { C as ChevronRight, S as Settings } from "./settings-Cdee9qyh.js";
import { W as Wallet } from "./wallet-R4k-qtGw.js";
import { S as Stethoscope } from "./stethoscope-D-aIEydT.js";
import { B as Bus, S as ShoppingBag } from "./shopping-bag-BzZn_4tB.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode);
const sidebarItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard", badge: null },
  {
    icon: Stethoscope,
    label: "Healthcare",
    href: "/dashboard/healthcare",
    badge: null
  },
  { icon: Bus, label: "Transport", href: "/dashboard/transport", badge: null },
  {
    icon: ShoppingBag,
    label: "Shopping",
    href: "/dashboard/shopping",
    badge: null
  },
  { icon: Wallet, label: "My Wallet", href: "/dashboard/wallet", badge: null },
  {
    icon: MessageSquare,
    label: "AI Chat",
    href: "/dashboard/chat",
    badge: "AI"
  },
  { icon: User, label: "My Account", href: "/my-dashboard", badge: null }
];
const bottomItems = [
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" }
];
function SidebarContent({
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground font-display font-black text-sm", children: "e1" }) }),
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg text-sidebar-foreground", children: [
            "ezy",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "nav",
      {
        className: "flex-1 p-3 space-y-1 overflow-y-auto",
        "data-ocid": "sidebar.nav",
        children: sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || item.href !== "/dashboard" && currentPath.startsWith(item.href);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.href,
              className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-smooth ${collapsed ? "justify-center" : ""} ${isActive ? "bg-primary text-primary-foreground shadow-xs" : "text-sidebar-foreground hover:bg-muted"}`,
              onClick: onLinkClick,
              "data-ocid": `sidebar.link.${item.label.toLowerCase().replace(" ", "_")}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 flex-shrink-0" }),
                !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 min-w-0 truncate", children: item.label }),
                !collapsed && item.badge && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs px-1.5 py-0 bg-secondary text-secondary-foreground border-0", children: item.badge })
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
          "data-ocid": `sidebar.link.${item.label.toLowerCase()}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 flex-shrink-0" }),
            !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
          ]
        },
        item.href
      );
    }) }),
    !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", "data-ocid": "sidebar.home_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
function UserLayout({ children, title }) {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const isMobile = useIsMobile();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
    !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: `relative flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`,
        "data-ocid": "sidebar.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { collapsed }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-xs hover:bg-muted transition-smooth z-10",
              onClick: () => setCollapsed(!collapsed),
              "data-ocid": "sidebar.collapse_toggle",
              children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3 h-3 text-muted-foreground" })
            }
          )
        ]
      }
    ),
    isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: mobileOpen, onOpenChange: setMobileOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "left", className: "w-60 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { onLinkClick: () => setMobileOpen(false) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-40 bg-card border-b border-border px-4 h-14 flex items-center gap-3 shadow-subtle", children: [
        isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: mobileOpen, onOpenChange: setMobileOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            "data-ocid": "sidebar.mobile_open_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
          }
        ) }) }),
        title && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "font-display font-semibold text-lg text-foreground truncate",
            "data-ocid": "page.title",
            children: title
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/wallet", "data-ocid": "topbar.wallet_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "gap-1.5 text-sm hidden sm:flex",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "₹1,935" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              "data-ocid": "topbar.notifications_button",
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
  MessageSquare as M,
  UserLayout as U
};

import { r as reactExports, u as useInternetIdentity, j as jsxRuntimeExports, L as Link, s as setCurrentRole } from "./index-GEfUMtq2.js";
import { c as createLucideIcon, a as Button, U as User, B as Badge } from "./index-DtH2l02M.js";
import { u as useIsMobile, S as Sheet, b as SheetTrigger, X, M as Menu, a as SheetContent } from "./use-mobile-D6poQPa6.js";
import { M as MOCK_WALLET_BALANCE } from "./mock-data-QUu4nJep.js";
import { M as MapPin } from "./map-pin-BIsfF69s.js";
import { C as ChevronDown } from "./chevron-down-CzeR_bKM.js";
import { W as Wallet } from "./wallet-R4k-qtGw.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode);
const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Healthcare", href: "/#healthcare" },
  { label: "Transport", href: "/#transport" },
  { label: "Partner", href: "/partner-login" }
];
function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [locationDropdown, setLocationDropdown] = reactExports.useState(false);
  const isMobile = useIsMobile();
  const { loginStatus, login, clear } = useInternetIdentity();
  const isAuthenticated = loginStatus === "success";
  const handleLogin = async () => {
    await login();
    setCurrentRole("user");
  };
  const handleLogout = () => {
    clear();
    setCurrentRole("guest");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-primary w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 bg-card border-b border-border shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container flex items-center justify-between h-16 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center gap-2 group",
          "data-ocid": "nav.logo_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground font-display font-black text-sm", children: "e1" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-xl text-foreground tracking-tight", children: [
              "ezy",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1" })
            ] })
          ]
        }
      ),
      !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "nav",
        {
          className: "flex items-center gap-1",
          "data-ocid": "nav.desktop_links",
          children: navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: link.href,
              className: "px-3 py-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-muted",
              "data-ocid": `nav.link.${link.label.toLowerCase()}`,
              children: link.label
            },
            link.href
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-smooth border border-border",
            onClick: () => setLocationDropdown(!locationDropdown),
            "data-ocid": "nav.location_toggle",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Bengaluru" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3" })
            ]
          }
        ),
        isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", "data-ocid": "nav.dashboard_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "gap-1.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
            !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dashboard" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/wallet", "data-ocid": "nav.wallet_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "gap-1.5 text-sm hidden sm:flex",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
                  "₹",
                  MOCK_WALLET_BALANCE.toLocaleString("en-IN")
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: handleLogout,
              className: "gap-1.5 text-sm text-muted-foreground",
              "data-ocid": "nav.logout_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
                !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Logout" })
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleLogin,
              className: "text-sm",
              "data-ocid": "nav.login_button",
              children: "Login"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/partner-login",
              className: "hidden sm:block",
              "data-ocid": "nav.partner_login_link",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "text-sm bg-primary text-primary-foreground hover:bg-primary/90",
                  children: [
                    "Partner",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "secondary",
                        className: "ml-1.5 text-xs px-1.5 py-0 bg-primary-foreground/20 text-primary-foreground",
                        children: "Join"
                      }
                    )
                  ]
                }
              )
            }
          )
        ] }),
        isMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open: mobileOpen, onOpenChange: setMobileOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              "data-ocid": "nav.mobile_menu_button",
              children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "right", className: "w-72 bg-card p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-4 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground font-display font-black text-sm", children: "e1" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-xl text-foreground", children: [
                "ezy",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-medium", children: "Bengaluru" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 text-muted-foreground ml-auto" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "nav",
              {
                className: "flex flex-col p-3 gap-1",
                "data-ocid": "nav.mobile_links",
                children: [
                  navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: link.href,
                      className: "flex items-center px-3 py-3 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth",
                      onClick: () => setMobileOpen(false),
                      "data-ocid": `nav.mobile_link.${link.label.toLowerCase()}`,
                      children: link.label
                    },
                    link.href
                  )),
                  isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/dashboard",
                        className: "flex items-center gap-2 px-3 py-3 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth",
                        onClick: () => setMobileOpen(false),
                        "data-ocid": "nav.mobile_dashboard_link",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary" }),
                          "My Dashboard"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/dashboard",
                        className: "flex items-center gap-2 px-3 py-3 text-sm font-body text-foreground hover:bg-muted rounded-lg transition-smooth",
                        onClick: () => setMobileOpen(false),
                        "data-ocid": "nav.mobile_wallet_link",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4 text-secondary" }),
                          "Wallet — ₹",
                          MOCK_WALLET_BALANCE.toLocaleString("en-IN")
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto p-4 border-t border-border", children: isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "w-full gap-2",
                onClick: () => {
                  handleLogout();
                  setMobileOpen(false);
                },
                "data-ocid": "nav.mobile_logout_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
                  "Sign Out"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full bg-primary text-primary-foreground hover:bg-primary/90",
                  onClick: () => {
                    handleLogin();
                    setMobileOpen(false);
                  },
                  "data-ocid": "nav.mobile_login_button",
                  children: "Login / Sign Up"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/partner-login",
                  onClick: () => setMobileOpen(false),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      className: "w-full",
                      "data-ocid": "nav.mobile_partner_button",
                      children: "Join as Partner"
                    }
                  )
                }
              )
            ] }) })
          ] }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground font-display font-black text-sm", children: "e1" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-xl text-foreground", children: [
              "ezy",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-xs", children: "Everything App Connecting India. From daily essentials to digital services — all in one place for every Indian." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20 text-xs", children: "🇮🇳 Made for India" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Available in Hindi & English" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-foreground mb-3 text-sm", children: "Quick Links" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: [
            "About",
            "Services",
            "Partner With Us",
            "Careers",
            "Press"
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/#",
              className: "text-sm text-muted-foreground hover:text-primary transition-colors",
              children: item
            }
          ) }, item)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-foreground mb-3 text-sm", children: "Support" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: [
            "Help Centre",
            "Safety",
            "Privacy Policy",
            "Terms of Service",
            "Grievance"
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/#",
              className: "text-sm text-muted-foreground hover:text-primary transition-colors",
              children: item
            }
          ) }, item)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ". Built with love using",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : ""
              )}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-primary hover:underline",
              children: "caffeine.ai"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "🔒 Secure & Trusted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "📍 Hyperlocal First" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Layout as L
};

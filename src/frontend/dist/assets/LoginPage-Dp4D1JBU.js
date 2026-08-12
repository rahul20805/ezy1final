import { u as useInternetIdentity, a as useNavigate, j as jsxRuntimeExports, s as setCurrentRole } from "./index-GEfUMtq2.js";
import { c as createLucideIcon, a as Button } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { L as Layout } from "./Layout-bisDsjVo.js";
import { A as ArrowRight } from "./arrow-right-ZZA8QLW8.js";
import { S as Shield } from "./shield-BzTw_sn8.js";
import "./use-mobile-D6poQPa6.js";
import "./mock-data-QUu4nJep.js";
import "./map-pin-BIsfF69s.js";
import "./chevron-down-CzeR_bKM.js";
import "./wallet-R4k-qtGw.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", key: "1nerag" }],
  ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88", key: "o46ks0" }],
  ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02", key: "ptglia" }],
  ["path", { d: "M2 12a10 10 0 0 1 18-6", key: "ydlgp0" }],
  ["path", { d: "M2 16h.01", key: "1gqxmh" }],
  ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6", key: "drycrb" }],
  ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", key: "1tidbn" }],
  ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2", key: "13wd9y" }],
  ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2", key: "1fr1j5" }]
];
const Fingerprint = createLucideIcon("fingerprint", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
];
const Smartphone = createLucideIcon("smartphone", __iconNode);
function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isLoading = loginStatus === "logging-in";
  const handleLogin = async () => {
    await login();
    setCurrentRole("user");
    navigate({ to: "/dashboard" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-[calc(100vh-8rem)] bg-background flex items-center justify-center p-6",
      "data-ocid": "login.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center shadow-elevated mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground font-display font-black text-2xl", children: "e1" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-3xl text-foreground", children: [
            "Welcome to ezy",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-2", children: "Sign in to access your personalized dashboard" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-elevated border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 gap-3 text-base font-semibold",
              onClick: handleLogin,
              disabled: isLoading,
              "data-ocid": "login.submit_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Fingerprint, { className: "w-5 h-5" }),
                isLoading ? "Connecting..." : "Login with Internet Identity",
                !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-auto" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 pt-2", children: [
            { icon: Shield, label: "Secure" },
            { icon: Smartphone, label: "Mobile Friendly" },
            { icon: Fingerprint, label: "No Password" }
          ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-1.5 p-3 bg-muted/40 rounded-lg",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground text-center", children: label })
              ]
            },
            label
          )) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground mt-6", children: [
          "New to Ezy1?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-primary font-medium cursor-pointer",
              onClick: handleLogin,
              onKeyDown: (e) => {
                if (e.key === "Enter") handleLogin();
              },
              children: "Create an account →"
            }
          )
        ] })
      ] })
    }
  ) });
}
export {
  LoginPage as default
};

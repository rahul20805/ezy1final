import { r as reactExports, j as jsxRuntimeExports } from "./index-GEfUMtq2.js";
import { c as createLucideIcon, B as Badge, a as Button, U as User } from "./index-DtH2l02M.js";
import { I as Input } from "./input-C_cKZiLe.js";
import { U as UserLayout, M as MessageSquare } from "./UserLayout-3FFMMaon.js";
import { B as Bot } from "./bot-Bzatjv4P.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-Ch0o53Ij.js";
import { T as Truck } from "./truck-C2OQ8y4z.js";
import { U as UtensilsCrossed } from "./utensils-crossed-CS16vzH-.js";
import { P as Package } from "./package-zWNh2T3t.js";
import "./separator-MnlSgxQn.js";
import "./index-BhtksvJ9.js";
import "./use-mobile-D6poQPa6.js";
import "./settings-Cdee9qyh.js";
import "./wallet-R4k-qtGw.js";
import "./stethoscope-D-aIEydT.js";
import "./shopping-bag-BzZn_4tB.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const BOT_NAME = "Ezy Assistant";
const quickActions = [
  {
    label: "Browse Healthcare",
    icon: Heart,
    query: "Show me healthcare options"
  },
  { label: "Book Transport", icon: Truck, query: "Book a ride or bus ticket" },
  { label: "Order Food", icon: UtensilsCrossed, query: "Order food near me" },
  { label: "Track Order", icon: Package, query: "Track my order status" }
];
const mockResponses = {
  healthcare: "🏥 I found 3 top doctors available today!\n\n• **Dr. Priya Sharma** — General Physician, ₹300, slot at 10:30 AM\n• **Dr. Anita Nair** — Pediatrician, ₹400, slot at 2:00 PM\n• **Dr. Vikram Singh** — Orthopedic, ₹700, slot at 4:00 PM\n\nWould you like me to book an appointment?",
  transport: "🚌 Here are your transport options:\n\n• **Express Bus to Mysuru** — 6:00 AM, ₹180, 12 seats left\n• **Cab Booking** — Indiranagar to Whitefield, ~₹220, 12 min away\n• **Auto Share** — MG Road, ₹60, 3 min away\n\nWhich would you prefer?",
  food: "🍱 Trending food options near you:\n\n• **Reddy Tiffin Centre** — Full thali ₹80, 4.3★, 20 min delivery\n• **Meghana Foods** — Biryani ₹160, 4.7★, 30 min delivery\n• **Sharma Kirana** — Groceries with same-day delivery\n\nShall I place an order?",
  track: "📦 Your recent orders:\n\n• **Grocery Order** — Out for delivery, expected in 25 mins\n• **Medicines (Nair Pharma)** — Delivered on Apr 12\n• **Cab Ride** — Completed, Apr 10 — ₹220\n\nNeed details on any specific order?",
  default: "Hi there! I'm **Ezy Assistant**, your AI helper for all things Ezy1. I can help you:\n\n• 📅 Book doctors & healthcare\n• 🚌 Find buses & rides\n• 🛒 Order groceries & food\n• 💰 Check wallet & payments\n\nTry asking me something specific!"
};
function getBotResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes("health") || lower.includes("doctor") || lower.includes("healthcare") || lower.includes("fever") || lower.includes("hospital"))
    return mockResponses.healthcare;
  if (lower.includes("transport") || lower.includes("bus") || lower.includes("ride") || lower.includes("cab") || lower.includes("auto"))
    return mockResponses.transport;
  if (lower.includes("food") || lower.includes("order food") || lower.includes("eat") || lower.includes("restaurant") || lower.includes("thali"))
    return mockResponses.food;
  if (lower.includes("track") || lower.includes("delivery") || lower.includes("order status"))
    return mockResponses.track;
  return mockResponses.default;
}
const initialMessages = [
  {
    id: 1,
    role: "bot",
    text: `Hi! I'm ${BOT_NAME}. How can I help you today? 🙏`,
    timestamp: new Date(Date.now() - 5 * 6e4)
  },
  {
    id: 2,
    role: "user",
    text: "Can you help me find a doctor for tomorrow morning?",
    timestamp: new Date(Date.now() - 4 * 6e4)
  },
  {
    id: 3,
    role: "bot",
    text: "🏥 I found 3 top doctors available today!\n\n• **Dr. Priya Sharma** — General Physician, ₹300, slot at 10:30 AM\n• **Dr. Anita Nair** — Pediatrician, ₹400, slot at 2:00 PM\n• **Dr. Vikram Singh** — Orthopedic, ₹700, slot at 4:00 PM\n\nWould you like me to book an appointment?",
    timestamp: new Date(Date.now() - 3 * 6e4)
  },
  {
    id: 4,
    role: "user",
    text: "Book Dr. Priya Sharma at 10:30 AM",
    timestamp: new Date(Date.now() - 2 * 6e4)
  },
  {
    id: 5,
    role: "bot",
    text: "✅ Done! Appointment booked with **Dr. Priya Sharma** (General Physician) for tomorrow at **10:30 AM**.\n\nConfirmation sent to your registered number. Reminder will be sent 30 minutes before. Is there anything else I can help with?",
    timestamp: new Date(Date.now() - 1 * 6e4)
  }
];
function formatTime(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function renderFormatted(text) {
  return text.split("\n").map((line, lineIdx) => {
    const segments = line.split(/\*\*(.*?)\*\*/g);
    const rendered = segments.map(
      (seg, segIdx) => segIdx % 2 === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: seg }, `${lineIdx}-bold-${seg.slice(0, 6)}`) : seg
    );
    return lineIdx < text.split("\n").length - 1 ? [...rendered, /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}, `br-line-${lineIdx}-${line.slice(0, 4)}`)] : rendered;
  });
}
function MessageBubble({ msg }) {
  const isBot = msg.role === "bot";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-2.5 ${isBot ? "flex-row" : "flex-row-reverse"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${isBot ? "bg-gradient-to-br from-secondary to-accent" : "bg-primary"}`,
        children: isBot ? /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4 text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary-foreground" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex flex-col gap-1 max-w-[78%] ${isBot ? "items-start" : "items-end"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `px-4 py-3 rounded-2xl text-sm leading-relaxed ${isBot ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm shadow-sm"}`,
              children: renderFormatted(msg.text)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground px-1", children: formatTime(msg.timestamp) })
        ]
      }
    )
  ] });
}
function TypingIndicator() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5", "data-ocid": "chat.loading_state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4 text-white" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted rounded-2xl rounded-tl-sm px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 items-center h-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" })
    ] }) })
  ] });
}
function ChatPage() {
  const [messages, setMessages] = reactExports.useState(initialMessages);
  const [input, setInput] = reactExports.useState("");
  const [isTyping, setIsTyping] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const nextId = reactExports.useRef(initialMessages.length + 1);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  reactExports.useEffect(scrollToBottom);
  const sendMessage = (text) => {
    if (!text.trim() || isTyping) return;
    const userMsg = {
      id: nextId.current++,
      role: "user",
      text: text.trim(),
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const botMsg = {
        id: nextId.current++,
        role: "bot",
        text: getBotResponse(text),
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UserLayout, { title: "AI Assistant", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col bg-card rounded-2xl border border-border overflow-hidden",
      style: { height: "calc(100vh - 8rem)", maxHeight: "740px" },
      "data-ocid": "chat.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border bg-muted/30 flex items-center gap-3 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-sm flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-foreground", children: BOT_NAME }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-500 inline-block" }),
              "Always online · Smart recommendations"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "gap-1 text-xs border-secondary/40 text-secondary flex-shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3" }),
                " AI"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: scrollRef,
            className: "flex-1 overflow-y-auto p-4 space-y-4",
            "data-ocid": "chat.messages_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.25 },
                  "data-ocid": `chat.message.${msg.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageBubble, { msg })
                },
                msg.id
              )) }),
              isTyping && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypingIndicator, {})
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0 border-t border-border/50", children: quickActions.map((action) => {
          const Icon = action.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => sendMessage(action.query),
              disabled: isTyping,
              className: "flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/25 rounded-full hover:bg-primary/20 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
              "data-ocid": `chat.quick_action.${action.label.toLowerCase().replace(/\s+/g, "_")}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3 h-3" }),
                action.label
              ]
            },
            action.label
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            className: "p-4 border-t border-border flex gap-2 flex-shrink-0",
            "data-ocid": "chat.input_form",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ref: inputRef,
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    placeholder: "Ask me anything...",
                    className: "pl-10 h-11 bg-background border-border rounded-xl",
                    disabled: isTyping,
                    "data-ocid": "chat.message_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: !input.trim() || isTyping,
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-11 p-0 rounded-xl flex-shrink-0 shadow-sm",
                  "aria-label": "Send message",
                  "data-ocid": "chat.send_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
                }
              )
            ]
          }
        )
      ]
    }
  ) });
}
export {
  ChatPage as default
};

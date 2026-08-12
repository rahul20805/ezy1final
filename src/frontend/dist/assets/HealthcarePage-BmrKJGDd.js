import { r as reactExports, j as jsxRuntimeExports, c as cn } from "./index-GEfUMtq2.js";
import { u as useControllableState, P as Primitive, b as useComposedRefs, d as composeEventHandlers, e as createContextScope, a as Button, B as Badge } from "./index-DtH2l02M.js";
import { C as Card, a as CardContent } from "./card-BrQXhyyZ.js";
import { B as Building2, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DZpLDYFt.js";
import { L as Label } from "./label-DcRWHh-S.js";
import { R as Root, I as Item, c as createRovingFocusGroupScope, T as Tabs, a as TabsList, b as TabsTrigger, d as TabsContent } from "./tabs-iPOSN1gI.js";
import { u as useDirection } from "./index-CqG-1QED.js";
import { u as usePrevious, a as useSize } from "./index--B7DhM78.js";
import { P as Presence } from "./use-mobile-D6poQPa6.js";
import { C as Circle } from "./circle-Cq6B69M2.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-yPjcByft.js";
import { T as Textarea } from "./textarea-B9ovXcnp.js";
import { u as ue } from "./index-Dm_dm9hF.js";
import { U as UserLayout } from "./UserLayout-3FFMMaon.js";
import { a as appointments, d as doctors } from "./mock-data-QUu4nJep.js";
import { T as TriangleAlert } from "./triangle-alert-DqXmpED9.js";
import { P as Phone } from "./phone-BP-Fu9v9.js";
import { S as Stethoscope } from "./stethoscope-D-aIEydT.js";
import { C as Calendar } from "./calendar-Bvz1_IFC.js";
import { C as Clock } from "./clock-DlZ5GBoQ.js";
import { m as motion } from "./proxy-Ch0o53Ij.js";
import { M as MapPin } from "./map-pin-BIsfF69s.js";
import { H as House } from "./separator-MnlSgxQn.js";
import { C as CircleCheck } from "./circle-check-WCRvny-0.js";
import { C as CircleX } from "./circle-x-BhCwsmLJ.js";
import { S as Star } from "./star-DBKcwqmk.js";
import "./index-BhtksvJ9.js";
import "./chevron-down-CzeR_bKM.js";
import "./chevron-up-C5jdeDnv.js";
import "./settings-Cdee9qyh.js";
import "./wallet-R4k-qtGw.js";
import "./shopping-bag-BzZn_4tB.js";
var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadio,
      name,
      checked = false,
      required,
      disabled,
      value = "on",
      onCheck,
      form,
      ...radioProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioProvider, { scope: __scopeRadio, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": checked,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...radioProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            if (!checked) onCheck == null ? void 0 : onCheck();
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RadioBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME = "RadioIndicator";
var RadioIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadio, forceMount, ...indicatorProps } = props;
    const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...indicatorProps,
        ref: forwardedRef
      }
    ) });
  }
);
RadioIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var RadioBubbleInput = reactExports.forwardRef(
  ({
    __scopeRadio,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "radio",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var RADIO_GROUP_NAME = "RadioGroup";
var [createRadioGroupContext] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
  createRadioScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext(RADIO_GROUP_NAME);
var RadioGroup$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadioGroup,
      name,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation,
      dir,
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      RadioGroupProvider,
      {
        scope: __scopeRadioGroup,
        name,
        required,
        disabled,
        value,
        onValueChange: setValue,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation,
            dir: direction,
            loop,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "radiogroup",
                "aria-required": required,
                "aria-orientation": orientation,
                "data-disabled": disabled ? "" : void 0,
                dir: direction,
                ...groupProps,
                ref: forwardedRef
              }
            )
          }
        )
      }
    );
  }
);
RadioGroup$1.displayName = RADIO_GROUP_NAME;
var ITEM_NAME = "RadioGroupItem";
var RadioGroupItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
    const isDisabled = context.disabled || disabled;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
    const isArrowKeyPressedRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      const handleKeyDown = (event) => {
        if (ARROW_KEYS.includes(event.key)) {
          isArrowKeyPressedRef.current = true;
        }
      };
      const handleKeyUp = () => isArrowKeyPressedRef.current = false;
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !isDisabled,
        active: checked,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Radio,
          {
            disabled: isDisabled,
            required: context.required,
            checked,
            ...radioScope,
            ...itemProps,
            name: context.name,
            ref: composedRefs,
            onCheck: () => context.onValueChange(itemProps.value),
            onKeyDown: composeEventHandlers((event) => {
              if (event.key === "Enter") event.preventDefault();
            }),
            onFocus: composeEventHandlers(itemProps.onFocus, () => {
              var _a;
              if (isArrowKeyPressedRef.current) (_a = ref.current) == null ? void 0 : _a.click();
            })
          }
        )
      }
    );
  }
);
RadioGroupItem$1.displayName = ITEM_NAME;
var INDICATOR_NAME2 = "RadioGroupIndicator";
var RadioGroupIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioIndicator, { ...radioScope, ...indicatorProps, ref: forwardedRef });
  }
);
RadioGroupIndicator.displayName = INDICATOR_NAME2;
var Root2 = RadioGroup$1;
var Item2 = RadioGroupItem$1;
var Indicator = RadioGroupIndicator;
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
const TIME_SLOTS = {
  morning: [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM"
  ],
  afternoon: [
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM"
  ],
  evening: [
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM"
  ]
};
const SPEC_MAP = {
  All: [],
  General: ["General Physician"],
  Cardiology: ["Cardiologist"],
  Orthopedics: ["Orthopedic"],
  Dentistry: ["Dentist"],
  Dermatology: ["Dermatologist"],
  Pediatrics: ["Pediatrician"]
};
const AVATAR_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-chart-4 text-primary-foreground",
  "bg-chart-5 text-primary-foreground"
];
const STATUS_CONFIG = {
  confirmed: {
    label: "Scheduled",
    className: "bg-secondary/20 text-secondary border-secondary/30"
  },
  pending: {
    label: "Pending",
    className: "bg-primary/20 text-primary border-primary/30"
  },
  completed: {
    label: "Completed",
    className: "bg-muted text-muted-foreground border-border"
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/20 text-destructive border-destructive/30"
  }
};
function StarRating({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
    [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Star,
      {
        className: `w-3 h-3 ${i <= Math.round(rating) ? "fill-primary text-primary" : "text-border fill-border"}`
      },
      i
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs text-muted-foreground", children: rating.toFixed(1) })
  ] });
}
function DoctorAvatar({ name, index }) {
  const initials = name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-lg flex-shrink-0 ${colorClass}`,
      children: initials
    }
  );
}
function EmergencySOSButton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:112", "data-ocid": "healthcare.sos_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      className: "gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold shadow-elevated",
      size: "sm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }),
        "Emergency SOS"
      ]
    }
  ) });
}
function BookingModal({ doctor, open, onClose, onBooked }) {
  const [date, setDate] = reactExports.useState("");
  const [timeSlot, setTimeSlot] = reactExports.useState("");
  const [period, setPeriod] = reactExports.useState(
    "morning"
  );
  const [visitType, setVisitType] = reactExports.useState("clinic");
  const [notes, setNotes] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  function handleConfirm() {
    if (!date || !timeSlot) {
      ue.error("Please select a date and time slot.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newAppt = {
        id: Date.now(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date,
        time: timeSlot,
        status: "confirmed",
        fee: doctor.fee
      };
      onBooked(newAppt);
      ue.success("Appointment booked successfully!", {
        description: `${doctor.name} · ${date} at ${timeSlot}`,
        duration: 5e3
      });
      setDate("");
      setTimeSlot("");
      setNotes("");
      onClose();
    }, 900);
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md max-h-[90vh] overflow-y-auto",
      "data-ocid": "healthcare.booking_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: "Book Appointment" }),
          doctor && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            doctor.name,
            " · ",
            doctor.specialty,
            " · ₹",
            doctor.fee
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", htmlFor: "appt-date", children: "Select Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "appt-date",
                type: "date",
                min: today,
                value: date,
                onChange: (e) => setDate(e.target.value),
                className: "w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                "data-ocid": "healthcare.date_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Time Period" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["morning", "afternoon", "evening"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setPeriod(p);
                  setTimeSlot("");
                },
                className: `flex-1 py-1.5 text-xs rounded-lg border font-medium capitalize transition-smooth ${period === p ? "bg-secondary text-secondary-foreground border-secondary" : "bg-background text-muted-foreground border-input hover:border-secondary/50"}`,
                "data-ocid": `healthcare.period_${p}`,
                children: p
              },
              p
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid grid-cols-3 gap-1.5",
                "data-ocid": "healthcare.timeslot_grid",
                children: TIME_SLOTS[period].map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setTimeSlot(slot),
                    className: `py-1.5 text-xs rounded-lg border transition-smooth ${timeSlot === slot ? "bg-primary text-primary-foreground border-primary font-semibold" : "bg-background text-foreground border-input hover:border-primary/50"}`,
                    "data-ocid": `healthcare.slot.${slot.replace(/[: ]/g, "_")}`,
                    children: slot
                  },
                  slot
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Visit Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              RadioGroup,
              {
                value: visitType,
                onValueChange: (v) => setVisitType(v),
                className: "flex gap-4",
                "data-ocid": "healthcare.visit_type_radio",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "vt-clinic",
                      className: "flex items-center gap-2 cursor-pointer font-normal",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "clinic", id: "vt-clinic" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-3.5 h-3.5 text-secondary" }),
                          " Clinic"
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "vt-home",
                      className: "flex items-center gap-2 cursor-pointer font-normal",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "home", id: "vt-home" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-3.5 h-3.5 text-primary" }),
                          " Home Visit"
                        ] })
                      ]
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", htmlFor: "appt-notes", children: "Notes (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "appt-notes",
                placeholder: "Describe your symptoms or any special requests...",
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                rows: 3,
                className: "resize-none text-sm",
                "data-ocid": "healthcare.notes_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Consultation Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-primary text-base", children: [
              "₹",
              doctor == null ? void 0 : doctor.fee
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "flex-1",
                onClick: onClose,
                "data-ocid": "healthcare.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold",
                onClick: handleConfirm,
                disabled: loading,
                "data-ocid": "healthcare.confirm_button",
                children: loading ? "Booking..." : "Confirm Booking"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function DoctorCard({
  doctor,
  index,
  onBook
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.06 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border border-border hover:border-secondary/40 transition-smooth hover:shadow-elevated",
          "data-ocid": `healthcare.doctor_card.${index + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DoctorAvatar, { name: doctor.name, index }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground truncate", children: doctor.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs mt-0.5 border-secondary/40 text-secondary bg-secondary/10 px-1.5 py-0",
                      children: doctor.specialty
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${doctor.available ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`,
                    children: doctor.available ? "Available" : "Unavailable"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: doctor.rating }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "w-3 h-3" }),
                    " ",
                    doctor.experience,
                    " yrs exp"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-3 h-3" }),
                    " ",
                    doctor.hospital
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
                    " ",
                    doctor.city
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Fee" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-primary text-base leading-tight", children: [
                    "₹",
                    doctor.fee
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      title: "Clinic Visit",
                      className: "w-6 h-6 rounded-md bg-secondary/10 flex items-center justify-center",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-3.5 h-3.5 text-secondary" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      title: "Home Visit",
                      className: "w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-3.5 h-3.5 text-primary" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      className: "bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-xs h-8",
                      disabled: !doctor.available,
                      onClick: () => onBook(doctor),
                      "data-ocid": `healthcare.book_button.${index + 1}`,
                      children: "Book"
                    }
                  )
                ] })
              ] })
            ] })
          ] }) })
        }
      )
    }
  );
}
function AppointmentCard({
  appt,
  index,
  onCancel
}) {
  const cfg = STATUS_CONFIG[appt.status];
  const isUpcoming = appt.status === "confirmed" || appt.status === "pending";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.25, delay: index * 0.07 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border border-border",
          "data-ocid": `healthcare.appointment_card.${index + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-sm text-foreground", children: appt.doctorName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs px-1.5 py-0 ${cfg.className}`,
                    children: cfg.label
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: appt.specialty }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                  new Date(appt.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                  " ",
                  appt.time
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-primary text-base", children: [
                "₹",
                appt.fee
              ] }),
              isUpcoming && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "mt-1 h-7 text-xs text-destructive hover:bg-destructive/10 px-2",
                  onClick: () => onCancel(appt.id),
                  "data-ocid": `healthcare.cancel_appt_button.${index + 1}`,
                  children: "Cancel"
                }
              ),
              appt.status === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-secondary ml-auto mt-1" }),
              appt.status === "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive ml-auto mt-1" })
            ] })
          ] }) })
        }
      )
    }
  );
}
function HealthcarePage() {
  const [specialization, setSpecialization] = reactExports.useState("All");
  const [visitFilter, setVisitFilter] = reactExports.useState("all");
  const [availFilter, setAvailFilter] = reactExports.useState("all");
  const [bookingDoctor, setBookingDoctor] = reactExports.useState(null);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [apptList, setApptList] = reactExports.useState(appointments);
  const filteredDoctors = doctors.filter((d) => {
    const specMatch = specialization === "All" || SPEC_MAP[specialization].some(
      (s) => d.specialty.toLowerCase().includes(s.toLowerCase())
    );
    const availMatch = availFilter === "all" || (availFilter === "today" ? d.available : true);
    return specMatch && availMatch;
  });
  const upcomingAppts = apptList.filter(
    (a) => a.status === "confirmed" || a.status === "pending"
  );
  const pastAppts = apptList.filter(
    (a) => a.status === "completed" || a.status === "cancelled"
  );
  function handleBook(doctor) {
    setBookingDoctor(doctor);
    setModalOpen(true);
  }
  function handleBooked(appt) {
    setApptList((prev) => [appt, ...prev]);
  }
  function handleCancel(id) {
    setApptList(
      (prev) => prev.map(
        (a) => a.id === id ? { ...a, status: "cancelled" } : a
      )
    );
    ue.success("Appointment cancelled.");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(UserLayout, { title: "Healthcare", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 right-4 z-50 md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmergencySOSButton, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between gap-3 flex-wrap",
          "data-ocid": "healthcare.page_header",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground", children: "Healthcare" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Book doctors, manage appointments, emergency access" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmergencySOSButton, {}) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 p-3 rounded-xl border border-destructive/30 bg-destructive/5",
          "data-ocid": "healthcare.emergency_strip",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-destructive", children: "Medical Emergency?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Call 112 or tap Emergency SOS for immediate help" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:108", "data-ocid": "healthcare.ambulance_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5 text-xs flex-shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5" }),
                  " 108 Ambulance"
                ]
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "doctors", "data-ocid": "healthcare.tabs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsTrigger,
            {
              value: "doctors",
              className: "flex-1 sm:flex-none",
              "data-ocid": "healthcare.doctors_tab",
              children: "Find Doctors"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "appointments",
              className: "flex-1 sm:flex-none",
              "data-ocid": "healthcare.appointments_tab",
              children: [
                "My Appointments",
                upcomingAppts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1.5 text-xs px-1.5 py-0 bg-primary text-primary-foreground", children: upcomingAppts.length })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "doctors", className: "mt-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-wrap gap-2 p-3 rounded-xl bg-card border border-border",
              "data-ocid": "healthcare.filter_bar",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: specialization,
                    onValueChange: (v) => setSpecialization(v),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          className: "w-full sm:w-48 h-8 text-sm",
                          "data-ocid": "healthcare.spec_filter_select",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Specialization" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.keys(SPEC_MAP).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s === "All" ? "All Specializations" : s }, s)) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-lg border border-input overflow-hidden h-8", children: ["all", "clinic", "home"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setVisitFilter(v),
                    className: `px-3 text-xs capitalize transition-smooth ${visitFilter === v ? "bg-secondary text-secondary-foreground font-semibold" : "bg-background text-muted-foreground hover:bg-muted"}`,
                    "data-ocid": `healthcare.visit_filter.${v}`,
                    children: v === "all" ? "All" : v === "clinic" ? "Clinic" : "Home Visit"
                  },
                  v
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-lg border border-input overflow-hidden h-8", children: ["all", "today", "week"].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAvailFilter(a),
                    className: `px-3 text-xs capitalize transition-smooth ${availFilter === a ? "bg-primary text-primary-foreground font-semibold" : "bg-background text-muted-foreground hover:bg-muted"}`,
                    "data-ocid": `healthcare.avail_filter.${a}`,
                    children: a === "all" ? "All" : a === "today" ? "Today" : "This Week"
                  },
                  a
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground px-1", children: [
            filteredDoctors.length,
            " doctor",
            filteredDoctors.length !== 1 ? "s" : "",
            " found"
          ] }),
          filteredDoctors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-16 text-muted-foreground",
              "data-ocid": "healthcare.doctors_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No doctors match your filters" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Try changing the specialization or availability filters" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid gap-3 sm:grid-cols-2",
              "data-ocid": "healthcare.doctors_list",
              children: filteredDoctors.map((doc, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                DoctorCard,
                {
                  doctor: doc,
                  index: i,
                  onBook: handleBook
                },
                doc.id
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "appointments", className: "mt-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "healthcare.upcoming_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-base mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-primary" }),
              "Upcoming Appointments"
            ] }),
            upcomingAppts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-10 rounded-xl border border-dashed border-border text-muted-foreground",
                "data-ocid": "healthcare.upcoming_empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-8 h-8 mx-auto mb-2 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No upcoming appointments" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Book a doctor from the Find Doctors tab" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "healthcare.upcoming_list", children: upcomingAppts.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              AppointmentCard,
              {
                appt: a,
                index: i,
                onCancel: handleCancel
              },
              a.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "healthcare.past_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-base mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }),
              "Past Appointments"
            ] }),
            pastAppts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-center py-8 text-muted-foreground",
                "data-ocid": "healthcare.past_empty_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No past appointments" })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-2 opacity-80",
                "data-ocid": "healthcare.past_list",
                children: pastAppts.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AppointmentCard,
                  {
                    appt: a,
                    index: i,
                    onCancel: handleCancel
                  },
                  a.id
                ))
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BookingModal,
      {
        doctor: bookingDoctor,
        open: modalOpen,
        onClose: () => setModalOpen(false),
        onBooked: handleBooked
      }
    )
  ] });
}
export {
  HealthcarePage as default
};

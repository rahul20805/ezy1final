import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bus,
  Car,
  CheckCircle,
  Clock,
  Globe,
  Landmark,
  MapPin,
  ShoppingBag,
  Star,
  Stethoscope,
  Store,
  Truck,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { busRoutes, doctors, testimonials } from "../mock-data";

/* ────────────────────────────────────────────────
 * Data
 * ──────────────────────────────────────────────── */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  MapPin,
  ShoppingBag,
  Globe,
  UtensilsCrossed,
  Landmark,
  Stethoscope,
  Bus,
};

const services = [
  {
    id: 1,
    icon: "Zap",
    name: "Recharge & Bills",
    desc: "Mobile top-ups, DTH, electricity, water & more",
    color: "primary",
    trending: true,
    path: "/dashboard/wallet",
  },
  {
    id: 2,
    icon: "MapPin",
    name: "Travel & Transport",
    desc: "Book flights, buses, trains, and hotels easily",
    color: "secondary",
    trending: true,
    path: "/dashboard/transport",
  },
  {
    id: 3,
    icon: "Stethoscope",
    name: "Healthcare",
    desc: "Book doctors, order medicines, emergency access",
    color: "accent",
    trending: false,
    path: "/dashboard/healthcare",
  },
  {
    id: 4,
    icon: "ShoppingBag",
    name: "Quick Commerce",
    desc: "Groceries, electronics, fashion and beauty",
    color: "primary",
    trending: false,
    path: "/shop",
  },
  {
    id: 5,
    icon: "UtensilsCrossed",
    name: "Home Services",
    desc: "Maids, plumbers, electricians, repair, beauty",
    color: "secondary",
    trending: true,
    path: "/services",
  },
];

const partnerPaths = [
  {
    icon: Store,
    title: "Shop Owner",
    desc: "List your kirana, pharmacy, or restaurant. Reach thousands of local customers instantly.",
    badge: "Most Popular",
  },
  {
    icon: Car,
    title: "Driver Partner",
    desc: "Drive autos, bikes, or cabs. Set your own hours, earn daily payouts.",
    badge: "₹0 Joining Fee",
  },
  {
    icon: Truck,
    title: "Service Provider",
    desc: "Offer plumbing, electrical, cleaning, tutoring, or any local service.",
    badge: "New Opportunity",
  },
];

const onboardingSteps = [
  {
    step: "1",
    label: "Register",
    desc: "Fill a simple form with your business details",
  },
  {
    step: "2",
    label: "Verify",
    desc: "Upload Aadhaar & GST for instant verification",
  },
  {
    step: "3",
    label: "Go Live",
    desc: "Start receiving orders within 24 hours",
  },
];

const appFeatures = [
  { emoji: "📍", label: "Hyperlocal Map" },
  { emoji: "💊", label: "Medicine Delivery" },
  { emoji: "🚌", label: "Bus Booking" },
  { emoji: "💳", label: "Ezy1 Wallet" },
  { emoji: "🤖", label: "AI Assistant" },
  { emoji: "🛒", label: "Local Shopping" },
];

/* ────────────────────────────────────────────────
 * Scroll-reveal hook
 * ──────────────────────────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ────────────────────────────────────────────────
 * Sub-components
 * ──────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= Math.round(rating) ? "text-primary fill-primary" : "text-muted-foreground"}`}
        />
      ))}
    </span>
  );
}

function RevealSection({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────
 * Main component
 * ──────────────────────────────────────────────── */
export default function LandingPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      {/* ═══════════════════════════════════════════
          HERO — full-screen gradient
      ═══════════════════════════════════════════ */}
      <section
        id="hero"
        data-ocid="landing.hero_section"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.62 0.24 71) 0%, oklch(0.52 0.21 188) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-16 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.9 0.15 56)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "oklch(0.3 0.18 262)" }}
        />

        <div className="relative container px-4 py-20 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <Badge
                className="mb-6 text-sm px-4 py-1.5 border-0"
                style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
              >
                🇮🇳 India's Everything App
              </Badge>
              <h1
                className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[1.04] mb-6"
                style={{ color: "white" }}
              >
                One App.
                <br />
                Every Service.
                <br />
                <span style={{ color: "oklch(0.95 0.08 56)" }}>Anywhere.</span>
              </h1>
              <p
                className="text-lg md:text-xl leading-relaxed mb-8 max-w-md"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                From cities to villages — Ezy1 connects everything. Groceries,
                doctors, buses, local shops — all in your pocket.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/login" data-ocid="landing.hero_explore_button">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-base gap-2 w-full sm:w-auto font-semibold"
                    style={{
                      background: "oklch(0.62 0.24 71)",
                      color: "white",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    }}
                  >
                    Explore Services <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  to="/partner-login"
                  data-ocid="landing.hero_partner_button"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-8 text-base gap-2 w-full sm:w-auto font-semibold"
                    style={{
                      borderColor: "rgba(255,255,255,0.5)",
                      color: "white",
                      background: "rgba(255,255,255,0.12)",
                    }}
                  >
                    Partner With Us
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  "5M+ Users",
                  "500+ Cities",
                  "50K+ Partners",
                  "4.8★ Rated",
                ].map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 text-sm font-medium"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    <CheckCircle
                      className="w-4 h-4"
                      style={{ color: "oklch(0.95 0.08 56)" }}
                    />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: floating app mockup */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-72 md:w-80">
                {/* Phone frame */}
                <div
                  className="relative bg-card rounded-[2.5rem] shadow-2xl border-4 border-white/30 overflow-hidden"
                  style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}
                >
                  {/* Status bar */}
                  <div
                    className="h-10 flex items-center justify-between px-5"
                    style={{ background: "oklch(0.62 0.24 71)" }}
                  >
                    <span className="text-xs text-white font-medium">9:41</span>
                    <div className="w-20 h-5 bg-black rounded-full mx-auto" />
                    <span className="text-xs text-white font-medium">📶</span>
                  </div>
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
                    <span className="font-display font-black text-lg text-foreground">
                      ezy<span className="text-primary">1</span>
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 text-primary" />
                      Bengaluru
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4 bg-background space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Quick Access
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {appFeatures.map((f) => (
                        <div
                          key={f.label}
                          className="flex flex-col items-center gap-1 p-2 bg-card rounded-xl border border-border hover:border-primary/30 transition-smooth cursor-pointer"
                        >
                          <span className="text-xl">{f.emoji}</span>
                          <span className="text-[10px] text-center text-muted-foreground leading-tight font-medium">
                            {f.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Mini map card */}
                    <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3">
                      <p className="text-xs font-semibold text-secondary mb-2">
                        Near You
                      </p>
                      {["Sharma Kirana · 0.3 km", "Apollo Clinic · 0.8 km"].map(
                        (item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2 text-[11px] text-foreground py-0.5"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                            {item}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  {/* Bottom nav */}
                  <div
                    className="grid grid-cols-4 border-t border-border"
                    style={{ background: "oklch(0.99 0.01 56)" }}
                  >
                    {(["🏠", "🗺️", "💊", "👤"] as const).map((e, i) => (
                      <div
                        key={e}
                        className={`flex items-center justify-center py-3 text-lg ${i === 0 ? "border-t-2 border-primary" : ""}`}
                      >
                        {e}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badges */}
                <div
                  className="absolute -left-8 top-16 bg-card rounded-2xl px-3 py-2 shadow-elevated border border-border animate-bounce"
                  style={{ animationDuration: "3s" }}
                >
                  <p className="text-xs font-bold text-foreground">
                    🎉 Live Orders
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    2.3L+ today
                  </p>
                </div>
                <div
                  className="absolute -right-6 bottom-24 bg-card rounded-2xl px-3 py-2 shadow-elevated border border-border animate-bounce"
                  style={{ animationDuration: "4s", animationDelay: "1s" }}
                >
                  <p className="text-xs font-bold text-secondary">
                    📍 Detected
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Bengaluru, KA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          onClick={() => scrollTo("services")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
          style={{ color: "rgba(255,255,255,0.7)" }}
          data-ocid="landing.hero_scroll_down"
          aria-label="Scroll to services"
        >
          <span className="text-xs font-medium">Scroll down</span>
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center pt-1">
            <div className="w-1.5 h-2.5 bg-white/60 rounded-full animate-bounce" />
          </div>
        </button>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES ECOSYSTEM
      ═══════════════════════════════════════════ */}
      <section
        id="services"
        className="bg-muted/30 py-20"
        data-ocid="landing.services_section"
      >
        <div className="container px-4">
          <RevealSection className="text-center mb-12">
            <Badge variant="outline" className="mb-3">
              Services Ecosystem
            </Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Everything You Need, In One Place
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              From recharge to doctors, groceries to buses — 50+ service
              categories designed for India.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {services.map((svc, i) => {
              const Icon = iconMap[svc.icon] ?? Zap;
              const colorClass: Record<string, string> = {
                primary: "bg-primary/10 text-primary border-primary/20",
                secondary: "bg-secondary/10 text-secondary border-secondary/20",
                accent: "bg-accent/10 text-accent border-accent/20",
              };
              return (
                <RevealSection key={svc.id}>
                  <Link
                    to={svc.path}
                    data-ocid={`landing.service_card.${i + 1}`}
                  >
                    <Card className="hover:shadow-elevated hover:-translate-y-1.5 transition-smooth cursor-pointer border-border h-full group relative overflow-hidden">
                      {svc.trending && (
                        <div className="absolute top-3 right-3">
                          <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                            🔥 Trending
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-smooth group-hover:scale-110 ${colorClass[svc.color]}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="font-display font-bold text-foreground mb-1 text-base">
                          {svc.name}
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          {svc.desc}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HYPERLOCAL EXPERIENCE
      ═══════════════════════════════════════════ */}
      <section
        id="hyperlocal"
        className="bg-background py-20"
        data-ocid="landing.hyperlocal_section"
      >
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            {/* Left copy */}
            <RevealSection>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-4">
                Hyperlocal Experience
              </Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-5">
                Services Where You Are
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Ezy1 auto-detects your location and surfaces the most relevant
                hyperlocal services — whether you're in South Mumbai, a small UP
                town, or a Rajasthan village.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Kirana stores delivering within 30 minutes",
                  "Village milk delivery at your doorstep by 7 AM",
                  "Local dhabas with live menu and delivery",
                  "Supports 12 Indian regional languages",
                ].map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => scrollTo("hero")}
                data-ocid="landing.hyperlocal_cta_button"
              >
                Explore Near You <ArrowRight className="w-4 h-4" />
              </Button>
            </RevealSection>

            {/* Right: mock location card */}
            <RevealSection>
              <div className="bg-card rounded-2xl p-5 border border-border shadow-elevated">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Bengaluru, KA
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Auto-detected · 2 min ago
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                    ● Live
                  </Badge>
                </div>

                {/* Grid map visual */}
                <div className="bg-muted/40 rounded-xl h-44 relative overflow-hidden mb-4 border border-border">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg,transparent,transparent 20px,currentColor 20px,currentColor 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,currentColor 20px,currentColor 21px)",
                      backgroundSize: "21px 21px",
                    }}
                  />
                  {[
                    {
                      top: "22%",
                      left: "28%",
                      label: "Kirana Store",
                      color: "bg-primary",
                    },
                    {
                      top: "52%",
                      left: "58%",
                      label: "Doctor",
                      color: "bg-secondary",
                    },
                    {
                      top: "68%",
                      left: "22%",
                      label: "Bus Stop",
                      color: "bg-accent",
                    },
                  ].map(({ top, left, label, color }) => (
                    <div
                      key={label}
                      className="absolute flex flex-col items-center"
                      style={{ top, left }}
                    >
                      <div
                        className={`w-6 h-6 ${color} rounded-full flex items-center justify-center shadow-sm`}
                      >
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                      <div className="mt-1 bg-card text-[10px] px-2 py-0.5 rounded-full border border-border shadow-sm font-semibold text-foreground whitespace-nowrap">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service list */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Nearby Services
                </p>
                <div className="space-y-2">
                  {[
                    {
                      icon: ShoppingBag,
                      name: "Sharma Kirana Store",
                      dist: "0.3 km",
                      tag: "Open",
                      tagColor: "bg-secondary/10 text-secondary",
                    },
                    {
                      icon: Stethoscope,
                      name: "Dr. Priya Sharma",
                      dist: "1.2 km",
                      tag: "Clinic",
                      tagColor: "bg-primary/10 text-primary",
                    },
                    {
                      icon: Bus,
                      name: "KSRTC Bus Stand",
                      dist: "0.8 km",
                      tag: "Bus Stop",
                      tagColor: "bg-accent/10 text-accent",
                    },
                  ].map(({ icon: Icon, name, dist, tag, tagColor }) => (
                    <div
                      key={name}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground font-medium">
                          {name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {dist}
                        </span>
                        <Badge
                          className={`text-[10px] px-1.5 py-0 border-0 ${tagColor}`}
                        >
                          {tag}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HEALTHCARE PREVIEW
      ═══════════════════════════════════════════ */}
      <section
        id="healthcare"
        className="bg-muted/30 py-20"
        data-ocid="landing.healthcare_section"
      >
        <div className="container px-4">
          <RevealSection className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
              Healthcare
            </Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Your Health, Our Priority
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Book certified doctors, order medicines, and access emergency care
              — all from your phone.
            </p>
          </RevealSection>

          {/* Emergency SOS */}
          <RevealSection className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center gap-4 bg-destructive/10 border border-destructive/30 rounded-2xl p-5">
              <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="w-6 h-6 text-destructive-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-destructive text-lg">
                  Emergency SOS
                </p>
                <p className="text-sm text-muted-foreground">
                  One tap to reach nearest ambulance, emergency contacts, and
                  hospital ER.
                </p>
              </div>
              <Link to="/login" data-ocid="landing.sos_button">
                <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-shrink-0">
                  SOS
                </Button>
              </Link>
            </div>
          </RevealSection>

          {/* Doctor cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {doctors.slice(0, 3).map((doc, i) => (
              <RevealSection key={doc.id}>
                <Card
                  className="border-border hover:shadow-elevated transition-smooth h-full"
                  data-ocid={`landing.doctor_card.${i + 1}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-black text-primary text-lg">
                          {doc.name.split(" ")[1]?.[0] ?? "D"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display font-bold text-foreground text-sm leading-tight">
                          {doc.name}
                        </p>
                        <p className="text-xs text-secondary font-medium mt-0.5">
                          {doc.specialty}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <StarRating rating={doc.rating} />
                          <span className="text-xs text-muted-foreground">
                            {doc.rating} · {doc.experience} yrs
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                          Clinic
                        </Badge>
                        <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                          Home Visit
                        </Badge>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        ₹{doc.fee}
                      </span>
                    </div>
                    <Link
                      to="/login"
                      data-ocid={`landing.doctor_book_button.${i + 1}`}
                    >
                      <Button
                        size="sm"
                        className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                      >
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRANSPORT PREVIEW
      ═══════════════════════════════════════════ */}
      <section
        id="transport"
        className="bg-background py-20"
        data-ocid="landing.transport_section"
      >
        <div className="container px-4">
          <RevealSection className="text-center mb-12">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-3">
              Transport
            </Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Move Smarter Across India
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Book buses, share rides, and track live journeys — state buses to
              city autos, all connected.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bus schedule table */}
            <RevealSection>
              <Card
                className="border-border overflow-hidden"
                data-ocid="landing.transport_bus_table"
              >
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/5">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">
                      State Bus Booking
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Live seat availability
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                          Route
                        </th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                          Dep
                        </th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                          Arr
                        </th>
                        <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                          Fare
                        </th>
                        <th className="px-4 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {busRoutes.slice(0, 3).map((route, i) => (
                        <tr
                          key={route.id}
                          className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                          data-ocid={`landing.bus_row.${i + 1}`}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground text-xs">
                              {route.from} → {route.to}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {route.operator}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-xs text-foreground font-medium">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              {route.departure}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {route.arrival}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-primary text-sm">
                              ₹{route.fare}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              to="/login"
                              data-ocid={`landing.bus_book_button.${i + 1}`}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 px-2.5 border-secondary/30 text-secondary hover:bg-secondary/10"
                              >
                                Book
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </RevealSection>

            {/* Ride sharing card */}
            <RevealSection>
              <Card
                className="border-border h-full"
                data-ocid="landing.transport_ride_card"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Car className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground">
                        Ride Sharing
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Autos, bikes & cabs near you
                      </p>
                    </div>
                    <Badge className="ml-auto bg-secondary/10 text-secondary border-secondary/20 text-xs">
                      ● Live
                    </Badge>
                  </div>
                  {/* Fare cards */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      {
                        type: "Auto",
                        emoji: "🛺",
                        fare: "₹50+",
                        time: "2 min",
                      },
                      { type: "Bike", emoji: "🏍️", fare: "₹30+", time: "3 min" },
                      {
                        type: "Cab",
                        emoji: "🚗",
                        fare: "₹120+",
                        time: "5 min",
                      },
                    ].map(({ type, emoji, fare, time }) => (
                      <div
                        key={type}
                        className="bg-muted/40 rounded-xl p-3 text-center border border-border hover:border-primary/30 transition-smooth cursor-pointer"
                      >
                        <p className="text-2xl mb-1">{emoji}</p>
                        <p className="font-display font-bold text-sm text-foreground">
                          {type}
                        </p>
                        <p className="text-xs text-primary font-semibold">
                          {fare}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {time} away
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Estimated route */}
                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Sample Estimate
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        <div className="w-0.5 h-6 bg-border" />
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">
                          Indiranagar
                        </p>
                        <p className="text-xs font-medium text-foreground">
                          Whitefield · 18 km
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="font-display font-black text-xl text-primary">
                          ₹220
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Cab estimate
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/login"
                    className="block mt-4"
                    data-ocid="landing.ride_book_button"
                  >
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                      Book a Ride <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PARTNER WITH US
      ═══════════════════════════════════════════ */}
      <section
        id="partner"
        className="py-20"
        data-ocid="landing.partner_section"
        style={{ background: "oklch(0.3 0.18 262)" }}
      >
        <div className="container px-4">
          <RevealSection className="text-center mb-12">
            <Badge
              className="mb-3 text-sm border-0"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
            >
              Partner With Us
            </Badge>
            <h2
              className="font-display font-bold text-3xl md:text-4xl mb-3"
              style={{ color: "white" }}
            >
              Grow Your Business with Ezy1
            </h2>
            <p
              className="max-w-lg mx-auto text-lg"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Join 50,000+ vendors, drivers, and service providers earning more
              every day.
            </p>
          </RevealSection>

          {/* Onboarding paths */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {partnerPaths.map(({ icon: Icon, title, desc, badge }, i) => (
              <RevealSection key={title}>
                <Card
                  className="border-0 h-full"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                  }}
                  data-ocid={`landing.partner_card.${i + 1}`}
                >
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                      <Icon className="w-6 h-6" style={{ color: "white" }} />
                    </div>
                    <Badge
                      className="mb-3 text-xs border-0"
                      style={{
                        background: "oklch(0.62 0.24 71)",
                        color: "white",
                      }}
                    >
                      {badge}
                    </Badge>
                    <h3
                      className="font-display font-bold text-xl mb-2"
                      style={{ color: "white" }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-sm mb-5 leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {desc}
                    </p>
                    <Link
                      to="/partner-login"
                      data-ocid={`landing.partner_register_button.${i + 1}`}
                    >
                      <Button
                        className="w-full border-0 gap-2"
                        style={{
                          background: "oklch(0.62 0.24 71)",
                          color: "white",
                        }}
                      >
                        Register Now <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>

          {/* 3-step timeline */}
          <RevealSection>
            <div className="max-w-3xl mx-auto">
              <p
                className="text-center text-sm font-semibold mb-8 uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Simple 3-Step Onboarding
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
                {onboardingSteps.map(({ step, label, desc }, i) => (
                  <div
                    key={step}
                    className="flex flex-col items-center text-center relative"
                  >
                    {i < onboardingSteps.length - 1 && (
                      <div
                        className="hidden sm:block absolute top-6 left-1/2 w-full h-0.5"
                        style={{ background: "rgba(255,255,255,0.2)" }}
                      />
                    )}
                    <div
                      className="relative w-12 h-12 rounded-full flex items-center justify-center mb-3 font-display font-black text-xl z-10"
                      style={{
                        background: "oklch(0.62 0.24 71)",
                        color: "white",
                      }}
                    >
                      {step}
                    </div>
                    <p
                      className="font-display font-bold text-base mb-1"
                      style={{ color: "white" }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section
        id="testimonials"
        className="bg-muted/30 py-20"
        data-ocid="landing.testimonials_section"
      >
        <div className="container px-4">
          <RevealSection className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Trusted by Millions
            </h2>
            <p className="text-muted-foreground">
              Real stories from real Indians using Ezy1 every day
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.slice(0, 4).map((t, i) => (
              <RevealSection key={t.id}>
                <Card
                  className="border-border hover:shadow-elevated transition-smooth h-full"
                  data-ocid={`landing.testimonial.${i + 1}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-black text-primary">
                          {t.name[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {t.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <p className="text-xs text-muted-foreground truncate">
                            {t.city}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0 flex-shrink-0"
                          >
                            {t.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <StarRating rating={t.rating} />
                    <p className="mt-3 text-sm text-foreground leading-relaxed">
                      "{t.text}"
                    </p>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER CTA
      ═══════════════════════════════════════════ */}
      <section
        className="py-20"
        data-ocid="landing.footer_cta_section"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.62 0.24 71) 0%, oklch(0.52 0.21 188) 100%)",
        }}
      >
        <div className="container px-4 text-center">
          <RevealSection>
            <p
              className="text-sm font-semibold mb-4 uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Start Today — It's Free
            </p>
            <h2
              className="font-display font-black text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight"
              style={{ color: "white" }}
            >
              Join the Future of Services with Ezy1
            </h2>
            <p
              className="text-lg mb-10 max-w-md mx-auto"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              One app for every service, every Indian, everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" data-ocid="landing.footer_cta_login_button">
                <Button
                  size="lg"
                  className="h-13 px-10 text-base font-semibold gap-2 w-full sm:w-auto"
                  style={{
                    background: "white",
                    color: "oklch(0.62 0.24 71)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  Login / Sign Up <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link
                to="/partner-login"
                data-ocid="landing.footer_cta_partner_button"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-10 text-base font-semibold gap-2 w-full sm:w-auto"
                  style={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "white",
                    background: "rgba(255,255,255,0.12)",
                  }}
                >
                  Partner Login
                </Button>
              </Link>
            </div>
            <p
              className="mt-6 text-sm"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              No credit card needed · Available in 12 Indian languages · Works
              on 2G/3G
            </p>
          </RevealSection>
        </div>
      </section>
    </Layout>
  );
}

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import Layout from "../components/Layout";
import { 
  SUPER_CATEGORIES, 
  CATALOG_ITEMS, 
  FAMOUS_LOCAL_SPOTS, 
  SHOP_BY_CATEGORY_TILES,
  POPULAR_FOOD_ITEMS,
  SWEETS_ITEMS,
  FASHION_ITEMS,
  JEWELLERY_ITEMS,
  COSMETICS_ITEMS,
  DIGITAL_SERVICES,
  POPULAR_LOCAL_SHOPS_DATA,
  HOSPITALS_DATA,
  LAB_PACKAGES,
  type CatalogItem 
} from "../ecosystem-data";
import { doctors, workers } from "../mock-data";
import { useCartStore } from "../lib/cartStore";
import { useRequireAuth } from "../components/AuthPromptModal";
import { useLocationStore } from "../lib/locationStore";
import { useAuth } from "../lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  ShoppingBag,
  Stethoscope,
  UtensilsCrossed,
  Car,
  Package,
  Building2,
  Tag,
  ShieldCheck,
  Flame,
  Heart,
  RotateCcw,
  Compass,
  Bus,
  BedDouble,
  PhoneCall,
  Activity,
  Wrench,
  CheckCircle2,
  Copy,
  ArrowRight
} from "lucide-react";

/** Reusable Horizontal Scrollable Carousel with Arrow Nav */
function ScrollableRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const offset = direction === "left" ? -340 : 340;
      containerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/scroll">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scroll("left")}
        className="hidden md:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-md items-center justify-center text-foreground hover:bg-muted opacity-0 group-hover/scroll:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div
        ref={containerRef}
        className={`flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-3 pt-1 px-1 -mx-1 scrollbar-none ${className}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scroll("right")}
        className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-md items-center justify-center text-foreground hover:bg-muted opacity-0 group-hover/scroll:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentLocation } = useLocationStore();
  const { isAuthenticated, user } = useAuth();
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const { requireAuth } = useRequireAuth();

  const [homeSearch, setHomeSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState<string>("all");
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Real backend states
  const [hospitalData, setHospitalData] = useState<any>(null);
  const [stays, setStays] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [explorePlaces, setExplorePlaces] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [sharedRides, setSharedRides] = useState<any[]>([]);
  const [homeHealth, setHomeHealth] = useState<any[]>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]);

  // Fetch real data on mount
  useEffect(() => {
    async function loadRealData() {
      try {
        const [hosp, st, tr, exp, bs, rd, hh, rc] = await Promise.all([
          fetch("/api/hospitals/availability").then((r) => r.json()).catch(() => null),
          fetch("/api/stays").then((r) => r.json()).catch(() => []),
          fetch("/api/travel").then((r) => r.json()).catch(() => []),
          fetch("/api/explore").then((r) => r.json()).catch(() => []),
          fetch("/api/buses").then((r) => r.json()).catch(() => []),
          fetch("/api/rides/shared").then((r) => r.json()).catch(() => []),
          fetch("/api/healthcare/home").then((r) => r.json()).catch(() => []),
          fetch("/api/user/recent-items").then((r) => r.json()).catch(() => []),
        ]);

        if (hosp) setHospitalData(hosp);
        if (Array.isArray(st)) setStays(st);
        if (Array.isArray(tr)) setTours(tr);
        if (Array.isArray(exp)) setExplorePlaces(exp);
        if (Array.isArray(bs)) setBuses(bs);
        if (Array.isArray(rd)) setSharedRides(rd);
        if (Array.isArray(hh)) setHomeHealth(hh);
        if (Array.isArray(rc)) setRecentItems(rc);
      } catch (e) {
        console.error("Failed to load ecosystem data", e);
      }
    }
    loadRealData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = homeSearch.trim();
    if (trimmed) {
      navigate({ to: "/search", search: { q: trimmed, category: searchCategory } });
    } else {
      navigate({ to: "/search" });
    }
  };

  // Live Homepage Universal Search Engine across all entities
  const liveSearchResults = useMemo(() => {
    const q = homeSearch.trim().toLowerCase();
    if (!q) return null;

    const calcScore = (text: string) => {
      const clean = (text || "").toLowerCase();
      if (clean === q) return 100;
      if (clean.startsWith(q)) return 75;
      if (clean.includes(q)) return 50;
      return 0;
    };

    const products = (searchCategory === "all" || searchCategory === "products" || searchCategory === "food")
      ? CATALOG_ITEMS.filter((p) => calcScore(p.name) > 0 || calcScore(p.description) > 0 || p.tags.some((t) => calcScore(t) > 0)).slice(0, 10)
      : [];

    const docs = (searchCategory === "all" || searchCategory === "doctors")
      ? doctors.filter((d) => calcScore(d.name) > 0 || calcScore(d.specialty) > 0 || calcScore(d.hospital) > 0).slice(0, 8)
      : [];

    const hospitals = (searchCategory === "all" || searchCategory === "hospitals")
      ? HOSPITALS_DATA.filter((h) => calcScore(h.name) > 0 || calcScore(h.address) > 0 || h.departments.some((dept) => calcScore(dept) > 0)).slice(0, 6)
      : [];

    const services = (searchCategory === "all" || searchCategory === "services")
      ? workers.filter((w) => calcScore(w.name) > 0 || calcScore(w.category) > 0).slice(0, 8)
      : [];

    const spots = (searchCategory === "all" || searchCategory === "spots")
      ? FAMOUS_LOCAL_SPOTS.filter((s) => calcScore(s.name) > 0 || calcScore(s.tagline) > 0 || calcScore(s.city) > 0).slice(0, 6)
      : [];

    const total = products.length + docs.length + hospitals.length + services.length + spots.length;
    return { products, doctors: docs, hospitals, services, spots, total };
  }, [homeSearch, searchCategory]);

  const handleAddToCart = (product: CatalogItem) => {
    const numId = Math.abs(product.id.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
    addItem({
      id: numId,
      vendorId: 1,
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp || product.price,
      images: [product.image],
      category: product.categoryId,
      categoryIds: [1],
      inStock: true,
      stockCount: 50,
      isAvailable: true,
      rating: product.rating,
      totalReviews: product.reviewCount,
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon ${code} copied to clipboard!`);
  };

  const handleAddItemToCart = (item: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category?: string;
  }) => {
    const numId = Math.abs(item.id.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
    addItem({
      id: numId,
      vendorId: 1,
      name: item.name,
      description: item.name,
      price: item.price,
      mrp: item.originalPrice || item.price,
      images: [item.image],
      category: item.category || "general",
      categoryIds: [1],
      inStock: true,
      stockCount: 50,
      isAvailable: true,
      rating: 4.8,
      totalReviews: 120,
    });
    toast.success(`Added ${item.name} to cart!`);
  };

  const [selectedFashionGender, setSelectedFashionGender] = useState<"Women" | "Men" | "Kids">("Women");

  const filteredFashion = useMemo(() => {
    return FASHION_ITEMS.filter((f) => f.gender === selectedFashionGender);
  }, [selectedFashionGender]);

  // Static/Catalog Datasets
  const quickPicks = useMemo(() => CATALOG_ITEMS.slice(0, 8), []);
  const freshProduce = useMemo(() => CATALOG_ITEMS.filter((i) => i.categoryId === "fruits" || i.categoryId === "vegetables"), []);
  const popularRestaurants = useMemo(() => CATALOG_ITEMS.filter((i) => i.categoryId === "restaurants" || i.categoryId === "cafe"), []);

  // Promotional Banners
  const PROMO_BANNERS = [
    {
      id: "b1",
      badge: "⚡ 15-MIN EXPRESS",
      title: "Grocery & Daily Fresh Produce Delivered in 15 Mins",
      subtitle: "Zero delivery fee on your first 3 orders above ₹199.",
      cta: "Shop Essentials",
      link: "/category/grocery",
      gradient: "from-emerald-600 via-teal-700 to-emerald-900",
      icon: "🥦",
    },
    {
      id: "b2",
      badge: "🏨 EZY STAY EXCLUSIVE",
      title: "Get Flat 20% Off on Verified Hotels & Homestays",
      subtitle: "Instant booking confirmation with zero cancellation penalties.",
      cta: "Explore Stays",
      link: "/stays",
      gradient: "from-amber-600 via-orange-600 to-red-800",
      icon: "🏨",
    },
    {
      id: "b3",
      badge: "🏥 24/7 HEALTHCARE",
      title: "Verified Hospital Bed Vacancy & Doctor at Home",
      subtitle: "Check live ICU/General beds & book certified specialists to your doorstep.",
      cta: "Check Bed Status",
      link: "/hospitals",
      gradient: "from-rose-600 via-red-600 to-red-900",
      icon: "🩺",
    },
    {
      id: "b4",
      badge: "🚌 INTERCITY TRAVEL",
      title: "Book State Volvo Buses & Verified Carpools",
      subtitle: "Digital QR tickets with zero convenience charges & live GPS tracking.",
      cta: "Book Tickets",
      link: "/bus",
      gradient: "from-blue-600 via-indigo-700 to-blue-900",
      icon: "🚌",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-32">
        {/* ========================================================= */}
        {/* 1. TOP STICKY BAR: LOCATION SELECTOR + LARGE SEARCH + USER */}
        {/* ========================================================= */}
        <div className="bg-card/95 backdrop-blur-md border-b border-border py-3 px-4 sm:px-6 sticky top-16 z-30 shadow-xs">
          <div className="container max-w-7xl mx-auto space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              {/* Location Selector */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground truncate">
                      Delivery Location:
                    </span>
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9px] font-bold px-1.5 py-0">
                      ⚡ 15 MINS
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate max-w-xs sm:max-w-md">
                    {currentLocation.formattedAddress || "Indiranagar, Bengaluru, Karnataka"}
                  </p>
                </div>
              </div>

              {/* User/Greeting */}
              <div className="text-right flex-shrink-0 hidden sm:block">
                <span className="text-xs font-semibold text-foreground">
                  {isAuthenticated ? `Hi, ${user?.name || "Customer"} 👋` : "Welcome to EZY1 👋"}
                </span>
                <p className="text-[10px] text-primary font-bold">Local Super-App for Everything</p>
              </div>
            </div>

            {/* Large Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                placeholder='Search "Atta", "Dolo 650", "Biryani", "Cardiologist", "Hotel Stay", "Volvo Bus", "Electrician"...'
                className="pl-11 pr-24 h-12 rounded-2xl bg-muted/40 border-border text-sm font-medium focus:bg-background transition-all shadow-inner"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 rounded-xl px-4 text-xs font-bold bg-primary text-primary-foreground shadow-sm"
              >
                Search
              </Button>
            </form>

            {/* Scrollable Search Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-xs">
              <span className="text-muted-foreground font-semibold text-[11px] shrink-0 mr-1">
                Search In:
              </span>
              {[
                { id: "all", label: "All Pages", icon: "🌐" },
                { id: "products", label: "Groceries & Shop", icon: "🛒" },
                { id: "doctors", label: "Doctors", icon: "🩺" },
                { id: "hospitals", label: "Hospitals & Beds", icon: "🏥" },
                { id: "services", label: "Home Services", icon: "🔧" },
                { id: "food", label: "Food & Dining", icon: "🍔" },
                { id: "spots", label: "Local Famous", icon: "🧭" },
              ].map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSearchCategory(sc.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors shrink-0 ${
                    searchCategory === sc.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 hover:bg-muted text-foreground/80 hover:text-foreground border border-border/50"
                  }`}
                >
                  <span>{sc.icon}</span>
                  <span>{sc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LIVE HOMEPAGE UNIVERSAL SEARCH RESULTS (Scrollable All)   */}
        {/* ========================================================= */}
        {liveSearchResults && (
          <section className="container max-w-7xl mx-auto pt-6 pb-2 px-4 sm:px-6 animate-in fade-in duration-200">
            <div className="p-5 sm:p-6 rounded-3xl bg-card border-2 border-primary/30 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                      Universal Search Preview
                    </Badge>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {liveSearchResults.total} results found for "{homeSearch}"
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-foreground mt-1">
                    Instant Results Across All Pages
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setHomeSearch("")}
                    className="rounded-xl text-xs font-semibold"
                  >
                    Clear Results
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm"
                  >
                    <Link to="/search" search={{ q: homeSearch, category: searchCategory }}>
                      View Full Search Page →
                    </Link>
                  </Button>
                </div>
              </div>

              {liveSearchResults.total === 0 ? (
                <div className="text-center py-10 text-muted-foreground space-y-2">
                  <p className="text-sm font-semibold">No results matching "{homeSearch}" in this category.</p>
                  <p className="text-xs">Try selecting "All Pages" or check spelling.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Products Scrollable Row */}
                  {liveSearchResults.products.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-primary" />
                          Products & Groceries ({liveSearchResults.products.length})
                        </h4>
                        <Link to="/search" search={{ q: homeSearch, category: "products" }} className="text-xs font-semibold text-primary hover:underline">
                          See all products →
                        </Link>
                      </div>
                      <ScrollableRow className="py-1">
                        {liveSearchResults.products.map((p) => (
                          <div
                            key={p.id}
                            className="flex-shrink-0 w-56 sm:w-60 p-3 rounded-2xl bg-background border border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between"
                          >
                            <div className="flex items-start gap-2.5">
                              <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-muted shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h5 className="text-xs font-bold text-foreground truncate">{p.name}</h5>
                                <p className="text-[10px] text-muted-foreground truncate">{p.unit}</p>
                                <span className="text-xs font-extrabold text-foreground mt-1 inline-block">₹{p.price}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(p)}
                              className="w-full mt-3 h-7 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-xs gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </Button>
                          </div>
                        ))}
                      </ScrollableRow>
                    </div>
                  )}

                  {/* Doctors Scrollable Row */}
                  {liveSearchResults.doctors.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-cyan-600" />
                          Doctors & Specialists ({liveSearchResults.doctors.length})
                        </h4>
                        <Link to="/doctors" className="text-xs font-semibold text-primary hover:underline">
                          View all doctors →
                        </Link>
                      </div>
                      <ScrollableRow className="py-1">
                        {liveSearchResults.doctors.map((d) => (
                          <div
                            key={d.id}
                            className="flex-shrink-0 w-64 sm:w-72 p-3.5 rounded-2xl bg-background border border-border/80 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-foreground truncate">{d.name}</h5>
                              <p className="text-[11px] text-primary font-semibold truncate">{d.specialty}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{d.hospital} • ₹{d.fee}</p>
                            </div>
                            <Button size="sm" asChild className="rounded-xl text-xs font-bold shrink-0 h-8">
                              <Link to="/doctors">Book</Link>
                            </Button>
                          </div>
                        ))}
                      </ScrollableRow>
                    </div>
                  )}

                  {/* Hospitals Scrollable Row */}
                  {liveSearchResults.hospitals.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-rose-600" />
                          Hospitals & ICU Beds ({liveSearchResults.hospitals.length})
                        </h4>
                        <Link to="/hospitals" className="text-xs font-semibold text-primary hover:underline">
                          Check all beds →
                        </Link>
                      </div>
                      <ScrollableRow className="py-1">
                        {liveSearchResults.hospitals.map((h) => (
                          <div
                            key={h.id}
                            className="flex-shrink-0 w-64 sm:w-72 p-3.5 rounded-2xl bg-background border border-border/80 hover:border-rose-500/40 transition-all flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-foreground truncate">{h.name}</h5>
                              <p className="text-[11px] text-emerald-600 font-bold">{h.availableBeds.icu} ICU Beds Available</p>
                              <p className="text-[10px] text-muted-foreground truncate">{h.address}</p>
                            </div>
                            <Button size="sm" variant="outline" asChild className="rounded-xl text-xs font-bold shrink-0 h-8">
                              <Link to="/hospitals">Beds</Link>
                            </Button>
                          </div>
                        ))}
                      </ScrollableRow>
                    </div>
                  )}

                  {/* Home Services Scrollable Row */}
                  {liveSearchResults.services.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-blue-600" />
                          Home Services & Repairs ({liveSearchResults.services.length})
                        </h4>
                        <Link to="/services" className="text-xs font-semibold text-primary hover:underline">
                          View all services →
                        </Link>
                      </div>
                      <ScrollableRow className="py-1">
                        {liveSearchResults.services.map((s) => (
                          <div
                            key={s.id}
                            className="flex-shrink-0 w-56 sm:w-64 p-3.5 rounded-2xl bg-background border border-border/80 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <h5 className="text-xs font-bold text-foreground truncate">{s.name}</h5>
                              <p className="text-[11px] text-primary font-semibold">{s.category}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">₹{s.pricePerHour}/visit • {s.rating} ★</p>
                            </div>
                            <Button size="sm" asChild className="w-full mt-2 h-7 rounded-xl text-xs font-bold">
                              <Link to="/services">Book</Link>
                            </Button>
                          </div>
                        ))}
                      </ScrollableRow>
                    </div>
                  )}

                  {/* Local Spots Scrollable Row */}
                  {liveSearchResults.spots.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                          <Compass className="w-4 h-4 text-purple-600" />
                          Local Spots & Food ({liveSearchResults.spots.length})
                        </h4>
                        <Link to="/famous" className="text-xs font-semibold text-primary hover:underline">
                          Explore city →
                        </Link>
                      </div>
                      <ScrollableRow className="py-1">
                        {liveSearchResults.spots.map((sp) => (
                          <div
                            key={sp.id}
                            className="flex-shrink-0 w-56 sm:w-64 p-3.5 rounded-2xl bg-background border border-border/80 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <h5 className="text-xs font-bold text-foreground truncate">{sp.name}</h5>
                              <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{sp.tagline}</p>
                            </div>
                            <Button size="sm" variant="outline" asChild className="w-full mt-2 h-7 rounded-xl text-xs font-bold">
                              <Link to="/famous">View</Link>
                            </Button>
                          </div>
                        ))}
                      </ScrollableRow>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 2. MAIN SERVICE CATEGORY ROW (Horizontally Scrollable)    */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto pt-6 pb-4 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              All Major Services
            </h2>
            <Link to="/search" className="text-xs font-semibold text-primary hover:underline">
              Universal Search →
            </Link>
          </div>

          <ScrollableRow className="py-2">
            {SUPER_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.route as any}
                className="flex flex-col items-center flex-shrink-0 w-20 sm:w-24 p-2.5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-subtle hover:-translate-y-0.5 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-foreground mt-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
                <span className="text-[9px] text-muted-foreground truncate w-full mt-0.5">
                  {cat.badge || cat.group}
                </span>
              </Link>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 3. PROMOTIONAL BANNERS CAROUSEL                           */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-3 px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-border/40">
            <div className={`p-6 sm:p-8 bg-gradient-to-r ${PROMO_BANNERS[activeBannerIdx].gradient} text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-500`}>
              <div className="space-y-2 max-w-xl">
                <Badge className="bg-white/20 text-white border-white/30 text-[10px] font-bold backdrop-blur-sm">
                  {PROMO_BANNERS[activeBannerIdx].badge}
                </Badge>
                <h3 className="text-xl sm:text-2xl font-display font-black leading-snug">
                  {PROMO_BANNERS[activeBannerIdx].title}
                </h3>
                <p className="text-xs sm:text-sm text-white/90">
                  {PROMO_BANNERS[activeBannerIdx].subtitle}
                </p>
                <div className="pt-2">
                  <Button asChild className="rounded-xl font-bold text-xs bg-white text-black hover:bg-white/90 shadow-md">
                    <Link to={PROMO_BANNERS[activeBannerIdx].link as any}>
                      {PROMO_BANNERS[activeBannerIdx].cta} →
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="text-6xl sm:text-7xl opacity-90 hidden sm:block">
                {PROMO_BANNERS[activeBannerIdx].icon}
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
              {PROMO_BANNERS.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setActiveBannerIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeBannerIdx === i ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3B. 🛍️ SHOP BY CATEGORY (Dense Grid of Daily Essentials)  */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-5 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">🛍️</span>
                Shop by Category
              </h2>
              <p className="text-xs text-muted-foreground">Fast delivery across daily groceries, farm fresh, electronics & lifestyle</p>
            </div>
            <Link to={"/category/grocery" as any} className="text-xs font-semibold text-primary hover:underline">
              All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
            {SHOP_BY_CATEGORY_TILES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.route as any}
                className="group p-3 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-subtle flex flex-col items-center text-center relative overflow-hidden"
              >
                {cat.badge && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase bg-primary text-primary-foreground shadow-xs">
                    {cat.badge}
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform bg-muted/40">
                  {cat.emoji}
                </div>
                <span className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">Explore →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. ⚡ QUICK COMMERCE (15-Min Delivery Essentials)         */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                Quick Commerce — Delivered in 15 Mins
              </h2>
              <p className="text-xs text-muted-foreground">Kitchen staples, dairy, beverages & instant snacks</p>
            </div>
            <Link to={"/category/grocery" as any} className="text-xs font-semibold text-primary hover:underline">
              See All →
            </Link>
          </div>

          <ScrollableRow>
            {quickPicks.map((item) => {
              const numId = Math.abs(item.id.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
              const cartItem = items[numId];

              return (
                <Card key={item.id} className="w-44 sm:w-48 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col">
                  <div className="relative aspect-square w-full bg-muted/20">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold">
                      {item.deliveryMinutes}m
                    </span>
                  </div>
                  <CardContent className="p-3 flex-1 flex flex-col">
                    <h4 className="font-bold text-xs text-foreground line-clamp-1 mb-0.5">{item.name}</h4>
                    <span className="text-[11px] text-muted-foreground mb-2">{item.unit}</span>
                    <div className="mt-auto flex items-center justify-between pt-1 border-t border-border">
                      <span className="font-bold text-sm text-foreground">₹{item.price}</span>
                      {cartItem ? (
                        <div className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-lg px-1.5 py-0.5 text-xs">
                          <button onClick={() => (cartItem.quantity > 1 ? updateQuantity(numId, cartItem.quantity - 1) : removeItem(numId))}>
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold">{cartItem.quantity}</span>
                          <button onClick={() => updateQuantity(numId, cartItem.quantity + 1)}>
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => handleAddToCart(item)} className="h-7 px-3 rounded-lg text-xs font-bold bg-primary text-primary-foreground">
                          Add
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 5. 🍔 POPULAR RESTAURANTS & FOOD                          */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                Restaurants & Local Kitchens Near You
              </h2>
              <p className="text-xs text-muted-foreground">Authentic biryani, North Indian combos, freshly brewed coffee</p>
            </div>
            <Link to={"/category/restaurants" as any} className="text-xs font-semibold text-primary hover:underline">
              View Menu →
            </Link>
          </div>

          <ScrollableRow>
            {popularRestaurants.map((dish) => (
              <Card key={dish.id} className="w-64 sm:w-72 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col">
                <div className="relative aspect-video w-full">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" loading="lazy" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm">
                    {dish.cuisine || "Specialty"}
                  </span>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 text-amber-400 text-[10px] font-bold backdrop-blur-sm">
                    ★ {dish.rating}
                  </span>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-foreground line-clamp-1 mb-1">{dish.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{dish.description}</p>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="font-bold text-base text-foreground">₹{dish.price}</span>
                    <Button size="sm" onClick={() => handleAddToCart(dish)} className="h-8 rounded-xl px-4 text-xs font-bold bg-primary text-primary-foreground">
                      Order Food
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 6. 🥦 FRESH PRODUCE / GROCERY HARVEST                     */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">🥦</span>
                Fresh Fruits & Daily Harvest
              </h2>
              <p className="text-xs text-muted-foreground">Handpicked farm-fresh greens, bananas, apples & tomatoes</p>
            </div>
            <Link to={"/category/fruits" as any} className="text-xs font-semibold text-primary hover:underline">
              View Produce →
            </Link>
          </div>

          <ScrollableRow>
            {freshProduce.map((item) => {
              const numId = Math.abs(item.id.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
              const cartItem = items[numId];

              return (
                <Card key={item.id} className="w-44 sm:w-48 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth flex flex-col">
                  <div className="relative aspect-square w-full bg-muted/20">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    {item.freshnessScore && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold">
                        {item.freshnessScore}% Fresh
                      </span>
                    )}
                  </div>
                  <CardContent className="p-3 flex-1 flex flex-col">
                    <h4 className="font-bold text-xs text-foreground line-clamp-1 mb-0.5">{item.name}</h4>
                    <span className="text-[11px] text-muted-foreground mb-2">{item.unit}</span>
                    <div className="mt-auto flex items-center justify-between pt-1 border-t border-border">
                      <span className="font-bold text-sm text-foreground">₹{item.price}</span>
                      {cartItem ? (
                        <div className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-1.5 py-0.5 text-xs">
                          <button onClick={() => (cartItem.quantity > 1 ? updateQuantity(numId, cartItem.quantity - 1) : removeItem(numId))}>
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold">{cartItem.quantity}</span>
                          <button onClick={() => updateQuantity(numId, cartItem.quantity + 1)}>
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => handleAddToCart(item)} className="h-7 px-3 rounded-lg text-xs font-bold bg-primary text-primary-foreground">
                          Add
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 7. 🏥 HEALTHCARE HUB: BEDS + DOCTOR AT HOME + EMERGENCY   */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-red-500/10 via-card to-teal-500/10 border border-border space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500/15 text-red-600 border-red-500/20 font-bold text-xs">
                    24/7 Verified Healthcare & SOS
                  </Badge>
                  <span className="text-xs text-muted-foreground font-semibold">
                    Live Bed Telemetry • Certified Doctors • Home Care
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-foreground">
                  Hospital Beds, Doctor at Home & Emergency Response
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" asChild className="rounded-xl font-bold text-xs bg-red-600 text-white hover:bg-red-700">
                  <a href="tel:108"><PhoneCall className="w-3.5 h-3.5 mr-1" /> 108 Ambulance</a>
                </Button>
                <Button size="sm" variant="outline" asChild className="rounded-xl font-bold text-xs border-red-500/30 text-red-600">
                  <a href="tel:102">102 Maternity</a>
                </Button>
              </div>
            </div>

            {/* Live Bed Availability Grid (Real verified statuses: Available / Limited / Full) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {hospitalData?.capacitySummary?.map((cap: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs font-bold text-foreground block">{cap.name}</span>
                    <span className="text-[11px] text-muted-foreground">Last updated: {cap.lastUpdated}</span>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`text-xs font-bold px-2 py-0.5 ${
                        cap.status === "Available"
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20"
                          : cap.status === "Limited"
                          ? "bg-amber-500/15 text-amber-600 border-amber-500/20"
                          : "bg-red-500/15 text-red-600 border-red-500/20"
                      }`}
                    >
                      {cap.status} ({cap.available}/{cap.total})
                    </Badge>
                  </div>
                </div>
              )) || (
                <div className="col-span-3 text-center text-xs text-muted-foreground py-2">
                  Checking verified hospital capacity...
                </div>
              )}
            </div>

            {/* Quick Access Healthcare Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/80">
              <Button size="sm" asChild className="rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                <Link to="/hospitals">Check All Hospital Beds</Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="rounded-xl font-bold text-xs">
                <Link to="/home-healthcare">Book Doctor at Home</Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="rounded-xl font-bold text-xs">
                <Link to="/doctors">Find Specialist Doctor</Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="rounded-xl font-bold text-xs">
                <Link to="/diagnostics">Book Lab Tests at Home</Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="rounded-xl font-bold text-xs">
                <Link to={"/category/pharmacy" as any}>Order Medicines (15 mins)</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. 🏨 HOTELS & ACCOMMODATION (EZY Stay)                   */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <Building2 className="w-5 h-5 text-amber-500" />
                Hotels & Stay (EZY Stay)
              </h2>
              <p className="text-xs text-muted-foreground">Verified budget & premium hotels, resorts, homestays, and hostels</p>
            </div>
            <Link to="/stays" className="text-xs font-semibold text-primary hover:underline">
              View All Stays →
            </Link>
          </div>

          <ScrollableRow>
            {stays.map((hotel) => (
              <Card key={hotel.id} className="w-72 sm:w-80 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col">
                <div className="relative aspect-video w-full bg-muted">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" loading="lazy" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold uppercase backdrop-blur-sm">
                    {hotel.type || (Array.isArray(hotel.tags) ? hotel.tags[0] : "Hotel")}
                  </span>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 text-amber-400 text-[10px] font-bold backdrop-blur-sm">
                    ★ {hotel.rating}
                  </span>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-foreground line-clamp-1">{hotel.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{hotel.address || hotel.city || "Prime Location"}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold block">{hotel.availableRooms ?? 5} rooms available</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">per night</span>
                      <span className="font-black text-base text-foreground">₹{hotel.pricePerNight}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => requireAuth(() => navigate({ to: "/stays" }))}
                      className="rounded-xl font-bold text-xs bg-primary text-primary-foreground h-8 px-3.5"
                    >
                      Book Stay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 9. ✈️ TRAVEL & PACKAGES (EZY Travel)                      */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <Compass className="w-5 h-5 text-sky-500" />
                Tours & Travel Packages (EZY Travel)
              </h2>
              <p className="text-xs text-muted-foreground">Certified local agencies, weekend getaways & sightseeing packages</p>
            </div>
            <Link to="/travel" className="text-xs font-semibold text-primary hover:underline">
              See All Tours →
            </Link>
          </div>

          <ScrollableRow>
            {tours.map((tour) => (
              <Card key={tour.id} className="w-72 sm:w-80 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col">
                <div className="relative aspect-video w-full bg-muted">
                  <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" loading="lazy" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm">
                    {tour.duration}
                  </span>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-sky-600 text-white text-[10px] font-bold">
                    ★ {tour.rating}
                  </span>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-foreground line-clamp-1">{tour.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{tour.agencyName || "Verified Operator"} • {tour.destination || "Sightseeing Tour"}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{tour.includedAmenities || (Array.isArray(tour.inclusions) ? tour.inclusions.join(" • ") : "All Inclusions")}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">per person</span>
                      <span className="font-black text-base text-foreground">₹{tour.price}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => requireAuth(() => navigate({ to: "/travel" }))}
                      className="rounded-xl font-bold text-xs bg-primary text-primary-foreground h-8 px-3.5"
                    >
                      Book Tour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 10. 🚌 REGIONAL BUS & TRANSPORT (EZY Bus)                 */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <Bus className="w-5 h-5 text-blue-600" />
                Regional Buses & Live Schedules (EZY Bus)
              </h2>
              <p className="text-xs text-muted-foreground">State carriers & AC Volvos with seat booking and live running status</p>
            </div>
            <Link to="/bus" className="text-xs font-semibold text-primary hover:underline">
              Search Routes →
            </Link>
          </div>

          <ScrollableRow>
            {buses.map((bus) => (
              <Card key={bus.id} className="w-72 sm:w-80 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth flex flex-col">
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground truncate">{bus.operatorName || bus.operator || "Express Bus"}</span>
                      <Badge variant="outline" className="text-[9px] font-bold uppercase">
                        {(bus.busType || bus.type || "Bus").replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between py-2 border-y border-border text-center">
                      <div>
                        <span className="font-black text-sm text-foreground block">{bus.departureTime || bus.departure || "--:--"}</span>
                        <span className="text-[10px] text-muted-foreground">{bus.sourceCity || bus.from || "Boarding"}</span>
                      </div>
                      <div className="text-[9px] text-muted-foreground">
                        <span>{bus.duration || "Direct"}</span>
                        <div className="w-12 h-0.5 bg-border my-0.5" />
                        <span className="text-emerald-600 font-bold">{bus.runningStatus || "On Time"}</span>
                      </div>
                      <div>
                        <span className="font-black text-sm text-foreground block">{bus.arrivalTime || bus.arrival || "--:--"}</span>
                        <span className="text-[10px] text-muted-foreground">{bus.destinationCity || bus.to || "Destination"}</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-sky-600 font-semibold block">{bus.availableSeats ?? bus.seatsAvailable ?? 12} seats left</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                    <span className="font-black text-base text-foreground">₹{bus.fare}</span>
                    <Button
                      size="sm"
                      onClick={() => requireAuth(() => navigate({ to: "/bus" }))}
                      className="rounded-xl font-bold text-xs bg-primary text-primary-foreground h-8 px-3.5"
                    >
                      Select Seats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 11. 🚗 EZY RIDE & SHARE RIDE                              */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* EZY Ride Card */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs hover:shadow-subtle transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-foreground">
                  EZY Ride — Bike, Auto & Cabs
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Zero surge pricing, vetted drivers, and rapid 3-min pickups across town.
                </p>
                <div className="flex items-center gap-3 text-xs font-semibold text-foreground py-2 border-y border-border">
                  <span>🏍️ Bike ₹40</span>
                  <span>🛺 Auto ₹65</span>
                  <span>🚗 Cab ₹120</span>
                </div>
              </div>
              <Button asChild className="mt-5 rounded-xl font-bold text-xs bg-primary text-primary-foreground w-full">
                <Link to="/dashboard/transport">Book Instant Ride</Link>
              </Button>
            </div>

            {/* EZY Share Ride Card */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs hover:shadow-subtle transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-foreground">
                  EZY Share Ride — Verified Carpool
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Split fuel costs and commute with verified corporate members. Save up to 60%.
                </p>
                <div className="flex items-center gap-3 text-xs font-semibold text-foreground py-2 border-y border-border">
                  <span>📍 Tech Park Carpools</span>
                  <span>₹110 - ₹130 / seat</span>
                </div>
              </div>
              <Button asChild variant="outline" className="mt-5 rounded-xl font-bold text-xs border-primary text-primary hover:bg-primary/5 w-full">
                <Link to="/share-ride">Find & Share Rides</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 12. 📦 EZY PARCEL & 🛠️ LOCAL HOME SERVICES                */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* EZY Parcel */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-foreground">
                  EZY Parcel — Local City Courier
                </h3>
                <p className="text-xs text-muted-foreground">
                  Send lunch boxes, keys, documents or packages anywhere in town in 30-45 mins.
                </p>
                <div className="text-xs text-foreground font-semibold py-1">
                  📦 Up to 3 kg: ₹65 • 💼 Up to 10 kg: ₹110
                </div>
              </div>
              <Button asChild variant="outline" className="mt-4 rounded-xl font-bold text-xs w-full">
                <Link to="/parcel">Send a Package Now</Link>
              </Button>
            </div>

            {/* Local Services */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-foreground">
                  Home Services & Repairs
                </h3>
                <p className="text-xs text-muted-foreground">
                  Electricians, plumbers, AC service, deep cleaning and carpentry with 30-day warranty.
                </p>
                <div className="text-xs text-foreground font-semibold py-1">
                  ⚡ Verified technicians from ₹199
                </div>
              </div>
              <Button asChild className="mt-4 rounded-xl font-bold text-xs bg-primary text-primary-foreground w-full">
                <Link to={"/services" as any}>Book Home Service</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 13. 📍 LOCAL & FAMOUS NEAR YOU                            */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">📍</span>
                Famous & Popular in Your City
              </h2>
              <p className="text-xs text-muted-foreground">Legendary heritage eateries, gardens & iconic local spots</p>
            </div>
            <Link to="/famous" className="text-xs font-semibold text-primary hover:underline">
              Explore All →
            </Link>
          </div>

          <ScrollableRow>
            {FAMOUS_LOCAL_SPOTS.map((spot) => (
              <div key={spot.id} className="w-64 sm:w-72 flex-shrink-0 p-3.5 rounded-2xl border border-border bg-card hover:shadow-subtle transition-smooth flex items-center gap-3">
                <img src={spot.image} alt={spot.name} className="w-16 h-16 rounded-xl object-cover bg-muted flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-primary uppercase block truncate">{spot.tagline}</span>
                  <h4 className="font-bold text-xs text-foreground truncate">{spot.name}</h4>
                  <p className="text-[10px] text-muted-foreground truncate">{spot.address}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="font-bold text-amber-500">★ {spot.rating}</span>
                    <Link to="/famous" className="text-primary hover:underline ml-auto font-medium text-[10px]">
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 14. 🎁 OFFERS & DEALS (Copyable Coupon Codes)             */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <Tag className="w-5 h-5 text-purple-500" />
                Offers, Coupons & Deals
              </h2>
              <p className="text-xs text-muted-foreground">1-click discount codes applicable on grocery, food, stays & rides</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {[
              { code: "EZYFIRST", discount: "Flat ₹100 OFF", desc: "Valid on first grocery/food order above ₹299", color: "border-purple-500/30 bg-purple-500/5" },
              { code: "STAY500", discount: "₹500 OFF", desc: "Valid on all hotel & resort bookings above ₹2,000", color: "border-amber-500/30 bg-amber-500/5" },
              { code: "HEALTH20", discount: "Flat 20% OFF", desc: "Valid on lab checkup packages & doctor visits", color: "border-rose-500/30 bg-rose-500/5" },
              { code: "RIDEFREE", discount: "₹50 Cashback", desc: "Valid on your first EZY Share Ride or auto trip", color: "border-emerald-500/30 bg-emerald-500/5" },
            ].map((coupon) => (
              <div key={coupon.code} className={`p-4 rounded-2xl border ${coupon.color} flex flex-col justify-between shadow-xs`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-sm text-foreground">{coupon.code}</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                      {coupon.discount}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{coupon.desc}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCoupon(coupon.code)}
                  className="mt-3 h-8 text-xs font-bold rounded-xl w-full"
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy Code
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 15. 🔄 BUY AGAIN / RECENTLY ORDERED (If Available)        */}
        {/* ========================================================= */}
        {recentItems.length > 0 && (
          <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  Buy Again / Recently Viewed
                </h2>
                <p className="text-xs text-muted-foreground">Quick 1-click reorder of your regular staples</p>
              </div>
            </div>

            <ScrollableRow>
              {recentItems.map((prod) => (
                <Card key={prod.id} className="w-44 sm:w-48 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden flex flex-col">
                  <div className="aspect-square w-full bg-muted/20">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <CardContent className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-foreground line-clamp-1">{prod.name}</h4>
                      <span className="text-[11px] text-muted-foreground">₹{prod.price}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(prod)}
                      className="mt-2 h-7 rounded-lg text-xs font-bold bg-primary text-primary-foreground w-full"
                    >
                      Reorder
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </ScrollableRow>
          </section>
        )}

        {/* ========================================================= */}
        {/* 15B. 🍛 POPULAR FOOD (Dishes from Top City Restaurants)    */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">🍛</span>
                Popular Food Near You
              </h2>
              <p className="text-xs text-muted-foreground">Bestselling biryanis, gravies, momos, pizzas & regional thalis</p>
            </div>
            <Link to={"/category/restaurants" as any} className="text-xs font-semibold text-primary hover:underline">
              Explore All Food →
            </Link>
          </div>

          <ScrollableRow>
            {POPULAR_FOOD_ITEMS.map((dish) => (
              <Card key={dish.id} className="w-56 sm:w-64 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col group">
                <div className="relative aspect-video w-full bg-muted/20 overflow-hidden">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  {dish.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-black text-[9px] font-extrabold tracking-wide uppercase shadow-xs">
                      {dish.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                    {dish.deliveryTime}
                  </span>
                  <div className="absolute bottom-2 left-2">
                    <span className={`inline-block w-4 h-4 border-2 rounded-xs flex items-center justify-center bg-card/90 ${dish.isVeg ? 'border-emerald-600' : 'border-rose-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    </span>
                  </div>
                </div>
                <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1 mb-0.5">{dish.name}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{dish.restaurant}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="inline-flex items-center text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded-md">
                        ★ {dish.rating}
                      </span>
                      {dish.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-sm text-foreground">₹{dish.price}</span>
                      {dish.originalPrice && (
                        <span className="text-[10px] line-through text-muted-foreground">₹{dish.originalPrice}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddItemToCart({ id: dish.id, name: dish.name, price: dish.price, originalPrice: dish.originalPrice, image: dish.image, category: "food" })}
                      className="h-7 px-3 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Add +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 15C. 🍰 SWEETS & DESSERTS (Halwai & Modern Bakeries)       */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">🍰</span>
                Sweets, Desserts & Bakeries
              </h2>
              <p className="text-xs text-muted-foreground">Desi ghee mithai, truffle cakes, kulfi & royal rabri</p>
            </div>
            <Link to={"/category/dairy-bakery" as any} className="text-xs font-semibold text-primary hover:underline">
              See All Sweets →
            </Link>
          </div>

          <ScrollableRow>
            {SWEETS_ITEMS.map((sweet) => (
              <Card key={sweet.id} className="w-52 sm:w-56 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col group">
                <div className="relative aspect-square w-full bg-muted/20 overflow-hidden">
                  <img src={sweet.image} alt={sweet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  {sweet.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-extrabold uppercase shadow-xs">
                      {sweet.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                    {sweet.weightOrUnit}
                  </span>
                </div>
                <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-foreground line-clamp-1 mb-0.5">{sweet.name}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{sweet.sweetShop}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="text-[11px] font-bold text-foreground">{sweet.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-extrabold text-sm text-foreground">₹{sweet.price}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddItemToCart({ id: sweet.id, name: sweet.name, price: sweet.price, image: sweet.image, category: "sweets" })}
                      className="h-7 px-3 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Add +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 15D. 👗 FASHION & CLOTHES (Women, Men & Kids Tabs)         */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">👗</span>
                Fashion & Apparel
              </h2>
              <p className="text-xs text-muted-foreground">Ethnic kurtas, summer dresses, pure linen & kidswear</p>
            </div>
            
            {/* Gender Switch Tabs */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border self-start sm:self-auto">
              {(["Women", "Men", "Kids"] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedFashionGender(gender)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedFashionGender === gender
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {gender === "Women" ? "👩 Women" : gender === "Men" ? "👨 Men" : "🧒 Kids"}
                </button>
              ))}
            </div>
          </div>

          <ScrollableRow>
            {filteredFashion.map((item) => (
              <Card key={item.id} className="w-52 sm:w-60 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col group">
                <div className="relative aspect-[3/4] w-full bg-muted/20 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-extrabold uppercase shadow-xs">
                    {item.discount}
                  </span>
                  {item.badge && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-0.5">{item.brand}</span>
                    <h4 className="font-bold text-xs text-foreground line-clamp-1">{item.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="text-[11px] font-bold text-foreground">{item.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-sm text-foreground">₹{item.price}</span>
                      <span className="text-[10px] line-through text-muted-foreground">₹{item.originalPrice}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddItemToCart({ id: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice, image: item.image, category: "fashion" })}
                      className="h-7 px-2.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Add +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 15E. 💍 JEWELLERY & ORNAMENTS (Hallmarked & Designer)      */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">💍</span>
                Jewellery & Ornaments
              </h2>
              <p className="text-xs text-muted-foreground">Certified 925 sterling silver, gold plated chokers & temple jewels</p>
            </div>
            <Link to={"/category/jewellery" as any} className="text-xs font-semibold text-primary hover:underline">
              View All Jewellery →
            </Link>
          </div>

          <ScrollableRow>
            {JEWELLERY_ITEMS.map((item) => (
              <Card key={item.id} className="w-52 sm:w-60 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col group">
                <div className="relative aspect-square w-full bg-muted/20 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  {item.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-black text-[9px] font-extrabold uppercase shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-card/90 backdrop-blur-xs text-foreground text-[9px] font-bold border border-border">
                    {item.metal}
                  </span>
                </div>
                <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">{item.brand}</span>
                    <h4 className="font-bold text-xs text-foreground line-clamp-1">{item.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="text-[11px] font-bold text-foreground">{item.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-sm text-foreground">₹{item.price}</span>
                      <span className="text-[10px] line-through text-muted-foreground">₹{item.originalPrice}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddItemToCart({ id: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice, image: item.image, category: "jewellery" })}
                      className="h-7 px-2.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Add +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 15F. 💄 COSMETICS & BEAUTY (Dermat Tested & Luxury)        */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">💄</span>
                Cosmetics & Beauty
              </h2>
              <p className="text-xs text-muted-foreground">Radiance serums, waterproof sunscreens, lipsticks & haircare</p>
            </div>
            <Link to={"/category/beauty" as any} className="text-xs font-semibold text-primary hover:underline">
              Explore Beauty →
            </Link>
          </div>

          <ScrollableRow>
            {COSMETICS_ITEMS.map((item) => (
              <Card key={item.id} className="w-52 sm:w-56 flex-shrink-0 rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col group">
                <div className="relative aspect-square w-full bg-muted/20 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  {item.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-pink-600 text-white text-[9px] font-extrabold uppercase shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-medium">
                    {item.category}
                  </span>
                </div>
                <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase block mb-0.5">{item.brand}</span>
                    <h4 className="font-bold text-xs text-foreground line-clamp-1">{item.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="text-[11px] font-bold text-foreground">{item.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-sm text-foreground">₹{item.price}</span>
                      <span className="text-[10px] line-through text-muted-foreground">₹{item.originalPrice}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddItemToCart({ id: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice, image: item.image, category: "beauty" })}
                      className="h-7 px-2.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Add +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 15G. 💻 DIGITAL & ON-DEMAND SERVICES                       */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">💻</span>
                Digital & On-Demand Services
              </h2>
              <p className="text-xs text-muted-foreground">1-Tap instant access to doctors, lab tests, courier, repairs & travel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {DIGITAL_SERVICES.map((srv) => (
              <div key={srv.id} className="p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-subtle transition-smooth flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-3xl">{srv.iconEmoji}</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold">
                      {srv.badge}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">{srv.title}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">{srv.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {srv.features.map((feat) => (
                      <span key={feat} className="text-[9px] font-semibold bg-muted/60 text-foreground px-1.5 py-0.5 rounded-md">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
                <Button asChild size="sm" className="w-full h-8 text-xs font-bold rounded-xl bg-primary text-primary-foreground">
                  <Link to={srv.route as any}>
                    Book Now →
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 15H. 🏪 POPULAR LOCAL SHOPS NEAR YOU                       */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-1.5">
                <span className="text-xl">🏪</span>
                Popular Local Shops Near You
              </h2>
              <p className="text-xs text-muted-foreground">Trusted neighborhood retail stores, organic grocers & pharmacies</p>
            </div>
            <Link to="/local-shops" className="text-xs font-semibold text-primary hover:underline">
              View All Local Shops →
            </Link>
          </div>

          <ScrollableRow>
            {POPULAR_LOCAL_SHOPS_DATA.map((shop) => (
              <div key={shop.id} className="w-64 sm:w-72 flex-shrink-0 p-3.5 rounded-2xl border border-border bg-card hover:shadow-subtle transition-smooth flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-muted">
                    <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-600 text-white">
                      ● OPEN NOW
                    </span>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-black/75 text-white">
                      📍 {shop.distance}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase block mb-0.5">{shop.category}</span>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1">{shop.name}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">🌟 {shop.specialty}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{shop.address}</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 text-xs font-bold">★ {shop.rating}</span>
                    <span className="text-[10px] text-muted-foreground">({shop.reviewsCount})</span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="h-7 text-[11px] font-bold rounded-lg">
                    <Link to="/local-shops">
                      Visit Store →
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </ScrollableRow>
        </section>

        {/* ========================================================= */}
        {/* 16. 💬 24/7 CUSTOMER SUPPORT & TRUST PROMISE              */}
        {/* ========================================================= */}
        <section className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
          <div className="p-6 rounded-3xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-foreground">Need help with an order, booking or ride?</h3>
              <p className="text-xs text-muted-foreground">
                Our 24/7 customer resolution team is available via chat, WhatsApp, and phone support.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                <Link to="/dashboard/chat">Live Chat Support</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-xl font-bold text-xs">
                <a href="tel:1800123456">Toll-Free 1800</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

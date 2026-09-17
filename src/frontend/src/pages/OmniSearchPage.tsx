import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import Layout from "../components/Layout";
import {
  CATALOG_ITEMS,
  HOSPITALS_DATA,
  FAMOUS_LOCAL_SPOTS,
  LAB_PACKAGES,
  DIGITAL_SERVICES,
  POPULAR_LOCAL_SHOPS_DATA,
  type CatalogItem
} from "../ecosystem-data";
import { doctors, workers } from "../mock-data";
import { useCartStore } from "../lib/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Search,
  ArrowRight,
  ShoppingBag,
  Stethoscope,
  Building2,
  Wrench,
  UtensilsCrossed,
  Microscope,
  Compass,
  Star,
  Plus,
  SlidersHorizontal,
  X,
  Store,
  Laptop,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle
} from "lucide-react";

type SortOption = "relevant" | "price_asc" | "price_desc" | "rating" | "name_asc";
type CategoryTab = "all" | "products" | "doctors" | "hospitals" | "services" | "shops" | "spots";

export default function OmniSearchPage() {
  // 1. URL Query Synchronization
  const getInitialQuery = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("q") || "";
    }
    return "";
  };

  const [query, setQuery] = useState(getInitialQuery);
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevant");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [backendData, setBackendData] = useState<any>(null);

  const { addItem } = useCartStore();

  // Keep query in sync if URL changes (e.g. from navbar search)
  useEffect(() => {
    const handleLocationChange = () => {
      const q = new URLSearchParams(window.location.search).get("q") || "";
      setQuery(q);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Update browser URL query when searching
  const updateUrlQuery = (newQuery: string) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newQuery.trim()) {
        url.searchParams.set("q", newQuery.trim());
      } else {
        url.searchParams.delete("q");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  // 2. Real Backend Fetching with Fallback & Augmentation
  const fetchSearchResults = useCallback(async (searchQuery: string, sort: SortOption) => {
    if (!searchQuery.trim()) {
      setBackendData(null);
      return;
    }
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery.trim())}&sort=${sort}`
      );
      if (res.ok) {
        const data = await res.json();
        setBackendData(data);
      } else {
        // Fallback to local filtering if backend returns non-200
        setBackendData(null);
      }
    } catch (err: any) {
      console.warn("Backend search fetch issue, using rich local engine:", err.message);
      setBackendData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSearchResults(query, sortBy);
    }, 200);
    return () => clearTimeout(debounceTimer);
  }, [query, sortBy, fetchSearchResults]);

  // 3. Exact-Match Scorer & Comprehensive Multi-Entity Engine
  const combinedResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        products: [],
        doctors: [],
        hospitals: [],
        services: [],
        shops: [],
        spots: [],
        labs: [],
        digital: []
      };
    }

    // Helper to calculate match score:
    // Exact match = 100, Starts with = 75, Word match = 50, Substring = 30
    const calcScore = (text: string) => {
      const clean = (text || "").toLowerCase();
      if (clean === q) return 100;
      if (clean.startsWith(q)) return 75;
      const words = clean.split(/\s+/);
      if (words.some((w) => w === q)) return 60;
      if (clean.includes(q)) return 40;
      return 0;
    };

    // 1. Products & Groceries
    let productsList = CATALOG_ITEMS.map((p) => {
      const score = Math.max(
        calcScore(p.name),
        calcScore(p.description),
        ...p.tags.map((t) => calcScore(t))
      );
      return { item: p, score };
    }).filter((x) => x.score > 0);

    // If backend data returned products, augment them
    if (backendData?.results?.products?.length) {
      const backendProds = backendData.results.products.map((bp: any) => ({
        item: {
          id: String(bp.id),
          name: bp.name,
          categoryId: bp.category,
          price: bp.price,
          mrp: bp.mrp || bp.price,
          unit: bp.unit || "1 unit",
          image: bp.image,
          rating: bp.rating || 4.5,
          reviewCount: 42,
          deliveryTime: "15 mins",
          deliveryMinutes: 15,
          description: bp.description,
          tags: [bp.category]
        } as unknown as CatalogItem,
        score: calcScore(bp.name) || 50
      }));
      // Merge unique by name
      const existingNames = new Set(productsList.map((p) => p.item.name.toLowerCase()));
      for (const bp of backendProds) {
        if (!existingNames.has(bp.item.name.toLowerCase())) {
          productsList.push(bp);
        }
      }
    }

    // 2. Doctors
    let doctorsList = doctors.map((d) => {
      const score = Math.max(
        calcScore(d.name),
        calcScore(d.specialty),
        calcScore(d.hospital)
      );
      return { item: d, score };
    }).filter((x) => x.score > 0);

    if (backendData?.results?.doctors?.length) {
      const existingNames = new Set(doctorsList.map((d) => d.item.name.toLowerCase()));
      for (const bd of backendData.results.doctors) {
        if (!existingNames.has(bd.name.toLowerCase())) {
          doctorsList.push({
            item: {
              id: Number(bd.id) || 100,
              name: bd.name,
              specialty: bd.specialty,
              experience: Number(bd.experience) || 10,
              hospital: bd.hospital || "EZY Health Center",
              fee: bd.fee,
              rating: bd.rating,
              available: bd.available !== false,
              city: bd.city || "Bengaluru"
            },
            score: calcScore(bd.name) || 50
          });
        }
      }
    }

    // 3. Hospitals
    let hospitalsList = HOSPITALS_DATA.map((h) => {
      const score = Math.max(
        calcScore(h.name),
        calcScore(h.address),
        ...h.departments.map((d) => calcScore(d))
      );
      return { item: h, score };
    }).filter((x) => x.score > 0);

    // 4. Home Services & Repairs
    let servicesList = workers.map((w) => {
      const score = Math.max(calcScore(w.name), calcScore(w.category));
      return { item: w, score };
    }).filter((x) => x.score > 0);

    // 5. Shops & Partners
    let shopsList = POPULAR_LOCAL_SHOPS_DATA.map((s) => {
      const score = Math.max(calcScore(s.name), calcScore(s.category), calcScore(s.address));
      return { item: s, score };
    }).filter((x) => x.score > 0);

    // 6. Famous Local Spots
    let spotsList = FAMOUS_LOCAL_SPOTS.map((s) => {
      const score = Math.max(calcScore(s.name), calcScore(s.tagline), calcScore(s.address));
      return { item: s, score };
    }).filter((x) => x.score > 0);

    // 7. Lab Packages
    let labsList = LAB_PACKAGES.map((l) => {
      const score = Math.max(calcScore(l.name), calcScore(l.description));
      return { item: l, score };
    }).filter((x) => x.score > 0);

    // 8. Digital Services
    let digitalList = DIGITAL_SERVICES.map((d) => {
      const score = Math.max(calcScore(d.title), calcScore(d.description));
      return { item: d, score };
    }).filter((x) => x.score > 0);

    // Sort Helper
    const sortList = <T,>(
      list: { item: T; score: number }[],
      priceGetter?: (item: T) => number,
      ratingGetter?: (item: T) => number,
      nameGetter?: (item: T) => string
    ): T[] => {
      const copy = [...list];
      if (sortBy === "price_asc" && priceGetter) {
        copy.sort((a, b) => priceGetter(a.item) - priceGetter(b.item));
      } else if (sortBy === "price_desc" && priceGetter) {
        copy.sort((a, b) => priceGetter(b.item) - priceGetter(a.item));
      } else if (sortBy === "rating" && ratingGetter) {
        copy.sort((a, b) => ratingGetter(b.item) - ratingGetter(a.item));
      } else if (sortBy === "name_asc" && nameGetter) {
        copy.sort((a, b) => nameGetter(a.item).localeCompare(nameGetter(b.item)));
      } else {
        // Relevant (highest score / exact match first)
        copy.sort((a, b) => b.score - a.score);
      }
      return copy.map((entry) => entry.item);
    };

    return {
      products: sortList(productsList, (p) => p.price, (p) => p.rating, (p) => p.name),
      doctors: sortList(doctorsList, (d) => d.fee, (d) => d.rating, (d) => d.name),
      hospitals: sortList(hospitalsList, () => 0, (h) => h.rating, (h) => h.name),
      services: sortList(servicesList, (s) => s.pricePerHour, (s) => s.rating, (s) => s.name),
      shops: sortList(shopsList, () => 0, (s) => s.rating, (s) => s.name),
      spots: sortList(spotsList, () => 0, (s) => s.rating, (s) => s.name),
      labs: sortList(labsList, (l) => l.price, () => 4.8, (l) => l.name),
      digital: sortList(digitalList, () => 0, () => 4.9, (d) => d.title)
    };
  }, [query, sortBy, backendData]);

  const totalFound =
    combinedResults.products.length +
    combinedResults.doctors.length +
    combinedResults.hospitals.length +
    combinedResults.services.length +
    combinedResults.shops.length +
    combinedResults.spots.length +
    combinedResults.labs.length +
    combinedResults.digital.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlQuery(query);
    fetchSearchResults(query, sortBy);
  };

  const handleSelectChip = (chipText: string) => {
    setQuery(chipText);
    updateUrlQuery(chipText);
  };

  const handleAddToCart = (product: CatalogItem) => {
    const numId = Math.abs(
      product.id.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)
    );
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
      totalReviews: product.reviewCount
    });
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-28">
        {/* Sticky Search & Sort Control Bar */}
        <div className="border-b border-border bg-card/95 backdrop-blur-md sticky top-16 z-20 shadow-xs">
          <div className="container max-w-5xl py-4 px-4 sm:px-6 space-y-3">
            {/* Primary Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  updateUrlQuery(e.target.value);
                }}
                placeholder="Search products, food, doctors, services & more..."
                className="pl-12 pr-28 h-13 rounded-2xl bg-muted/40 border-border text-base shadow-xs font-medium focus:bg-background transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    updateUrlQuery("");
                  }}
                  className="absolute right-20 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full text-xs"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-xs cursor-pointer hover:bg-primary/90"
              >
                Search
              </Button>
            </form>

            {/* Controls Row: Category Filter Tabs & Sort Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "all"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span>All Results</span>
                  {query && totalFound > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-primary-foreground/20 text-[10px]">
                      {totalFound}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "products"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Products ({combinedResults.products.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("doctors")}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "doctors"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctors ({combinedResults.doctors.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hospitals")}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "hospitals"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hospitals ({combinedResults.hospitals.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("services")}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "services"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Services ({combinedResults.services.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("shops")}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "shops"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Shops ({combinedResults.shops.length})</span>
                </button>
              </div>

              {/* Sort By Dropdown Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-muted/70 hover:bg-muted text-foreground text-xs font-bold rounded-xl px-3 py-1.5 border border-border/80 outline-none cursor-pointer transition-colors shadow-2xs"
                >
                  <option value="relevant">Relevant (Best Match)</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Popular quick suggestion chips when query is empty or minimal */}
            {!query && (
              <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 text-xs scrollbar-none">
                <span className="text-muted-foreground font-semibold text-[11px] shrink-0">
                  Popular Searches:
                </span>
                {[
                  "Atta",
                  "Apples",
                  "Biryani",
                  "Cardiologist",
                  "Dolo 650",
                  "Electrician",
                  "Full Body Checkup",
                  "Earbuds",
                  "Filter Coffee",
                  "Homestay",
                  "Volvo Bus"
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSelectChip(chip)}
                    className="px-3 py-1 rounded-xl bg-muted/70 hover:bg-muted font-medium transition-colors whitespace-nowrap text-foreground hover:text-primary"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className="container max-w-5xl py-8 px-4 sm:px-6">
          {/* Loading Skeletons */}
          {isLoading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-4 rounded-2xl border border-border bg-card space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-8 w-20 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty / No Results State */}
          {!isLoading && query && totalFound === 0 && (
            <div className="text-center py-16 px-4 bg-card/40 rounded-3xl border border-border max-w-xl mx-auto my-6">
              <div className="w-16 h-16 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto mb-4 text-3xl">
                🔍
              </div>
              <h3 className="text-lg font-bold font-display text-foreground mb-1">
                No matching results found for "{query}"
              </h3>
              <p className="text-xs text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find an exact match. Try searching for common grocery items, cuisines, medical specialties, or home repair services.
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {["Atta", "Biryani", "Doctor", "ICU Bed", "Electrician", "Fruits"].map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectChip(tag)}
                    className="rounded-xl text-xs font-semibold"
                  >
                    Try "{tag}"
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 1: Products & Groceries */}
          {!isLoading &&
            (activeTab === "all" || activeTab === "products") &&
            combinedResults.products.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    Products & Groceries ({combinedResults.products.length})
                  </h2>
                  <Link
                    to="/dashboard/commerce"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All Products →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {combinedResults.products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-subtle transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-muted"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-foreground truncate">{p.name}</h4>
                          <p className="text-[11px] text-muted-foreground truncate">{p.unit}</p>
                          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{p.rating}</span>
                            <span className="text-muted-foreground font-normal">
                              ({p.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                        <div>
                          <span className="font-extrabold text-sm text-foreground">₹{p.price}</span>
                          {p.mrp && p.mrp > p.price && (
                            <span className="text-[10px] text-muted-foreground line-through ml-1.5">
                              ₹{p.mrp}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(p)}
                          className="h-8 px-3.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* SECTION 2: Doctors & Healthcare Specialists */}
          {!isLoading &&
            (activeTab === "all" || activeTab === "doctors") &&
            combinedResults.doctors.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-cyan-600" />
                    Doctors & Specialists ({combinedResults.doctors.length})
                  </h2>
                  <Link to="/doctors" className="text-xs font-semibold text-primary hover:underline">
                    View All Doctors →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {combinedResults.doctors.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between gap-4 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground truncate">{d.name}</h4>
                          <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-0 text-[10px] font-bold px-1.5 py-0">
                            {d.experience}
                          </Badge>
                        </div>
                        <p className="text-xs text-primary font-medium mt-0.5">{d.specialty}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {d.hospital} • Consultation: ₹{d.fee}
                        </p>
                      </div>
                      <Button size="sm" asChild className="rounded-xl text-xs font-bold shrink-0">
                        <Link to="/doctors">Book Appointment</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* SECTION 3: Hospitals & Bed Availability */}
          {!isLoading &&
            (activeTab === "all" || activeTab === "hospitals") &&
            combinedResults.hospitals.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-rose-600" />
                    Hospitals & Live Beds ({combinedResults.hospitals.length})
                  </h2>
                  <Link
                    to="/hospitals"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Check All Beds →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {combinedResults.hospitals.map((h) => (
                    <div
                      key={h.id}
                      className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between gap-3 hover:border-rose-500/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-foreground truncate">{h.name}</h4>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{h.availableBeds.icu} ICU Beds Available</span>
                          <span className="text-muted-foreground">• {h.availableBeds.general} Gen</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {h.address} • 24x7 ER
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="rounded-xl text-xs font-bold shrink-0"
                      >
                        <Link to="/hospitals">View Beds</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* SECTION 4: Home Services & Repairs */}
          {!isLoading &&
            (activeTab === "all" || activeTab === "services") &&
            combinedResults.services.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    Home Services & Specialists ({combinedResults.services.length})
                  </h2>
                  <Link
                    to="/services"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All Services →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {combinedResults.services.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-2xl border border-border bg-card flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-foreground truncate">{s.name}</h4>
                        <p className="text-[11px] text-primary font-semibold">{s.category}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          ₹{s.pricePerHour}/visit • Rating: {s.rating} ★
                        </p>
                      </div>
                      <Button
                        size="sm"
                        asChild
                        className="w-full mt-3 h-8 rounded-xl text-xs font-bold"
                      >
                        <Link to="/services">Book Technician</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* SECTION 5: Verified Shops & Partners */}
          {!isLoading &&
            (activeTab === "all" || activeTab === "shops") &&
            combinedResults.shops.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-600" />
                    Local Partner Stores ({combinedResults.shops.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {combinedResults.shops.map((sh) => (
                    <div
                      key={sh.id}
                      className="p-3.5 rounded-2xl border border-border bg-card flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-foreground truncate">{sh.name}</h4>
                        <p className="text-[11px] text-primary font-medium">{sh.category}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{sh.address}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        asChild
                        className="rounded-xl text-xs font-bold shrink-0"
                      >
                        <Link to="/dashboard/commerce">Shop</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* SECTION 6: Local Spots & City Highlights */}
          {!isLoading &&
            (activeTab === "all" || activeTab === "spots") &&
            combinedResults.spots.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                    <Compass className="w-4 h-4 text-purple-600" />
                    Famous in City ({combinedResults.spots.length})
                  </h2>
                  <Link to="/famous" className="text-xs font-semibold text-primary hover:underline">
                    Explore City →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {combinedResults.spots.map((sp) => (
                    <div
                      key={sp.id}
                      className="p-3.5 rounded-2xl border border-border bg-card flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-foreground">{sp.name}</h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {sp.tagline}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="w-full mt-3 h-8 rounded-xl text-xs font-bold"
                      >
                        <Link to="/famous">View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </Layout>
  );
}

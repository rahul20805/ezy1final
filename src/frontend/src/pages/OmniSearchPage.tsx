import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import Layout from "../components/Layout";
import { CATALOG_ITEMS, HOSPITALS_DATA, FAMOUS_LOCAL_SPOTS, LAB_PACKAGES } from "../ecosystem-data";
import { doctors, workers } from "../mock-data";
import { useCartStore } from "../lib/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  Plus
} from "lucide-react";

export default function OmniSearchPage() {
  const [query, setQuery] = useState("");
  const { addItem } = useCartStore();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        products: [],
        doctors: [],
        hospitals: [],
        services: [],
        spots: [],
        labs: []
      };
    }

    return {
      products: CATALOG_ITEMS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 6),

      doctors: doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.hospital.toLowerCase().includes(q)
      ).slice(0, 4),

      hospitals: HOSPITALS_DATA.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.departments.some((dept) => dept.toLowerCase().includes(q))
      ).slice(0, 3),

      services: workers.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q)
      ).slice(0, 3),

      spots: FAMOUS_LOCAL_SPOTS.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q)
      ).slice(0, 3),

      labs: LAB_PACKAGES.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      ).slice(0, 3)
    };
  }, [query]);

  const totalFound =
    results.products.length +
    results.doctors.length +
    results.hospitals.length +
    results.services.length +
    results.spots.length +
    results.labs.length;

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-24">
        {/* Search Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md sticky top-16 z-20">
          <div className="container max-w-4xl py-6 px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, food, doctors, hospitals, services & more..."
                className="pl-12 pr-4 h-14 rounded-2xl bg-background border-border text-base shadow-sm font-medium"
              />
            </div>

            {/* Popular quick chips */}
            {!query && (
              <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 text-xs scrollbar-hide">
                <span className="text-muted-foreground font-semibold">Popular:</span>
                {[
                  "Atta",
                  "Apples",
                  "Biryani",
                  "Cardiologist",
                  "Dolo 650",
                  "Electrician",
                  "Full Body Checkup",
                  "Earbuds",
                  "Filter Coffee"
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-3 py-1 rounded-xl bg-muted/60 hover:bg-muted font-medium transition-colors whitespace-nowrap text-foreground"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className="container max-w-4xl py-8 px-4">
          {query && totalFound === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-3 opacity-50">🔍</div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                No matching results for "{query}"
              </h3>
              <p className="text-sm text-muted-foreground">
                Try searching for groceries, dishes, doctors, hospitals, or services.
              </p>
            </div>
          )}

          {/* Group 1: Products & Groceries */}
          {results.products.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  Products & Groceries ({results.products.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.products.map((p) => {
                  const numId = Math.abs(p.id.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl border border-border bg-card hover:shadow-subtle transition-smooth flex items-center gap-3"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-foreground truncate">{p.name}</h4>
                        <p className="text-[11px] text-muted-foreground truncate">{p.unit}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-sm text-foreground">₹{p.price}</span>
                          <Button
                            size="sm"
                            onClick={() => {
                              addItem({
                                id: numId,
                                vendorId: 1,
                                name: p.name,
                                description: p.description,
                                price: p.price,
                                mrp: p.mrp || p.price,
                                images: [p.image],
                                category: p.categoryId,
                                categoryIds: [1],
                                inStock: true,
                                stockCount: 50,
                                isAvailable: true,
                                rating: p.rating,
                                totalReviews: p.reviewCount,
                              });
                            }}
                            className="h-7 px-3 rounded-lg text-xs font-bold bg-primary text-primary-foreground"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 2: Doctors */}
          {results.doctors.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-cyan-600" />
                  Doctors & Specialists ({results.doctors.length})
                </h2>
                <Link to="/doctors" className="text-xs font-semibold text-primary hover:underline">
                  View All Doctors →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.doctors.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{d.name}</h4>
                      <p className="text-xs text-primary font-medium">{d.specialty}</p>
                      <p className="text-[11px] text-muted-foreground">{d.hospital} • ₹{d.fee}</p>
                    </div>
                    <Button size="sm" asChild className="rounded-xl text-xs font-bold">
                      <Link to="/doctors">Book</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 3: Hospitals */}
          {results.hospitals.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-red-600" />
                  Hospitals & Emergency ({results.hospitals.length})
                </h2>
                <Link to="/hospitals" className="text-xs font-semibold text-primary hover:underline">
                  View All Beds →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.hospitals.map((h) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{h.name}</h4>
                      <p className="text-xs text-emerald-600 font-semibold">
                        {h.availableBeds.icu} ICU Beds Available
                      </p>
                      <p className="text-[11px] text-muted-foreground">{h.address}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild className="rounded-xl text-xs font-bold">
                      <Link to="/hospitals">View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 4: Home Services */}
          {results.services.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  Home Services & Repairs ({results.services.length})
                </h2>
                <Link to="/services" className="text-xs font-semibold text-primary hover:underline">
                  View All Services →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {results.services.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-2xl border border-border bg-card">
                    <h4 className="font-bold text-xs text-foreground">{s.name}</h4>
                    <p className="text-[11px] text-primary font-semibold">{s.category}</p>
                    <p className="text-[11px] text-muted-foreground">₹{s.pricePerHour}/visit</p>
                    <Button size="sm" asChild className="w-full mt-2 h-7 rounded-lg text-xs font-bold">
                      <Link to="/services">Book</Link>
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

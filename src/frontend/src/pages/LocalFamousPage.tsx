import { useState } from "react";
import Layout from "../components/Layout";
import { RelatedPagesBar } from "../components/RelatedPagesBar";
import { FAMOUS_LOCAL_SPOTS, type FamousLocalSpot } from "../ecosystem-data";
import { vendors } from "../mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Compass,
  Clock,
  Navigation,
  Phone,
  Search,
  Sparkles,
  Store
} from "lucide-react";

export default function LocalFamousPage() {
  const [filterType, setFilterType] = useState<"ALL" | "FOOD" | "LANDMARK" | "SHOP">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpots = FAMOUS_LOCAL_SPOTS.filter((spot) => {
    if (filterType !== "ALL" && spot.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        spot.name.toLowerCase().includes(q) ||
        spot.tagline.toLowerCase().includes(q) ||
        spot.description.toLowerCase().includes(q) ||
        spot.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <Layout>
      <RelatedPagesBar domain="local" activeId="famous" />
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md">
          <div className="container max-w-7xl py-8 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20 font-semibold">
                    Local Heritage & Icons
                  </Badge>
                  <span className="text-xs text-muted-foreground">Bengaluru Edition</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
                  Famous in Your City & Local Near You
                </h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Discover the authentic taste, iconic heritage spots, and beloved neighbourhood markets that define the culture of your city.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search famous food or spot..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background border-border text-sm"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-6 overflow-x-auto scrollbar-hide text-xs">
              {[
                { id: "ALL", label: "🌟 All Famous Spots" },
                { id: "FOOD", label: "🍲 Legendary Food & Sweets" },
                { id: "LANDMARK", label: "🏛️ Tourist & Heritage Places" },
                { id: "SHOP", label: "🛍️ Historic Markets & Artisans" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-smooth whitespace-nowrap ${
                    filterType === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/70 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Famous Cards Grid */}
        <div className="container max-w-7xl py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => (
              <Card
                key={spot.id}
                className="rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col group"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 text-white backdrop-blur-md text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{spot.rating}</span>
                    <span className="text-[10px] text-zinc-300 font-normal">
                      ({(spot.reviewsCount / 1000).toFixed(1)}k)
                    </span>
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1 block">
                    {spot.tagline}
                  </span>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {spot.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-4 flex-1">
                    {spot.description}
                  </p>

                  {spot.specialtyDishOrItem && (
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs mb-4">
                      <strong className="text-foreground font-semibold">Famous For: </strong>
                      <span className="text-primary font-medium">{spot.specialtyDishOrItem}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-muted-foreground mb-4 pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span className="truncate">{spot.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span>{spot.timings}</span>
                    </div>
                  </div>

                  <div className="pt-2 mt-auto flex items-center gap-2">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(spot.name + " " + spot.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 shadow-sm transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Get Directions
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Local Neighbourhood Shops Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold font-display text-foreground">
                  🏪 Verified Neighbourhood Stores
                </h2>
                <p className="text-xs text-muted-foreground">
                  Order directly from your friendly corner kirana, medical stores, and fresh fruit vendors.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {vendors.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-xl border border-border bg-card hover:shadow-subtle transition-smooth flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base flex-shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-foreground truncate">{v.businessName}</h4>
                    <p className="text-xs text-muted-foreground">{v.category} • {v.city}</p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{v.address}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="font-bold text-amber-500 flex items-center gap-1">
                        ★ {v.rating || 4.5}
                      </span>
                      <a
                        href={`tel:${v.phone}`}
                        className="text-primary hover:underline font-semibold flex items-center gap-1 ml-auto"
                      >
                        <Phone className="w-3 h-3" />
                        Call Store
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { useState, useMemo } from "react";
import { Link, useParams } from "@tanstack/react-router";
import Layout from "../components/Layout";
import { SUPER_CATEGORIES, CATALOG_ITEMS, type CatalogItem } from "../ecosystem-data";
import { useCartStore } from "../lib/cartStore";
import { useRequireAuth } from "../components/AuthPromptModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Star,
  Clock,
  ShieldCheck,
  Lock,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Upload,
  AlertCircle
} from "lucide-react";

export default function CategoryDetailPage() {
  const { categoryId } = useParams({ strict: false }) as { categoryId?: string };
  const currentCat = SUPER_CATEGORIES.find((c) => c.id === categoryId) || SUPER_CATEGORIES[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);

  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const { requireAuth } = useRequireAuth();

  // Filter items
  const categoryItems = useMemo(() => {
    return CATALOG_ITEMS.filter((item) => {
      if (item.categoryId !== currentCat.id) return false;
      if (vegOnly && item.isVeg === false) return false;
      if (selectedTag && !item.tags.includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          (item.brand && item.brand.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [currentCat.id, vegOnly, selectedTag, searchQuery]);

  // Extract unique tags for this category
  const availableTags = useMemo(() => {
    const all = CATALOG_ITEMS.filter((i) => i.categoryId === currentCat.id).flatMap((i) => i.tags);
    return Array.from(new Set(all));
  }, [currentCat.id]);

  const handleAddToCart = (product: CatalogItem) => {
    // We convert CatalogItem to CartItem compatible format
    const mappedProduct: any = {
      id: Math.abs(product.id.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp || product.price,
      images: [product.image],
      category: currentCat.name,
      categoryIds: [1],
      inStock: true,
      stockCount: 50,
      isAvailable: true,
      rating: product.rating,
      totalReviews: product.reviewCount,
    };
    addItem(mappedProduct);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-24">
        {/* Category Hero Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md sticky top-16 z-20">
          <div className="container max-w-7xl py-4 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {currentCat.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                      {currentCat.name}
                    </h1>
                    {currentCat.badge && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold">
                        {currentCat.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {currentCat.tagline}
                  </p>
                </div>
              </div>

              {/* Delivery SLA & Badges */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Delivering in 15-20 mins</span>
                </div>

                {currentCat.id === "pharmacy" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPrescriptionModalOpen(true)}
                    className="h-9 rounded-xl text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Prescription
                  </Button>
                )}

                {currentCat.isAgeRestricted && !ageConfirmed && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
                    18+ Age Verification Required
                  </Badge>
                )}
              </div>
            </div>

            {/* Privacy & Discreet Packaging Guarantee for Sexual Wellness */}
            {currentCat.id === "sexual-wellness" && (
              <div className="mt-3 p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 flex items-center gap-3 text-xs">
                <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong className="font-semibold text-white">100% Discreet Packaging Guarantee:</strong> Items are delivered in unbranded, opaque, tamper-evident sealed packaging with discreet billing.
                </div>
              </div>
            )}

            {/* Search & Tag Filter Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={`Search in ${currentCat.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-background border-border text-sm"
                />
              </div>

              {/* Tag Filters */}
              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-hide text-xs">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-smooth ${
                    selectedTag === null
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/70 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  All Items ({CATALOG_ITEMS.filter((i) => i.categoryId === currentCat.id).length})
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-smooth ${
                      selectedTag === tag
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/70 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}

                {/* Pure Veg Toggle if applicable */}
                {["restaurants", "cafe", "grocery", "sweets"].includes(currentCat.id) && (
                  <button
                    onClick={() => setVegOnly(!vegOnly)}
                    className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-smooth whitespace-nowrap ${
                      vegOnly
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Pure Veg
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 18+ Age Gate Modal for restricted items */}
        {currentCat.isAgeRestricted && !ageConfirmed && (
          <div className="container max-w-xl mx-auto my-12 p-6 rounded-2xl bg-card border border-border shadow-xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center text-2xl font-bold mb-3">
              18+
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              Age Verification Required
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              This category contains age-restricted products. In accordance with legal regulations, please confirm that you are 18 years of age or older to proceed.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" asChild className="rounded-xl">
                <Link to="/">Go Back to Home</Link>
              </Button>
              <Button
                onClick={() => setAgeConfirmed(true)}
                className="rounded-xl bg-primary text-primary-foreground font-bold"
              >
                I am 18 or Older
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {(!currentCat.isAgeRestricted || ageConfirmed) && (
          <div className="container max-w-7xl py-8 px-4 sm:px-6">
            {categoryItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-3 opacity-60">{currentCat.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">No items found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or category filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag(null);
                    setVegOnly(false);
                  }}
                  className="rounded-xl"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {categoryItems.map((item) => {
                  const numId = Math.abs(item.id.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
                  const cartItem = items[numId];

                  return (
                    <Card
                      key={item.id}
                      className="rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col group"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          loading="lazy"
                        />
                        {/* Veg / Non-Veg Indicator */}
                        {item.isVeg !== undefined && (
                          <div className="absolute top-2.5 left-2.5 w-4 h-4 rounded-sm border border-border bg-card flex items-center justify-center p-0.5 shadow-sm">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isVeg ? "bg-emerald-600" : "bg-red-600"
                              }`}
                            />
                          </div>
                        )}

                        {/* Freshness Badge if Fruits / Veggies */}
                        {item.freshnessScore && (
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold shadow-sm backdrop-blur-sm">
                            {item.freshnessScore}% Fresh
                          </div>
                        )}

                        {/* Discreet Packaging Badge */}
                        {item.isDiscreet && (
                          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-200 text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                            <Lock className="w-2.5 h-2.5 text-emerald-400" />
                            Discreet
                          </div>
                        )}
                      </div>

                      {/* Product Body */}
                      <CardContent className="p-4 flex flex-col flex-1">
                        {item.brand && (
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                            {item.brand}
                          </span>
                        )}
                        <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-3 flex-1">
                          {item.description}
                        </p>

                        {/* Specifications / Author if present */}
                        {item.author && (
                          <p className="text-xs text-muted-foreground font-medium mb-2">
                            By <span className="text-foreground font-semibold">{item.author}</span>
                          </p>
                        )}
                        {item.specs && (
                          <div className="grid grid-cols-2 gap-1 mb-3 py-1 px-2 rounded-lg bg-muted/40 text-[11px] text-muted-foreground">
                            {Object.entries(item.specs).slice(0, 2).map(([k, v]) => (
                              <div key={k} className="truncate">
                                <span className="font-medium text-foreground">{k}:</span> {v}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Unit / Weight */}
                        <div className="text-xs font-semibold text-muted-foreground mb-3">
                          {item.unit}
                        </div>

                        {/* Rating & Delivery Time */}
                        <div className="flex items-center gap-2 mb-3 text-xs">
                          <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {item.rating}
                          </span>
                          <span className="text-muted-foreground">({item.reviewCount})</span>
                          <span className="text-muted-foreground font-medium ml-auto flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-500" />
                            {item.deliveryMinutes}m
                          </span>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                          <div>
                            <div className="text-base font-bold text-foreground font-display">
                              ₹{item.price}
                            </div>
                            {item.mrp && item.mrp > item.price && (
                              <div className="text-[11px] text-muted-foreground line-through">
                                ₹{item.mrp}
                              </div>
                            )}
                          </div>

                          {/* Cart Action */}
                          {cartItem ? (
                            <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-2 py-1 shadow-sm">
                              <button
                                onClick={() => {
                                  if (cartItem.quantity > 1) {
                                    updateQuantity(numId, cartItem.quantity - 1);
                                  } else {
                                    removeItem(numId);
                                  }
                                }}
                                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(numId, cartItem.quantity + 1)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className="rounded-xl h-9 px-4 font-bold text-xs bg-primary text-primary-foreground hover:opacity-95 shadow-sm"
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Prescription Upload Dialog */}
        {prescriptionModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground mb-1">
                Upload Valid Prescription
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Our certified pharmacist will review your prescription, verify dosages, and arrange home delivery in 15-30 minutes.
              </p>

              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer mb-4">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <span className="text-xs font-semibold text-foreground block">
                  Click to select prescription image or PDF
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Supports JPG, PNG, PDF up to 10MB
                </span>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPrescriptionModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    requireAuth({
                      title: "Sign in to Submit Prescription",
                      description: "We need your contact and delivery address to fulfill your medicines.",
                      onSuccess: () => {
                        setPrescriptionModalOpen(false);
                        alert("Prescription uploaded successfully! A pharmacist will call you shortly.");
                      }
                    });
                  }}
                  className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                >
                  Submit for Verification
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

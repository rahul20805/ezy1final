import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Clock, MapPin, ShoppingBag, Star } from "lucide-react";
import Layout from "../components/Layout";
import { useStoreData } from "../lib/storeData";

export default function VendorStorefrontPage() {
  const store = useStoreData();
  const liveProducts = store.products.filter((p) => p.published && p.inStock);

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        {/* Storefront Header */}
        <div className="bg-card rounded-3xl border border-border shadow-subtle p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-3xl font-display font-black text-primary">
              {store.settings.brandName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Hyperlocal Superstore
                </Badge>
                <Badge
                  variant="outline"
                  className="text-emerald-600 border-emerald-200 bg-emerald-50"
                >
                  {store.settings.isOpenToday ? "Open Now" : "Closed Today"}
                </Badge>
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-1">
                {store.settings.brandName}
              </h1>
              <p className="text-xs text-muted-foreground mb-3">
                {store.settings.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />{" "}
                  {store.settings.address}, {store.settings.city}
                </span>
                <span className="flex items-center gap-1 text-foreground font-semibold">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9
                  (500+ reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {store.settings.openingHours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-foreground">
              Available Live Products
            </h2>
            <p className="text-xs text-muted-foreground">
              Instant delivery in {store.settings.deliveryRadiusKm}km radius
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {liveProducts.length} items
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {liveProducts.map((product) => (
            <Card
              key={product.id}
              className="border-border hover:border-primary/40 transition-all overflow-hidden group flex flex-col rounded-2xl"
            >
              <div className="aspect-square bg-muted/30 relative overflow-hidden">
                <img
                  src={
                    product.images[0] ||
                    "https://placehold.co/400x400?text=Product"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.mrp > product.price && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] px-1.5 border-0">
                    {Math.round(
                      ((product.mrp - product.price) / product.mrp) * 100,
                    )}
                    % OFF
                  </Badge>
                )}
              </div>
              <CardContent className="p-3.5 flex-1 flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  {product.category}
                </span>
                <h3 className="font-semibold text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/60">
                  <div>
                    <p className="font-display font-black text-base text-foreground">
                      ₹{product.price}
                    </p>
                    {product.mrp > product.price && (
                      <p className="text-[10px] text-muted-foreground line-through">
                        ₹{product.mrp}
                      </p>
                    )}
                  </div>
                  <Link to="/dashboard/commerce">
                    <Button
                      size="sm"
                      className="h-8 px-3 text-xs bg-primary text-primary-foreground font-semibold rounded-xl"
                    >
                      Add to Cart
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

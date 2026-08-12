import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Clock, ShoppingBag } from "lucide-react";
import Layout from "../components/Layout";
import { vendors, products } from "../mock-data";
import { Link } from "@tanstack/react-router";

export default function VendorStorefrontPage() {
  // Hardcoded to Vendor ID 1 (Sharma Kirana) for demo purposes
  const vendor = vendors.find(v => v.id === 1)!;
  const vendorProducts = products.filter(p => p.vendorId === vendor.id);

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        {/* Storefront Header */}
        <div className="bg-card rounded-2xl border border-border shadow-subtle p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-3xl font-display font-black text-primary">
              {vendor.businessName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="bg-secondary/10 text-secondary border-secondary/20">{vendor.category}</Badge>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Open Now</Badge>
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">{vendor.businessName}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {vendor.address}, {vendor.city}</span>
                <span className="flex items-center gap-1 text-foreground font-semibold"><Star className="w-4 h-4 text-primary fill-primary" /> {vendor.rating} (340 reviews)</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 09:00 AM - 09:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display">All Products</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {vendorProducts.map(product => (
            <Card key={product.id} className="border-border hover:border-primary/30 transition-smooth overflow-hidden group flex flex-col">
              <div className="aspect-square bg-muted/30 relative overflow-hidden">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.mrp > product.price && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] px-1.5 border-0">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </Badge>
                )}
              </div>
              <CardContent className="p-3 flex-1 flex flex-col">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">₹{product.price}</p>
                    {product.mrp > product.price && (
                      <p className="text-[10px] text-muted-foreground line-through">₹{product.mrp}</p>
                    )}
                  </div>
                  <Link to="/dashboard/cart">
                    <Button size="sm" className="h-7 px-3 text-xs bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-0">
                      Add
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

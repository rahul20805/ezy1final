import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Stethoscope,
  Building2,
  Home,
  Microscope,
  Pill,
  Search,
  Car,
  Bus,
  Users,
  Package,
  BedDouble,
  Compass,
  Wrench,
  ShoppingBag,
  UtensilsCrossed,
  Sparkles,
  Plane
} from "lucide-react";

export type RelatedDomain = "healthcare" | "transport" | "stays" | "services" | "shopping" | "local";

interface RelatedPageItem {
  id: string;
  label: string;
  route: string;
  icon: React.ReactNode;
  badge?: string;
}

const DOMAIN_PAGES: Record<RelatedDomain, RelatedPageItem[]> = {
  healthcare: [
    { id: "doctors", label: "Find Doctors", route: "/doctors", icon: <Stethoscope className="w-3.5 h-3.5 text-cyan-600" /> },
    { id: "hospitals", label: "Hospitals & Beds", route: "/hospitals", icon: <Building2 className="w-3.5 h-3.5 text-rose-600" />, badge: "Live Beds" },
    { id: "home-doctor", label: "Doctor at Home", route: "/home-healthcare", icon: <Home className="w-3.5 h-3.5 text-blue-600" /> },
    { id: "diagnostics", label: "Lab Tests & Scans", route: "/diagnostics", icon: <Microscope className="w-3.5 h-3.5 text-purple-600" /> },
    { id: "pharmacy", label: "Pharmacy & Meds", route: "/dashboard/healthcare", icon: <Pill className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: "search", label: "Universal Search", route: "/search?category=doctors", icon: <Search className="w-3.5 h-3.5 text-primary" /> }
  ],
  transport: [
    { id: "rides", label: "Cabs & Rides", route: "/dashboard/transport", icon: <Car className="w-3.5 h-3.5 text-yellow-500" />, badge: "Fast" },
    { id: "bus", label: "Regional Bus", route: "/bus", icon: <Bus className="w-3.5 h-3.5 text-blue-600" /> },
    { id: "share-ride", label: "Share Ride / Carpool", route: "/share-ride", icon: <Users className="w-3.5 h-3.5 text-emerald-600" />, badge: "Save 60%" },
    { id: "parcel", label: "City Parcel", route: "/parcel", icon: <Package className="w-3.5 h-3.5 text-amber-600" /> },
    { id: "stays", label: "Hotels & Stays", route: "/stays", icon: <BedDouble className="w-3.5 h-3.5 text-purple-600" /> },
    { id: "search", label: "Universal Search", route: "/search", icon: <Search className="w-3.5 h-3.5 text-primary" /> }
  ],
  stays: [
    { id: "stays", label: "Hotels & Stays", route: "/stays", icon: <BedDouble className="w-3.5 h-3.5 text-amber-600" />, badge: "Verified" },
    { id: "bus", label: "Volvo Bus", route: "/bus", icon: <Bus className="w-3.5 h-3.5 text-blue-600" /> },
    { id: "travel", label: "Travel & Tours", route: "/travel", icon: <Plane className="w-3.5 h-3.5 text-sky-600" /> },
    { id: "famous", label: "Explore City Spots", route: "/famous", icon: <Compass className="w-3.5 h-3.5 text-purple-600" /> },
    { id: "share-ride", label: "Share Ride", route: "/share-ride", icon: <Users className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: "search", label: "Universal Search", route: "/search?category=spots", icon: <Search className="w-3.5 h-3.5 text-primary" /> }
  ],
  services: [
    { id: "services", label: "Home Repairs & Trades", route: "/services", icon: <Wrench className="w-3.5 h-3.5 text-blue-600" />, badge: "Verified" },
    { id: "quick", label: "Quick Commerce", route: "/category/grocery", icon: <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />, badge: "15 Mins" },
    { id: "transport", label: "Rides & Cabs", route: "/dashboard/transport", icon: <Car className="w-3.5 h-3.5 text-yellow-500" /> },
    { id: "parcel", label: "Parcel Delivery", route: "/parcel", icon: <Package className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: "search", label: "Universal Search", route: "/search?category=services", icon: <Search className="w-3.5 h-3.5 text-primary" /> }
  ],
  shopping: [
    { id: "grocery", label: "Grocery Essentials", route: "/category/grocery", icon: <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: "fruits", label: "Fresh Fruits", route: "/category/fruits", icon: <Sparkles className="w-3.5 h-3.5 text-rose-500" /> },
    { id: "quick", label: "15-Min Commerce", route: "/category/grocery", icon: <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />, badge: "Express" },
    { id: "pharmacy", label: "Pharmacy Care", route: "/dashboard/healthcare", icon: <Pill className="w-3.5 h-3.5 text-teal-600" /> },
    { id: "food", label: "Food & Restaurants", route: "/category/restaurants", icon: <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" /> },
    { id: "search", label: "Universal Search", route: "/search?category=products", icon: <Search className="w-3.5 h-3.5 text-primary" /> }
  ],
  local: [
    { id: "famous", label: "Famous Food & Spots", route: "/famous", icon: <Compass className="w-3.5 h-3.5 text-purple-600" />, badge: "Heritage" },
    { id: "restaurants", label: "Food & Cafes", route: "/category/restaurants", icon: <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" /> },
    { id: "stays", label: "Hotels & Stays", route: "/stays", icon: <BedDouble className="w-3.5 h-3.5 text-amber-600" /> },
    { id: "travel", label: "City Tours", route: "/travel", icon: <Plane className="w-3.5 h-3.5 text-sky-600" /> },
    { id: "search", label: "Universal Search", route: "/search?category=spots", icon: <Search className="w-3.5 h-3.5 text-primary" /> }
  ]
};

interface RelatedPagesBarProps {
  domain: RelatedDomain;
  activeId: string;
  className?: string;
}

export function RelatedPagesBar({ domain, activeId, className = "" }: RelatedPagesBarProps) {
  const pages = DOMAIN_PAGES[domain] || [];

  return (
    <div className={`w-full py-2.5 px-4 sm:px-6 bg-card/60 border-b border-border/80 backdrop-blur-xs ${className}`}>
      <div className="container max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-muted-foreground mr-1">
          <span>Related Services:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 flex-1">
          {pages.map((p) => {
            const isActive = p.id === activeId;
            return (
              <Link
                key={p.id}
                to={p.route as any}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 hover:bg-muted text-foreground/80 hover:text-foreground border border-border/60"
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {p.badge && !isActive && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">
                    {p.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

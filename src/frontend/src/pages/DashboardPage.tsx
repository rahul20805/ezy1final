import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Bus,
  Globe,
  Hotel,
  Landmark,
  MapPin,
  Search,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  TrendingUp,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import UserLayout from "../components/UserLayout";
import { useCurrentUserProfile, useWallet } from "../lib/backend-hooks";
import { serviceCategories } from "../mock-data";

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

const aiRecommendations = [
  {
    id: 1,
    icon: Stethoscope,
    color: "bg-primary/10 text-primary",
    title: "Dr. Priya Sharma",
    description:
      "Best nearby general physician, ₹300 consult, next slot 10:30 AM",
    cta: "Book Now",
    link: "/dashboard/healthcare",
  },
  {
    id: 2,
    icon: Bus,
    color: "bg-secondary/10 text-secondary",
    title: "Express Bus to Mysuru",
    description: "Fastest KSRTC route departs 6:00 AM, 12 seats left at ₹180",
    cta: "View Route",
    link: "/dashboard/transport",
  },
  {
    id: 3,
    icon: UtensilsCrossed,
    color: "bg-accent/10 text-accent",
    title: "Reddy Tiffin Centre",
    description: "Popular restaurant near you, full thali ₹80, 4.3 ★ rated",
    cta: "Order Food",
    link: "/dashboard",
  },
  {
    id: 4,
    icon: ShoppingCart,
    color: "bg-primary/10 text-primary",
    title: "Sharma Kirana Store",
    description: "Trending grocery — Basmati Rice ₹120/kg, fresh stock today",
    cta: "Shop Now",
    link: "/dashboard",
  },
  {
    id: 5,
    icon: Hotel,
    color: "bg-secondary/10 text-secondary",
    title: "Hotel Sunrise Bengaluru",
    description: "Weekend deal ₹1,299/night, includes breakfast, 4.5 ★ rated",
    cta: "View Deal",
    link: "/dashboard",
  },
  {
    id: 6,
    icon: Zap,
    color: "bg-accent/10 text-accent",
    title: "Local Electrician",
    description: "Top-rated home repair service, available today, ₹250 visit",
    cta: "Book Service",
    link: "/dashboard",
  },
];

const trendingChips = [
  { label: "🏥 Healthcare", link: "/dashboard/healthcare" },
  { label: "🚌 Bus Tickets", link: "/dashboard/transport" },
  { label: "🛒 Groceries", link: "/dashboard" },
  { label: "⚡ Recharge", link: "/dashboard" },
  { label: "🍱 Food Order", link: "/dashboard" },
  { label: "💳 Payments", link: "/dashboard" },
  { label: "🏠 Home Services", link: "/dashboard" },
  { label: "📱 Digital Gov", link: "/dashboard" },
  { label: "🚗 Ride Share", link: "/dashboard/transport" },
  { label: "💊 Medicines", link: "/dashboard/healthcare" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUserProfile();
  const { data: wallet } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");

  const greeting = getGreeting();

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return serviceCategories;
    const q = searchQuery.toLowerCase();
    return serviceCategories.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const filteredRecs = useMemo(() => {
    if (!searchQuery.trim()) return aiRecommendations;
    const q = searchQuery.toLowerCase();
    return aiRecommendations.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <UserLayout title="My Dashboard">
      <div className="space-y-6 pb-6" data-ocid="dashboard.page">
        {/* Search bar */}
        <div className="relative" data-ocid="dashboard.search_bar">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services, doctors, rides..."
            className="pl-10 bg-card border-border h-12 text-base rounded-xl shadow-sm"
            data-ocid="dashboard.search_input"
          />
        </div>

        {/* Location greeting banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-primary rounded-2xl p-5 text-primary-foreground shadow-elevated"
          data-ocid="dashboard.greeting_banner"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {userLoading ? (
                <Skeleton className="h-7 w-48 bg-primary-foreground/20" />
              ) : (
                <h2 className="font-display font-bold text-xl sm:text-2xl leading-tight">
                  {greeting}, {user?.name?.split(" ")[0] ?? "Friend"} 👋
                </h2>
              )}
              <div className="flex items-center gap-1.5 mt-2">
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs gap-1 hover:bg-primary-foreground/30">
                  <MapPin className="w-3 h-3" />
                  Serving you in {user?.city ?? "India"}
                </Badge>
              </div>
              <p className="text-primary-foreground/75 text-sm mt-2">
                Your everything app — hyperlocal &amp; national services
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-primary-foreground/70 mb-1">
                Wallet
              </div>
              <div className="font-display font-bold text-xl text-primary-foreground">
                ₹{wallet?.balance?.toLocaleString() ?? "—"}
              </div>
              <Link to="/dashboard/wallet" data-ocid="dashboard.wallet_link">
                <button
                  type="button"
                  className="text-xs text-primary-foreground/70 hover:text-primary-foreground underline underline-offset-2 mt-1 transition-colors"
                >
                  View Wallet →
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick action buttons */}
        <div data-ocid="dashboard.quick_actions">
          <h3 className="font-display font-semibold text-base text-foreground mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <Link to="/dashboard/healthcare" data-ocid="dashboard.sos_button">
              <button
                type="button"
                className="w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive hover:bg-destructive/20 transition-smooth group"
              >
                <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center shadow-md group-hover:scale-105 transition-smooth">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-semibold leading-tight text-center">
                  Emergency SOS
                </span>
              </button>
            </Link>
            <Link
              to="/dashboard/transport"
              data-ocid="dashboard.book_ride_button"
            >
              <button
                type="button"
                className="w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/25 hover:bg-primary/20 transition-smooth group"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-smooth">
                  <Bus className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-[11px] font-semibold text-foreground leading-tight text-center">
                  Book Ride
                </span>
              </button>
            </Link>
            <Link to="/dashboard" data-ocid="dashboard.order_food_button">
              <button
                type="button"
                className="w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/10 border border-secondary/25 hover:bg-secondary/20 transition-smooth group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-md group-hover:scale-105 transition-smooth">
                  <UtensilsCrossed className="w-5 h-5 text-secondary-foreground" />
                </div>
                <span className="text-[11px] font-semibold text-foreground leading-tight text-center">
                  Order Food
                </span>
              </button>
            </Link>
            <Link
              to="/dashboard/healthcare"
              data-ocid="dashboard.book_doctor_button"
            >
              <button
                type="button"
                className="w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/25 hover:bg-accent/20 transition-smooth group"
              >
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-md group-hover:scale-105 transition-smooth">
                  <Stethoscope className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-[11px] font-semibold text-foreground leading-tight text-center">
                  Book Doctor
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* AI Recommendations */}
        <div data-ocid="dashboard.recommendations_section">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-secondary" />
            <h3 className="font-display font-semibold text-lg text-foreground">
              Recommended for You
            </h3>
            <Badge
              variant="outline"
              className="ml-auto text-xs border-secondary/40 text-secondary gap-1"
            >
              <TrendingUp className="w-3 h-3" /> AI-Powered
            </Badge>
          </div>
          {filteredRecs.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground text-sm"
              data-ocid="dashboard.recommendations.empty_state"
            >
              No recommendations match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRecs.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    data-ocid={`dashboard.rec_card.${i + 1}`}
                  >
                    <Card className="border-border hover:shadow-elevated hover:-translate-y-0.5 transition-smooth h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${rec.color}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-display font-semibold text-sm text-foreground leading-tight">
                              {rec.title}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                              {rec.description}
                            </p>
                            <Link
                              to={rec.link as "/dashboard"}
                              data-ocid={`dashboard.rec_cta.${i + 1}`}
                            >
                              <button
                                type="button"
                                className="mt-2 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                              >
                                {rec.cta} <ArrowRight className="w-3 h-3" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Trending Services */}
        <div data-ocid="dashboard.trending_section">
          <h3 className="font-display font-semibold text-lg text-foreground mb-3">
            Trending Services
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {trendingChips.map((chip, i) => (
              <Link
                key={chip.label}
                to={chip.link as "/dashboard"}
                data-ocid={`dashboard.trending_chip.${i + 1}`}
              >
                <div className="flex-shrink-0 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-smooth whitespace-nowrap cursor-pointer">
                  {chip.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div data-ocid="dashboard.services_section">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            All Services
          </h3>
          {filteredServices.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground text-sm"
              data-ocid="dashboard.services.empty_state"
            >
              No services match your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredServices.map((svc, i) => {
                const Icon = iconMap[svc.icon] ?? Zap;
                return (
                  <Link
                    key={svc.id}
                    to={svc.route as "/dashboard"}
                    data-ocid={`dashboard.service_card.${i + 1}`}
                  >
                    <Card className="hover:shadow-elevated hover:-translate-y-0.5 transition-smooth cursor-pointer border-border h-full">
                      <CardContent className="p-4">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${
                            svc.color === "primary"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : svc.color === "secondary"
                                ? "bg-secondary/10 text-secondary border-secondary/20"
                                : "bg-accent/10 text-accent border-accent/20"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="font-display font-semibold text-sm text-foreground leading-tight">
                          {svc.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {svc.description}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

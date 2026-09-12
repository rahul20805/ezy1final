import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useLocationStore } from "../lib/locationStore";
import { LocationModal } from "./location/LocationModal";

export function QuickCommerceHeader() {
  const [search, setSearch] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { currentLocation } = useLocationStore();

  const locationDisplay =
    [currentLocation.locality, currentLocation.city].filter(Boolean).join(", ") ||
    currentLocation.formattedAddress ||
    "Set Location";

  return (
    <div className="bg-gradient-to-r from-primary to-[#ff8c42] p-4 sm:p-8 rounded-b-3xl sm:rounded-3xl shadow-md text-primary-foreground relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <h1 className="font-bold text-2xl sm:text-4xl tracking-tight leading-none">
                Everything you need, one place.
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 mt-2 opacity-95 text-sm font-medium hover:opacity-100 transition-opacity cursor-pointer group text-left"
              title="Click to change your delivery location"
            >
              <MapPin className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
              <span>
                Delivering to{" "}
                <strong className="font-bold border-b border-dashed border-white/60 group-hover:border-white">
                  {locationDisplay}
                </strong>
              </span>
            </button>
          </div>
        </div>

        <div className="relative max-w-3xl mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            placeholder="Search groceries, doctors, restaurants, electricians..."
            className="pl-14 h-14 bg-white text-foreground border-0 shadow-lg rounded-xl font-medium text-lg placeholder:text-muted-foreground/70 focus-visible:ring-4 focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <LocationModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
      />
    </div>
  );
}

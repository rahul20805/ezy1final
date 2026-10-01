import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Clock, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useLocationStore } from "../lib/locationStore";
import { LocationModal } from "./location/LocationModal";

export function QuickCommerceHeader() {
  const [search, setSearch] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { currentLocation } = useLocationStore();
  const navigate = useNavigate();

  const locationDisplay =
    [currentLocation.locality, currentLocation.city]
      .filter(Boolean)
      .join(", ") ||
    currentLocation.formattedAddress ||
    "Set Location";

  return (
    <div className="bg-gradient-to-r from-primary to-[#ff8c42] p-4 sm:p-8 rounded-b-3xl sm:rounded-3xl shadow-md text-primary-foreground relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <h1 className="font-bold text-xl sm:text-4xl tracking-tight leading-tight">
                Everything you need, one place.
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 mt-1 sm:mt-2 opacity-95 text-xs sm:text-sm font-medium hover:opacity-100 transition-opacity cursor-pointer group text-left max-w-full"
              title="Click to change your delivery location"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate">
                Delivering to{" "}
                <strong className="font-bold border-b border-dashed border-white/60 group-hover:border-white">
                  {locationDisplay}
                </strong>
              </span>
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = search.trim();
            if (trimmed) {
              navigate({ to: "/search", search: { q: trimmed } });
            } else {
              navigate({ to: "/search" });
            }
          }}
          className="relative max-w-3xl mt-3 sm:mt-4"
        >
          <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search groceries, doctors, food, electricians..."
            className="pl-11 sm:pl-14 pr-20 sm:pr-24 h-11 sm:h-14 bg-white text-foreground border-0 shadow-lg rounded-xl font-medium text-xs sm:text-base placeholder:text-muted-foreground/70 focus-visible:ring-4 focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <LocationModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
      />
    </div>
  );
}

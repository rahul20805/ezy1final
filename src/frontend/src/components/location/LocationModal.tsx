import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MapPin,
  Navigation,
  Search,
  Check,
  AlertCircle,
  Clock,
  Loader2,
  Building,
  Home,
  Map,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useLocationStore, LocationData } from "@/lib/locationStore";
import { InteractiveMap } from "./InteractiveMap";
import { toast } from "sonner";

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectLocation?: (location: LocationData) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  open,
  onOpenChange,
  onSelectLocation,
}) => {
  const {
    currentLocation,
    isDetectingGps,
    gpsError,
    gpsAccuracyWarning,
    savedAddresses,
    setLocation,
    saveAddress,
    detectCurrentLocation,
  } = useLocationStore();

  // Active editable form state
  const [formData, setFormData] = useState<LocationData>(currentLocation);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [pinCodeError, setPinCodeError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with store on modal open
  useEffect(() => {
    if (open) {
      setFormData(currentLocation);
      setSearchQuery("");
      setSearchResults([]);
      setPinCodeError(null);
    }
  }, [open, currentLocation]);

  // Handle Search Input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (q.trim().length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/location/search?query=${encodeURIComponent(q.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  // Handle selecting a search suggestion
  const handleSelectSearchResult = (item: LocationData) => {
    setFormData({
      ...item,
      source: "manual",
    });
    setSearchQuery("");
    setSearchResults([]);
    toast.success(`Selected ${item.city || item.formattedAddress}`);
  };

  // Handle Live GPS trigger
  const handleUseCurrentLocation = async () => {
    const result = await detectCurrentLocation();
    if (result.success && result.location) {
      setFormData(result.location);
      toast.success("Location detected via GPS!");
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  // Handle Map pin drag / click
  const handleCoordinatesChange = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(`/api/location/reverse?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data.location) {
          setFormData((prev) => ({
            ...prev,
            ...data.location,
            addressLine1: prev.addressLine1 || data.location.addressLine1,
            addressLine2: prev.addressLine2 || data.location.addressLine2,
            latitude: lat,
            longitude: lng,
            source: "map",
          }));
        }
      }
    } catch (err) {
      console.error("Failed to reverse geocode map coords:", err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // PIN code validator for India
  const handlePincodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: cleaned }));

    if (cleaned.length > 0 && !/^[1-9][0-9]{5}$/.test(cleaned)) {
      setPinCodeError("Please enter a valid 6-digit Indian PIN code");
    } else {
      setPinCodeError(null);
    }
  };

  // Confirm and save location
  const handleConfirmLocation = () => {
    // PIN code check
    if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      setPinCodeError("Valid 6-digit Indian PIN code is required");
      return;
    }

    if (!formData.city && !formData.formattedAddress) {
      toast.error("Please enter a city or address");
      return;
    }

    // Build final formatted address if empty or updated
    const components = [
      formData.addressLine1,
      formData.addressLine2,
      formData.locality,
      formData.city,
      formData.state,
      formData.pincode,
    ].filter(Boolean);

    const finalAddress: LocationData = {
      ...formData,
      formattedAddress: components.length > 0 ? components.join(", ") : formData.formattedAddress,
    };

    setLocation(finalAddress);
    saveAddress(finalAddress);

    if (onSelectLocation) {
      onSelectLocation(finalAddress);
    }

    toast.success(`Active location set: ${finalAddress.city || "Selected location"}`);
    onOpenChange(false);
  };

  const currentLat = formData.latitude ?? 12.9716;
  const currentLng = formData.longitude ?? 77.5946;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-y-auto p-0 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold font-heading text-stone-900 dark:text-white">
                Select Your Service Location
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500 dark:text-stone-400">
                Choose your exact location to see verified local partners, instant pricing, and accurate delivery timelines.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* METHOD 1: Use Current Location */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isDetectingGps}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-75 cursor-pointer text-sm"
            >
              {isDetectingGps ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Detecting your precise GPS location...</span>
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4" />
                  <span>Use Current / Live Location</span>
                </>
              )}
            </button>

            {/* GPS Status Alerts */}
            {gpsError && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{gpsError} Please type your address below or pick on the map.</span>
              </div>
            )}

            {gpsAccuracyWarning && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 rounded-xl text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{gpsAccuracyWarning}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">
            <div className="h-[1px] flex-1 bg-stone-200 dark:bg-stone-800" />
            <span>OR SEARCH & TYPE ADDRESS</span>
            <div className="h-[1px] flex-1 bg-stone-200 dark:bg-stone-800" />
          </div>

          {/* METHOD 2: Autocomplete Search Bar */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search area, landmark, locality, or PIN code..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm text-stone-900 dark:text-white placeholder-stone-400 transition-all"
              />
              {isSearching && (
                <Loader2 className="absolute right-4 h-4 w-4 animate-spin text-orange-500" />
              )}
            </div>

            {/* Suggestions Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-30 divide-y divide-stone-100 dark:divide-stone-800">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left p-3.5 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-start gap-3 transition-colors cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {item.locality || item.city || item.addressLine1 || "Location"}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                        {item.formattedAddress}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* METHOD 3: Interactive Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Map className="h-3.5 w-3.5 text-orange-500" />
                <span>Pinpoint on Map</span>
                {isReverseGeocoding && (
                  <span className="text-[11px] text-orange-600 font-normal flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Updating address...
                  </span>
                )}
              </label>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
              >
                {showMap ? "Hide Map" : "Show Map"}
              </button>
            </div>

            {showMap && (
              <InteractiveMap
                latitude={currentLat}
                longitude={currentLng}
                onCoordinatesChange={handleCoordinatesChange}
                className="h-64 w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-inner"
              />
            )}
          </div>

          {/* Structured Address Form */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Address Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  Flat / House / Building No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flat 402, Royal Palms"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:border-orange-500 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  Street / Area / Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Metro Station, 100ft Road"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:border-orange-500 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  Locality / Suburb
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indiranagar"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:border-orange-500 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  City / Town <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:border-orange-500 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  State <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karnataka"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:border-orange-500 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  PIN Code (6 Digits) <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 560038"
                  value={formData.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border ${
                    pinCodeError
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-stone-200 dark:border-stone-800 focus:border-orange-500"
                  } focus:outline-none text-xs text-stone-900 dark:text-white`}
                />
                {pinCodeError && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{pinCodeError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent / Saved Addresses */}
          {savedAddresses.length > 0 && (
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-stone-400" />
                <span>Recent / Saved Locations</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {savedAddresses.map((addr, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFormData(addr);
                      toast.info(`Switched to ${addr.city || addr.formattedAddress}`);
                    }}
                    className={`text-left px-3 py-2 rounded-xl text-xs border transition-all cursor-pointer flex items-center gap-2 ${
                      formData.formattedAddress === addr.formattedAddress
                        ? "bg-orange-50 dark:bg-orange-950/40 border-orange-400 text-orange-900 dark:text-orange-200"
                        : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300"
                    }`}
                  >
                    <Home className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                    <span className="truncate max-w-[200px] font-medium">
                      {addr.locality || addr.city || addr.addressLine1 || "Saved Location"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Address Summary Banner */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-900 dark:text-white">
                Active Selection:
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300 break-words mt-0.5">
                {[
                  formData.addressLine1,
                  formData.addressLine2,
                  formData.locality,
                  formData.city,
                  formData.state,
                  formData.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || formData.formattedAddress}
              </p>
              {formData.latitude && (
                <p className="text-[11px] text-stone-400 font-mono mt-1">
                  GPS: {formData.latitude.toFixed(5)}, {formData.longitude?.toFixed(5)} ({formData.source})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/40 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLocation}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="h-4 w-4" />
            <span>Confirm & Apply Location</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

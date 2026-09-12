import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocationData {
  addressLine1: string;
  addressLine2: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string;
  source: "gps" | "manual" | "map";
  accuracy: number | null;
}

export const DEFAULT_INITIAL_LOCATION: LocationData = {
  addressLine1: "12, MG Road Market",
  addressLine2: "Indiranagar",
  locality: "Indiranagar",
  city: "Bengaluru",
  district: "Bengaluru Urban",
  state: "Karnataka",
  pincode: "560038",
  country: "India",
  latitude: 12.9716,
  longitude: 77.5946,
  formattedAddress: "12, MG Road Market, Indiranagar, Bengaluru, Karnataka 560038",
  source: "manual",
  accuracy: null,
};

interface LocationState {
  currentLocation: LocationData;
  isDetectingGps: boolean;
  gpsError: string | null;
  gpsAccuracyWarning: string | null;
  savedAddresses: LocationData[];
  setLocation: (location: LocationData) => void;
  saveAddress: (location: LocationData) => void;
  detectCurrentLocation: () => Promise<{ success: boolean; location?: LocationData; error?: string }>;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      currentLocation: DEFAULT_INITIAL_LOCATION,
      isDetectingGps: false,
      gpsError: null,
      gpsAccuracyWarning: null,
      savedAddresses: [DEFAULT_INITIAL_LOCATION],

      setLocation: (loc: LocationData) => {
        set({
          currentLocation: loc,
          gpsError: null,
          gpsAccuracyWarning: null,
        });
      },

      saveAddress: (loc: LocationData) => {
        const existing = get().savedAddresses;
        const exists = existing.some(
          (a) =>
            a.formattedAddress.toLowerCase() === loc.formattedAddress.toLowerCase() ||
            (a.latitude === loc.latitude && a.longitude === loc.longitude && a.latitude !== null)
        );
        if (!exists) {
          set({ savedAddresses: [loc, ...existing.slice(0, 4)] });
        }
      },

      detectCurrentLocation: async () => {
        if (!navigator.geolocation) {
          const err = "Geolocation is not supported by your browser or device.";
          set({ gpsError: err, isDetectingGps: false });
          return { success: false, error: err };
        }

        set({ isDetectingGps: true, gpsError: null, gpsAccuracyWarning: null });

        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude, accuracy } = position.coords;

              let accuracyWarning: string | null = null;
              if (accuracy > 200) {
                accuracyWarning = `GPS accuracy is approximate (±${Math.round(
                  accuracy
                )}m). You can adjust the pin on the map.`;
              }

              try {
                // Call backend reverse geocoding proxy
                const res = await fetch(
                  `/api/location/reverse?lat=${latitude}&lng=${longitude}`
                );
                const data = await res.json();

                if (!res.ok || !data.success || !data.location) {
                  throw new Error(data.error || "Reverse geocoding failed.");
                }

                const resolvedLocation: LocationData = {
                  ...data.location,
                  source: "gps",
                  accuracy: Math.round(accuracy),
                };

                set({
                  currentLocation: resolvedLocation,
                  isDetectingGps: false,
                  gpsError: null,
                  gpsAccuracyWarning: accuracyWarning,
                });
                get().saveAddress(resolvedLocation);

                resolve({ success: true, location: resolvedLocation });
              } catch (err: any) {
                // Return coordinate-based fallback without mock
                const fallbackLocation: LocationData = {
                  addressLine1: `Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                  addressLine2: "",
                  locality: "",
                  city: "Detected Location",
                  district: "",
                  state: "",
                  pincode: "",
                  country: "India",
                  latitude,
                  longitude,
                  formattedAddress: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
                  source: "gps",
                  accuracy: Math.round(accuracy),
                };

                set({
                  currentLocation: fallbackLocation,
                  isDetectingGps: false,
                  gpsError: null,
                  gpsAccuracyWarning: accuracyWarning,
                });
                resolve({ success: true, location: fallbackLocation });
              }
            },
            (error) => {
              let msg = "Could not retrieve GPS location.";
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  msg = "Location permission denied. Please allow location access or enter your address manually.";
                  break;
                case error.POSITION_UNAVAILABLE:
                  msg = "Location information is unavailable. Please check your device GPS or enter address manually.";
                  break;
                case error.TIMEOUT:
                  msg = "Location request timed out. Please try again or search manually.";
                  break;
              }
              set({ gpsError: msg, isDetectingGps: false });
              resolve({ success: false, error: msg });
            },
            {
              enableHighAccuracy: true,
              timeout: 12000,
              maximumAge: 0,
            }
          );
        });
      },

      clearLocation: () => {
        set({ currentLocation: DEFAULT_INITIAL_LOCATION });
      },
    }),
    {
      name: "ezy1_active_location_v2",
    }
  )
);

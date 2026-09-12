import React, { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, ZoomIn, ZoomOut, LocateFixed } from "lucide-react";

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  onCoordinatesChange: (lat: number, lng: number) => void;
  className?: string;
}

declare global {
  interface Window {
    L?: any;
  }
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  onCoordinatesChange,
  className = "h-72 w-full rounded-2xl overflow-hidden shadow-inner border border-stone-200 dark:border-stone-800",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load Leaflet CDN dynamically if not present
  useEffect(() => {
    if (window.L) {
      setIsLeafletLoaded(true);
      return;
    }

    // Add Leaflet CSS
    const existingCss = document.getElementById("leaflet-cdn-css");
    if (!existingCss) {
      const link = document.createElement("link");
      link.id = "leaflet-cdn-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    // Add Leaflet JS
    const existingScript = document.getElementById("leaflet-cdn-js");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "leaflet-cdn-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.async = true;
      script.onload = () => {
        setIsLeafletLoaded(true);
      };
      script.onerror = () => {
        setLoadError("Failed to load map tile resources. Please check your internet connection.");
      };
      document.body.appendChild(script);
    } else {
      existingScript.addEventListener("load", () => setIsLeafletLoaded(true));
    }
  }, []);

  // Initialize or update Map
  useEffect(() => {
    if (!isLeafletLoaded || !containerRef.current || !window.L) return;

    const L = window.L;
    const validLat = Number.isFinite(latitude) ? latitude : 12.9716;
    const validLng = Number.isFinite(longitude) ? longitude : 77.5946;

    if (!mapInstanceRef.current) {
      // Create custom pin icon using HTML/SVG
      const customPinIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="
            position: relative;
            transform: translate(-50%, -100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: grab;
          ">
            <div style="
              width: 36px;
              height: 36px;
              background: linear-gradient(135deg, #FF5B22 0%, #D93800 100%);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(255, 91, 34, 0.4);
              border: 2px solid #ffffff;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background: #ffffff;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
            <div style="
              width: 14px;
              height: 4px;
              background: rgba(0, 0, 0, 0.25);
              border-radius: 50%;
              margin-top: 4px;
              filter: blur(1px);
            "></div>
          </div>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
      });

      const map = L.map(containerRef.current, {
        center: [validLat, validLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: true,
      });

      // OpenStreetMap Tiles with attribution
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Draggable Marker
      const marker = L.marker([validLat, validLng], {
        draggable: true,
        icon: customPinIcon,
        autoPan: true,
      }).addTo(map);

      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onCoordinatesChange(position.lat, position.lng);
      });

      // Click anywhere on map to reposition marker
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onCoordinatesChange(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      const map = mapInstanceRef.current;
      const marker = markerRef.current;

      const currentLatLng = marker.getLatLng();
      const distance = Math.abs(currentLatLng.lat - validLat) + Math.abs(currentLatLng.lng - validLng);

      // Only flyTo and update if coordinates changed noticeably (prevent feedback loop)
      if (distance > 0.0001) {
        marker.setLatLng([validLat, validLng]);
        map.flyTo([validLat, validLng], Math.max(map.getZoom(), 15), {
          duration: 0.8,
        });
      }
    }

    return () => {
      // Map cleanup on unmount
    };
  }, [isLeafletLoaded, latitude, longitude, onCoordinatesChange]);

  // Clean up map instance on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current && Number.isFinite(latitude) && Number.isFinite(longitude)) {
      mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 0.6 });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {!isLeafletLoaded && !loadError && (
        <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 flex flex-col items-center justify-center gap-3 z-10">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
          <span className="text-xs font-medium text-stone-500">Loading interactive map tiles...</span>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 flex flex-col items-center justify-center p-4 text-center z-10">
          <MapPin className="h-8 w-8 text-stone-400 mb-2" />
          <p className="text-xs text-rose-500 font-medium">{loadError}</p>
        </div>
      )}

      {/* Map DOM Node */}
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Custom Overlay Controls */}
      {isLeafletLoaded && (
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-white dark:bg-stone-900 p-1.5 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-700 dark:text-stone-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-700 dark:text-stone-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <div className="h-[1px] bg-stone-200 dark:bg-stone-800 my-0.5" />
          <button
            type="button"
            onClick={handleRecenter}
            className="p-2 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg text-orange-600 transition-colors"
            title="Center Pin"
          >
            <LocateFixed className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Drag Instruction Banner */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full shadow pointer-events-none flex items-center gap-1.5 whitespace-nowrap">
        <MapPin className="h-3 w-3 text-orange-400" />
        <span>Drag pin or click map to pinpoint exact location</span>
      </div>
    </div>
  );
};

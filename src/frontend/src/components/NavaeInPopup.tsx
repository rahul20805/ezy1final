import React, { useState, useEffect } from "react";
import { X, ExternalLink, Sparkles } from "lucide-react";
import { NAVAEIN_URL } from "../config/links";
import { Button } from "@/components/ui/button";

const STORAGE_DISMISS_KEY = "ezy1_navaein_popup_dismissed_at";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours frequency control

export function NavaeInPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Safety check: do not show on checkout, login, cart, partner or admin routes
    if (typeof window === "undefined") return;
    const path = window.location.pathname.toLowerCase();
    if (
      path.includes("/cart") ||
      path.includes("/checkout") ||
      path.includes("/login") ||
      path.includes("/partner") ||
      path.includes("/admin")
    ) {
      return;
    }

    // 2. Frequency control: check if dismissed within the last 24 hours
    try {
      const dismissedAt = localStorage.getItem(STORAGE_DISMISS_KEY);
      if (dismissedAt) {
        const timeSince = Date.now() - parseInt(dismissedAt, 10);
        if (timeSince < COOLDOWN_MS) {
          return; // Still in cooldown
        }
      }
    } catch {
      // Ignore localStorage access issues in restricted modes
    }

    // 3. Show after gentle initial delay (2.5 seconds) so user gets oriented first
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_DISMISS_KEY, Date.now().toString());
    } catch {
      // safe fallback
    }
  };

  const handleVisit = () => {
    handleClose();
    window.open(NAVAEIN_URL, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="navaein-modal-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-border shadow-2xl transition-all scale-100 animate-in zoom-in-95 duration-200">
        {/* Top Banner Image with gradient overlay */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600">
          <img
            src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80"
            alt="NavaeIN Art, Craft & Lifestyle"
            className="w-full h-full object-cover mix-blend-overlay opacity-80"
          />
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close promotional popup"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-md cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Floating badge */}
          <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-foreground text-xs font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Featured Brand Promotion</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-3">
          <div className="space-y-1">
            <h3
              id="navaein-modal-title"
              className="text-2xl font-display font-extrabold tracking-tight text-foreground"
            >
              NAVAEIN
            </h3>
            <p className="text-sm font-semibold text-primary">
              Discover NavaeIN • Art • Craft • Lifestyle
            </p>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Explore handcrafted art pieces, custom home decor, unique artisanal gifts, and curated lifestyle creations.
          </p>

          <div className="pt-2 flex flex-col items-center gap-2">
            <Button
              onClick={handleVisit}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold text-sm shadow-md gap-2"
            >
              <span>Visit NavaeIN</span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
              <span>External Website</span>
              <span className="text-orange-500 font-bold">↗</span>
              <span className="text-muted-foreground/60">• Opens in new tab</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

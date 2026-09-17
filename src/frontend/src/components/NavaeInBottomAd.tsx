import React from "react";
import { ExternalLink, Sparkles, Palette, Gem, Gift } from "lucide-react";
import { NAVAEIN_URL } from "../config/links";
import { Button } from "@/components/ui/button";

export function NavaeInBottomAd() {
  return (
    <section className="w-full py-6 px-4 sm:px-6 bg-gradient-to-b from-transparent via-muted/30 to-muted/50 border-t border-border/60">
      <div className="container max-w-6xl mx-auto">
        <a
          href={NAVAEIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-rose-500/5 to-amber-500/10 hover:border-orange-500/60 p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          {/* Subtle decorative glow */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none group-hover:bg-orange-500/20 transition-all" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            {/* Left Column: Brand & Description */}
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Brand Promotion</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-extrabold tracking-tight text-foreground flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span>✨ Discover NavaeIN ✨</span>
              </h3>

              <p className="text-sm sm:text-base font-semibold text-primary">
                Art • Craft • Lifestyle • Unique Products
              </p>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Handcrafted treasures, authentic handmade artisan gifts, bespoke lifestyle accessories, and timeless creations.
              </p>

              {/* Highlights pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-card border border-border">
                  <Palette className="w-3 h-3 text-orange-500" /> Handmade Art
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-card border border-border">
                  <Gem className="w-3 h-3 text-rose-500" /> Premium Crafts
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-card border border-border">
                  <Gift className="w-3 h-3 text-amber-500" /> Bespoke Gifts
                </span>
              </div>
            </div>

            {/* Right Column: CTA Button & External Label */}
            <div className="flex flex-col items-center shrink-0 space-y-1.5">
              <Button
                size="lg"
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold text-sm shadow-md gap-2 group-hover:scale-105 transition-transform"
              >
                <span>Explore NavaeIN</span>
                <ExternalLink className="w-4 h-4" />
              </Button>

              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <span>External Website</span>
                <span className="text-orange-500 font-bold">↗</span>
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

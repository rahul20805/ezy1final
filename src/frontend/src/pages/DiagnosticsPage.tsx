import { useState } from "react";
import Layout from "../components/Layout";
import { LAB_PACKAGES, type LabPackage } from "../ecosystem-data";
import { RelatedPagesBar } from "../components/RelatedPagesBar";
import { useRequireAuth } from "../components/AuthPromptModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Microscope,
  Clock,
  Home,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Calendar
} from "lucide-react";

export default function DiagnosticsPage() {
  const [selectedSlot, setSelectedSlot] = useState("Tomorrow 07:00 AM - 08:00 AM (Fasting)");
  const [bookedSuccess, setBookedSuccess] = useState<string | null>(null);
  const { requireAuth } = useRequireAuth();

  const handleBookPackage = (pkg: LabPackage) => {
    requireAuth({
      title: `Book ${pkg.name}`,
      description: `Home Sample Collection • ${selectedSlot} • ₹${pkg.price}`,
      onSuccess: () => {
        setBookedSuccess(`Booking confirmed for ${pkg.name}! Phlebotomist assigned for home collection. Reference: EZY-LAB-${Date.now().toString().slice(-4)}`);
        setTimeout(() => setBookedSuccess(null), 6000);
      }
    });
  };

  return (
    <Layout>
      <RelatedPagesBar domain="healthcare" activeId="diagnostics" />
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="border-b border-border bg-card/60 backdrop-blur-md">
          <div className="container max-w-7xl py-8 px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 font-semibold">
                NABL Accredited Labs
              </Badge>
              <span className="text-xs text-muted-foreground">Free Home Sample Collection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              Lab Tests & Preventive Health Checkups
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Certified phlebotomists collect blood/urine samples from your home safely. Digital reports delivered within 12-24 hours.
            </p>

            {bookedSuccess && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{bookedSuccess}</span>
              </div>
            )}
          </div>
        </div>

        {/* Collection Slot Selector */}
        <div className="container max-w-7xl py-4 px-4 sm:px-6">
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Choose Home Collection Slot:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "Tomorrow 07:00 AM - 08:00 AM (Fasting)",
                "Tomorrow 08:30 AM - 09:30 AM (Fasting)",
                "Tomorrow 10:00 AM - 11:00 AM",
                "Day After Tomorrow 07:30 AM"
              ].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1.5 rounded-xl border font-medium transition-smooth ${
                    selectedSlot === slot
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/50 border-border hover:bg-muted text-foreground"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="container max-w-7xl py-6 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LAB_PACKAGES.map((pkg) => (
              <Card
                key={pkg.id}
                className="rounded-2xl border-border bg-card overflow-hidden hover:shadow-elevated transition-smooth flex flex-col"
              >
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
                      {pkg.testsCount} Tests Included
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      Reports in {pkg.reportHours}h
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {pkg.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-muted/40 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Home className="w-3.5 h-3.5 text-primary" />
                      <span>Free Home Sample Pickup included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Smart online report with doctor review notes</span>
                    </div>
                    {pkg.fastingRequired && (
                      <div className="flex items-center gap-2 text-amber-600 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>10-12 hours fasting required</span>
                      </div>
                    )}
                  </div>

                  {/* Parameters */}
                  <div className="text-xs mb-4 flex-1">
                    <strong className="text-foreground block mb-1">Includes:</strong>
                    <div className="flex flex-wrap gap-1">
                      {pkg.includedParameters.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded-md bg-muted text-[11px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Booking */}
                  <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold font-display text-foreground">
                        ₹{pkg.price}
                      </div>
                      <div className="text-xs text-muted-foreground line-through">
                        ₹{pkg.mrp}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBookPackage(pkg)}
                      className="rounded-xl h-10 px-5 font-bold font-display bg-primary text-primary-foreground shadow-sm text-xs"
                    >
                      Book Home Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

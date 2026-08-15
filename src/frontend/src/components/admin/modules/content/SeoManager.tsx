import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileCode,
  Globe,
  Save,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useStoreData } from "../../../../lib/storeData";
import { ImageUploader } from "../../../owner/ImageUploader";

export function SeoManager() {
  const store = useStoreData();

  const [metaTitle, setMetaTitle] = useState(store.settings.metaTitle);
  const [metaDescription, setMetaDescription] = useState(store.settings.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(store.settings.metaKeywords);
  const [ogImage, setOgImage] = useState(store.settings.logoUrl);

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      metaKeywords: metaKeywords.trim(),
    });
    toast.success("SEO Metadata & Social Graph settings saved!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> SEO & Search Engine Optimization
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure OpenGraph tags, Google indexing metadata, social preview images and sitemaps.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSaveSeo}
          className="h-9 rounded-xl text-xs bg-primary text-primary-foreground font-semibold gap-1.5 shadow-xs"
        >
          <Save className="w-3.5 h-3.5" /> Save SEO Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <Card className="lg:col-span-7 rounded-3xl border-border bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-display font-bold">Metadata Configuration</CardTitle>
            <CardDescription className="text-xs">These tags are automatically rendered into the HTML head.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Meta Title Tag *</Label>
                <span className="text-[10px] text-muted-foreground font-mono">{metaTitle.length}/60 chars</span>
              </div>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="rounded-xl text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Meta Description Tag *</Label>
                <span className="text-[10px] text-muted-foreground font-mono">{metaDescription.length}/160 chars</span>
              </div>
              <Textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Keywords (Comma-separated)</Label>
              <Input
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right: Live Google Search Preview */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border-border bg-card shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <h3 className="font-display font-bold text-sm">Google Search Snippet Preview</h3>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1 font-sans">
              <span className="text-[11px] text-muted-foreground block font-mono">https://ezy1final.vercel.app</span>
              <h4 className="text-base text-blue-600 hover:underline cursor-pointer font-medium line-clamp-1">
                {metaTitle || "EZY1 - Hyperlocal Platform"}
              </h4>
              <p className="text-xs text-foreground/80 line-clamp-2">
                {metaDescription || "Instant grocery delivery, local artisans and doctor consultations on demand."}
              </p>
            </div>
          </Card>

          <Card className="rounded-3xl border-border bg-card shadow-xs p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-primary" /> Auto-Generated XML Sitemap
              </span>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                Active /sitemap.xml
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Dynamic sitemap updates automatically on every product, category and blog publication.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

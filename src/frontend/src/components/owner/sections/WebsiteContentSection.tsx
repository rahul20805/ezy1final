import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  Eye,
  EyeOff,
  Globe,
  HelpCircle,
  Megaphone,
  Plus,
  Sliders,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredFaq, type StoredHeroSlide, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { ImageUploader } from "../ImageUploader";

export function WebsiteContentSection() {
  const store = useStoreData();

  // Announcement Bar Form State
  const [announcementText, setAnnouncementText] = useState(store.settings.announcementBarText);
  const [enableAnnouncement, setEnableAnnouncement] = useState(store.settings.enableAnnouncementBar);

  // Hero Slide Modal State
  const [isSlideDialogOpen, setIsSlideDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<StoredHeroSlide | null>(null);
  const [slideTitle, setSlideTitle] = useState("");
  const [slideSubtitle, setSlideSubtitle] = useState("");
  const [slideBadge, setSlideBadge] = useState("");
  const [slideImageUrl, setSlideImageUrl] = useState("");
  const [slideBtnText, setSlideBtnText] = useState("");
  const [slideBtnLink, setSlideBtnLink] = useState("");
  const [slidePublished, setSlidePublished] = useState(true);

  // FAQ Modal State
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<StoredFaq | null>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState("General");
  const [faqPublished, setFaqPublished] = useState(true);

  const [deleteSlideId, setDeleteSlideId] = useState<number | null>(null);
  const [deleteFaqId, setDeleteFaqId] = useState<number | null>(null);

  const handleSaveAnnouncement = () => {
    store.updateSettings({
      announcementBarText: announcementText.trim(),
      enableAnnouncementBar: enableAnnouncement,
    });
    toast.success("Announcement top-bar updated live on public site!");
  };

  const openAddSlide = () => {
    setEditingSlide(null);
    setSlideTitle("Fresh Farm Organics & Daily Groceries");
    setSlideSubtitle("Delivered to your home in 10 to 20 minutes from verified local vendors.");
    setSlideBadge("⚡ Fast Local Dispatch");
    setSlideImageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80");
    setSlideBtnText("Explore Groceries");
    setSlideBtnLink("/shop");
    setSlidePublished(true);
    setIsSlideDialogOpen(true);
  };

  const openEditSlide = (slide: StoredHeroSlide) => {
    setEditingSlide(slide);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle);
    setSlideBadge(slide.badge || "");
    setSlideImageUrl(slide.imageUrl);
    setSlideBtnText(slide.buttonText);
    setSlideBtnLink(slide.buttonLink);
    setSlidePublished(slide.published);
    setIsSlideDialogOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim() || !slideImageUrl.trim()) {
      toast.error("Please provide a title and banner image.");
      return;
    }

    if (editingSlide) {
      store.updateHeroSlide(editingSlide.id, {
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        badge: slideBadge.trim(),
        imageUrl: slideImageUrl.trim(),
        buttonText: slideBtnText.trim() || "Shop Now",
        buttonLink: slideBtnLink.trim() || "/shop",
        published: slidePublished,
      });
      toast.success("Hero banner updated!");
    } else {
      store.addHeroSlide({
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        badge: slideBadge.trim(),
        imageUrl: slideImageUrl.trim(),
        buttonText: slideBtnText.trim() || "Shop Now",
        buttonLink: slideBtnLink.trim() || "/shop",
        published: slidePublished,
      });
      toast.success("New hero banner created!");
    }

    setIsSlideDialogOpen(false);
  };

  const openAddFaq = () => {
    setEditingFaq(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqCategory("General");
    setFaqPublished(true);
    setIsFaqDialogOpen(true);
  };

  const openEditFaq = (faq: StoredFaq) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqCategory(faq.category);
    setFaqPublished(faq.published);
    setIsFaqDialogOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      toast.error("Please fill in question and answer.");
      return;
    }

    if (editingFaq) {
      store.updateFaq(editingFaq.id, {
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        category: faqCategory.trim(),
        published: faqPublished,
      });
      toast.success("FAQ updated!");
    } else {
      store.addFaq({
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        category: faqCategory.trim(),
        published: faqPublished,
      });
      toast.success("New FAQ added!");
    }

    setIsFaqDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
          Website Content Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Customize hero banners, promotional announcement bars, FAQs and homepage copy without touching code.
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="bg-muted/80 p-1 rounded-2xl">
          <TabsTrigger value="hero" className="rounded-xl text-xs sm:text-sm gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Hero Banners ({store.heroSlides.length})
          </TabsTrigger>
          <TabsTrigger value="announcement" className="rounded-xl text-xs sm:text-sm gap-1.5">
            <Megaphone className="w-3.5 h-3.5" /> Top Announcement Bar
          </TabsTrigger>
          <TabsTrigger value="faqs" className="rounded-xl text-xs sm:text-sm gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> FAQs ({store.faqs.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Hero Slides */}
        <TabsContent value="hero" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base">Homepage Hero Banners</h3>
              <p className="text-xs text-muted-foreground">Manage animated slides on the storefront landing page.</p>
            </div>
            <Button onClick={openAddSlide} size="sm" className="gap-1.5 text-xs rounded-xl bg-primary text-primary-foreground font-semibold">
              <Plus className="w-3.5 h-3.5" /> Add Banner Slide
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {store.heroSlides.map((slide) => (
              <Card key={slide.id} className="rounded-2xl border-border overflow-hidden bg-card shadow-xs">
                <div className="relative aspect-video bg-muted/60">
                  <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                    {slide.badge && (
                      <span className="text-[11px] font-bold text-primary bg-black/50 px-2 py-0.5 rounded-full w-max backdrop-blur-xs mb-1">
                        {slide.badge}
                      </span>
                    )}
                    <h4 className="font-display font-bold text-sm sm:text-base leading-snug line-clamp-2">
                      {slide.title}
                    </h4>
                    <p className="text-xs text-white/80 line-clamp-2 mt-1">{slide.subtitle}</p>
                  </div>
                </div>

                <CardContent className="p-4 flex items-center justify-between gap-2 border-t border-border/60">
                  <Badge variant={slide.published ? "default" : "secondary"} className="text-[10px]">
                    {slide.published ? "Published (Live)" : "Draft"}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditSlide(slide)}
                      className="h-8 text-xs rounded-xl gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteSlideId(slide.id)}
                      className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Announcement Bar */}
        <TabsContent value="announcement" className="space-y-4">
          <Card className="rounded-3xl border-border bg-card p-6 shadow-xs max-w-2xl space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-foreground">Top Announcement Ticker</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Displays a prominent promotional headline at the very top of all public pages.
              </p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
              <div>
                <Label className="text-xs font-semibold">Enable Top Announcement Bar</Label>
                <p className="text-[11px] text-muted-foreground">Show promotional banner above header</p>
              </div>
              <Switch checked={enableAnnouncement} onCheckedChange={setEnableAnnouncement} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Announcement Message Text</Label>
              <Textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="🎉 Weekend Special: Free delivery on all orders above ₹299!"
                className="rounded-2xl text-xs sm:text-sm"
              />
            </div>

            {/* Live Preview Box */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <span className="text-[11px] font-semibold text-muted-foreground">Live Public Preview:</span>
              {enableAnnouncement ? (
                <div className="p-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold text-center shadow-xs">
                  {announcementText || "No announcement text configured"}
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-muted text-muted-foreground text-xs text-center border border-dashed border-border">
                  Announcement Bar is currently disabled.
                </div>
              )}
            </div>

            <Button onClick={handleSaveAnnouncement} className="rounded-xl bg-primary text-primary-foreground font-semibold">
              Save & Apply Announcement
            </Button>
          </Card>
        </TabsContent>

        {/* Tab 3: FAQs */}
        <TabsContent value="faqs" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base">Frequently Asked Questions</h3>
              <p className="text-xs text-muted-foreground">Help customers understand delivery, refunds, ordering and payments.</p>
            </div>
            <Button onClick={openAddFaq} size="sm" className="gap-1.5 text-xs rounded-xl bg-primary text-primary-foreground font-semibold">
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </Button>
          </div>

          <div className="space-y-3">
            {store.faqs.map((faq) => (
              <Card key={faq.id} className="rounded-2xl border-border bg-card p-4 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{faq.category}</Badge>
                      <h4 className="font-display font-bold text-sm text-foreground">{faq.question}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-1 pt-1">{faq.answer}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEditFaq(faq)} className="h-8 px-2 text-xs rounded-xl">
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteFaqId(faq.id)} className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Slide Modal */}
      <Dialog open={isSlideDialogOpen} onOpenChange={setIsSlideDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSaveSlide}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingSlide ? "Edit Hero Banner Slide" : "Add Hero Banner Slide"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Slide Title *</Label>
                <Input required value={slideTitle} onChange={(e) => setSlideTitle(e.target.value)} className="rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Badge Pill (Optional)</Label>
                <Input placeholder="e.g. ⚡ 10-Min Fast Delivery" value={slideBadge} onChange={(e) => setSlideBadge(e.target.value)} className="rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Subtitle Description</Label>
                <Textarea rows={2} value={slideSubtitle} onChange={(e) => setSlideSubtitle(e.target.value)} className="rounded-xl text-xs" />
              </div>
              <ImageUploader label="Banner Image *" value={slideImageUrl} onChange={setSlideImageUrl} previewHeight="h-36" />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Button Label</Label>
                  <Input value={slideBtnText} onChange={(e) => setSlideBtnText(e.target.value)} className="rounded-xl text-sm" placeholder="Shop Now" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Button Link</Label>
                  <Input value={slideBtnLink} onChange={(e) => setSlideBtnLink(e.target.value)} className="rounded-xl text-sm" placeholder="/shop" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                <Label className="text-xs font-semibold">Publish Live</Label>
                <Switch checked={slidePublished} onCheckedChange={setSlidePublished} />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsSlideDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">Save Slide</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* FAQ Modal */}
      <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSaveFaq}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingFaq ? "Edit FAQ" : "Add FAQ"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Category</Label>
                <Input value={faqCategory} onChange={(e) => setFaqCategory(e.target.value)} className="rounded-xl text-sm" placeholder="Delivery, Payments..." />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Question *</Label>
                <Input required value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} className="rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Answer *</Label>
                <Textarea rows={3} required value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} className="rounded-xl text-xs sm:text-sm" />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFaqDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">Save FAQ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteSlideId !== null}
        onClose={() => setDeleteSlideId(null)}
        onConfirm={() => {
          if (deleteSlideId) {
            store.deleteHeroSlide(deleteSlideId);
            toast.success("Hero slide deleted.");
            setDeleteSlideId(null);
          }
        }}
        title="Delete Hero Slide?"
        description="Are you sure you want to delete this hero banner?"
      />

      <ConfirmModal
        isOpen={deleteFaqId !== null}
        onClose={() => setDeleteFaqId(null)}
        onConfirm={() => {
          if (deleteFaqId) {
            store.deleteFaq(deleteFaqId);
            toast.success("FAQ deleted.");
            setDeleteFaqId(null);
          }
        }}
        title="Delete FAQ?"
        description="Are you sure you want to remove this question?"
      />
    </div>
  );
}

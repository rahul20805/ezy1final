import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Edit2, Gift, Plus, Sparkles, Tag, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../../owner/DataTable";

interface GiftCategoryItem {
  id: number;
  name: string;
  emoji: string;
  tagline: string;
  itemsCount: number;
  active: boolean;
}

const initialGiftCategories: GiftCategoryItem[] = [
  {
    id: 1,
    name: "Diwali & Festive Sweet Hampers",
    emoji: "🪔",
    tagline: "Artisan dry fruits, handmade mithai & brass diyas",
    itemsCount: 18,
    active: true,
  },
  {
    id: 2,
    name: "Ceramic & Pottery Gift Bundles",
    emoji: "🏺",
    tagline: "Handcrafted terracotta and glazed tableware",
    itemsCount: 12,
    active: true,
  },
  {
    id: 3,
    name: "Organic Honey & Tea Gift Box",
    emoji: "🍯",
    tagline: "Raw forest honey, herbal infusions & organic jaggery",
    itemsCount: 8,
    active: true,
  },
  {
    id: 4,
    name: "Birthday & Celebration Combos",
    emoji: "🎂",
    tagline: "Gourmet chocolates, pastries & party snack boxes",
    itemsCount: 24,
    active: true,
  },
];

export function GiftCategories() {
  const [giftCats, setGiftCats] = useState<GiftCategoryItem[]>(
    initialGiftCategories,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎁");
  const [tagline, setTagline] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat: GiftCategoryItem = {
      id: Date.now(),
      name: name.trim(),
      emoji: emoji.trim() || "🎁",
      tagline: tagline.trim(),
      itemsCount: 0,
      active: true,
    };
    setGiftCats([newCat, ...giftCats]);
    toast.success(`Gift category "${name}" created!`);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <DataTable<GiftCategoryItem>
        title="Gift Categories & Festive Collections"
        description="Curate festival gift hampers, wedding collections, artisan gift sets and seasonal bundles."
        data={giftCats}
        searchPlaceholder="Search gift collection, tagline..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.tagline.toLowerCase().includes(query)
        }
        filterOptions={[]}
        sortOptions={[{ label: "Name (A-Z)", value: "name_asc" }]}
        defaultSort="name_asc"
        onSort={(items) =>
          [...items].sort((a, b) => a.name.localeCompare(b.name))
        }
        onAddNew={() => {
          setName("");
          setEmoji("🎁");
          setTagline("");
          setIsDialogOpen(true);
        }}
        addNewLabel="Create Gift Category"
        pageSize={6}
        renderItem={(item) => (
          <Card
            key={item.id}
            className="rounded-3xl border-border bg-card p-5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-2xl flex items-center justify-center flex-shrink-0">
                  {item.emoji}
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.tagline}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold">
                {item.itemsCount} Bundles
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-3">
              <span className="text-xs text-emerald-600 font-semibold">
                ● Active on App
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setGiftCats(giftCats.filter((g) => g.id !== item.id));
                  toast.success("Gift category removed.");
                }}
                className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        )}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-bold">
                Create Gift Category
              </DialogTitle>
              <DialogDescription className="text-xs">
                Group products and special festive hampers into curated gift
                categories.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1 col-span-1">
                  <Label className="text-xs font-semibold">Emoji</Label>
                  <Input
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="rounded-xl text-center text-lg"
                  />
                </div>
                <div className="space-y-1 col-span-3">
                  <Label className="text-xs font-semibold">
                    Category Name *
                  </Label>
                  <Input
                    required
                    placeholder="e.g. Diwali Sweets & Dry Fruits"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Tagline Description
                </Label>
                <Input
                  placeholder="Curated selection of handcrafted sweets..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs"
              >
                Create Gift Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

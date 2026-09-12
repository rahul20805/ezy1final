import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertOctagon,
  CheckCircle2,
  Eye,
  FileCheck,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredReview, useStoreData } from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function ReportedReviews() {
  const store = useStoreData();

  // Flagged reviews
  const reportedReviews = store.reviews.filter(
    (r) => r.isReported || r.rating <= 2,
  );

  const handleDismissReport = (reviewId: number) => {
    store.updateReview(reviewId, { isReported: false });
    toast.success("Flag dismissed. Review restored to verified status.");
  };

  const handleRemoveReview = (reviewId: number) => {
    store.deleteReview(reviewId);
    toast.success("Policy-violating review removed permanently.");
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredReview>
        title="Reported Reviews & Moderation Queue"
        description="Review customer flagged testimonials, investigate defamatory language and enforce review authenticity policies."
        data={reportedReviews}
        searchPlaceholder="Search review author, target product, comment..."
        searchFilter={(item, query) =>
          item.author.toLowerCase().includes(query) ||
          item.comment.toLowerCase().includes(query) ||
          item.targetName.toLowerCase().includes(query)
        }
        filterOptions={[]}
        sortOptions={[{ label: "Rating (Low to High)", value: "rating_asc" }]}
        defaultSort="rating_asc"
        onSort={(items) => [...items].sort((a, b) => a.rating - b.rating)}
        pageSize={6}
        renderItem={(rev) => (
          <Card
            key={rev.id}
            className="rounded-3xl border-rose-500/30 bg-rose-500/5 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-foreground">
                    {rev.author}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold text-rose-600 border-rose-300"
                  >
                    Flagged for Review
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Target:{" "}
                  <span className="font-semibold text-foreground">
                    {rev.targetName}
                  </span>{" "}
                  ({rev.targetType}) • {rev.date}
                </p>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border/80 text-xs">
              <p className="text-foreground italic">"{rev.comment}"</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="text-[11px] text-muted-foreground">
                Report Reason: Inappropriate content or dispute
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDismissReport(rev.id)}
                  className="h-8 px-3 text-xs rounded-xl"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />{" "}
                  Dismiss & Keep
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleRemoveReview(rev.id)}
                  className="h-8 px-3 text-xs rounded-xl bg-destructive text-destructive-foreground font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Review
                </Button>
              </div>
            </div>
          </Card>
        )}
      />
    </div>
  );
}

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  CheckCircle,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredReview, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { DataTable } from "../DataTable";

export function ReviewsSection() {
  const store = useStoreData();

  const [selectedReview, setSelectedReview] = useState<StoredReview | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openReplyModal = (review: StoredReview) => {
    setSelectedReview(review);
    setReplyText(review.reply || "");
  };

  const handleSaveReply = () => {
    if (!selectedReview) return;
    store.replyToReview(selectedReview.id, replyText.trim());
    toast.success("Official reply saved & published!");
    setSelectedReview(null);
  };

  const handleToggleStatus = (
    review: StoredReview,
    newStatus: StoredReview["status"],
  ) => {
    store.updateReview(review.id, { status: newStatus });
    toast.success(`Review marked as "${newStatus}"`);
  };

  const handleToggleFeature = (review: StoredReview) => {
    store.updateReview(review.id, { isFeatured: !review.isFeatured });
    toast.success(
      review.isFeatured
        ? "Review removed from featured highlights."
        : "Review featured on public website!",
    );
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteReview(deleteConfirmId);
      toast.success("Review deleted.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredReview>
        title="Customer Ratings & Reviews"
        description="Moderate customer testimonials, approve feedback, feature top reviews and publish official owner replies."
        data={store.reviews}
        searchPlaceholder="Search by customer name, comment, target item..."
        searchFilter={(item, query) =>
          item.author.toLowerCase().includes(query) ||
          item.comment.toLowerCase().includes(query) ||
          item.targetName.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Approval Status",
            options: [
              { label: "Approved", value: "approved" },
              { label: "Pending Moderation", value: "pending" },
              { label: "Rejected", value: "rejected" },
            ],
          },
          {
            key: "isFeatured",
            label: "Featured Highlights",
            options: [
              { label: "Featured Only", value: "true" },
              { label: "Standard", value: "false" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Highest Rating", value: "rating_desc" },
          { label: "Lowest Rating", value: "rating_asc" },
        ]}
        defaultSort="newest"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "rating_desc")
            return list.sort((a, b) => b.rating - a.rating);
          if (sortVal === "rating_asc")
            return list.sort((a, b) => a.rating - b.rating);
          return list.sort((a, b) => b.id - a.id);
        }}
        pageSize={6}
        renderItem={(review) => (
          <Card
            key={review.id}
            className="rounded-2xl border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <CardContent className="p-4 space-y-3">
              {/* Header: Author, Rating, Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                    <User className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{review.author}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted stroke-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold ml-1 text-foreground">
                      {review.rating}.0
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {review.isFeatured && (
                    <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0">
                      ⭐ Featured
                    </Badge>
                  )}
                  <Badge
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      review.status === "approved"
                        ? "bg-emerald-500 text-white"
                        : review.status === "pending"
                          ? "bg-amber-500 text-white"
                          : "bg-destructive text-white"
                    }`}
                  >
                    {review.status}
                  </Badge>
                </div>
              </div>

              {/* Target Item badge */}
              <div className="text-[11px] text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/60 flex items-center justify-between">
                <span className="truncate">
                  Reviewed:{" "}
                  <span className="font-semibold text-foreground">
                    {review.targetName}
                  </span>
                </span>
                <span className="capitalize text-[10px] font-medium font-mono">
                  {review.targetType}
                </span>
              </div>

              {/* Comment Body */}
              <p className="text-xs text-foreground bg-muted/20 p-3 rounded-2xl border border-border/40 italic">
                "{review.comment}"
              </p>

              {/* Owner Reply if exists */}
              {review.reply && (
                <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-primary">
                    <MessageSquare className="w-3 h-3" /> Official Store
                    Response:
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    {review.reply}
                  </p>
                </div>
              )}
            </CardContent>

            {/* Bottom Actions Bar */}
            <div className="p-4 pt-0 flex items-center justify-between gap-1 border-t border-border/60 mt-2">
              <span className="text-[11px] text-muted-foreground">
                {review.date}
              </span>

              <div className="flex items-center gap-1">
                {review.status !== "approved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(review, "approved")}
                    className="h-8 px-2 text-xs rounded-xl text-emerald-600 hover:bg-emerald-50 gap-1"
                    title="Approve Review"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleFeature(review)}
                  className={`h-8 px-2 text-xs rounded-xl ${
                    review.isFeatured
                      ? "text-amber-600 bg-amber-50 border-amber-200"
                      : ""
                  }`}
                  title={
                    review.isFeatured ? "Unfeature" : "Feature on Homepage"
                  }
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openReplyModal(review)}
                  className="h-8 text-xs rounded-xl gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Reply
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmId(review.id)}
                  className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      />

      {/* Reply Modal */}
      {selectedReview && (
        <Dialog
          open={!!selectedReview}
          onOpenChange={() => setSelectedReview(null)}
        >
          <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-bold">
                Reply to Customer Review
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Your response will appear publicly below the customer's review.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs">
                <p className="font-semibold text-foreground">
                  {selectedReview.author} says:
                </p>
                <p className="text-muted-foreground italic mt-1">
                  "{selectedReview.comment}"
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Your Official Response
                </Label>
                <Textarea
                  rows={3}
                  placeholder="Thank the customer, address feedback or offer assistance..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReview(null)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveReply}
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Post Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Review?"
        description="Are you sure you want to permanently remove this review?"
      />
    </div>
  );
}

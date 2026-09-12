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
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  FileSpreadsheet,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredDispute, useStoreData } from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function DisputesManager() {
  const store = useStoreData();

  const handleResolveDispute = (
    dispute: StoredDispute,
    refundApproved: boolean,
  ) => {
    const nextStatus = refundApproved ? "REFUNDED" : "RESOLVED";
    store.updateDisputeStatus(
      dispute.id,
      nextStatus,
      refundApproved
        ? "Approved wallet refund credit."
        : "Resolved without financial refund.",
    );
    toast.success(
      `Dispute for order ${dispute.orderNumber} marked as ${nextStatus}!`,
    );
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredDispute>
        title="Complaints & Disputes Resolution"
        description="Investigate damaged goods, delivery discrepancies, wrong items, and issue instant wallet refund credits."
        data={store.disputes}
        searchPlaceholder="Search order number, customer, partner, dispute type..."
        searchFilter={(item, query) =>
          item.orderNumber.toLowerCase().includes(query) ||
          item.customerName.toLowerCase().includes(query) ||
          item.partnerName.toLowerCase().includes(query) ||
          item.disputeType.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Dispute Status",
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Investigating", value: "INVESTIGATING" },
              { label: "Refunded", value: "REFUNDED" },
              { label: "Resolved", value: "RESOLVED" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Claim Amount", value: "amount_desc" },
          { label: "Order ID", value: "id_desc" },
        ]}
        defaultSort="id_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "amount_desc")
            return list.sort((a, b) => b.amount - a.amount);
          return list.sort((a, b) => b.id - a.id);
        }}
        pageSize={6}
        renderItem={(disp) => (
          <Card
            key={disp.id}
            className={`rounded-3xl border transition-all p-5 space-y-3 ${
              disp.status === "PENDING"
                ? "border-rose-500/40 bg-rose-500/5"
                : disp.status === "INVESTIGATING"
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-border/80 bg-card"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-foreground">
                    {disp.orderNumber}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold text-rose-600 border-rose-300"
                  >
                    {disp.disputeType}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customer:{" "}
                  <span className="font-semibold text-foreground">
                    {disp.customerName}
                  </span>{" "}
                  vs Merchant:{" "}
                  <span className="font-semibold text-foreground">
                    {disp.partnerName}
                  </span>
                </p>
              </div>

              <Badge
                className={`text-[10px] uppercase font-bold ${
                  disp.status === "REFUNDED" || disp.status === "RESOLVED"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-rose-500/10 text-rose-600"
                }`}
              >
                {disp.status}
              </Badge>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                Customer Complaint:
              </span>
              <p className="text-foreground">{disp.reason}</p>
              {disp.resolutionNotes && (
                <p className="text-muted-foreground pt-1 border-t border-border/60">
                  <span className="font-semibold text-emerald-600">
                    Resolution Note:
                  </span>{" "}
                  {disp.resolutionNotes}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="font-display font-black text-base text-rose-600">
                Claim: ₹{disp.amount}
              </span>

              {disp.status !== "REFUNDED" && disp.status !== "RESOLVED" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolveDispute(disp, false)}
                    className="h-8 px-2.5 text-xs rounded-xl"
                  >
                    Resolve (No Refund)
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleResolveDispute(disp, true)}
                    className="h-8 px-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Issue ₹{disp.amount}{" "}
                    Refund
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      />
    </div>
  );
}

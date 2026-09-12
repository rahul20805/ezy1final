import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  DollarSign,
  History,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { type StoredRefund, useStoreData } from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function RefundsManager() {
  const store = useStoreData();

  const handleProcess = (refundId: number, approve: boolean) => {
    store.processRefund(refundId, approve);
    toast.success(
      approve
        ? "Refund approved and credited to customer wallet!"
        : "Refund request rejected.",
    );
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredRefund>
        title="Refunds Processing & Customer Credits"
        description="Review customer return claims, approve instant wallet refunds and audit refund disbursement status."
        data={store.refunds}
        searchPlaceholder="Search refund ID, order number, customer name..."
        searchFilter={(item, query) =>
          item.refundId.toLowerCase().includes(query) ||
          item.orderNumber.toLowerCase().includes(query) ||
          item.customerName.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Refund Status",
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Processed / Credited", value: "PROCESSED" },
              { label: "Rejected", value: "REJECTED" },
            ],
          },
        ]}
        sortOptions={[{ label: "Refund ID", value: "id_desc" }]}
        defaultSort="id_desc"
        onSort={(items) => [...items].sort((a, b) => b.id - a.id)}
        pageSize={6}
        renderItem={(ref) => (
          <Card
            key={ref.id}
            className="rounded-3xl border-border bg-card p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-foreground">
                    {ref.refundId}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Order: {ref.orderNumber}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customer:{" "}
                  <span className="font-semibold text-foreground">
                    {ref.customerName}
                  </span>{" "}
                  • Requested: {ref.requestedAt}
                </p>
              </div>

              <Badge
                className={`text-[10px] uppercase font-bold ${
                  ref.status === "PROCESSED"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : ref.status === "PENDING"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-destructive/10 text-destructive"
                }`}
              >
                {ref.status}
              </Badge>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                Reason:
              </span>
              <p className="text-foreground">{ref.reason}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="font-display font-black text-base text-rose-600">
                ₹{ref.amount}
              </span>

              {ref.status === "PENDING" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProcess(ref.id, false)}
                    className="h-8 px-2.5 text-xs rounded-xl text-destructive hover:bg-destructive/10"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleProcess(ref.id, true)}
                    className="h-8 px-3 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Credit ₹
                    {ref.amount}
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

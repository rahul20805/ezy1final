import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  type StoredPartnerPayout,
  useStoreData,
} from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function PartnerPayouts() {
  const store = useStoreData();

  const handleApprovePayout = (payout: StoredPartnerPayout) => {
    store.approvePayout(payout.id);
    toast.success(
      `Settlement payout of ₹${payout.netPayout.toLocaleString()} approved for ${payout.partnerName}!`,
    );
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredPartnerPayout>
        title="Partner Earnings & Settlement Payouts"
        description="Calculate merchant gross sales, platform commission deductions, and approve automated bank settlements."
        data={store.partnerPayouts}
        searchPlaceholder="Search merchant name, payout period..."
        searchFilter={(item, query) =>
          item.partnerName.toLowerCase().includes(query) ||
          item.period.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Payout Status",
            options: [
              { label: "Pending Approval", value: "PENDING" },
              { label: "Approved & Disbursed", value: "APPROVED" },
              { label: "Processed", value: "PROCESSED" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Net Payout (High to Low)", value: "payout_desc" },
        ]}
        defaultSort="payout_desc"
        onSort={(items) => [...items].sort((a, b) => b.netPayout - a.netPayout)}
        pageSize={6}
        renderItem={(payout) => (
          <Card
            key={payout.id}
            className="rounded-3xl border-border bg-card p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-base text-foreground">
                  {payout.partnerName}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Settlement Cycle:{" "}
                  <span className="font-semibold text-foreground">
                    {payout.period}
                  </span>
                </p>
              </div>

              <Badge
                className={`text-[10px] uppercase font-bold ${
                  payout.status === "APPROVED" || payout.status === "PROCESSED"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {payout.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs text-center">
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  Gross Sales
                </span>
                <span className="font-mono font-bold text-foreground">
                  ₹{payout.grossSales.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  Commission (-5%)
                </span>
                <span className="font-mono font-bold text-rose-500">
                  -₹{payout.commissionDeducted.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-bold text-primary">
                  Net Payout
                </span>
                <span className="font-display font-black text-emerald-600 text-sm">
                  ₹{payout.netPayout.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="text-xs text-muted-foreground">
                Disbursement Date: {payout.payoutDate}
              </span>

              {payout.status === "PENDING" && (
                <Button
                  size="sm"
                  onClick={() => handleApprovePayout(payout)}
                  className="h-8 px-3 text-xs rounded-xl bg-primary text-primary-foreground font-semibold gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Disburse
                </Button>
              )}
            </div>
          </Card>
        )}
      />
    </div>
  );
}

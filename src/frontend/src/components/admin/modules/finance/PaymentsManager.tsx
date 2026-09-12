import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  Download,
  FileSpreadsheet,
  History,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  type StoredTransaction,
  useStoreData,
} from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function PaymentsManager() {
  const store = useStoreData();

  const getStatusColor = (status: StoredTransaction["status"]) => {
    switch (status) {
      case "SUCCESS":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-300";
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 border-amber-300";
      case "FAILED":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "REFUNDED":
        return "bg-purple-500/10 text-purple-600 border-purple-300";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredTransaction>
        title="Financial Transactions & Payment Gateways Ledger"
        description="Monitor real-time UPI checkouts, wallet deductions, card payments and cash-on-delivery settlements."
        data={store.transactions}
        searchPlaceholder="Search transaction ID, order ID, customer name, gateway..."
        searchFilter={(item, query) =>
          item.transactionId.toLowerCase().includes(query) ||
          item.orderId.toLowerCase().includes(query) ||
          item.customerName.toLowerCase().includes(query) ||
          item.gateway.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Transaction Status",
            options: [
              { label: "Success", value: "SUCCESS" },
              { label: "Pending", value: "PENDING" },
              { label: "Failed", value: "FAILED" },
              { label: "Refunded", value: "REFUNDED" },
            ],
          },
          {
            key: "paymentMethod",
            label: "Payment Mode",
            options: [
              { label: "Direct UPI", value: "UPI" },
              { label: "In-App Wallet", value: "Wallet" },
              { label: "Cash on Delivery", value: "COD" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Amount (High to Low)", value: "amount_desc" },
          { label: "Amount (Low to High)", value: "amount_asc" },
          { label: "Date (Newest)", value: "id_desc" },
        ]}
        defaultSort="id_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "amount_desc")
            return list.sort((a, b) => b.amount - a.amount);
          if (sortVal === "amount_asc")
            return list.sort((a, b) => a.amount - b.amount);
          return list.sort((a, b) => b.id - a.id);
        }}
        pageSize={6}
        renderItem={(txn) => (
          <Card
            key={txn.id}
            className="rounded-3xl border-border bg-card p-5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-foreground">
                    {txn.transactionId}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {txn.orderId}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customer:{" "}
                  <span className="font-semibold text-foreground">
                    {txn.customerName}
                  </span>{" "}
                  • Gateway: {txn.gateway}
                </p>
              </div>

              <Badge
                className={`text-[10px] uppercase font-bold ${getStatusColor(txn.status)}`}
              >
                {txn.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs my-3">
              <span className="text-muted-foreground">
                Mode:{" "}
                <span className="font-bold text-foreground">
                  {txn.paymentMethod}
                </span>
              </span>
              <span className="font-mono text-muted-foreground">
                {txn.date}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="font-display font-black text-base text-foreground">
                ₹{txn.amount}
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] font-semibold text-emerald-600"
              >
                Verified Gateway Settlement
              </Badge>
            </div>
          </Card>
        )}
      />
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Gift,
  Hash,
  PiggyBank,
  Plus,
  RefreshCw,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UserLayout from "../components/UserLayout";
import { useWallet } from "../lib/backend-hooks";
import type { WalletTransaction } from "../types";

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  cashback: Gift,
  booking: Zap,
  payment: ShoppingBag,
  recharge: RefreshCw,
  refund: ArrowUpRight,
};

const categoryColors: Record<string, string> = {
  cashback: "bg-primary/10 text-primary",
  booking: "bg-primary/10 text-primary",
  payment: "bg-accent/10 text-accent",
  recharge: "bg-secondary/10 text-secondary",
  refund: "bg-primary/10 text-primary",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TransactionRow({
  txn,
  index,
}: { txn: WalletTransaction; index: number }) {
  const Icon = categoryIcons[txn.category] ?? Zap;
  const colorClass =
    categoryColors[txn.category] ?? "bg-muted text-muted-foreground";
  const isCredit = txn.type === "credit";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
      data-ocid={`wallet.transaction.${index}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">
          {txn.description}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {formatDate(txn.date)}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div
          className={`flex items-center gap-1 font-display font-bold text-sm ${isCredit ? "text-primary" : "text-foreground"}`}
        >
          {isCredit ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowDownLeft className="w-3.5 h-3.5 text-destructive" />
          )}
          {isCredit ? "+" : "-"}₹{txn.amount.toLocaleString()}
        </div>
        <Badge
          variant="outline"
          className={`text-xs px-1.5 py-0 ${isCredit ? "border-primary/30 text-primary bg-primary/5" : "border-destructive/20 text-destructive bg-destructive/5"}`}
        >
          {isCredit ? "Credit" : "Debit"}
        </Badge>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { data: wallet, isLoading } = useWallet();
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  const credits =
    wallet?.transactions
      .filter((t) => t.type === "credit")
      .reduce((s, t) => s + t.amount, 0) ?? 0;
  const debits =
    wallet?.transactions
      .filter((t) => t.type === "debit")
      .reduce((s, t) => s + t.amount, 0) ?? 0;

  // This month (April 2026)
  const thisMonth = "2026-04";
  const spentThisMonth =
    wallet?.transactions
      .filter((t) => t.type === "debit" && t.date.startsWith(thisMonth))
      .reduce((s, t) => s + t.amount, 0) ?? 0;
  const addedThisMonth =
    wallet?.transactions
      .filter((t) => t.type === "credit" && t.date.startsWith(thisMonth))
      .reduce((s, t) => s + t.amount, 0) ?? 0;
  const txnCount =
    wallet?.transactions.filter((t) => t.date.startsWith(thisMonth)).length ??
    0;

  const filtered = (wallet?.transactions ?? []).filter((t) =>
    filter === "all" ? true : t.type === filter,
  );

  function handleAddMoney() {
    toast.info("Coming soon — live payments in next update", {
      duration: 4000,
    });
  }

  function handleWithdraw() {
    toast.info("Withdraw feature coming soon", { duration: 4000 });
  }

  return (
    <UserLayout title="My Wallet">
      <div className="space-y-6 max-w-2xl mx-auto" data-ocid="wallet.page">
        {/* Gradient balance card */}
        <div
          className="rounded-2xl p-6 text-primary-foreground shadow-elevated relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.24 71) 0%, oklch(0.52 0.21 188) 100%)",
          }}
          data-ocid="wallet.balance_card"
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary-foreground/5 pointer-events-none" />
          <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-primary-foreground/5 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-display font-bold text-base text-primary-foreground">
                  Ezy1 Wallet
                </div>
                <div className="text-xs text-primary-foreground/70">
                  Amit Verma · Bengaluru
                </div>
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="h-12 w-44 bg-primary-foreground/20 mb-1" />
            ) : (
              <div className="font-display font-black text-5xl text-primary-foreground tracking-tight">
                ₹{wallet?.balance.toLocaleString("en-IN")}
              </div>
            )}
            <div className="text-primary-foreground/70 text-sm mt-1.5 mb-5">
              Available Balance
            </div>

            {/* Summary mini stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-primary-foreground/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-300" />
                  <span className="text-xs text-primary-foreground/70">
                    Total Added
                  </span>
                </div>
                <div className="font-display font-bold text-xl text-primary-foreground">
                  ₹{credits.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="bg-primary-foreground/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown className="w-3.5 h-3.5 text-red-300" />
                  <span className="text-xs text-primary-foreground/70">
                    Total Spent
                  </span>
                </div>
                <div className="font-display font-bold text-xl text-primary-foreground">
                  ₹{debits.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 gap-2"
                onClick={handleAddMoney}
                data-ocid="wallet.add_money_button"
              >
                <Plus className="w-4 h-4" />
                Add Money
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2"
                onClick={handleWithdraw}
                data-ocid="wallet.withdraw_button"
              >
                <PiggyBank className="w-4 h-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Monthly summary stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Spent This Month",
              value: `₹${spentThisMonth.toLocaleString("en-IN")}`,
              icon: CreditCard,
              color: "text-destructive",
              bg: "bg-destructive/8",
            },
            {
              label: "Added This Month",
              value: `₹${addedThisMonth.toLocaleString("en-IN")}`,
              icon: TrendingUp,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Transactions",
              value: String(txnCount),
              icon: Hash,
              color: "text-secondary",
              bg: "bg-secondary/10",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="border-border">
              <CardContent className="p-3 text-center">
                <div
                  className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mx-auto mb-2`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className={`font-display font-bold text-base ${color}`}>
                  {value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transaction history */}
        <Card className="border-border" data-ocid="wallet.transactions_panel">
          <CardHeader className="pb-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Transaction History
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {filtered.length} {filter !== "all" ? filter : ""} transaction
                {filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Filter tabs */}
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as "all" | "credit" | "debit")}
            >
              <TabsList className="w-full grid grid-cols-3 h-8">
                <TabsTrigger
                  value="all"
                  className="text-xs"
                  data-ocid="wallet.filter.all"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="credit"
                  className="text-xs"
                  data-ocid="wallet.filter.credit"
                >
                  Credit
                </TabsTrigger>
                <TabsTrigger
                  value="debit"
                  className="text-xs"
                  data-ocid="wallet.filter.debit"
                >
                  Debit
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3" data-ocid="wallet.loading_state">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="p-8 text-center text-muted-foreground"
                data-ocid="wallet.empty_state"
              >
                <Wallet className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="font-medium text-sm">
                  No {filter !== "all" ? filter : ""} transactions found
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((txn, idx) => (
                  <TransactionRow key={txn.id} txn={txn} index={idx + 1} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* View-only notice */}
        <div
          className="bg-muted/40 border border-border rounded-xl p-4 text-sm text-muted-foreground flex items-start gap-3"
          data-ocid="wallet.info_panel"
        >
          <Wallet className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
          <span>
            Wallet is in{" "}
            <strong className="text-foreground">view-only mode</strong>. Live
            payment processing will be enabled in the next update.
          </span>
        </div>
      </div>
    </UserLayout>
  );
}

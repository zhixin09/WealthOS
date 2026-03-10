"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ArrowUpRight,
    ArrowDownRight,
    ArrowRightLeft,
    Banknote,
    TrendingUp,
} from "lucide-react";
import transactions from "@/data/mock-transactions.json";

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
    buy: { icon: ArrowDownRight, color: "text-emerald" },
    sell: { icon: ArrowUpRight, color: "text-rose" },
    deposit: { icon: Banknote, color: "text-emerald" },
    withdrawal: { icon: ArrowUpRight, color: "text-rose" },
    dividend: { icon: TrendingUp, color: "text-amber" },
    interest: { icon: TrendingUp, color: "text-amber" },
    payment: { icon: ArrowRightLeft, color: "text-rose" },
};

export function RecentTransactions() {
  return (
    <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Recent Transactions
          </CardTitle>
          <Badge
            variant="secondary"
            className="border border-zinc-700 bg-zinc-950 text-[10px] text-zinc-400"
          >
            {transactions.length} txns
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-[280px]">
          <div className="space-y-0.5 px-6">
            {transactions.slice(0, 10).map((txn) => {
              const config = typeConfig[txn.type] || typeConfig.buy;
              const Icon = config.icon;
              const isDebit = ["buy", "withdrawal", "payment"].includes(txn.type);

              return (
                <div
                  key={txn.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-zinc-800/50"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 ${config.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {txn.description}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {new Date(txn.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {" / "}
                      {txn.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold font-mono ${isDebit ? "text-rose" : "text-emerald"}`}
                    >
                      {isDebit ? "-" : "+"}${txn.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

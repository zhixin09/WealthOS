"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import portfolioData from "@/data/mock-portfolio.json";

export function NetWorthCard() {
  const { netWorth } = portfolioData;
  const isPositive = netWorth.monthlyChangePercent >= 0;

  return (
    <Card className="relative overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-primary/8 via-zinc-900 to-zinc-900 py-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <CardContent className="relative p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Balance Sheet Snapshot
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-zinc-50 font-mono">
              ${netWorth.netWorth.toLocaleString()}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${isPositive ? "bg-emerald-muted text-emerald" : "bg-rose-muted text-rose"}`}
              >
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPositive ? "+" : ""}
                {netWorth.monthlyChangePercent}%
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {isPositive ? "+" : ""}${netWorth.monthlyChange.toLocaleString()} this month
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Total Assets
            </p>
            <p className="mt-1 text-lg font-semibold text-zinc-100 font-mono">
              ${netWorth.totalAssets.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Total Liabilities
            </p>
            <p className="mt-1 text-lg font-semibold text-rose font-mono">
              ${netWorth.totalLiabilities.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

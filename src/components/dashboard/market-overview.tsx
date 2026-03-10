"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

// Static market data for demo (would be fetched from Alpha Vantage in production)
const marketIndices = [
    {
        name: "S&P 500",
        symbol: "SPX",
        value: "5,892.42",
        change: "+0.84%",
        isPositive: true,
    },
    {
        name: "NASDAQ",
        symbol: "IXIC",
        value: "19,234.67",
        change: "+1.12%",
        isPositive: true,
    },
    {
        name: "STI",
        symbol: "STI",
        value: "3,891.45",
        change: "-0.23%",
        isPositive: false,
    },
    {
        name: "BTC/USD",
        symbol: "BTC",
        value: "97,850.00",
        change: "+2.45%",
        isPositive: true,
    },
    {
        name: "ETH/USD",
        symbol: "ETH",
        value: "3,420.00",
        change: "-1.34%",
        isPositive: false,
    },
    {
        name: "Gold",
        symbol: "XAU",
        value: "2,987.30",
        change: "+0.45%",
        isPositive: true,
    },
];

export function MarketOverview() {
  return (
    <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {marketIndices.map((index) => (
            <div
              key={index.symbol}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 transition-colors hover:bg-zinc-800/50"
            >
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  {index.name}
                </p>
                <p className="text-sm font-semibold text-zinc-100 font-mono">
                  {index.value}
                </p>
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold font-mono ${index.isPositive ? "text-emerald" : "text-rose"}`}
              >
                {index.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {index.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

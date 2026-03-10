"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import portfolioData from "@/data/mock-portfolio.json";

export function NetWorthCard() {
    const { netWorth } = portfolioData;
    const isPositive = netWorth.monthlyChangePercent >= 0;

    return (
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-primary/10 via-card to-card">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Total Net Worth
                        </p>
                        <h2 className="mt-2 text-4xl font-bold tracking-tight">
                            ${netWorth.netWorth.toLocaleString()}
                        </h2>
                        <div className="mt-3 flex items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${isPositive
                                        ? "bg-emerald-muted text-emerald"
                                        : "bg-rose-muted text-rose"
                                    }`}
                            >
                                {isPositive ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                {isPositive ? "+" : ""}
                                {netWorth.monthlyChangePercent}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {isPositive ? "+" : ""}$
                                {netWorth.monthlyChange.toLocaleString()} this month
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-accent/50 p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Total Assets
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                            ${netWorth.totalAssets.toLocaleString()}
                        </p>
                    </div>
                    <div className="rounded-lg bg-accent/50 p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Total Liabilities
                        </p>
                        <p className="mt-1 text-lg font-semibold text-rose">
                            ${netWorth.totalLiabilities.toLocaleString()}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

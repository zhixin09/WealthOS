"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import portfolioData from "@/data/mock-portfolio.json";

type Asset = {
    symbol: string;
    name: string;
    shares?: number;
    quantity?: number;
    avgCost: number;
    currentPrice: number;
    value: number;
    change24h: number;
};

export function AssetTable() {
    const equities = portfolioData.assets.equities as Asset[];
    const crypto = portfolioData.assets.crypto as Asset[];
    const allAssets = [
        ...equities.map((a) => ({ ...a, type: "Equity" })),
        ...crypto.map((a) => ({ ...a, type: "Crypto" })),
    ].sort((a, b) => b.value - a.value);

    return (
        <Card className="border-border/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Holdings
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead className="pl-6 text-[10px] font-semibold uppercase tracking-wider">
                                Asset
                            </TableHead>
                            <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider">
                                Price
                            </TableHead>
                            <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider">
                                24h
                            </TableHead>
                            <TableHead className="pr-6 text-right text-[10px] font-semibold uppercase tracking-wider">
                                Value
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allAssets.map((asset) => {
                            const isPositive = asset.change24h >= 0;
                            const qty = asset.shares || asset.quantity || 0;
                            return (
                                <TableRow
                                    key={asset.symbol}
                                    className="border-border/30 transition-colors"
                                >
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-[10px] font-bold">
                                                {asset.symbol.slice(0, 3)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{asset.symbol}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {qty} {asset.type === "Crypto" ? "units" : "shares"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-sm font-medium">
                                            ${asset.currentPrice.toLocaleString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            variant="secondary"
                                            className={`text-[10px] font-semibold ${isPositive
                                                    ? "bg-emerald-muted text-emerald"
                                                    : "bg-rose-muted text-rose"
                                                }`}
                                        >
                                            {isPositive ? (
                                                <TrendingUp className="mr-1 h-2.5 w-2.5" />
                                            ) : (
                                                <TrendingDown className="mr-1 h-2.5 w-2.5" />
                                            )}
                                            {isPositive ? "+" : ""}
                                            {asset.change24h}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <span className="text-sm font-semibold">
                                            ${asset.value.toLocaleString()}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

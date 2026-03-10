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
    ...equities.map((asset) => ({ ...asset, type: "Equity" })),
    ...crypto.map((asset) => ({ ...asset, type: "Crypto" })),
  ].sort((left, right) => right.value - left.value);

  return (
    <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Holdings Ledger
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="pl-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Asset
              </TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Price
              </TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                24h
              </TableHead>
              <TableHead className="pr-6 text-right text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allAssets.map((asset) => {
              const isPositive = asset.change24h >= 0;
              const quantity = asset.shares || asset.quantity || 0;

              return (
                <TableRow
                  key={asset.symbol}
                  className="border-zinc-800/70 transition-colors hover:bg-zinc-800/25"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-[10px] font-bold text-zinc-300">
                        {asset.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">{asset.symbol}</p>
                        <p className="text-[10px] text-zinc-500">
                          {quantity} {asset.type === "Crypto" ? "units" : "shares"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-medium text-zinc-100 font-mono">
                      ${asset.currentPrice.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-semibold ${isPositive ? "bg-emerald-muted text-emerald" : "bg-rose-muted text-rose"}`}
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
                    <span className="text-sm font-semibold text-zinc-50 font-mono">
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

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import portfolioData from "@/data/mock-portfolio.json";

const COLORS = [
    "oklch(0.72 0.17 162)",   // emerald - Equities
    "oklch(0.65 0.22 290)",   // violet - Crypto
    "oklch(0.78 0.12 200)",   // cyan - Real Estate
    "oklch(0.8 0.15 80)",     // amber - Bank Deposits
    "oklch(0.6 0.15 250)",    // blue - CPF
];

export function PortfolioChart() {
    const data = portfolioData.assetAllocation;

    return (
        <Card className="border-border/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Asset Allocation
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="h-[180px] w-[180px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {data.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            className="transition-opacity hover:opacity-80"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const item = payload[0].payload;
                                            return (
                                                <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                                                    <p className="text-xs font-medium">{item.category}</p>
                                                    <p className="text-sm font-bold">
                                                        ${item.value.toLocaleString()}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {item.percentage}%
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        {data.map((item, index) => (
                            <div key={item.category} className="flex items-center gap-2">
                                <div
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: COLORS[index] }}
                                />
                                <span className="flex-1 text-xs text-muted-foreground">
                                    {item.category}
                                </span>
                                <span className="text-xs font-medium">
                                    {item.percentage}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import portfolioData from "@/data/mock-portfolio.json";

export function HealthScore() {
    const { healthScore } = portfolioData;

    const getColorClass = (score: number) => {
        if (score >= 80) return "text-emerald";
        if (score >= 60) return "text-amber";
        return "text-rose";
    };

    const getStrokeDash = (score: number) => {
        const circumference = 2 * Math.PI * 45;
        const filled = (score / 100) * circumference;
        return `${filled} ${circumference - filled}`;
    };

    const getStrokeColor = (score: number) => {
        if (score >= 80) return "oklch(0.72 0.17 162)";
        if (score >= 60) return "oklch(0.8 0.15 80)";
        return "oklch(0.65 0.2 15)";
    };

    return (
        <Card className="border-border/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Financial Health
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                    {/* Circular progress */}
                    <div className="relative h-[120px] w-[120px] shrink-0">
                        <svg
                            viewBox="0 0 100 100"
                            className="h-full w-full -rotate-90"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="oklch(1 0 0 / 6%)"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={getStrokeColor(healthScore.overall)}
                                strokeWidth="8"
                                strokeDasharray={getStrokeDash(healthScore.overall)}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-2xl font-bold ${getColorClass(healthScore.overall)}`}>
                                {healthScore.overall}
                            </span>
                            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                                Score
                            </span>
                        </div>
                    </div>
                    {/* Categories */}
                    <div className="flex flex-1 flex-col gap-2">
                        {Object.entries(healthScore.categories).map(([key, cat]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] capitalize text-muted-foreground">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                        <span className="text-[10px] font-medium">{cat.score}</span>
                                    </div>
                                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-accent">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${cat.score}%`,
                                                backgroundColor: getStrokeColor(cat.score),
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

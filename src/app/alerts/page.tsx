"use client";

import { useState } from "react";
import { Bell, TriangleAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { runAlerts as requestAlerts } from "@/lib/api";
import type { AlertsResponse } from "@/lib/types";

export default function AlertsPage() {
  const [result, setResult] = useState<AlertsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function runAlerts() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await requestAlerts(4);
      setResult(data);
    } catch (runError) {
      setResult(null);
      setError(
        runError instanceof Error
          ? runError.message
          : "Unable to generate alerts right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Alerts</h1>
        <p className="text-sm text-muted-foreground">
          Monitor holdings against fresh market events and surface alerts that
          matter for the actual portfolio.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Event-triggered monitoring
          </CardTitle>
          <CardDescription>
            The MVP checks owned symbols against market news and returns
            portfolio-specific alerts with recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runAlerts} disabled={isLoading}>
            {isLoading ? "Scanning..." : "Run Alerts"}
          </Button>
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4">
        {result?.alerts.length ? (
          result.alerts.map((alert) => (
            <Card key={`${alert.headline}-${alert.source}`} className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TriangleAlert className="h-4 w-4 text-amber" />
                  {alert.headline}
                </CardTitle>
                <CardDescription>
                  Source: {alert.source} · Impacted holdings: {alert.impactedHoldings.join(", ")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-6 text-foreground/90">
                  {alert.eventSummary}
                </p>
                {alert.currentPrice ? (
                  <div className="rounded-lg border border-border/60 bg-accent/20 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Current price
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      ${alert.currentPrice.toLocaleString()}
                    </p>
                  </div>
                ) : null}
                <div className="rounded-lg border border-emerald/20 bg-emerald/10 p-4">
                  <p className="text-sm font-semibold text-emerald">Recommendation</p>
                  <p className="mt-2 text-sm leading-6 text-foreground/90">
                    {alert.recommendation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-border/50 border-dashed">
            <CardContent className="py-16 text-sm text-muted-foreground">
              Run the workflow to generate portfolio-specific alerts.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

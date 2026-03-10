"use client";

import { useEffect, useState } from "react";

import { ClientSelector } from "@/components/adviser/client-selector";
import { CopilotPanel } from "@/components/adviser/copilot-panel";
import { LoadingSpinner } from "@/components/adviser/loading-spinner";
import {
  getClientAnalytics,
  getClientWellness,
} from "@/components/adviser/adviser-api";
import type {
  ClientAnalytics,
  WellnessResponse,
} from "@/components/adviser/contracts";
import {
  formatSgd,
  getWellnessTone,
} from "@/components/adviser/presentation";
import { useActiveClient } from "@/components/shared/client-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function PlanningPage() {
  const { activeClientId } = useActiveClient();
  const [analytics, setAnalytics] = useState<ClientAnalytics | null>(null);
  const [wellness, setWellness] = useState<WellnessResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadContext() {
      setIsLoading(true);
      setAnalytics(null);
      setWellness(null);

      try {
        const [analyticsResponse, wellnessResponse] = await Promise.all([
          getClientAnalytics(activeClientId),
          getClientWellness(activeClientId),
        ]);

        if (!cancelled) {
          setAnalytics(analyticsResponse);
          setWellness(wellnessResponse);
        }
      } catch {
        if (!cancelled) {
          setAnalytics(null);
          setWellness(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadContext();

    return () => {
      cancelled = true;
    };
  }, [activeClientId]);

  const tone = getWellnessTone(wellness?.wellness_score ?? 71);

  return (
    <div className="min-h-screen space-y-6 bg-zinc-950 p-6 lg:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
            Adviser Copilot
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Advisory prompts grounded in client analytics and house-view
            research.
          </p>
        </div>
        <ClientSelector />
      </div>

      <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 p-0">
        <CardContent className="p-4">
          {isLoading && !analytics && !wellness ? (
            <LoadingSpinner label="Loading client context" />
          ) : analytics && wellness ? (
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-start">
              <div className="min-w-[180px]">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Net Worth
                </p>
                <p className="mt-2 text-3xl font-bold font-mono text-zinc-50">
                  {formatSgd(analytics.net_worth_sgd, true)}
                </p>
              </div>
              <div className="min-w-[150px]">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Wellness
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <p className={`text-2xl font-bold font-mono ${tone.text}`}>
                    {wellness.wellness_score.toFixed(0)}/100
                  </p>
                  <Badge className={tone.badge}>{wellness.rating}</Badge>
                </div>
              </div>
              <div className="min-w-[140px]">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  DSR
                </p>
                <p className="mt-2 text-2xl font-bold font-mono text-zinc-50">
                  {(analytics.dsr * 100).toFixed(1)}%
                </p>
              </div>
              <div className="min-w-[170px]">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Liquidity
                </p>
                <p className="mt-2 text-2xl font-bold font-mono text-zinc-50">
                  {analytics.liquidity_runway_months.toFixed(1)} months
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Top Risk
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {wellness.top_risks[0]}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/60 p-8 text-sm text-zinc-500">
              Client context is not available right now.
            </div>
          )}
        </CardContent>
      </Card>

      <CopilotPanel clientId={activeClientId} />
    </div>
  );
}

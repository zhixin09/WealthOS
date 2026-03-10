"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/adviser/loading-spinner";
import { getClientWellness } from "@/components/adviser/adviser-api";
import type { WellnessResponse } from "@/components/adviser/contracts";
import {
  getWellnessTone,
  scoreToStroke,
  sentenceCase,
} from "@/components/adviser/presentation";
import { useActiveClient } from "@/components/shared/client-context";

export function WellnessScoreCard() {
  const { activeClientId } = useActiveClient();
  const [wellness, setWellness] = useState<WellnessResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadWellness() {
      setIsLoading(true);

      try {
        const response = await getClientWellness(activeClientId);

        if (!cancelled) {
          setWellness(response);
        }
      } catch {
        if (!cancelled) {
          setWellness(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadWellness();

    return () => {
      cancelled = true;
    };
  }, [activeClientId]);

  if (isLoading && !wellness) {
    return (
      <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
        <CardHeader className="border-b border-zinc-800 py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Wellness Score
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4 lg:grid-cols-[150px_1fr]">
            <Skeleton className="h-[150px] rounded-full bg-zinc-800" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 rounded-lg bg-zinc-800" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wellness) {
    return (
      <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
        <CardHeader className="border-b border-zinc-800 py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Wellness Score
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/60 p-6 text-sm text-zinc-400">
            Wellness telemetry is not available right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  const tone = getWellnessTone(wellness.wellness_score);

  return (
    <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
      <CardHeader className="border-b border-zinc-800 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Wellness Score
            </p>
            <CardTitle className="mt-1 text-sm font-semibold tracking-tight text-zinc-100">
              Composite resilience across liquidity, debt, and concentration
            </CardTitle>
          </div>
          <Badge className={tone.badge}>{wellness.rating}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? <LoadingSpinner label="Refreshing" /> : null}
        <div className="grid gap-6 lg:grid-cols-[150px_1fr]">
          <div className="flex flex-col items-center justify-center">
            <div className="relative h-[132px] w-[132px]">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="oklch(1 0 0 / 8%)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={tone.stroke}
                  strokeWidth="8"
                  strokeDasharray={scoreToStroke(wellness.wellness_score)}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className={`text-3xl font-bold font-mono ${tone.text}`}>
                  {wellness.wellness_score.toFixed(0)}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                  out of 100
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(wellness.sub_scores).map(([key, entry]) => {
              const subTone = getWellnessTone(entry.score);

              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {sentenceCase(key)}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">{entry.label}</span>
                      <span className="text-sm font-semibold font-mono text-zinc-100">
                        {entry.score}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${subTone.bar} transition-all duration-700`}
                      style={{ width: `${entry.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Top Risks
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {wellness.top_risks.map((risk) => (
                  <Badge
                    key={risk}
                    className="h-auto rounded-md border border-rose/20 bg-rose/10 px-2 py-1 text-left text-xs leading-5 text-rose-200"
                  >
                    {risk}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

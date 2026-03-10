"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveClient } from "@/components/shared/client-context";
import { useClientDirectory } from "@/components/adviser/use-client-directory";
import { formatSgd, getWellnessTone } from "@/components/adviser/presentation";

export function BookOfBusiness() {
  const { activeClientId, setActiveClientId } = useActiveClient();
  const { clients, isLoading } = useClientDirectory();

  return (
    <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
      <CardHeader className="border-b border-zinc-800 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Book Of Business
            </p>
            <CardTitle className="mt-1 text-sm font-semibold tracking-tight text-zinc-100">
              Adviser coverage across the seeded client book
            </CardTitle>
          </div>
          <Badge className="border border-primary/20 bg-primary/10 text-primary">
            {clients.length || 3} households
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-3 lg:grid-cols-3">
          {isLoading && clients.length === 0
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-36 rounded-lg bg-zinc-800" />
              ))
            : clients.map((client) => {
                const tone = getWellnessTone(client.wellness_score);
                const isActive = client.id === activeClientId;

                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setActiveClientId(client.id)}
                    className={`rounded-lg border p-4 text-left transition-colors ${
                      isActive
                        ? "border-primary/40 bg-primary/10"
                        : "border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-zinc-50">
                          {client.name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                          Age {client.age} / {client.jurisdiction}
                        </p>
                      </div>
                      <Badge className="border border-zinc-700 bg-zinc-900 text-zinc-300">
                        {client.risk_profile}
                      </Badge>
                    </div>
                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                          Net Worth
                        </p>
                        <p className="mt-1 text-2xl font-bold text-zinc-50 font-mono">
                          {formatSgd(client.net_worth_sgd, true)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                          Wellness
                        </p>
                        <div className="mt-1 flex items-center justify-end gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                          <p className={`text-xl font-bold font-mono ${tone.text}`}>
                            {client.wellness_score.toFixed(0)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">
                          {client.wellness_rating}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
        </div>
      </CardContent>
    </Card>
  );
}

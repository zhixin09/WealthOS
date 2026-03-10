"use client";

import { Badge } from "@/components/ui/badge";
import { AssetTable } from "@/components/dashboard/asset-table";
import { MarketOverview } from "@/components/dashboard/market-overview";
import { NetWorthCard } from "@/components/dashboard/net-worth-card";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BookOfBusiness } from "@/components/adviser/book-of-business";
import { ClientSelector } from "@/components/adviser/client-selector";
import { WellnessScoreCard } from "@/components/adviser/wellness-score-card";
import { formatSgd, getWellnessTone } from "@/components/adviser/presentation";
import { useClientDirectory } from "@/components/adviser/use-client-directory";
import { useActiveClient } from "@/components/shared/client-context";

export default function DashboardPage() {
  const { activeClientId } = useActiveClient();
  const { clients } = useClientDirectory();
  const activeClient =
    clients.find((client) => client.id === activeClientId) ?? clients[0];
  const tone = getWellnessTone(activeClient?.wellness_score ?? 71);

  return (
    <div className="min-h-screen bg-zinc-950 p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
            Adviser Terminal
          </h1>
          {activeClient ? (
            <>
              <span className="hidden text-zinc-700 xl:inline">|</span>
              <p className="text-sm text-zinc-400">
                Active Client: <span className="font-medium text-zinc-100">{activeClient.name}</span>
              </p>
              <span className="hidden text-zinc-700 xl:inline">|</span>
              <p className="text-sm font-mono text-zinc-200">
                {formatSgd(activeClient.net_worth_sgd, true)}
              </p>
              <Badge className={tone.badge}>
                Wellness: {activeClient.wellness_score.toFixed(0)}
              </Badge>
            </>
          ) : null}
        </div>
        <ClientSelector />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-4 opacity-0 animate-fade-in-up">
          <BookOfBusiness />
        </div>

        <div className="md:col-span-2 opacity-0 animate-fade-in-up animate-delay-100">
          <WellnessScoreCard />
        </div>

        <div className="md:col-span-2 opacity-0 animate-fade-in-up animate-delay-200">
          <NetWorthCard />
        </div>

        <div className="md:col-span-2 opacity-0 animate-fade-in-up animate-delay-300">
          <PortfolioChart />
        </div>

        <div className="md:col-span-2 opacity-0 animate-fade-in-up animate-delay-400">
          <MarketOverview />
        </div>

        <div className="md:col-span-2 lg:col-span-3 opacity-0 animate-fade-in-up animate-delay-500">
          <AssetTable />
        </div>

        <div className="md:col-span-2 lg:col-span-1 opacity-0 animate-fade-in-up animate-delay-500">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}

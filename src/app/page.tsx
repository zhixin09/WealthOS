import { NetWorthCard } from "@/components/dashboard/net-worth-card";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { AssetTable } from "@/components/dashboard/asset-table";
import { HealthScore } from "@/components/dashboard/health-score";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { MarketOverview } from "@/components/dashboard/market-overview";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Good evening, Alex
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s your wealth overview for{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Net Worth - spans 2 cols */}
        <div className="md:col-span-2 opacity-0 animate-fade-in-up">
          <NetWorthCard />
        </div>

        {/* Portfolio Chart - spans 2 cols */}
        <div className="md:col-span-2 opacity-0 animate-fade-in-up animate-delay-100">
          <PortfolioChart />
        </div>

        {/* Health Score - spans 2 cols */}
        <div className="md:col-span-2 opacity-0 animate-fade-in-up animate-delay-200">
          <HealthScore />
        </div>

        {/* Market Overview - spans 2 cols */}
        <div className="md:col-span-2 opacity-0 animate-fade-in-up animate-delay-300">
          <MarketOverview />
        </div>

        {/* Asset Table - spans 3 cols on large screens */}
        <div className="md:col-span-2 lg:col-span-3 opacity-0 animate-fade-in-up animate-delay-400">
          <AssetTable />
        </div>

        {/* Recent Transactions - spans 1 col on large */}
        <div className="md:col-span-2 lg:col-span-1 opacity-0 animate-fade-in-up animate-delay-500">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}

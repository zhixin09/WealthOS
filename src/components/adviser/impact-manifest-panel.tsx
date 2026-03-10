import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ImpactManifest } from "@/components/adviser/contracts";
import {
  formatPercent,
  formatSgd,
  getSeverityTone,
} from "@/components/adviser/presentation";

export function ImpactManifestPanel({
  impact,
  onGenerateBrief,
  onBack,
  isGeneratingBrief = false,
}: {
  impact: ImpactManifest;
  onGenerateBrief: () => void;
  onBack: () => void;
  isGeneratingBrief?: boolean;
}) {
  return (
    <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
      <CardHeader className="border-b border-zinc-800 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Impact Manifest
            </p>
            <CardTitle className="mt-1 max-w-3xl text-lg font-semibold tracking-tight text-zinc-50">
              {impact.headline}
            </CardTitle>
          </div>
          <Badge className={`px-3 py-1 text-xs font-semibold ${getSeverityTone(impact.severity)}`}>
            {impact.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    Ticker
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    Name
                  </TableHead>
                  <TableHead className="text-right text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    Value
                  </TableHead>
                  <TableHead className="text-right text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    Exposure
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impact.matched_holdings.length > 0 ? (
                  impact.matched_holdings.map((holding) => (
                    <TableRow key={holding.ticker} className="border-zinc-800/70">
                      <TableCell className="font-mono font-semibold text-zinc-100">
                        {holding.ticker}
                      </TableCell>
                      <TableCell className="text-zinc-300">{holding.name}</TableCell>
                      <TableCell className="text-right font-mono text-zinc-100">
                        {formatSgd(holding.value_sgd)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-zinc-100">
                        {formatPercent(holding.exposure_pct)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-zinc-800/70">
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-zinc-500">
                      No directly matched holdings for this event.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Total Exposure
              </p>
              <p className="mt-2 text-3xl font-bold font-mono text-zinc-50">
                {formatPercent(impact.total_exposure_pct)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Severity Rationale
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {impact.severity_rationale}
              </p>
            </div>
            <Button
              onClick={onGenerateBrief}
              disabled={isGeneratingBrief}
              className="h-10 w-full rounded-lg"
            >
              {isGeneratingBrief ? "Generating Adviser Brief..." : "Generate Adviser Brief"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="w-fit gap-2 text-zinc-400 hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ResearchResult } from "@/components/adviser/contracts";

export function ResearchResultCard({ result }: { result: ResearchResult }) {
  return (
    <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 p-4">
      <CardContent className="space-y-3 p-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-zinc-100">{result.source}</p>
            <p className="mt-1 text-xs text-zinc-500">{result.citation}</p>
          </div>
          <Badge className="border border-primary/20 bg-primary/10 font-mono text-primary">
            Score: {result.score.toFixed(2)}
          </Badge>
        </div>
        <p className="text-sm leading-6 text-zinc-300">{result.snippet}</p>
      </CardContent>
    </Card>
  );
}

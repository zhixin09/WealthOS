"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

import {
  HOUSE_VIEW_LIBRARY,
} from "@/components/adviser/demo-data";
import { ClientSelector } from "@/components/adviser/client-selector";
import { LoadingSpinner } from "@/components/adviser/loading-spinner";
import { ResearchResultCard } from "@/components/adviser/research-result-card";
import { searchResearch } from "@/components/adviser/adviser-api";
import type { ResearchSearchResponse } from "@/components/adviser/contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResearchPage() {
  const [query, setQuery] = useState("crypto exposure risk");
  const [result, setResult] = useState<ResearchSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await searchResearch(query);
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen space-y-6 bg-zinc-950 p-6 lg:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
            House View Research Navigator
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Search the fixed advisory corpus and inspect raw BM25-style hits.
          </p>
        </div>
        <ClientSelector />
      </div>

      <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 p-4">
        <CardContent className="p-0">
          <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleSubmit}>
            <div className="relative md:flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search house view research"
                className="h-12 rounded-lg border-zinc-700 bg-zinc-950 pl-10 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <Button type="submit" disabled={isLoading || query.trim().length === 0} className="h-12 rounded-lg px-5">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {HOUSE_VIEW_LIBRARY.map((document) => (
          <Card key={document.id} className="rounded-lg border border-zinc-800 bg-zinc-900/85 p-4">
            <CardContent className="p-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{document.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {document.description}
                  </p>
                </div>
                <Badge className="border border-primary/20 bg-primary/10 text-primary">
                  {document.badge}
                </Badge>
              </div>
              <p className="mt-4 text-xs text-zinc-500">{document.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? <LoadingSpinner label="Searching corpus" /> : null}

      {!isLoading && result?.results.length ? (
        <div className="space-y-4">
          {result.results.map((item) => (
            <ResearchResultCard
              key={`${item.source}-${item.citation}-${item.score}`}
              result={item}
            />
          ))}
        </div>
      ) : null}

      {!isLoading && hasSearched && (!result || result.results.length === 0) ? (
        <Card className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/85">
          <CardContent className="py-16 text-sm text-zinc-500">
            No research matches were found for this query.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

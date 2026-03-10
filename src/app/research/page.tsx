"use client";

import { FormEvent, useState } from "react";
import { FileText, Search } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { queryResearch } from "@/lib/api";
import type { ResearchResponse } from "@/lib/types";

const SUGGESTED_PROMPTS = [
  "How should households think about liquidity buffers in Singapore?",
  "What matters for concentrated crypto exposure?",
  "How should I think about valuation risk in Asia tech equities?",
];

export default function ResearchPage() {
  const [question, setQuestion] = useState(SUGGESTED_PROMPTS[0]);
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await queryResearch(question);
      setResult(data);
    } catch (submissionError) {
      setResult(null);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to query research right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Research Navigator</h1>
        <p className="text-sm text-muted-foreground">
          Query the seeded research corpus for cited answers about liquidity,
          digital assets, and technology equity positioning.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Ask a research question
          </CardTitle>
          <CardDescription>
            The MVP uses a curated internal corpus and returns direct citations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleSubmit}>
            <Input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about market risks, liquidity, or allocation themes"
              className="md:flex-1"
            />
            <Button type="submit" disabled={isLoading || question.trim().length === 0}>
              {isLoading ? "Searching..." : "Run Query"}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuestion(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Answer</CardTitle>
            <CardDescription>
              Synthesized response from the highest-scoring research excerpts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : result ? (
              <p className="text-sm leading-6 text-foreground/90">{result.answer}</p>
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 bg-accent/20 p-8 text-sm text-muted-foreground">
                Submit a question to generate a cited research answer.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Citations</CardTitle>
            <CardDescription>
              Evidence returned by the retrieval layer for the current question.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result?.citations.length ? (
              result.citations.map((citation) => (
                <div
                  key={citation.citation}
                  className="rounded-lg border border-border/60 bg-accent/20 p-3"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <FileText className="h-3.5 w-3.5" />
                    {citation.source}
                  </div>
                  <p className="text-sm text-foreground/90">{citation.snippet}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {citation.citation}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 bg-accent/20 p-8 text-sm text-muted-foreground">
                Relevant sources will appear here after a query runs.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { Calculator, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryPlanning } from "@/lib/api";
import type { PlanningResponse } from "@/lib/types";

const SUGGESTED_QUESTIONS = [
  "Can I afford a $1.2M property upgrade next year without selling core equities?",
  "How strong is my liquidity buffer right now?",
  "Is my portfolio too concentrated for a moderate-risk profile?",
];

export default function PlanningPage() {
  const [question, setQuestion] = useState(SUGGESTED_QUESTIONS[0]);
  const [result, setResult] = useState<PlanningResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await queryPlanning(question);
      setResult(data);
    } catch (submissionError) {
      setResult(null);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to run planning analysis right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Financial Planning</h1>
        <p className="text-sm text-muted-foreground">
          Run structured planning scenarios using the client profile, liabilities,
          and liquidity position already loaded into WealthOS.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            Ask a planning question
          </CardTitle>
          <CardDescription>
            The assistant uses deterministic financial calculations before it
            produces a recommendation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleSubmit}>
            <Input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about property affordability, liquidity, or portfolio risk"
              className="md:flex-1"
            />
            <Button type="submit" disabled={isLoading || question.trim().length === 0}>
              {isLoading ? "Analyzing..." : "Run Analysis"}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Planning Summary</CardTitle>
            <CardDescription>
              Scenario interpretation grounded in current household data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : result ? (
              <>
                <div className="rounded-lg border border-border/60 bg-accent/20 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Scenario
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground/90">
                    {result.scenario}
                  </p>
                </div>
                <p className="text-sm leading-6 text-foreground/90">
                  {result.summary}
                </p>
                <div className="rounded-lg border border-emerald/20 bg-emerald/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald">
                    <ShieldCheck className="h-4 w-4" />
                    Recommendation
                  </div>
                  <p className="text-sm leading-6 text-foreground/90">
                    {result.recommendation}
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 bg-accent/20 p-8 text-sm text-muted-foreground">
                Submit a planning question to generate scenario guidance.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Key Numbers</CardTitle>
            <CardDescription>
              Deterministic metrics used to support the recommendation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result?.key_metrics.length ? (
              result.key_metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-border/60 bg-accent/20 p-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{metric.value}</p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 bg-accent/20 p-8 text-sm text-muted-foreground">
                Key scenario metrics will appear here after analysis runs.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

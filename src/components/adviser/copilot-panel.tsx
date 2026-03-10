"use client";

import { FormEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/adviser/loading-spinner";
import { queryCopilot } from "@/components/adviser/adviser-api";
import type { CopilotResponse } from "@/components/adviser/contracts";
import { getUrgencyTone } from "@/components/adviser/presentation";
import { dedupeResearchUsage } from "@/components/adviser/research-usage";

const PROMPTS = [
  "What are the top 3 actions for this client this quarter?",
  "How exposed is this client to digital asset volatility?",
  "Can this client afford a property upgrade without hurting liquidity?",
  "What does our house view imply for the equity allocation?",
];

export function CopilotPanel({ clientId }: { clientId: string }) {
  const [question, setQuestion] = useState(PROMPTS[0]);
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const researchUsed = response ? dedupeResearchUsage(response.research_used) : [];

  async function submitQuestion(nextQuestion: string) {
    setQuestion(nextQuestion);
    setIsLoading(true);

    try {
      const result = await queryCopilot(clientId, nextQuestion);
      setResponse(result);
    } catch {
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (question.trim().length === 0) {
      return;
    }

    await submitQuestion(question.trim());
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 p-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Prompt Chips
          </p>
          <div className="flex flex-wrap gap-2">
            {PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                type="button"
                variant="outline"
                onClick={() => void submitQuestion(prompt)}
                className="rounded-lg border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800/70"
              >
                {prompt}
              </Button>
            ))}
          </div>
          <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleSubmit}>
            <Input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask the advisory copilot a client question"
              className="h-10 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 md:flex-1"
            />
            <Button type="submit" disabled={isLoading || question.trim().length === 0}>
              {isLoading ? "Running..." : "Ask"}
            </Button>
          </form>
        </div>
      </Card>

      <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
        <CardContent className="space-y-5 p-4">
          {isLoading ? (
            <LoadingSpinner label="Compiling adviser answer" />
          ) : response ? (
            <>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="text-sm leading-7 whitespace-pre-line text-zinc-200">
                  {response.answer}
                </p>
              </div>

              <div className="space-y-3">
                {response.structured_actions.map((action) => (
                  <div
                    key={action.rank}
                    className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 md:grid-cols-[52px_1fr_auto]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-2xl font-bold font-mono text-zinc-200">
                      {action.rank}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{action.action}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {action.rationale}
                      </p>
                    </div>
                    <div>
                      <Badge className={getUrgencyTone(action.urgency)}>{action.urgency}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Research Used
                </p>
                {researchUsed.map((item) => (
                  <Badge
                    key={item.doc}
                    className="border border-zinc-700 bg-zinc-950 text-zinc-300"
                  >
                    {item.doc} / {item.score.toFixed(2)}
                  </Badge>
                ))}
                {response.grounding_validated ? (
                  <Badge className="border border-emerald/30 bg-emerald/15 text-emerald">
                    Grounded
                  </Badge>
                ) : null}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/60 p-8 text-sm text-zinc-500">
              Run a prompt to generate structured advisory guidance.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

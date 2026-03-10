"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, CheckCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlertBrief } from "@/components/adviser/contracts";
import { getSeverityTone } from "@/components/adviser/presentation";

export function AlertBriefPanel({
  brief,
  onBack,
}: {
  brief: AlertBrief;
  onBack: () => void;
}) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowToast(false);
    }, 2600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showToast]);

  return (
    <>
      {showToast ? (
        <div className="fixed right-6 top-6 z-50 rounded-lg border border-emerald/30 bg-zinc-950/95 px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-2 text-sm text-emerald">
            <CheckCheck className="h-4 w-4" />
            Draft sent for compliance review
          </div>
        </div>
      ) : null}
      <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0">
        <CardHeader className="border-b border-zinc-800 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Adviser Brief
              </p>
              <CardTitle className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
                {brief.subject}
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`px-3 py-1 text-xs font-semibold ${getSeverityTone(brief.severity)}`}>
                {brief.severity}
              </Badge>
              {brief.grounding_validated ? (
                <Badge className="border border-emerald/30 bg-emerald/15 text-emerald">
                  <Check className="h-3.5 w-3.5" />
                  Grounded in house view
                </Badge>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
            <p className="text-sm leading-7 whitespace-pre-line text-zinc-200">
              {brief.brief}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Recommended Actions
            </p>
            <div className="space-y-3">
              {brief.recommended_actions.map((action, index) => (
                <div
                  key={action}
                  className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald/30 bg-emerald/10 text-sm font-semibold text-emerald">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-zinc-200">{action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              House View Citations
            </p>
            <div className="space-y-3">
              {brief.house_view_citations.map((citation) => (
                <div
                  key={`${citation.doc}-${citation.excerpt}`}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4"
                >
                  <p className="text-sm font-semibold text-zinc-100">{citation.doc}</p>
                  <p className="mt-2 text-sm italic leading-6 text-zinc-400">
                    {citation.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setShowToast(true)} className="h-10 rounded-lg">
              Send to Client
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="w-fit gap-2 text-zinc-400 hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Impact
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

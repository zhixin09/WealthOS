"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, CheckCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AlertBrief } from "@/components/adviser/contracts";
import { getSeverityTone } from "@/components/adviser/presentation";

export function AlertBriefPanel({
  brief,
  isEditing,
  isDirty,
  isReviewed,
  onBack,
  onToggleEditing,
  onSubjectChange,
  onBriefChange,
  onActionChange,
  onReset,
  onReviewedChange,
}: {
  brief: AlertBrief;
  isEditing: boolean;
  isDirty: boolean;
  isReviewed: boolean;
  onBack: () => void;
  onToggleEditing: () => void;
  onSubjectChange: (value: string) => void;
  onBriefChange: (value: string) => void;
  onActionChange: (index: number, value: string) => void;
  onReset: () => void;
  onReviewedChange: (value: boolean) => void;
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
              {isEditing ? (
                <div className="mt-3 max-w-3xl">
                  <Input
                    value={brief.subject}
                    onChange={(event) => onSubjectChange(event.target.value)}
                    className="h-11 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100"
                  />
                </div>
              ) : (
                <CardTitle className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
                  {brief.subject}
                </CardTitle>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`px-3 py-1 text-xs font-semibold ${getSeverityTone(brief.severity)}`}>
                {brief.severity}
              </Badge>
              {isDirty ? (
                <Badge className="border border-amber-500/30 bg-amber-500/15 text-amber-200">
                  RM edited draft
                </Badge>
              ) : null}
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
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant={isEditing ? "secondary" : "outline"}
              onClick={onToggleEditing}
              className="h-10 rounded-lg"
            >
              {isEditing ? "Preview Draft" : "Edit Draft"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onReset}
              disabled={!isDirty}
              className="h-10 rounded-lg text-zinc-300 hover:text-zinc-100"
            >
              Reset to AI Draft
            </Button>
            <p className="text-xs text-zinc-500">
              AI can draft. RM review is required before client send.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
            {isEditing ? (
              <textarea
                value={brief.brief}
                onChange={(event) => onBriefChange(event.target.value)}
                rows={7}
                className="min-h-44 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm leading-7 text-zinc-200 outline-none transition-colors focus:border-zinc-500"
              />
            ) : (
              <p className="text-sm leading-7 whitespace-pre-line text-zinc-200">
                {brief.brief}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Recommended Actions
            </p>
            <div className="space-y-3">
              {brief.recommended_actions.map((action, index) => (
                <div
                  key={`${brief.alert_id}-${index}`}
                  className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald/30 bg-emerald/10 text-sm font-semibold text-emerald">
                    {index + 1}
                  </div>
                  {isEditing ? (
                    <textarea
                      value={action}
                      onChange={(event) => onActionChange(index, event.target.value)}
                      rows={2}
                      className="min-h-20 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm leading-6 text-zinc-200 outline-none transition-colors focus:border-zinc-500"
                    />
                  ) : (
                    <p className="text-sm leading-6 text-zinc-200">{action}</p>
                  )}
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

          <label className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={isReviewed}
              onChange={(event) => onReviewedChange(event.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 accent-emerald"
            />
            Reviewed by RM. This draft is ready for client-facing use.
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setShowToast(true)}
              disabled={!isReviewed}
              className="h-10 rounded-lg"
            >
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

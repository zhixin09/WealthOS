"use client";

import { useEffect, useState } from "react";

import { AlertBriefPanel } from "@/components/adviser/alert-brief-panel";
import {
  generateAlertBrief,
  getEvents,
  runEventImpact,
} from "@/components/adviser/adviser-api";
import { ClientSelector } from "@/components/adviser/client-selector";
import { EventCard } from "@/components/adviser/event-card";
import { ImpactManifestPanel } from "@/components/adviser/impact-manifest-panel";
import { LoadingSpinner } from "@/components/adviser/loading-spinner";
import type {
  AlertBrief,
  ImpactManifest,
  SeededEvent,
} from "@/components/adviser/contracts";
import { Card, CardContent } from "@/components/ui/card";
import { useActiveClient } from "@/components/shared/client-context";

export default function AlertsPage() {
  const { activeClientId } = useActiveClient();
  const [events, setEvents] = useState<SeededEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [impact, setImpact] = useState<ImpactManifest | null>(null);
  const [brief, setBrief] = useState<AlertBrief | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingImpact, setIsLoadingImpact] = useState(false);
  const [isLoadingBrief, setIsLoadingBrief] = useState(false);
  const [view, setView] = useState<"events" | "impact" | "brief">("events");

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setIsLoadingEvents(true);

      try {
        const response = await getEvents();
        if (!cancelled) {
          setEvents(response);
        }
      } catch {
        if (!cancelled) {
          setEvents([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingEvents(false);
        }
      }
    }

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setView("events");
    setSelectedEventId(null);
    setImpact(null);
    setBrief(null);
    setIsLoadingImpact(false);
    setIsLoadingBrief(false);
  }, [activeClientId]);

  async function handleEventClick(eventId: string) {
    setSelectedEventId(eventId);
    setView("impact");
    setImpact(null);
    setBrief(null);
    setIsLoadingImpact(true);

    try {
      const response = await runEventImpact(eventId, activeClientId);
      setImpact(response);
    } catch {
      setImpact(null);
    } finally {
      setIsLoadingImpact(false);
    }
  }

  async function handleGenerateBrief() {
    if (!selectedEventId) {
      return;
    }

    setIsLoadingBrief(true);
    setView("brief");
    setBrief(null);

    try {
      const response = await generateAlertBrief(selectedEventId, activeClientId);
      setBrief(response);
    } catch {
      setBrief(null);
    } finally {
      setIsLoadingBrief(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
            Event-To-Impact Alert Centre
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Progress from market event to exposure manifest to an adviser-ready
            brief.
          </p>
        </div>
        <ClientSelector />
      </div>

      {view === "events" ? (
        isLoadingEvents ? (
          <LoadingSpinner label="Loading event feed" />
        ) : events.length > 0 ? (
          <div className="grid gap-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => void handleEventClick(event.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/85">
            <CardContent className="py-16 text-sm text-zinc-500">
              No events are available right now.
            </CardContent>
          </Card>
        )
      ) : null}

      {view === "impact" ? (
        isLoadingImpact ? (
          <LoadingSpinner label="Computing client exposure" />
        ) : impact ? (
          <ImpactManifestPanel
            impact={impact}
            onGenerateBrief={() => void handleGenerateBrief()}
            onBack={() => setView("events")}
            isGeneratingBrief={isLoadingBrief}
          />
        ) : (
          <Card className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/85">
            <CardContent className="py-16 text-sm text-zinc-500">
              Impact analysis is unavailable for the selected event.
            </CardContent>
          </Card>
        )
      ) : null}

      {view === "brief" ? (
        isLoadingBrief && !brief ? (
          <LoadingSpinner label="Generating adviser brief" />
        ) : brief ? (
          <AlertBriefPanel brief={brief} onBack={() => setView("impact")} />
        ) : (
          <Card className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/85">
            <CardContent className="py-16 text-sm text-zinc-500">
              Adviser brief generation is unavailable for this event.
            </CardContent>
          </Card>
        )
      ) : null}
    </div>
  );
}

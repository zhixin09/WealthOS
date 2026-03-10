import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SeededEvent } from "@/components/adviser/contracts";
import {
  formatDateTime,
  getEventTypeTone,
} from "@/components/adviser/presentation";

export function EventCard({
  event,
  onClick,
}: {
  event: SeededEvent;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <Card className="rounded-lg border border-zinc-800 bg-zinc-900/85 py-0 transition-colors hover:bg-zinc-800/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
                {event.headline}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border border-zinc-700 bg-zinc-900 text-zinc-300">
                  {event.source}
                </Badge>
                <Badge className={getEventTypeTone(event.event_type)}>
                  {event.event_type.replace("_", " ")}
                </Badge>
                <span className="text-xs text-zinc-500">
                  {formatDateTime(event.timestamp)}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            {event.body.length > 100 ? `${event.body.slice(0, 100)}...` : event.body}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}

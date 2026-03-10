"use client";

import { useActiveClient } from "@/components/shared/client-context";
import { useClientDirectory } from "@/components/adviser/use-client-directory";
import { getWellnessTone } from "@/components/adviser/presentation";

export function ClientSelector() {
  const { activeClientId, setActiveClientId } = useActiveClient();
  const { clients, isLoading } = useClientDirectory();
  const activeClient =
    clients.find((client) => client.id === activeClientId) ?? clients[0];
  const tone = getWellnessTone(activeClient?.wellness_score ?? 71);

  return (
    <div className="flex min-w-[250px] items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2">
      <div className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Active Client
        </p>
        <select
          value={activeClientId}
          onChange={(event) => setActiveClientId(event.target.value)}
          disabled={isLoading || clients.length === 0}
          className="mt-1 w-full bg-transparent text-sm font-medium text-zinc-100 outline-none"
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id} className="bg-zinc-950">
              {`${client.name} - ${client.wellness_rating} (${client.wellness_score.toFixed(0)})`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

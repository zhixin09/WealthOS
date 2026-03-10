"use client";

import { useEffect, useState } from "react";

import type { ClientSummary } from "@/components/adviser/contracts";
import { getClients } from "@/components/adviser/adviser-api";

let cachedClients: ClientSummary[] | null = null;

export function useClientDirectory() {
  const [clients, setClients] = useState<ClientSummary[]>(cachedClients ?? []);
  const [isLoading, setIsLoading] = useState(cachedClients === null);

  useEffect(() => {
    if (cachedClients) {
      return;
    }

    let cancelled = false;

    async function loadClients() {
      setIsLoading(true);

      try {
        const data = await getClients();

        if (cancelled) {
          return;
        }

        cachedClients = data;
        setClients(data);
      } catch {
        if (!cancelled) {
          setClients([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadClients();

    return () => {
      cancelled = true;
    };
  }, []);

  return { clients, isLoading };
}

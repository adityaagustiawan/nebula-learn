import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSync } from "@/contexts/realtime-sync-context";
import { FEED_POLL_INTERVAL_MS } from "@/lib/sync/feed-sync";

export function usePlatformFeed() {
  const { items, syncing, lastSync, refresh } = useRealtimeSync();
  return { items, syncing, lastSync, refresh };
}

export function useRealtimeTable<T extends { id: string }>(
  table: string,
  fetchRows: () => Promise<T[]>,
  filter?: string,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await fetchRows();
    setRows(data);
    setLoading(false);
  }, [fetchRows]);

  useEffect(() => {
    reload();
    const channel = supabase
      .channel(`${table}_rt_${filter ?? "all"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table, ...(filter ? { filter } : {}) },
        () => reload(),
      )
      .subscribe();
    const poll = window.setInterval(reload, FEED_POLL_INTERVAL_MS);
    return () => {
      clearInterval(poll);
      supabase.removeChannel(channel);
    };
  }, [table, filter, reload]);

  return { rows, loading, reload };
}

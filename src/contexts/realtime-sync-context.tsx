import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { platformSync, type SyncState } from "@/lib/sync/sync-scheduler";
import { getCachedFeed, getLastSyncAt } from "@/lib/sync/feed-sync";

const RealtimeSyncContext = createContext<SyncState & { refresh: () => void }>({
  items: [],
  syncing: false,
  lastSync: null,
  tick: 0,
  refresh: () => {},
});

export function RealtimeSyncProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SyncState>({
    items: getCachedFeed(),
    syncing: false,
    lastSync: getLastSyncAt(),
    tick: 0,
  });

  useEffect(() => {
    const unsubscribe = platformSync.subscribe(setState);
    return () => { unsubscribe(); };
  }, []);

  return (
    <RealtimeSyncContext.Provider value={{ ...state, refresh: () => platformSync.runSync() }}>
      {children}
    </RealtimeSyncContext.Provider>
  );
}

export function useRealtimeSync() {
  return useContext(RealtimeSyncContext);
}

/** Seconds since last sync — updates every second via tick */
export function useSecondsSinceSync() {
  const { lastSync, tick } = useRealtimeSync();
  if (!lastSync) return null;
  void tick;
  return Math.max(0, Math.floor((Date.now() - new Date(lastSync).getTime()) / 1000));
}

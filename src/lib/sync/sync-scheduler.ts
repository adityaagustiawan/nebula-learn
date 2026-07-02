import { syncPlatformFeed, type CachedFeedItem } from "./feed-sync";
import { seedCatalogIfEmpty } from "@/lib/learning/catalog-sync";

/** External APIs: every 1s. UI "live" tick: every 1s. */
export const SYNC_INTERVAL_MS = 1000;
export const UI_TICK_MS = 1_000;
export const DAILY_SYNC_MS = 24 * 60 * 60 * 1000;

type Listener = (state: SyncState) => void;

export interface SyncState {
  items: CachedFeedItem[];
  syncing: boolean;
  lastSync: string | null;
  tick: number;
}

class PlatformSyncScheduler {
  private listeners = new Set<Listener>();
  private state: SyncState = {
    items: [],
    syncing: false,
    lastSync: null,
    tick: 0,
  };
  private started = false;
  private syncTimer?: ReturnType<typeof setInterval>;
  private tickTimer?: ReturnType<typeof setInterval>;
  private dailyTimer?: ReturnType<typeof setInterval>;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.state);
    if (!this.started && typeof window !== "undefined") this.start();
    return () => this.listeners.delete(listener);
  }

  private emit(partial: Partial<SyncState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l(this.state));
  }

  async runSync() {
    if (this.state.syncing) return;
    this.emit({ syncing: true });
    try {
      const items = await syncPlatformFeed();
      this.emit({ items, lastSync: new Date().toISOString(), syncing: false });
    } catch {
      this.emit({ syncing: false });
    }
  }

  start() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;

    seedCatalogIfEmpty().catch(() => {});
    this.runSync();

    this.syncTimer = setInterval(() => this.runSync(), SYNC_INTERVAL_MS);
    this.tickTimer = setInterval(() => this.emit({ tick: this.state.tick + 1 }), UI_TICK_MS);
    this.dailyTimer = setInterval(() => this.runSync(), DAILY_SYNC_MS);
  }

  stop() {
    if (this.syncTimer) clearInterval(this.syncTimer);
    if (this.tickTimer) clearInterval(this.tickTimer);
    if (this.dailyTimer) clearInterval(this.dailyTimer);
    this.started = false;
  }
}

export const platformSync = new PlatformSyncScheduler();

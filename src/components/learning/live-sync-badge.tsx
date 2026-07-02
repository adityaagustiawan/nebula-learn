import { useRealtimeSync, useSecondsSinceSync } from "@/contexts/realtime-sync-context";
import { Cpu } from "lucide-react";

export function LiveSyncBadge() {
  const { syncing } = useRealtimeSync();
  const seconds = useSecondsSinceSync();

  return (
    <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] text-primary/80 font-mono shadow-glow-sm">
      <Cpu className={`h-3 w-3 ${syncing ? "animate-spin" : "animate-pulse"}`} />
      {syncing ? "AI SCANNING..." : seconds !== null ? `REALTIME · ${seconds}s` : "AI ACTIVE"}
    </span>
  );
}

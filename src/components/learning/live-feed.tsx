import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePlatformFeed } from "@/hooks/use-realtime-sync";
import { RefreshCw, Rss, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LiveFeed({ limit = 8, compact = false }: { limit?: number; compact?: boolean }) {
  const { items, syncing, lastSync, refresh } = usePlatformFeed();
  const visible = items.slice(0, limit);

  return (
    <div className={compact ? "" : "glass rounded-2xl p-6"}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Rss className="h-5 w-5 text-primary" />
          <h2 className={compact ? "text-lg font-semibold" : "font-display font-bold text-xl"}>AI Live Intelligence</h2>
          <span className="flex items-center gap-1 text-xs text-destructive">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
            REALTIME
          </span>
        </div>
        <Button size="sm" variant="ghost" onClick={() => refresh()} disabled={syncing}>
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {lastSync && (
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" />
          Updated {new Date(lastSync).toLocaleTimeString()} · AI Agent scanning every 1s from multiple sources
        </p>
      )}

      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">AI Agent initializing…</p>
        ) : (
          <AnimatePresence initial={false}>
            {visible.map((item) => (
              <motion.a
                key={item.external_id}
                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.01, backgroundColor: "var(--surface)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 rounded-xl border border-border/50 p-3 hover:bg-surface transition group relative overflow-hidden"
              >
                {item.source === 'ai_agent' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={item.source === 'ai_agent' ? "default" : "secondary"} className="text-[10px]">
                      {item.source === 'ai_agent' ? "AI Agent" : item.source}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                  </div>
                  <div className="text-sm font-medium mt-1 line-clamp-2 group-hover:text-primary">{item.title}</div>
                  {item.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.summary}</p>}
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

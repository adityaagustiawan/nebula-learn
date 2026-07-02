import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLiveCompetitions } from "@/hooks/use-live-catalog";
import { Trophy, Users, Calendar, Flame, Zap, ExternalLink } from "lucide-react";
import { LiveFeed } from "@/components/learning/live-feed";
import { useCompetitionActions } from "@/hooks/use-competition-actions";
import { motion } from "framer-motion";
import type { Competition } from "@/lib/catalog";

export const Route = createFileRoute("/competitions")({
  component: CompetitionsPage,
  head: () => ({ meta: [{ title: "Competitions & Hackathons — NebulaLearn" }, { name: "description", content: "Join live hackathons and skill challenges with real prizes." }] }),
});

const statusColor: Record<string, string> = {
  Live: "bg-destructive/20 text-destructive border-destructive/30",
  Open: "bg-success/20 text-success border-success/30",
  "Closing soon": "bg-warning/20 text-warning border-warning/30",
  Upcoming: "bg-muted text-muted-foreground border-border",
  End: "bg-muted/50 text-muted-foreground border-border/50",
};

function CompetitionCard({ c, index, statusColor, isRegistered, isPending, startRegistration, completeRegistration }: { 
  c: Competition, 
  index: number, 
  statusColor: Record<string, string>,
  isRegistered: (s: string) => boolean,
  isPending: (s: string) => boolean,
  startRegistration: (s: string, u: string) => void,
  completeRegistration: (s: string, t: string) => void
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="glass rounded-2xl relative overflow-hidden group flex flex-col h-full"
    >
      {/* Dedicated Header Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-primary/5">
        {c.imageUrl && !imgError ? (
          <img 
            src={c.imageUrl} 
            alt={c.title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center relative">
            <Trophy className="h-16 w-16 text-primary/20 relative z-10" />
          </div>
        )}
        {/* The User-Selected Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        
        <div className="absolute top-4 left-4 flex gap-2 z-20">
          <Badge className="shadow-md rounded-full px-3 bg-white/10 text-white border border-white/20 backdrop-blur-sm text-[10px]">
            {c.competitionType || "HACKATHON"}
          </Badge>
          {c.status === "Live" && (
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Badge variant="outline" className={statusColor[c.status]}>{c.status}</Badge>
            <h3 className="mt-3 text-xl font-display font-bold group-hover:text-primary transition-colors line-clamp-1">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">Hosted by {c.host}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Prize</div>
            <div className="font-display font-bold text-gradient text-lg">{c.prize}</div>
          </div>
        </div>

        {c.description && (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-3 italic leading-relaxed">
            {c.description}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-1.5">
            {c.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-[12px]">
            <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {c.starts}</div>
            <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3.5 w-3.5" /> {c.participants.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 text-warning font-medium">
              {c.status === "End" ? "Ended" : <><Trophy className="h-3.5 w-3.5" /> {c.daysLeft}d left</>}
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Button
              className="flex-1 gradient-primary relative overflow-hidden group-btn"
              variant={isRegistered(c.slug) ? "outline" : "default"}
              onClick={() => {
                if (isPending(c.slug)) {
                  completeRegistration(c.slug, c.title);
                } else if (!isRegistered(c.slug)) {
                  startRegistration(c.slug, c.externalUrl || "#");
                }
              }}
              disabled={isRegistered(c.slug) || c.status === "End"}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isRegistered(c.slug) 
                  ? "Registered ✓" 
                  : isPending(c.slug) 
                    ? "Confirm Finished" 
                    : c.status === "End"
                      ? "Competition Ended"
                      : c.status === "Live" 
                        ? <><Zap className="h-4 w-4 animate-pulse" /> Join now</> 
                        : c.status === "Upcoming" 
                          ? "Set reminder" 
                          : "Register"}
              </span>
              {!isRegistered(c.slug) && !isPending(c.slug) && c.status !== "End" && (
                <motion.div 
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </Button>
            {isPending(c.slug) && c.status !== "End" && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => startRegistration(c.slug, c.externalUrl || "#")}
                title="Open registration again"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CompetitionsPage() {
  const competitions = useLiveCompetitions();
  const { startRegistration, completeRegistration, isRegistered, isPending } = useCompetitionActions();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-16 pb-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-4 gradient-accent text-accent-foreground border-0"><Flame className="mr-1 h-3 w-3" /> $2.4M+ awarded</Badge>
          <h1 className="text-4xl md:text-5xl font-bold">Hackathons & challenges</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">Build with the world's most ambitious developers. Inspired by LabLab.AI, Reply Challenges, and Hack2Skills.</p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-5">
          {competitions.map((c, index) => (
            <CompetitionCard 
              key={c.slug} 
              c={c} 
              index={index} 
              statusColor={statusColor} 
              isRegistered={isRegistered} 
              isPending={isPending} 
              startRegistration={startRegistration} 
              completeRegistration={completeRegistration} 
            />
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 pb-16 max-w-4xl">
        <LiveFeed limit={5} compact />
      </section>
      <SiteFooter />
    </div>
  );
}

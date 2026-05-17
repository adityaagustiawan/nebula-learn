import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { competitions } from "@/lib/catalog";
import { Trophy, Users, Calendar, Flame } from "lucide-react";

export const Route = createFileRoute("/competitions")({
  component: CompetitionsPage,
  head: () => ({ meta: [{ title: "Competitions & Hackathons — NebulaLearn" }, { name: "description", content: "Join live hackathons and skill challenges with real prizes." }] }),
});

const statusColor: Record<string, string> = {
  Live: "bg-destructive/20 text-destructive border-destructive/30",
  Open: "bg-success/20 text-success border-success/30",
  "Closing soon": "bg-warning/20 text-warning border-warning/30",
  Upcoming: "bg-muted text-muted-foreground border-border",
};

function CompetitionsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-16 pb-10 max-w-6xl">
        <Badge className="mb-4 gradient-accent text-accent-foreground border-0"><Flame className="mr-1 h-3 w-3" /> $2.4M+ awarded</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Hackathons & challenges</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Build with the world's most ambitious developers. Inspired by LabLab.AI, Reply Challenges, and Hack2Skills.</p>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-5">
          {competitions.map((c) => (
            <article key={c.slug} className="glass rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="outline" className={statusColor[c.status]}>{c.status}</Badge>
                  <h3 className="mt-3 text-xl font-display font-bold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Hosted by {c.host}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Prize</div>
                  <div className="font-display font-bold text-gradient text-lg">{c.prize}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {c.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {c.starts}</div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3.5 w-3.5" /> {c.participants.toLocaleString()}</div>
                <div className="flex items-center gap-1.5 text-warning"><Trophy className="h-3.5 w-3.5" /> {c.daysLeft}d left</div>
              </div>

              <Button className="mt-5 w-full gradient-primary">
                {c.status === "Live" ? "Join now" : c.status === "Upcoming" ? "Set reminder" : "Register"}
              </Button>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

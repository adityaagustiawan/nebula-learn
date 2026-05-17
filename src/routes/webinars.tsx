import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { webinars } from "@/lib/catalog";
import { Radio, Play, Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/webinars")({
  component: WebinarsPage,
  head: () => ({ meta: [{ title: "Live Webinars — NebulaLearn" }, { name: "description", content: "Weekly live sessions with engineers from top companies." }] }),
});

function WebinarsPage() {
  const live = webinars.find((w) => w.status === "Live");
  const upcoming = webinars.filter((w) => w.status === "Upcoming");
  const replays = webinars.filter((w) => w.status === "Replay");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-16 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold">Live webinars</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Live sessions, real Q&A, lifetime replays.</p>
      </section>

      {live && (
        <section className="container mx-auto px-4 pb-10">
          <div className="glass rounded-3xl overflow-hidden grid lg:grid-cols-5">
            <div className="lg:col-span-3 aspect-video lg:aspect-auto bg-black relative grid place-items-center">
              <div className="absolute inset-0 gradient-hero opacity-90" />
              <div className="relative text-center">
                <div className="grid h-20 w-20 mx-auto place-items-center rounded-full gradient-primary shadow-glow cursor-pointer hover:scale-105 transition">
                  <Play className="h-8 w-8 text-primary-foreground ml-1" />
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-destructive bg-destructive/20 border border-destructive/30 rounded-full px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" /> LIVE · {live.attendees.toLocaleString()} watching
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 p-8 flex flex-col">
              <Badge variant="outline" className="self-start mb-3 bg-destructive/20 text-destructive border-destructive/30"><Radio className="mr-1 h-3 w-3" /> Live now</Badge>
              <h2 className="text-2xl font-display font-bold">{live.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{live.speaker} · {live.role}</p>
              <p className="mt-4 text-sm text-muted-foreground flex-1">Join the live discussion, ask questions in chat, and get the recording afterwards.</p>
              <Button className="mt-6 gradient-primary shadow-glow">Join live stream</Button>
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-5">Upcoming</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcoming.map((w) => (
            <article key={w.slug} className="glass rounded-2xl p-6">
              <Badge variant="outline" className="mb-3">{w.topic}</Badge>
              <h3 className="font-display font-semibold text-lg">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.speaker} · {w.role}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {w.startsAt}</span>
                <span>{w.durationMin}min</span>
              </div>
              <Button variant="outline" className="mt-4 w-full">Set reminder</Button>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-5">Replays</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {replays.map((w) => (
            <article key={w.slug} className="glass rounded-2xl p-6 hover:border-primary/40 transition">
              <Badge variant="secondary" className="mb-3">{w.topic}</Badge>
              <h3 className="font-display font-semibold text-lg">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.speaker}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {w.attendees.toLocaleString()} watched</span>
                <span>{w.durationMin}min</span>
              </div>
              <Button variant="outline" className="mt-4 w-full"><Play className="mr-1 h-3 w-3" /> Watch replay</Button>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

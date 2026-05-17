import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courses, competitions, webinars } from "@/lib/catalog";
import { ArrowRight, Trophy, Radio, GraduationCap, Cloud, Github, Users, Sparkles, Play, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "NebulaLearn — Learn, compete, and ship" },
      { name: "description", content: "All-in-one platform for courses, hackathons, live webinars, cloud drive, and project showcases." },
    ],
  }),
});

const stats = [
  { v: "1.2M+", l: "Learners" },
  { v: "320+", l: "Courses" },
  { v: "85", l: "Live events / mo" },
  { v: "$2.4M", l: "Prizes awarded" },
];

const features = [
  { icon: GraduationCap, title: "Structured learning paths", text: "Beginner-to-pro tracks across AI, cybersecurity, data, and cloud — built with industry mentors." },
  { icon: Trophy, title: "Hackathons & challenges", text: "Compete with thousands of builders. Real prizes, real recruiters, real impact." },
  { icon: Radio, title: "Live webinars", text: "Weekly sessions with engineers from Anthropic, AWS, Linear, and more. Q&A, replays, certificates." },
  { icon: Cloud, title: "Personal cloud drive", text: "Store project files, notebooks, and submissions. Real-time sync across devices." },
  { icon: Github, title: "Public project gallery", text: "Pull your GitHub repos and showcase your work to the entire community." },
  { icon: Zap, title: "Skill wallet", text: "Earn verifiable credentials as you complete courses and competitions." },
];

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="container relative mx-auto px-4 pt-20 pb-28 text-center max-w-5xl">
          <Badge variant="outline" className="mb-6 border-primary/40 bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3 w-3" /> New: Live agents bootcamp starts June 14
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Learn the future.{" "}
            <span className="text-gradient">Build it tonight.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            One platform for courses, hackathons, live webinars, a personal cloud drive,
            and a public project showcase wired to your GitHub.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/courses"><Button size="lg" className="gradient-primary shadow-glow text-base h-12 px-7">Explore courses <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/competitions"><Button size="lg" variant="outline" className="text-base h-12 px-7 border-border/80">Join a hackathon</Button></Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.l} className="glass rounded-xl p-5">
                <div className="text-2xl md:text-3xl font-display font-bold text-gradient">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Everything a modern learner needs</h2>
          <p className="mt-3 text-muted-foreground">Inspired by Cyberkarta, Dicoding, LabLab, 365 Data Science and beyond — unified into one home.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl gradient-primary">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING COURSES */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Trending courses</h2>
            <p className="text-muted-foreground mt-1">Hand-picked by our learning team</p>
          </div>
          <Link to="/courses" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.slice(0, 4).map((c) => (
            <div key={c.slug} className="glass rounded-2xl p-5 hover:border-primary/40 transition group">
              {c.tag && <Badge className="mb-3 gradient-accent text-accent-foreground border-0">{c.tag}</Badge>}
              <div className="text-xs text-muted-foreground">{c.category}</div>
              <h3 className="font-display font-semibold text-lg mt-1 group-hover:text-gradient">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{c.hours}h · {c.level}</span>
                <span>★ {c.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPETITIONS + LIVE */}
      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <Trophy className="h-8 w-8 text-accent" />
          <h3 className="mt-4 text-2xl font-bold">Compete in live hackathons</h3>
          <p className="mt-2 text-muted-foreground">Inspired by LabLab.AI and Reply Challenges — teams, leaderboards, prize pools.</p>
          <div className="mt-6 space-y-3">
            {competitions.slice(0, 3).map((c) => (
              <Link key={c.slug} to="/competitions" className="flex items-center justify-between rounded-xl border border-border/60 p-3 hover:bg-surface">
                <div>
                  <div className="font-medium text-sm">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.host} · <Users className="inline h-3 w-3" /> {c.participants.toLocaleString()}</div>
                </div>
                <Badge variant="outline">{c.prize}</Badge>
              </Link>
            ))}
          </div>
          <Link to="/competitions"><Button className="mt-6 gradient-primary">Browse hackathons</Button></Link>
        </div>

        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
          <div className="flex items-center gap-2">
            <Radio className="h-8 w-8 text-accent" />
            <span className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" /> LIVE NOW
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold">{webinars[0].title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{webinars[0].speaker} · {webinars[0].role}</p>
          <div className="mt-6 aspect-video rounded-xl gradient-card border border-border/60 grid place-items-center">
            <Play className="h-12 w-12 text-primary" />
          </div>
          <Link to="/webinars"><Button variant="outline" className="mt-6 w-full">All live webinars</Button></Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-60" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold">Start your learning galaxy</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Free to join. Sign up, save projects to your cloud drive, and showcase your GitHub work.</p>
            <Link to="/login"><Button size="lg" className="mt-8 gradient-primary shadow-glow h-12 px-8">Create your account <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

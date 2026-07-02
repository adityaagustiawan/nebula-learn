import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCoursesList } from "@/hooks/use-learning";
import { useLiveCompetitions, useLiveWebinars } from "@/hooks/use-live-catalog";
import { LiveFeed } from "@/components/learning/live-feed";
import { ArrowRight, Trophy, Radio, GraduationCap, Cloud, Github, Users, Sparkles, Play, Zap } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";

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
  const { courses } = useCoursesList();
  const competitions = useLiveCompetitions();
  const webinars = useLiveWebinars();
  const { theme, mounted } = useTheme();
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden gradient-hero"
      >
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="container relative mx-auto px-4 pt-20 pb-28 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Badge variant="outline" className="mb-6 border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="mr-1.5 h-3 w-3" /> New: Live agents bootcamp starts June 14
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Learn the future.{" "}
            <span className="text-gradient">
              {!mounted ? "Build it tonight." : theme === "dark" ? "Build it tonight." : "Build it sunny day."}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            One platform for courses, hackathons, live webinars, a personal cloud drive,
            and a public project showcase wired to your GitHub.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/courses"><Button size="lg" className="gradient-primary shadow-glow text-base h-12 px-7">Explore courses <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/competitions"><Button size="lg" variant="outline" className="text-base h-12 px-7 border-border/80">Join a hackathon</Button></Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                className="glass rounded-xl p-5"
              >
                <div className="text-2xl md:text-3xl font-display font-bold text-gradient">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FEATURES */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-24"
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Everything a modern learner needs</h2>
          <p className="mt-3 text-muted-foreground">Inspired by Cyberkarta, Dicoding, LabLab, 365 Data Science and beyond — unified into one home.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl gradient-primary">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* TRENDING COURSES */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Trending courses</h2>
            <p className="text-muted-foreground mt-1">Hand-picked by our learning team</p>
          </div>
          <Link to="/courses" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.slice(0, 4).map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Link to="/courses/$slug" params={{ slug: c.slug }} className="glass rounded-2xl p-5 hover:border-primary/40 transition group block">
                {c.tag && <Badge className="mb-3 gradient-accent text-accent-foreground border-0">{c.tag}</Badge>}
                <div className="text-xs text-muted-foreground">{c.category}</div>
                <h3 className="font-display font-semibold text-lg mt-1 group-hover:text-gradient">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.hours}h · {c.level}</span>
                  <span>★ {c.rating}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* COMPETITIONS + LIVE */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <Trophy className="h-8 w-8 text-accent" />
          <h3 className="mt-4 text-2xl font-bold">Compete in live hackathons</h3>
          <p className="mt-2 text-muted-foreground">Inspired by LabLab.AI and Reply Challenges — teams, leaderboards, prize pools.</p>
          <div className="mt-6 space-y-3">
            {competitions.slice(0, 3).map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              >
                <Link to="/competitions" className="flex items-center justify-between rounded-xl border border-border/60 p-3 hover:bg-surface">
                  <div>
                    <div className="font-medium text-sm">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.host} · <Users className="inline h-3 w-3" /> {c.participants.toLocaleString()}</div>
                  </div>
                  <Badge variant="outline">{c.prize}</Badge>
                </Link>
              </motion.div>
            ))}
          </div>
          <Link to="/competitions"><Button className="mt-6 gradient-primary">Browse hackathons</Button></Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
          <div className="flex items-center gap-2">
            <Radio className="h-8 w-8 text-accent" />
            <span className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" /> LIVE NOW
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold">{webinars[0].title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{webinars[0].speaker} · {webinars[0].role}</p>
          <motion.div
            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            className="mt-6 aspect-video rounded-xl gradient-card border border-border/60 grid place-items-center"
          >
            <Play className="h-12 w-12 text-primary" />
          </motion.div>
          <Link to="/webinars"><Button variant="outline" className="mt-6 w-full">All live webinars</Button></Link>
        </motion.div>
      </motion.section>

      {/* LIVE FEED */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-16 max-w-4xl"
      >
        <LiveFeed limit={6} />
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-24"
      >
        <motion.div
          whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          className="glass rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-hero opacity-60" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold">Start your learning galaxy</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Free to join. Sign up, save projects to your cloud drive, and showcase your GitHub work.</p>
            <Link to="/login"><Button size="lg" className="mt-8 gradient-primary shadow-glow h-12 px-8">Create your account <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </motion.div>
      </motion.section>

      <SiteFooter />
    </div>
  );
}

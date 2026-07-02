import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveFeed } from "@/components/learning/live-feed";
import { useCoursesList } from "@/hooks/use-learning";
import { Search, Clock, Star, Users } from "lucide-react";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
  head: () => ({ meta: [{ title: "Courses — NebulaLearn" }, { name: "description", content: "Browse AI, cybersecurity, data, cloud and web development courses." }] }),
});

const cats = ["All", "Artificial Intelligence", "Cybersecurity", "Data Science", "Cloud", "Web Dev"];

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const { courses, loading } = useCoursesList();

  const filtered = courses.filter((c) =>
    (cat === "All" || c.category === cat) &&
    (q === "" || c.title.toLowerCase().includes(q.toLowerCase()) || c.instructor.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-16 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold">Courses</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">320+ courses — enroll, track progress in real time, and learn module by module.</p>

        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses, instructors, topics…" className="pl-9 h-11" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-full text-sm border transition ${cat === c ? "gradient-primary border-transparent text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 grid lg:grid-cols-[1fr_340px] gap-8">
        <div>
          {loading ? (
            <p className="text-muted-foreground text-center py-20">Loading courses…</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((c) => (
                <article key={c.slug} className="glass rounded-2xl p-6 flex flex-col hover:border-primary/40 transition group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.category}</span>
                    {c.tag && <Badge className="gradient-accent text-accent-foreground border-0">{c.tag}</Badge>}
                  </div>
                  <h3 className="mt-3 text-xl font-display font-semibold group-hover:text-gradient">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  <div className="mt-4 text-xs text-muted-foreground">By {c.instructor}</div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.hours}h</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning" /> {c.rating}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.enrolled.toLocaleString()}</span>
                  </div>
                  <Link to="/courses/$slug" params={{ slug: c.slug }} className="mt-5">
                    <Button className="w-full gradient-primary">
                      {c.externalUrl ? "View external course" : "View course"} · {c.level}
                    </Button>
                  </Link>
                </article>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && <p className="text-center text-muted-foreground py-20">No courses match your search.</p>}
        </div>
        <aside className="hidden lg:block">
          <LiveFeed limit={10} />
        </aside>
      </section>
      <SiteFooter />
    </div>
  );
}

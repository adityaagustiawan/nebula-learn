import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Github, Star, GitFork, ExternalLink, Search } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({ meta: [{ title: "Project Showcase — NebulaLearn" }, { name: "description", content: "Public project gallery powered by GitHub." }] }),
});

interface Profile { id: string; full_name: string | null; github_username: string | null; avatar_url: string | null; bio: string | null; }
interface Repo { id: number; name: string; description: string | null; html_url: string; stargazers_count: number; forks_count: number; language: string | null; updated_at: string; }

function ProjectsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("profiles").select("id, full_name, github_username, avatar_url, bio").not("github_username", "is", null).then(({ data }) => {
      setProfiles(data ?? []);
      if (data && data.length > 0) setSelected(data[0]);
    });
  }, []);

  useEffect(() => {
    if (!selected?.github_username) { setRepos([]); return; }
    setLoadingRepos(true);
    fetch(`https://api.github.com/users/${selected.github_username}/repos?sort=updated&per_page=24`)
      .then((r) => r.ok ? r.json() : [])
      .then((data: Repo[]) => setRepos(Array.isArray(data) ? data : []))
      .finally(() => setLoadingRepos(false));
  }, [selected]);

  const visible = profiles.filter((p) =>
    !q || (p.full_name?.toLowerCase().includes(q.toLowerCase()) || p.github_username?.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-16 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3"><Github className="h-9 w-9" /> Project showcase</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Public projects from our learners — pulled directly from GitHub. <Link to="/dashboard" className="text-primary hover:underline">Connect your GitHub →</Link></p>
      </section>

      {profiles.length === 0 ? (
        <section className="container mx-auto px-4 py-16">
          <div className="glass rounded-2xl p-16 text-center max-w-xl mx-auto">
            <Github className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-2">Be the first! Link your GitHub username in your dashboard and your repos will appear here for everyone to see.</p>
            <Link to="/dashboard"><Button className="mt-6 gradient-primary">Connect GitHub</Button></Link>
          </div>
        </section>
      ) : (
        <section className="container mx-auto px-4 pb-16 grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search builders…" className="pl-9" />
            </div>
            <div className="space-y-2">
              {visible.map((p) => (
                <button key={p.id} onClick={() => setSelected(p)} className={`w-full text-left glass rounded-xl p-3 flex items-center gap-3 transition ${selected?.id === p.id ? "border-primary/60" : "hover:border-border"}`}>
                  <div className="h-9 w-9 rounded-full gradient-primary grid place-items-center text-sm font-semibold text-primary-foreground overflow-hidden">
                    {p.avatar_url ? <img src={p.avatar_url} alt="" className="h-full w-full object-cover" /> : (p.full_name?.[0] ?? "?")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{p.full_name ?? "Anonymous"}</div>
                    <div className="text-xs text-muted-foreground truncate">@{p.github_username}</div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <div>
            {selected && (
              <div className="glass rounded-2xl p-6 mb-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full gradient-primary grid place-items-center text-lg font-semibold text-primary-foreground overflow-hidden">
                    {selected.avatar_url ? <img src={selected.avatar_url} alt="" className="h-full w-full object-cover" /> : (selected.full_name?.[0] ?? "?")}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold">{selected.full_name}</h2>
                    <a href={`https://github.com/${selected.github_username}`} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">@{selected.github_username} ↗</a>
                  </div>
                </div>
                {selected.bio && <p className="mt-3 text-sm text-muted-foreground">{selected.bio}</p>}
              </div>
            )}

            {loadingRepos ? (
              <p className="text-muted-foreground text-center py-12">Loading repos…</p>
            ) : repos.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No public repos found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {repos.map((r) => (
                  <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer" className="glass rounded-2xl p-5 hover:border-primary/40 transition group">
                    <div className="flex items-start justify-between">
                      <h3 className="font-display font-semibold group-hover:text-gradient">{r.name}</h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {r.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      {r.language && <Badge variant="secondary" className="text-xs">{r.language}</Badge>}
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {r.stargazers_count}</span>
                      <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {r.forks_count}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      <SiteFooter />
    </div>
  );
}

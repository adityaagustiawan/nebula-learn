import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Github, Cloud, BookOpen, Trophy, Save } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — NebulaLearn" }] }),
});

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ full_name: "", github_username: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, github_username, bio").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile({ full_name: data.full_name ?? "", github_username: data.github_username ?? "", bio: data.bio ?? "" });
    });
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const handle = profile.github_username.trim().replace(/^@/, "").replace(/^https?:\/\/github\.com\//, "") || null;
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name || null, github_username: handle, bio: profile.bio || null, updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile saved");
  }

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  const tiles = [
    { to: "/courses", icon: BookOpen, title: "Continue learning", text: "Pick up where you left off." },
    { to: "/competitions", icon: Trophy, title: "Active challenges", text: "Join an open hackathon." },
    { to: "/drive", icon: Cloud, title: "Cloud drive", text: "Your synced project files." },
    { to: "/projects", icon: Github, title: "Project showcase", text: "Your public repos." },
  ] as const;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-16 pb-8 max-w-5xl">
        <h1 className="text-4xl font-bold">Welcome back, <span className="text-gradient">{profile.full_name || user.email?.split("@")[0]}</span></h1>
        <p className="mt-2 text-muted-foreground">Your learning command center.</p>
      </section>

      <section className="container mx-auto px-4 pb-10 max-w-5xl grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="glass rounded-2xl p-5 hover:border-primary/40 transition group">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary mb-3"><t.icon className="h-5 w-5 text-primary-foreground" /></div>
            <div className="font-display font-semibold group-hover:text-gradient">{t.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{t.text}</div>
          </Link>
        ))}
      </section>

      <section className="container mx-auto px-4 pb-16 max-w-2xl">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-xl">Profile & GitHub</h2>
          <p className="text-sm text-muted-foreground mt-1">Add your GitHub username to publish your public repos to the Project Showcase.</p>
          <div className="mt-6 space-y-4">
            <div><Label>Full name</Label><Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
            <div>
              <Label className="flex items-center gap-2"><Github className="h-4 w-4" /> GitHub username</Label>
              <Input placeholder="e.g. torvalds" value={profile.github_username} onChange={(e) => setProfile({ ...profile, github_username: e.target.value })} />
              <p className="text-xs text-muted-foreground mt-1">Your public repos will be fetched and shown in the showcase.</p>
            </div>
            <div><Label>Bio</Label><Textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
            <Button onClick={save} disabled={saving} className="gradient-primary"><Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save profile"}</Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

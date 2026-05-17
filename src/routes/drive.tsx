import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, File as FileIcon, Trash2, Download, Cloud, HardDrive } from "lucide-react";

export const Route = createFileRoute("/drive")({
  component: DrivePage,
  head: () => ({ meta: [{ title: "Cloud Drive — NebulaLearn" }, { name: "description", content: "Your personal cloud drive — real-time syncing across devices." }] }),
});

interface FileRow { id: string; name: string; size: number; mime_type: string | null; storage_path: string; created_at: string; }

function fmt(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function DrivePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.from("user_files").select("*").order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) toast.error(error.message); else setFiles(data ?? []);
    })();

    const channel = supabase.channel("user_files_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_files", filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "INSERT") setFiles((prev) => [payload.new as FileRow, ...prev]);
        else if (payload.eventType === "DELETE") setFiles((prev) => prev.filter((f) => f.id !== (payload.old as FileRow).id));
      })
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(channel); };
  }, [user]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !e.target.files?.length) return;
    setUploading(true);
    for (const file of Array.from(e.target.files)) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("user-drive").upload(path, file);
      if (upErr) { toast.error(upErr.message); continue; }
      const { error: dbErr } = await supabase.from("user_files").insert({
        user_id: user.id, name: file.name, size: file.size, mime_type: file.type, storage_path: path,
      });
      if (dbErr) toast.error(dbErr.message);
    }
    setUploading(false);
    e.target.value = "";
    toast.success("Uploaded");
  }

  async function remove(f: FileRow) {
    await supabase.storage.from("user-drive").remove([f.storage_path]);
    const { error } = await supabase.from("user_files").delete().eq("id", f.id);
    if (error) toast.error(error.message);
  }

  async function download(f: FileRow) {
    const { data, error } = await supabase.storage.from("user-drive").createSignedUrl(f.storage_path, 60);
    if (error) toast.error(error.message); else window.open(data.signedUrl, "_blank");
  }

  const visible = files.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
  const total = files.reduce((a, f) => a + f.size, 0);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-16 pb-8 max-w-6xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3"><Cloud className="h-9 w-9 text-primary" /> Cloud Drive</h1>
            <p className="mt-2 text-muted-foreground">Real-time syncing across all your devices. <Link to="/projects" className="text-primary hover:underline">→ Show projects publicly</Link></p>
          </div>
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
            <HardDrive className="h-5 w-5 text-accent" />
            <div>
              <div className="text-sm font-medium">{files.length} files</div>
              <div className="text-xs text-muted-foreground">{fmt(total)} used</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <Input placeholder="Search files…" value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 h-11" />
          <label className="inline-flex">
            <input type="file" multiple className="hidden" onChange={onUpload} disabled={uploading} />
            <Button asChild disabled={uploading} className="gradient-primary shadow-glow h-11 px-6 cursor-pointer">
              <span><Upload className="mr-2 h-4 w-4" /> {uploading ? "Uploading…" : "Upload files"}</span>
            </Button>
          </label>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 max-w-6xl">
        {visible.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <Cloud className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-display text-lg">Your drive is empty</h3>
            <p className="text-sm text-muted-foreground mt-2">Upload your first file to get started.</p>
          </div>
        ) : (
          <div className="glass rounded-2xl divide-y divide-border/60 overflow-hidden">
            {visible.map((f) => (
              <div key={f.id} className="flex items-center gap-4 p-4 hover:bg-surface transition">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><FileIcon className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{fmt(f.size)} · {new Date(f.created_at).toLocaleString()}</div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => download(f)}><Download className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(f)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}

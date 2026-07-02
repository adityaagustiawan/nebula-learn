import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — NebulaLearn" }] }),
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) navigate({ to: "/dashboard" }); }, [user, navigate]);

  function demoLogin(role: "admin" | "mahasiswa") {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("demoAuth", JSON.stringify({
        email: role === "admin" ? "admin@nebulalearn.com" : "mahasiswa@nebulalearn.com",
        role,
        name: role === "admin" ? "Demo Admin" : "Adytia Agustiawan",
      }));
      toast.success(`Demo ${role === "admin" ? "Admin" : "Mahasiswa"} Login Successful!`);
      setLoading(false);
      navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
    }, 300);
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (email === "admin@nebulalearn.com" && pw === "admin123") return demoLogin("admin");
    if (email === "mahasiswa@nebulalearn.com" && pw === "mahasiswa123") return demoLogin("mahasiswa");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) toast.error(error.message);
      else { toast.success("Welcome back"); navigate({ to: "/dashboard" }); }
    } catch (e) {
      toast.error("Supabase connection failed. Use demo credentials.");
    }
    setLoading(false);
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password: pw,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) toast.error(error.message);
      else toast.success("Check your email to confirm your account.");
    } catch (e) {
      toast.error("Supabase connection failed. Use demo credentials.");
    }
    setLoading(false);
  }

  async function google() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/dashboard" },
      });
      if (error) { toast.error(error.message); setLoading(false); }
    } catch (e) {
      toast.error("Supabase connection failed. Use demo credentials.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-16 grid place-items-center">
        <div className="w-full max-w-md glass rounded-3xl p-8">
          <h1 className="text-3xl font-bold text-center">Welcome to <span className="text-gradient">NebulaLearn</span></h1>
          <p className="text-center text-sm text-muted-foreground mt-2">Sign in to access your drive, projects, and progress.</p>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-300 mb-3 font-semibold">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => demoLogin("admin")} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9">
                Admin Demo
              </Button>
              <Button onClick={() => demoLogin("mahasiswa")} disabled={loading} variant="outline" className="text-xs h-9">
                Mahasiswa Demo
              </Button>
            </div>
            <div className="mt-2 text-[10px] text-blue-200/60 space-y-0.5">
              <p>Admin: admin@nebulalearn.com / admin123</p>
              <p>Mahasiswa: mahasiswa@nebulalearn.com / mahasiswa123</p>
            </div>
          </div>

          <Button onClick={google} disabled={loading} variant="outline" className="mt-6 w-full h-11">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1H12v3.2h5.35c-.23 1.25-1.5 3.65-5.35 3.65-3.22 0-5.85-2.66-5.85-5.95s2.63-5.95 5.85-5.95c1.83 0 3.06.78 3.76 1.45l2.56-2.48C16.79 3.6 14.6 2.6 12 2.6 6.95 2.6 2.85 6.7 2.85 11.75S6.95 20.9 12 20.9c6.93 0 9.45-4.85 9.45-7.4 0-.5-.05-.88-.1-1.4z" /></svg>
            Continue with Google
          </Button>
          <div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">or</span><div className="h-px flex-1 bg-border" /></div>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Sign up</TabsTrigger></TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-3 mt-4">
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} /></div>
                <Button type="submit" disabled={loading} className="w-full gradient-primary">Sign in</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-3 mt-4">
                <div><Label>Full name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} /></div>
                <Button type="submit" disabled={loading} className="w-full gradient-primary">Create account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, Sun, Moon } from "lucide-react";
import { LiveSyncBadge } from "@/components/learning/live-sync-badge";
import { useState } from "react";
import { useTheme } from "@/contexts/theme-context";

const nav = [
  { to: "/courses", label: "Courses" },
  { to: "/competitions", label: "Competitions" },
  { to: "/webinars", label: "Live Webinars" },
  { to: "/projects", label: "Projects" },
  { to: "/drive", label: "Drive" },
  { to: "/talent", label: "Talent Hub" },
] as const;

export function SiteHeader() {
  const { user, signOut, profile } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="grid h-8 w-8 place-items-center rounded-lg gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span>Nebula<span className="text-gradient">Learn</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-surface" activeProps={{ className: "text-foreground bg-surface" }}>
              {n.label}
            </Link>
          ))}
          {profile?.role === "admin" && (
            <Link to="/admin" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-surface" activeProps={{ className: "text-foreground bg-surface" }}>
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          <LiveSyncBadge />
          {user ? (
            <>
              <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
              <Button size="sm" variant="outline" onClick={async () => { await signOut(); router.navigate({ to: "/" }); }}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/login"><Button size="sm" className="gradient-primary shadow-glow">Get started</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
          <div className="md:hidden border-t border-border/60 px-4 py-4 space-y-2 bg-background">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-surface">{n.label}</Link>
            ))}
            {profile?.role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-surface">Admin Dashboard</Link>
            )}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-surface">Dashboard</Link>
                <Button className="w-full" variant="outline" onClick={async () => { await signOut(); setOpen(false); router.navigate({ to: "/" }); }}>Sign out</Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}><Button className="w-full gradient-primary">Sign in</Button></Link>
            )}
          </div>
        )}
    </header>
  );
}

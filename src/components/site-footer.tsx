import { Link } from "@tanstack/react-router";
import { NebulaLogo } from "@/components/nebula-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <NebulaLogo size="sm" showText={true} asLink={false} />
          <p className="text-sm text-muted-foreground">Learn, build, and compete. The next-generation learning galaxy.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Learn</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/courses" className="hover:text-foreground">Courses</Link></li>
            <li><Link to="/webinars" className="hover:text-foreground">Live webinars</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Project showcase</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Compete</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/competitions" className="hover:text-foreground">Hackathons</Link></li>
            <li><Link to="/competitions" className="hover:text-foreground">Leaderboards</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/drive" className="hover:text-foreground">Cloud drive</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NebulaLearn. Built with Lovable.
      </div>
    </footer>
  );
}

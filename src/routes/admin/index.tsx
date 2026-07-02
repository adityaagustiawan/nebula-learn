import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Gift, Briefcase, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Mock Demo Data
const DEMO_STATS = {
  totalStudents: 42,
  pendingSkills: 5,
  pendingPortfolios: 3,
  pendingCertificates: 2,
  totalRewards: 8,
  totalOpportunities: 12,
};

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingSkills: 0,
    pendingPortfolios: 0,
    pendingCertificates: 0,
    totalRewards: 0,
    totalOpportunities: 0,
  });

  useEffect(() => {
    // Check for demo mode
    const demoAuth = localStorage.getItem("demoAuth");
    if (demoAuth) {
      setStats(DEMO_STATS);
      return;
    }
    
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: studentsCount },
        { count: skillsCount },
        { count: portfoliosCount },
        { count: certsCount },
        { count: rewardsCount },
        { count: oppsCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "mahasiswa"),
        supabase.from("skills").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("portfolios").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("certificates").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("rewards").select("*", { count: "exact", head: true }),
        supabase.from("opportunities").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalStudents: studentsCount || 0,
        pendingSkills: skillsCount || 0,
        pendingPortfolios: portfoliosCount || 0,
        pendingCertificates: certsCount || 0,
        totalRewards: rewardsCount || 0,
        totalOpportunities: oppsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this area</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the talent hub</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link to="/admin/students" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{stats.totalStudents}</CardTitle>
                    <CardDescription>Students</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/verification" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>
                      {stats.pendingSkills + stats.pendingPortfolios + stats.pendingCertificates}
                    </CardTitle>
                    <CardDescription>Pending Verifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats.pendingSkills > 0 && <Badge variant="outline">{stats.pendingSkills} Skills</Badge>}
                  {stats.pendingPortfolios > 0 && <Badge variant="outline">{stats.pendingPortfolios} Portfolios</Badge>}
                  {stats.pendingCertificates > 0 && <Badge variant="outline">{stats.pendingCertificates} Certificates</Badge>}
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/rewards" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Gift className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{stats.totalRewards}</CardTitle>
                    <CardDescription>Rewards</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/opportunities" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{stats.totalOpportunities}</CardTitle>
                    <CardDescription>Opportunities</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/talent/opportunities")({
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*, profiles!posted_by(full_name)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      internship: "Internship",
      job: "Job",
      project: "Project",
      community: "Community",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
          <p className="text-muted-foreground">Discover internships, jobs, and projects</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <Card key={opp.id} className="border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle>{opp.title}</CardTitle>
                        <CardDescription>Posted by {opp.profiles?.full_name || "Admin"}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{getTypeLabel(opp.type)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{opp.description}</p>
                  {opp.required_skills && opp.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {opp.required_skills.map((skill: string, i: number) => (
                        <Badge key={i} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {opportunities.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No opportunities available yet. Check back soon!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

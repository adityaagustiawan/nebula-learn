import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Award, Briefcase, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/talent/recommendations")({
  component: TalentRecommendations,
});

function TalentRecommendations() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Array<{
    icon: any;
    title: string;
    description: string;
    type: string;
  }>>([]);

  useEffect(() => {
    generateRecommendations();
  }, [profile]);

  const generateRecommendations = async () => {
    setLoading(true);
    const recs: typeof recommendations = [];

    // Sample rule-based recommendations
    if ((profile?.total_points ?? 0) === 0) {
      recs.push({
        icon: Award,
        title: "Add your first skill",
        description: "Submit a skill for verification to start earning points!",
        type: "skill",
      });
      recs.push({
        icon: Briefcase,
        title: "Showcase a project",
        description: "Add a personal project to your portfolio and earn points.",
        type: "portfolio",
      });
    } else if ((profile?.total_points ?? 0) < 10) {
      recs.push({
        icon: Trophy,
        title: "Get a certificate",
        description: "International certificates give you 10 points each!",
        type: "certificate",
      });
      recs.push({
        icon: Award,
        title: "Verify more skills",
        description: "Each verified skill adds 1 point to your total.",
        type: "skill",
      });
    } else {
      recs.push({
        icon: Briefcase,
        title: "Do an industry project",
        description: "Industry portfolio items give 8 points each!",
        type: "portfolio",
      });
      recs.push({
        icon: Trophy,
        title: "Join competitions",
        description: "Competitions are a great way to earn more points!",
        type: "competition",
      });
    }

    setRecommendations(recs);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">AI Recommendations</h1>
          </div>
          <p className="text-muted-foreground">Personalized suggestions to help you grow</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              return (
                <Card key={index} className="border-border/60 hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <CardTitle>{rec.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{rec.description}</p>
                    <Button className="w-full gradient-primary">Get Started</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

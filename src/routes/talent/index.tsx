import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Award, Trophy, Briefcase, Lightbulb, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/talent/")({
  component: TalentHub,
});

function TalentHub() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Talent Hub</h1>
          <p className="text-muted-foreground">Manage your skills, portfolio, certificates, and track your points!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link to="/talent/profile" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle>My Profile</CardTitle>
                </div>
                <CardDescription>Complete your talent profile</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Profile</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/talent/skills" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Skills</CardTitle>
                </div>
                <CardDescription>Add and verify your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Verification</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/talent/portfolios" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Portfolios</CardTitle>
                </div>
                <CardDescription>Showcase your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Portfolio</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/talent/certificates" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Certificates</CardTitle>
                </div>
                <CardDescription>Upload your certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Certification</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/talent/leaderboard" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Leaderboard</CardTitle>
                </div>
                <CardDescription>See top performers</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Ranking</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/talent/rewards" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle>Rewards</CardTitle>
                </div>
                <CardDescription>Redeem your points</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Rewards</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/talent/recommendations" className="group">
            <Card className="h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle>AI Recommendations</CardTitle>
                </div>
                <CardDescription>Personalized suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">AI</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Link to="/talent/opportunities">
          <Card className="border-border/60 hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <CardTitle>Opportunities</CardTitle>
              <CardDescription>Discover internships, jobs, and projects</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

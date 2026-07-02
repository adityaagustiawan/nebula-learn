import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

export const Route = createFileRoute("/talent/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, total_points")
        .order("total_points", { ascending: false })
        .limit(50);
      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-700" />;
      default:
        return <span className="text-lg font-bold w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top performers in the talent hub</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Top Talent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {leaderboard.map((profile, index) => (
                <div
                  key={profile.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="w-10 flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={profile.avatar_url || ""} />
                    <AvatarFallback>{(profile.full_name || "U").charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{profile.full_name || "Anonymous User"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gradient">{profile.total_points} pts</p>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No one on the leaderboard yet!
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Gift, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/talent/rewards")({
  component: RewardsPage,
});

function RewardsPage() {
  const { user, profile } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
    if (user) fetchClaimed();
  }, [user]);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase.from("rewards").select("*").eq("is_active", true);
      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimed = async () => {
    try {
      const { data, error } = await supabase.from("reward_claims").select("reward_id").eq("user_id", user!.id);
      if (error) throw error;
      setClaimed(new Set((data || []).map((c) => c.reward_id)));
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  const handleClaim = async (rewardId: string, requiredPoints: number) => {
    if (!user || !profile) return;
    if (profile.total_points < requiredPoints) {
      toast.error("Not enough points!");
      return;
    }
    try {
      const { error } = await supabase.from("reward_claims").insert({
        user_id: user.id,
        reward_id: rewardId,
        status: "claimed",
      });
      if (error) throw error;
      toast.success("Reward claimed successfully!");
      fetchClaimed();
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error("Failed to claim reward");
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Rewards</h1>
          <p className="text-muted-foreground">Redeem your points for awesome rewards! Your balance: <span className="font-bold text-gradient">{profile?.total_points || 0} pts</span></p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const canClaim = profile && profile.total_points >= reward.required_points && !claimed.has(reward.id);
              const alreadyClaimed = claimed.has(reward.id);
              return (
                <Card key={reward.id} className="border-border/60">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                        <Gift className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle>{reward.name}</CardTitle>
                        <CardDescription>{reward.required_points} points</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {reward.description && <CardContent><p className="text-muted-foreground">{reward.description}</p></CardContent>}
                  <CardFooter className="justify-between">
                    {alreadyClaimed ? (
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Claimed
                      </Badge>
                    ) : (
                      <Button
                        disabled={!canClaim}
                        onClick={() => handleClaim(reward.id, reward.required_points)}
                        className="gradient-primary"
                      >
                        {profile && profile.total_points < reward.required_points
                          ? `Need ${reward.required_points - profile.total_points} more pts`
                          : "Claim Reward"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
            {rewards.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No rewards available yet. Check back soon!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

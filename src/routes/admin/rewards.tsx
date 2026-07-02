import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Gift, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/rewards")({
  component: AdminRewards,
});

function AdminRewards() {
  const { user, profile } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newReward, setNewReward] = useState({ name: "", description: "", required_points: 0, is_active: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === "admin") {
      fetchRewards();
    }
  }, [profile]);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase.from("rewards").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const { error } = await supabase.from("rewards").insert({
        name: newReward.name,
        description: newReward.description,
        required_points: newReward.required_points,
        is_active: newReward.is_active,
      });
      if (error) throw error;
      toast.success("Reward added successfully!");
      setAddDialogOpen(false);
      setNewReward({ name: "", description: "", required_points: 0, is_active: true });
      fetchRewards();
    } catch (error) {
      console.error("Error adding reward:", error);
      toast.error("Failed to add reward");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("rewards").update({ is_active: !currentStatus }).eq("id", id);
      if (error) throw error;
      fetchRewards();
    } catch (error) {
      console.error("Error updating reward:", error);
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reward?")) return;
    try {
      const { error } = await supabase.from("rewards").delete().eq("id", id);
      if (error) throw error;
      toast.success("Reward deleted!");
      fetchRewards();
    } catch (error) {
      console.error("Error deleting reward:", error);
      toast.error("Failed to delete reward");
    }
  };

  if (profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Rewards</h1>
            <p className="text-muted-foreground">Manage available rewards</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Reward
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Reward</DialogTitle>
                <DialogDescription>Create a new reward for students</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddReward} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                    placeholder="Reward name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newReward.description}
                    onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                    placeholder="Reward description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="required_points">Required Points</Label>
                  <Input
                    id="required_points"
                    type="number"
                    value={newReward.required_points}
                    onChange={(e) => setNewReward({ ...newReward, required_points: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={newReward.is_active}
                    onCheckedChange={(v) => setNewReward({ ...newReward, is_active: v })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <Button type="submit" className="w-full">Add Reward</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id} className="border-border/60">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Gift className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{reward.name}</CardTitle>
                      <CardDescription>{reward.required_points} points</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {reward.description && <CardContent><p className="text-muted-foreground">{reward.description}</p></CardContent>}
                <CardFooter className="justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={reward.is_active}
                      onCheckedChange={() => handleToggleActive(reward.id, reward.is_active)}
                    />
                    <Label>{reward.is_active ? "Active" : "Inactive"}</Label>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteReward(reward.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {rewards.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No rewards yet. Add your first reward!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

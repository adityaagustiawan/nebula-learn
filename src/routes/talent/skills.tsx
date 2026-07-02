import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Award, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/talent/skills")({
  component: SkillsPage,
});

function SkillsPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ skill_name: "", evidence_url: "" });

  useEffect(() => {
    if (user) {
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const { error } = await supabase.from("skills").insert({
        user_id: user.id,
        skill_name: newSkill.skill_name,
        evidence_url: newSkill.evidence_url,
        status: "pending",
        points: 1,
      });
      if (error) throw error;
      toast.success("Skill submitted for verification!");
      setAddDialogOpen(false);
      setNewSkill({ skill_name: "", evidence_url: "" });
      fetchSkills();
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Skills</h1>
            <p className="text-muted-foreground">Add and verify your skills to earn points</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
                <DialogDescription>Add a skill and submit evidence for verification</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSkill} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="skill_name">Skill Name</Label>
                  <Input
                    id="skill_name"
                    value={newSkill.skill_name}
                    onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                    placeholder="e.g., JavaScript"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evidence_url">Evidence URL (Optional)</Label>
                  <Input
                    id="evidence_url"
                    value={newSkill.evidence_url}
                    onChange={(e) => setNewSkill({ ...newSkill, evidence_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <Button type="submit" className="w-full">Submit for Verification</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Award className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{skill.skill_name}</CardTitle>
                        <CardDescription>+{skill.points} points</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(skill.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {skill.evidence_url && (
                    <p className="text-sm text-muted-foreground truncate">
                      Evidence: <a href={skill.evidence_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{skill.evidence_url}</a>
                    </p>
                  )}
                  {skill.review_note && skill.status !== "pending" && (
                    <p className="text-sm text-muted-foreground mt-2">{skill.review_note}</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {skills.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No skills yet. Add your first skill!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

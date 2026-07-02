import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Briefcase, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/opportunities")({
  component: AdminOpportunities,
});

function AdminOpportunities() {
  const { user, profile } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    description: "",
    type: "internship",
    required_skills: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === "admin") {
      fetchOpportunities();
    }
  }, [profile]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const skills = newOpportunity.required_skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    try {
      const { error } = await supabase.from("opportunities").insert({
        title: newOpportunity.title,
        description: newOpportunity.description,
        type: newOpportunity.type,
        required_skills: skills,
        posted_by: user.id,
        is_active: newOpportunity.is_active,
      });
      if (error) throw error;
      toast.success("Opportunity added successfully!");
      setAddDialogOpen(false);
      setNewOpportunity({
        title: "",
        description: "",
        type: "internship",
        required_skills: "",
        is_active: true,
      });
      fetchOpportunities();
    } catch (error) {
      console.error("Error adding opportunity:", error);
      toast.error("Failed to add opportunity");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("opportunities")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      fetchOpportunities();
    } catch (error) {
      console.error("Error updating opportunity:", error);
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      const { error } = await supabase.from("opportunities").delete().eq("id", id);
      if (error) throw error;
      toast.success("Opportunity deleted!");
      fetchOpportunities();
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      toast.error("Failed to delete opportunity");
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
            <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
            <p className="text-muted-foreground">Manage available opportunities</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Opportunity</DialogTitle>
                <DialogDescription>Create a new opportunity for students</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddOpportunity} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newOpportunity.title}
                    onChange={(e) =>
                      setNewOpportunity({ ...newOpportunity, title: e.target.value })
                    }
                    placeholder="Opportunity title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newOpportunity.type}
                    onValueChange={(v) =>
                      setNewOpportunity({ ...newOpportunity, type: v })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOpportunity.description}
                    onChange={(e) =>
                      setNewOpportunity({ ...newOpportunity, description: e.target.value })
                    }
                    placeholder="Opportunity description"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="required_skills">Required Skills (comma separated)</Label>
                  <Input
                    id="required_skills"
                    value={newOpportunity.required_skills}
                    onChange={(e) =>
                      setNewOpportunity({ ...newOpportunity, required_skills: e.target.value })
                    }
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={newOpportunity.is_active}
                    onCheckedChange={(v) =>
                      setNewOpportunity({ ...newOpportunity, is_active: v })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <Button type="submit" className="w-full">Add Opportunity</Button>
              </form>
            </DialogContent>
          </Dialog>
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
                        <CardDescription>{getTypeLabel(opp.type)}</CardDescription>
                      </div>
                    </div>
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
                <CardFooter className="justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={opp.is_active}
                      onCheckedChange={() => handleToggleActive(opp.id, opp.is_active)}
                    />
                    <Label>{opp.is_active ? "Active" : "Inactive"}</Label>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteOpportunity(opp.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {opportunities.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No opportunities yet. Add your first opportunity!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

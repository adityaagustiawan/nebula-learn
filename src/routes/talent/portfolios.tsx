import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Briefcase, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/talent/portfolios")({
  component: PortfoliosPage,
});

function PortfoliosPage() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ type: "personal", title: "", description: "", evidence_url: "" });

  useEffect(() => {
    if (user) {
      fetchPortfolios();
    }
  }, [user]);

  const fetchPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const pointsMap = { personal: 2, freelance: 5, industri: 8 };
    const points = pointsMap[newPortfolio.type as keyof typeof pointsMap] || 2;
    try {
      const { error } = await supabase.from("portfolios").insert({
        user_id: user.id,
        type: newPortfolio.type,
        title: newPortfolio.title,
        description: newPortfolio.description,
        evidence_url: newPortfolio.evidence_url,
        status: "pending",
        points: points,
      });
      if (error) throw error;
      toast.success("Portfolio submitted for verification!");
      setAddDialogOpen(false);
      setNewPortfolio({ type: "personal", title: "", description: "", evidence_url: "" });
      fetchPortfolios();
    } catch (error) {
      console.error("Error adding portfolio:", error);
      toast.error("Failed to add portfolio");
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { personal: "Personal", freelance: "Freelance", industri: "Industry" };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Portfolios</h1>
            <p className="text-muted-foreground">Showcase your projects and earn points</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Portfolio</DialogTitle>
                <DialogDescription>Add a portfolio and submit for verification</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPortfolio} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={newPortfolio.type} onValueChange={(v) => setNewPortfolio({ ...newPortfolio, type: v })}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal (+2 points)</SelectItem>
                      <SelectItem value="freelance">Freelance (+5 points)</SelectItem>
                      <SelectItem value="industri">Industry (+8 points)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPortfolio.title}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    placeholder="Project title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPortfolio.description}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                    placeholder="Project description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evidence_url">Evidence URL (Optional)</Label>
                  <Input
                    id="evidence_url"
                    value={newPortfolio.evidence_url}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, evidence_url: e.target.value })}
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
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{portfolio.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <CardDescription>+{portfolio.points} points</CardDescription>
                          <Badge variant="outline">{getTypeLabel(portfolio.type)}</Badge>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(portfolio.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {portfolio.description && <p className="text-sm text-muted-foreground mb-2">{portfolio.description}</p>}
                  {portfolio.evidence_url && (
                    <p className="text-sm text-muted-foreground truncate">
                      Evidence: <a href={portfolio.evidence_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{portfolio.evidence_url}</a>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            {portfolios.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
              No portfolios yet. Add your first project!
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

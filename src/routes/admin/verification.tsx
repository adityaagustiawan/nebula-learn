import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Award, Briefcase, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/verification")({
  component: AdminVerification,
});

function AdminVerification() {
  const { user, profile } = useAuth();
  const [pendingSkills, setPendingSkills] = useState<any[]>([]);
  const [pendingPortfolios, setPendingPortfolios] = useState<any[]>([]);
  const [pendingCertificates, setPendingCertificates] = useState<any[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile?.role === "admin") {
      fetchPending();
    }
  }, [profile]);

  const fetchPending = async () => {
    try {
      const [skillsData, portfoliosData, certificatesData] = await Promise.all([
        supabase.from("skills").select("*, profiles!user_id(full_name)").eq("status", "pending"),
        supabase.from("portfolios").select("*, profiles!user_id(full_name)").eq("status", "pending"),
        supabase.from("certificates").select("*, profiles!user_id(full_name)").eq("status", "pending"),
      ]);
      if (skillsData.error) throw skillsData.error;
      if (portfoliosData.error) throw portfoliosData.error;
      if (certificatesData.error) throw certificatesData.error;
      setPendingSkills(skillsData.data || []);
      setPendingPortfolios(portfoliosData.data || []);
      setPendingCertificates(certificatesData.data || []);
    } catch (error) {
      console.error("Error fetching pending items:", error);
    }
  };

  const handleReview = async (
    type: "skills" | "portfolios" | "certificates",
    id: string,
    userId: string,
    status: "approved" | "rejected",
    points?: number
  ) => {
    if (!user) return;
    try {
      // Update item status
      const { error: updateError } = await supabase
        .from(type)
        .update({
          status,
          review_note: reviewNotes[id] || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (updateError) throw updateError;

      // If approved, add points transaction
      if (status === "approved" && points) {
        const { error: txError } = await supabase.from("points_transactions").insert({
          user_id: userId,
          source_type: type.slice(0, -1),
          source_id: id,
          points,
        });
        if (txError) throw txError;
      }

      toast.success(`Item ${status} successfully!`);
      fetchPending();
    } catch (error) {
      console.error("Error reviewing item:", error);
      toast.error("Failed to review item");
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
          <h1 className="text-3xl font-bold mb-2">Verification Queue</h1>
          <p className="text-muted-foreground">Review and approve/reject submissions</p>
        </div>

        <Tabs defaultValue="skills">
          <TabsList className="mb-6">
            <TabsTrigger value="skills">Skills ({pendingSkills.length})</TabsTrigger>
            <TabsTrigger value="portfolios">Portfolios ({pendingPortfolios.length})</TabsTrigger>
            <TabsTrigger value="certificates">Certificates ({pendingCertificates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="skills">
            <div className="space-y-4">
              {pendingSkills.map((skill) => (
                <Card key={skill.id} className="border-border/60">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle>{skill.skill_name}</CardTitle>
                          <CardDescription>Submitted by {skill.profiles?.full_name || "Unknown"} • +{skill.points} pts</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skill.evidence_url && (
                      <p className="text-sm text-muted-foreground">
                        Evidence: <a href={skill.evidence_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{skill.evidence_url}</a>
                      </p>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor={`note-${skill.id}`}>Review Note (Optional)</Label>
                      <Textarea
                        id={`note-${skill.id}`}
                        value={reviewNotes[skill.id] || ""}
                        onChange={(e) => setReviewNotes({ ...reviewNotes, [skill.id]: e.target.value })}
                        placeholder="Add a note..."
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReview("skills", skill.id, skill.user_id, "approved", skill.points)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReview("skills", skill.id, skill.user_id, "rejected")}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingSkills.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No pending skills to review</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolios">
            <div className="space-y-4">
              {pendingPortfolios.map((portfolio) => (
                <Card key={portfolio.id} className="border-border/60">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle>{portfolio.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <CardDescription>Submitted by {portfolio.profiles?.full_name || "Unknown"} • +{portfolio.points} pts</CardDescription>
                            <Badge variant="outline">{portfolio.type}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {portfolio.description && <p className="text-sm text-muted-foreground">{portfolio.description}</p>}
                    {portfolio.evidence_url && (
                      <p className="text-sm text-muted-foreground">
                        Evidence: <a href={portfolio.evidence_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{portfolio.evidence_url}</a>
                      </p>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor={`note-${portfolio.id}`}>Review Note (Optional)</Label>
                      <Textarea
                        id={`note-${portfolio.id}`}
                        value={reviewNotes[portfolio.id] || ""}
                        onChange={(e) => setReviewNotes({ ...reviewNotes, [portfolio.id]: e.target.value })}
                        placeholder="Add a note..."
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReview("portfolios", portfolio.id, portfolio.user_id, "approved", portfolio.points)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReview("portfolios", portfolio.id, portfolio.user_id, "rejected")}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingPortfolios.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No pending portfolios to review</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="certificates">
            <div className="space-y-4">
              {pendingCertificates.map((cert) => (
                <Card key={cert.id} className="border-border/60">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle>{cert.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <CardDescription>Submitted by {cert.profiles?.full_name || "Unknown"} • +{cert.points} pts</CardDescription>
                            <Badge variant="outline">{cert.level}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cert.evidence_url && (
                      <p className="text-sm text-muted-foreground">
                        Evidence: <a href={cert.evidence_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{cert.evidence_url}</a>
                      </p>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor={`note-${cert.id}`}>Review Note (Optional)</Label>
                      <Textarea
                        id={`note-${cert.id}`}
                        value={reviewNotes[cert.id] || ""}
                        onChange={(e) => setReviewNotes({ ...reviewNotes, [cert.id]: e.target.value })}
                        placeholder="Add a note..."
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReview("certificates", cert.id, cert.user_id, "approved", cert.points)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReview("certificates", cert.id, cert.user_id, "rejected")}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingCertificates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No pending certificates to review</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

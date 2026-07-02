import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trophy, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/talent/certificates")({
  component: CertificatesPage,
});

function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCertificate, setNewCertificate] = useState({ level: "local", title: "", evidence_url: "" });

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const pointsMap = { local: 1, regional: 3, nasional: 5, internasional: 10 };
    const points = pointsMap[newCertificate.level as keyof typeof pointsMap] || 1;
    try {
      const { error } = await supabase.from("certificates").insert({
        user_id: user.id,
        level: newCertificate.level,
        title: newCertificate.title,
        evidence_url: newCertificate.evidence_url,
        status: "pending",
        points: points,
      });
      if (error) throw error;
      toast.success("Certificate submitted for verification!");
      setAddDialogOpen(false);
      setNewCertificate({ level: "local", title: "", evidence_url: "" });
      fetchCertificates();
    } catch (error) {
      console.error("Error adding certificate:", error);
      toast.error("Failed to add certificate");
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

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = { local: "Local (+1)", regional: "Regional (+3)", nasional: "National (+5)", internasional: "International (+10)" };
    return labels[level] || level;
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
            <p className="text-muted-foreground">Upload your certificates and earn points</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Certificate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Certificate</DialogTitle>
                <DialogDescription>Upload a certificate and submit for verification</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCertificate} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select value={newCertificate.level} onValueChange={(v) => setNewCertificate({ ...newCertificate, level: v })}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local (+1 point)</SelectItem>
                      <SelectItem value="regional">Regional (+3 points)</SelectItem>
                      <SelectItem value="nasional">National (+5 points)</SelectItem>
                      <SelectItem value="internasional">International (+10 points)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newCertificate.title}
                    onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                    placeholder="Certificate title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evidence_url">Evidence URL</Label>
                  <Input
                    id="evidence_url"
                    value={newCertificate.evidence_url}
                    onChange={(e) => setNewCertificate({ ...newCertificate, evidence_url: e.target.value })}
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
            {certificates.map((cert) => (
              <Card key={cert.id} className="border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{cert.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <CardDescription>+{cert.points} points</CardDescription>
                          <Badge variant="outline">{getLevelLabel(cert.level).split(" (")[0]}</Badge>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(cert.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {cert.evidence_url && (
                    <p className="text-sm text-muted-foreground truncate">
                      Evidence: <a href={cert.evidence_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{cert.evidence_url}</a>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            {certificates.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
              No certificates yet. Add your first certificate!
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

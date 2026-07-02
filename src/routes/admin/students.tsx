import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

// Mock Demo Students
const DEMO_STUDENTS = [
  { id: "1", full_name: "Adytia Agustiawan", email: "adytia@example.com", major: "Teknik Informatika", total_points: 1250 },
  { id: "2", full_name: "Budi Santoso", email: "budi@example.com", major: "Sistem Informasi", total_points: 980 },
  { id: "3", full_name: "Citra Dewi", email: "citra@example.com", major: "Teknik Informatika", total_points: 875 },
  { id: "4", full_name: "Dimas Pratama", email: "dimas@example.com", major: "Teknik Komputer", total_points: 750 },
  { id: "5", full_name: "Eka Putri", email: "eka@example.com", major: "Sistem Informasi", total_points: 620 },
];

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

function AdminStudents() {
  const { profile, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check demo mode first
    const demoAuth = localStorage.getItem("demoAuth");
    if (demoAuth) {
      setStudents(DEMO_STUDENTS);
      setLoading(false);
      return;
    }

    if (profile?.role === "admin") {
      fetchStudents();
    }
  }, [profile]);

  const fetchStudents = async () => {
    try {
      let query = supabase.from("profiles").select("*").eq("role", "mahasiswa").order("total_points", { ascending: false });
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,major.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const demoAuth = localStorage.getItem("demoAuth");
    if (demoAuth) {
      const filtered = DEMO_STUDENTS.filter(s => 
        s.full_name.toLowerCase().includes(search.toLowerCase()) || 
        s.email.toLowerCase().includes(search.toLowerCase()) || 
        s.major.toLowerCase().includes(search.toLowerCase())
      );
      setStudents(filtered);
      return;
    }
    fetchStudents();
  }, [search]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Students</h1>
          <p className="text-muted-foreground">Manage and view all students</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or major..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface transition-colors"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={student.avatar_url || ""} />
                      <AvatarFallback>{(student.full_name || "U").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{student.full_name || "Anonymous User"}</p>
                      <p className="text-sm text-muted-foreground">{student.email || ""} • {student.major || "No major"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gradient">{student.total_points} pts</p>
                    </div>
                  </div>
                ))}
                {students.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">No students found</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

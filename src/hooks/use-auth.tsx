import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// Demo Auth Types
interface DemoUser {
  id: string;
  email: string;
  user_metadata: { full_name?: string };
}

interface DemoProfile {
  id: string;
  role: "admin" | "mahasiswa";
  full_name: string;
  email: string;
  total_points: number;
}

interface AuthCtx {
  user: User | DemoUser | null;
  session: Session | null;
  profile: Tables<"profiles"> | DemoProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({ user: null, session: null, profile: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | DemoProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (error && error.code === "PGRST116") {
        // Profile doesn't exist, create it
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({ id: userId, role: "mahasiswa", total_points: 0 })
          .select("*")
          .single();
        if (!insertError) setProfile(newProfile);
      } else if (!error) {
        setProfile(data);
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
    }
  };

  useEffect(() => {
    // First check for demo auth
    const demoAuthStr = localStorage.getItem("demoAuth");
    if (demoAuthStr) {
      const demoAuth = JSON.parse(demoAuthStr);
      setProfile({
        id: "demo-admin-123",
        role: demoAuth.role,
        full_name: demoAuth.name,
        email: demoAuth.email,
        total_points: 9999,
      } as DemoProfile);
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      if (s?.user) {
        await fetchProfile(s.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        await fetchProfile(data.session.user.id);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider value={{
      user: profile ? { id: "demo-user-123", email: (profile as any).email, user_metadata: { full_name: (profile as any).full_name } } as unknown as User : session?.user ?? null,
      session,
      profile,
      loading,
      signOut: async () => {
        localStorage.removeItem("demoAuth");
        await supabase.auth.signOut();
        setProfile(null);
        window.location.href = "/";
      },
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

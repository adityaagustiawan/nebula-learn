import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

interface DemoProfile {
  id: string;
  role: "admin" | "mahasiswa";
  full_name: string;
  email: string;
  total_points: number;
  avatar_url: string | null;
  bio: string | null;
  github_username: string | null;
  major: string | null;
}

interface AuthCtx {
  user: User | null;
  session: Session | null;
  profile: Tables<"profiles"> | DemoProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isDemo: boolean;
}

const Ctx = createContext<AuthCtx>({ user: null, session: null, profile: null, loading: true, signOut: async () => {}, isDemo: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | DemoProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (error && error.code === "PGRST116") {
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
    const demoAuthStr = localStorage.getItem("demoAuth");
    if (demoAuthStr) {
      const demoAuth = JSON.parse(demoAuthStr);
      setIsDemo(true);
      setProfile({
        id: demoAuth.role === "admin" ? "demo-admin-123" : "demo-mahasiswa-123",
        role: demoAuth.role,
        full_name: demoAuth.name,
        email: demoAuth.email,
        total_points: demoAuth.role === "admin" ? 9999 : 50,
        avatar_url: null,
        bio: demoAuth.role === "admin" ? "Platform Administrator" : "Mahasiswa at Universitas Amikom Yogyakarta",
        github_username: null,
        major: demoAuth.role === "admin" ? "Administration" : "Information Technology",
      } as DemoProfile);
      setLoading(false);
      return;
    }

    try {
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
    } catch (e) {
      console.error("Supabase auth error:", e);
      setLoading(false);
    }
  }, []);

  const demoUser = profile && isDemo ? {
    id: (profile as DemoProfile).id,
    email: (profile as DemoProfile).email,
    user_metadata: { full_name: (profile as DemoProfile).full_name },
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as unknown as User : null;

  return (
    <Ctx.Provider value={{
      user: isDemo ? demoUser : (session?.user ?? null),
      session: isDemo ? null : session,
      profile,
      loading,
      isDemo,
      signOut: async () => {
        localStorage.removeItem("demoAuth");
        setIsDemo(false);
        setProfile(null);
        setSession(null);
        try {
          await supabase.auth.signOut();
        } catch (e) {
          // Ignore Supabase errors during demo signout
        }
        window.location.href = "/";
      },
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

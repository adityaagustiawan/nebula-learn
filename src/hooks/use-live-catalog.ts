import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { competitions as staticCompetitions, webinars as staticWebinars, type Competition, type Webinar } from "@/lib/catalog";

export function useLiveCompetitions() {
  const [list, setList] = useState<Competition[]>(staticCompetitions);

  const load = useCallback(async () => {
    const { data } = await supabase.from("competitions").select("*").order("updated_at", { ascending: false });
    if (data?.length) {
      setList(
        data.map((r) => ({
          slug: r.slug,
          title: r.title,
          host: r.host,
          prize: r.prize,
          starts: r.starts_label,
          daysLeft: r.days_left,
          participants: r.participants,
          tags: r.tags ?? [],
          status: r.status as Competition["status"],
          externalUrl: r.external_url ?? staticCompetitions.find(c => c.slug === r.slug)?.externalUrl ?? "",
          imageUrl: r.image_url ?? "",
          competitionType: r.competition_type ?? "HACKATHON",
          description: r.description ?? "",
        })),
      );
    }
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("competitions_rt").on("postgres_changes", { event: "*", schema: "public", table: "competitions" }, load).subscribe();
    const poll = setInterval(load, 30_000);
    return () => { clearInterval(poll); supabase.removeChannel(ch); };
  }, [load]);

  return list;
}

export function useLiveWebinars() {
  const [list, setList] = useState<Webinar[]>(staticWebinars);

  const load = useCallback(async () => {
    const { data } = await supabase.from("webinars").select("*").order("updated_at", { ascending: false });
    if (data?.length) {
      setList(
        data.map((r) => ({
          slug: r.slug,
          title: r.title,
          speaker: r.speaker,
          role: r.role,
          startsAt: r.starts_at,
          durationMin: r.duration_min,
          attendees: r.attendees,
          status: r.status as Webinar["status"],
          topic: r.topic,
          externalUrl: r.external_url ?? staticWebinars.find(w => w.slug === r.slug)?.externalUrl ?? "",
        })),
      );
    }
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("webinars_rt").on("postgres_changes", { event: "*", schema: "public", table: "webinars" }, load).subscribe();
    const poll = setInterval(load, 30_000);
    return () => { clearInterval(poll); supabase.removeChannel(ch); };
  }, [load]);

  return list;
}

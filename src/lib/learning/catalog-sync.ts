import { supabase } from "@/integrations/supabase/client";
import { courses, competitions, webinars } from "@/lib/catalog";
import { buildLessonsForCourse } from "./lessons";

/** Seed Supabase catalog from static data (idempotent). */
export async function seedCatalogIfEmpty(): Promise<boolean> {
  const { count, error } = await supabase.from("courses").select("id", { count: "exact", head: true });
  if (error) return false;
  if (count && count > 0) return true;

  for (const c of courses) {
    const { data: courseRow, error: cErr } = await supabase
      .from("courses")
      .upsert(
        {
          slug: c.slug,
          title: c.title,
          category: c.category,
          level: c.level,
          hours: c.hours,
          rating: c.rating,
          enrolled_count: c.enrolled,
          instructor: c.instructor,
          description: c.description,
          tag: c.tag,
          external_url: c.externalUrl,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (cErr || !courseRow) continue;

    const lessons = buildLessonsForCourse(c.title, c.category);
    await supabase.from("course_lessons").upsert(
      lessons.map((l) => ({
        course_id: courseRow.id,
        slug: l.slug,
        title: l.title,
        content: l.content,
        lesson_type: l.lesson_type,
        duration_min: l.duration_min,
        sort_order: l.sort_order,
      })),
      { onConflict: "course_id,slug" },
    );
  }

  await supabase.from("competitions").upsert(
    competitions.map((c) => ({
      slug: c.slug,
      title: c.title,
      host: c.host,
      prize: c.prize,
      starts_label: c.starts,
      days_left: c.daysLeft,
      participants: c.participants,
      tags: c.tags,
      status: c.status,
      external_url: c.externalUrl,
    })),
    { onConflict: "slug" },
  );

  await supabase.from("webinars").upsert(
    webinars.map((w) => ({
      slug: w.slug,
      title: w.title,
      speaker: w.speaker,
      role: w.role,
      starts_at: w.startsAt,
      duration_min: w.durationMin,
      attendees: w.attendees,
      status: w.status,
      topic: w.topic,
      external_url: w.externalUrl,
    })),
    { onConflict: "slug" },
  );

  return true;
}

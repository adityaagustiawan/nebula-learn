import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { courses as staticCourses, type Course } from "@/lib/catalog";
import { buildLessonsForCourse, type Lesson } from "@/lib/learning/lessons";

const PROGRESS_KEY = "nebulalearn_local_progress";
const PENDING_ENROLL_KEY = "nebulalearn_pending_enroll";

interface LocalProgress {
  [courseSlug: string]: { lessonSlugs: string[]; percent: number };
}

function readLocalProgress(): LocalProgress {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}") as LocalProgress;
  } catch {
    return {};
  }
}

function writeLocalProgress(p: LocalProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

export interface DbCourse extends Course {
  id?: string;
}

export function useCoursesList() {
  const [list, setList] = useState<DbCourse[]>(staticCourses);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("courses").select("*").order("updated_at", { ascending: false });
    if (!error && data?.length) {
      setList(
        data.map((r) => ({
          slug: r.slug,
          title: r.title,
          category: r.category,
          level: r.level as Course["level"],
          hours: Number(r.hours),
          rating: Number(r.rating),
          enrolled: r.enrolled_count,
          instructor: r.instructor,
          description: r.description,
          tag: r.tag ?? "",
          externalUrl: r.external_url ?? "",
          id: r.id,
        })),
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("courses_rt").on("postgres_changes", { event: "*", schema: "public", table: "courses" }, load).subscribe();
    const poll = setInterval(load, 30_000);
    return () => {
      clearInterval(poll);
      supabase.removeChannel(ch);
    };
  }, [load]);

  return { courses: list, loading };
}

export function useCourseDetail(slug: string) {
  const [course, setCourse] = useState<DbCourse | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const staticC = staticCourses.find((c) => c.slug === slug);
      const { data: row } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();

      const c: DbCourse | null = row
        ? {
            id: row.id,
            slug: row.slug,
            title: row.title,
            category: row.category,
            level: row.level as Course["level"],
            hours: Number(row.hours),
            rating: Number(row.rating),
            enrolled: row.enrolled_count,
            instructor: row.instructor,
            description: row.description,
            tag: row.tag ?? "",
            externalUrl: row.external_url ?? staticC?.externalUrl ?? "",
          }
        : (staticC as DbCourse) ?? null;

      setCourse(c);

      if (row?.id) {
        const { data: ls } = await supabase
          .from("course_lessons")
          .select("*")
          .eq("course_id", row.id)
          .order("sort_order");
        if (ls?.length) {
          setLessons(
            ls.map((l) => ({
              slug: l.slug,
              title: l.title,
              content: l.content,
              lesson_type: l.lesson_type as Lesson["lesson_type"],
              duration_min: l.duration_min,
              sort_order: l.sort_order,
            })),
          );
        } else if (c) setLessons(buildLessonsForCourse(c.title, c.category));
      } else if (c) setLessons(buildLessonsForCourse(c.title, c.category));

      setLoading(false);
    })();
  }, [slug]);

  return { course, lessons, loading };
}

export function useEnrollment(courseSlug: string, courseId?: string) {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    const checkPending = () => {
      try {
        const pendingList = JSON.parse(localStorage.getItem(PENDING_ENROLL_KEY) ?? "[]") as string[];
        setPending(pendingList.includes(courseSlug));
      } catch {
        setPending(false);
      }
    };

    const applyLocal = () => {
      const local = readLocalProgress()[courseSlug];
      setEnrolled(!!local);
      setProgress(local?.percent ?? 0);
      setCompletedLessons(new Set(local?.lessonSlugs ?? []));
      checkPending();
    };
    if (!user) {
      applyLocal();
      return;
    }
    if (!courseId) {
      applyLocal();
      return;
    }

    const { data: en } = await supabase
      .from("enrollments")
      .select("progress_percent")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();
    setEnrolled(!!en);
    setProgress(Number(en?.progress_percent ?? 0));

    if (courseId) {
      const { data: prog } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("completed", true);
      const lessonIds = (prog ?? []).map((p) => p.lesson_id);
      if (lessonIds.length) {
        const { data: ls } = await supabase.from("course_lessons").select("slug").in("id", lessonIds);
        setCompletedLessons(new Set((ls ?? []).map((l) => l.slug)));
      }
    }
  }, [user, courseSlug, courseId]);

  useEffect(() => {
    refresh();
    if (!user || !courseId) return;
    const ch = supabase
      .channel(`enroll_${courseId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "enrollments", filter: `user_id=eq.${user.id}` }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "lesson_progress", filter: `user_id=eq.${user.id}` }, refresh)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, courseId, refresh]);

  const enroll = useCallback(async () => {
    if (!courseId && !courseSlug) return;
    if (!user) {
      const local = readLocalProgress();
      local[courseSlug] = { lessonSlugs: [], percent: 0 };
      writeLocalProgress(local);
      setEnrolled(true);
      return;
    }
    if (!courseId) return;
    await supabase.from("enrollments").upsert({ user_id: user.id, course_id: courseId }, { onConflict: "user_id,course_id" });
    await refresh();
  }, [user, courseSlug, courseId, refresh]);

  const startExternalEnroll = useCallback((url: string) => {
    try {
      const pendingList = JSON.parse(localStorage.getItem(PENDING_ENROLL_KEY) ?? "[]") as string[];
      if (!pendingList.includes(courseSlug)) {
        pendingList.push(courseSlug);
        localStorage.setItem(PENDING_ENROLL_KEY, JSON.stringify(pendingList));
      }
      setPending(true);
      window.open(url, "_blank");
    } catch {}
  }, [courseSlug]);

  const completeExternalEnroll = useCallback(async () => {
    try {
      const pendingList = JSON.parse(localStorage.getItem(PENDING_ENROLL_KEY) ?? "[]") as string[];
      const next = pendingList.filter(s => s !== courseSlug);
      localStorage.setItem(PENDING_ENROLL_KEY, JSON.stringify(next));
      setPending(false);
      await enroll();
    } catch {}
  }, [courseSlug, enroll]);

  const completeLesson = useCallback(async (lessonSlug: string, lessonId: string | undefined, totalLessons: number) => {
    const next = new Set(completedLessons);
    next.add(lessonSlug);
    const percent = Math.round((next.size / totalLessons) * 100);
    setCompletedLessons(next);
    setProgress(percent);

    if (!user) {
      const local = readLocalProgress();
      local[courseSlug] = { lessonSlugs: [...next], percent };
      writeLocalProgress(local);
      return;
    }
    if (lessonId) {
      await supabase.from("lesson_progress").upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
    }
    if (courseId) {
      await supabase.from("enrollments").update({ progress_percent: percent, updated_at: new Date().toISOString() }).eq("user_id", user.id).eq("course_id", courseId);
    }
  }, [user, courseSlug, courseId, completedLessons]);

  return { enrolled, pending, progress, completedLessons, enroll, startExternalEnroll, completeExternalEnroll, completeLesson, refresh };
}

export function useMyEnrollments() {
  const { user } = useAuth();
  const [items, setItems] = useState<Array<{ slug: string; title: string; progress: number }>>([]);

  useEffect(() => {
    if (!user) {
      const local = readLocalProgress();
      setItems(
        Object.entries(local).map(([slug, v]) => ({
          slug,
          title: staticCourses.find((c) => c.slug === slug)?.title ?? slug,
          progress: v.percent,
        })),
      );
      return;
    }
    (async () => {
      const { data: ens } = await supabase.from("enrollments").select("progress_percent, course_id").eq("user_id", user.id);
      if (!ens?.length) { setItems([]); return; }
      const { data: cs } = await supabase.from("courses").select("id, slug, title").in("id", ens.map((e) => e.course_id));
      const byId = new Map((cs ?? []).map((c) => [c.id, c]));
      setItems(
        ens.map((e) => {
          const c = byId.get(e.course_id);
          return { slug: c?.slug ?? "", title: c?.title ?? "", progress: Number(e.progress_percent) };
        }),
      );
    })();
  }, [user]);

  return items;
}

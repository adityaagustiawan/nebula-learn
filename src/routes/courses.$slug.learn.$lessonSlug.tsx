import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCourseDetail, useEnrollment } from "@/hooks/use-learning";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$slug/learn/$lessonSlug")({
  component: LearnPage,
});

function LearnPage() {
  const { slug, lessonSlug } = Route.useParams();
  const { course, lessons, loading } = useCourseDetail(slug);
  const { enrolled, progress, completedLessons, completeLesson, enroll } = useEnrollment(slug, course?.id);
  const [lessonDbId, setLessonDbId] = useState<string | undefined>();

  const idx = lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = lessons[idx];
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  useEffect(() => {
    if (!course?.id || !lessonSlug) return;
    supabase
      .from("course_lessons")
      .select("id")
      .eq("course_id", course.id)
      .eq("slug", lessonSlug)
      .maybeSingle()
      .then(({ data }) => setLessonDbId(data?.id));
  }, [course?.id, lessonSlug]);

  useEffect(() => {
    if (!loading && !enrolled) enroll();
  }, [loading, enrolled, enroll]);

  if (loading || !course || !lesson) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading lesson…</div>;
  }

  async function markComplete() {
    await completeLesson(lesson.slug, lessonDbId, lessons.length);
    toast.success("Lesson completed!");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="border-b border-border/60 bg-surface/50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/courses/$slug" params={{ slug }} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> {course.title}
          </Link>
          <div className="flex-1 max-w-md">
            <Progress value={progress} className="h-1.5" />
          </div>
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
          {lesson.lesson_type} · {lesson.duration_min} min
          {completedLessons.has(lesson.slug) && <CheckCircle2 className="h-4 w-4 text-success ml-2" />}
        </div>
        <h1 className="mt-2 text-3xl font-bold">{lesson.title}</h1>
        <article className="mt-8 prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {lesson.content}
        </article>

        <div className="mt-10 flex flex-wrap gap-3">
          {prev && (
            <Link to="/courses/$slug/learn/$lessonSlug" params={{ slug, lessonSlug: prev.slug }}>
              <Button variant="outline"><ChevronLeft className="mr-1 h-4 w-4" /> Previous</Button>
            </Link>
          )}
          {!completedLessons.has(lesson.slug) && (
            <Button className="gradient-primary" onClick={markComplete}>Mark complete</Button>
          )}
          {next ? (
            <Link to="/courses/$slug/learn/$lessonSlug" params={{ slug, lessonSlug: next.slug }}>
              <Button className="gradient-primary">Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          ) : (
            <Link to="/courses/$slug" params={{ slug }}>
              <Button variant="outline">Finish course</Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

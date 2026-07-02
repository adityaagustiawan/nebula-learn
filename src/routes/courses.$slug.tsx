import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCourseDetail, useEnrollment } from "@/hooks/use-learning";
import { useAuth } from "@/hooks/use-auth";
import { Clock, Star, Users, BookOpen, CheckCircle2, Play } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$slug")({
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const { course, lessons, loading } = useCourseDetail(slug);
  const { enrolled, pending, progress, completedLessons, enroll, startExternalEnroll, completeExternalEnroll } = useEnrollment(slug, course?.id);

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading course…</div>;
  if (!course) {
    return (
      <div className="min-h-screen grid place-items-center">
        Course not found. <Link to="/courses" className="text-primary ml-2">Back</Link>
      </div>
    );
  }

  async function handleEnroll() {
    if (course?.externalUrl) {
      startExternalEnroll(course.externalUrl);
      return;
    }
    if (!user) toast.info("Sign in to sync progress across devices, or continue as guest (saved locally).");
    await enroll();
    toast.success("Enrolled! Start learning.");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 pt-16 pb-10 max-w-4xl">
        <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary">← All courses</Link>
        {course.tag && <Badge className="mt-4 gradient-accent text-accent-foreground border-0">{course.tag}</Badge>}
        <h1 className="mt-3 text-4xl font-bold">{course.title}</h1>
        <p className="mt-3 text-muted-foreground">{course.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>{course.category}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.hours}h</span>
          <span className="flex items-center gap-1"><Star className="h-4 w-4 text-warning" /> {course.rating}</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.enrolled.toLocaleString()}</span>
          <span>By {course.instructor}</span>
        </div>

        {enrolled && !course.externalUrl && (
          <div className="mt-6 glass rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Your progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {enrolled ? (
            course.externalUrl ? (
              <Button variant="outline" className="border-success text-success hover:bg-success/10" disabled>Enrolled ✓</Button>
            ) : (
              <Link to="/courses/$slug/learn/$lessonSlug" params={{ slug, lessonSlug: lessons[0]?.slug ?? "01-intro" }}>
                <Button className="gradient-primary shadow-glow"><Play className="mr-2 h-4 w-4" /> Continue learning</Button>
              </Link>
            )
          ) : pending ? (
            <div className="flex flex-col gap-2">
              <Button className="gradient-primary" onClick={completeExternalEnroll}>Confirm I've Registered</Button>
              <p className="text-xs text-muted-foreground">We opened the registration page in a new tab. Click above once finished.</p>
            </div>
          ) : (
            <Button className="gradient-primary" onClick={handleEnroll}>
              {course.externalUrl ? "Enroll on external site" : `Enroll · ${course.level}`}
            </Button>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 max-w-4xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><BookOpen className="h-5 w-5" /> Curriculum ({lessons.length} modules)</h2>
        <div className="glass rounded-2xl divide-y divide-border/60">
          {lessons.map((l, i) => (
            <div key={l.slug} className="flex items-center gap-4 p-4">
              {completedLessons.has(l.slug) ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              ) : (
                <span className="text-xs text-muted-foreground w-5 text-center">{i + 1}</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium">{l.title}</div>
                <div className="text-xs text-muted-foreground capitalize">{l.lesson_type} · {l.duration_min} min</div>
              </div>
              {enrolled ? (
                <Link to="/courses/$slug/learn/$lessonSlug" params={{ slug, lessonSlug: l.slug }}>
                  <Button size="sm" variant="outline">Open</Button>
                </Link>
              ) : (
                <Button size="sm" variant="ghost" disabled>Locked</Button>
              )}
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

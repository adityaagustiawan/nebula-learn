export type LessonType = "video" | "reading" | "quiz" | "lab";

export interface Lesson {
  slug: string;
  title: string;
  content: string;
  lesson_type: LessonType;
  duration_min: number;
  sort_order: number;
}

const MODULES = [
  { slug: "01-intro", title: "Introduction & learning path", type: "video" as const, min: 12 },
  { slug: "02-fundamentals", title: "Core fundamentals", type: "reading" as const, min: 18 },
  { slug: "03-hands-on", title: "Hands-on lab", type: "lab" as const, min: 25 },
  { slug: "04-patterns", title: "Industry patterns & best practices", type: "reading" as const, min: 20 },
  { slug: "05-project", title: "Mini project build", type: "lab" as const, min: 35 },
  { slug: "06-quiz", title: "Knowledge check", type: "quiz" as const, min: 15 },
  { slug: "07-advanced", title: "Advanced topics", type: "video" as const, min: 22 },
  { slug: "08-capstone", title: "Capstone & next steps", type: "reading" as const, min: 14 },
];

export function buildLessonsForCourse(courseTitle: string, category: string): Lesson[] {
  return MODULES.map((m, i) => ({
    slug: m.slug,
    title: m.title,
    lesson_type: m.type,
    duration_min: m.min,
    sort_order: i + 1,
    content: generateLessonContent(courseTitle, category, m.title, m.type),
  }));
}

function generateLessonContent(course: string, category: string, moduleTitle: string, type: LessonType): string {
  const intro = `Welcome to **${moduleTitle}** in *${course}* (${category}).`;
  const body: Record<LessonType, string> = {
    video: `${intro}\n\nWatch the walkthrough, then try the checkpoint exercise. Topics update in real time as our catalog syncs with the latest IT learning trends.`,
    reading: `${intro}\n\nRead through the material, take notes, and mark complete when finished. New references from Dev.to, Hacker News, and community sources appear on your dashboard feed automatically.`,
    lab: `${intro}\n\nOpen your editor, follow the steps, and submit your work to your Cloud Drive. Peer projects appear in the showcase when you connect GitHub.`,
    quiz: `${intro}\n\nAnswer all questions to unlock the next module. Your progress syncs across devices in real time.`,
  };
  return body[type];
}

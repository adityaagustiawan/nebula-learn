-- Learning platform: courses, lessons, enrollments, live catalog, IT feed

-- COURSES
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  hours numeric not null default 0,
  rating numeric not null default 4.5,
  enrolled_count int not null default 0,
  instructor text not null,
  description text not null,
  tag text default '',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.courses enable row level security;
create policy "Courses are public" on public.courses for select using (true);

-- LESSONS
create table public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  content text not null,
  lesson_type text not null default 'reading' check (lesson_type in ('video', 'reading', 'quiz', 'lab')),
  duration_min int not null default 10,
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);
alter table public.course_lessons enable row level security;
create policy "Lessons are public" on public.course_lessons for select using (true);

-- ENROLLMENTS
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  progress_percent numeric not null default 0,
  last_lesson_id uuid references public.course_lessons(id) on delete set null,
  enrolled_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);
alter table public.enrollments enable row level security;
create policy "Users view own enrollments" on public.enrollments for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own enrollments" on public.enrollments for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own enrollments" on public.enrollments for update to authenticated using (auth.uid() = user_id);

-- LESSON PROGRESS
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
alter table public.lesson_progress enable row level security;
create policy "Users manage own lesson progress" on public.lesson_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- COMPETITIONS (live catalog)
create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  host text not null,
  prize text not null,
  starts_label text not null,
  days_left int not null default 0,
  participants int not null default 0,
  tags text[] not null default '{}',
  status text not null,
  updated_at timestamptz not null default now()
);
alter table public.competitions enable row level security;
create policy "Competitions are public" on public.competitions for select using (true);

-- WEBINARS
create table public.webinars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  speaker text not null,
  role text not null,
  starts_at text not null,
  duration_min int not null,
  attendees int not null default 0,
  status text not null,
  topic text not null,
  updated_at timestamptz not null default now()
);
alter table public.webinars enable row level security;
create policy "Webinars are public" on public.webinars for select using (true);

-- IT FEED (synced from public sources)
create table public.feed_items (
  id uuid primary key default gen_random_uuid(),
  external_id text not null,
  source text not null,
  title text not null,
  url text not null,
  summary text,
  category text not null default 'General',
  published_at timestamptz,
  synced_at timestamptz not null default now(),
  unique (source, external_id)
);
alter table public.feed_items enable row level security;
create policy "Feed is public" on public.feed_items for select using (true);

-- Realtime
alter publication supabase_realtime add table public.courses;
alter publication supabase_realtime add table public.course_lessons;
alter publication supabase_realtime add table public.enrollments;
alter publication supabase_realtime add table public.competitions;
alter publication supabase_realtime add table public.webinars;
alter publication supabase_realtime add table public.feed_items;

-- Bump enrolled_count on new enrollment
create or replace function public.increment_course_enrolled()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.courses set enrolled_count = enrolled_count + 1, updated_at = now()
  where id = new.course_id;
  return new;
end; $$;

create trigger on_enrollment_created
  after insert on public.enrollments
  for each row execute function public.increment_course_enrolled();

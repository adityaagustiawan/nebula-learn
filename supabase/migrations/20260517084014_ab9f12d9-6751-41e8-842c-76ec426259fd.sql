
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  github_username text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);
create policy "Users can insert their own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- USER FILES (Cloud Drive)
create table public.user_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  size bigint not null default 0,
  mime_type text,
  storage_path text not null,
  created_at timestamptz not null default now()
);
alter table public.user_files enable row level security;
create index user_files_user_id_idx on public.user_files(user_id, created_at desc);

create policy "Users view own files" on public.user_files
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own files" on public.user_files
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users delete own files" on public.user_files
  for delete to authenticated using (auth.uid() = user_id);

alter publication supabase_realtime add table public.user_files;

-- STORAGE BUCKET
insert into storage.buckets (id, name, public) values ('user-drive', 'user-drive', false)
  on conflict (id) do nothing;

create policy "Users read own drive objects" on storage.objects
  for select to authenticated
  using (bucket_id = 'user-drive' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users upload to own drive folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'user-drive' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users delete own drive objects" on storage.objects
  for delete to authenticated
  using (bucket_id = 'user-drive' and auth.uid()::text = (storage.foldername(name))[1]);

-- Writing Tracker — Supabase schema
-- Run this in the Supabase SQL editor to set up your database.

-- Projects
create table if not exists projects (
  id          text primary key,
  user_id     uuid references auth.users not null,
  name        text not null,
  color       text not null,
  target_words integer,
  created_at  text not null
);

-- Sessions
create table if not exists sessions (
  id          text primary key,
  user_id     uuid references auth.users not null,
  project_id  text not null,
  date        text not null,
  word_count  integer not null,
  duration    integer,
  notes       text,
  created_at  text not null
);

-- Row Level Security: each user can only see/edit their own rows
alter table projects enable row level security;
alter table sessions enable row level security;

create policy "Users manage own projects"
  on projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own sessions"
  on sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes for common query patterns
create index if not exists sessions_user_date on sessions (user_id, date);
create index if not exists sessions_user_project on sessions (user_id, project_id);

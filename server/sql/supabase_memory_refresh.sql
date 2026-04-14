-- Smart Scroll: Explain Back + Memory Refresh schema for Supabase/Postgres
-- Paste this entire file into the Supabase SQL Editor and run it once.
-- This version is intentionally app-compatible with the current frontend:
-- - text IDs are generated on the client
-- - anon/authenticated roles are allowed for quick development
-- If you later switch to real per-user auth, tighten the RLS policies.

begin;

create table if not exists public.explain_back_sessions (
    id text primary key,
    user_id uuid not null,
    content_id text not null,
    content_type text not null default 'generic',
    source_label text,
    source_title text,
    topic text not null,
    source_text text,
    explanation text,
    follow_up_summary text,
    overall_score numeric(4,2),
    confidence_level text,
    criteria_json jsonb not null default '{}'::jsonb,
    strengths_json jsonb not null default '[]'::jsonb,
    gaps_json jsonb not null default '[]'::jsonb,
    next_step text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.explain_back_questions (
    id text primary key,
    session_id text not null references public.explain_back_sessions(id) on delete cascade,
    question_text text not null,
    answer_text text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create table if not exists public.memory_refresh_groups (
    id text primary key,
    user_id uuid not null,
    name text not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.memory_refresh_group_items (
    id text primary key,
    group_id text not null references public.memory_refresh_groups(id) on delete cascade,
    session_id text not null references public.explain_back_sessions(id) on delete cascade,
    created_at timestamptz not null default now(),
    constraint memory_refresh_group_items_group_session_key unique (group_id, session_id)
);

create index if not exists explain_back_sessions_user_created_idx
    on public.explain_back_sessions (user_id, created_at desc);

create index if not exists explain_back_sessions_content_idx
    on public.explain_back_sessions (content_id, content_type);

create index if not exists explain_back_questions_session_sort_idx
    on public.explain_back_questions (session_id, sort_order);

create index if not exists memory_refresh_groups_user_created_idx
    on public.memory_refresh_groups (user_id, created_at desc);

create index if not exists memory_refresh_group_items_group_idx
    on public.memory_refresh_group_items (group_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_explain_back_sessions_updated_at on public.explain_back_sessions;
create trigger set_explain_back_sessions_updated_at
before update on public.explain_back_sessions
for each row
execute function public.set_updated_at();

drop trigger if exists set_memory_refresh_groups_updated_at on public.memory_refresh_groups;
create trigger set_memory_refresh_groups_updated_at
before update on public.memory_refresh_groups
for each row
execute function public.set_updated_at();

alter table public.explain_back_sessions enable row level security;
alter table public.explain_back_questions enable row level security;
alter table public.memory_refresh_groups enable row level security;
alter table public.memory_refresh_group_items enable row level security;

drop policy if exists "Explain sessions read" on public.explain_back_sessions;
create policy "Explain sessions read"
on public.explain_back_sessions
for select
to anon, authenticated
using (true);

drop policy if exists "Explain sessions write" on public.explain_back_sessions;
create policy "Explain sessions write"
on public.explain_back_sessions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Explain sessions update" on public.explain_back_sessions;
create policy "Explain sessions update"
on public.explain_back_sessions
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Explain questions read" on public.explain_back_questions;
create policy "Explain questions read"
on public.explain_back_questions
for select
to anon, authenticated
using (true);

drop policy if exists "Explain questions write" on public.explain_back_questions;
create policy "Explain questions write"
on public.explain_back_questions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Explain questions update" on public.explain_back_questions;
create policy "Explain questions update"
on public.explain_back_questions
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Memory groups read" on public.memory_refresh_groups;
create policy "Memory groups read"
on public.memory_refresh_groups
for select
to anon, authenticated
using (true);

drop policy if exists "Memory groups write" on public.memory_refresh_groups;
create policy "Memory groups write"
on public.memory_refresh_groups
for insert
to anon, authenticated
with check (true);

drop policy if exists "Memory groups update" on public.memory_refresh_groups;
create policy "Memory groups update"
on public.memory_refresh_groups
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Memory group items read" on public.memory_refresh_group_items;
create policy "Memory group items read"
on public.memory_refresh_group_items
for select
to anon, authenticated
using (true);

drop policy if exists "Memory group items write" on public.memory_refresh_group_items;
create policy "Memory group items write"
on public.memory_refresh_group_items
for insert
to anon, authenticated
with check (true);

drop policy if exists "Memory group items update" on public.memory_refresh_group_items;
create policy "Memory group items update"
on public.memory_refresh_group_items
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Memory group items delete" on public.memory_refresh_group_items;
create policy "Memory group items delete"
on public.memory_refresh_group_items
for delete
to anon, authenticated
using (true);

drop policy if exists "Memory groups delete" on public.memory_refresh_groups;
create policy "Memory groups delete"
on public.memory_refresh_groups
for delete
to anon, authenticated
using (true);

drop policy if exists "Explain sessions delete" on public.explain_back_sessions;
create policy "Explain sessions delete"
on public.explain_back_sessions
for delete
to anon, authenticated
using (true);

drop policy if exists "Explain questions delete" on public.explain_back_questions;
create policy "Explain questions delete"
on public.explain_back_questions
for delete
to anon, authenticated
using (true);

commit;

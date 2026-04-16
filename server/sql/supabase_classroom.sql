-- Smart Scroll classroom schema for teacher/student groups and Explain Back assignments.
-- Paste into Supabase SQL Editor and run once.

begin;

alter table public.groups
    add column if not exists teacher_user_id uuid,
    add column if not exists is_class boolean not null default false,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now();

create table if not exists public.class_assignments (
    id text primary key,
    group_id uuid not null references public.groups(id) on delete cascade,
    teacher_user_id uuid not null,
    title text not null,
    description text,
    video_id text not null,
    video_title text,
    required_score numeric(4,2) not null default 7,
    created_at timestamptz not null default now()
);

create index if not exists class_assignments_group_created_idx
    on public.class_assignments (group_id, created_at desc);

create index if not exists class_assignments_video_idx
    on public.class_assignments (video_id);

create or replace function public.set_groups_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_groups_updated_at on public.groups;
create trigger set_groups_updated_at
before update on public.groups
for each row
execute function public.set_groups_updated_at();

alter table public.class_assignments enable row level security;

drop policy if exists "Class assignments read" on public.class_assignments;
create policy "Class assignments read"
on public.class_assignments
for select
to anon, authenticated
using (true);

drop policy if exists "Class assignments write" on public.class_assignments;
create policy "Class assignments write"
on public.class_assignments
for insert
to anon, authenticated
with check (true);

drop policy if exists "Class assignments update" on public.class_assignments;
create policy "Class assignments update"
on public.class_assignments
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Class assignments delete" on public.class_assignments;
create policy "Class assignments delete"
on public.class_assignments
for delete
to anon, authenticated
using (true);

commit;

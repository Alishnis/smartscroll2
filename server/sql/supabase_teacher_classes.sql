-- Smart Scroll teacher classroom schema
-- Separate from public.groups so teacher classes do not depend on the legacy groups table.

begin;

create table if not exists public.teacher_classes (
    id text primary key,
    name text not null,
    description text,
    member_count integer not null default 0,
    teacher_user_id uuid not null,
    is_class boolean not null default true,
    icon_name text not null default 'GraduationCap',
    icon_color text not null default '#79ffe1',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.teacher_class_members (
    class_id text not null references public.teacher_classes(id) on delete cascade,
    user_id uuid not null,
    created_at timestamptz not null default now(),
    primary key (class_id, user_id)
);

create table if not exists public.teacher_class_messages (
    id text primary key,
    class_id text not null references public.teacher_classes(id) on delete cascade,
    user_id uuid not null,
    content text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.teacher_class_assignments (
    id text primary key,
    class_id text not null references public.teacher_classes(id) on delete cascade,
    teacher_user_id uuid not null,
    title text not null,
    description text,
    video_id text not null,
    video_title text,
    required_score numeric(4,2) not null default 7,
    created_at timestamptz not null default now()
);

create index if not exists teacher_classes_member_count_idx
    on public.teacher_classes (member_count desc);

create index if not exists teacher_class_members_user_idx
    on public.teacher_class_members (user_id);

create index if not exists teacher_class_messages_class_created_idx
    on public.teacher_class_messages (class_id, created_at asc);

create index if not exists teacher_class_assignments_class_created_idx
    on public.teacher_class_assignments (class_id, created_at desc);

create or replace function public.set_teacher_classes_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_teacher_classes_updated_at on public.teacher_classes;
create trigger set_teacher_classes_updated_at
before update on public.teacher_classes
for each row
execute function public.set_teacher_classes_updated_at();

alter table public.teacher_classes enable row level security;
alter table public.teacher_class_members enable row level security;
alter table public.teacher_class_messages enable row level security;
alter table public.teacher_class_assignments enable row level security;

drop policy if exists "Teacher classes read all" on public.teacher_classes;
create policy "Teacher classes read all"
on public.teacher_classes
for select
to anon, authenticated
using (true);

drop policy if exists "Teacher classes insert all" on public.teacher_classes;
create policy "Teacher classes insert all"
on public.teacher_classes
for insert
to anon, authenticated
with check (true);

drop policy if exists "Teacher classes update all" on public.teacher_classes;
create policy "Teacher classes update all"
on public.teacher_classes
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Teacher class members read all" on public.teacher_class_members;
create policy "Teacher class members read all"
on public.teacher_class_members
for select
to anon, authenticated
using (true);

drop policy if exists "Teacher class members insert all" on public.teacher_class_members;
create policy "Teacher class members insert all"
on public.teacher_class_members
for insert
to anon, authenticated
with check (true);

drop policy if exists "Teacher class members delete all" on public.teacher_class_members;
create policy "Teacher class members delete all"
on public.teacher_class_members
for delete
to anon, authenticated
using (true);

drop policy if exists "Teacher class messages read all" on public.teacher_class_messages;
create policy "Teacher class messages read all"
on public.teacher_class_messages
for select
to anon, authenticated
using (true);

drop policy if exists "Teacher class messages insert all" on public.teacher_class_messages;
create policy "Teacher class messages insert all"
on public.teacher_class_messages
for insert
to anon, authenticated
with check (true);

drop policy if exists "Teacher class assignments read all" on public.teacher_class_assignments;
create policy "Teacher class assignments read all"
on public.teacher_class_assignments
for select
to anon, authenticated
using (true);

drop policy if exists "Teacher class assignments insert all" on public.teacher_class_assignments;
create policy "Teacher class assignments insert all"
on public.teacher_class_assignments
for insert
to anon, authenticated
with check (true);

drop policy if exists "Teacher class assignments update all" on public.teacher_class_assignments;
create policy "Teacher class assignments update all"
on public.teacher_class_assignments
for update
to anon, authenticated
using (true)
with check (true);

commit;

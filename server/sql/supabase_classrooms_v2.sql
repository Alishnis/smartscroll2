begin;

drop table if exists public.classroom_assignments cascade;
drop table if exists public.classroom_messages cascade;
drop table if exists public.classroom_members cascade;
drop table if exists public.classrooms cascade;
drop function if exists public.set_classrooms_updated_at() cascade;

create table public.classrooms (
    id text primary key,
    invite_code text not null unique,
    name text not null,
    description text,
    teacher_user_id uuid not null,
    member_count integer not null default 1,
    icon_name text not null default 'GraduationCap',
    icon_color text not null default '#79ffe1',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.classroom_members (
    classroom_id text not null references public.classrooms(id) on delete cascade,
    user_id uuid not null,
    role text not null default 'student' check (role in ('teacher', 'student')),
    joined_at timestamptz not null default now(),
    primary key (classroom_id, user_id)
);

create table public.classroom_messages (
    id text primary key,
    classroom_id text not null references public.classrooms(id) on delete cascade,
    user_id uuid not null,
    content text not null,
    created_at timestamptz not null default now()
);

create table public.classroom_assignments (
    id text primary key,
    classroom_id text not null references public.classrooms(id) on delete cascade,
    teacher_user_id uuid not null,
    title text not null,
    description text,
    video_id text not null,
    video_title text,
    required_score numeric(4,2) not null default 7,
    created_at timestamptz not null default now()
);

create index classrooms_teacher_user_idx
    on public.classrooms (teacher_user_id);

create index classrooms_member_count_idx
    on public.classrooms (member_count desc);

create unique index classrooms_invite_code_idx
    on public.classrooms (invite_code);

create index classroom_members_user_idx
    on public.classroom_members (user_id);

create index classroom_messages_classroom_created_idx
    on public.classroom_messages (classroom_id, created_at asc);

create index classroom_assignments_classroom_created_idx
    on public.classroom_assignments (classroom_id, created_at desc);

create or replace function public.set_classrooms_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger set_classrooms_updated_at
before update on public.classrooms
for each row
execute function public.set_classrooms_updated_at();

alter table public.classrooms enable row level security;
alter table public.classroom_members enable row level security;
alter table public.classroom_messages enable row level security;
alter table public.classroom_assignments enable row level security;

drop policy if exists "Classrooms read all" on public.classrooms;
create policy "Classrooms read all"
on public.classrooms
for select
to anon, authenticated
using (true);

drop policy if exists "Classrooms insert all" on public.classrooms;
create policy "Classrooms insert all"
on public.classrooms
for insert
to anon, authenticated
with check (true);

drop policy if exists "Classrooms update all" on public.classrooms;
create policy "Classrooms update all"
on public.classrooms
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Classrooms delete all" on public.classrooms;
create policy "Classrooms delete all"
on public.classrooms
for delete
to anon, authenticated
using (true);

drop policy if exists "Classroom members read all" on public.classroom_members;
create policy "Classroom members read all"
on public.classroom_members
for select
to anon, authenticated
using (true);

drop policy if exists "Classroom members insert all" on public.classroom_members;
create policy "Classroom members insert all"
on public.classroom_members
for insert
to anon, authenticated
with check (true);

drop policy if exists "Classroom members update all" on public.classroom_members;
create policy "Classroom members update all"
on public.classroom_members
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Classroom members delete all" on public.classroom_members;
create policy "Classroom members delete all"
on public.classroom_members
for delete
to anon, authenticated
using (true);

drop policy if exists "Classroom messages read all" on public.classroom_messages;
create policy "Classroom messages read all"
on public.classroom_messages
for select
to anon, authenticated
using (true);

drop policy if exists "Classroom messages insert all" on public.classroom_messages;
create policy "Classroom messages insert all"
on public.classroom_messages
for insert
to anon, authenticated
with check (true);

drop policy if exists "Classroom assignments read all" on public.classroom_assignments;
create policy "Classroom assignments read all"
on public.classroom_assignments
for select
to anon, authenticated
using (true);

drop policy if exists "Classroom assignments insert all" on public.classroom_assignments;
create policy "Classroom assignments insert all"
on public.classroom_assignments
for insert
to anon, authenticated
with check (true);

drop policy if exists "Classroom assignments update all" on public.classroom_assignments;
create policy "Classroom assignments update all"
on public.classroom_assignments
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Classroom assignments delete all" on public.classroom_assignments;
create policy "Classroom assignments delete all"
on public.classroom_assignments
for delete
to anon, authenticated
using (true);

commit;

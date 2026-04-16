-- Smart Scroll full Supabase reset + bootstrap
-- This recreates the current app schema from scratch.
-- It does NOT delete auth.users, but it does recreate the public tables the app uses.

begin;

drop trigger if exists on_auth_user_created_profile on auth.users;

drop table if exists public.memory_refresh_group_items cascade;
drop table if exists public.memory_refresh_groups cascade;
drop table if exists public.explain_back_questions cascade;
drop table if exists public.explain_back_sessions cascade;
drop table if exists public.teacher_class_assignments cascade;
drop table if exists public.teacher_class_messages cascade;
drop table if exists public.teacher_class_members cascade;
drop table if exists public.teacher_classes cascade;
drop table if exists public.class_assignments cascade;
drop table if exists public.group_messages cascade;
drop table if exists public.user_groups cascade;
drop table if exists public.groups cascade;
drop table if exists public.smart_coin_ledger cascade;
drop table if exists public.user_accessory_purchases cascade;
drop table if exists public.gamification_profiles cascade;
drop table if exists public.video_notes cascade;
drop table if exists public.summaries cascade;
drop table if exists public.profiles cascade;

drop function if exists public.handle_new_user_profile() cascade;
drop function if exists public.set_profiles_updated_at() cascade;
drop function if exists public.set_updated_at() cascade;
drop function if exists public.set_gamification_updated_at() cascade;
drop function if exists public.set_teacher_classes_updated_at() cascade;
drop function if exists public.set_groups_updated_at() cascade;

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text,
    role text not null default 'Student',
    avatar_url text,
    summaries_read integer not null default 0,
    time_saved_hours integer not null default 0,
    active_streaks integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.groups (
    id uuid primary key,
    name text not null,
    description text,
    member_count integer not null default 0,
    teacher_user_id uuid,
    is_class boolean not null default false,
    icon_name text default 'Users',
    icon_color text default '#79ffe1',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.user_groups (
    user_id uuid not null,
    group_id uuid not null references public.groups(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, group_id)
);

create table public.group_messages (
    id uuid primary key default gen_random_uuid(),
    group_id uuid not null references public.groups(id) on delete cascade,
    user_id uuid not null,
    content text not null,
    created_at timestamptz not null default now()
);

create table public.class_assignments (
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

create table public.teacher_classes (
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

create table public.teacher_class_members (
    class_id text not null references public.teacher_classes(id) on delete cascade,
    user_id uuid not null,
    created_at timestamptz not null default now(),
    primary key (class_id, user_id)
);

create table public.teacher_class_messages (
    id text primary key,
    class_id text not null references public.teacher_classes(id) on delete cascade,
    user_id uuid not null,
    content text not null,
    created_at timestamptz not null default now()
);

create table public.teacher_class_assignments (
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

create table public.gamification_profiles (
    user_id uuid primary key,
    smart_coins integer not null default 0,
    equipped_accessory_id text,
    total_minutes_spent integer not null default 0,
    updated_at timestamptz not null default now()
);

create table public.smart_coin_ledger (
    id text primary key,
    user_id uuid not null,
    amount integer not null,
    reason text not null,
    metadata_json jsonb not null default '{}'::jsonb,
    idempotency_key text not null unique,
    created_at timestamptz not null default now()
);

create table public.user_accessory_purchases (
    id text primary key,
    user_id uuid not null,
    accessory_id text not null,
    category text not null default 'accessory',
    title text not null,
    created_at timestamptz not null default now(),
    constraint user_accessory_unique unique (user_id, accessory_id)
);

create table public.summaries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    title text not null,
    content text,
    icon_name text default 'Book',
    created_at timestamptz not null default now()
);

create table public.video_notes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    video_id text not null,
    content text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint video_notes_user_video_unique unique (user_id, video_id)
);

create table public.explain_back_sessions (
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

create table public.explain_back_questions (
    id text primary key,
    session_id text not null references public.explain_back_sessions(id) on delete cascade,
    question_text text not null,
    answer_text text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create table public.memory_refresh_groups (
    id text primary key,
    user_id uuid not null,
    name text not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.memory_refresh_group_items (
    id text primary key,
    group_id text not null references public.memory_refresh_groups(id) on delete cascade,
    session_id text not null references public.explain_back_sessions(id) on delete cascade,
    created_at timestamptz not null default now(),
    constraint memory_refresh_group_items_group_session_key unique (group_id, session_id)
);

create index groups_member_count_idx on public.groups (member_count desc);
create index user_groups_user_idx on public.user_groups (user_id);
create index user_groups_group_idx on public.user_groups (group_id);
create index group_messages_group_created_idx on public.group_messages (group_id, created_at asc);
create index class_assignments_group_created_idx on public.class_assignments (group_id, created_at desc);
create index class_assignments_video_idx on public.class_assignments (video_id);
create index teacher_classes_member_count_idx on public.teacher_classes (member_count desc);
create index teacher_class_members_user_idx on public.teacher_class_members (user_id);
create index teacher_class_messages_class_created_idx on public.teacher_class_messages (class_id, created_at asc);
create index teacher_class_assignments_class_created_idx on public.teacher_class_assignments (class_id, created_at desc);
create index smart_coin_ledger_user_created_idx on public.smart_coin_ledger (user_id, created_at desc);
create index accessory_purchases_user_created_idx on public.user_accessory_purchases (user_id, created_at desc);
create index summaries_user_created_idx on public.summaries (user_id, created_at desc);
create index video_notes_user_updated_idx on public.video_notes (user_id, updated_at desc);
create index explain_back_sessions_user_created_idx on public.explain_back_sessions (user_id, created_at desc);
create index explain_back_sessions_content_idx on public.explain_back_sessions (content_id, content_type);
create index explain_back_questions_session_sort_idx on public.explain_back_questions (session_id, sort_order);
create index memory_refresh_groups_user_created_idx on public.memory_refresh_groups (user_id, created_at desc);
create index memory_refresh_group_items_group_idx on public.memory_refresh_group_items (group_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (
        id,
        username,
        role,
        avatar_url,
        created_at,
        updated_at
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data ->> 'role', 'Student'),
        null,
        now(),
        now()
    )
    on conflict (id) do update set
        username = excluded.username,
        role = excluded.role,
        updated_at = now();

    insert into public.gamification_profiles (
        user_id,
        smart_coins,
        equipped_accessory_id,
        total_minutes_spent,
        updated_at
    )
    values (
        new.id,
        0,
        null,
        0,
        now()
    )
    on conflict (user_id) do nothing;

    return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_groups_updated_at
before update on public.groups
for each row execute function public.set_updated_at();

create trigger set_teacher_classes_updated_at
before update on public.teacher_classes
for each row execute function public.set_updated_at();

create trigger set_gamification_profiles_updated_at
before update on public.gamification_profiles
for each row execute function public.set_updated_at();

create trigger set_video_notes_updated_at
before update on public.video_notes
for each row execute function public.set_updated_at();

create trigger set_explain_back_sessions_updated_at
before update on public.explain_back_sessions
for each row execute function public.set_updated_at();

create trigger set_memory_refresh_groups_updated_at
before update on public.memory_refresh_groups
for each row execute function public.set_updated_at();

create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.user_groups enable row level security;
alter table public.group_messages enable row level security;
alter table public.class_assignments enable row level security;
alter table public.teacher_classes enable row level security;
alter table public.teacher_class_members enable row level security;
alter table public.teacher_class_messages enable row level security;
alter table public.teacher_class_assignments enable row level security;
alter table public.gamification_profiles enable row level security;
alter table public.smart_coin_ledger enable row level security;
alter table public.user_accessory_purchases enable row level security;
alter table public.summaries enable row level security;
alter table public.video_notes enable row level security;
alter table public.explain_back_sessions enable row level security;
alter table public.explain_back_questions enable row level security;
alter table public.memory_refresh_groups enable row level security;
alter table public.memory_refresh_group_items enable row level security;

create policy "Profiles read all" on public.profiles for select to anon, authenticated using (true);
create policy "Profiles write all" on public.profiles for insert to anon, authenticated with check (true);
create policy "Profiles update all" on public.profiles for update to anon, authenticated using (true) with check (true);

create policy "Groups read all" on public.groups for select to anon, authenticated using (true);
create policy "Groups insert all" on public.groups for insert to anon, authenticated with check (true);
create policy "Groups update all" on public.groups for update to anon, authenticated using (true) with check (true);
create policy "Groups delete all" on public.groups for delete to anon, authenticated using (true);

create policy "User groups read all" on public.user_groups for select to anon, authenticated using (true);
create policy "User groups insert all" on public.user_groups for insert to anon, authenticated with check (true);
create policy "User groups delete all" on public.user_groups for delete to anon, authenticated using (true);

create policy "Group messages read all" on public.group_messages for select to anon, authenticated using (true);
create policy "Group messages insert all" on public.group_messages for insert to anon, authenticated with check (true);

create policy "Class assignments read all" on public.class_assignments for select to anon, authenticated using (true);
create policy "Class assignments insert all" on public.class_assignments for insert to anon, authenticated with check (true);
create policy "Class assignments update all" on public.class_assignments for update to anon, authenticated using (true) with check (true);
create policy "Class assignments delete all" on public.class_assignments for delete to anon, authenticated using (true);

create policy "Teacher classes read all" on public.teacher_classes for select to anon, authenticated using (true);
create policy "Teacher classes insert all" on public.teacher_classes for insert to anon, authenticated with check (true);
create policy "Teacher classes update all" on public.teacher_classes for update to anon, authenticated using (true) with check (true);

create policy "Teacher class members read all" on public.teacher_class_members for select to anon, authenticated using (true);
create policy "Teacher class members insert all" on public.teacher_class_members for insert to anon, authenticated with check (true);
create policy "Teacher class members delete all" on public.teacher_class_members for delete to anon, authenticated using (true);

create policy "Teacher class messages read all" on public.teacher_class_messages for select to anon, authenticated using (true);
create policy "Teacher class messages insert all" on public.teacher_class_messages for insert to anon, authenticated with check (true);

create policy "Teacher class assignments read all" on public.teacher_class_assignments for select to anon, authenticated using (true);
create policy "Teacher class assignments insert all" on public.teacher_class_assignments for insert to anon, authenticated with check (true);
create policy "Teacher class assignments update all" on public.teacher_class_assignments for update to anon, authenticated using (true) with check (true);

create policy "Gamification profiles read all" on public.gamification_profiles for select to anon, authenticated using (true);
create policy "Gamification profiles write all" on public.gamification_profiles for insert to anon, authenticated with check (true);
create policy "Gamification profiles update all" on public.gamification_profiles for update to anon, authenticated using (true) with check (true);

create policy "Smart coin ledger read all" on public.smart_coin_ledger for select to anon, authenticated using (true);
create policy "Smart coin ledger write all" on public.smart_coin_ledger for insert to anon, authenticated with check (true);

create policy "Accessory purchases read all" on public.user_accessory_purchases for select to anon, authenticated using (true);
create policy "Accessory purchases write all" on public.user_accessory_purchases for insert to anon, authenticated with check (true);

create policy "Summaries read all" on public.summaries for select to anon, authenticated using (true);
create policy "Summaries write all" on public.summaries for insert to anon, authenticated with check (true);

create policy "Video notes read all" on public.video_notes for select to anon, authenticated using (true);
create policy "Video notes write all" on public.video_notes for insert to anon, authenticated with check (true);
create policy "Video notes update all" on public.video_notes for update to anon, authenticated using (true) with check (true);

create policy "Explain sessions read all" on public.explain_back_sessions for select to anon, authenticated using (true);
create policy "Explain sessions write all" on public.explain_back_sessions for insert to anon, authenticated with check (true);
create policy "Explain sessions update all" on public.explain_back_sessions for update to anon, authenticated using (true) with check (true);
create policy "Explain sessions delete all" on public.explain_back_sessions for delete to anon, authenticated using (true);

create policy "Explain questions read all" on public.explain_back_questions for select to anon, authenticated using (true);
create policy "Explain questions write all" on public.explain_back_questions for insert to anon, authenticated with check (true);
create policy "Explain questions update all" on public.explain_back_questions for update to anon, authenticated using (true) with check (true);
create policy "Explain questions delete all" on public.explain_back_questions for delete to anon, authenticated using (true);

create policy "Memory groups read all" on public.memory_refresh_groups for select to anon, authenticated using (true);
create policy "Memory groups write all" on public.memory_refresh_groups for insert to anon, authenticated with check (true);
create policy "Memory groups update all" on public.memory_refresh_groups for update to anon, authenticated using (true) with check (true);
create policy "Memory groups delete all" on public.memory_refresh_groups for delete to anon, authenticated using (true);

create policy "Memory group items read all" on public.memory_refresh_group_items for select to anon, authenticated using (true);
create policy "Memory group items write all" on public.memory_refresh_group_items for insert to anon, authenticated with check (true);
create policy "Memory group items update all" on public.memory_refresh_group_items for update to anon, authenticated using (true) with check (true);
create policy "Memory group items delete all" on public.memory_refresh_group_items for delete to anon, authenticated using (true);

commit;

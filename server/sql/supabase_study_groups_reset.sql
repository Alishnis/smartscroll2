create extension if not exists pgcrypto;

drop table if exists public.study_group_assignments cascade;
drop table if exists public.study_group_whiteboard_events cascade;
drop table if exists public.study_group_messages cascade;
drop table if exists public.study_group_members cascade;
drop table if exists public.study_groups cascade;

drop table if exists public.classroom_assignments cascade;
drop table if exists public.classroom_messages cascade;
drop table if exists public.classroom_members cascade;
drop table if exists public.classrooms cascade;
drop table if exists public.teacher_class_assignments cascade;
drop table if exists public.teacher_class_messages cascade;
drop table if exists public.teacher_class_members cascade;
drop table if exists public.teacher_classes cascade;
drop table if exists public.class_assignments cascade;
drop table if exists public.group_messages cascade;
drop table if exists public.user_groups cascade;
drop table if exists public.groups cascade;

drop function if exists public.normalize_study_group_code(text) cascade;
drop function if exists public.touch_study_group_updated_at() cascade;
drop function if exists public.sync_study_group_member_count() cascade;
drop function if exists public.is_study_group_owner(uuid, uuid) cascade;
drop function if exists public.is_study_group_member(uuid, uuid) cascade;
drop function if exists public.can_view_study_group(uuid, uuid) cascade;
drop function if exists public.create_study_group(text, text, text, text) cascade;
drop function if exists public.join_study_group(uuid) cascade;
drop function if exists public.join_study_group_by_code(text) cascade;
drop function if exists public.leave_study_group(uuid) cascade;
drop function if exists public.send_study_group_message(uuid, text) cascade;
drop function if exists public.create_study_group_assignment(uuid, text, text, text, text, integer) cascade;

create table public.study_groups (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(trim(name)) >= 2),
    description text not null default '',
    visibility text not null default 'public' check (visibility in ('public', 'private')),
    invite_code text not null unique,
    owner_user_id uuid not null,
    theme_color text not null default '#79ffe1',
    member_count integer not null default 1,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.study_group_members (
    group_id uuid not null references public.study_groups(id) on delete cascade,
    user_id uuid not null,
    role text not null default 'student' check (role in ('teacher', 'student')),
    joined_at timestamptz not null default now(),
    primary key (group_id, user_id)
);

create table public.study_group_messages (
    id uuid primary key default gen_random_uuid(),
    group_id uuid not null references public.study_groups(id) on delete cascade,
    user_id uuid not null,
    content text not null check (char_length(trim(content)) > 0),
    created_at timestamptz not null default now()
);

create table public.study_group_assignments (
    id uuid primary key default gen_random_uuid(),
    group_id uuid not null references public.study_groups(id) on delete cascade,
    teacher_user_id uuid not null,
    title text not null check (char_length(trim(title)) > 1),
    description text not null default '',
    video_id text not null,
    video_title text not null default '',
    required_score integer not null default 7 check (required_score between 1 and 10),
    created_at timestamptz not null default now()
);

create table public.study_group_whiteboard_events (
    id uuid primary key default gen_random_uuid(),
    group_id uuid not null references public.study_groups(id) on delete cascade,
    user_id uuid not null,
    event_type text not null check (event_type in ('path', 'text', 'clear')),
    payload_json jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index study_groups_owner_idx on public.study_groups(owner_user_id);
create index study_groups_visibility_idx on public.study_groups(visibility);
create index study_groups_updated_idx on public.study_groups(updated_at desc);
create index study_group_members_user_idx on public.study_group_members(user_id, joined_at desc);
create index study_group_messages_group_idx on public.study_group_messages(group_id, created_at asc);
create index study_group_assignments_group_idx on public.study_group_assignments(group_id, created_at desc);
create index study_group_whiteboard_events_group_idx on public.study_group_whiteboard_events(group_id, created_at asc);

create or replace function public.normalize_study_group_code(raw_code text)
returns text
language sql
immutable
as $$
    select upper(regexp_replace(coalesce(raw_code, ''), '[^A-Za-z0-9]', '', 'g'));
$$;

create or replace function public.touch_study_group_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create or replace function public.sync_study_group_member_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    target_group_id uuid;
begin
    target_group_id := coalesce(new.group_id, old.group_id);

    update public.study_groups
    set
        member_count = (
            select count(*)
            from public.study_group_members members
            where members.group_id = target_group_id
        ),
        updated_at = now()
    where id = target_group_id;

    return coalesce(new, old);
end;
$$;

create trigger study_groups_touch_updated_at
before update on public.study_groups
for each row
execute function public.touch_study_group_updated_at();

create trigger study_group_members_sync_count_insert
after insert on public.study_group_members
for each row
execute function public.sync_study_group_member_count();

create trigger study_group_members_sync_count_delete
after delete on public.study_group_members
for each row
execute function public.sync_study_group_member_count();

create or replace function public.is_study_group_owner(target_group_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.study_groups groups
        where groups.id = target_group_id
          and groups.owner_user_id = coalesce(target_user_id, auth.uid())
    );
$$;

create or replace function public.is_study_group_member(target_group_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select
        public.is_study_group_owner(target_group_id, coalesce(target_user_id, auth.uid()))
        or exists (
            select 1
            from public.study_group_members members
            where members.group_id = target_group_id
              and members.user_id = coalesce(target_user_id, auth.uid())
        );
$$;

create or replace function public.can_view_study_group(target_group_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.study_groups groups
        where groups.id = target_group_id
          and (
              groups.visibility = 'public'
              or groups.owner_user_id = coalesce(target_user_id, auth.uid())
              or exists (
                  select 1
                  from public.study_group_members members
                  where members.group_id = groups.id
                    and members.user_id = coalesce(target_user_id, auth.uid())
              )
          )
    );
$$;

create or replace function public.create_study_group(
    p_name text,
    p_description text default '',
    p_visibility text default 'public',
    p_theme_color text default '#79ffe1'
)
returns public.study_groups
language plpgsql
security definer
set search_path = public
as $$
declare
    created_group public.study_groups;
    generated_code text;
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    if char_length(trim(coalesce(p_name, ''))) < 2 then
        raise exception 'Group name must contain at least 2 characters';
    end if;

    if coalesce(p_visibility, 'public') not in ('public', 'private') then
        raise exception 'Visibility must be public or private';
    end if;

    loop
        generated_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
        exit when not exists (
            select 1
            from public.study_groups
            where invite_code = generated_code
        );
    end loop;

    insert into public.study_groups (
        name,
        description,
        visibility,
        invite_code,
        owner_user_id,
        theme_color,
        member_count
    )
    values (
        trim(p_name),
        trim(coalesce(p_description, '')),
        coalesce(p_visibility, 'public'),
        generated_code,
        auth.uid(),
        coalesce(nullif(trim(p_theme_color), ''), '#79ffe1'),
        1
    )
    returning * into created_group;

    insert into public.study_group_members (group_id, user_id, role)
    values (created_group.id, auth.uid(), 'teacher')
    on conflict (group_id, user_id) do update
    set role = excluded.role;

    return created_group;
end;
$$;

create or replace function public.join_study_group(p_group_id uuid)
returns public.study_groups
language plpgsql
security definer
set search_path = public
as $$
declare
    target_group public.study_groups;
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    select *
    into target_group
    from public.study_groups
    where id = p_group_id
    limit 1;

    if target_group.id is null then
        raise exception 'Group not found';
    end if;

    if target_group.visibility <> 'public' and target_group.owner_user_id <> auth.uid() then
        raise exception 'This group is private';
    end if;

    insert into public.study_group_members (group_id, user_id, role)
    values (
        target_group.id,
        auth.uid(),
        case when target_group.owner_user_id = auth.uid() then 'teacher' else 'student' end
    )
    on conflict (group_id, user_id) do nothing;

    return target_group;
end;
$$;

create or replace function public.join_study_group_by_code(p_invite_code text)
returns public.study_groups
language plpgsql
security definer
set search_path = public
as $$
declare
    target_group public.study_groups;
    normalized_code text;
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    normalized_code := public.normalize_study_group_code(p_invite_code);

    select *
    into target_group
    from public.study_groups
    where invite_code = normalized_code
    limit 1;

    if target_group.id is null then
        raise exception 'Group not found';
    end if;

    insert into public.study_group_members (group_id, user_id, role)
    values (
        target_group.id,
        auth.uid(),
        case when target_group.owner_user_id = auth.uid() then 'teacher' else 'student' end
    )
    on conflict (group_id, user_id) do nothing;

    return target_group;
end;
$$;

create or replace function public.leave_study_group(p_group_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    if public.is_study_group_owner(p_group_id, auth.uid()) then
        raise exception 'Group owners cannot leave their own group';
    end if;

    delete from public.study_group_members
    where group_id = p_group_id
      and user_id = auth.uid();

    return true;
end;
$$;

create or replace function public.send_study_group_message(p_group_id uuid, p_content text)
returns public.study_group_messages
language plpgsql
security definer
set search_path = public
as $$
declare
    inserted_message public.study_group_messages;
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    if not public.is_study_group_member(p_group_id, auth.uid()) then
        raise exception 'Join the group before posting';
    end if;

    if char_length(trim(coalesce(p_content, ''))) = 0 then
        raise exception 'Message cannot be empty';
    end if;

    insert into public.study_group_messages (group_id, user_id, content)
    values (p_group_id, auth.uid(), trim(p_content))
    returning * into inserted_message;

    update public.study_groups
    set updated_at = now()
    where id = p_group_id;

    return inserted_message;
end;
$$;

create or replace function public.create_study_group_assignment(
    p_group_id uuid,
    p_title text,
    p_description text default '',
    p_video_id text default '',
    p_video_title text default '',
    p_required_score integer default 7
)
returns public.study_group_assignments
language plpgsql
security definer
set search_path = public
as $$
declare
    inserted_assignment public.study_group_assignments;
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    if not public.is_study_group_owner(p_group_id, auth.uid()) then
        raise exception 'Only the group owner can create assignments';
    end if;

    if char_length(trim(coalesce(p_title, ''))) < 2 then
        raise exception 'Assignment title is too short';
    end if;

    if char_length(trim(coalesce(p_video_id, ''))) = 0 then
        raise exception 'Video ID is required';
    end if;

    insert into public.study_group_assignments (
        group_id,
        teacher_user_id,
        title,
        description,
        video_id,
        video_title,
        required_score
    )
    values (
        p_group_id,
        auth.uid(),
        trim(p_title),
        trim(coalesce(p_description, '')),
        trim(p_video_id),
        trim(coalesce(p_video_title, '')),
        greatest(1, least(coalesce(p_required_score, 7), 10))
    )
    returning * into inserted_assignment;

    update public.study_groups
    set updated_at = now()
    where id = p_group_id;

    return inserted_assignment;
end;
$$;

alter table public.study_groups enable row level security;
alter table public.study_group_members enable row level security;
alter table public.study_group_messages enable row level security;
alter table public.study_group_assignments enable row level security;
alter table public.study_group_whiteboard_events enable row level security;

create policy "study_groups_select"
on public.study_groups
for select
to authenticated
using (public.can_view_study_group(id, auth.uid()));

create policy "study_groups_insert"
on public.study_groups
for insert
to authenticated
with check (owner_user_id = auth.uid());

create policy "study_groups_update"
on public.study_groups
for update
to authenticated
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

create policy "study_groups_delete"
on public.study_groups
for delete
to authenticated
using (owner_user_id = auth.uid());

create policy "study_group_members_select"
on public.study_group_members
for select
to authenticated
using (public.is_study_group_member(group_id, auth.uid()));

create policy "study_group_members_insert"
on public.study_group_members
for insert
to authenticated
with check (
    user_id = auth.uid()
    and (
        role = 'student'
        or public.is_study_group_owner(group_id, auth.uid())
    )
);

create policy "study_group_members_delete"
on public.study_group_members
for delete
to authenticated
using (
    user_id = auth.uid()
    or public.is_study_group_owner(group_id, auth.uid())
);

create policy "study_group_messages_select"
on public.study_group_messages
for select
to authenticated
using (public.is_study_group_member(group_id, auth.uid()));

create policy "study_group_messages_insert"
on public.study_group_messages
for insert
to authenticated
with check (
    user_id = auth.uid()
    and public.is_study_group_member(group_id, auth.uid())
);

create policy "study_group_assignments_select"
on public.study_group_assignments
for select
to authenticated
using (public.is_study_group_member(group_id, auth.uid()));

create policy "study_group_assignments_insert"
on public.study_group_assignments
for insert
to authenticated
with check (
    teacher_user_id = auth.uid()
    and public.is_study_group_owner(group_id, auth.uid())
);

create policy "study_group_assignments_update"
on public.study_group_assignments
for update
to authenticated
using (public.is_study_group_owner(group_id, auth.uid()))
with check (teacher_user_id = auth.uid());

create policy "study_group_assignments_delete"
on public.study_group_assignments
for delete
to authenticated
using (public.is_study_group_owner(group_id, auth.uid()));

create policy "study_group_whiteboard_events_select"
on public.study_group_whiteboard_events
for select
to authenticated
using (public.is_study_group_member(group_id, auth.uid()));

create policy "study_group_whiteboard_events_insert"
on public.study_group_whiteboard_events
for insert
to authenticated
with check (
    user_id = auth.uid()
    and public.is_study_group_member(group_id, auth.uid())
    and (
        event_type <> 'clear'
        or public.is_study_group_owner(group_id, auth.uid())
    )
);

grant execute on function public.create_study_group(text, text, text, text) to authenticated;
grant execute on function public.join_study_group(uuid) to authenticated;
grant execute on function public.join_study_group_by_code(text) to authenticated;
grant execute on function public.leave_study_group(uuid) to authenticated;
grant execute on function public.send_study_group_message(uuid, text) to authenticated;
grant execute on function public.create_study_group_assignment(uuid, text, text, text, text, integer) to authenticated;

do $$
begin
    if exists (
        select 1
        from pg_publication
        where pubname = 'supabase_realtime'
    ) and not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'study_group_whiteboard_events'
    ) then
        execute 'alter publication supabase_realtime add table public.study_group_whiteboard_events';
    end if;
end;
$$;

insert into public.study_groups (
    id,
    name,
    description,
    visibility,
    invite_code,
    owner_user_id,
    theme_color,
    member_count,
    created_at,
    updated_at
)
values (
    '11111111-1111-4111-8111-111111111111',
    'SmartScroll Starter Class',
    'A built-in demo room so Discover never looks empty. Use it as a visual example while the real database-backed classes are being set up.',
    'public',
    'SMART101',
    '00000000-0000-0000-0000-000000000000',
    '#7c9bff',
    128,
    '2026-01-01T00:00:00.000Z',
    '2026-01-01T00:00:00.000Z'
)
on conflict (id) do update
set
    name = excluded.name,
    description = excluded.description,
    visibility = excluded.visibility,
    invite_code = excluded.invite_code,
    owner_user_id = excluded.owner_user_id,
    theme_color = excluded.theme_color,
    member_count = excluded.member_count,
    updated_at = excluded.updated_at;

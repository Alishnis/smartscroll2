begin;

create table if not exists public.study_group_whiteboard_events (
    id uuid primary key default gen_random_uuid(),
    group_id uuid not null references public.study_groups(id) on delete cascade,
    user_id uuid not null,
    event_type text not null check (event_type in ('path', 'text', 'clear')),
    payload_json jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists study_group_whiteboard_events_group_idx
    on public.study_group_whiteboard_events (group_id, created_at asc);

alter table public.study_group_whiteboard_events enable row level security;

drop policy if exists "study_group_whiteboard_events_select" on public.study_group_whiteboard_events;
create policy "study_group_whiteboard_events_select"
on public.study_group_whiteboard_events
for select
to authenticated
using (public.is_study_group_member(group_id, auth.uid()));

drop policy if exists "study_group_whiteboard_events_insert" on public.study_group_whiteboard_events;
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

commit;

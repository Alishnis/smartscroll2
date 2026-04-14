-- Smart Scroll basic profiles table for Supabase email/password auth
-- Run this in Supabase SQL Editor if you do not already have a compatible profiles table.

begin;

create table if not exists public.profiles (
    id uuid primary key,
    username text,
    role text default 'Knowledge Explorer',
    avatar_url text,
    summaries_read integer not null default 0,
    time_saved_hours integer not null default 0,
    active_streaks integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Profiles read" on public.profiles;
create policy "Profiles read"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Profiles write" on public.profiles;
create policy "Profiles write"
on public.profiles
for insert
to anon, authenticated
with check (true);

drop policy if exists "Profiles update" on public.profiles;
create policy "Profiles update"
on public.profiles
for update
to anon, authenticated
using (true)
with check (true);

commit;

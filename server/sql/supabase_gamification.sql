-- Smart Scroll gamification schema for Supabase
-- Paste into Supabase SQL Editor and run once.

begin;

create table if not exists public.gamification_profiles (
    user_id uuid primary key,
    smart_coins integer not null default 0,
    equipped_accessory_id text,
    total_minutes_spent integer not null default 0,
    updated_at timestamptz not null default now()
);

create table if not exists public.smart_coin_ledger (
    id text primary key,
    user_id uuid not null,
    amount integer not null,
    reason text not null,
    metadata_json jsonb not null default '{}'::jsonb,
    idempotency_key text not null unique,
    created_at timestamptz not null default now()
);

create table if not exists public.user_accessory_purchases (
    id text primary key,
    user_id uuid not null,
    accessory_id text not null,
    category text not null default 'accessory',
    title text not null,
    created_at timestamptz not null default now(),
    constraint user_accessory_unique unique (user_id, accessory_id)
);

create index if not exists smart_coin_ledger_user_created_idx
    on public.smart_coin_ledger (user_id, created_at desc);

create index if not exists accessory_purchases_user_created_idx
    on public.user_accessory_purchases (user_id, created_at desc);

create or replace function public.set_gamification_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_gamification_profiles_updated_at on public.gamification_profiles;
create trigger set_gamification_profiles_updated_at
before update on public.gamification_profiles
for each row
execute function public.set_gamification_updated_at();

alter table public.gamification_profiles enable row level security;
alter table public.smart_coin_ledger enable row level security;
alter table public.user_accessory_purchases enable row level security;

drop policy if exists "Gamification profiles read" on public.gamification_profiles;
create policy "Gamification profiles read"
on public.gamification_profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Gamification profiles write" on public.gamification_profiles;
create policy "Gamification profiles write"
on public.gamification_profiles
for insert
to anon, authenticated
with check (true);

drop policy if exists "Gamification profiles update" on public.gamification_profiles;
create policy "Gamification profiles update"
on public.gamification_profiles
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Smart coin ledger read" on public.smart_coin_ledger;
create policy "Smart coin ledger read"
on public.smart_coin_ledger
for select
to anon, authenticated
using (true);

drop policy if exists "Smart coin ledger write" on public.smart_coin_ledger;
create policy "Smart coin ledger write"
on public.smart_coin_ledger
for insert
to anon, authenticated
with check (true);

drop policy if exists "Accessory purchases read" on public.user_accessory_purchases;
create policy "Accessory purchases read"
on public.user_accessory_purchases
for select
to anon, authenticated
using (true);

drop policy if exists "Accessory purchases write" on public.user_accessory_purchases;
create policy "Accessory purchases write"
on public.user_accessory_purchases
for insert
to anon, authenticated
with check (true);

commit;

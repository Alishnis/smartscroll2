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

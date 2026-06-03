# Supabase Setup

## 1. Create a Supabase project

Go to https://supabase.com and create a free project.

## 2. Copy your API keys

In Supabase:

1. Open your project.
2. Go to Project Settings.
3. Open API.
4. Copy:
   - Project URL
   - anon public key

## 3. Create `.env.local`

Create a file named `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_API_BASE_URL=http://localhost:5000/api
```

Restart the frontend after changing environment variables:

```bash
npm.cmd run dev
```

## 4. Where to see users

In Supabase dashboard:

1. Open Authentication.
2. Open Users.

New users who register on the website will appear there.

## 5. Visitor counter database setup

The footer visitor counter calls a Supabase function named `record_site_visit`. In Supabase:

1. Open SQL Editor.
2. Create a new query.
3. Run this SQL:

```sql
create table if not exists public.site_visitor_stats (
  id text primary key default 'main',
  total_visitors bigint not null default 0,
  total_visits bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.site_visitor_stats (id, total_visitors, total_visits)
values ('main', 0, 0)
on conflict (id) do nothing;

create table if not exists public.site_visitors (
  visitor_key text primary key,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  visit_count bigint not null default 1
);

alter table public.site_visitor_stats enable row level security;
alter table public.site_visitors enable row level security;

create or replace function public.record_site_visit(p_visitor_key text)
returns table(total_visitors bigint, total_visits bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
begin
  if p_visitor_key is null or length(trim(p_visitor_key)) < 8 then
    raise exception 'Invalid visitor key';
  end if;

  insert into public.site_visitors (visitor_key)
  values (p_visitor_key)
  on conflict (visitor_key) do nothing;

  get diagnostics inserted_count = row_count;

  if inserted_count = 1 then
    update public.site_visitor_stats
    set
      total_visitors = total_visitors + 1,
      total_visits = total_visits + 1,
      updated_at = now()
    where id = 'main';
  else
    update public.site_visitors
    set
      last_seen_at = now(),
      visit_count = visit_count + 1
    where visitor_key = p_visitor_key;

    update public.site_visitor_stats
    set
      total_visits = total_visits + 1,
      updated_at = now()
    where id = 'main';
  end if;

  return query
  select stats.total_visitors, stats.total_visits
  from public.site_visitor_stats as stats
  where stats.id = 'main';
end;
$$;

grant execute on function public.record_site_visit(text) to anon, authenticated;
```

This stores each browser as one real visitor. The website displays each visitor as 10 on the public counter, so the visible visitor count increases by 10 for every new browser visitor while repeat page loads are still tracked as total visits. The React counter also stores the last displayed count locally and animates from the previous stored value to the newest value instead of jumping from zero.

## 6. Roles and permissions

Supabase supports roles and permissions through:

- Auth user metadata
- Database tables for profiles/roles
- Row Level Security policies

For this website, the next step is to add a `profiles` table with a `role` column such as `admin`, `staff`, or `user`.

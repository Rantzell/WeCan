-- ============================================================
--  LifeOS AI — Database schema (PostgreSQL / Supabase)
--  Run this in Supabase → SQL Editor. Safe to re-run.
--  Every table is protected by Row Level Security so a user
--  can only ever read/write their own rows (user_id = auth.uid()).
-- ============================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  avatar_url  text,
  xp          integer not null default 0,
  level       integer not null default 1,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- TASKS ----------
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  title       text not null,
  category    text default 'Personal',
  priority    text not null default 'medium' check (priority in ('low','medium','high')),
  status      text not null default 'todo' check (status in ('todo','doing','done')),
  due_date    date,
  tags        text[] default '{}',
  recurring   text,
  completed_at timestamptz,
  created_at  timestamptz not null default now()
);

-- ---------- HABITS ----------
create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null,
  icon        text,
  target_days integer not null default 7,
  created_at  timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  habit_id    uuid not null references public.habits on delete cascade,
  log_date    date not null default current_date,
  done        boolean not null default true,
  unique (habit_id, log_date)
);

-- ---------- GOALS ----------
create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  title       text not null,
  type        text not null default 'Short-term' check (type in ('Short-term','Long-term')),
  progress    integer not null default 0 check (progress between 0 and 100),
  deadline    date,
  milestones  jsonb default '[]',
  created_at  timestamptz not null default now()
);

-- ---------- CALENDAR EVENTS ----------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  title       text not null,
  category    text default 'Personal',
  color       text default '#b5482f',
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- ---------- FINANCE ----------
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  kind        text not null default 'expense' check (kind in ('income','expense')),
  amount      numeric(12,2) not null,
  category    text default 'Other',
  note        text,
  spent_at    date not null default current_date,
  created_at  timestamptz not null default now()
);

create table if not exists public.budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  category    text not null,
  monthly_cap numeric(12,2) not null default 0,
  unique (user_id, category)
);

-- ---------- WORKOUTS ----------
create table if not exists public.workouts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  day_type    text,
  exercises   jsonb default '[]',
  bodyweight  numeric(6,2),
  performed_at date not null default current_date,
  created_at  timestamptz not null default now()
);

-- ---------- JOURNAL ----------
create table if not exists public.journal_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  entry_date  date not null default current_date,
  mood        text,
  gratitude   text,
  wins        text,
  challenges  text,
  body        text,
  created_at  timestamptz not null default now(),
  unique (user_id, entry_date)
);

-- ---------- WISHLIST ----------
create table if not exists public.wishlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null,
  target_price numeric(12,2) not null,
  saved       numeric(12,2) not null default 0,
  url         text,
  created_at  timestamptz not null default now()
);

-- ============================================================
--  ROW LEVEL SECURITY — one owner policy per table
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','tasks','habits','habit_logs','goals','events',
    'transactions','budgets','workouts','journal_entries','wishlist'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "owner_all" on public.%I;', t);
  end loop;
end $$;

-- profiles keys on id, everything else on user_id
create policy "owner_all" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "owner_all" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_all" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_all" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_all" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_all" on public.events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_all" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_all" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_all" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_all" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_all" on public.wishlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Helpful indexes ----------
create index if not exists idx_tasks_user on public.tasks(user_id);
create index if not exists idx_habit_logs_user_date on public.habit_logs(user_id, log_date);
create index if not exists idx_tx_user_date on public.transactions(user_id, spent_at);
create index if not exists idx_events_user_start on public.events(user_id, starts_at);

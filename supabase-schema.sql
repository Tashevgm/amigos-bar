create extension if not exists pgcrypto;

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('food', 'cocktails', 'soft', 'beer', 'spirits', 'desserts')),
  color text not null default 'green' check (color in ('green', 'pink', 'blue', 'orange', 'black')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  size text,
  price numeric(8, 2) not null check (price >= 0),
  sort_order integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  title text not null,
  label text,
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_date date not null,
  reservation_time time not null,
  guest_name text not null,
  guests integer not null check (guests > 0),
  phone text,
  note text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_menu_categories_updated_at on public.menu_categories;
create trigger set_menu_categories_updated_at
before update on public.menu_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

create index if not exists menu_categories_sort_idx on public.menu_categories(sort_order, title);
create index if not exists menu_items_category_sort_idx on public.menu_items(category_id, sort_order, name);
create index if not exists events_public_date_idx on public.events(event_date) where is_public = true;
create index if not exists reservations_date_time_idx on public.reservations(reservation_date, reservation_time);

alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.events enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "Public can read menu categories" on public.menu_categories;
create policy "Public can read menu categories"
on public.menu_categories for select
to anon, authenticated
using (true);

drop policy if exists "Public can read available menu items" on public.menu_items;
create policy "Public can read available menu items"
on public.menu_items for select
to anon, authenticated
using (is_available = true);

drop policy if exists "Public can read public events" on public.events;
create policy "Public can read public events"
on public.events for select
to anon, authenticated
using (is_public = true);

drop policy if exists "Public can create reservations" on public.reservations;
create policy "Public can create reservations"
on public.reservations for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "Authenticated owner can manage menu categories" on public.menu_categories;
create policy "Authenticated owner can manage menu categories"
on public.menu_categories for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated owner can manage menu items" on public.menu_items;
create policy "Authenticated owner can manage menu items"
on public.menu_items for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated owner can manage events" on public.events;
create policy "Authenticated owner can manage events"
on public.events for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated owner can manage reservations" on public.reservations;
create policy "Authenticated owner can manage reservations"
on public.reservations for all
to authenticated
using (true)
with check (true);

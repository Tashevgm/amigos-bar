create table if not exists public.qr_scans (
  id uuid primary key default gen_random_uuid(),
  scanned_at timestamptz not null default now(),
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists qr_scans_scanned_at_idx on public.qr_scans(scanned_at desc);

alter table public.qr_scans enable row level security;

drop policy if exists "Public can create QR scans" on public.qr_scans;
create policy "Public can create QR scans"
on public.qr_scans for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated owner can read QR scans" on public.qr_scans;
create policy "Authenticated owner can read QR scans"
on public.qr_scans for select
to authenticated
using (true);

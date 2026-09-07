create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 10 and 24),
  email text,
  requirement text,
  source text not null,
  variant text not null check (variant in ('private-presentation', 'brochure', 'project-details', 'general-enquiry')),
  pathname text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email) where email is not null;

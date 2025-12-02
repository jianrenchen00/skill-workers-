-- Enable pg_trgm extension for Full-text search
create extension if not exists pg_trgm;

-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  wechat_openid text unique,
  wechat_unionid text,
  role text check (role in ('seeker', 'employer', 'admin')) default 'seeker',
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create companies table
create table public.companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  website text,
  logo_url text,
  is_verified_sponsor boolean default false,
  sponsor_license_tier text,
  owner_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on companies
alter table public.companies enable row level security;

-- Companies policies
create policy "Companies are viewable by everyone."
  on companies for select
  using ( true );

create policy "Employers can create companies."
  on companies for insert
  with check ( auth.uid() = owner_id );

create policy "Employers can update own companies."
  on companies for update
  using ( auth.uid() = owner_id );

-- Create visa_sponsors table
create table public.visa_sponsors (
  id uuid default gen_random_uuid() primary key,
  organisation_name text not null,
  town_city text,
  county text,
  type_rating text,
  route text,
  last_synced_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Full-text search index on organisation_name
create index trgm_idx_visa_sponsors_name on public.visa_sponsors using gin (organisation_name gin_trgm_ops);

-- Enable RLS on visa_sponsors
alter table public.visa_sponsors enable row level security;

-- Visa Sponsors policies
create policy "Visa sponsors are viewable by everyone."
  on visa_sponsors for select
  using ( true );

-- Only service role (admin) can insert/update visa_sponsors (handled via API/Cron with service key)

-- Create jobs table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) not null,
  title_en text,
  title_cn text,
  description_en text,
  description_cn text,
  location text,
  salary_range text,
  is_visa_sponsorship_available boolean default false,
  status text check (status in ('draft', 'published', 'closed')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on jobs
alter table public.jobs enable row level security;

-- Jobs policies
create policy "Published jobs are viewable by everyone."
  on jobs for select
  using ( status = 'published' );

create policy "Employers can view own jobs (all statuses)."
  on jobs for select
  using ( auth.uid() in (select owner_id from companies where id = company_id) );

create policy "Employers can insert jobs for own companies."
  on jobs for insert
  with check ( auth.uid() in (select owner_id from companies where id = company_id) );

create policy "Employers can update own jobs."
  on jobs for update
  using ( auth.uid() in (select owner_id from companies where id = company_id) );

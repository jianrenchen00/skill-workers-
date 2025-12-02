-- 1. Create Storage Bucket for Resumes
-- Note: We insert into storage.buckets. If it exists, we do nothing.
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- 2. Enable RLS on storage.objects (usually enabled by default, but good to ensure)
alter table storage.objects enable row level security;

-- 3. Create Storage Policies
-- Allow users to upload their own resumes (folder structure: user_id/filename)
create policy "Users can upload their own resumes"
on storage.objects for insert
with check (
  bucket_id = 'resumes' and
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view/download their own resumes
create policy "Users can view their own resumes"
on storage.objects for select
using (
  bucket_id = 'resumes' and
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update/delete their own resumes
create policy "Users can update their own resumes"
on storage.objects for update
using (
  bucket_id = 'resumes' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own resumes"
on storage.objects for delete
using (
  bucket_id = 'resumes' and
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Create resume_insights table
create table public.resume_insights (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  file_path text not null,
  status text check (status in ('analyzing', 'completed', 'failed')) default 'analyzing',
  
  -- Analysis Data (Stored as JSONB for flexibility)
  -- Structure: { strengths: [], weaknesses: [], recommended_roles: [], skill_gaps: [], interview_tips: [] }
  analysis_data jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable RLS on resume_insights
alter table public.resume_insights enable row level security;

-- 6. Policies for resume_insights
create policy "Users can view their own insights"
on resume_insights for select
using ( auth.uid() = user_id );

create policy "Users can insert their own insights"
on resume_insights for insert
with check ( auth.uid() = user_id );

-- (Optional) Index for faster lookups by user
create index idx_resume_insights_user_id on public.resume_insights(user_id);

-- 1. Insert a Fake Profile (We cannot insert into auth.users directly easily without admin API, 
-- so we assume RLS is disabled or we are running this as superuser/postgres role in SQL Editor)
-- Note: In a real scenario, you would sign up a user first. 
-- For seeding, we will insert a profile with a random UUID. 
-- Since `profiles` references `auth.users`, we usually need a user. 
-- WORKAROUND: For local dev/seeding without auth.users access, we might need to temporarily drop the FK constraint OR 
-- better yet, just insert a dummy user into auth.users if we have permissions (Supabase SQL Editor usually has admin rights).

-- Attempt to insert a dummy user into auth.users (This might fail if not superuser, but usually works in Dashboard SQL Editor)
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'test_employer@example.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Profile linked to that user
INSERT INTO public.profiles (id, role, full_name, avatar_url)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'employer', 'Test Employer', 'https://ui-avatars.com/api/?name=TE')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Fake Companies (Linked to the dummy profile)
INSERT INTO companies (id, name, website, logo_url, is_verified_sponsor, sponsor_license_tier, owner_id)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TechGiant UK', 'https://techgiant.uk', 'https://ui-avatars.com/api/?name=TG&background=0D8ABC&color=fff', true, 'Grade A', '00000000-0000-0000-0000-000000000000'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'StartUp Inc', 'https://startup.io', 'https://ui-avatars.com/api/?name=SU&background=random', false, NULL, '00000000-0000-0000-0000-000000000000'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Global Finance', 'https://globalfinance.com', 'https://ui-avatars.com/api/?name=GF&background=000&color=fff', true, 'Grade A', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Fake Jobs
INSERT INTO jobs (id, company_id, title_en, title_cn, description_en, description_cn, location, salary_range, is_visa_sponsorship_available, status, created_at)
VALUES
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Senior Software Engineer',
    '高级软件工程师',
    'We are looking for an experienced React developer to join our team. Visa sponsorship is available for the right candidate.',
    '我们正在寻找一位经验丰富的 React 开发人员加入我们的团队。为合适应聘者提供签证赞助。',
    'London',
    '£70,000 - £90,000',
    true,
    'published',
    NOW()
  ),
  (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Marketing Manager',
    '市场经理',
    'Join our fast-growing startup. You must have the right to work in the UK.',
    '加入我们快速成长的初创公司。您必须拥有在英国工作的权利。',
    'Manchester',
    '£40,000 - £50,000',
    false,
    'published',
    NOW() - INTERVAL '1 day'
  ),
  (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Data Analyst',
    '数据分析师',
    'Analyze financial data and provide insights. Tier 2 Visa sponsorship available.',
    '分析财务数据并提供见解。提供 Tier 2 签证赞助。',
    'London (Canary Wharf)',
    '£55,000 - £65,000',
    true,
    'published',
    NOW() - INTERVAL '2 days'
  )
ON CONFLICT (id) DO NOTHING;

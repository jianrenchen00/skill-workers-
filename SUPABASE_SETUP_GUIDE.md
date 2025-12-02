# Supabase Setup Guide

## 1. Get Project Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project (or select existing one).
3. Go to **Project Settings** (gear icon) -> **API**.
4. Find **Project URL** and **anon public key**.
5. Copy these values into your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 2. Database Setup
1. In the Supabase Dashboard, go to the **SQL Editor** (terminal icon on the left).
2. Click **New Query**.
3. Open the `setup_db.sql` file in this project.
4. Copy the entire content of `setup_db.sql`.
5. Paste it into the SQL Editor in Supabase.
6. Click **Run** (bottom right).
   - This will create the `profiles`, `companies`, `visa_sponsors`, and `jobs` tables.
   - It will also set up Row Level Security (RLS) policies and indexes.

## 3. Auth Configuration
1. Go to **Authentication** -> **Providers**.
2. Enable **Email** provider (should be on by default).
3. (Optional for now) We will configure WeChat auth later as per the Technical Architecture.

## 4. Storage (Optional for now)
- If we need image uploads (avatars, logos), we will need to create a storage bucket named `public` or similar and add policies. This is not in the initial SQL but can be added later.

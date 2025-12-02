-- Add subscription_status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free';

-- Add stripe_customer_id for future reference (optional but good practice)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id text;

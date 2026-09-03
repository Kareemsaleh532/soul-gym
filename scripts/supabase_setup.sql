-- ===================================================
-- SOUL GYM - Supabase Setup Script
-- Run this in Supabase Dashboard → SQL Editor
-- ===================================================

-- 1. Create the members table
CREATE TABLE IF NOT EXISTS public.members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  plan_type TEXT NOT NULL DEFAULT 'Pro Membership',
  subscription_start TIMESTAMPTZ DEFAULT NOW(),
  subscription_end TIMESTAMPTZ NOT NULL,
  last_check_in TEXT DEFAULT 'Never'
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 3. Allow authenticated users to read all members
CREATE POLICY "Allow authenticated read" ON public.members
  FOR SELECT TO authenticated USING (true);

-- 4. Allow authenticated users to insert members
CREATE POLICY "Allow authenticated insert" ON public.members
  FOR INSERT TO authenticated WITH CHECK (true);

-- 5. Allow authenticated users to update members
CREATE POLICY "Allow authenticated update" ON public.members
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 6. Allow authenticated users to delete members
CREATE POLICY "Allow authenticated delete" ON public.members
  FOR DELETE TO authenticated USING (true);

-- ===================================================
-- DONE! Now go create an admin account:
-- 1. Open the Soul Gym app in your browser
-- 2. Click "إنشاء حساب جديد"
-- 3. Choose "مدير النظام (Admin)" as account type
-- 4. Fill in email & password and register
-- ===================================================

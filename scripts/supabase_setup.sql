-- ===================================================
-- SOUL GYM - Full Supabase Database Setup Script
-- Run this in Supabase Dashboard → SQL Editor
-- ===================================================

-- 1. MEMBERS TABLE (أعضاء النادي)
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

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read members" ON public.members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update members" ON public.members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete members" ON public.members FOR DELETE TO authenticated USING (true);


-- 2. PRODUCTS TABLE (منتجات النادي - البروتينات والمكملات)
CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'بروتينات',
  price NUMERIC NOT NULL,
  image_url TEXT,
  description TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE (Guests & Admin) to view products
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon insert products temp" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);


-- 3. ORDERS TABLE (طلبات الزوار والعملاء)
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_address TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'جديد',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE (Guests) to place orders
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- Fix RLS policies for all admin-managed tables
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- NEWS TABLE: Allow anon full access
DO $$ BEGIN
  -- Drop existing restrictive policies
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.news;
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.news;
  DROP POLICY IF EXISTS "Enable update for users based on email" ON public.news;
  DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.news;
  DROP POLICY IF EXISTS "Allow public read" ON public.news;
  DROP POLICY IF EXISTS "Allow anon write" ON public.news;
  DROP POLICY IF EXISTS "Allow anon insert" ON public.news;
  DROP POLICY IF EXISTS "Allow anon update" ON public.news;
  DROP POLICY IF EXISTS "Allow anon delete" ON public.news;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.news FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.news FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.news FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.news FOR DELETE USING (true);

-- NEWS_CATEGORIES TABLE
DO $$ BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.news_categories;
  DROP POLICY IF EXISTS "Allow public read" ON public.news_categories;
  DROP POLICY IF EXISTS "Allow anon write" ON public.news_categories;
  DROP POLICY IF EXISTS "Allow anon insert" ON public.news_categories;
  DROP POLICY IF EXISTS "Allow anon update" ON public.news_categories;
  DROP POLICY IF EXISTS "Allow anon delete" ON public.news_categories;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.news_categories FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.news_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.news_categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.news_categories FOR DELETE USING (true);

-- COMPANIES TABLE
DO $$ BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.companies;
  DROP POLICY IF EXISTS "Allow public read" ON public.companies;
  DROP POLICY IF EXISTS "Allow anon write" ON public.companies;
  DROP POLICY IF EXISTS "Allow anon insert" ON public.companies;
  DROP POLICY IF EXISTS "Allow anon update" ON public.companies;
  DROP POLICY IF EXISTS "Allow anon delete" ON public.companies;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.companies FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.companies FOR DELETE USING (true);

-- SUB_BRANDS TABLE
DO $$ BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.sub_brands;
  DROP POLICY IF EXISTS "Allow public read" ON public.sub_brands;
  DROP POLICY IF EXISTS "Allow anon insert" ON public.sub_brands;
  DROP POLICY IF EXISTS "Allow anon update" ON public.sub_brands;
  DROP POLICY IF EXISTS "Allow anon delete" ON public.sub_brands;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.sub_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.sub_brands FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.sub_brands FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.sub_brands FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.sub_brands FOR DELETE USING (true);

-- BRANDS TABLE
DO $$ BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.brands;
  DROP POLICY IF EXISTS "Allow public read" ON public.brands;
  DROP POLICY IF EXISTS "Allow anon insert" ON public.brands;
  DROP POLICY IF EXISTS "Allow anon update" ON public.brands;
  DROP POLICY IF EXISTS "Allow anon delete" ON public.brands;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.brands FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.brands FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.brands FOR DELETE USING (true);

-- MENU_ITEMS TABLE
DO $$ BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.menu_items;
  DROP POLICY IF EXISTS "Allow public read" ON public.menu_items;
  DROP POLICY IF EXISTS "Allow anon insert" ON public.menu_items;
  DROP POLICY IF EXISTS "Allow anon update" ON public.menu_items;
  DROP POLICY IF EXISTS "Allow anon delete" ON public.menu_items;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.menu_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.menu_items FOR DELETE USING (true);

-- WHO_WE_ARE_CONTENT TABLE
DO $$ BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.who_we_are_content;
  DROP POLICY IF EXISTS "Allow public read" ON public.who_we_are_content;
  DROP POLICY IF EXISTS "Allow anon insert" ON public.who_we_are_content;
  DROP POLICY IF EXISTS "Allow anon update" ON public.who_we_are_content;
  DROP POLICY IF EXISTS "Allow anon delete" ON public.who_we_are_content;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.who_we_are_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.who_we_are_content FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.who_we_are_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.who_we_are_content FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.who_we_are_content FOR DELETE USING (true);

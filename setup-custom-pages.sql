-- ============================================
-- Custom Pages — Blank page & link creation
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS public.custom_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title_ka text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  content_ka text DEFAULT '',
  content_en text DEFAULT '',
  meta_description_ka text DEFAULT '',
  meta_description_en text DEFAULT '',
  page_type text NOT NULL DEFAULT 'blank' CHECK (page_type IN ('blank', 'link')),
  link_url text DEFAULT '',
  link_target text DEFAULT '_self' CHECK (link_target IN ('_self', '_blank')),
  is_published boolean DEFAULT false,
  show_in_menu boolean DEFAULT false,
  menu_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.custom_pages;
DROP POLICY IF EXISTS "Allow anon write access" ON public.custom_pages;

CREATE POLICY "Allow public read access" ON public.custom_pages FOR SELECT USING (true);
CREATE POLICY "Allow anon write access" ON public.custom_pages FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON public.custom_pages(slug);
CREATE INDEX IF NOT EXISTS idx_custom_pages_published ON public.custom_pages(is_published);

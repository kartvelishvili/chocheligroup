-- ============================================
-- Design Presets System for Chocheli Group Website
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Create table
CREATE TABLE IF NOT EXISTS public.site_design (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL,
  preset_number INTEGER NOT NULL DEFAULT 1,
  preset_name_ka TEXT NOT NULL,
  preset_name_en TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  colors JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(section_key, preset_number)
);

-- RLS Policies
ALTER TABLE public.site_design ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow public read" ON public.site_design;
  DROP POLICY IF EXISTS "Allow anon insert" ON public.site_design;
  DROP POLICY IF EXISTS "Allow anon update" ON public.site_design;
  DROP POLICY IF EXISTS "Allow anon delete" ON public.site_design;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Allow public read" ON public.site_design FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.site_design FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.site_design FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.site_design FOR DELETE USING (true);

-- ============================================
-- Insert 3 presets per section (9 sections × 3 = 27 rows)
-- Theme 1: მუქი ტილი (Dark Teal) — ACTIVE by default
-- Theme 2: სამეფო ლურჯი (Royal Blue)
-- Theme 3: ზურმუხტი & ოქრო (Emerald & Gold)
-- ============================================

INSERT INTO public.site_design (section_key, preset_number, preset_name_ka, preset_name_en, is_active, colors) VALUES

-- ═══════════════════ HEADER (dark) ═══════════════════
('header', 1, 'მუქი ტილი', 'Dark Teal', true,
 '{"bg":"#0a1628","bg2":"#0d1f37","accent":"#14b8a6","accentHover":"#2dd4bf","accentLight":"#5eead4","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.1)","accentBgStrong":"rgba(20,184,166,0.2)","accent2":"#06b6d4","accent2Hover":"#22d3ee","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('header', 2, 'სამეფო ლურჯი', 'Royal Blue', false,
 '{"bg":"#0f172a","bg2":"#1e293b","accent":"#3b82f6","accentHover":"#60a5fa","accentLight":"#93c5fd","accentDark":"#2563eb","accentBg":"rgba(59,130,246,0.1)","accentBgStrong":"rgba(59,130,246,0.2)","accent2":"#8b5cf6","accent2Hover":"#a78bfa","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('header', 3, 'ზურმუხტი & ოქრო', 'Emerald & Gold', false,
 '{"bg":"#022c22","bg2":"#064e3b","accent":"#10b981","accentHover":"#34d399","accentLight":"#6ee7b7","accentDark":"#059669","accentBg":"rgba(16,185,129,0.1)","accentBgStrong":"rgba(16,185,129,0.2)","accent2":"#f59e0b","accent2Hover":"#fbbf24","gradientFrom":"#10b981","gradientTo":"#f59e0b","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- ═══════════════════ HERO (dark) ═══════════════════
('hero', 1, 'მუქი ტილი', 'Dark Teal', true,
 '{"bg":"#0a1628","bg2":"#0d1f37","accent":"#14b8a6","accentHover":"#2dd4bf","accentLight":"#5eead4","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.1)","accentBgStrong":"rgba(20,184,166,0.2)","accent2":"#06b6d4","accent2Hover":"#22d3ee","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('hero', 2, 'სამეფო ლურჯი', 'Royal Blue', false,
 '{"bg":"#0f172a","bg2":"#1e293b","accent":"#3b82f6","accentHover":"#60a5fa","accentLight":"#93c5fd","accentDark":"#2563eb","accentBg":"rgba(59,130,246,0.1)","accentBgStrong":"rgba(59,130,246,0.2)","accent2":"#8b5cf6","accent2Hover":"#a78bfa","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('hero', 3, 'ზურმუხტი & ოქრო', 'Emerald & Gold', false,
 '{"bg":"#022c22","bg2":"#064e3b","accent":"#10b981","accentHover":"#34d399","accentLight":"#6ee7b7","accentDark":"#059669","accentBg":"rgba(16,185,129,0.1)","accentBgStrong":"rgba(16,185,129,0.2)","accent2":"#f59e0b","accent2Hover":"#fbbf24","gradientFrom":"#10b981","gradientTo":"#f59e0b","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- ═══════════════════ STATS (dark) ═══════════════════
('stats', 1, 'მუქი ტილი', 'Dark Teal', true,
 '{"bg":"#0a1628","bg2":"#0d1f37","accent":"#14b8a6","accentHover":"#2dd4bf","accentLight":"#5eead4","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.1)","accentBgStrong":"rgba(20,184,166,0.2)","accent2":"#06b6d4","accent2Hover":"#22d3ee","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('stats', 2, 'სამეფო ლურჯი', 'Royal Blue', false,
 '{"bg":"#0f172a","bg2":"#1e293b","accent":"#3b82f6","accentHover":"#60a5fa","accentLight":"#93c5fd","accentDark":"#2563eb","accentBg":"rgba(59,130,246,0.1)","accentBgStrong":"rgba(59,130,246,0.2)","accent2":"#8b5cf6","accent2Hover":"#a78bfa","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('stats', 3, 'ზურმუხტი & ოქრო', 'Emerald & Gold', false,
 '{"bg":"#022c22","bg2":"#064e3b","accent":"#10b981","accentHover":"#34d399","accentLight":"#6ee7b7","accentDark":"#059669","accentBg":"rgba(16,185,129,0.1)","accentBgStrong":"rgba(16,185,129,0.2)","accent2":"#f59e0b","accent2Hover":"#fbbf24","gradientFrom":"#10b981","gradientTo":"#f59e0b","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- ═══════════════════ ABOUT / WHO WE ARE (light) ═══════════════════
('about', 1, 'მუქი ტილი', 'Dark Teal', true,
 '{"bg":"#ffffff","bg2":"#f8fafc","accent":"#14b8a6","accentHover":"#0d9488","accentLight":"#ccfbf1","accentDark":"#0d9488","accentBg":"#f0fdfa","accentBgStrong":"rgba(20,184,166,0.15)","accent2":"#06b6d4","accent2Hover":"#0891b2","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#334155","textMuted":"#64748b","heading":"#0a1628","cardBg":"#ffffff","cardBorder":"#e2e8f0","cardBgHover":"#f8fafc"}'::jsonb),

('about', 2, 'სამეფო ლურჯი', 'Royal Blue', false,
 '{"bg":"#ffffff","bg2":"#f8fafc","accent":"#3b82f6","accentHover":"#2563eb","accentLight":"#dbeafe","accentDark":"#2563eb","accentBg":"#eff6ff","accentBgStrong":"rgba(59,130,246,0.15)","accent2":"#8b5cf6","accent2Hover":"#7c3aed","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#334155","textMuted":"#64748b","heading":"#0f172a","cardBg":"#ffffff","cardBorder":"#e2e8f0","cardBgHover":"#f8fafc"}'::jsonb),

('about', 3, 'ზურმუხტი & ოქრო', 'Emerald & Gold', false,
 '{"bg":"#ffffff","bg2":"#f0fdf4","accent":"#10b981","accentHover":"#059669","accentLight":"#d1fae5","accentDark":"#059669","accentBg":"#ecfdf5","accentBgStrong":"rgba(16,185,129,0.15)","accent2":"#f59e0b","accent2Hover":"#d97706","gradientFrom":"#10b981","gradientTo":"#f59e0b","text":"#334155","textMuted":"#4b5563","heading":"#022c22","cardBg":"#ffffff","cardBorder":"#d1fae5","cardBgHover":"#f0fdf4"}'::jsonb),

-- ═══════════════════ PRINCIPLES / EXECUTION DNA (light secondary bg) ═══════════════════
('principles', 1, 'მუქი ტილი', 'Dark Teal', true,
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#14b8a6","accentHover":"#0d9488","accentLight":"#ccfbf1","accentDark":"#0d9488","accentBg":"#f0fdfa","accentBgStrong":"rgba(20,184,166,0.15)","accent2":"#06b6d4","accent2Hover":"#0891b2","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#334155","textMuted":"#64748b","heading":"#0a1628","cardBg":"#ffffff","cardBorder":"#e2e8f0","cardBgHover":"#f8fafc"}'::jsonb),

('principles', 2, 'სამეფო ლურჯი', 'Royal Blue', false,
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#3b82f6","accentHover":"#2563eb","accentLight":"#dbeafe","accentDark":"#2563eb","accentBg":"#eff6ff","accentBgStrong":"rgba(59,130,246,0.15)","accent2":"#8b5cf6","accent2Hover":"#7c3aed","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#334155","textMuted":"#64748b","heading":"#0f172a","cardBg":"#ffffff","cardBorder":"#e2e8f0","cardBgHover":"#f8fafc"}'::jsonb),

('principles', 3, 'ზურმუხტი & ოქრო', 'Emerald & Gold', false,
 '{"bg":"#f0fdf4","bg2":"#ffffff","accent":"#10b981","accentHover":"#059669","accentLight":"#d1fae5","accentDark":"#059669","accentBg":"#ecfdf5","accentBgStrong":"rgba(16,185,129,0.15)","accent2":"#f59e0b","accent2Hover":"#d97706","gradientFrom":"#10b981","gradientTo":"#f59e0b","text":"#334155","textMuted":"#4b5563","heading":"#022c22","cardBg":"#ffffff","cardBorder":"#d1fae5","cardBgHover":"#f0fdf4"}'::jsonb),

-- ═══════════════════ PORTFOLIO (light) ═══════════════════
('portfolio', 1, 'მუქი ტილი', 'Dark Teal', true,
 '{"bg":"#ffffff","bg2":"#f8fafc","accent":"#14b8a6","accentHover":"#0d9488","accentLight":"#ccfbf1","accentDark":"#0d9488","accentBg":"#f0fdfa","accentBgStrong":"rgba(20,184,166,0.15)","accent2":"#06b6d4","accent2Hover":"#0891b2","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#334155","textMuted":"#64748b","heading":"#0a1628","cardBg":"#ffffff","cardBorder":"#e2e8f0","cardBgHover":"#f8fafc"}'::jsonb),

('portfolio', 2, 'სამეფო ლურჯი', 'Royal Blue', false,
 '{"bg":"#ffffff","bg2":"#f8fafc","accent":"#3b82f6","accentHover":"#2563eb","accentLight":"#dbeafe","accentDark":"#2563eb","accentBg":"#eff6ff","accentBgStrong":"rgba(59,130,246,0.15)","accent2":"#8b5cf6","accent2Hover":"#7c3aed","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#334155","textMuted":"#64748b","heading":"#0f172a","cardBg":"#ffffff","cardBorder":"#e2e8f0","cardBgHover":"#f8fafc"}'::jsonb),

('portfolio', 3, 'ზურმუხტი & ოქრო', 'Emerald & Gold', false,
 '{"bg":"#ffffff","bg2":"#f0fdf4","accent":"#10b981","accentHover":"#059669","accentLight":"#d1fae5","accentDark":"#059669","accentBg":"#ecfdf5","accentBgStrong":"rgba(16,185,129,0.15)","accent2":"#f59e0b","accent2Hover":"#d97706","gradientFrom":"#10b981","gradientTo":"#f59e0b","text":"#334155","textMuted":"#4b5563","heading":"#022c22","cardBg":"#ffffff","cardBorder":"#d1fae5","cardBgHover":"#f0fdf4"}'::jsonb),

-- ═══════════════════ FOUNDER (dark) ═══════════════════
('founder', 1, 'მუქი ტილი', 'Dark Teal', true,
 '{"bg":"#0a1628","bg2":"#0d1f37","accent":"#14b8a6","accentHover":"#2dd4bf","accentLight":"#5eead4","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.1)","accentBgStrong":"rgba(20,184,166,0.2)","accent2":"#06b6d4","accent2Hover":"#22d3ee","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('founder', 2, 'სამეფო ლურჯი', 'Royal Blue', false,
 '{"bg":"#0f172a","bg2":"#1e293b","accent":"#3b82f6","accentHover":"#60a5fa","accentLight":"#93c5fd","accentDark":"#2563eb","accentBg":"rgba(59,130,246,0.1)","accentBgStrong":"rgba(59,130,246,0.2)","accent2":"#8b5cf6","accent2Hover":"#a78bfa","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('founder', 3, 'ზურმუხტი & ოქრო', 'Emerald & Gold', false,
 '{"bg":"#022c22","bg2":"#064e3b","accent":"#10b981","accentHover":"#34d399","accentLight":"#6ee7b7","accentDark":"#059669","accentBg":"rgba(16,185,129,0.1)","accentBgStrong":"rgba(16,185,129,0.2)","accent2":"#f59e0b","accent2Hover":"#fbbf24","gradientFrom":"#10b981","gradientTo":"#f59e0b","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- ═══════════════════ NEWS (light) ═══════════════════
('news', 1, 'მუქი ტილი', 'Dark Teal', true,
 '{"bg":"#ffffff","bg2":"#f8fafc","accent":"#14b8a6","accentHover":"#0d9488","accentLight":"#ccfbf1","accentDark":"#0d9488","accentBg":"#f0fdfa","accentBgStrong":"rgba(20,184,166,0.15)","accent2":"#06b6d4","accent2Hover":"#0891b2","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#334155","textMuted":"#64748b","heading":"#0a1628","cardBg":"#ffffff","cardBorder":"#e2e8f0","cardBgHover":"#f8fafc"}'::jsonb),

('news', 2, 'სამეფო ლურჯი', 'Royal Blue', false,
 '{"bg":"#ffffff","bg2":"#f8fafc","accent":"#3b82f6","accentHover":"#2563eb","accentLight":"#dbeafe","accentDark":"#2563eb","accentBg":"#eff6ff","accentBgStrong":"rgba(59,130,246,0.15)","accent2":"#8b5cf6","accent2Hover":"#7c3aed","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#334155","textMuted":"#64748b","heading":"#0f172a","cardBg":"#ffffff","cardBorder":"#e2e8f0","cardBgHover":"#f8fafc"}'::jsonb),

('news', 3, 'ზურმუხტი & ოქრო', 'Emerald & Gold', false,
 '{"bg":"#ffffff","bg2":"#f0fdf4","accent":"#10b981","accentHover":"#059669","accentLight":"#d1fae5","accentDark":"#059669","accentBg":"#ecfdf5","accentBgStrong":"rgba(16,185,129,0.15)","accent2":"#f59e0b","accent2Hover":"#d97706","gradientFrom":"#10b981","gradientTo":"#f59e0b","text":"#334155","textMuted":"#4b5563","heading":"#022c22","cardBg":"#ffffff","cardBorder":"#d1fae5","cardBgHover":"#f0fdf4"}'::jsonb),

-- ═══════════════════ FOOTER (dark) ═══════════════════
('footer', 1, 'მუქი ტილი', 'Dark Teal', true,
 '{"bg":"#0a1628","bg2":"#0d1f37","accent":"#14b8a6","accentHover":"#2dd4bf","accentLight":"#5eead4","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.1)","accentBgStrong":"rgba(20,184,166,0.2)","accent2":"#06b6d4","accent2Hover":"#22d3ee","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('footer', 2, 'სამეფო ლურჯი', 'Royal Blue', false,
 '{"bg":"#0f172a","bg2":"#1e293b","accent":"#3b82f6","accentHover":"#60a5fa","accentLight":"#93c5fd","accentDark":"#2563eb","accentBg":"rgba(59,130,246,0.1)","accentBgStrong":"rgba(59,130,246,0.2)","accent2":"#8b5cf6","accent2Hover":"#a78bfa","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('footer', 3, 'ზურმუხტი & ოქრო', 'Emerald & Gold', false,
 '{"bg":"#022c22","bg2":"#064e3b","accent":"#10b981","accentHover":"#34d399","accentLight":"#6ee7b7","accentDark":"#059669","accentBg":"rgba(16,185,129,0.1)","accentBgStrong":"rgba(16,185,129,0.2)","accent2":"#f59e0b","accent2Hover":"#fbbf24","gradientFrom":"#10b981","gradientTo":"#f59e0b","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb);

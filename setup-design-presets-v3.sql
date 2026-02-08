-- ============================================
-- Design Presets v3 — Corporate Blue (#1a3a52) + Yellow (#F4C430)
-- Run AFTER setup-design-presets.sql AND setup-design-presets-v2.sql
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- ═══════════════════ PRESET 5 — კორპორატიული ლურჯი & ყვითელი ═══════════════════
-- Dominant: #1a3a52 (Corporate Blue)
-- Accent: #F4C430 (Corporate Yellow)

INSERT INTO public.site_design (section_key, preset_number, preset_name_ka, preset_name_en, is_active, layout, colors) VALUES

-- ─── 9 MAIN SECTIONS (preset_number = 5) ───

-- Header (dark: corporate blue bg, yellow accent)
('header', 9, 'კორპორატიული', 'Corporate', false, 'pill',
 '{"bg":"#1a3a52","bg2":"#143044","accent":"#F4C430","accentHover":"#f7d260","accentLight":"#fbe89a","accentDark":"#d4a820","accentBg":"rgba(244,196,48,0.1)","accentBgStrong":"rgba(244,196,48,0.2)","accent2":"#e8b817","accent2Hover":"#f0c940","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#ffffff","textMuted":"#94b0c4","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.1)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- Hero (dark: deep blue bg, yellow accents)
('hero', 5, 'კორპორატიული', 'Corporate', false, 'default',
 '{"bg":"#1a3a52","bg2":"#143044","accent":"#F4C430","accentHover":"#f7d260","accentLight":"#fbe89a","accentDark":"#d4a820","accentBg":"rgba(244,196,48,0.1)","accentBgStrong":"rgba(244,196,48,0.2)","accent2":"#e8b817","accent2Hover":"#f0c940","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#ffffff","textMuted":"#94b0c4","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.1)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- Stats (dark: slightly lighter blue bg)
('stats', 5, 'კორპორატიული', 'Corporate', false, 'default',
 '{"bg":"#1a3a52","bg2":"#224a66","accent":"#F4C430","accentHover":"#f7d260","accentLight":"#fbe89a","accentDark":"#d4a820","accentBg":"rgba(244,196,48,0.1)","accentBgStrong":"rgba(244,196,48,0.2)","accent2":"#e8b817","accent2Hover":"#f0c940","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#ffffff","textMuted":"#94b0c4","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.1)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- About (light: cream bg, corporate blue heading, yellow accent)
('about', 5, 'კორპორატიული', 'Corporate', false, 'default',
 '{"bg":"#faf8f4","bg2":"#ffffff","accent":"#F4C430","accentHover":"#d4a820","accentLight":"#fef6d8","accentDark":"#b89218","accentBg":"rgba(244,196,48,0.08)","accentBgStrong":"rgba(244,196,48,0.15)","accent2":"#1a3a52","accent2Hover":"#224a66","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#334155","textMuted":"#64748b","heading":"#1a3a52","cardBg":"#ffffff","cardBorder":"#e2ddd4","cardBgHover":"#fef9ee"}'::jsonb),

-- Principles (light: off-white, blue headings)
('principles', 5, 'კორპორატიული', 'Corporate', false, 'default',
 '{"bg":"#f5f2ec","bg2":"#ffffff","accent":"#F4C430","accentHover":"#d4a820","accentLight":"#fef6d8","accentDark":"#b89218","accentBg":"rgba(244,196,48,0.08)","accentBgStrong":"rgba(244,196,48,0.15)","accent2":"#1a3a52","accent2Hover":"#224a66","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#334155","textMuted":"#64748b","heading":"#1a3a52","cardBg":"#ffffff","cardBorder":"#e2ddd4","cardBgHover":"#fef9ee"}'::jsonb),

-- Portfolio (light: white bg)
('portfolio', 5, 'კორპორატიული', 'Corporate', false, 'default',
 '{"bg":"#ffffff","bg2":"#faf8f4","accent":"#F4C430","accentHover":"#d4a820","accentLight":"#fef6d8","accentDark":"#b89218","accentBg":"rgba(244,196,48,0.08)","accentBgStrong":"rgba(244,196,48,0.15)","accent2":"#1a3a52","accent2Hover":"#224a66","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#334155","textMuted":"#64748b","heading":"#1a3a52","cardBg":"#ffffff","cardBorder":"#e2ddd4","cardBgHover":"#fef9ee"}'::jsonb),

-- Founder (dark: corporate blue bg)
('founder', 5, 'კორპორატიული', 'Corporate', false, 'default',
 '{"bg":"#1a3a52","bg2":"#143044","accent":"#F4C430","accentHover":"#f7d260","accentLight":"#fbe89a","accentDark":"#d4a820","accentBg":"rgba(244,196,48,0.1)","accentBgStrong":"rgba(244,196,48,0.2)","accent2":"#e8b817","accent2Hover":"#f0c940","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#ffffff","textMuted":"#94b0c4","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.1)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- News (light: warm white)
('news', 5, 'კორპორატიული', 'Corporate', false, 'default',
 '{"bg":"#faf8f4","bg2":"#f5f2ec","accent":"#F4C430","accentHover":"#d4a820","accentLight":"#fef6d8","accentDark":"#b89218","accentBg":"rgba(244,196,48,0.08)","accentBgStrong":"rgba(244,196,48,0.15)","accent2":"#1a3a52","accent2Hover":"#224a66","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#334155","textMuted":"#64748b","heading":"#1a3a52","cardBg":"#ffffff","cardBorder":"#e2ddd4","cardBgHover":"#fef9ee"}'::jsonb),

-- Footer (dark: deep corporate blue)
('footer', 5, 'კორპორატიული', 'Corporate', false, 'default',
 '{"bg":"#1a3a52","bg2":"#143044","accent":"#F4C430","accentHover":"#f7d260","accentLight":"#fbe89a","accentDark":"#d4a820","accentBg":"rgba(244,196,48,0.1)","accentBgStrong":"rgba(244,196,48,0.2)","accent2":"#e8b817","accent2Hover":"#f0c940","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#ffffff","textMuted":"#94b0c4","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.1)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- ─── HEADER LAYOUT VARIANTS (corporate theme) ───

-- Corporate — Classic layout
('header', 10, 'კორპორატიული — კლასიკური', 'Corporate — Classic', false, 'classic',
 '{"bg":"#1a3a52","bg2":"#143044","accent":"#F4C430","accentHover":"#f7d260","accentLight":"#fbe89a","accentDark":"#d4a820","accentBg":"rgba(244,196,48,0.1)","accentBgStrong":"rgba(244,196,48,0.2)","accent2":"#e8b817","accent2Hover":"#f0c940","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#ffffff","textMuted":"#94b0c4","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.1)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- Corporate — Underline layout
('header', 11, 'კორპორატიული — ქვედა ხაზი', 'Corporate — Underline', false, 'underline',
 '{"bg":"#1a3a52","bg2":"#143044","accent":"#F4C430","accentHover":"#f7d260","accentLight":"#fbe89a","accentDark":"#d4a820","accentBg":"rgba(244,196,48,0.1)","accentBgStrong":"rgba(244,196,48,0.2)","accent2":"#e8b817","accent2Hover":"#f0c940","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#ffffff","textMuted":"#94b0c4","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.1)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

-- ─── INNER PAGE PRESETS (preset_number 4 for each page) ───

-- Founder page — Corporate
('page_founder', 4, 'კორპორატიული', 'Corporate', false, 'classic',
 '{"bg":"#faf8f4","bg2":"#ffffff","accent":"#F4C430","accentHover":"#d4a820","accentLight":"#fef6d8","accentDark":"#b89218","accentBg":"rgba(244,196,48,0.08)","accentBgStrong":"rgba(244,196,48,0.15)","accent2":"#1a3a52","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#334155","textMuted":"#64748b","heading":"#1a3a52","heroBg":"#1a3a52","heroText":"#ffffff","heroAccent":"#F4C430","cardBg":"#ffffff","cardBorder":"#e2ddd4"}'::jsonb),

-- About page — Corporate
('page_about', 4, 'კორპორატიული', 'Corporate', false, 'classic',
 '{"bg":"#ffffff","bg2":"#faf8f4","accent":"#F4C430","accentHover":"#d4a820","accentLight":"#fef6d8","accentDark":"#b89218","accentBg":"rgba(244,196,48,0.08)","accentBgStrong":"rgba(244,196,48,0.15)","accent2":"#1a3a52","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#334155","textMuted":"#64748b","heading":"#1a3a52","heroBg":"#1a3a52","heroText":"#ffffff","heroAccent":"#F4C430","cardBg":"#ffffff","cardBorder":"#e2ddd4"}'::jsonb),

-- Portfolio page — Corporate
('page_portfolio', 4, 'კორპორატიული', 'Corporate', false, 'timeline',
 '{"bg":"#faf8f4","bg2":"#ffffff","accent":"#F4C430","accentHover":"#d4a820","accentLight":"#fef6d8","accentDark":"#b89218","accentBg":"rgba(244,196,48,0.08)","accentBgStrong":"rgba(244,196,48,0.15)","accent2":"#1a3a52","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#334155","textMuted":"#64748b","heading":"#1a3a52","heroBg":"#1a3a52","heroText":"#ffffff","heroAccent":"#F4C430","cardBg":"#ffffff","cardBorder":"#e2ddd4"}'::jsonb),

-- News page — Corporate
('page_news', 4, 'კორპორატიული', 'Corporate', false, 'grid',
 '{"bg":"#faf8f4","bg2":"#ffffff","accent":"#F4C430","accentHover":"#d4a820","accentLight":"#fef6d8","accentDark":"#b89218","accentBg":"rgba(244,196,48,0.08)","accentBgStrong":"rgba(244,196,48,0.15)","accent2":"#1a3a52","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#334155","textMuted":"#64748b","heading":"#1a3a52","heroBg":"#1a3a52","heroText":"#ffffff","heroAccent":"#F4C430","cardBg":"#ffffff","cardBorder":"#e2ddd4"}'::jsonb),

-- News detail page — Corporate
('page_news_detail', 4, 'კორპორატიული', 'Corporate', false, 'classic',
 '{"bg":"#ffffff","bg2":"#faf8f4","accent":"#F4C430","accentHover":"#d4a820","accentLight":"#fef6d8","accentDark":"#b89218","accentBg":"rgba(244,196,48,0.08)","accentBgStrong":"rgba(244,196,48,0.15)","accent2":"#1a3a52","gradientFrom":"#F4C430","gradientTo":"#e8b817","text":"#334155","textMuted":"#64748b","heading":"#1a3a52","heroBg":"#1a3a52","heroText":"#ffffff","heroAccent":"#F4C430","cardBg":"#ffffff","cardBorder":"#e2ddd4"}'::jsonb)

ON CONFLICT (section_key, preset_number) DO UPDATE SET
  preset_name_ka = EXCLUDED.preset_name_ka,
  preset_name_en = EXCLUDED.preset_name_en,
  layout = EXCLUDED.layout,
  colors = EXCLUDED.colors;

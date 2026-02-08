-- ============================================
-- Design Presets v2 — Run AFTER setup-design-presets.sql
-- Adds: 4th palette, Header layout variants, Inner page presets
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- ═══════════════════ 1) ADD LAYOUT COLUMN ═══════════════════
ALTER TABLE public.site_design ADD COLUMN IF NOT EXISTS layout TEXT DEFAULT 'default';

-- ═══════════════════ 2) PRESET 4 — მუქი შავი & ოქრო (Black & Gold #dea36d) ═══════════════════

INSERT INTO public.site_design (section_key, preset_number, preset_name_ka, preset_name_en, is_active, layout, colors) VALUES

-- Header
('header', 4, 'შავი & ოქრო', 'Black & Gold', false, 'default',
 '{"bg":"#0c0c0e","bg2":"#1a1a1f","accent":"#dea36d","accentHover":"#e8b887","accentLight":"#f0d0a8","accentDark":"#c48a4f","accentBg":"rgba(222,163,109,0.1)","accentBgStrong":"rgba(222,163,109,0.2)","accent2":"#c9a050","accent2Hover":"#d4b06a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#ffffff","textMuted":"#9ca3af","heading":"#ffffff","cardBg":"rgba(255,255,255,0.04)","cardBorder":"rgba(255,255,255,0.06)","cardBgHover":"rgba(255,255,255,0.08)"}'::jsonb),

-- Hero
('hero', 4, 'შავი & ოქრო', 'Black & Gold', false, 'default',
 '{"bg":"#0c0c0e","bg2":"#1a1a1f","accent":"#dea36d","accentHover":"#e8b887","accentLight":"#f0d0a8","accentDark":"#c48a4f","accentBg":"rgba(222,163,109,0.1)","accentBgStrong":"rgba(222,163,109,0.2)","accent2":"#c9a050","accent2Hover":"#d4b06a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#ffffff","textMuted":"#9ca3af","heading":"#ffffff","cardBg":"rgba(255,255,255,0.04)","cardBorder":"rgba(255,255,255,0.06)","cardBgHover":"rgba(255,255,255,0.08)"}'::jsonb),

-- Stats
('stats', 4, 'შავი & ოქრო', 'Black & Gold', false, 'default',
 '{"bg":"#0c0c0e","bg2":"#1a1a1f","accent":"#dea36d","accentHover":"#e8b887","accentLight":"#f0d0a8","accentDark":"#c48a4f","accentBg":"rgba(222,163,109,0.1)","accentBgStrong":"rgba(222,163,109,0.2)","accent2":"#c9a050","accent2Hover":"#d4b06a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#ffffff","textMuted":"#9ca3af","heading":"#ffffff","cardBg":"rgba(255,255,255,0.04)","cardBorder":"rgba(255,255,255,0.06)","cardBgHover":"rgba(255,255,255,0.08)"}'::jsonb),

-- About
('about', 4, 'შავი & ოქრო', 'Black & Gold', false, 'default',
 '{"bg":"#faf9f7","bg2":"#f3f0ec","accent":"#dea36d","accentHover":"#c48a4f","accentLight":"#fdf0e4","accentDark":"#b07840","accentBg":"#fdf7f0","accentBgStrong":"rgba(222,163,109,0.15)","accent2":"#c9a050","accent2Hover":"#b08a3a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#2d2d2d","textMuted":"#6b6b6b","heading":"#0c0c0e","cardBg":"#ffffff","cardBorder":"#e8e0d8","cardBgHover":"#fdf7f0"}'::jsonb),

-- Principles
('principles', 4, 'შავი & ოქრო', 'Black & Gold', false, 'default',
 '{"bg":"#f3f0ec","bg2":"#ffffff","accent":"#dea36d","accentHover":"#c48a4f","accentLight":"#fdf0e4","accentDark":"#b07840","accentBg":"#fdf7f0","accentBgStrong":"rgba(222,163,109,0.15)","accent2":"#c9a050","accent2Hover":"#b08a3a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#2d2d2d","textMuted":"#6b6b6b","heading":"#0c0c0e","cardBg":"#ffffff","cardBorder":"#e8e0d8","cardBgHover":"#fdf7f0"}'::jsonb),

-- Portfolio
('portfolio', 4, 'შავი & ოქრო', 'Black & Gold', false, 'default',
 '{"bg":"#ffffff","bg2":"#faf9f7","accent":"#dea36d","accentHover":"#c48a4f","accentLight":"#fdf0e4","accentDark":"#b07840","accentBg":"#fdf7f0","accentBgStrong":"rgba(222,163,109,0.15)","accent2":"#c9a050","accent2Hover":"#b08a3a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#2d2d2d","textMuted":"#6b6b6b","heading":"#0c0c0e","cardBg":"#ffffff","cardBorder":"#e8e0d8","cardBgHover":"#fdf7f0"}'::jsonb),

-- Founder
('founder', 4, 'შავი & ოქრო', 'Black & Gold', false, 'default',
 '{"bg":"#0c0c0e","bg2":"#1a1a1f","accent":"#dea36d","accentHover":"#e8b887","accentLight":"#f0d0a8","accentDark":"#c48a4f","accentBg":"rgba(222,163,109,0.1)","accentBgStrong":"rgba(222,163,109,0.2)","accent2":"#c9a050","accent2Hover":"#d4b06a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#ffffff","textMuted":"#9ca3af","heading":"#ffffff","cardBg":"rgba(255,255,255,0.04)","cardBorder":"rgba(255,255,255,0.06)","cardBgHover":"rgba(255,255,255,0.08)"}'::jsonb),

-- News
('news', 4, 'შავი & ოქრო', 'Black & Gold', false, 'default',
 '{"bg":"#faf9f7","bg2":"#f3f0ec","accent":"#dea36d","accentHover":"#c48a4f","accentLight":"#fdf0e4","accentDark":"#b07840","accentBg":"#fdf7f0","accentBgStrong":"rgba(222,163,109,0.15)","accent2":"#c9a050","accent2Hover":"#b08a3a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#2d2d2d","textMuted":"#6b6b6b","heading":"#0c0c0e","cardBg":"#ffffff","cardBorder":"#e8e0d8","cardBgHover":"#fdf7f0"}'::jsonb),

-- Footer
('footer', 4, 'შავი & ოქრო', 'Black & Gold', false, 'default',
 '{"bg":"#0c0c0e","bg2":"#1a1a1f","accent":"#dea36d","accentHover":"#e8b887","accentLight":"#f0d0a8","accentDark":"#c48a4f","accentBg":"rgba(222,163,109,0.1)","accentBgStrong":"rgba(222,163,109,0.2)","accent2":"#c9a050","accent2Hover":"#d4b06a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#ffffff","textMuted":"#9ca3af","heading":"#ffffff","cardBg":"rgba(255,255,255,0.04)","cardBorder":"rgba(255,255,255,0.06)","cardBgHover":"rgba(255,255,255,0.08)"}'::jsonb)

ON CONFLICT (section_key, preset_number) DO UPDATE SET
  preset_name_ka = EXCLUDED.preset_name_ka,
  preset_name_en = EXCLUDED.preset_name_en,
  layout = EXCLUDED.layout,
  colors = EXCLUDED.colors;

-- ═══════════════════ 3) HEADER LAYOUT VARIANTS ═══════════════════
-- Update existing header presets to have layout column
UPDATE public.site_design SET layout = 'pill' WHERE section_key = 'header' AND preset_number IN (1, 2, 3);
UPDATE public.site_design SET layout = 'pill' WHERE section_key = 'header' AND preset_number = 4;

-- Add alternative header layouts 
INSERT INTO public.site_design (section_key, preset_number, preset_name_ka, preset_name_en, is_active, layout, colors) VALUES
('header', 5, 'მუქი ტილი — კლასიკური', 'Dark Teal — Classic', false, 'classic',
 '{"bg":"#0a1628","bg2":"#0d1f37","accent":"#14b8a6","accentHover":"#2dd4bf","accentLight":"#5eead4","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.1)","accentBgStrong":"rgba(20,184,166,0.2)","accent2":"#06b6d4","accent2Hover":"#22d3ee","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('header', 6, 'შავი & ოქრო — კლასიკური', 'Black & Gold — Classic', false, 'classic',
 '{"bg":"#0c0c0e","bg2":"#1a1a1f","accent":"#dea36d","accentHover":"#e8b887","accentLight":"#f0d0a8","accentDark":"#c48a4f","accentBg":"rgba(222,163,109,0.1)","accentBgStrong":"rgba(222,163,109,0.2)","accent2":"#c9a050","accent2Hover":"#d4b06a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#ffffff","textMuted":"#9ca3af","heading":"#ffffff","cardBg":"rgba(255,255,255,0.04)","cardBorder":"rgba(255,255,255,0.06)","cardBgHover":"rgba(255,255,255,0.08)"}'::jsonb),

('header', 7, 'მუქი ტილი — ქვედა ხაზი', 'Dark Teal — Underline', false, 'underline',
 '{"bg":"#0a1628","bg2":"#0d1f37","accent":"#14b8a6","accentHover":"#2dd4bf","accentLight":"#5eead4","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.1)","accentBgStrong":"rgba(20,184,166,0.2)","accent2":"#06b6d4","accent2Hover":"#22d3ee","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#ffffff","textMuted":"#94a3b8","heading":"#ffffff","cardBg":"rgba(255,255,255,0.06)","cardBorder":"rgba(255,255,255,0.08)","cardBgHover":"rgba(255,255,255,0.1)"}'::jsonb),

('header', 8, 'შავი & ოქრო — ქვედა ხაზი', 'Black & Gold — Underline', false, 'underline',
 '{"bg":"#0c0c0e","bg2":"#1a1a1f","accent":"#dea36d","accentHover":"#e8b887","accentLight":"#f0d0a8","accentDark":"#c48a4f","accentBg":"rgba(222,163,109,0.1)","accentBgStrong":"rgba(222,163,109,0.2)","accent2":"#c9a050","accent2Hover":"#d4b06a","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#ffffff","textMuted":"#9ca3af","heading":"#ffffff","cardBg":"rgba(255,255,255,0.04)","cardBorder":"rgba(255,255,255,0.06)","cardBgHover":"rgba(255,255,255,0.08)"}'::jsonb),

-- ═══════════════════ 4) INNER PAGE PRESETS ═══════════════════

-- FOUNDER PAGE (layout: classic, modern, cinematic)
('page_founder', 1, 'კლასიკური — ტილი', 'Classic — Teal', true, 'classic',
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#14b8a6","accentHover":"#0d9488","accentLight":"#ccfbf1","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.08)","accentBgStrong":"rgba(20,184,166,0.15)","accent2":"#06b6d4","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#334155","textMuted":"#64748b","heading":"#0a1628","heroBg":"#0a1628","heroText":"#ffffff","heroAccent":"#14b8a6","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_founder', 2, 'მოდერნისტული — ლურჯი', 'Modern — Blue', false, 'modern',
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#3b82f6","accentHover":"#2563eb","accentLight":"#dbeafe","accentDark":"#1d4ed8","accentBg":"rgba(59,130,246,0.08)","accentBgStrong":"rgba(59,130,246,0.15)","accent2":"#8b5cf6","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#334155","textMuted":"#64748b","heading":"#0f172a","heroBg":"#0f172a","heroText":"#ffffff","heroAccent":"#60a5fa","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_founder', 3, 'კინემატოგრაფიული — ოქრო', 'Cinematic — Gold', false, 'cinematic',
 '{"bg":"#faf9f7","bg2":"#ffffff","accent":"#dea36d","accentHover":"#c48a4f","accentLight":"#fdf0e4","accentDark":"#b07840","accentBg":"rgba(222,163,109,0.08)","accentBgStrong":"rgba(222,163,109,0.15)","accent2":"#c9a050","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#2d2d2d","textMuted":"#6b6b6b","heading":"#0c0c0e","heroBg":"#0c0c0e","heroText":"#ffffff","heroAccent":"#dea36d","cardBg":"#ffffff","cardBorder":"#e8e0d8"}'::jsonb),

-- ABOUT PAGE (layout: classic, cards, split)
('page_about', 1, 'კლასიკური — ტილი', 'Classic — Teal', true, 'classic',
 '{"bg":"#ffffff","bg2":"#f8fafc","accent":"#14b8a6","accentHover":"#0d9488","accentLight":"#ccfbf1","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.08)","accentBgStrong":"rgba(20,184,166,0.15)","accent2":"#06b6d4","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#334155","textMuted":"#64748b","heading":"#0a1628","heroBg":"#0a1628","heroText":"#ffffff","heroAccent":"#14b8a6","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_about', 2, 'ბარათებით — ლურჯი', 'Cards — Blue', false, 'cards',
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#3b82f6","accentHover":"#2563eb","accentLight":"#dbeafe","accentDark":"#1d4ed8","accentBg":"rgba(59,130,246,0.08)","accentBgStrong":"rgba(59,130,246,0.15)","accent2":"#8b5cf6","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#334155","textMuted":"#64748b","heading":"#0f172a","heroBg":"#0f172a","heroText":"#ffffff","heroAccent":"#60a5fa","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_about', 3, 'გაყოფილი — ოქრო', 'Split — Gold', false, 'split',
 '{"bg":"#faf9f7","bg2":"#ffffff","accent":"#dea36d","accentHover":"#c48a4f","accentLight":"#fdf0e4","accentDark":"#b07840","accentBg":"rgba(222,163,109,0.08)","accentBgStrong":"rgba(222,163,109,0.15)","accent2":"#c9a050","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#2d2d2d","textMuted":"#6b6b6b","heading":"#0c0c0e","heroBg":"#0c0c0e","heroText":"#ffffff","heroAccent":"#dea36d","cardBg":"#ffffff","cardBorder":"#e8e0d8"}'::jsonb),

-- PORTFOLIO PAGE (layout: timeline, grid, masonry)
('page_portfolio', 1, 'ტაიმლაინი — ტილი', 'Timeline — Teal', true, 'timeline',
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#14b8a6","accentHover":"#0d9488","accentLight":"#ccfbf1","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.08)","accentBgStrong":"rgba(20,184,166,0.15)","accent2":"#06b6d4","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#334155","textMuted":"#64748b","heading":"#0a1628","heroBg":"#0a1628","heroText":"#ffffff","heroAccent":"#14b8a6","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_portfolio', 2, 'ბარათებით — ლურჯი', 'Grid — Blue', false, 'grid',
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#3b82f6","accentHover":"#2563eb","accentLight":"#dbeafe","accentDark":"#1d4ed8","accentBg":"rgba(59,130,246,0.08)","accentBgStrong":"rgba(59,130,246,0.15)","accent2":"#8b5cf6","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#334155","textMuted":"#64748b","heading":"#0f172a","heroBg":"#0f172a","heroText":"#ffffff","heroAccent":"#60a5fa","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_portfolio', 3, 'მოზაიკა — ოქრო', 'Masonry — Gold', false, 'masonry',
 '{"bg":"#faf9f7","bg2":"#ffffff","accent":"#dea36d","accentHover":"#c48a4f","accentLight":"#fdf0e4","accentDark":"#b07840","accentBg":"rgba(222,163,109,0.08)","accentBgStrong":"rgba(222,163,109,0.15)","accent2":"#c9a050","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#2d2d2d","textMuted":"#6b6b6b","heading":"#0c0c0e","heroBg":"#0c0c0e","heroText":"#ffffff","heroAccent":"#dea36d","cardBg":"#ffffff","cardBorder":"#e8e0d8"}'::jsonb),

-- NEWS PAGE (layout: grid, list, magazine)
('page_news', 1, 'ბადე — ტილი', 'Grid — Teal', true, 'grid',
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#14b8a6","accentHover":"#0d9488","accentLight":"#ccfbf1","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.08)","accentBgStrong":"rgba(20,184,166,0.15)","accent2":"#06b6d4","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#334155","textMuted":"#64748b","heading":"#0a1628","heroBg":"#0a1628","heroText":"#ffffff","heroAccent":"#14b8a6","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_news', 2, 'სია — ლურჯი', 'List — Blue', false, 'list',
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#3b82f6","accentHover":"#2563eb","accentLight":"#dbeafe","accentDark":"#1d4ed8","accentBg":"rgba(59,130,246,0.08)","accentBgStrong":"rgba(59,130,246,0.15)","accent2":"#8b5cf6","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#334155","textMuted":"#64748b","heading":"#0f172a","heroBg":"#0f172a","heroText":"#ffffff","heroAccent":"#60a5fa","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_news', 3, 'ჟურნალი — ოქრო', 'Magazine — Gold', false, 'magazine',
 '{"bg":"#faf9f7","bg2":"#ffffff","accent":"#dea36d","accentHover":"#c48a4f","accentLight":"#fdf0e4","accentDark":"#b07840","accentBg":"rgba(222,163,109,0.08)","accentBgStrong":"rgba(222,163,109,0.15)","accent2":"#c9a050","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#2d2d2d","textMuted":"#6b6b6b","heading":"#0c0c0e","heroBg":"#0c0c0e","heroText":"#ffffff","heroAccent":"#dea36d","cardBg":"#ffffff","cardBorder":"#e8e0d8"}'::jsonb),

-- NEWS DETAIL PAGE (layout: classic, wide, sidebar)
('page_news_detail', 1, 'კლასიკური — ტილი', 'Classic — Teal', true, 'classic',
 '{"bg":"#ffffff","bg2":"#f8fafc","accent":"#14b8a6","accentHover":"#0d9488","accentLight":"#ccfbf1","accentDark":"#0d9488","accentBg":"rgba(20,184,166,0.08)","accentBgStrong":"rgba(20,184,166,0.15)","accent2":"#06b6d4","gradientFrom":"#14b8a6","gradientTo":"#06b6d4","text":"#334155","textMuted":"#64748b","heading":"#0a1628","heroBg":"#0a1628","heroText":"#ffffff","heroAccent":"#14b8a6","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_news_detail', 2, 'ფართო — ლურჯი', 'Wide — Blue', false, 'wide',
 '{"bg":"#f8fafc","bg2":"#ffffff","accent":"#3b82f6","accentHover":"#2563eb","accentLight":"#dbeafe","accentDark":"#1d4ed8","accentBg":"rgba(59,130,246,0.08)","accentBgStrong":"rgba(59,130,246,0.15)","accent2":"#8b5cf6","gradientFrom":"#3b82f6","gradientTo":"#8b5cf6","text":"#334155","textMuted":"#64748b","heading":"#0f172a","heroBg":"#0f172a","heroText":"#ffffff","heroAccent":"#60a5fa","cardBg":"#ffffff","cardBorder":"#e2e8f0"}'::jsonb),

('page_news_detail', 3, 'საიდბარით — ოქრო', 'Sidebar — Gold', false, 'sidebar',
 '{"bg":"#faf9f7","bg2":"#ffffff","accent":"#dea36d","accentHover":"#c48a4f","accentLight":"#fdf0e4","accentDark":"#b07840","accentBg":"rgba(222,163,109,0.08)","accentBgStrong":"rgba(222,163,109,0.15)","accent2":"#c9a050","gradientFrom":"#dea36d","gradientTo":"#c9a050","text":"#2d2d2d","textMuted":"#6b6b6b","heading":"#0c0c0e","heroBg":"#0c0c0e","heroText":"#ffffff","heroAccent":"#dea36d","cardBg":"#ffffff","cardBorder":"#e8e0d8"}'::jsonb)

ON CONFLICT (section_key, preset_number) DO UPDATE SET
  preset_name_ka = EXCLUDED.preset_name_ka,
  preset_name_en = EXCLUDED.preset_name_en,
  layout = EXCLUDED.layout,
  colors = EXCLUDED.colors;

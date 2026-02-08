import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const DesignContext = createContext(null);

const DEFAULT_DARK = {
  bg: '#0a1628', bg2: '#0d1f37',
  accent: '#14b8a6', accentHover: '#2dd4bf', accentLight: '#5eead4',
  accentDark: '#0d9488', accentBg: 'rgba(20,184,166,0.1)',
  accentBgStrong: 'rgba(20,184,166,0.2)',
  accent2: '#06b6d4', accent2Hover: '#22d3ee',
  gradientFrom: '#14b8a6', gradientTo: '#06b6d4',
  text: '#ffffff', textMuted: '#94a3b8', heading: '#ffffff',
  cardBg: 'rgba(255,255,255,0.06)', cardBorder: 'rgba(255,255,255,0.08)',
  cardBgHover: 'rgba(255,255,255,0.1)'
};

const DEFAULT_LIGHT = {
  bg: '#ffffff', bg2: '#f8fafc',
  accent: '#14b8a6', accentHover: '#0d9488', accentLight: '#ccfbf1',
  accentDark: '#0d9488', accentBg: '#f0fdfa',
  accentBgStrong: 'rgba(20,184,166,0.15)',
  accent2: '#06b6d4', accent2Hover: '#0891b2',
  gradientFrom: '#14b8a6', gradientTo: '#06b6d4',
  text: '#334155', textMuted: '#64748b', heading: '#0a1628',
  cardBg: '#ffffff', cardBorder: '#e2e8f0',
  cardBgHover: '#f8fafc'
};

const SECTION_DEFAULTS = {
  header: DEFAULT_DARK,
  hero: DEFAULT_DARK,
  stats: DEFAULT_DARK,
  about: DEFAULT_LIGHT,
  principles: { ...DEFAULT_LIGHT, bg: '#f8fafc', bg2: '#ffffff' },
  portfolio: DEFAULT_LIGHT,
  founder: DEFAULT_DARK,
  news: DEFAULT_LIGHT,
  footer: DEFAULT_DARK,
  page_founder: { ...DEFAULT_DARK, heroBg: '#0a1628', heroText: '#ffffff', heroAccent: '#14b8a6' },
  page_about: { ...DEFAULT_LIGHT, heroBg: '#0a1628', heroText: '#ffffff', heroAccent: '#14b8a6' },
  page_portfolio: { ...DEFAULT_LIGHT, heroBg: '#0a1628', heroText: '#ffffff', heroAccent: '#14b8a6' },
  page_news: { ...DEFAULT_LIGHT, heroBg: '#0a1628', heroText: '#ffffff', heroAccent: '#14b8a6' },
  page_news_detail: { ...DEFAULT_LIGHT, heroBg: '#0a1628', heroText: '#ffffff', heroAccent: '#14b8a6' },
};

const LAYOUT_DEFAULTS = {
  header: 'pill',
  page_founder: 'classic',
  page_about: 'classic',
  page_portfolio: 'timeline',
  page_news: 'grid',
  page_news_detail: 'classic',
};

const CACHE_KEY = '_d_cache';
const CACHE_ALL_KEY = '_d_all_cache';

// Restore cached presets synchronously to avoid flash
const getCachedPresets = () => {
  try {
    const raw = localStorage.getItem(CACHE_ALL_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
};

const DesignProvider = ({ children }) => {
  const [presetsBySection, setPresetsBySection] = useState(getCachedPresets);
  const [loading, setLoading] = useState(true);

  const fetchDesign = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_design')
        .select('*')
        .order('preset_number');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const grouped = {};
        data.forEach(p => {
          if (!grouped[p.section_key]) grouped[p.section_key] = [];
          grouped[p.section_key].push(p);
        });
        setPresetsBySection(grouped);
        
        // Cache to localStorage for instant restore on next visit
        try {
          localStorage.setItem(CACHE_ALL_KEY, JSON.stringify(grouped));
        } catch (e) {}
        
        // Set global CSS vars from header's active preset
        const headerPresets = grouped.header || [];
        const headerActive = headerPresets.find(p => p.is_active);
        if (headerActive) {
          applyGlobalCSSVars(headerActive.colors);
          // Cache header bg for instant body color on load
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ bg: headerActive.colors.bg }));
          } catch (e) {}
          // Also set body bg immediately
          document.body.style.backgroundColor = headerActive.colors.bg;
        }
      }
    } catch (err) {
      console.warn('Design presets not loaded, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyGlobalCSSVars = (colors) => {
    const root = document.documentElement;
    const varMap = {
      '--d-bg': colors.bg,
      '--d-bg2': colors.bg2,
      '--d-accent': colors.accent,
      '--d-accent-hover': colors.accentHover,
      '--d-accent-light': colors.accentLight,
      '--d-accent-dark': colors.accentDark,
      '--d-accent-bg': colors.accentBg,
      '--d-accent-bg-strong': colors.accentBgStrong,
      '--d-accent2': colors.accent2,
      '--d-accent2-hover': colors.accent2Hover,
      '--d-gf': colors.gradientFrom,
      '--d-gt': colors.gradientTo,
      '--d-heading': colors.heading,
      '--d-text-muted': colors.textMuted,
      '--d-card-bg': colors.cardBg,
      '--d-card-border': colors.cardBorder,
    };
    Object.entries(varMap).forEach(([prop, val]) => {
      if (val) root.style.setProperty(prop, val);
    });
  };

  const getDesign = useCallback((sectionKey) => {
    const sectionPresets = presetsBySection[sectionKey] || [];
    const active = sectionPresets.find(p => p.is_active);
    return active?.colors || SECTION_DEFAULTS[sectionKey] || DEFAULT_DARK;
  }, [presetsBySection]);

  const getLayout = useCallback((sectionKey) => {
    const sectionPresets = presetsBySection[sectionKey] || [];
    const active = sectionPresets.find(p => p.is_active);
    return active?.layout || LAYOUT_DEFAULTS[sectionKey] || 'default';
  }, [presetsBySection]);

  useEffect(() => {
    fetchDesign();
  }, [fetchDesign]);

  const value = useMemo(() => ({
    getDesign,
    getLayout,
    presetsBySection,
    refreshDesign: fetchDesign,
    loading,
  }), [getDesign, getLayout, presetsBySection, fetchDesign, loading]);

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
};

export { DesignContext, DesignProvider, SECTION_DEFAULTS, DEFAULT_DARK, LAYOUT_DEFAULTS };

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useDesign } from '@/hooks/useDesign';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Palette, Menu, PanelBottom, Image, BarChart3, Users, Award, 
  Briefcase, User, Newspaper, Check, Loader2, Sparkles, RefreshCw,
  LayoutGrid, FileText, BookOpen, Columns, List, Grid3X3
} from 'lucide-react';
import { LAYOUT_DEFAULTS } from '@/contexts/DesignContext';

const SECTION_GROUPS = [
  {
    title: 'საერთო ელემენტები',
    subtitle: 'ყველა გვერდზე ჩანს',
    sections: [
      { key: 'header', name: 'ჰედერი / ნავიგაცია', icon: Menu },
      { key: 'footer', name: 'ფუთერი', icon: PanelBottom },
    ]
  },
  {
    title: 'მთავარი გვერდი',
    subtitle: 'მთავარი გვერდის სექციები',
    sections: [
      { key: 'hero', name: 'ჰერო სექცია', icon: Image },
      { key: 'stats', name: 'სტატისტიკა', icon: BarChart3 },
      { key: 'about', name: 'ჩვენს შესახებ', icon: Users },
      { key: 'principles', name: 'პრინციპები', icon: Award },
      { key: 'portfolio', name: 'პორტფოლიო', icon: Briefcase },
      { key: 'founder', name: 'დამფუძნებელი', icon: User },
      { key: 'news', name: 'სიახლეები', icon: Newspaper },
    ]
  },
  {
    title: 'შიდა გვერდები',
    subtitle: 'თითოეულ გვერდზე 3 ლეიაუთი + ფერის არჩევანი',
    sections: [
      { key: 'page_founder', name: 'დამფუძნებლის გვერდი', icon: User },
      { key: 'page_about', name: 'ჩვენს შესახებ გვერდი', icon: BookOpen },
      { key: 'page_portfolio', name: 'პორტფოლიო გვერდი', icon: Briefcase },
      { key: 'page_news', name: 'სიახლეების გვერდი', icon: Newspaper },
      { key: 'page_news_detail', name: 'სიახლეების დეტალი', icon: FileText },
    ]
  }
];

const LAYOUT_OPTIONS = {
  header: [
    { value: 'pill', label: 'Pill', icon: '💊' },
    { value: 'classic', label: 'Classic', icon: '📋' },
    { value: 'underline', label: 'Underline', icon: '〰️' },
  ],
  page_founder: [
    { value: 'classic', label: 'კლასიკური', icon: '📄' },
    { value: 'modern', label: 'მოდერნი', icon: '✨' },
    { value: 'cinematic', label: 'სინემატიკ', icon: '🎬' },
  ],
  page_about: [
    { value: 'classic', label: 'კლასიკური', icon: '📄' },
    { value: 'cards', label: 'ბარათები', icon: '🃏' },
    { value: 'split', label: 'გაყოფილი', icon: '↔️' },
  ],
  page_portfolio: [
    { value: 'timeline', label: 'თაიმლაინი', icon: '📅' },
    { value: 'grid', label: 'გრიდი', icon: '⊞' },
    { value: 'masonry', label: 'მეისონრი', icon: '🧱' },
  ],
  page_news: [
    { value: 'grid', label: 'გრიდი', icon: '⊞' },
    { value: 'list', label: 'სია', icon: '☰' },
    { value: 'magazine', label: 'მაგაზინი', icon: '📰' },
  ],
  page_news_detail: [
    { value: 'classic', label: 'კლასიკური', icon: '📄' },
    { value: 'wide', label: 'ფართო', icon: '🖼️' },
    { value: 'sidebar', label: 'საიდბარი', icon: '📐' },
  ],
};

const THEME_QUICK_APPLY = [
  { num: 1, name: 'ტილი', colors: ['#0a1628', '#14b8a6', '#06b6d4'] },
  { num: 2, name: 'ლურჯი', colors: ['#0f172a', '#3b82f6', '#8b5cf6'] },
  { num: 3, name: 'ზურმუხტი', colors: ['#022c22', '#10b981', '#f59e0b'] },
  { num: 4, name: 'შავი & ოქრო', colors: ['#0c0c0e', '#dea36d', '#c9a050'] },
  { num: 5, name: 'კორპორატიული', colors: ['#1a3a52', '#F4C430', '#e8b817'] },
];

const DesignManager = () => {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const { refreshDesign } = useDesign();

  const fetchPresets = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_design')
      .select('*')
      .order('section_key')
      .order('preset_number');
    
    if (error) {
      console.error('Failed to load design presets:', error);
    } else {
      setPresets(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPresets(); }, [fetchPresets]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const activatePreset = async (sectionKey, presetNumber) => {
    setSaving(sectionKey);
    try {
      await supabase
        .from('site_design')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('section_key', sectionKey);
      
      await supabase
        .from('site_design')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('section_key', sectionKey)
        .eq('preset_number', presetNumber);

      setPresets(prev => prev.map(p => ({
        ...p,
        is_active: p.section_key === sectionKey ? p.preset_number === presetNumber : p.is_active
      })));

      await refreshDesign();
      showSuccess(`${sectionKey} — პრესეტი შეიცვალა`);
    } catch (err) {
      console.error('Failed to activate preset:', err);
    }
    setSaving(null);
  };

  const applyThemeToAll = async (presetNumber) => {
    setSaving('all');
    try {
      const sections = SECTION_GROUPS.flatMap(g => g.sections.map(s => s.key));
      
      // Find the theme name from any section that has this preset
      const themePreset = presets.find(p => p.preset_number === presetNumber);
      const themeName = themePreset?.preset_name_en?.split(' — ')[0]?.split('—')[0]?.trim() || '';
      
      for (const sectionKey of sections) {
        const sectionPresets = presets.filter(p => p.section_key === sectionKey);
        // First try exact preset_number match
        let target = sectionPresets.find(p => p.preset_number === presetNumber);
        // If not found, try matching by theme name prefix
        if (!target && themeName) {
          target = sectionPresets.find(p => 
            p.preset_name_en?.startsWith(themeName) || 
            p.preset_name_ka?.startsWith(themeName)
          );
        }
        
        if (target) {
          await supabase
            .from('site_design')
            .update({ is_active: false })
            .eq('section_key', sectionKey);
          
          await supabase
            .from('site_design')
            .update({ is_active: true })
            .eq('section_key', sectionKey)
            .eq('preset_number', target.preset_number);
        }
      }

      // Refresh presets from DB to get accurate state
      await fetchPresets();
      await refreshDesign();
      showSuccess('ყველა სექციის თემა შეიცვალა');
    } catch (err) {
      console.error('Failed to apply theme:', err);
    }
    setSaving(null);
  };

  const getPresetsForSection = (sectionKey) => {
    return presets.filter(p => p.section_key === sectionKey);
  };

  const changeLayout = async (sectionKey, layoutValue) => {
    setSaving(sectionKey);
    try {
      const activePreset = presets.find(p => p.section_key === sectionKey && p.is_active);
      const matchingPreset = presets.find(p => p.section_key === sectionKey && p.layout === layoutValue);
      
      if (matchingPreset && !matchingPreset.is_active) {
        await activatePreset(sectionKey, matchingPreset.preset_number);
      } else if (activePreset) {
        await supabase
          .from('site_design')
          .update({ layout: layoutValue, updated_at: new Date().toISOString() })
          .eq('id', activePreset.id);
        
        setPresets(prev => prev.map(p => p.id === activePreset.id ? { ...p, layout: layoutValue } : p));
        await refreshDesign();
        showSuccess(`${sectionKey} — ლეიაუთი შეიცვალა`);
      }
    } catch (err) {
      console.error('Failed to change layout:', err);
    }
    setSaving(null);
  };

  const getActiveLayout = (sectionKey) => {
    const active = presets.find(p => p.section_key === sectionKey && p.is_active);
    return active?.layout || LAYOUT_DEFAULTS[sectionKey] || 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Palette className="w-5 h-5 text-white" />
            </div>
            დიზაინი
          </h1>
          <p className="text-slate-500 mt-1 text-sm">საიტის ფერებისა და სტილის მართვა სექციების მიხედვით</p>
        </div>
        
        {/* Quick Apply Buttons */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">ყველა სექციაზე გადატანა:</span>
          <div className="flex flex-wrap gap-2">
            {THEME_QUICK_APPLY.map(theme => (
              <Button
                key={theme.num}
                variant="outline"
                size="sm"
                onClick={() => applyThemeToAll(theme.num)}
                disabled={saving !== null}
                className="gap-2 text-xs font-bold hover:bg-slate-50"
              >
                <div className="flex -space-x-1">
                  {theme.colors.map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
                {theme.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          {successMsg}
        </motion.div>
      )}

      {/* Saving overlay */}
      {saving && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          ინახება...
        </div>
      )}

      {/* Section Groups */}
      {SECTION_GROUPS.map(group => (
        <div key={group.title}>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">{group.title}</h2>
            <p className="text-xs text-slate-400">{group.subtitle}</p>
          </div>
          
          <div className="space-y-4">
            {group.sections.map(section => {
              const sectionPresets = getPresetsForSection(section.key);
              const Icon = section.icon;
              
              return (
                <div key={section.key} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{section.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{section.key}</span>
                    </div>
                  </div>

                  {/* Layout selector (if section has layout options) */}
                  {LAYOUT_OPTIONS[section.key] && (
                    <div className="mb-5 pb-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">ლეიაუთი:</span>
                      <div className="flex flex-wrap gap-2">
                        {LAYOUT_OPTIONS[section.key].map(opt => {
                          const isActiveLayout = getActiveLayout(section.key) === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => !isActiveLayout && changeLayout(section.key, opt.value)}
                              disabled={saving !== null}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isActiveLayout
                                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <span>{opt.icon}</span>
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Preset cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {sectionPresets.length > 0 ? sectionPresets.map(preset => {
                      const c = preset.colors;
                      const isActive = preset.is_active;
                      const isSaving = saving === section.key || saving === 'all';

                      return (
                        <motion.button
                          key={preset.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => !isActive && !isSaving && activatePreset(section.key, preset.preset_number)}
                          disabled={isSaving}
                          className={`relative p-3.5 rounded-xl border-2 transition-all text-left ${
                            isActive 
                              ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/30' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          } ${isSaving ? 'opacity-50 cursor-wait' : isActive ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {/* Color Preview Bar */}
                          <div className="h-14 rounded-lg overflow-hidden flex mb-3 shadow-inner border border-slate-100">
                            <div style={{ backgroundColor: c.bg }} className="flex-[3] flex items-center justify-center relative">
                              {/* Mini layout preview */}
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: c.accent, opacity: 0.8 }} />
                                <div className="w-14 h-1.5 rounded-full" style={{ backgroundColor: c.text || '#fff', opacity: 0.4 }} />
                                <div className="flex gap-1 mt-0.5">
                                  <div className="w-3 h-3 rounded" style={{ backgroundColor: c.cardBg || 'rgba(255,255,255,0.1)' }} />
                                  <div className="w-3 h-3 rounded" style={{ backgroundColor: c.cardBg || 'rgba(255,255,255,0.1)' }} />
                                  <div className="w-3 h-3 rounded" style={{ backgroundColor: c.cardBg || 'rgba(255,255,255,0.1)' }} />
                                </div>
                              </div>
                            </div>
                            <div 
                              className="w-5" 
                              style={{ backgroundImage: `linear-gradient(to bottom, ${c.gradientFrom}, ${c.gradientTo})` }} 
                            />
                          </div>

                          {/* Name + Active */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-700">
                              {preset.preset_name_ka}
                            </span>
                            {isActive && (
                              <span className="flex items-center gap-1 text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" /> აქტიური
                              </span>
                            )}
                          </div>

                          {/* Color Dots */}
                          <div className="flex gap-1.5">
                            {[c.bg, c.accent, c.gradientTo, c.accentLight, c.accent2].filter(Boolean).map((color, i) => (
                              <div 
                                key={i}
                                className="w-5 h-5 rounded-full border border-slate-200 shadow-sm" 
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </motion.button>
                      );
                    }) : (
                      <div className="col-span-3 text-center py-6 text-slate-400 text-sm">
                        პრესეტები არ მოიძებნა
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {presets.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-amber-800 mb-2">დიზაინის პრესეტები არ მოიძებნა</h3>
          <p className="text-amber-700 text-sm mb-4">
            გთხოვთ, გაუშვით <code className="bg-amber-100 px-2 py-1 rounded text-xs font-mono">setup-design-presets.sql</code> ფაილი Supabase SQL Editor-ში.
          </p>
          <Button onClick={fetchPresets} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            თავიდან ცდა
          </Button>
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h4 className="font-bold text-slate-700 text-sm mb-2">💡 როგორ მუშაობს?</h4>
        <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
          <li>თითოეული სექციისთვის აირჩიეთ სასურველი ფერის თემა (ტილი, ლურჯი, ზურმუხტი, შავი & ოქრო ან კორპორატიული)</li>
          <li>შიდა გვერდებზე შეგიძლიათ ლეიაუთის (განლაგების) შეცვლაც</li>
          <li>ცვლილება ავტომატურად აისახება საიტზე</li>
          <li>„ყველა სექციაზე გადატანა" ღილაკები ერთდროულად ცვლის ყველა სექციის თემას</li>
          <li>თითოეული სექცია შეგიძლიათ დამოუკიდებლად დააკონფიგურიროთ</li>
        </ul>
      </div>
    </div>
  );
};

export default DesignManager;

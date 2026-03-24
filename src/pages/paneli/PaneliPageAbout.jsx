import React, { useState, useEffect } from 'react';
import { siteContentApi } from '@/lib/apiClient';
import { Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ICON_OPTIONS = ['Shield', 'TrendingUp', 'Globe', 'Users', 'Award', 'Star', 'Target', 'Heart', 'Zap', 'Building2'];

const PaneliPageAbout = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const r = await siteContentApi.getBySection('about_page');
        setData(r.content || {});
      } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await siteContentApi.update('about_page', data);
      toast({ title: 'შენახულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const addAdvantage = () => {
    setData({ ...data, advantages: [...(data.advantages || []), { icon: 'Shield', title_ka: '', title_en: '', text_ka: '', text_en: '' }] });
  };

  const updateAdvantage = (i, field, value) => {
    const items = [...(data.advantages || [])];
    items[i] = { ...items[i], [field]: value };
    setData({ ...data, advantages: items });
  };

  const removeAdvantage = (i) => {
    setData({ ...data, advantages: data.advantages.filter((_, j) => j !== i) });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">ჩვენს შესახებ გვერდი</h1>
          <p className="text-sm text-slate-500 mt-0.5">/about გვერდის მართვა</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
        </button>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">ჰერო სექცია</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="სათაური (KA)" value={data.hero_title_ka} onChange={v => setData({ ...data, hero_title_ka: v })} />
          <Field label="Hero Title (EN)" value={data.hero_title_en} onChange={v => setData({ ...data, hero_title_en: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldArea label="ქვესათაური (KA)" value={data.hero_subtitle_ka} onChange={v => setData({ ...data, hero_subtitle_ka: v })} />
          <FieldArea label="Hero Subtitle (EN)" value={data.hero_subtitle_en} onChange={v => setData({ ...data, hero_subtitle_en: v })} />
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">მიმოხილვა</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="მიმოხილვის სათაური (KA)" value={data.overview_title_ka} onChange={v => setData({ ...data, overview_title_ka: v })} />
          <Field label="Overview Title (EN)" value={data.overview_title_en} onChange={v => setData({ ...data, overview_title_en: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldArea label="პარაგრაფი 1 (KA)" value={data.overview_p1_ka} onChange={v => setData({ ...data, overview_p1_ka: v })} rows={4} />
          <FieldArea label="Paragraph 1 (EN)" value={data.overview_p1_en} onChange={v => setData({ ...data, overview_p1_en: v })} rows={4} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldArea label="პარაგრაფი 2 (KA)" value={data.overview_p2_ka} onChange={v => setData({ ...data, overview_p2_ka: v })} rows={4} />
          <FieldArea label="Paragraph 2 (EN)" value={data.overview_p2_en} onChange={v => setData({ ...data, overview_p2_en: v })} rows={4} />
        </div>
      </div>

      {/* Advantages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-700">უპირატესობები ({(data.advantages || []).length})</h3>
          <button onClick={addAdvantage} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
            <Plus size={14} /> დამატება
          </button>
        </div>
        {(data.advantages || []).map((adv, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 space-y-3 relative group">
            <button onClick={() => removeAdvantage(i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">აიკონი</label>
              <div className="flex flex-wrap gap-1">
                {ICON_OPTIONS.map(ic => (
                  <button key={ic} onClick={() => updateAdvantage(i, 'icon', ic)}
                    className={`px-2 py-0.5 rounded text-xs ${adv.icon === ic ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="სათაური (KA)" value={adv.title_ka} onChange={v => updateAdvantage(i, 'title_ka', v)} />
              <Field label="Title (EN)" value={adv.title_en} onChange={v => updateAdvantage(i, 'title_en', v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldArea label="ტექსტი (KA)" value={adv.text_ka} onChange={v => updateAdvantage(i, 'text_ka', v)} />
              <FieldArea label="Text (EN)" value={adv.text_en} onChange={v => updateAdvantage(i, 'text_en', v)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
    <input value={value || ''} onChange={e => onChange(e.target.value)}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
  </div>
);

const FieldArea = ({ label, value, onChange, rows = 3 }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" />
  </div>
);

export default PaneliPageAbout;

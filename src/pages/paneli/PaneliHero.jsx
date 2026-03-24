import React, { useState, useEffect } from 'react';
import { siteContentApi, uploadApi } from '@/lib/apiClient';
import { Save, Loader2, Image, Plus, Trash2, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BUCKET = 'site-chocheligroup-com';

const PaneliHero = () => {
  const [hero, setHero] = useState(null);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('text');
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [h, s, p] = await Promise.all([
          siteContentApi.getBySection('hero_section'),
          siteContentApi.getBySection('group_stats'),
          siteContentApi.getBySection('projects'),
        ]);
        setHero(h.content || {});
        setStats(s.content || { stats: [] });
        setProjects(p.content || { items: [] });
      } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (tab === 'text') await siteContentApi.update('hero_section', hero);
      if (tab === 'stats') await siteContentApi.update('group_stats', stats);
      if (tab === 'slides') await siteContentApi.update('projects', projects);
      toast({ title: 'შენახულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const uploadImage = async (file) => {
    try {
      const result = await uploadApi.upload(BUCKET, file);
      return result.url || uploadApi.getPublicUrl(result.path);
    } catch (e) { toast({ title: 'სურათის შეცდომა', description: e.message, variant: 'destructive' }); return null; }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;

  const tabs = [
    { key: 'text', label: 'ტექსტი' },
    { key: 'stats', label: 'სტატისტიკა' },
    { key: 'slides', label: 'სლაიდები / პროექტები' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">ჰერო სექცია</h1>
          <p className="text-sm text-slate-500 mt-0.5">მთავარი გვერდის ზედა ნაწილი</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === t.key ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Text fields */}
      {tab === 'text' && hero && (
        <div className="bg-white rounded-xl border p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Badge (KA)" value={hero.badge_ka} onChange={v => setHero({ ...hero, badge_ka: v })} />
            <Field label="Badge (EN)" value={hero.badge_en} onChange={v => setHero({ ...hero, badge_en: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="სათაური ხაზი 1 (KA)" value={hero.title_line1_ka} onChange={v => setHero({ ...hero, title_line1_ka: v })} />
            <Field label="Title Line 1 (EN)" value={hero.title_line1_en} onChange={v => setHero({ ...hero, title_line1_en: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="სათაური ხაზი 2 (KA)" value={hero.title_line2_ka} onChange={v => setHero({ ...hero, title_line2_ka: v })} />
            <Field label="Title Line 2 (EN)" value={hero.title_line2_en} onChange={v => setHero({ ...hero, title_line2_en: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="სათაური ხაზი 3 (KA)" value={hero.title_line3_ka} onChange={v => setHero({ ...hero, title_line3_ka: v })} />
            <Field label="Title Line 3 (EN)" value={hero.title_line3_en} onChange={v => setHero({ ...hero, title_line3_en: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldArea label="ქვესათაური (KA)" value={hero.subtitle_ka} onChange={v => setHero({ ...hero, subtitle_ka: v })} />
            <FieldArea label="Subtitle (EN)" value={hero.subtitle_en} onChange={v => setHero({ ...hero, subtitle_en: v })} />
          </div>
        </div>
      )}

      {/* Stats */}
      {tab === 'stats' && stats && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-slate-700">სტატისტიკის ბეჯები</h3>
            <button onClick={() => setStats({ ...stats, stats: [...(stats.stats || []), { number: '', label_ka: '', label_en: '' }] })}
              className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
              <Plus size={14} /> დამატება
            </button>
          </div>
          {(stats.stats || []).map((s, i) => (
            <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-3 relative group">
              <button onClick={() => setStats({ ...stats, stats: stats.stats.filter((_, j) => j !== i) })}
                className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="რიცხვი / ნიშანი" value={s.number || ''} onChange={v => { const n = [...stats.stats]; n[i] = { ...n[i], number: v }; setStats({ ...stats, stats: n }); }} placeholder="30+" />
                <Field label="ლეიბლი (KA)" value={s.label_ka} onChange={v => { const n = [...stats.stats]; n[i] = { ...n[i], label_ka: v }; setStats({ ...stats, stats: n }); }} />
                <Field label="Label (EN)" value={s.label_en} onChange={v => { const n = [...stats.stats]; n[i] = { ...n[i], label_en: v }; setStats({ ...stats, stats: n }); }} />
              </div>
              <Field label="Icon (optional)" value={s.icon || ''} onChange={v => { const n = [...stats.stats]; n[i] = { ...n[i], icon: v }; setStats({ ...stats, stats: n }); }} placeholder="Map, Globe2, etc." />
            </div>
          ))}
        </div>
      )}

      {/* Slides / Projects */}
      {tab === 'slides' && projects && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="პროექტების სათაური (KA)" value={projects.hero_title_ka || ''} onChange={v => setProjects({ ...projects, hero_title_ka: v })} />
              <Field label="Projects Title (EN)" value={projects.hero_title_en || ''} onChange={v => setProjects({ ...projects, hero_title_en: v })} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-700">პროექტები / სლაიდები</h3>
            <button onClick={() => setProjects({ ...projects, items: [...(projects.items || []), { id: Date.now().toString(), title_ka: '', title_en: '', description_ka: '', description_en: '', location_ka: '', location_en: '', status: 'ongoing', images: [] }] })}
              className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
              <Plus size={14} /> პროექტის დამატება
            </button>
          </div>

          {(projects.items || []).map((item, i) => (
            <ProjectItem key={item.id || i} item={item} index={i}
              onChange={(updated) => { const n = [...projects.items]; n[i] = updated; setProjects({ ...projects, items: n }); }}
              onDelete={() => setProjects({ ...projects, items: projects.items.filter((_, j) => j !== i) })}
              onUpload={uploadImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectItem = ({ item, index, onChange, onDelete, onUpload }) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await onUpload(file);
    if (url) onChange({ ...item, images: [...(item.images || []), url] });
    setUploading(false);
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          {item.images?.[0] && <img src={item.images[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />}
          <div className="text-left">
            <p className="text-sm font-medium text-slate-700">{item.title_ka || `პროექტი ${index + 1}`}</p>
            <p className="text-xs text-slate-400">{item.status} • {(item.images || []).length} სურათი</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>
      {open && (
        <div className="p-4 border-t space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="სახელი (KA)" value={item.title_ka} onChange={v => onChange({ ...item, title_ka: v })} />
            <Field label="Title (EN)" value={item.title_en} onChange={v => onChange({ ...item, title_en: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldArea label="აღწერა (KA)" value={item.description_ka} onChange={v => onChange({ ...item, description_ka: v })} />
            <FieldArea label="Description (EN)" value={item.description_en} onChange={v => onChange({ ...item, description_en: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="ლოკაცია (KA)" value={item.location_ka} onChange={v => onChange({ ...item, location_ka: v })} />
            <Field label="Location (EN)" value={item.location_en} onChange={v => onChange({ ...item, location_en: v })} />
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">სტატუსი</label>
              <select value={item.status || 'ongoing'} onChange={e => onChange({ ...item, status: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none">
                <option value="ongoing">მიმდინარე</option>
                <option value="completed">დასრულებული</option>
                <option value="planned">დაგეგმილი</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">სურათები</label>
            <div className="flex flex-wrap gap-2">
              {(item.images || []).map((img, j) => (
                <div key={j} className="relative group w-24 h-24">
                  <img src={img} className="w-full h-full object-cover rounded-lg border" alt="" />
                  <button onClick={() => onChange({ ...item, images: item.images.filter((_, k) => k !== j) })}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors">
                {uploading ? <Loader2 size={16} className="animate-spin text-slate-400" /> : <><Upload size={16} className="text-slate-400" /><span className="text-[10px] text-slate-400 mt-1">ატვირთვა</span></>}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
    <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
  </div>
);

const FieldArea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" />
  </div>
);

export default PaneliHero;

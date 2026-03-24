import React, { useState, useEffect } from 'react';
import { siteContentApi, uploadApi } from '@/lib/apiClient';
import {
  Save, Loader2, Plus, Trash2, Upload, Copy, ChevronDown, ChevronUp, ArrowLeft, X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BUCKET = 'site-chocheligroup-com';

const PaneliPageProjects = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const r = await siteContentApi.getBySection('projects');
        setData(r.content || { hero_title_ka: '', hero_title_en: '', hero_subtitle_ka: '', hero_subtitle_en: '', items: [] });
      } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await siteContentApi.update('projects', data);
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

  const addProject = () => {
    setData({
      ...data,
      items: [...(data.items || []), {
        id: Date.now().toString(),
        title_ka: '', title_en: '',
        description_ka: '', description_en: '',
        location_ka: '', location_en: '',
        status: 'ongoing', images: []
      }]
    });
  };

  const duplicateProject = (index) => {
    const item = { ...data.items[index], id: Date.now().toString(), title_ka: (data.items[index].title_ka || '') + ' (ასლი)' };
    const items = [...data.items];
    items.splice(index + 1, 0, item);
    setData({ ...data, items });
  };

  const updateProject = (index, updated) => {
    const items = [...data.items];
    items[index] = updated;
    setData({ ...data, items });
  };

  const removeProject = (index) => {
    setData({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  const moveProject = (index, dir) => {
    const items = [...data.items];
    const swap = index + dir;
    if (swap < 0 || swap >= items.length) return;
    [items[index], items[swap]] = [items[swap], items[index]];
    setData({ ...data, items });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">პროექტების გვერდი</h1>
          <p className="text-sm text-slate-500 mt-0.5">/projects გვერდის მართვა</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
        </button>
      </div>

      {/* Page hero texts */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">გვერდის ტექსტები</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="სათაური (KA)" value={data.hero_title_ka} onChange={v => setData({ ...data, hero_title_ka: v })} />
          <Field label="Title (EN)" value={data.hero_title_en} onChange={v => setData({ ...data, hero_title_en: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldArea label="ქვესათაური (KA)" value={data.hero_subtitle_ka} onChange={v => setData({ ...data, hero_subtitle_ka: v })} />
          <FieldArea label="Subtitle (EN)" value={data.hero_subtitle_en} onChange={v => setData({ ...data, hero_subtitle_en: v })} />
        </div>
      </div>

      {/* Projects list */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-700">პროექტები ({(data.items || []).length})</h3>
        <button onClick={addProject} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
          <Plus size={14} /> პროექტის დამატება
        </button>
      </div>

      {(data.items || []).map((item, i) => (
        <ProjectCard key={item.id || i} item={item} index={i}
          onChange={(updated) => updateProject(i, updated)}
          onDelete={() => removeProject(i)}
          onDuplicate={() => duplicateProject(i)}
          onMove={(dir) => moveProject(i, dir)}
          onUpload={uploadImage}
          isFirst={i === 0} isLast={i === data.items.length - 1}
        />
      ))}
    </div>
  );
};

const ProjectCard = ({ item, index, onChange, onDelete, onDuplicate, onMove, onUpload, isFirst, isLast }) => {
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
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <button onClick={e => { e.stopPropagation(); onMove(-1); }} disabled={isFirst} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronUp size={12} /></button>
            <button onClick={e => { e.stopPropagation(); onMove(1); }} disabled={isLast} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronDown size={12} /></button>
          </div>
          {item.images?.[0] && <img src={item.images[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />}
          <div>
            <p className="text-sm font-medium text-slate-700">{item.title_ka || `პროექტი ${index + 1}`}</p>
            <p className="text-xs text-slate-400">{item.status} • {(item.images || []).length} სურათი</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={e => { e.stopPropagation(); onDuplicate(); }} className="p-1 text-slate-300 hover:text-blue-500"><Copy size={14} /></button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {open && (
        <div className="p-4 border-t space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="სახელი (KA)" value={item.title_ka} onChange={v => onChange({ ...item, title_ka: v })} />
            <Field label="Title (EN)" value={item.title_en} onChange={v => onChange({ ...item, title_en: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldArea label="აღწერა (KA)" value={item.description_ka} onChange={v => onChange({ ...item, description_ka: v })} rows={4} />
            <FieldArea label="Description (EN)" value={item.description_en} onChange={v => onChange({ ...item, description_en: v })} rows={4} />
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
                <div key={j} className="relative group/img w-24 h-24">
                  <img src={img} className="w-full h-full object-cover rounded-lg border" alt="" />
                  <button onClick={() => onChange({ ...item, images: item.images.filter((_, k) => k !== j) })}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <X size={10} />
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

export default PaneliPageProjects;

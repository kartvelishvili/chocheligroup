import React, { useState, useEffect, useCallback } from 'react';
import { newsApi, newsCategoriesApi, uploadApi } from '@/lib/apiClient';
import {
  Save, Loader2, Plus, Trash2, Upload, Search, Copy, Eye, EyeOff,
  ChevronDown, ChevronUp, X, Pencil, ArrowLeft, Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BUCKET = 'site-chocheligroup-com';

const PaneliNews = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null = list, object = editing
  const { toast } = useToast();

  const load = useCallback(async () => {
    try {
      const [n, c] = await Promise.all([newsApi.getAll(), newsCategoriesApi.getAll()]);
      setNews((n || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setCategories(c || []);
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ სიახლე?')) return;
    try {
      await newsApi.delete(id);
      await load();
      toast({ title: 'წაშლილია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const handleDuplicate = async (item) => {
    try {
      const { id, created_at, updated_at, slug, ...rest } = item;
      await newsApi.create({
        ...rest,
        title_ka: (rest.title_ka || '') + ' (ასლი)',
        title_en: (rest.title_en || '') + ' (copy)',
        published: false,
      });
      await load();
      toast({ title: 'დუბლიკატი შეიქმნა' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const handleCreate = () => {
    setEditing({
      title_ka: '', title_en: '', content_ka: '', content_en: '',
      excerpt_ka: '', excerpt_en: '', image_url: '', category_id: null,
      published: false, featured: false,
    });
  };

  const filtered = news.filter(n =>
    !search || (n.title_ka || '').toLowerCase().includes(search.toLowerCase()) ||
    (n.title_en || '').toLowerCase().includes(search.toLowerCase())
  );

  if (editing) {
    return <NewsEditor item={editing} categories={categories} onBack={() => { setEditing(null); load(); }} toast={toast} />;
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">სიახლეების მართვა</h1>
          <p className="text-sm text-slate-500 mt-0.5">{news.length} სიახლე</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">
          <Plus size={16} /> ახალი სიახლე
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ძიება..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white" />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:border-slate-300 transition-colors group">
            {item.image_url ? (
              <img src={item.image_url} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><ImageIcon size={20} className="text-slate-300" /></div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{item.title_ka || item.title_en || 'უსათაურო'}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(item.created_at).toLocaleDateString('ka-GE')}
                {item.category_id && categories.find(c => c.id === item.category_id) && ` • ${categories.find(c => c.id === item.category_id).name_ka}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full ${item.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {item.published ? 'აქტიური' : 'დრაფტი'}
              </span>
              <button onClick={() => setEditing(item)} className="p-1.5 text-slate-400 hover:text-teal-500 hover:bg-teal-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Pencil size={14} /></button>
              <button onClick={() => handleDuplicate(item)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Copy size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-8">სიახლეები ვერ მოიძებნა</p>}
      </div>
    </div>
  );
};

const NewsEditor = ({ item, categories, onBack, toast }) => {
  const isNew = !item.id;
  const [data, setData] = useState(item);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const save = async () => {
    if (!data.title_ka?.trim()) { toast({ title: 'ქართული სათაური სავალდებულოა', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      if (isNew) {
        await newsApi.create(data);
      } else {
        await newsApi.update(data.id, data);
      }
      toast({ title: isNew ? 'შეიქმნა ✓' : 'განახლდა ✓' });
      onBack();
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadApi.upload(BUCKET, file);
      const url = result.url || uploadApi.getPublicUrl(result.path);
      setData({ ...data, image_url: url });
    } catch (e) { toast({ title: 'სურათის შეცდომა', description: e.message, variant: 'destructive' }); }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ArrowLeft size={18} className="text-slate-500" /></button>
          <h1 className="text-xl font-bold text-slate-800">{isNew ? 'ახალი სიახლე' : 'რედაქტირება'}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setData({ ...data, published: !data.published })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${data.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            {data.published ? <Eye size={14} /> : <EyeOff size={14} />}
            {data.published ? 'აქტიური' : 'დრაფტი'}
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="სათაური (KA)" value={data.title_ka} onChange={v => setData({ ...data, title_ka: v })} />
              <Field label="Title (EN)" value={data.title_en} onChange={v => setData({ ...data, title_en: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldArea label="მოკლე აღწერა (KA)" value={data.excerpt_ka} onChange={v => setData({ ...data, excerpt_ka: v })} rows={3} />
              <FieldArea label="Excerpt (EN)" value={data.excerpt_en} onChange={v => setData({ ...data, excerpt_en: v })} rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldArea label="სრული ტექსტი (KA)" value={data.content_ka} onChange={v => setData({ ...data, content_ka: v })} rows={10} />
              <FieldArea label="Content (EN)" value={data.content_en} onChange={v => setData({ ...data, content_en: v })} rows={10} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Image */}
          <div className="bg-white rounded-xl border p-5">
            <label className="text-xs font-medium text-slate-500 mb-2 block">სურათი</label>
            {data.image_url ? (
              <div className="relative mb-3">
                <img src={data.image_url} className="w-full aspect-video object-cover rounded-lg" alt="" />
                <button onClick={() => setData({ ...data, image_url: '' })} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={12} /></button>
              </div>
            ) : null}
            <label className="flex items-center justify-center gap-1.5 p-4 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 hover:border-teal-400 cursor-pointer transition-colors">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <><Upload size={16} /> სურათის ატვირთვა</>}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border p-5">
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">კატეგორია</label>
            <select value={data.category_id || ''} onChange={e => setData({ ...data, category_id: e.target.value || null })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none">
              <option value="">— აირჩიეთ —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name_ka || c.name_en}</option>)}
            </select>
          </div>
        </div>
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

export default PaneliNews;

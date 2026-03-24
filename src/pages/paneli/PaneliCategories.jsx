import React, { useState, useEffect, useCallback } from 'react';
import { newsCategoriesApi } from '@/lib/apiClient';
import { Plus, Trash2, Save, Loader2, Pencil, X, Check, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaneliCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name_ka: '', name_en: '', slug: '', is_active: true });
  const { toast } = useToast();

  const load = useCallback(async () => {
    try {
      const data = await newsCategoriesApi.getAll();
      setCategories((data || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newCat.name_ka.trim()) { toast({ title: 'ქართ. სახელი სავალდებულოა', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      await newsCategoriesApi.create({ ...newCat, sort_order: categories.length });
      setNewCat({ name_ka: '', name_en: '', slug: '', is_active: true });
      setShowAdd(false);
      await load();
      toast({ title: 'დამატებულია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const handleUpdate = async (cat) => {
    try {
      await newsCategoriesApi.update(cat.id, cat);
      setEditingId(null);
      await load();
      toast({ title: 'განახლდა' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    try {
      await newsCategoriesApi.delete(id);
      await load();
      toast({ title: 'წაშლილია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const moveItem = (index, dir) => {
    const items = [...categories];
    const swap = index + dir;
    if (swap < 0 || swap >= items.length) return;
    [items[index], items[swap]] = [items[swap], items[index]];
    setCategories(items);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const ordered = categories.map((c, i) => ({ id: c.id, sort_order: i }));
      await newsCategoriesApi.bulkUpdateOrder(ordered);
      toast({ title: 'რიგი შენახულია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const updateField = (index, field, value) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">კატეგორიების მართვა</h1>
          <p className="text-sm text-slate-500 mt-0.5">სიახლეების კატეგორიები</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">
            <Plus size={16} /> დამატება
          </button>
          <button onClick={saveOrder} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} რიგის შენახვა
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-teal-800">ახალი კატეგორია</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="სახელი (KA)" value={newCat.name_ka} onChange={e => setNewCat({ ...newCat, name_ka: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
            <input placeholder="Name (EN)" value={newCat.name_en} onChange={e => setNewCat({ ...newCat, name_en: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
            <input placeholder="Slug (url)" value={newCat.slug} onChange={e => setNewCat({ ...newCat, slug: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving} className="px-4 py-1.5 bg-teal-500 text-white rounded-lg text-sm font-medium">დამატება</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-1.5 text-slate-500 text-sm">გაუქმება</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_1fr_120px_80px_80px] gap-2 px-4 py-2.5 bg-slate-50 border-b text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <span>რიგი</span><span>ქართული</span><span>English</span><span>Slug</span><span>სტატუსი</span><span></span>
        </div>
        {categories.map((cat, i) => (
          <div key={cat.id} className="grid grid-cols-[60px_1fr_1fr_120px_80px_80px] gap-2 px-4 py-3 border-b border-slate-100 items-center hover:bg-slate-50/50 group">
            <div className="flex items-center gap-1">
              <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronUp size={12} /></button>
              <span className="text-xs text-slate-400 font-mono">{i + 1}</span>
              <button onClick={() => moveItem(i, 1)} disabled={i === categories.length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronDown size={12} /></button>
            </div>
            {editingId === cat.id ? (
              <>
                <input value={cat.name_ka} onChange={e => updateField(i, 'name_ka', e.target.value)} className="border border-teal-300 rounded px-2 py-1 text-sm" />
                <input value={cat.name_en || ''} onChange={e => updateField(i, 'name_en', e.target.value)} className="border border-teal-300 rounded px-2 py-1 text-sm" />
                <input value={cat.slug || ''} onChange={e => updateField(i, 'slug', e.target.value)} className="border border-teal-300 rounded px-2 py-1 text-sm font-mono" />
              </>
            ) : (
              <>
                <span className="text-sm text-slate-700 font-medium">{cat.name_ka}</span>
                <span className="text-sm text-slate-500">{cat.name_en}</span>
                <span className="text-xs text-slate-400 font-mono">{cat.slug}</span>
              </>
            )}
            <button onClick={() => updateField(i, 'is_active', !cat.is_active)}
              className={`flex items-center justify-center text-xs rounded-full px-2 py-0.5 ${cat.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
              {cat.is_active !== false ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <div className="flex gap-1">
              {editingId === cat.id ? (
                <>
                  <button onClick={() => handleUpdate(cat)} className="p-1 text-green-500 hover:bg-green-50 rounded"><Check size={14} /></button>
                  <button onClick={() => { setEditingId(null); load(); }} className="p-1 text-slate-400 hover:bg-slate-50 rounded"><X size={14} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditingId(cat.id)} className="p-1 text-slate-400 hover:text-teal-500 rounded opacity-0 group-hover:opacity-100 transition-all"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1 text-slate-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-center text-slate-400 text-sm py-8">კატეგორიები ცარიელია</p>}
      </div>
    </div>
  );
};

export default PaneliCategories;

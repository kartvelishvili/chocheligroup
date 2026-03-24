import React, { useState, useEffect, useCallback } from 'react';
import { menuItemsApi } from '@/lib/apiClient';
import { Plus, ChevronUp, ChevronDown, Trash2, Save, Loader2, Eye, EyeOff, Pencil, X, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const emptyItem = () => ({ label_ka: '', label_en: '', path: '', is_active: true, sort_order: 0 });

const PaneliMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState(emptyItem());
  const { toast } = useToast();

  const load = useCallback(async () => {
    try {
      const data = await menuItemsApi.getAll();
      setItems((data || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const ordered = items.map((it, i) => ({ ...it, sort_order: i }));
      await menuItemsApi.bulkUpsert(ordered);
      toast({ title: 'შენახულია', description: 'მენიუ წარმატებით განახლდა' });
      await load();
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!newItem.label_ka.trim() || !newItem.path.trim()) {
      toast({ title: 'შეავსეთ ველები', description: 'ქართული სახელი და ბმული სავალდებულოა', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await menuItemsApi.create({ ...newItem, sort_order: items.length });
      setNewItem(emptyItem());
      setShowAdd(false);
      await load();
      toast({ title: 'დამატებულია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    try {
      await menuItemsApi.delete(id);
      await load();
      toast({ title: 'წაშლილია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const handleUpdate = async (item) => {
    try {
      await menuItemsApi.update(item.id, item);
      setEditingId(null);
      await load();
      toast({ title: 'განახლდა' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const moveItem = (index, dir) => {
    const newItems = [...items];
    const swap = index + dir;
    if (swap < 0 || swap >= newItems.length) return;
    [newItems[index], newItems[swap]] = [newItems[swap], newItems[index]];
    setItems(newItems);
  };

  const updateField = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">მენიუს მართვა</h1>
          <p className="text-sm text-slate-500 mt-0.5">ნავიგაციის ელემენტების მართვა (KA/EN)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors">
            <Plus size={16} /> დამატება
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
          </button>
        </div>
      </div>

      {/* Add new */}
      {showAdd && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-teal-800">ახალი მენიუ ელემენტი</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="სახელი (KA)" value={newItem.label_ka} onChange={e => setNewItem({ ...newItem, label_ka: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            <input placeholder="Name (EN)" value={newItem.label_en} onChange={e => setNewItem({ ...newItem, label_en: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            <input placeholder="ბმული (მაგ: /about)" value={newItem.path} onChange={e => setNewItem({ ...newItem, path: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving} className="px-4 py-1.5 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">დამატება</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-1.5 text-slate-500 text-sm hover:text-slate-700">გაუქმება</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_1fr_140px_80px_80px] gap-2 px-4 py-2.5 bg-slate-50 border-b text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <span></span><span>ქართული</span><span>English</span><span>ბმული</span><span>სტატუსი</span><span></span>
        </div>
        {items.map((item, i) => (
          <div key={item.id} className="grid grid-cols-[40px_1fr_1fr_140px_80px_80px] gap-2 px-4 py-3 border-b border-slate-100 items-center hover:bg-slate-50/50 group">
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="text-slate-400 hover:text-teal-600 disabled:opacity-20 p-0.5 rounded hover:bg-slate-100 transition-colors"><ChevronUp size={14} /></button>
              <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="text-slate-400 hover:text-teal-600 disabled:opacity-20 p-0.5 rounded hover:bg-slate-100 transition-colors"><ChevronDown size={14} /></button>
            </div>
            {editingId === item.id ? (
              <>
                <input value={item.label_ka} onChange={e => updateField(i, 'label_ka', e.target.value)} className="border border-teal-300 rounded px-2 py-1 text-sm" />
                <input value={item.label_en} onChange={e => updateField(i, 'label_en', e.target.value)} className="border border-teal-300 rounded px-2 py-1 text-sm" />
                <input value={item.path} onChange={e => updateField(i, 'path', e.target.value)} className="border border-teal-300 rounded px-2 py-1 text-sm" />
              </>
            ) : (
              <>
                <span className="text-sm text-slate-700 font-medium">{item.label_ka}</span>
                <span className="text-sm text-slate-500">{item.label_en}</span>
                <span className="text-xs text-slate-400 font-mono">{item.path}</span>
              </>
            )}
            <button onClick={() => updateField(i, 'is_active', !item.is_active)}
              className={`flex items-center justify-center gap-1 text-xs rounded-full px-2 py-0.5 ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
              {item.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <div className="flex gap-1">
              {editingId === item.id ? (
                <>
                  <button onClick={() => handleUpdate(item)} className="p-1 text-green-500 hover:bg-green-50 rounded"><Check size={14} /></button>
                  <button onClick={() => { setEditingId(null); load(); }} className="p-1 text-slate-400 hover:bg-slate-50 rounded"><X size={14} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditingId(item.id)} className="p-1 text-slate-400 hover:text-teal-500 hover:bg-teal-50 rounded opacity-0 group-hover:opacity-100 transition-all"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                </>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-slate-400 text-sm py-8">მენიუ ცარიელია</p>}
      </div>
    </div>
  );
};

export default PaneliMenu;

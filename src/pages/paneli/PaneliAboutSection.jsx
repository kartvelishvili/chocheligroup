import React, { useState, useEffect } from 'react';
import { whoWeAreApi } from '@/lib/apiClient';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaneliAboutSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const r = await whoWeAreApi.get();
        setData(r || {});
      } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await whoWeAreApi.update(data);
      toast({ title: 'შენახულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">ჩვენ შესახებ სექცია</h1>
          <p className="text-sm text-slate-500 mt-0.5">მთავარი გვერდის „ვინ ვართ" ბლოკი</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
        </button>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">სათაურები</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="სათაური (KA)" value={data.title_ka} onChange={v => setData({ ...data, title_ka: v })} />
          <Field label="Title (EN)" value={data.title_en} onChange={v => setData({ ...data, title_en: v })} />
        </div>

        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2 pt-2">მოკლე აღწერა</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldArea label="აღწერა (KA)" value={data.description_ka} onChange={v => setData({ ...data, description_ka: v })} rows={4} />
          <FieldArea label="Description (EN)" value={data.description_en} onChange={v => setData({ ...data, description_en: v })} rows={4} />
        </div>

        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2 pt-2">სრული ტექსტი</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldArea label="ტექსტი (KA)" value={data.content_ka} onChange={v => setData({ ...data, content_ka: v })} rows={8} />
          <FieldArea label="Content (EN)" value={data.content_en} onChange={v => setData({ ...data, content_en: v })} rows={8} />
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

export default PaneliAboutSection;

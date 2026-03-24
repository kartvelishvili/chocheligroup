import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteContentApi } from '@/lib/apiClient';
import { Save, Loader2, Building2, Clock, FileText, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaneliPagePortfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const r = await siteContentApi.getBySection('portfolio_page');
        setData(r.content || {});
      } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await siteContentApi.update('portfolio_page', data);
      toast({ title: 'შენახულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!data) return null;

  const manageSections = [
    { icon: Building2, title: 'კომპანიები და ქვე-ბრენდები', desc: 'კომპანიების რედაქტირება, ლოგოები, ქვე-ბრენდები', to: '/paneli/portfolio-section', color: '#06b6d4' },
    { icon: Clock, title: 'ისტორიის Timeline', desc: 'წლების მიხედვით კომპანიის ისტორიის ეტაპები', to: '/paneli/portfolio-section', color: '#8b5cf6' },
    { icon: FileText, title: 'გვერდის ტექსტები', desc: 'სათაურები და ქვესათაურები (KA/EN) — ქვემოთ', to: '#texts', color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">პორტფოლიო / ისტორია</h1>
          <p className="text-sm text-slate-500 mt-0.5">/portfolio გვერდის მართვა</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
        </button>
      </div>

      {/* Visual management guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {manageSections.map((s, i) => (
          <Link key={i} to={s.to} className="group bg-white rounded-xl border border-slate-100 p-5 hover:border-teal-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: s.color + '15' }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-800">{s.title}</p>
                <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-teal-500 mt-1 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Page texts */}
      <div id="texts" className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">გვერდის ტექსტები</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="სათაური (KA)" value={data.title_ka} onChange={v => setData({ ...data, title_ka: v })} />
          <Field label="Title (EN)" value={data.title_en} onChange={v => setData({ ...data, title_en: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldArea label="ქვესათაური (KA)" value={data.subtitle_ka} onChange={v => setData({ ...data, subtitle_ka: v })} />
          <FieldArea label="Subtitle (EN)" value={data.subtitle_en} onChange={v => setData({ ...data, subtitle_en: v })} />
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

const FieldArea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" />
  </div>
);

export default PaneliPagePortfolio;

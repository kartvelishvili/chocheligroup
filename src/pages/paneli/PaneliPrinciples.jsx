import React, { useState, useEffect } from 'react';
import { siteContentApi } from '@/lib/apiClient';
import { Save, Loader2, Plus, Trash2, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ICON_OPTIONS = ['Factory', 'TrendingUp', 'Award', 'Shield', 'Handshake', 'Zap', 'Target', 'Star', 'Heart', 'Globe'];

const PaneliPrinciples = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const r = await siteContentApi.getBySection('execution_dna');
        setData(r.content || { section_title_ka: '', section_title_en: '', capabilities: [] });
      } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await siteContentApi.update('execution_dna', data);
      toast({ title: 'შენახულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const addCapability = () => {
    setData({ ...data, capabilities: [...(data.capabilities || []), { icon: 'Award', title_ka: '', title_en: '', description_ka: '', description_en: '' }] });
  };

  const duplicateCapability = (index) => {
    const item = { ...data.capabilities[index], title_ka: data.capabilities[index].title_ka + ' (ასლი)' };
    const items = [...data.capabilities];
    items.splice(index + 1, 0, item);
    setData({ ...data, capabilities: items });
  };

  const removeCapability = (index) => {
    setData({ ...data, capabilities: data.capabilities.filter((_, i) => i !== index) });
  };

  const updateCapability = (index, field, value) => {
    const items = [...data.capabilities];
    items[index] = { ...items[index], [field]: value };
    setData({ ...data, capabilities: items });
  };

  const moveCapability = (index, dir) => {
    const items = [...data.capabilities];
    const swap = index + dir;
    if (swap < 0 || swap >= items.length) return;
    [items[index], items[swap]] = [items[swap], items[index]];
    setData({ ...data, capabilities: items });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">პრინციპები / Execution DNA</h1>
          <p className="text-sm text-slate-500 mt-0.5">მთავარი გვერდის პრინციპების სექცია</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
        </button>
      </div>

      {/* Section title */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold text-sm text-slate-700">სექციის სათაური</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="სათაური (KA)" value={data.section_title_ka} onChange={v => setData({ ...data, section_title_ka: v })} />
          <Field label="Section Title (EN)" value={data.section_title_en} onChange={v => setData({ ...data, section_title_en: v })} />
        </div>
      </div>

      {/* Capabilities */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-700">პრინციპები ({(data.capabilities || []).length})</h3>
        <button onClick={addCapability} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
          <Plus size={14} /> დამატება
        </button>
      </div>

      {(data.capabilities || []).map((cap, i) => (
        <CapabilityCard key={i} cap={cap} index={i}
          onUpdate={(f, v) => updateCapability(i, f, v)}
          onDelete={() => removeCapability(i)}
          onDuplicate={() => duplicateCapability(i)}
          onMove={(dir) => moveCapability(i, dir)}
          isFirst={i === 0} isLast={i === data.capabilities.length - 1}
        />
      ))}
    </div>
  );
};

const CapabilityCard = ({ cap, index, onUpdate, onDelete, onDuplicate, onMove, isFirst, isLast }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold">{index + 1}</span>
          <div>
            <p className="text-sm font-medium text-slate-700">{cap.title_ka || 'ახალი პრინციპი'}</p>
            <p className="text-xs text-slate-400">{cap.icon}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={e => { e.stopPropagation(); onMove(-1); }} disabled={isFirst} className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronUp size={14} /></button>
          <button onClick={e => { e.stopPropagation(); onMove(1); }} disabled={isLast} className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronDown size={14} /></button>
          <button onClick={e => { e.stopPropagation(); onDuplicate(); }} className="p-1 text-slate-300 hover:text-blue-500"><Copy size={14} /></button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
          {open ? <ChevronUp size={16} className="text-slate-400 ml-2" /> : <ChevronDown size={16} className="text-slate-400 ml-2" />}
        </div>
      </div>
      {open && (
        <div className="p-4 border-t space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">აიკონი</label>
            <div className="flex flex-wrap gap-1.5">
              {ICON_OPTIONS.map(icon => (
                <button key={icon} onClick={() => onUpdate('icon', icon)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${cap.icon === icon ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="სათაური (KA)" value={cap.title_ka} onChange={v => onUpdate('title_ka', v)} />
            <Field label="Title (EN)" value={cap.title_en} onChange={v => onUpdate('title_en', v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldArea label="აღწერა (KA)" value={cap.description_ka} onChange={v => onUpdate('description_ka', v)} />
            <FieldArea label="Description (EN)" value={cap.description_en} onChange={v => onUpdate('description_en', v)} />
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

const FieldArea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" />
  </div>
);

export default PaneliPrinciples;

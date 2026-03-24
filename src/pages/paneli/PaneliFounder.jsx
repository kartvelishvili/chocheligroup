import React, { useState, useEffect, useCallback } from 'react';
import { siteContentApi, uploadApi } from '@/lib/apiClient';
import { Save, Loader2, Plus, Trash2, Upload, ChevronDown, ChevronUp, Image, Users, User, Home } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BUCKET = 'site-chocheligroup-com';

const PaneliFounder = () => {
  const [tab, setTab] = useState('page');
  const [founder, setFounder] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    try {
      const [fp, fh] = await Promise.all([
        siteContentApi.getBySection('founder_page'),
        siteContentApi.getBySection('founder_highlight'),
      ]);
      setFounder(fp.content || {});
      setHighlight(fh.content || {});
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const uploadImage = async (file) => {
    try {
      const result = await uploadApi.upload(BUCKET, file);
      return result.url || uploadApi.getPublicUrl(result.path);
    } catch (e) { toast({ title: 'სურათის შეცდომა', description: e.message, variant: 'destructive' }); return null; }
  };

  const saveFounder = async () => {
    setSaving(true);
    try {
      await siteContentApi.update('founder_page', founder);
      toast({ title: 'შენახულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const saveHighlight = async () => {
    setSaving(true);
    try {
      await siteContentApi.update('founder_highlight', highlight);
      toast({ title: 'შენახულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;

  const tabs = [
    { key: 'page', label: 'დამფუძნებლის გვერდი', icon: User },
    { key: 'team', label: 'მენეჯმენტი', icon: Users },
    { key: 'homepage', label: 'მთავარი გვერდი', icon: Home },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">დამფუძნებლის გვერდი</h1>
          <p className="text-sm text-slate-500 mt-0.5">/founder (KA) + /founder-en (EN)</p>
        </div>
        <button onClick={tab === 'homepage' ? saveHighlight : saveFounder} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === t.key ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Page Tab - Hero, Milestones, Bio */}
      {tab === 'page' && founder && (
        <div className="space-y-6">
          {/* Hero */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">ჰერო სექცია</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="სახელი (KA)" value={founder.hero_name} onChange={v => setFounder({ ...founder, hero_name: v })} />
              <Field label="Name (EN)" value={founder.hero_name_en} onChange={v => setFounder({ ...founder, hero_name_en: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="ქვესათაური (KA)" value={founder.hero_subtitle_ka} onChange={v => setFounder({ ...founder, hero_subtitle_ka: v })} />
              <Field label="Subtitle (EN)" value={founder.hero_subtitle_en} onChange={v => setFounder({ ...founder, hero_subtitle_en: v })} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">ჰერო სურათი</label>
              <div className="flex items-center gap-4">
                {founder.hero_image_url && <img src={founder.hero_image_url} className="w-20 h-20 rounded-xl object-cover border" alt="" />}
                <ImageUpload onUpload={async (file) => { const url = await uploadImage(file); if (url) setFounder({ ...founder, hero_image_url: url }); }} />
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-700">მილესტონები (Timeline)</h3>
              <button onClick={() => setFounder({ ...founder, milestones: [...(founder.milestones || []), { year: '', title_ka: '', title_en: '' }] })}
                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium"><Plus size={14} /> დამატება</button>
            </div>
            {(founder.milestones || []).map((m, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg relative group">
                <button onClick={() => setFounder({ ...founder, milestones: founder.milestones.filter((_, j) => j !== i) })}
                  className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                <div className="w-20">
                  <label className="text-[10px] font-medium text-slate-400 block mb-1">წელი</label>
                  <input value={m.year || ''} onChange={e => { const ms = [...founder.milestones]; ms[i] = { ...ms[i], year: e.target.value }; setFounder({ ...founder, milestones: ms }); }}
                    className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm text-center font-semibold" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input value={m.title_ka || ''} onChange={e => { const ms = [...founder.milestones]; ms[i] = { ...ms[i], title_ka: e.target.value }; setFounder({ ...founder, milestones: ms }); }}
                    placeholder="KA" className="border border-slate-200 rounded px-2 py-1.5 text-sm" />
                  <input value={m.title_en || ''} onChange={e => { const ms = [...founder.milestones]; ms[i] = { ...ms[i], title_en: e.target.value }; setFounder({ ...founder, milestones: ms }); }}
                    placeholder="EN" className="border border-slate-200 rounded px-2 py-1.5 text-sm" />
                </div>
              </div>
            ))}
          </div>

          {/* Bio Sections */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-700">ბიოგრაფიის სექციები</h3>
              <button onClick={() => setFounder({ ...founder, bio_sections: [...(founder.bio_sections || []), { id: Date.now().toString(), title_ka: '', text_ka: '', title_en: '', text_en: '', image_url: '' }] })}
                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium"><Plus size={14} /> დამატება</button>
            </div>
            {(founder.bio_sections || []).map((sec, i) => (
              <BioSection key={sec.id || i} section={sec} index={i}
                onChange={(field, value) => { const bs = [...founder.bio_sections]; bs[i] = { ...bs[i], [field]: value }; setFounder({ ...founder, bio_sections: bs }); }}
                onRemove={() => setFounder({ ...founder, bio_sections: founder.bio_sections.filter((_, j) => j !== i) })}
                onUploadImage={uploadImage}
              />
            ))}
          </div>
        </div>
      )}

      {/* Team Tab - Management team */}
      {tab === 'team' && founder && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-medium mb-1">ℹ️ მენეჯმენტის გუნდი</p>
            <p>დამფუძნებელი და მენეჯმენტი /founder გვერდზე. წევრების რედაქტირება, სურათების შეცვლა.</p>
          </div>

          {/* Founder */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">დამფუძნებელი</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="სახელი (KA)" value={founder.founder_name_ka || 'ცეზარ ჩოჩელი'} onChange={v => setFounder({ ...founder, founder_name_ka: v })} />
              <Field label="Name (EN)" value={founder.founder_name_en || 'Tsezar Chocheli'} onChange={v => setFounder({ ...founder, founder_name_en: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="თანამდებობა (KA)" value={founder.founder_role_ka || 'დამფუძნებელი'} onChange={v => setFounder({ ...founder, founder_role_ka: v })} />
              <Field label="Role (EN)" value={founder.founder_role_en || 'Founder'} onChange={v => setFounder({ ...founder, founder_role_en: v })} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">სურათი</label>
              <div className="flex items-center gap-4">
                {founder.founder_image_url && <img src={founder.founder_image_url} className="w-16 h-16 rounded-full object-cover border" alt="" />}
                <ImageUpload onUpload={async (file) => { const url = await uploadImage(file); if (url) setFounder({ ...founder, founder_image_url: url }); }} />
              </div>
            </div>
          </div>

          {/* Team members */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-700">მენეჯმენტის წევრები</h3>
              <button onClick={() => setFounder({ ...founder, team_members: [...(founder.team_members || []), { name_ka: '', name_en: '', role_ka: '', role_en: '', image_url: '' }] })}
                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium"><Plus size={14} /> დამატება</button>
            </div>
            {(founder.team_members || []).map((member, i) => (
              <TeamMemberCard key={i} member={member} index={i}
                onChange={(field, value) => { const tm = [...founder.team_members]; tm[i] = { ...tm[i], [field]: value }; setFounder({ ...founder, team_members: tm }); }}
                onRemove={() => setFounder({ ...founder, team_members: founder.team_members.filter((_, j) => j !== i) })}
                onUploadImage={uploadImage}
              />
            ))}
            {(founder.team_members || []).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">წევრები ჯერ არ არის. დაამატეთ ზემოთ ღილაკით.</p>
            )}
          </div>
        </div>
      )}

      {/* Homepage Tab - Founder highlight */}
      {tab === 'homepage' && highlight && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-medium mb-1">ℹ️ მთავარი გვერდის ბლოკი</p>
            <p>მთავარ გვერდზე დამფუძნებლის მოკლე პრეზენტაცია (FounderHighlight კომპონენტი).</p>
          </div>

          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">დამფუძნებლის ბლოკი</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="სახელი (KA)" value={highlight.name_ka} onChange={v => setHighlight({ ...highlight, name_ka: v })} />
              <Field label="Name (EN)" value={highlight.name_en} onChange={v => setHighlight({ ...highlight, name_en: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldArea label="აბზაცი 1 (KA)" value={highlight.bio_paragraph1_ka} onChange={v => setHighlight({ ...highlight, bio_paragraph1_ka: v })} />
              <FieldArea label="Paragraph 1 (EN)" value={highlight.bio_paragraph1_en} onChange={v => setHighlight({ ...highlight, bio_paragraph1_en: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldArea label="აბზაცი 2 (KA)" value={highlight.bio_paragraph2_ka} onChange={v => setHighlight({ ...highlight, bio_paragraph2_ka: v })} />
              <FieldArea label="Paragraph 2 (EN)" value={highlight.bio_paragraph2_en} onChange={v => setHighlight({ ...highlight, bio_paragraph2_en: v })} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">სურათი</label>
              <div className="flex items-center gap-4">
                {highlight.image_url && <img src={highlight.image_url} className="w-20 h-20 rounded-xl object-cover border" alt="" />}
                <ImageUpload onUpload={async (file) => { const url = await uploadImage(file); if (url) setHighlight({ ...highlight, image_url: url }); }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BioSection = ({ section, index, onChange, onRemove, onUploadImage }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-slate-50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <p className="text-sm font-medium text-slate-700">{section.title_ka || `სექცია ${index + 1}`}</p>
        <div className="flex items-center gap-1">
          <button onClick={e => { e.stopPropagation(); onRemove(); }} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
          {expanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </div>
      </div>
      {expanded && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="სათაური (KA)" value={section.title_ka} onChange={v => onChange('title_ka', v)} />
            <Field label="Title (EN)" value={section.title_en} onChange={v => onChange('title_en', v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FieldArea label="ტექსტი (KA)" value={section.text_ka} onChange={v => onChange('text_ka', v)} />
            <FieldArea label="Text (EN)" value={section.text_en} onChange={v => onChange('text_en', v)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">სურათი</label>
            <div className="flex items-center gap-3">
              {section.image_url && <img src={section.image_url} className="w-14 h-14 rounded-lg object-cover border" alt="" />}
              <ImageUpload onUpload={async (file) => { const url = await onUploadImage(file); if (url) onChange('image_url', url); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TeamMemberCard = ({ member, index, onChange, onRemove, onUploadImage }) => (
  <div className="border border-slate-100 rounded-lg p-4 space-y-3 relative group">
    <button onClick={onRemove} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
    <div className="flex items-center gap-4">
      {member.image_url ? (
        <img src={member.image_url} className="w-14 h-14 rounded-full object-cover border" alt="" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center"><User size={20} className="text-slate-400" /></div>
      )}
      <ImageUpload onUpload={async (file) => { const url = await onUploadImage(file); if (url) onChange('image_url', url); }} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="სახელი (KA)" value={member.name_ka} onChange={v => onChange('name_ka', v)} />
      <Field label="Name (EN)" value={member.name_en} onChange={v => onChange('name_en', v)} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="თანამდებობა (KA)" value={member.role_ka} onChange={v => onChange('role_ka', v)} />
      <Field label="Role (EN)" value={member.role_en} onChange={v => onChange('role_en', v)} />
    </div>
  </div>
);

const ImageUpload = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };
  return (
    <label className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
      {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
      <span>ატვირთვა</span>
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </label>
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

export default PaneliFounder;

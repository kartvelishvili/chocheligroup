import React, { useState, useEffect } from 'react';
import { siteContentApi, uploadApi } from '@/lib/apiClient';
import { Save, Loader2, Plus, Trash2, Upload, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BUCKET = 'site-chocheligroup-com';

const PaneliLeadership = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const r = await siteContentApi.getBySection('leadership');
        setData(r.content || { section_title_ka: '', section_title_en: '', members: [] });
      } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await siteContentApi.update('leadership', data);
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

  const addMember = () => {
    setData({ ...data, members: [...(data.members || []), { name_ka: '', name_en: '', role_ka: '', role_en: '', bio_ka: '', bio_en: '', image_url: '' }] });
  };

  const updateMember = (index, field, value) => {
    const members = [...data.members];
    members[index] = { ...members[index], [field]: value };
    setData({ ...data, members });
  };

  const removeMember = (index) => {
    setData({ ...data, members: data.members.filter((_, i) => i !== index) });
  };

  const moveMember = (index, dir) => {
    const members = [...data.members];
    const swap = index + dir;
    if (swap < 0 || swap >= members.length) return;
    [members[index], members[swap]] = [members[swap], members[index]];
    setData({ ...data, members });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">ხელმძღვანელობა</h1>
          <p className="text-sm text-slate-500 mt-0.5">გუნდის წევრები, ფოტოები, ბიო</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
        </button>
      </div>

      {/* Section title */}
      <div className="bg-white rounded-xl border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="სექციის სათაური (KA)" value={data.section_title_ka} onChange={v => setData({ ...data, section_title_ka: v })} />
          <Field label="Section Title (EN)" value={data.section_title_en} onChange={v => setData({ ...data, section_title_en: v })} />
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-700">წევრები ({(data.members || []).length})</h3>
        <button onClick={addMember} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
          <Plus size={14} /> წევრის დამატება
        </button>
      </div>

      {(data.members || []).map((member, i) => (
        <MemberCard key={i} member={member} index={i}
          onUpdate={(f, v) => updateMember(i, f, v)}
          onDelete={() => removeMember(i)}
          onMove={(dir) => moveMember(i, dir)}
          onUpload={uploadImage}
          isFirst={i === 0} isLast={i === data.members.length - 1}
        />
      ))}
    </div>
  );
};

const MemberCard = ({ member, index, onUpdate, onDelete, onMove, onUpload, isFirst, isLast }) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await onUpload(file);
    if (url) onUpdate('image_url', url);
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
          {member.image_url ? (
            <img src={member.image_url} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" alt="" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center"><Users size={16} className="text-slate-400" /></div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-700">{member.name_ka || 'ახალი წევრი'}</p>
            <p className="text-xs text-slate-400">{member.role_ka}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {open && (
        <div className="p-4 border-t space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="სახელი (KA)" value={member.name_ka} onChange={v => onUpdate('name_ka', v)} />
            <Field label="Name (EN)" value={member.name_en} onChange={v => onUpdate('name_en', v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="თანამდებობა (KA)" value={member.role_ka} onChange={v => onUpdate('role_ka', v)} />
            <Field label="Role (EN)" value={member.role_en} onChange={v => onUpdate('role_en', v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldArea label="ბიოგრაფია (KA)" value={member.bio_ka} onChange={v => onUpdate('bio_ka', v)} rows={4} />
            <FieldArea label="Biography (EN)" value={member.bio_en} onChange={v => onUpdate('bio_en', v)} rows={4} />
          </div>

          {/* Photo */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">ფოტო</label>
            <div className="flex items-center gap-4">
              {member.image_url && <img src={member.image_url} className="w-20 h-20 rounded-xl object-cover border" alt="" />}
              <label className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span>ფოტოს ატვირთვა</span>
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

export default PaneliLeadership;

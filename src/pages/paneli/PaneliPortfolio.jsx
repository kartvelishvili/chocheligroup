import React, { useState, useEffect, useCallback } from 'react';
import { companiesApi, subBrandsApi, uploadApi } from '@/lib/apiClient';
import { Save, Loader2, Plus, Trash2, Upload, ChevronDown, ChevronUp, GripVertical, Image, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BUCKET = 'site-chocheligroup-com';

const PaneliPortfolio = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    try {
      const data = await companiesApi.getAll();
      setCompanies((data || []).sort((a, b) => (a.order_position || 0) - (b.order_position || 0)));
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

  const saveCompany = async (company) => {
    setSaving(true);
    try {
      const { sub_brands, ...companyData } = company;
      await companiesApi.update(company.id, companyData);
      if (sub_brands) {
        await subBrandsApi.bulkUpsert(company.id, sub_brands);
      }
      toast({ title: 'შენახულია ✓' });
      await load();
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const addCompany = async () => {
    setSaving(true);
    try {
      await companiesApi.create({
        name_ka: 'ახალი კომპანია',
        name_en: 'New Company',
        order_position: companies.length,
      });
      await load();
      toast({ title: 'დამატებულია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const deleteCompany = async (id) => {
    if (!confirm('წაშალოთ კომპანია?')) return;
    try {
      await companiesApi.delete(id);
      await load();
      toast({ title: 'წაშლილია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const moveCompany = async (index, dir) => {
    const items = [...companies];
    const swap = index + dir;
    if (swap < 0 || swap >= items.length) return;
    [items[index], items[swap]] = [items[swap], items[index]];
    setCompanies(items);
    // Persist order
    for (let i = 0; i < items.length; i++) {
      await companiesApi.updateOrder(items[i].id, i);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">პორტფოლიო / კომპანიები</h1>
          <p className="text-sm text-slate-500 mt-0.5">კომპანიები და ქვე-ბრენდები</p>
        </div>
        <button onClick={addCompany} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          <Plus size={16} /> კომპანიის დამატება
        </button>
      </div>

      {companies.map((company, i) => (
        <CompanyCard key={company.id} company={company} index={i}
          expanded={expandedId === company.id}
          onExpand={() => setExpandedId(expandedId === company.id ? null : company.id)}
          onSave={saveCompany} onDelete={() => deleteCompany(company.id)}
          onMove={(dir) => moveCompany(i, dir)}
          onUpload={uploadImage}
          isFirst={i === 0} isLast={i === companies.length - 1}
          saving={saving}
        />
      ))}
      {companies.length === 0 && (
        <div className="bg-white rounded-xl border p-8 text-center text-slate-400 text-sm">კომპანიები ჯერ არ არის</div>
      )}
    </div>
  );
};

const CompanyCard = ({ company: initial, index, expanded, onExpand, onSave, onDelete, onMove, onUpload, isFirst, isLast, saving }) => {
  const [company, setCompany] = useState(initial);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { setCompany(initial); }, [initial]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await onUpload(file);
    if (url) setCompany({ ...company, logo_url: url });
    setUploading(false);
  };

  const addSubBrand = () => {
    setCompany({
      ...company,
      sub_brands: [...(company.sub_brands || []), { name_ka: '', name_en: '', description_ka: '', description_en: '', logo_url: null, order_position: (company.sub_brands || []).length }]
    });
  };

  const updateSubBrand = (idx, field, value) => {
    const subs = [...(company.sub_brands || [])];
    subs[idx] = { ...subs[idx], [field]: value };
    setCompany({ ...company, sub_brands: subs });
  };

  const removeSubBrand = (idx) => {
    setCompany({ ...company, sub_brands: company.sub_brands.filter((_, i) => i !== idx) });
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50" onClick={onExpand}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <button onClick={e => { e.stopPropagation(); onMove(-1); }} disabled={isFirst} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronUp size={12} /></button>
            <button onClick={e => { e.stopPropagation(); onMove(1); }} disabled={isLast} className="text-slate-300 hover:text-slate-600 disabled:opacity-20"><ChevronDown size={12} /></button>
          </div>
          {company.logo_url ? (
            <img src={company.logo_url} className="w-10 h-10 rounded-lg object-contain bg-slate-50 border p-1" alt="" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center"><Building2 size={16} className="text-slate-400" /></div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-700">{company.name_ka || 'კომპანია'}</p>
            <p className="text-xs text-slate-400">{company.name_en} • {(company.sub_brands || []).length} ქვე-ბრენდი</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="სახელი (KA)" value={company.name_ka} onChange={v => setCompany({ ...company, name_ka: v })} />
            <Field label="Name (EN)" value={company.name_en} onChange={v => setCompany({ ...company, name_en: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="დაფუძნების წელი" value={company.founded_year} onChange={v => setCompany({ ...company, founded_year: v })} />
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">ლოგო</label>
              <div className="flex items-center gap-3">
                {company.logo_url && <img src={company.logo_url} className="w-12 h-12 rounded-lg object-contain border p-1" alt="" />}
                <label className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
                  {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  <span>ატვირთვა</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldArea label="აღწერა (KA)" value={company.description_ka} onChange={v => setCompany({ ...company, description_ka: v })} />
            <FieldArea label="Description (EN)" value={company.description_en} onChange={v => setCompany({ ...company, description_en: v })} />
          </div>

          {/* Sub-brands */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700">ქვე-ბრენდები ({(company.sub_brands || []).length})</h4>
              <button onClick={addSubBrand} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
                <Plus size={14} /> დამატება
              </button>
            </div>
            {(company.sub_brands || []).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">ქვე-ბრენდები ჯერ არ არის. დაამატეთ ზემოთ ღილაკით.</p>
            )}
            {(company.sub_brands || []).map((sb, j) => (
              <SubBrandRow key={j} sb={sb} index={j} onUpdate={updateSubBrand} onRemove={removeSubBrand} onUpload={onUpload} />
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => onSave(company)} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} შენახვა
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SubBrandRow = ({ sb, index, onUpdate, onRemove, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const handleLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await onUpload(file);
    if (url) onUpdate(index, 'logo_url', url);
    setUploading(false);
  };
  
  return (
    <div className="mb-3 border border-slate-100 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 p-3 bg-slate-50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {sb.logo_url ? (
          <img src={sb.logo_url} className="w-8 h-8 rounded object-contain bg-white border p-0.5" alt="" />
        ) : (
          <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center"><Image size={12} className="text-slate-400" /></div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700 truncate">{sb.name_ka || sb.name_en || 'ახალი ქვე-ბრენდი'}</p>
          {sb.name_en && <p className="text-xs text-slate-400 truncate">{sb.name_en}</p>}
        </div>
        <button onClick={e => { e.stopPropagation(); onRemove(index); }} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
        {expanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </div>
      {expanded && (
        <div className="p-3 space-y-3 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">სახელი (KA)</label>
              <input value={sb.name_ka || ''} onChange={e => onUpdate(index, 'name_ka', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Name (EN)</label>
              <input value={sb.name_en || ''} onChange={e => onUpdate(index, 'name_en', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">აღწერა (KA)</label>
              <textarea value={sb.description_ka || ''} onChange={e => onUpdate(index, 'description_ka', e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Description (EN)</label>
              <textarea value={sb.description_en || ''} onChange={e => onUpdate(index, 'description_en', e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">ლოგო</label>
            <div className="flex items-center gap-3">
              {sb.logo_url && <img src={sb.logo_url} className="w-12 h-12 rounded-lg object-contain border p-1" alt="" />}
              <label className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                <span>ატვირთვა</span>
                <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
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

const FieldArea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" />
  </div>
);

export default PaneliPortfolio;

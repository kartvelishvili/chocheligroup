import React, { useState, useEffect } from 'react';
import { siteContentApi } from '@/lib/apiClient';
import { Save, Loader2, Plus, Trash2, Eye, EyeOff, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaneliFooter = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const r = await siteContentApi.getBySection('footer');
        setData(r.content || {});
      } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await siteContentApi.update('footer', data);
      toast({ title: 'შენახულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;
  if (!data) return null;

  const socials = data.social_links || {};
  const quickLinks = data.quick_links || [];

  const addQuickLink = () => {
    setData({ ...data, quick_links: [...quickLinks, { label: '', path: '', enabled: true }] });
  };

  const updateQuickLink = (i, field, value) => {
    const links = [...quickLinks];
    links[i] = { ...links[i], [field]: value };
    setData({ ...data, quick_links: links });
  };

  const removeQuickLink = (i) => {
    setData({ ...data, quick_links: quickLinks.filter((_, j) => j !== i) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">ფუტერის მართვა</h1>
          <p className="text-sm text-slate-500 mt-0.5">ქვედა სექციის სრული მართვა (KA/EN)</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
        </button>
      </div>

      {/* Company info */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">კომპანიის ინფორმაცია</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="კომპანიის სახელი (KA)" value={data.company_name_ka} onChange={v => setData({ ...data, company_name_ka: v })} />
          <Field label="Company Name (EN)" value={data.company_name_en} onChange={v => setData({ ...data, company_name_en: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="ქვესათაური (KA)" value={data.company_subtitle_ka} onChange={v => setData({ ...data, company_subtitle_ka: v })} />
          <Field label="Subtitle (EN)" value={data.company_subtitle_en} onChange={v => setData({ ...data, company_subtitle_en: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldArea label="აღწერა (KA)" value={data.description_ka} onChange={v => setData({ ...data, description_ka: v })} />
          <FieldArea label="Description (EN)" value={data.description_en} onChange={v => setData({ ...data, description_en: v })} />
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">საკონტაქტო ინფორმაცია</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="მისამართი (KA)" value={data.address_ka} onChange={v => setData({ ...data, address_ka: v })} />
          <Field label="Address (EN)" value={data.address_en} onChange={v => setData({ ...data, address_en: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="ელ-ფოსტა" value={data.email} onChange={v => setData({ ...data, email: v })} />
          <Field label="ტელეფონი" value={data.phone} onChange={v => setData({ ...data, phone: v })} />
        </div>
      </div>

      {/* Social links */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">სოციალური ბმულები</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="LinkedIn" value={socials.linkedin} onChange={v => setData({ ...data, social_links: { ...socials, linkedin: v } })} placeholder="https://linkedin.com/..." />
          <Field label="Facebook" value={socials.facebook} onChange={v => setData({ ...data, social_links: { ...socials, facebook: v } })} placeholder="https://facebook.com/..." />
          <Field label="Twitter" value={socials.twitter} onChange={v => setData({ ...data, social_links: { ...socials, twitter: v } })} placeholder="https://twitter.com/..." />
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-700">სწრაფი ბმულები (Quick Links)</h3>
          <button onClick={addQuickLink} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
            <Plus size={14} /> დამატება
          </button>
        </div>
        <p className="text-xs text-slate-400">ფუტერში გამოჩენილი მენიუს ბმულები. ჩართვა/გამორთვა და რედაქტირება.</p>
        {quickLinks.map((link, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <button onClick={() => updateQuickLink(i, 'enabled', !link.enabled)} className={`p-1 rounded ${link.enabled ? 'text-green-600' : 'text-slate-300'}`}>
              {link.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <input value={link.label || ''} onChange={e => updateQuickLink(i, 'label', e.target.value)} placeholder="სახელი" className="flex-1 border border-slate-200 rounded px-2 py-1.5 text-sm" />
            <input value={link.path || ''} onChange={e => updateQuickLink(i, 'path', e.target.value)} placeholder="ბმული (მაგ: /about)" className="flex-1 border border-slate-200 rounded px-2 py-1.5 text-sm font-mono text-xs" />
            <button onClick={() => removeQuickLink(i)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
          </div>
        ))}
        {quickLinks.length === 0 && <p className="text-xs text-slate-400 text-center py-2">ბმულები არ არის. ავტომატურად გამოჩნდება ნაგულისხმევი მენიუ.</p>}
      </div>

      {/* Copyright & Bottom bar */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">ქვედა ზოლი (Bottom Bar)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Copyright ტექსტი" value={data.copyright_text} onChange={v => setData({ ...data, copyright_text: v })} placeholder="© 2025 Chocheli Investment Group" />
          <Field label="All rights reserved ტექსტი" value={data.rights_text} onChange={v => setData({ ...data, rights_text: v })} placeholder="All rights reserved." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Privacy Policy ბმული" value={data.privacy_link} onChange={v => setData({ ...data, privacy_link: v })} placeholder="/privacy" />
          <Field label="Terms of Use ბმული" value={data.terms_link} onChange={v => setData({ ...data, terms_link: v })} placeholder="/terms" />
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">ელემენტების ჩართვა / გამორთვა</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="ენის გადართვის ღილაკი" checked={data.show_language_toggle !== false} onChange={v => setData({ ...data, show_language_toggle: v })} />
          <Toggle label="ადმინ პორტალის ბმული" checked={data.show_admin_link !== false} onChange={v => setData({ ...data, show_admin_link: v })} />
          <Toggle label="სოციალური ხატულები" checked={data.show_social_icons !== false} onChange={v => setData({ ...data, show_social_icons: v })} />
          <Toggle label="Quick Links სექცია" checked={data.show_quick_links !== false} onChange={v => setData({ ...data, show_quick_links: v })} />
          <Toggle label="Privacy Policy / Terms ბმულები" checked={data.show_legal_links !== false} onChange={v => setData({ ...data, show_legal_links: v })} />
          <Toggle label="sMarketer კრედიტი" checked={data.show_smarketer !== false} onChange={v => setData({ ...data, show_smarketer: v })} />
        </div>
      </div>

      {/* sMarketer credit */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">sMarketer კრედიტი</h3>
        <p className="text-xs text-slate-400">ფუტერის ბოლო ხაზი — „Dev by sMarketer" ლოგო და ბმული</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="კრედიტის ტექსტი" value={data.smarketer_text} onChange={v => setData({ ...data, smarketer_text: v })} placeholder="Dev by" />
          <Field label="sMarketer ბმული" value={data.smarketer_url} onChange={v => setData({ ...data, smarketer_url: v })} placeholder="https://smarketer.ge" />
        </div>
        <Field label="sMarketer ლოგოს URL" value={data.smarketer_logo_url} onChange={v => setData({ ...data, smarketer_logo_url: v })} placeholder="https://s3.ihost.ge/.../smarketer-white.webp" />
      </div>
    </div>
  );
};

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
    <span className="text-sm text-slate-700">{label}</span>
    <div className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-teal-500' : 'bg-slate-300'}`} onClick={() => onChange(!checked)}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
  </label>
);

const Field = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
    <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
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

export default PaneliFooter;

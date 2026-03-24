import React, { useState, useEffect } from 'react';
import { siteContentApi, customPagesApi } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, Save, RefreshCw, ChevronDown, ChevronRight, Plus, Trash2,
  Image as ImageIcon, FileText, Link2, Globe, Eye, EyeOff, ExternalLink,
  Pencil, Copy, Layout, Search
} from 'lucide-react';
import { clearContentCache } from '@/hooks/useSiteContent';
import { Badge } from '@/components/ui/badge';

/* ═══════════════════ SECTION LABELS ═══════════════════ */
const SECTION_LABELS = {
  hero_section:    { label: 'ჰერო სექცია',    labelEn: 'Hero Section',       icon: '🏠', group: 'home',   description: 'მთავარი გვერდის პირველი სექცია — სათაური, ქვესათაური, ღილაკი' },
  group_stats:     { label: 'სტატისტიკა',     labelEn: 'Group Stats',        icon: '📊', group: 'home',   description: 'რიცხვები: კომპანიების, თანამშრომლების, სექტორების რაოდენობა' },
  execution_dna:   { label: 'Execution DNA',   labelEn: 'Execution DNA',      icon: '🧬', group: 'home',   description: 'მთავარი პრინციპები / სტრატეგიის ბლოკი' },
  founder_highlight:{ label: 'დამფუძნებელი',   labelEn: 'Founder Highlight',  icon: '👤', group: 'home',   description: 'მთავარ გვერდზე დამფუძნებლის მოკლე ბლოკი' },
  leadership:      { label: 'ხელმძღვანელობა', labelEn: 'Leadership',         icon: '👥', group: 'home',   description: 'გუნდის წევრები, პოზიციები, ფოტოები' },
  footer:          { label: 'ფუთერი',         labelEn: 'Footer',             icon: '📝', group: 'global', description: 'საიტის ქვედა ნაწილი — საკონტაქტო, სოციალური ბმულები' },
  about_page:      { label: 'ჩვენს შესახებ',  labelEn: 'About Page',         icon: '📄', group: 'inner',  description: '/about გვერდის კონტენტი' },
  contact_page:    { label: 'კონტაქტი',       labelEn: 'Contact Page',       icon: '📞', group: 'inner',  description: '/contact გვერდის ტექსტები' },
  careers_page:    { label: 'კარიერა',         labelEn: 'Careers Page',       icon: '💼', group: 'inner',  description: '/careers გვერდის ტექსტები' },
  founder_page:    { label: 'დამფუძნებელი',    labelEn: 'Founder Page',       icon: '📖', group: 'inner',  description: '/founder გვერდის ტექსტები და მაილსტოუნები' },
  projects:        { label: 'პროექტები',       labelEn: 'Projects',           icon: '🏗️', group: 'inner',  description: '/projects გვერდის ტექსტები' },
  portfolio_page:  { label: 'პორტფოლიო',      labelEn: 'Portfolio Page',     icon: '📁', group: 'inner',  description: '/portfolio გვერდის ჰერო და ტექსტები' },
  industries_page: { label: 'ინდუსტრიები',    labelEn: 'Industries Page',    icon: '🏭', group: 'inner',  description: '/industries გვერდის ტექსტები' },
};

const GROUPS = {
  home:   { label: 'მთავარი გვერდი', icon: '🏠' },
  global: { label: 'საერთო',        icon: '🌐' },
  inner:  { label: 'შიდა გვერდები', icon: '📄' },
};

/* ═══════════════════ IMAGE PREVIEW ═══════════════════ */
const ImagePreview = ({ url }) => {
  if (!url) return null;
  return (
    <div className="mt-1 mb-2">
      <img src={url} alt="Preview" className="h-16 w-auto rounded border border-slate-200 object-contain bg-slate-50" onError={(e) => { e.target.style.display = 'none'; }} />
    </div>
  );
};

/* ═══════════════════ FIELD EDITOR ═══════════════════ */
const FieldEditor = ({ label, value, onChange, placeholder = '' }) => {
  const isLongText = typeof value === 'string' && (value.length > 100 || /text|description|bio|content|subtitle|paragraph/i.test(label));
  const isImageUrl = /image|logo|_url|photo|avatar/i.test(label);
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-slate-500 capitalize flex items-center gap-1.5">
        {label.replace(/_/g, ' ')}
        {isImageUrl && <ImageIcon className="w-3 h-3 text-slate-400" />}
      </Label>
      {isImageUrl && <ImagePreview url={value} />}
      {isLongText ? (
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full min-h-[80px] p-2.5 rounded-lg border border-slate-200 bg-white text-sm resize-y focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder={placeholder} />
      ) : (
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-white text-sm h-9" />
      )}
    </div>
  );
};

/* ═══════════════════ CONTENT EDITOR (recursive) ═══════════════════ */
const ContentEditor = ({ content, onChange, path = '' }) => {
  if (content === null || content === undefined) return null;
  if (Array.isArray(content)) return <ArrayEditor items={content} onChange={onChange} path={path} />;
  if (typeof content === 'object') return <ObjectEditor obj={content} onChange={onChange} path={path} />;
  return <FieldEditor label={path.split('.').pop() || 'value'} value={String(content)} onChange={(val) => onChange(val)} />;
};

const ObjectEditor = ({ obj, onChange, path = '' }) => {
  const keys = Object.keys(obj);
  const pairedKeys = new Set();
  const groups = [];

  keys.forEach(key => {
    if (pairedKeys.has(key)) return;
    const baseKey = key.replace(/_(en|ka)$/, '');
    const enKey = `${baseKey}_en`;
    const kaKey = `${baseKey}_ka`;
    if (keys.includes(enKey) && keys.includes(kaKey) && key === enKey) {
      pairedKeys.add(enKey); pairedKeys.add(kaKey);
      groups.push({ type: 'bilingual', baseKey, enKey, kaKey });
    } else if (!pairedKeys.has(key)) {
      groups.push({ type: 'single', key });
    }
  });

  const updateField = (key, value) => { onChange({ ...obj, [key]: value }); };

  return (
    <div className="space-y-5">
      {groups.map((group) => {
        if (group.type === 'bilingual') {
          return (
            <div key={group.baseKey} className="bg-gradient-to-br from-blue-50/50 to-slate-50 p-4 rounded-xl border border-blue-100/50">
              <Label className="text-xs font-bold text-blue-700 mb-3 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                {group.baseKey.replace(/_/g, ' ')}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 block">🇬🇧 English</Label>
                  {typeof obj[group.enKey] === 'string' && (obj[group.enKey].length > 80 || /text|bio|description|subtitle|content|paragraph/i.test(group.baseKey)) ? (
                    <textarea value={obj[group.enKey] || ''} onChange={(e) => updateField(group.enKey, e.target.value)} className="w-full min-h-[70px] p-2.5 rounded-lg border border-slate-200 bg-white text-sm resize-y focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  ) : (
                    <Input value={obj[group.enKey] || ''} onChange={(e) => updateField(group.enKey, e.target.value)} className="bg-white text-sm h-9" />
                  )}
                </div>
                <div>
                  <Label className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 block">🇬🇪 ქართული</Label>
                  {typeof obj[group.kaKey] === 'string' && (obj[group.kaKey].length > 80 || /text|bio|description|subtitle|content|paragraph/i.test(group.baseKey)) ? (
                    <textarea value={obj[group.kaKey] || ''} onChange={(e) => updateField(group.kaKey, e.target.value)} className="w-full min-h-[70px] p-2.5 rounded-lg border border-slate-200 bg-white text-sm resize-y focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  ) : (
                    <Input value={obj[group.kaKey] || ''} onChange={(e) => updateField(group.kaKey, e.target.value)} className="bg-white text-sm h-9" />
                  )}
                </div>
              </div>
            </div>
          );
        }
        const key = group.key;
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          return (
            <CollapsibleSection key={key} title={key.replace(/_/g, ' ')} defaultOpen={false}>
              <ContentEditor content={value} onChange={(newVal) => updateField(key, newVal)} path={path ? `${path}.${key}` : key} />
            </CollapsibleSection>
          );
        }
        const isImageField = /image|logo|_url|photo|avatar/i.test(key);
        return (
          <div key={key}>
            {isImageField && <ImagePreview url={value} />}
            <FieldEditor label={key} value={value} onChange={(val) => updateField(key, val)} />
          </div>
        );
      })}
    </div>
  );
};

const ArrayEditor = ({ items, onChange, path }) => {
  const addItem = () => {
    if (items.length === 0) { onChange([...items, {}]); return; }
    const template = JSON.parse(JSON.stringify(items[0]));
    const clearValues = (obj) => {
      if (typeof obj !== 'object' || obj === null) return '';
      if (Array.isArray(obj)) return [];
      const cleared = {};
      Object.keys(obj).forEach(k => { cleared[k] = typeof obj[k] === 'object' ? clearValues(obj[k]) : (k === 'id' ? Date.now() : ''); });
      return cleared;
    };
    onChange([...items, clearValues(template)]);
  };
  const removeItem = (index) => { onChange(items.filter((_, i) => i !== index)); };
  const updateItem = (index, newValue) => { const updated = [...items]; updated[index] = newValue; onChange(updated); };

  if (items.length > 0 && typeof items[0] === 'string') {
    return (
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <div className="flex-grow">
              {(item.includes('http') || path.includes('image')) && <ImagePreview url={item} />}
              <Input value={item} onChange={(e) => updateItem(idx, e.target.value)} className="bg-white text-sm h-9" placeholder="URL or value..." />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)} className="shrink-0 text-red-400 hover:text-red-600 h-9 w-9"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1 text-xs"><Plus className="w-3 h-3" /> დამატება</Button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 h-7 px-2"><Trash2 className="w-3 h-3 mr-1" /> წაშლა</Button>
          </div>
          <ContentEditor content={item} onChange={(newVal) => updateItem(idx, newVal)} path={`${path}[${idx}]`} />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1 text-xs w-full"><Plus className="w-3 h-3" /> ახალი ელემენტი</Button>
    </div>
  );
};

const CollapsibleSection = ({ title, children, defaultOpen = false, badge = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100 transition-colors text-left gap-3">
        <span className="text-sm font-semibold text-slate-700 capitalize flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          {title.replace(/_/g, ' ')}
        </span>
        {badge}
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
};

/* ═══════════════════ CUSTOM PAGES TAB ═══════════════════ */
const CustomPagesTab = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({ slug: '', title_ka: '', title_en: '', content_ka: '', content_en: '', meta_description_ka: '', meta_description_en: '', page_type: 'blank', link_url: '', link_target: '_self', is_published: false, show_in_menu: false, menu_order: 0 });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await customPagesApi.getAll();
      setPages(data || []);
    } catch (err) {
      console.warn('custom_pages table may not exist:', err.message);
      setPages([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPages(); }, []);

  const resetForm = () => {
    setEditingPage(null);
    setFormData({ slug: '', title_ka: '', title_en: '', content_ka: '', content_en: '', meta_description_ka: '', meta_description_en: '', page_type: 'blank', link_url: '', link_target: '_self', is_published: false, show_in_menu: false, menu_order: 0 });
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug || '', title_ka: page.title_ka || '', title_en: page.title_en || '',
      content_ka: page.content_ka || '', content_en: page.content_en || '',
      meta_description_ka: page.meta_description_ka || '', meta_description_en: page.meta_description_en || '',
      page_type: page.page_type || 'blank', link_url: page.link_url || '', link_target: page.link_target || '_self',
      is_published: page.is_published || false, show_in_menu: page.show_in_menu || false, menu_order: page.menu_order || 0,
    });
  };

  const handleSave = async () => {
    if (!formData.slug || !formData.title_en) {
      toast({ title: 'შეცდომა', description: 'Slug და ინგლისური სათაური სავალდებულოა', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...formData, updated_at: new Date().toISOString() };
      if (editingPage) {
        await customPagesApi.update(editingPage.id, payload);
      } else {
        await customPagesApi.create(payload);
      }
      toast({ title: 'წარმატება!', description: editingPage ? 'გვერდი განახლდა' : 'გვერდი შეიქმნა', className: 'bg-green-600 text-white' });
      resetForm();
      fetchPages();
    } catch (err) {
      toast({ title: 'შეცდომა', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (page) => {
    if (!confirm(`წაშალოთ „${page.title_en}"?`)) return;
    try {
      await customPagesApi.delete(page.id);
      toast({ title: 'წაშლილია', className: 'bg-green-600 text-white' });
      if (editingPage?.id === page.id) resetForm();
      fetchPages();
    } catch (err) {
      toast({ title: 'შეცდომა', description: err.message, variant: 'destructive' });
    }
  };

  const togglePublish = async (page) => {
    try {
      await customPagesApi.update(page.id, { is_published: !page.is_published });
      fetchPages();
    } catch (err) {
      toast({ title: 'შეცდომა', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{editingPage ? '✏️ გვერდის რედაქტირება' : '➕ ახალი გვერდი / ლინკი'}</h3>
        <p className="text-xs text-slate-400 mb-5">{editingPage ? `რედაქტირება: ${editingPage.title_en}` : 'შექმენით ცარიელი გვერდი ან გარე ლინკი'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Type selector */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600">ტიპი</Label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setFormData(p => ({ ...p, page_type: 'blank' }))}
                className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${formData.page_type === 'blank' ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                <FileText className="w-4 h-4" /> ცარიელი გვერდი
              </button>
              <button type="button" onClick={() => setFormData(p => ({ ...p, page_type: 'link' }))}
                className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${formData.page_type === 'link' ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                <Link2 className="w-4 h-4" /> ლინკი / გადამისამართება
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600">Slug (URL path) *</Label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 shrink-0">/page/</span>
              <Input value={formData.slug} onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} placeholder="my-page" className="bg-white text-sm h-9" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600">სათაური (ქართ.) *</Label>
            <Input value={formData.title_ka} onChange={(e) => setFormData(p => ({ ...p, title_ka: e.target.value }))} placeholder="გვერდის სათაური" className="bg-white h-9" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600">Title (English) *</Label>
            <Input value={formData.title_en} onChange={(e) => setFormData(p => ({ ...p, title_en: e.target.value }))} placeholder="Page Title" className="bg-white h-9" />
          </div>
        </div>

        {formData.page_type === 'link' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">ლინკის URL *</Label>
              <Input value={formData.link_url} onChange={(e) => setFormData(p => ({ ...p, link_url: e.target.value }))} placeholder="https://example.com ან /about" className="bg-white h-9" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">გახსნის ტიპი</Label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setFormData(p => ({ ...p, link_target: '_self' }))}
                  className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium ${formData.link_target === '_self' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                  იგივე ფანჯარაში
                </button>
                <button type="button" onClick={() => setFormData(p => ({ ...p, link_target: '_blank' }))}
                  className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium ${formData.link_target === '_blank' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                  ახალ ფანჯარაში ↗
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">კონტენტი (ქართ.)</Label>
              <textarea value={formData.content_ka} onChange={(e) => setFormData(p => ({ ...p, content_ka: e.target.value }))} className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 bg-white text-sm resize-y" placeholder="გვერდის შიგთავსი..." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">Content (English)</Label>
              <textarea value={formData.content_en} onChange={(e) => setFormData(p => ({ ...p, content_en: e.target.value }))} className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 bg-white text-sm resize-y" placeholder="Page content..." />
            </div>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-wrap gap-4 mb-5 pt-3 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData(p => ({ ...p, is_published: e.target.checked }))} className="rounded border-slate-300" />
            <span className="text-sm text-slate-600">გამოქვეყნებული</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.show_in_menu} onChange={(e) => setFormData(p => ({ ...p, show_in_menu: e.target.checked }))} className="rounded border-slate-300" />
            <span className="text-sm text-slate-600">მენიუში ჩვენება</span>
          </label>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-slate-500">რიგი:</Label>
            <Input type="number" value={formData.menu_order} onChange={(e) => setFormData(p => ({ ...p, menu_order: parseInt(e.target.value) || 0 }))} className="w-20 h-8 text-sm" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {editingPage ? 'განახლება' : 'შექმნა'}
          </Button>
          {editingPage && (
            <Button variant="outline" onClick={resetForm}>გაუქმება</Button>
          )}
        </div>
      </div>

      {/* Pages list */}
      {pages.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b">
            <h3 className="font-bold text-slate-700 text-sm">შექმნილი გვერდები / ლინკები ({pages.length})</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {pages.map(page => (
              <div key={page.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${page.page_type === 'link' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>
                  {page.page_type === 'link' ? <Link2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm truncate">{page.title_en || page.title_ka}</span>
                    <Badge variant="outline" className={`text-[10px] ${page.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {page.is_published ? 'გამოქვეყნებული' : 'დრაფტი'}
                    </Badge>
                    {page.page_type === 'link' && <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-600 border-purple-200">ლინკი</Badge>}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">
                    {page.page_type === 'link' ? `→ ${page.link_url}` : `/page/${page.slug}`}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePublish(page)} title={page.is_published ? 'გამოქვეყნების გაუქმება' : 'გამოქვეყნება'}>
                    {page.is_published ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-green-500" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(page)}><Pencil className="w-4 h-4 text-blue-500" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(page)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pages.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <Layout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">ჯერ არ არის შექმნილი გვერდი</p>
          <p className="text-slate-400 text-xs mt-1">შექმენით ახალი ცარიელი გვერდი ან ლინკი ზემოთ ფორმიდან</p>
          <p className="text-amber-500 text-xs mt-3">⚠️ საჭიროა <code className="bg-amber-50 px-1 rounded">setup-custom-pages.sql</code> გაშვება Supabase-ში</p>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
const SiteContentManager = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [activeTab, setActiveTab] = useState('content');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await siteContentApi.getAll();
      setSections(data || []);
      const edited = {};
      (data || []).forEach(s => { edited[s.section_key] = JSON.parse(JSON.stringify(s.content)); });
      setEditedContent(edited);
      if (data?.length > 0 && !activeSection) setActiveSection(data[0].section_key);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load site content.', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async (sectionKey) => {
    setSaving(prev => ({ ...prev, [sectionKey]: true }));
    try {
      await siteContentApi.update(sectionKey, editedContent[sectionKey]);
      clearContentCache();
      toast({ title: 'შენახულია!', description: `„${SECTION_LABELS[sectionKey]?.label || sectionKey}" წარმატებით განახლდა.`, className: 'bg-green-600 text-white' });
      // Refresh the original data so hasChanges updates
      const data = await siteContentApi.getBySection(sectionKey);
      if (data) setSections(prev => prev.map(s => s.section_key === sectionKey ? data : s));
    } catch (err) {
      toast({ title: 'შეცდომა', description: err.message, variant: 'destructive' });
    } finally { setSaving(prev => ({ ...prev, [sectionKey]: false })); }
  };

  const hasChanges = (sectionKey) => {
    const original = sections.find(s => s.section_key === sectionKey);
    if (!original) return false;
    return JSON.stringify(original.content) !== JSON.stringify(editedContent[sectionKey]);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  const groupedSections = {};
  sections.forEach(s => {
    const meta = SECTION_LABELS[s.section_key];
    const groupKey = meta?.group || 'other';
    if (!groupedSections[groupKey]) groupedSections[groupKey] = [];
    groupedSections[groupKey].push(s);
  });

  const filteredSections = searchTerm
    ? sections.filter(s => {
        const meta = SECTION_LABELS[s.section_key];
        const text = `${meta?.label || ''} ${meta?.labelEn || ''} ${s.section_key}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
      })
    : null;

  const currentSection = sections.find(s => s.section_key === activeSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            საიტის კონტენტი
          </h2>
          <p className="text-slate-500 text-sm mt-1">საიტის ტექსტების, სურათების და ლინკების მართვა</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAll} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> განახლება
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'content' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <FileText className="w-4 h-4 inline mr-1.5" />საიტის კონტენტი
        </button>
        <button onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pages' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Layout className="w-4 h-4 inline mr-1.5" />გვერდები & ლინკები
        </button>
      </div>

      {activeTab === 'pages' ? (
        <CustomPagesTab />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
              {/* Search */}
              <div className="p-3 border-b bg-slate-50">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 w-4 h-4 text-slate-400" />
                  <Input placeholder="ძებნა..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs bg-white" />
                </div>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {filteredSections ? (
                  /* Search results */
                  <div className="divide-y divide-slate-50">
                    {filteredSections.map(section => {
                      const meta = SECTION_LABELS[section.section_key] || { label: section.section_key, icon: '📄' };
                      const isActive = activeSection === section.section_key;
                      const changed = hasChanges(section.section_key);
                      return (
                        <button key={section.section_key} onClick={() => { setActiveSection(section.section_key); setSearchTerm(''); }}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}>
                          <span className="text-base">{meta.icon}</span>
                          <div className="flex-grow min-w-0">
                            <span className={`text-sm font-medium block truncate ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{meta.label}</span>
                          </div>
                          {changed && <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Grouped */
                  Object.entries(groupedSections).map(([groupKey, groupSections]) => {
                    const gMeta = GROUPS[groupKey] || { label: groupKey, icon: '📁' };
                    return (
                      <div key={groupKey}>
                        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-t border-slate-100 first:border-t-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{gMeta.icon} {gMeta.label}</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {groupSections.map(section => {
                            const meta = SECTION_LABELS[section.section_key] || { label: section.section_key, icon: '📄' };
                            const isActive = activeSection === section.section_key;
                            const changed = hasChanges(section.section_key);
                            return (
                              <button key={section.section_key} onClick={() => setActiveSection(section.section_key)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}>
                                <span className="text-base">{meta.icon}</span>
                                <div className="flex-grow min-w-0">
                                  <span className={`text-sm font-medium block truncate ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{meta.label}</span>
                                  <span className="text-[10px] text-slate-400 block truncate">{meta.description}</span>
                                </div>
                                {changed && <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0 animate-pulse" title="შეუნახავი ცვლილებები" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-grow">
            {currentSection && editedContent[activeSection] ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-5 border-b bg-gradient-to-r from-slate-50 to-white flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      {SECTION_LABELS[activeSection]?.icon} {SECTION_LABELS[activeSection]?.label || activeSection}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{SECTION_LABELS[activeSection]?.description}</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">
                      ბოლო განახლება: {new Date(currentSection.updated_at).toLocaleString('ka-GE')}
                    </p>
                  </div>
                  <Button onClick={() => handleSave(activeSection)} disabled={saving[activeSection] || !hasChanges(activeSection)} className={`gap-2 shrink-0 ${hasChanges(activeSection) ? 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20' : 'bg-slate-200 text-slate-400'}`}>
                    {saving[activeSection] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    შენახვა
                  </Button>
                </div>
                <div className="p-5 max-h-[70vh] overflow-y-auto">
                  <ContentEditor content={editedContent[activeSection]} onChange={(newContent) => { setEditedContent(prev => ({ ...prev, [activeSection]: newContent })); }} path={activeSection} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">აირჩიეთ სექცია მარცხენა პანელიდან</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteContentManager;

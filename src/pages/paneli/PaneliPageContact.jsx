import React, { useState, useEffect, useCallback } from 'react';
import { siteContentApi, contactMessagesApi } from '@/lib/apiClient';
import { Save, Loader2, Plus, Trash2, Mail, MailOpen, ChevronDown, ChevronUp, MessageSquare, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaneliPageContact = () => {
  const [tab, setTab] = useState('content');
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadContent = useCallback(async () => {
    try {
      const r = await siteContentApi.getBySection('contact_page');
      setData(r.content || {});
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  }, [toast]);

  const loadMessages = useCallback(async () => {
    try {
      const m = await contactMessagesApi.getAll();
      setMessages(m || []);
    } catch (e) { console.error(e); setMessages([]); }
  }, []);

  useEffect(() => {
    (async () => {
      await Promise.all([loadContent(), loadMessages()]);
      setLoading(false);
    })();
  }, [loadContent, loadMessages]);

  const saveContent = async () => {
    setSaving(true);
    try {
      await siteContentApi.update('contact_page', data);
      toast({ title: 'შენახულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const markRead = async (id) => {
    try {
      await contactMessagesApi.markRead(id);
      await loadMessages();
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const deleteMessage = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    try {
      await contactMessagesApi.delete(id);
      await loadMessages();
      toast({ title: 'წაშლილია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;

  const tabs = [
    { key: 'content', label: 'გვერდის კონტენტი' },
    { key: 'messages', label: `შეტყობინებები${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">კონტაქტის გვერდი</h1>
          <p className="text-sm text-slate-500 mt-0.5">/contact გვერდი + შეტყობინებები</p>
        </div>
        {tab === 'content' && (
          <button onClick={saveContent} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === t.key ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {tab === 'content' && data && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">ჰერო სექცია</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="სათაური (KA)" value={data.hero_title_ka} onChange={v => setData({ ...data, hero_title_ka: v })} />
              <Field label="Hero Title (EN)" value={data.hero_title_en} onChange={v => setData({ ...data, hero_title_en: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldArea label="ქვესათაური (KA)" value={data.hero_subtitle_ka} onChange={v => setData({ ...data, hero_subtitle_ka: v })} />
              <FieldArea label="Hero Subtitle (EN)" value={data.hero_subtitle_en} onChange={v => setData({ ...data, hero_subtitle_en: v })} />
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-sm text-slate-700 border-b pb-2">ფორმის ტექსტები</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="ფორმის სათაური (KA)" value={data.form_title_ka} onChange={v => setData({ ...data, form_title_ka: v })} />
              <Field label="Form Title (EN)" value={data.form_title_en} onChange={v => setData({ ...data, form_title_en: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldArea label="ფორმის ქვესათაური (KA)" value={data.form_subtitle_ka} onChange={v => setData({ ...data, form_subtitle_ka: v })} />
              <FieldArea label="Form Subtitle (EN)" value={data.form_subtitle_en} onChange={v => setData({ ...data, form_subtitle_en: v })} />
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-700">საკონტაქტო ინფორმაცია</h3>
              <button onClick={() => setData({ ...data, contacts: [...(data.contacts || []), { type: 'phone', title_ka: '', title_en: '', value_ka: '', value_en: '', sub_ka: '', sub_en: '' }] })}
                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
                <Plus size={14} /> დამატება
              </button>
            </div>
            {(data.contacts || []).map((c, i) => (
              <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-3 relative group">
                <button onClick={() => setData({ ...data, contacts: data.contacts.filter((_, j) => j !== i) })}
                  className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">ტიპი</label>
                    <select value={c.type} onChange={e => { const contacts = [...data.contacts]; contacts[i] = { ...contacts[i], type: e.target.value }; setData({ ...data, contacts }); }}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
                      <option value="address">მისამართი</option>
                      <option value="phone">ტელეფონი</option>
                      <option value="email">ელ-ფოსტა</option>
                    </select>
                  </div>
                  <Field label="სათაური (KA)" value={c.title_ka} onChange={v => { const contacts = [...data.contacts]; contacts[i] = { ...contacts[i], title_ka: v }; setData({ ...data, contacts }); }} />
                  <Field label="Title (EN)" value={c.title_en} onChange={v => { const contacts = [...data.contacts]; contacts[i] = { ...contacts[i], title_en: v }; setData({ ...data, contacts }); }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="მნიშვნელობა (KA)" value={c.value_ka} onChange={v => { const contacts = [...data.contacts]; contacts[i] = { ...contacts[i], value_ka: v }; setData({ ...data, contacts }); }} />
                  <Field label="Value (EN)" value={c.value_en} onChange={v => { const contacts = [...data.contacts]; contacts[i] = { ...contacts[i], value_en: v }; setData({ ...data, contacts }); }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {tab === 'messages' && (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center">
              <MessageSquare size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 text-sm">შეტყობინებები ჯერ არ არის</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`bg-white rounded-xl border p-4 transition-all ${!msg.is_read ? 'border-teal-200 bg-teal-50/30' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${!msg.is_read ? 'bg-teal-100' : 'bg-slate-100'}`}>
                      {!msg.is_read ? <Mail size={16} className="text-teal-600" /> : <MailOpen size={16} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-700">{msg.name || 'ანონიმური'}</p>
                        {!msg.is_read && <span className="px-1.5 py-0.5 bg-teal-500 text-white text-[10px] rounded-full font-medium">ახალი</span>}
                      </div>
                      {msg.email && <p className="text-xs text-slate-500 mb-0.5">{msg.email}</p>}
                      {msg.phone && <p className="text-xs text-slate-500 mb-1">{msg.phone}</p>}
                      {msg.subject && <p className="text-sm font-medium text-slate-600 mb-1">{msg.subject}</p>}
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-[11px] text-slate-400 mt-2">{new Date(msg.created_at).toLocaleString('ka-GE')}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!msg.is_read && (
                      <button onClick={() => markRead(msg.id)} className="p-1.5 text-slate-400 hover:text-teal-500 hover:bg-teal-50 rounded-lg" title="წაკითხულად">
                        <MailOpen size={14} />
                      </button>
                    )}
                    <button onClick={() => deleteMessage(msg.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="წაშლა">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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

export default PaneliPageContact;

import React, { useState, useEffect, useCallback } from 'react';
import { panelAdminsApi } from '@/lib/apiClient';
import { Save, Loader2, Plus, Trash2, Pencil, X, Check, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaneliAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', role: 'admin' });
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const { toast } = useToast();

  const load = useCallback(async () => {
    try {
      const data = await panelAdminsApi.getAll();
      setAdmins(data || []);
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newAdmin.username.trim() || !newAdmin.password.trim()) {
      toast({ title: 'შეავსეთ ველები', description: 'მომხმარებელი და პაროლი სავალდებულოა', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await panelAdminsApi.create(newAdmin);
      setNewAdmin({ username: '', password: '', role: 'admin' });
      setShowAdd(false);
      await load();
      toast({ title: 'დამატებულია ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const handleUpdate = async (id) => {
    setSaving(true);
    try {
      await panelAdminsApi.update(id, editData);
      setEditingId(null);
      setEditData({});
      await load();
      toast({ title: 'განახლდა ✓' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const handleDelete = async (id, username) => {
    if (!confirm(`წაშალოთ ადმინისტრატორი "${username}"?`)) return;
    try {
      await panelAdminsApi.delete(id);
      await load();
      toast({ title: 'წაშლილია' });
    } catch (e) { toast({ title: 'შეცდომა', description: e.message, variant: 'destructive' }); }
  };

  const startEdit = (admin) => {
    setEditingId(admin.id);
    setEditData({ username: admin.username, role: admin.role, password: '' });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">ადმინისტრატორები</h1>
          <p className="text-sm text-slate-500 mt-0.5">პანელის მომხმარებლების მართვა</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">
          <Plus size={16} /> ახალი ადმინი
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
        <p className="font-medium mb-1">⚠️ შენიშვნა</p>
        <p>ადმინისტრატორები მართავენ ამ პანელს. ფრთხილად მოეპყარით პაროლების ცვლილებას. ახალი პაროლის დატოვება ცარიელად — არ შეცვლის არსებულ პაროლს.</p>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-teal-800">ახალი ადმინისტრატორი</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="მომხმარებელი" value={newAdmin.username} onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
            <input type="password" placeholder="პაროლი" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
            <select value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500">
              <option value="admin">ადმინი</option>
              <option value="super_admin">სუპერ ადმინი</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving} className="px-4 py-1.5 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">
              {saving ? <Loader2 size={14} className="animate-spin inline mr-1" /> : null} დამატება
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-1.5 text-slate-500 text-sm hover:text-slate-700">გაუქმება</button>
          </div>
        </div>
      )}

      {/* Admin list */}
      <div className="space-y-3">
        {admins.map(admin => (
          <div key={admin.id} className="bg-white rounded-xl border p-4">
            {editingId === admin.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input value={editData.username || ''} onChange={e => setEditData({ ...editData, username: e.target.value })} placeholder="მომხმარებელი"
                    className="border border-teal-300 rounded-lg px-3 py-2 text-sm outline-none" />
                  <div className="relative">
                    <input type={showPasswords[admin.id] ? 'text' : 'password'} value={editData.password || ''} onChange={e => setEditData({ ...editData, password: e.target.value })} placeholder="ახალი პაროლი (ცარიელი = არ შეიცვლება)"
                      className="w-full border border-teal-300 rounded-lg px-3 py-2 text-sm outline-none pr-9" />
                    <button onClick={() => setShowPasswords({ ...showPasswords, [admin.id]: !showPasswords[admin.id] })} className="absolute right-2 top-2.5 text-slate-400">
                      {showPasswords[admin.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <select value={editData.role || 'admin'} onChange={e => setEditData({ ...editData, role: e.target.value })}
                    className="border border-teal-300 rounded-lg px-3 py-2 text-sm outline-none">
                    <option value="admin">ადმინი</option>
                    <option value="super_admin">სუპერ ადმინი</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(admin.id)} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600">
                    <Check size={12} /> შენახვა
                  </button>
                  <button onClick={() => { setEditingId(null); setEditData({}); }} className="flex items-center gap-1 px-3 py-1.5 text-slate-500 text-xs hover:text-slate-700">
                    <X size={12} /> გაუქმება
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    {(admin.username || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{admin.username}</p>
                    <p className="text-xs text-slate-400">{admin.role === 'super_admin' ? 'სუპერ ადმინი' : 'ადმინი'} • {new Date(admin.created_at).toLocaleDateString('ka-GE')}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(admin)} className="p-2 text-slate-400 hover:text-teal-500 hover:bg-teal-50 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(admin.id, admin.username)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {admins.length === 0 && (
          <div className="bg-white rounded-xl border p-8 text-center">
            <Shield size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">ადმინისტრატორები ჯერ არ არის დამატებული</p>
            <p className="text-xs text-slate-400 mt-1">დაამატეთ ახალი ადმინისტრატორი ზემოთ ღილაკით</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaneliAdmins;

import React, { useState, useEffect } from 'react';
import { companiesApi, subBrandsApi } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus, Edit, Trash2, Loader2, Building2, Search, ExternalLink,
  MoreHorizontal, Users, Calendar, ArrowUpDown, Eye, Globe, Layers, RefreshCw, TrendingUp
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CompanyModal from './CompanyModal';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CompaniesManager = () => {
  const [companies, setCompanies] = useState([]);
  const [subBrandCounts, setSubBrandCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { toast } = useToast();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await companiesApi.getAll();
      setCompanies(data || []);

      // Compute sub-brand counts from nested data
      const counts = {};
      (data || []).forEach(c => {
        if (c.sub_brands) counts[c.id] = c.sub_brands.length;
      });
      setSubBrandCounts(counts);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({ title: "Error", description: "Failed to load companies.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleCreate = () => { setSelectedCompany(null); setIsModalOpen(true); };
  const handleEdit = (company) => { setSelectedCompany(company); setIsModalOpen(true); };
  
  const handleDelete = async (company) => {
    if (!confirm(`წავშალოთ "${company.name_en}"? ეს ასევე წაშლის ყველა ქვე-პროექტს.`)) return;
    try {
      await companiesApi.delete(company.id);
      toast({ title: "წაშლილია!", description: `"${company.name_en}" წარმატებით წაიშალა.`, className: "bg-green-600 text-white" });
      fetchCompanies();
    } catch (error) {
      toast({ title: "შეცდომა", description: "წაშლა ვერ მოხერხდა.", variant: "destructive" });
    }
  };

  const toggleStatus = async (company) => {
    const newStatus = company.status === 'active' ? 'inactive' : 'active';
    try {
      await companiesApi.update(company.id, { status: newStatus });
      setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, status: newStatus } : c));
      toast({ title: 'განახლდა!', description: `${company.name_en} — ${newStatus}`, className: 'bg-green-600 text-white' });
    } catch (err) {
      toast({ title: 'შეცდომა', description: err.message, variant: 'destructive' });
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = !searchTerm || 
      c.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.name_ka?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = companies.filter(c => c.status === 'active').length;
  const totalEmployees = companies.reduce((sum, c) => sum + (c.employees_count || 0), 0);
  const totalSubBrands = Object.values(subBrandCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            კომპანიები
          </h2>
          <p className="text-slate-500 text-sm mt-1">პორტფოლიო კომპანიების მართვა, რედაქტირება და დამატება</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCompanies} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md shadow-emerald-500/20">
            <Plus className="h-4 w-4" /> ახალი კომპანია
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{companies.length}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">სულ</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center"><TrendingUp className="w-4 h-4 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">აქტიური</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center"><Users className="w-4 h-4 text-purple-600" /></div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalEmployees || '—'}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">თანამშრომელი</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center"><Layers className="w-4 h-4 text-amber-600" /></div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalSubBrands}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">ქვე-პროექტი</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input placeholder="ძებნა სახელით, ინდუსტრიით..." className="pl-9 bg-slate-50 border-slate-200 h-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          {[{ key: 'all', label: 'ყველა' }, { key: 'active', label: 'აქტიური' }, { key: 'inactive', label: 'არააქტიური' }].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === f.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          <button onClick={() => setViewMode('cards')} className={`px-2.5 py-1.5 rounded-md text-xs ${viewMode === 'cards' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>🗂️</button>
          <button onClick={() => setViewMode('table')} className={`px-2.5 py-1.5 rounded-md text-xs ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>📋</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
      ) : filteredCompanies.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center gap-3 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="bg-slate-100 p-4 rounded-full"><Building2 className="h-8 w-8 text-slate-400" /></div>
          <p className="text-slate-500 font-medium">{searchTerm ? 'კომპანია ვერ მოიძებნა' : 'კომპანიები ჯერ არ არის დამატებული'}</p>
          <Button variant="outline" onClick={handleCreate} className="gap-2"><Plus className="w-4 h-4" /> დამატება</Button>
        </div>
      ) : viewMode === 'cards' ? (
        /* ═══════ CARDS VIEW ═══════ */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center overflow-hidden shrink-0">
                    {item.logo_url ? (
                      <img src={item.logo_url} alt="" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<svg class="w-6 h-6 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"></path></svg>'; }} />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{item.name_en}</h3>
                    <p className="text-xs text-slate-400 truncate">{item.name_ka}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] bg-slate-50">{item.industry || 'N/A'}</Badge>
                      <Badge variant="outline" className={`text-[10px] ${item.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        {item.status === 'active' ? '● აქტიური' : '○ არააქტიური'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 shrink-0 opacity-50 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>მოქმედებები</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(item)}><Edit className="mr-2 h-4 w-4" /> რედაქტირება</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(item)}>
                        <Eye className="mr-2 h-4 w-4" /> {item.status === 'active' ? 'გათიშვა' : 'გააქტიურება'}
                      </DropdownMenuItem>
                      {item.website && (
                        <DropdownMenuItem onClick={() => window.open(item.website, '_blank')}><ExternalLink className="mr-2 h-4 w-4" /> ვებსაიტი</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(item)}>
                        <Trash2 className="mr-2 h-4 w-4" /> წაშლა
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Description preview */}
                {(item.description_en || item.description_ka) && (
                  <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                    {item.description_en || item.description_ka}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex gap-4">
                  {item.founded_year && (
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.founded_year}</span>
                  )}
                  {item.employees_count > 0 && (
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {item.employees_count}</span>
                  )}
                  {subBrandCounts[item.id] > 0 && (
                    <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {subBrandCounts[item.id]} პროექტი</span>
                  )}
                </div>
                <span className="text-[10px]">#{item.order_position || 0}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ═══════ TABLE VIEW ═══════ */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-slate-50 font-semibold text-[10px] uppercase text-slate-400 tracking-widest">
            <div className="col-span-1 hidden md:block">ლოგო</div>
            <div className="col-span-10 md:col-span-3">სახელი</div>
            <div className="col-span-2 hidden md:block">ინდუსტრია</div>
            <div className="col-span-1 hidden md:block">სტატუსი</div>
            <div className="col-span-1 hidden md:block">წელი</div>
            <div className="col-span-1 hidden md:block">თანამშ.</div>
            <div className="col-span-1 hidden md:block">პროექტ.</div>
            <div className="col-span-2 text-right">მოქმედებები</div>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredCompanies.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/50 transition-colors">
                <div className="col-span-1 hidden md:block">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                    {item.logo_url ? (<img src={item.logo_url} alt="" className="w-full h-full object-contain" />) : (<Building2 className="w-5 h-5 text-slate-300" />)}
                  </div>
                </div>
                <div className="col-span-10 md:col-span-3">
                  <div className="font-semibold text-slate-900 text-sm">{item.name_en}</div>
                  <div className="text-[11px] text-slate-400">{item.name_ka}</div>
                </div>
                <div className="col-span-2 hidden md:block"><Badge variant="outline" className="text-[10px]">{item.industry}</Badge></div>
                <div className="col-span-1 hidden md:block">
                  <Badge variant="outline" className={`text-[10px] ${item.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {item.status === 'active' ? '●' : '○'}
                  </Badge>
                </div>
                <div className="col-span-1 hidden md:block text-xs text-slate-500">{item.founded_year || '—'}</div>
                <div className="col-span-1 hidden md:block text-xs text-slate-500">{item.employees_count || '—'}</div>
                <div className="col-span-1 hidden md:block text-xs text-slate-500">{subBrandCounts[item.id] || '—'}</div>
                <div className="col-span-2 flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}><Edit className="w-3.5 h-3.5 text-blue-500" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item)}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} company={selectedCompany} onCompanySaved={fetchCompanies} />
    </div>
  );
};

export default CompaniesManager;

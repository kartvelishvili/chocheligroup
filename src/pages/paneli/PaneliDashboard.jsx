import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi, newsCategoriesApi, menuItemsApi, companiesApi } from '@/lib/apiClient';
import {
  Newspaper, FolderTree, Menu as MenuIcon, Building2, FileText,
  CheckCircle2, Clock, ArrowRight, Activity, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        {loading ? (
          <div className="h-9 w-16 bg-slate-100 rounded animate-pulse mt-2" />
        ) : (
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        )}
      </div>
      <div className="p-2.5 rounded-xl" style={{ backgroundColor: color + '15' }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  </div>
);

const QuickLink = ({ to, icon: Icon, title, desc, color }) => (
  <Link to={to} className="group flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-teal-200 hover:shadow-sm transition-all">
    <div className="p-2.5 rounded-xl" style={{ backgroundColor: color + '12' }}>
      <Icon size={18} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm text-slate-800">{title}</p>
      <p className="text-xs text-slate-400 truncate">{desc}</p>
    </div>
    <ArrowRight size={14} className="text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
  </Link>
);

const PaneliDashboard = () => {
  const [stats, setStats] = useState({ news: 0, published: 0, drafts: 0, categories: 0, companies: 0, menu: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [newsData, cats, menuItems, companies] = await Promise.all([
          newsApi.getAll(), newsCategoriesApi.getAll(), menuItemsApi.getAll(), companiesApi.getAll()
        ]);
        const news = newsData || [];
        setStats({
          news: news.length,
          published: news.filter(n => n.published).length,
          drafts: news.filter(n => !n.published).length,
          categories: cats?.length || 0,
          companies: companies?.length || 0,
          menu: menuItems?.length || 0,
        });
        setRecent(news.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 5).map(n => ({
          id: n.id, title: n.title_ka || n.title_en,
          date: new Date(n.updated_at).toLocaleDateString('ka-GE'),
          published: n.published
        })));
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#0a1628] to-[#162344] rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-xl font-bold mb-1">გამარჯობა 👋</h1>
        <p className="text-slate-300 text-sm">chocheligroup.com — საიტის მართვის პანელი</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="სიახლეები" value={stats.news} icon={FileText} color="#3b82f6" loading={loading} />
        <StatCard title="გამოქვეყნებული" value={stats.published} icon={CheckCircle2} color="#22c55e" loading={loading} />
        <StatCard title="დრაფტი" value={stats.drafts} icon={Clock} color="#f59e0b" loading={loading} />
        <StatCard title="კატეგორიები" value={stats.categories} icon={FolderTree} color="#8b5cf6" loading={loading} />
        <StatCard title="კომპანიები" value={stats.companies} icon={Building2} color="#06b6d4" loading={loading} />
        <StatCard title="მენიუ" value={stats.menu} icon={MenuIcon} color="#ec4899" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">სწრაფი ნავიგაცია</h2>
          <QuickLink to="/paneli/hero" icon={Newspaper} title="ჰერო სექცია" desc="სლაიდები და ტექსტები" color="#3b82f6" />
          <QuickLink to="/paneli/news" icon={Newspaper} title="სიახლეები" desc="დამატება / რედაქტირება" color="#22c55e" />
          <QuickLink to="/paneli/portfolio-section" icon={Building2} title="კომპანიები" desc="ბრენდების მართვა" color="#06b6d4" />
          <QuickLink to="/paneli/menu" icon={MenuIcon} title="მენიუ" desc="ნავიგაციის მართვა" color="#ec4899" />
          <QuickLink to="/paneli/footer" icon={Activity} title="ფუტერი" desc="ქვედა სექციის მართვა" color="#8b5cf6" />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-teal-500" /> ბოლო სიახლეები
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-slate-300" /></div>
          ) : recent.length > 0 ? (
            <div className="space-y-0.5">
              {recent.map(r => (
                <div key={r.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${r.published ? 'bg-green-400' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{r.title}</p>
                    <p className="text-[11px] text-slate-400">{r.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 text-sm py-8">აქტივობა ჯერ არ არის</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaneliDashboard;

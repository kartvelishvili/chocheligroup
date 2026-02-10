
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  Newspaper, 
  FolderTree, 
  Menu as MenuIcon, 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  FileText,
  ArrowRight,
  Building2,
  Globe,
  Activity,
  BarChart3,
  Sparkles,
  Trash2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const StatCard = ({ title, value, icon: Icon, color, bgColor, loading, subtitle }) => (
  <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          {loading ? (
            <Skeleton className="h-9 w-16" />
          ) : (
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          )}
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickAction = ({ to, icon: Icon, title, description, color, bgColor }) => (
  <Link to={to} className="group">
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200">
      <div className={`p-3 rounded-xl ${bgColor} group-hover:scale-105 transition-transform`}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-900 text-sm">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
    </div>
  </Link>
);

const ActivityItem = ({ title, time, type }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className={`w-2 h-2 rounded-full shrink-0 ${
      type === 'published' ? 'bg-green-500' : 'bg-blue-500'
    }`} />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-700 truncate">{title}</p>
      <p className="text-xs text-slate-400 mt-0.5">{time}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    totalCategories: 0,
    totalMenuItems: 0,
    totalCompanies: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearingCache, setClearingCache] = useState(false);
  const [currentCacheVersion, setCurrentCacheVersion] = useState(null);

  // ─── Fetch current cache version ───
  useEffect(() => {
    const fetchCacheVersion = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'cache_version')
          .single();
        if (data) setCurrentCacheVersion(data.value);
      } catch (e) {
        // Table may not exist yet
      }
    };
    fetchCacheVersion();
  }, []);

  // ─── Clear Cache Handler ───
  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      const newVersion = Date.now().toString();
      
      // Try upsert first
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert({ key: 'cache_version', value: newVersion, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      
      if (upsertError) throw upsertError;

      setCurrentCacheVersion(newVersion);
      localStorage.setItem('_cache_version', newVersion);

      toast({
        title: '✅ ქეში გასუფთავდა!',
        description: `ახალი ვერსია: ${newVersion}. მომხმარებლები გვერდის განახლებისას მიიღებენ ახალ ვერსიას.`,
      });
    } catch (error) {
      console.error('Cache clear error:', error);
      toast({
        title: '❌ შეცდომა',
        description: `ქეშის გასუფთავება ვერ მოხერხდა: ${error.message}. შესაძლოა 'site_settings' ცხრილი არ არსებობს. გაუშვით SQL სკრიპტი Supabase-ში.`,
        variant: 'destructive',
      });
    } finally {
      setClearingCache(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data: newsData } = await supabase
          .from('news')
          .select('id, published, title_en, title_ka, created_at, updated_at')
          .order('updated_at', { ascending: false });

        const { count: catCount } = await supabase
          .from('news_categories')
          .select('*', { count: 'exact', head: true });

        const { count: menuCount } = await supabase
          .from('menu_items')
          .select('*', { count: 'exact', head: true });

        const { count: compCount } = await supabase
          .from('companies')
          .select('*', { count: 'exact', head: true });

        const news = newsData || [];
        setStats({
          totalNews: news.length,
          publishedNews: news.filter(n => n.published).length,
          draftNews: news.filter(n => !n.published).length,
          totalCategories: catCount || 0,
          totalMenuItems: menuCount || 0,
          totalCompanies: compCount || 0
        });

        const activity = news.slice(0, 6).map(item => ({
          id: item.id,
          title: item.title_ka || item.title_en,
          time: new Date(item.updated_at).toLocaleDateString('ka-GE'),
          type: item.published ? 'published' : 'draft'
        }));
        setRecentActivity(activity);

      } catch (error) {
        console.error('Dashboard stats error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white shadow-xl shadow-blue-600/20"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">მართვის პანელი</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">გამარჯობა, ადმინისტრატორო!</h1>
            <p className="text-blue-100 mt-1 text-sm lg:text-base">მართეთ საიტის კონტენტი, სიახლეები და კომპანიების ინფორმაცია.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg">
              <Link to="/admin/news">
                <Plus size={16} className="mr-2" /> ახალი სიახლე
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/admin/site-content">
                <Globe size={16} className="mr-2" /> კონტენტი
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Cache Clear Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-md border-l-4 border-l-orange-400">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50">
                  <RefreshCw size={20} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">ქეშის მართვა</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    თუ მომხმარებლებს ძველი დიზაინი უჩანს, დააჭირეთ ქეშის გასუფთავებას.
                    <br />ეს აიძულებს ყველა მომხმარებელს ჩამოტვირთოს საიტის ახალი ვერსია.
                  </p>
                  {currentCacheVersion && (
                    <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                      მიმდინარე ვერსია: {currentCacheVersion}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={handleClearCache}
                disabled={clearingCache}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md shrink-0"
              >
                {clearingCache ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Trash2 size={16} className="mr-2" />
                )}
                {clearingCache ? 'მიმდინარეობს...' : 'ქეშის გასუფთავება'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <motion.div variants={item}>
          <StatCard title="სულ სიახლე" value={stats.totalNews} icon={FileText} color="#3b82f6" bgColor="bg-blue-50" loading={loading} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="გამოქვეყნებული" value={stats.publishedNews} icon={CheckCircle2} color="#22c55e" bgColor="bg-green-50" loading={loading} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="დრაფტები" value={stats.draftNews} icon={Clock} color="#f59e0b" bgColor="bg-amber-50" loading={loading} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="კატეგორიები" value={stats.totalCategories} icon={FolderTree} color="#8b5cf6" bgColor="bg-purple-50" loading={loading} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="კომპანიები" value={stats.totalCompanies} icon={Building2} color="#0ea5e9" bgColor="bg-sky-50" loading={loading} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="მენიუ" value={stats.totalMenuItems} icon={MenuIcon} color="#ec4899" bgColor="bg-pink-50" loading={loading} />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-600" />
              სწრაფი ნავიგაცია
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <QuickAction to="/admin/news" icon={Newspaper} title="სიახლეები" description="სტატიების მართვა" color="#3b82f6" bgColor="bg-blue-50" />
            <QuickAction to="/admin/companies" icon={Building2} title="კომპანიები" description="კომპანიების რედაქტირება" color="#0ea5e9" bgColor="bg-sky-50" />
            <QuickAction to="/admin/categories" icon={FolderTree} title="კატეგორიები" description="კატეგორიების მართვა" color="#8b5cf6" bgColor="bg-purple-50" />
            <QuickAction to="/admin/menu" icon={MenuIcon} title="მენიუ" description="ნავიგაციის პუნქტები" color="#ec4899" bgColor="bg-pink-50" />
            <QuickAction to="/admin/site-content" icon={Globe} title="საიტის კონტენტი" description="ტექსტები და ფოტოები" color="#22c55e" bgColor="bg-green-50" />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3 border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              ბოლო აქტივობა
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div>
                {recentActivity.map((a) => (
                  <ActivityItem key={a.id} title={a.title} time={a.time} type={a.type} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">აქტივობა ჯერ არ არის</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

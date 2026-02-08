
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Edit, 
  Search, 
  Loader2, 
  Filter, 
  Trash2, 
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Newspaper
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NewsForm from './NewsForm';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [deletingNews, setDeletingNews] = useState(null);
  
  const { toast } = useToast();

  const fetchNews = async (isRefreshing = false) => {
    // Only set main loading state if not a background refresh
    if (!isRefreshing) setLoading(true);
    setError(null);
    try {
      console.log("Fetching news data...");
      
      // 1. Fetch Categories for Filter & Form
      const { data: cats, error: catError } = await supabase
        .from('news_categories')
        .select('*')
        .order('sort_order');
      
      if (catError) throw catError;
      setCategories(cats || []);

      // 2. Fetch News with Category info
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select(`
          *,
          news_categories (id, name_en, name_ka)
        `)
        .order('created_at', { ascending: false });

      if (newsError) throw newsError;

      console.log('Fetched news items:', newsData?.length);
      setNews(newsData || []);

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      toast({ 
        title: "Error", 
        description: "Failed to load news data. Please try refreshing.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleCreate = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    console.log("Editing item:", item);
    setEditingNews(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item) => {
    setDeletingNews(item);
  };

  const handleDelete = async () => {
    if (!deletingNews) return;

    try {
      if (deletingNews.image_path) {
        const { error: storageError } = await supabase.storage
          .from('news-images')
          .remove([deletingNews.image_path]);
        
        if (storageError) {
          console.warn("Failed to delete image file:", storageError);
        }
      }

      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', deletingNews.id);

      if (error) throw error;
      
      toast({ 
        title: "Success", 
        description: "Article deleted successfully", 
        className: "bg-green-600 text-white" 
      });
      
      fetchNews(true); // Refresh list in background

    } catch (err) {
      console.error("Delete error:", err);
      toast({ 
        title: "Error", 
        description: "Failed to delete article. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setDeletingNews(null);
    }
  };

  const handleFormSuccess = () => {
    console.log("Form success callback triggered - Refreshing list");
    fetchNews(true);
  };

  // Client-side filtering
  const filteredNews = news.filter(item => {
    const matchesSearch = 
      (item.title_en?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (item.title_ka?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.category_id === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' ? item.published : !item.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">News Articles</h2>
           <p className="text-slate-500">Manage your news content, press releases, and updates.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => fetchNews(false)} disabled={loading} title="Refresh List">
             <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
           </Button>
           <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
             <Plus className="mr-2 h-4 w-4" /> Create Article
           </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by title..." 
            className="pl-9 bg-slate-50 border-slate-200" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-[200px] bg-slate-50 border-slate-200">
               <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Category" />
               </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[150px] bg-slate-50 border-slate-200">
               <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="flex items-center gap-4">
                 <Skeleton className="w-12 h-12 rounded-lg" />
                 <div className="space-y-2 flex-grow">
                   <Skeleton className="h-4 w-1/3" />
                   <Skeleton className="h-3 w-1/4" />
                 </div>
                 <Skeleton className="h-8 w-20" />
               </div>
            ))}
          </div>
        ) : error ? (
           <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-4">
              <p className="text-red-500">{error}</p>
              <Button variant="outline" onClick={() => fetchNews(false)}>Try Again</Button>
           </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
             <div className="bg-slate-100 p-4 rounded-full"><Newspaper className="h-8 w-8 text-slate-400" /></div>
             <p className="text-slate-500 font-medium">No news articles found.</p>
             <Button variant="link" onClick={() => {setFilterCategory('all'); setFilterStatus('all'); setSearchTerm('');}}>Clear Filters</Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNews.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors group">
                <div className="col-span-12 md:col-span-1">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 relative">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={16} /></div>
                    )}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <div className="font-semibold text-slate-900 line-clamp-1" title={item.title_en}>{item.title_en}</div>
                  <div className="text-sm text-slate-500 line-clamp-1" title={item.title_ka}>{item.title_ka}</div>
                  <div className="flex gap-2 mt-1 md:hidden">
                    <Badge variant={item.published ? "default" : "secondary"} className={item.published ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                      {item.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-2 text-sm text-slate-600 hidden md:block">
                  <Badge variant="outline" className="bg-slate-50 font-normal text-slate-600 border-slate-200">
                     {item.news_categories?.name_en || 'Uncategorized'}
                  </Badge>
                </div>
                
                <div className="col-span-6 md:col-span-1 hidden md:block">
                    <Badge variant="outline" className={`w-fit border-0 ${item.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {item.published ? 'Published' : 'Draft'}
                    </Badge>
                </div>

                <div className="col-span-12 md:col-span-2 flex justify-end gap-2">
                   {item.published && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`/news/${item.slug}`, '_blank')} title="View Live">
                        <Eye className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                      </Button>
                   )}
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)} title="Edit Article">
                     <Edit className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(item)} title="Delete Article">
                     <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NewsForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newsItem={editingNews}
        categories={categories}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={!!deletingNews} onOpenChange={() => setDeletingNews(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the article
              <span className="font-semibold text-slate-900 block mt-1">"{deletingNews?.title_en}"</span>
              and remove its image from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsManager;

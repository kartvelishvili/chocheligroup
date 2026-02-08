import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, ChevronRight, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useDesign } from '@/hooks/useDesign';

/* ══════════ NEWS CARD (shared) ══════════ */
const NewsCard = ({ item, language, t, d, variant = 'card' }) => {
  const title = language === 'ka' ? item.title_ka : item.title_en;
  const excerpt = language === 'ka' ? item.excerpt_ka : item.excerpt_en;
  const category = item.news_categories ? (language === 'ka' ? item.news_categories.name_ka : item.news_categories.name_en) : 'News';
  const date = new Date(item.created_at).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (variant === 'list') {
    return (
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border group hover:shadow-lg transition-all" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
        <Link to={`/news/${item.slug}`} className="block w-full md:w-64 h-48 md:h-auto rounded-xl overflow-hidden shrink-0 bg-gray-100">
          <img src={item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </Link>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ backgroundColor: d.accentBg, color: d.accent }}>{category}</span>
            <span className="text-sm flex items-center gap-1" style={{ color: d.textMuted }}><Calendar className="w-3.5 h-3.5" />{date}</span>
          </div>
          <h3 className="text-xl font-bold heading-font mb-2 line-clamp-2 group-hover:opacity-80 transition-opacity" style={{ color: d.heading }}>{title}</h3>
          <p className="body-font text-sm line-clamp-2 flex-1" style={{ color: d.textMuted }}>{excerpt}</p>
          <Link to={`/news/${item.slug}`} className="inline-flex items-center font-bold text-sm uppercase tracking-wide mt-3" style={{ color: d.accent }}>
            {t({ en: 'Read More', ka: '\u10e1\u10e0\u10e3\u10da\u10d0\u10d3' })} <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </motion.div>
    );
  }

  if (variant === 'magazine' || variant === 'card') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border flex flex-col" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
        <Link to={`/news/${item.slug}`} className="block overflow-hidden h-56 relative bg-gray-100">
          <img src={item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'} alt={title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute top-4 left-4 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm" style={{ backgroundColor: d.accentBg, color: d.accent }}>{category}</div>
        </Link>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center text-sm mb-3" style={{ color: d.textMuted }}>
            <Calendar className="w-4 h-4 mr-2" />{date}
          </div>
          <h3 className="text-xl font-bold mb-3 line-clamp-2 transition-colors heading-font" style={{ color: d.heading }}>{title}</h3>
          <p className="text-sm line-clamp-3 mb-6 flex-grow body-font" style={{ color: d.textMuted }}>{excerpt}</p>
          <Link to={`/news/${item.slug}`} className="inline-flex items-center font-bold text-sm uppercase tracking-wide mt-auto" style={{ color: d.accent }}>
            {t({ en: 'Read More', ka: '\u10e1\u10e0\u10e3\u10da\u10d0\u10d3' })} <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </motion.div>
    );
  }
  return null;
};

/* ══════════ GRID BODY ══════════ */
const GridBody = ({ items, language, t, d }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {items.map((item) => <NewsCard key={item.id} item={item} language={language} t={t} d={d} variant="card" />)}
  </div>
);

/* ══════════ LIST BODY ══════════ */
const ListBody = ({ items, language, t, d }) => (
  <div className="space-y-6 max-w-4xl mx-auto">
    {items.map((item) => <NewsCard key={item.id} item={item} language={language} t={t} d={d} variant="list" />)}
  </div>
);

/* ══════════ MAGAZINE BODY ══════════ */
const MagazineBody = ({ items, language, t, d }) => {
  const featured = items[0];
  const rest = items.slice(1);
  return (
    <div className="space-y-8">
      {featured && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-8 rounded-2xl overflow-hidden border" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
          <Link to={`/news/${featured.slug}`} className="block h-72 lg:h-auto overflow-hidden bg-gray-100 group">
            <img src={featured.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </Link>
          <div className="p-8 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start mb-4" style={{ backgroundColor: d.accentBg, color: d.accent }}>
              {featured.news_categories ? (language === 'ka' ? featured.news_categories.name_ka : featured.news_categories.name_en) : 'News'}
            </span>
            <h2 className="text-3xl font-bold heading-font mb-4 line-clamp-3" style={{ color: d.heading }}>{language === 'ka' ? featured.title_ka : featured.title_en}</h2>
            <p className="body-font mb-6 line-clamp-3" style={{ color: d.textMuted }}>{language === 'ka' ? featured.excerpt_ka : featured.excerpt_en}</p>
            <Link to={`/news/${featured.slug}`} className="inline-flex items-center font-bold text-sm uppercase tracking-wide" style={{ color: d.accent }}>
              {t({ en: 'Read More', ka: '\u10e1\u10e0\u10e3\u10da\u10d0\u10d3' })} <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rest.map((item) => <NewsCard key={item.id} item={item} language={language} t={t} d={d} variant="magazine" />)}
      </div>
    </div>
  );
};

const BODY_LAYOUTS = { grid: GridBody, list: ListBody, magazine: MagazineBody };

const NewsPage = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const { getDesign, getLayout } = useDesign();
  const d = getDesign('page_news');
  const layout = getLayout('page_news');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: cats, error: catError } = await supabase.from('news_categories').select('*').eq('is_active', true).order('sort_order', { ascending: true });
      if (catError) throw catError;
      setCategories(cats || []);

      const { data: newsData, error: newsError } = await supabase.from('news').select('*, news_categories (name_ka, name_en)').eq('published', true).order('created_at', { ascending: false });
      if (newsError) throw newsError;
      setNews(newsData || []);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(t({ en: "Failed to load news.", ka: "\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8\u10e1 \u10e9\u10d0\u10e2\u10d5\u10d8\u10e0\u10d7\u10d5\u10d0 \u10d5\u10d4\u10e0 \u10db\u10dd\u10ee\u10d4\u10e0\u10ee\u10d3\u10d0." }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredNews = news.filter(item => {
    const titleKey = `title_${language}`;
    const matchesSearch = (item[titleKey]?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedNews = filteredNews.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginatedNews.length < filteredNews.length;
  const BodyLayout = BODY_LAYOUTS[layout] || GridBody;

  return (
    <>
      <Helmet>
        <title>{t({ en: 'News - Chocheli Investment Group', ka: '\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8 - \u10e9\u10dd\u10e9\u10d4\u10da\u10d8 \u10e1\u10d0\u10d8\u10dc\u10d5\u10d4\u10e1\u10e2\u10d8\u10ea\u10d8\u10dd \u10ef\u10d2\u10e3\u10e4\u10d8' })}</title>
      </Helmet>

      <div style={{ backgroundColor: d.bg, minHeight: '100vh', paddingTop: '6rem', paddingBottom: '5rem' }}>
        {/* Hero */}
        <div className="py-16 mb-12" style={{ backgroundColor: d.heroBg || d.bg }}>
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold heading-font mb-4" style={{ color: d.heroText || '#fff' }}>
              {t({ en: 'News & Updates', ka: '\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8 \u10d3\u10d0 \u10d2\u10d0\u10dc\u10d0\u10ee\u10da\u10d4\u10d1\u10d4\u10d1\u10d8' })}
            </h1>
            <p className="max-w-2xl mx-auto text-lg" style={{ color: (d.heroText || '#fff') + 'AA' }}>
              {t({ en: 'Stay informed about our latest projects, investments, and corporate milestones.', ka: '\u10db\u10d8\u10d8\u10e6\u10d4\u10d7 \u10d8\u10dc\u10e4\u10dd\u10e0\u10db\u10d0\u10ea\u10d8\u10d0 \u10e9\u10d5\u10d4\u10dc\u10d8 \u10e3\u10d0\u10ee\u10da\u10d4\u10e1\u10d8 \u10de\u10e0\u10dd\u10d4\u10e5\u10e2\u10d4\u10d1\u10d8\u10e1\u10d0 \u10d3\u10d0 \u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8\u10e1 \u10e8\u10d4\u10e1\u10d0\u10ee\u10d4\u10d1.' })}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between p-4 rounded-xl shadow-sm border" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
            <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              <button onClick={() => setSelectedCategory('all')} className="px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap" style={selectedCategory === 'all' ? { backgroundColor: d.accent, color: '#fff' } : { backgroundColor: d.accentBg, color: d.text }}>
                {t({ en: 'All', ka: '\u10e7\u10d5\u10d4\u10da\u10d0' })}
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap" style={selectedCategory === cat.id ? { backgroundColor: d.accent, color: '#fff' } : { backgroundColor: d.accentBg, color: d.text }}>
                  {language === 'ka' ? cat.name_ka : cat.name_en}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4" style={{ color: d.textMuted }} />
              <Input placeholder={t({ en: "Search news...", ka: "\u10eb\u10d8\u10d4\u10d1\u10d0..." })} className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {/* Content */}
          {error ? (
            <div className="text-center py-20 rounded-xl shadow-sm border" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchData} variant="outline" className="gap-2"><RefreshCw className="w-4 h-4" /> {t({ en: 'Retry', ka: '\u10d7\u10d0\u10d5\u10d8\u10d3\u10d0\u10dc \u10ea\u10d3\u10d0' })}</Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (<div key={i} className="flex flex-col gap-3"><Skeleton className="h-56 rounded-xl w-full" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-20 w-full" /></div>))}
            </div>
          ) : filteredNews.length > 0 ? (
            <BodyLayout items={paginatedNews} language={language} t={t} d={d} />
          ) : (
            <div className="text-center py-20 rounded-xl shadow-sm" style={{ backgroundColor: d.cardBg }}>
              <p className="text-lg" style={{ color: d.textMuted }}>{t({ en: "No news found matching your criteria.", ka: "\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8 \u10d0\u10e0 \u10db\u10dd\u10d8\u10eb\u10d4\u10d1\u10dc\u10d0." })}</p>
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" onClick={() => setPage(p => p + 1)} className="min-w-[200px]">
                {t({ en: "Load More", ka: "\u10db\u10d4\u10e2\u10d8" })}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsPage;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/customSupabaseClient';
import { ArrowLeft, Calendar, Clock, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useDesign } from '@/hooks/useDesign';

/* ══════════ CLASSIC LAYOUT ══════════ */
const ClassicArticle = ({ article, title, content, categoryName, readTime, relatedNews, d, t, language, navigate }) => (
  <div style={{ backgroundColor: d.bg, minHeight: '100vh', paddingTop: '6rem', paddingBottom: '5rem' }}>
    <article className="container mx-auto px-6 max-w-4xl">
      <nav className="flex items-center text-sm mb-8 overflow-x-auto whitespace-nowrap pb-2" style={{ color: d.textMuted }}>
        <Link to="/" className="hover:opacity-70 transition-opacity">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/news" className="hover:opacity-70 transition-opacity">{t({ en: 'News', ka: '\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8' })}</Link>
        <span className="mx-2">/</span>
        <span className="font-medium truncate" style={{ color: d.heading }}>{title}</span>
      </nav>
      <header className="mb-10">
        {categoryName && (
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4" style={{ backgroundColor: d.accentBg, color: d.accent }}>{categoryName}</span>
        )}
        <h1 className="text-3xl md:text-5xl font-bold heading-font mb-6 leading-tight" style={{ color: d.heading }}>{title}</h1>
        <div className="flex items-center text-sm gap-6 pb-8" style={{ color: d.textMuted, borderBottom: `1px solid ${d.cardBorder}` }}>
          <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(article.created_at).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{readTime} {t({ en: 'min read', ka: '\u10ec\u10d7 \u10e1\u10d0\u10d9\u10d8\u10d7\u10ee\u10d0\u10d5\u10d8' })}</div>
        </div>
      </header>
      {article.image_url && (
        <div className="rounded-2xl overflow-hidden shadow-lg mb-10 bg-gray-100"><img src={article.image_url} alt={title} className="w-full h-auto object-cover max-h-[600px]" /></div>
      )}
      <div className="prose prose-lg max-w-none leading-relaxed mb-16 whitespace-pre-wrap" style={{ color: d.text }}>{content}</div>
      <div className="flex justify-center mb-16">
        <Button variant="outline" onClick={() => navigate('/news')} className="gap-2"><ArrowLeft className="w-4 h-4" /> {t({ en: 'Back to News', ka: '\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d6\u10d4 \u10d3\u10d0\u10d1\u10e0\u10e3\u10dc\u10d4\u10d1\u10d0' })}</Button>
      </div>
      {relatedNews.length > 0 && (
        <div className="pt-12" style={{ borderTop: `1px solid ${d.cardBorder}` }}>
          <h3 className="text-2xl font-bold mb-8" style={{ color: d.heading }}>{t({ en: 'Related News', ka: '\u10db\u10e1\u10d2\u10d0\u10d5\u10e1\u10d8 \u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedNews.map(item => (
              <Link key={item.id} to={`/news/${item.slug}`} className="group block">
                <div className="h-48 rounded-lg overflow-hidden mb-4 bg-gray-100"><img src={item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                <h4 className="font-bold group-hover:opacity-70 transition-opacity line-clamp-2" style={{ color: d.heading }}>{language === 'ka' ? item.title_ka : item.title_en}</h4>
                <p className="text-xs mt-2" style={{ color: d.textMuted }}>{new Date(item.created_at).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  </div>
);

/* ══════════ WIDE LAYOUT — Full-bleed hero image ══════════ */
const WideArticle = ({ article, title, content, categoryName, readTime, relatedNews, d, t, language, navigate }) => (
  <div style={{ backgroundColor: d.bg, minHeight: '100vh' }}>
    {/* Full-bleed hero */}
    {article.image_url && (
      <div className="relative w-full h-[60vh] min-h-[400px]" style={{ backgroundColor: d.heroBg || d.bg }}>
        <img src={article.image_url} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${d.bg}, transparent 60%)` }} />
      </div>
    )}
    <article className="container mx-auto px-6 max-w-3xl" style={{ marginTop: article.image_url ? '-8rem' : '6rem', position: 'relative', zIndex: 10, paddingBottom: '5rem' }}>
      <div className="p-8 rounded-2xl shadow-xl border mb-10" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
        <div className="flex items-center gap-3 mb-4">
          {categoryName && <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ backgroundColor: d.accentBg, color: d.accent }}>{categoryName}</span>}
          <span className="text-sm" style={{ color: d.textMuted }}>{new Date(article.created_at).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold heading-font mb-4 leading-tight" style={{ color: d.heading }}>{title}</h1>
        <div className="flex items-center gap-2 text-sm" style={{ color: d.textMuted }}><Clock className="w-4 h-4" />{readTime} {t({ en: 'min read', ka: '\u10ec\u10d7 \u10e1\u10d0\u10d9\u10d8\u10d7\u10ee\u10d0\u10d5\u10d8' })}</div>
      </div>
      <div className="prose prose-lg max-w-none leading-relaxed mb-16 whitespace-pre-wrap" style={{ color: d.text }}>{content}</div>
      <div className="flex justify-center mb-16">
        <Button variant="outline" onClick={() => navigate('/news')} className="gap-2"><ArrowLeft className="w-4 h-4" /> {t({ en: 'Back to News', ka: '\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d6\u10d4 \u10d3\u10d0\u10d1\u10e0\u10e3\u10dc\u10d4\u10d1\u10d0' })}</Button>
      </div>
      {relatedNews.length > 0 && (
        <div className="pt-12" style={{ borderTop: `1px solid ${d.cardBorder}` }}>
          <h3 className="text-2xl font-bold mb-8" style={{ color: d.heading }}>{t({ en: 'Related News', ka: '\u10db\u10e1\u10d2\u10d0\u10d5\u10e1\u10d8 \u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedNews.map(item => (
              <Link key={item.id} to={`/news/${item.slug}`} className="group block">
                <div className="h-48 rounded-lg overflow-hidden mb-4 bg-gray-100"><img src={item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                <h4 className="font-bold group-hover:opacity-70 transition-opacity line-clamp-2" style={{ color: d.heading }}>{language === 'ka' ? item.title_ka : item.title_en}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  </div>
);

/* ══════════ SIDEBAR LAYOUT — Content + side panel ══════════ */
const SidebarArticle = ({ article, title, content, categoryName, readTime, relatedNews, d, t, language, navigate }) => (
  <div style={{ backgroundColor: d.bg, minHeight: '100vh', paddingTop: '6rem', paddingBottom: '5rem' }}>
    <div className="container mx-auto px-6 max-w-7xl">
      <nav className="flex items-center text-sm mb-8 overflow-x-auto whitespace-nowrap pb-2" style={{ color: d.textMuted }}>
        <Link to="/" className="hover:opacity-70 transition-opacity">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/news" className="hover:opacity-70 transition-opacity">{t({ en: 'News', ka: '\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8' })}</Link>
        <span className="mx-2">/</span>
        <span className="font-medium truncate" style={{ color: d.heading }}>{title}</span>
      </nav>
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main */}
        <article className="lg:col-span-2">
          {categoryName && <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4" style={{ backgroundColor: d.accentBg, color: d.accent }}>{categoryName}</span>}
          <h1 className="text-3xl md:text-4xl font-bold heading-font mb-6 leading-tight" style={{ color: d.heading }}>{title}</h1>
          <div className="flex items-center text-sm gap-6 mb-8 pb-6" style={{ color: d.textMuted, borderBottom: `1px solid ${d.cardBorder}` }}>
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(article.created_at).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{readTime} {t({ en: 'min read', ka: '\u10ec\u10d7 \u10e1\u10d0\u10d9\u10d8\u10d7\u10ee\u10d0\u10d5\u10d8' })}</div>
          </div>
          {article.image_url && <div className="rounded-2xl overflow-hidden shadow-lg mb-10 bg-gray-100"><img src={article.image_url} alt={title} className="w-full h-auto object-cover max-h-[500px]" /></div>}
          <div className="prose prose-lg max-w-none leading-relaxed mb-10 whitespace-pre-wrap" style={{ color: d.text }}>{content}</div>
          <Button variant="outline" onClick={() => navigate('/news')} className="gap-2"><ArrowLeft className="w-4 h-4" /> {t({ en: 'Back to News', ka: '\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d6\u10d4 \u10d3\u10d0\u10d1\u10e0\u10e3\u10dc\u10d4\u10d1\u10d0' })}</Button>
        </article>
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 space-y-8">
            {relatedNews.length > 0 && (
              <div className="p-6 rounded-2xl border" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
                <h3 className="text-lg font-bold mb-6 pb-4" style={{ color: d.heading, borderBottom: `2px solid ${d.accent}` }}>{t({ en: 'Related News', ka: '\u10db\u10e1\u10d2\u10d0\u10d5\u10e1\u10d8 \u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d8' })}</h3>
                <div className="space-y-5">
                  {relatedNews.map(item => (
                    <Link key={item.id} to={`/news/${item.slug}`} className="group flex gap-4 items-start">
                      <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100"><img src={item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'} alt="" className="w-full h-full object-cover" /></div>
                      <div>
                        <h4 className="text-sm font-bold line-clamp-2 group-hover:opacity-70 transition-opacity" style={{ color: d.heading }}>{language === 'ka' ? item.title_ka : item.title_en}</h4>
                        <p className="text-xs mt-1" style={{ color: d.textMuted }}>{new Date(item.created_at).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  </div>
);

const LAYOUTS = { classic: ClassicArticle, wide: WideArticle, sidebar: SidebarArticle };

const NewsDetailPage = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { getDesign, getLayout } = useDesign();
  const d = getDesign('page_news_detail');
  const layout = getLayout('page_news_detail');

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase.from('news').select('*, news_categories(name_ka, name_en)').eq('slug', slug).single();
        if (fetchError) throw fetchError;
        if (!data || !data.published) throw new Error("Article not found");
        setArticle(data);
        const { data: related } = await supabase.from('news').select('id, title_ka, title_en, slug, created_at, image_url').eq('published', true).eq('category_id', data.category_id).neq('id', data.id).limit(3);
        setRelatedNews(related || []);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(t({ en: "Failed to load article.", ka: "\u10e1\u10e2\u10d0\u10e2\u10d8\u10d8\u10e1 \u10e9\u10d0\u10e2\u10d5\u10d8\u10e0\u10d7\u10d5\u10d0 \u10d5\u10d4\u10e0 \u10db\u10dd\u10ee\u10d4\u10e0\u10ee\u10d3\u10d0." }));
      } finally { setLoading(false); }
    };
    if (slug) fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-32 max-w-4xl">
        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4" style={{ backgroundColor: d.bg }}>
        <h2 className="text-2xl font-bold" style={{ color: d.heading }}>{t({ en: 'Article Not Found', ka: '\u10e1\u10e2\u10d0\u10e2\u10d8\u10d0 \u10d0\u10e0 \u10db\u10dd\u10d8\u10eb\u10d4\u10d1\u10dc\u10d0' })}</h2>
        <p style={{ color: d.textMuted }}>{error}</p>
        <Button onClick={() => navigate('/news')}>{t({ en: 'Back to News', ka: '\u10e1\u10d8\u10d0\u10ee\u10da\u10d4\u10d4\u10d1\u10d6\u10d4 \u10d3\u10d0\u10d1\u10e0\u10e3\u10dc\u10d4\u10d1\u10d0' })}</Button>
      </div>
    );
  }

  const title = language === 'ka' ? article.title_ka : article.title_en;
  const content = language === 'ka' ? article.content_ka : article.content_en;
  const categoryName = article.news_categories ? (language === 'ka' ? article.news_categories.name_ka : article.news_categories.name_en) : '';
  const wordCount = (content || '').split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  const LayoutComponent = LAYOUTS[layout] || ClassicArticle;

  return (
    <>
      <Helmet><title>{title} - Chocheli Investment Group</title></Helmet>
      <LayoutComponent article={article} title={title} content={content} categoryName={categoryName} readTime={readTime} relatedNews={relatedNews} d={d} t={t} language={language} navigate={navigate} />
    </>
  );
};

export default NewsDetailPage;

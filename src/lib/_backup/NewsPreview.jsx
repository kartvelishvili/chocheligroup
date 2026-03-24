
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

const NewsPreview = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data, error: fetchError } = await supabase
        .from('news')
        .select(`
          id,
          slug,
          title_${language},
          excerpt_${language},
          image_url,
          created_at,
          news_categories (
            name_${language}
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (fetchError) throw fetchError;
      
      // Map dynamic keys to stable keys for rendering
      const formattedData = (data || []).map(item => ({
        id: item.id,
        slug: item.slug,
        title: item[`title_${language}`],
        excerpt: item[`excerpt_${language}`],
        image: item.image_url,
        date: new Date(item.created_at).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US'),
        category: item.news_categories ? item.news_categories[`name_${language}`] : ''
      }));

      setNews(formattedData);
    } catch (err) {
      console.error("Error fetching homepage news:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [language]);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
           <motion.h2
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="text-4xl md:text-5xl font-bold text-corporate-blue heading-font"
           >
             {t({ en: 'News & Updates', ka: 'სიახლეები და განახლებები' })}
           </motion.h2>
           <Link to="/news" className="hidden md:block">
              <span className="text-corporate-blue font-bold flex items-center hover:text-corporate-yellow transition-colors heading-font">
                 {t({ en: 'View All News', ka: 'ყველა სიახლე' })} <ArrowRight className="ml-2 w-5 h-5" />
              </span>
           </Link>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map(i => (
                 <div key={i} className="h-full">
                    <Skeleton className="h-56 w-full rounded-2xl mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                 </div>
              ))}
           </div>
        ) : error ? (
           <div className="text-center py-12 bg-slate-50 rounded-xl mb-12">
              <p className="text-slate-500 mb-4">{t({ en: "Failed to load news.", ka: "სიახლეების ჩატვირთვა ვერ მოხერხდა." })}</p>
              <Button variant="outline" onClick={fetchNews} className="gap-2">
                 <RefreshCw size={16} /> {t({ en: "Retry", ka: "თავიდან ცდა" })}
              </Button>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {news.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all h-full flex flex-col cursor-pointer border border-gray-100"
              >
                <Link to={`/news/${item.slug}`} className="block h-full flex flex-col">
                  <div className="h-56 overflow-hidden relative bg-gray-100">
                     <img 
                        src={item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                     {item.category && (
                       <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-md text-xs font-bold text-corporate-blue uppercase shadow-sm">
                          {item.category}
                       </div>
                     )}
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <Calendar className="w-4 h-4 mr-2 text-corporate-yellow" />
                      <span className="font-medium">{item.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-corporate-blue heading-font mb-4 leading-snug group-hover:text-corporate-blue-light transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                       {item.excerpt}
                    </p>
                    <div className="mt-auto pt-4 flex items-center text-corporate-yellow font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                       {t({ en: 'Read More', ka: 'სრულად' })} <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <div className="text-center md:hidden">
           <Link to="/news">
              <Button className="bg-corporate-blue text-white w-full py-6 rounded-xl font-bold">
                 {t({ en: 'View All News', ka: 'ყველა სიახლე' })}
              </Button>
           </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;


import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import GroupStats from '@/components/GroupStats';
import WhoWeAre from '@/components/WhoWeAre';
import ExecutionDNA from '@/components/ExecutionDNA';
import PortfolioSnapshot from '@/components/PortfolioSnapshot';
import FounderHighlight from '@/components/FounderHighlight';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { supabase } from '@/lib/customSupabaseClient';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage = () => {
  const { t, language } = useLanguage();
  const { getDesign } = useDesign();
  const d = getDesign('news');
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*, news_categories(name_ka, name_en)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) console.error("Error fetching homepage news:", error);
      
      setLatestNews(data || []);
      setLoadingNews(false);
    };
    fetchNews();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t({ en: 'Chocheli Investment Group', ka: 'ჩოჩელი საინვესტიციო ჯგუფი' })}</title>
        <meta 
          name="description" 
          content={t({ 
            en: 'Georgian family-owned investment group with a proven track record in manufacturing, retail, and distribution. 30+ years of execution excellence.', 
            ka: 'ქართული საოჯახო საინვესტიციო ჯგუფი დადასტურებული ისტორიით წარმოებაში, ვაჭრობასა და დისტრიბუციაში. 30+ წელი შესრულების ბრწყინვალება.' 
          })} 
        />
      </Helmet>

      <main>
        <HeroSection />
        <GroupStats />
        <WhoWeAre />
        <ExecutionDNA />
        <PortfolioSnapshot />
        <FounderHighlight />
        
        {/* Latest News Section */}
        <section className="py-24" style={{ backgroundColor: d.bg }}>
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-14">
               <div>
                  <span className="font-bold tracking-widest uppercase text-xs mb-3 block" style={{ color: d.accent }}>
                     {t({ en: 'Stay Updated', ka: 'სიახლეები' })}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold heading-font" style={{ color: d.heading }}>
                     {t({ en: 'Latest News', ka: 'ბოლო სიახლეები' })}
                  </h2>
               </div>
               <Link to="/news" className="hidden md:flex items-center text-teal-600 font-bold hover:text-teal-500 transition-colors text-sm gap-2">
                  {t({ en: 'View All News', ka: 'ყველა სიახლე' })} <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            {loadingNews ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
               </div>
            ) : latestNews.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {latestNews.map((item, index) => (
                     <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100"
                     >
                        <Link to={`/news/${item.slug}`} className="block h-full flex flex-col">
                           <div className="h-48 overflow-hidden relative bg-slate-100">
                              <img 
                                 src={item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'} 
                                 alt={language === 'ka' ? item.title_ka : item.title_en} 
                                 className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                              />
                           </div>
                           <div className="p-6 flex flex-col flex-grow">
                              <div className="flex items-center text-xs text-slate-400 mb-3">
                                 <Calendar className="w-3 h-3 mr-1" />
                                 {new Date(item.created_at).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}
                                 <span className="mx-2">•</span>
                                 <span className="text-teal-600 font-medium uppercase">
                                    {item.news_categories ? (language === 'ka' ? item.news_categories.name_ka : item.news_categories.name_en) : 'News'}
                                 </span>
                              </div>
                              <h3 className="text-lg font-bold text-[#0a1628] mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                 {language === 'ka' ? item.title_ka : item.title_en}
                              </h3>
                              <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-grow">
                                 {language === 'ka' ? item.excerpt_ka : item.excerpt_en}
                              </p>
                              <span className="mt-auto text-sm font-bold text-teal-600 flex items-center group-hover:translate-x-1 transition-transform gap-1">
                                 {t({ en: 'Read More', ka: 'სრულად' })} <ArrowRight className="w-3 h-3" />
                              </span>
                           </div>
                        </Link>
                     </motion.div>
                  ))}
               </div>
            ) : (
               <div className="text-center text-gray-500 py-10">
                  {t({ en: 'No news available at the moment.', ka: 'სიახლეები ჯერ არ არის დამატებული.' })}
               </div>
            )}

            <div className="mt-8 text-center md:hidden">
               <Link to="/news" className="btn-primary inline-flex">
                  {t({ en: 'View All News', ka: 'ყველა სიახლე' })}
               </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;

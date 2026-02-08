import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Layers, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';

const BrandDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch brand and related sub-brands
      const { data, error } = await supabase
        .from('brands')
        .select('*, sub_brands(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setBrand(data);
    } catch (err) {
      console.error("Error fetching brand details:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBrand();

    // Subscribe to updates for this brand
    const channel = supabase
      .channel(`public:brand:${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brands', filter: `id=eq.${id}` }, () => {
        fetchBrand();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) {
     return (
        <Layout>
           <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
           </div>
        </Layout>
     )
  }

  if (error || !brand) {
    return (
       <Layout>
         <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Brand Not Found</h2>
            <p className="text-slate-500 mb-6">The brand page you requested could not be loaded.</p>
            <div className="flex gap-4">
               <Button onClick={() => navigate('/industries')} variant="outline">Back to Catalog</Button>
               <Button onClick={fetchBrand} className="gap-2"><RefreshCw className="w-4 h-4" /> Retry</Button>
            </div>
         </div>
       </Layout>
    )
  }

  const name = language === 'ka' ? brand.name_ka : brand.name_en;
  const description = language === 'ka' ? brand.description_ka : brand.description_en;
  const subBrandsTitle = language === 'ka' ? 'შვილობილი ბრენდები და პროდუქტები' : 'Sub-brands & Products';

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 pb-20 overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative bg-[#1a3a52] text-white overflow-hidden">
             {/* Background Patterns */}
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#F4C430] rounded-full blur-3xl" />
                <div className="absolute left-10 bottom-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
             </div>

             <div className="container mx-auto px-6 py-12 md:py-20 relative z-10">
                <Button 
                  variant="ghost" 
                  className="mb-8 text-slate-300 hover:text-white hover:bg-white/10 group pl-0"
                  onClick={() => navigate('/industries')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  {language === 'ka' ? 'უკან დაბრუნება' : 'Back to Catalog'}
                </Button>

                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.5 }}
                     className="w-48 h-48 lg:w-64 lg:h-64 bg-white rounded-2xl p-6 shadow-2xl flex-shrink-0 flex items-center justify-center border-4 border-white/10 backdrop-blur-sm overflow-hidden"
                   >
                     <img 
                       src={brand.logo_url} 
                       alt={name} 
                       className="w-full h-full object-contain max-w-full max-h-full"
                     />
                   </motion.div>

                   <div className="text-center lg:text-left max-w-2xl w-full">
                      <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.1 }}
                      >
                         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold heading-font mb-4 text-white break-words">
                            {name}
                         </h1>
                         <p className="text-xl text-slate-300 mb-6 font-medium">
                            {language === 'ka' ? brand.name_en : brand.name_ka}
                         </p>
                      </motion.div>

                      <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.2 }}
                         className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
                      >
                         {brand.founding_year && (
                           <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                              <Calendar size={16} className="text-[#F4C430] shrink-0" />
                              <span className="text-sm font-semibold">{brand.founding_year}</span>
                           </div>
                         )}
                         <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                            <Layers size={16} className="text-[#F4C430] shrink-0" />
                            <span className="text-sm font-semibold">
                                {brand.sub_brands ? brand.sub_brands.length : 0} {language === 'ka' ? 'სუბ-ბრენდი' : 'Sub-brands'}
                            </span>
                         </div>
                      </motion.div>

                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-slate-200 leading-relaxed opacity-90 body-font"
                      >
                        {description}
                      </motion.p>
                   </div>
                </div>
             </div>
        </div>

        {/* Sub-brands Grid */}
        <div className="container mx-auto px-6 py-16 md:py-24">
            {brand.sub_brands && brand.sub_brands.length > 0 ? (
                <>
                    <div className="flex items-center gap-3 mb-12">
                        <div className="h-8 w-1.5 bg-[#F4C430] rounded-full" />
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a52] heading-font">
                           {subBrandsTitle}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                       {brand.sub_brands.map((sb, index) => (
                          <motion.div
                             key={index}
                             initial={{ opacity: 0, y: 20 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true }}
                             transition={{ delay: index * 0.1 }}
                             whileHover={{ y: -5 }}
                             className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full overflow-hidden"
                          >
                             <div className="flex items-start justify-between mb-6">
                                <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-100 p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden shrink-0">
                                   <img src={sb.logo_url} alt={sb.name_en} className="w-full h-full object-contain max-w-full max-h-full" />
                                </div>
                                <div className="p-2 bg-slate-50 rounded-full text-slate-400 group-hover:text-[#F4C430] group-hover:bg-[#F4C430]/10 transition-colors shrink-0">
                                   <ExternalLink size={18} />
                                </div>
                             </div>

                             <h3 className="text-xl font-bold text-[#1a3a52] mb-1 group-hover:text-[#F4C430] transition-colors truncate">
                                {language === 'ka' ? sb.name_ka : sb.name_en}
                             </h3>
                             <p className="text-sm text-slate-400 font-medium mb-4 truncate">
                                {language === 'ka' ? sb.name_en : sb.name_ka}
                             </p>

                             <div className="mt-auto pt-4 border-t border-slate-50">
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                                    {language === 'ka' 
                                    ? `${sb.name_ka} წარმოადგენს ${brand.name_ka}-ს სტრატეგიულ მიმართულებას.`
                                    : `${sb.name_en} represents a strategic direction of ${brand.name_en}.`}
                                </p>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
                    <Layers className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">{language === 'ka' ? 'ინფორმაცია შვილობილი კომპანიების შესახებ არ მოიძებნა.' : 'No sub-brand information available.'}</p>
                </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default BrandDetailPage;
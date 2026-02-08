import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { ChevronRight, Calendar, ArrowUpRight, Sparkles, Search, RefreshCw, AlertCircle, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';

const CatalogCard = ({ brand, index }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const name = language === 'ka' ? brand.name_ka : brand.name_en;
  const description = language === 'ka' ? brand.description_ka : brand.description_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={() => navigate(`/brand/${brand.id}`)}
      className="group relative flex flex-col bg-[#111827] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300 h-full"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-transparent to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-500" />
      
      {/* Top Decorative Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      <div className="p-6 md:p-8 flex flex-col h-full relative z-10 overflow-hidden">
        {/* Header: Logo & Year */}
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-purple-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full" />
            
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white/5 group-hover:ring-purple-500/20 transition-all duration-300 relative z-10 shrink-0">
              {brand.logo_url ? (
                  <img 
                    src={brand.logo_url} 
                    alt={name} 
                    className="w-full h-full object-contain p-3 max-w-full max-h-full"
                  />
              ) : (
                  <Building2 className="w-1/2 h-1/2 text-slate-300" />
              )}
            </div>
          </div>

          {brand.founding_year && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 backdrop-blur-sm group-hover:bg-white/10 transition-colors shrink-0">
              <Calendar size={12} className="text-purple-400" />
              <span>{brand.founding_year}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow overflow-hidden">
            <h3 className="text-2xl font-bold text-white mb-2 heading-font group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-300 truncate w-full">
            {name}
            </h3>
            
            {/* Secondary Name (Language alternate) */}
            <p className="text-sm text-slate-500 font-medium mb-4 truncate w-full">
            {language === 'ka' ? brand.name_en : brand.name_ka}
            </p>

            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 body-font group-hover:text-slate-300 transition-colors">
            {description}
            </p>
        </div>

        {/* Footer Action */}
        <div className="mt-auto flex items-center text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors gap-2">
            <span>{language === 'ka' ? 'იხილეთ მეტი' : 'Discover Brand'}</span>
            <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 shrink-0" />
        </div>
      </div>
    </motion.div>
  );
};

const BrandCatalogPage = () => {
  const { t, language } = useLanguage();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBrands(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();

    const channel = supabase
      .channel('public:brands_catalog')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, () => {
        fetchBrands();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredBrands = brands.filter(b => 
    (b.name_ka?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (b.name_en?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 selection:text-white overflow-x-hidden">
        
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-950 via-[#0f172a] to-[#020617] z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[80px] -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 body-font">
                    <Link to="/" className="hover:text-purple-400 transition-colors">{t('Home')}</Link>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                    <span className="text-white font-medium">{t('Brand Catalog')}</span>
                </div>

                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="h-px w-12 bg-purple-500" />
                        <span className="text-purple-400 font-bold tracking-wider uppercase text-sm">
                            {language === 'ka' ? 'ჩვენი პორტფოლიო' : 'Our Portfolio'}
                        </span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold text-white heading-font mb-6 leading-tight"
                    >
                        {language === 'ka' ? 'წამყვანი ბრენდების' : 'Ecosystem of'} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                             {language === 'ka' ? 'ეკოსისტემა' : 'Leading Brands'}
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed body-font"
                    >
                        {language === 'ka' 
                            ? 'აღმოაჩინეთ ჩვენი ჯგუფის წევრი კომპანიები, რომლებიც ქმნიან ხარისხის ახალ სტანდარტს სხვადასხვა ინდუსტრიაში.'
                            : 'Discover our group member companies that set new quality standards across diverse industries.'}
                    </motion.p>
                </div>
            </div>
        </div>

        {/* Brands Grid Section */}
        <div className="relative py-20 bg-[#020617]">
             <div className="container mx-auto px-6">
                
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-3 shrink-0">
                        <Sparkles className="text-purple-500" size={24} />
                        {language === 'ka' ? 'ყველა ბრენდი' : 'All Brands'}
                     </h2>
                     <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          placeholder={language === 'ka' ? 'ძებნა...' : 'Search brands...'}
                          className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                       {[1,2,3,4].map(i => <Skeleton key={i} className="h-96 bg-white/5 rounded-2xl" />)}
                    </div>
                ) : error ? (
                   <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-xl border border-red-900/20 text-center">
                      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">Failed to load brands</h3>
                      <Button onClick={fetchBrands} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10 hover:text-white">
                         <RefreshCw className="w-4 h-4" /> Retry
                      </Button>
                   </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {filteredBrands.map((brand, index) => (
                            <CatalogCard key={brand.id} brand={brand} index={index} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredBrands.length === 0 && (
                    <div className="text-center py-20 text-slate-500 bg-white/5 rounded-2xl">
                        {language === 'ka' ? 'ბრენდები არ მოიძებნა' : 'No brands found'}
                    </div>
                )}
             </div>
        </div>

    </div>
    </Layout>
  );
};

export default BrandCatalogPage;
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, Globe, Layers, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { supabase } from '@/lib/customSupabaseClient';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const CompanyDetailPage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { getDesign } = useDesign();
  const d = getDesign('hero');
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [subBrands, setSubBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);

      const { data: subData, error: subError } = await supabase
        .from('sub_brands')
        .select('*')
        .eq('company_id', id)
        .order('order_position', { ascending: true });

      if (subError) throw subError;
      setSubBrands(subData || []);

    } catch (err) {
      console.error('Error fetching company data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-slate-50 min-h-screen">
          <div className="h-[50vh] bg-[#0a1628] animate-pulse" />
          <div className="container mx-auto px-6 -mt-20 relative z-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
               <Skeleton className="w-32 h-32 rounded-2xl mb-4" />
               <Skeleton className="h-8 w-64 mb-4" />
               <Skeleton className="h-4 w-full mb-2" />
               <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !company) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {language === 'ka' ? 'ინფორმაცია ვერ მოიძებნა' : 'Company Not Found'}
            </h2>
            <p className="text-slate-500 mb-8">
              {language === 'ka' 
                ? 'სამწუხაროდ, კომპანიის მონაცემების ჩატვირთვა ვერ მოხერხდა.' 
                : 'Unable to load company details. Please try again later.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/industries')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ka' ? 'უკან' : 'Back'}
              </Button>
              <Button onClick={fetchData} className="bg-[#0a1628] hover:bg-[#0d1f37]">
                <RefreshCw className="w-4 h-4 mr-2" />
                {language === 'ka' ? 'ცდა' : 'Retry'}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const companyName = language === 'ka' ? company.name_ka : company.name_en;
  const companyDesc = language === 'ka' ? company.description_ka : company.description_en;

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen font-sans">
        
        {/* Hero Section */}
        <section className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden" style={{ backgroundColor: d.bg }}>
           <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(to bottom right, ${d.bg}, ${d.bg2}, ${d.bg})` }} />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-0" />
           <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl z-0" />
           <div className="absolute top-1/4 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl z-0" />

           <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10 pt-20">
              <Link to="/industries" className="inline-flex items-center text-white/50 hover:text-teal-300 mb-8 transition-colors self-start group">
                 <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                 <span className="font-medium tracking-wide text-sm">{language === 'ka' ? 'ბრენდები' : 'Back to Industries'}</span>
              </Link>

              <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
                 <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-36 h-36 md:w-48 md:h-48 bg-white rounded-3xl shadow-2xl p-6 flex items-center justify-center shrink-0 border border-white/10"
                 >
                    {company.logo_url ? (
                       <img src={company.logo_url} alt={companyName} className="w-full h-full object-contain" />
                    ) : (
                       <span className="text-4xl font-bold text-[#0a1628]">{companyName?.charAt(0)}</span>
                    )}
                 </motion.div>

                 <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center md:text-left text-white max-w-3xl pb-4"
                 >
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                       <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: d.accentBgStrong, color: d.accentLight, border: `1px solid ${d.accent}33` }}>
                          {company.industry}
                       </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                       {companyName}
                    </h1>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/70 text-sm">
                       {company.founded_year && (
                          <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-teal-400" />
                             <span>{language === 'ka' ? 'დაფუძნდა' : 'Founded'}: <strong className="text-white">{company.founded_year}</strong></span>
                          </div>
                       )}
                       {company.website && (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-teal-300 transition-colors">
                             <Globe className="w-4 h-4 text-teal-400" />
                             <span className="underline decoration-white/30 hover:decoration-teal-400">{company.website.replace(/^https?:\/\//, '')}</span>
                          </a>
                       )}
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-16 -mt-10 relative z-20">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left: About & Sub-Brands */}
              <div className="lg:col-span-2 space-y-10">
                 {/* About */}
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100"
                 >
                    <h2 className="text-2xl font-bold text-[#0a1628] mb-6 flex items-center gap-3">
                       <div className="w-1.5 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full" />
                       {language === 'ka' ? 'კომპანიის შესახებ' : 'About Company'}
                    </h2>
                    <div className="prose prose-lg text-slate-600 max-w-none leading-relaxed whitespace-pre-wrap">
                       {companyDesc}
                    </div>
                 </motion.div>

                 {/* Sub-Brands Section - Prominent */}
                 <div>
                    <div className="flex items-center justify-between mb-6 px-1">
                       <h2 className="text-2xl font-bold text-[#0a1628] flex items-center gap-3">
                          <Layers className="w-6 h-6 text-teal-500" />
                          {language === 'ka' ? 'ბრენდები და მიმართულებები' : 'Brands & Subsidiaries'}
                       </h2>
                       <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-sm font-bold border border-teal-100">
                          {subBrands.length}
                       </span>
                    </div>

                    {subBrands.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {subBrands.map((brand, idx) => {
                             const sbName = language === 'ka' ? brand.name_ka : brand.name_en;
                             const sbDesc = language === 'ka' ? brand.description_ka : brand.description_en;
                             return (
                               <motion.div
                                 key={brand.id}
                                 initial={{ opacity: 0, y: 20 }}
                                 whileInView={{ opacity: 1, y: 0 }}
                                 viewport={{ once: true }}
                                 transition={{ duration: 0.4, delay: idx * 0.06 }}
                                 whileHover={{ y: -3 }}
                                 className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group"
                               >
                                 <div className="relative h-40 bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                                   <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                   {brand.logo_url ? (
                                     <img 
                                       src={brand.logo_url} 
                                       alt={sbName} 
                                       className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" 
                                     />
                                   ) : (
                                     <div className="text-2xl font-bold text-slate-300 relative z-10">{sbName}</div>
                                   )}
                                 </div>
                                 <div className="p-5 flex-grow flex flex-col">
                                   <h3 className="text-lg font-bold text-[#0a1628] mb-2 group-hover:text-teal-600 transition-colors">
                                     {sbName}
                                   </h3>
                                   <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                                     {sbDesc}
                                   </p>
                                   {brand.website_url && (
                                     <a 
                                       href={brand.website_url} 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-500 transition-colors mt-auto group/link gap-1.5"
                                     >
                                       <Globe className="w-3.5 h-3.5" />
                                       <span>{language === 'ka' ? 'ვებგვერდი' : 'Visit Website'}</span>
                                       <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                     </a>
                                   )}
                                 </div>
                               </motion.div>
                             );
                          })}
                       </div>
                    ) : (
                       <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-500 font-medium">
                             {language === 'ka' 
                                ? 'ამ კომპანიისთვის ქვებრენდები არ არის დამატებული.' 
                                : 'No sub-brands listed for this company.'}
                          </p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Right: Sidebar */}
              <div className="space-y-6">
                 <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#0a1628] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-10 -mt-10 blur-xl" />
                    
                    <h3 className="text-xl font-bold mb-6 relative z-10 border-b border-white/10 pb-4">
                       {language === 'ka' ? 'ძირითადი ფაქტები' : 'Key Facts'}
                    </h3>
                    
                    <ul className="space-y-6 relative z-10">
                       <li className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
                             <Calendar className="w-5 h-5 text-teal-400" />
                          </div>
                          <div>
                             <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">{language === 'ka' ? 'დაფუძნდა' : 'Founded'}</span>
                             <span className="text-lg font-bold">{company.founded_year || 'N/A'}</span>
                          </div>
                       </li>
                       <li className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
                             <Users className="w-5 h-5 text-teal-400" />
                          </div>
                          <div>
                             <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">{language === 'ka' ? 'თანამშრომლები' : 'Employees'}</span>
                             <span className="text-lg font-bold">{company.employees_count ? `${company.employees_count}+` : 'N/A'}</span>
                          </div>
                       </li>
                       {subBrands.length > 0 && (
                         <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
                               <Layers className="w-5 h-5 text-teal-400" />
                            </div>
                            <div>
                               <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">{language === 'ka' ? 'ბრენდები' : 'Brands'}</span>
                               <span className="text-lg font-bold">{subBrands.length}</span>
                            </div>
                         </li>
                       )}
                    </ul>
                 </motion.div>

                 {/* Back to Industries CTA */}
                 <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg"
                 >
                    <h4 className="font-bold mb-2">{language === 'ka' ? 'სხვა კომპანიები' : 'Other Companies'}</h4>
                    <p className="text-white/80 text-sm mb-4">{language === 'ka' ? 'გაეცანით ჩვენს ყველა კომპანიას' : 'Discover all our portfolio companies'}</p>
                    <Link
                      to="/industries"
                      className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-bold hover:bg-white/30 transition-all"
                    >
                      {language === 'ka' ? 'ყველა კომპანია' : 'All Companies'}
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </Link>
                 </motion.div>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
};

export default CompanyDetailPage;
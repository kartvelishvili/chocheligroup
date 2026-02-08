import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { useCompanies } from '@/hooks/useCompanies';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCcw, Building2, Calendar, Layers, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useNavigate } from 'react-router-dom';

const IndustriesPage = () => {
  const { language } = useLanguage();
  const { companies, loading, error, fetchCompanies } = useCompanies();
  const { content: c } = useSiteContent('industries_page');
  const { getDesign } = useDesign();
  const d = getDesign('hero');
  const lang = language === 'ka' ? 'ka' : 'en';
  const navigate = useNavigate();

  // Count total sub-brands across all companies
  const totalSubBrands = companies.reduce((acc, co) => acc + (co.sub_brands?.length || 0), 0);

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden" style={{ backgroundColor: d.bg }}>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="font-bold tracking-widest uppercase text-xs mb-4 block" style={{ color: d.accent }}>
                {language === 'ka' ? 'ჩვენი პორტფოლიო' : 'Our Portfolio'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white heading-font mb-6">
                {c?.[`title_${lang}`] || (language === 'ka' ? 'ბიზნეს მიმართულებები' : 'Business Industries')}
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl body-font leading-relaxed">
                {c?.[`subtitle_${lang}`] || (language === 'ka' 
                  ? 'ჩვენი ჯგუფი აერთიანებს სხვადასხვა ინდუსტრიის ლიდერ კომპანიებს, რომლებიც ქმნიან ხარისხის სტანდარტს.'
                  : 'Our group unites leading companies across various industries that set the standard for quality.')}
              </p>

              {/* Stats Strip */}
              {!loading && companies.length > 0 && (
                <div className="flex items-center justify-center gap-8 mt-10">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{companies.length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                      {language === 'ka' ? 'კომპანია' : 'Companies'}
                    </div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: d.accent }}>{totalSubBrands}+</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                      {language === 'ka' ? 'ბრენდი' : 'Brands'}
                    </div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">30+</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                      {language === 'ka' ? 'წელი' : 'Years'}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Companies Section */}
        <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-20 pb-20">
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
               {[1,2,3,4,5,6].map(i => (
                 <Skeleton key={i} className="h-[500px] rounded-2xl bg-white shadow-sm" />
               ))}
             </div>
          ) : error ? (
             <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-red-100 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Failed to load content</h3>
                <p className="text-slate-500 mb-6">There was a problem fetching the data. Please try again.</p>
                <Button onClick={fetchCompanies} variant="outline" className="gap-2">
                   <RefreshCcw className="w-4 h-4" /> Retry
                </Button>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {companies.map((company, index) => {
                  const name = language === 'ka' ? company.name_ka : company.name_en;
                  const nameAlt = language === 'ka' ? company.name_en : company.name_ka;
                  const subBrands = company.sub_brands || [];

                  return (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(`/company/${company.id}`)}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden cursor-pointer border border-slate-100 flex flex-col h-full transition-all duration-300"
                    >
                      {/* Company Header */}
                      <div className="p-6 pb-4 flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 shadow-inner group-hover:shadow-md transition-shadow duration-300 overflow-hidden shrink-0">
                          {company.logo_url ? (
                            <img 
                              src={company.logo_url} 
                              alt={`${name} logo`} 
                              className="w-full h-full object-contain transition-all duration-300"
                              onError={(e) => { e.target.style.display='none'; }}
                            />
                          ) : (
                            <Building2 className="w-1/2 h-1/2 text-slate-300" />
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-[#0a1628] heading-font mb-0.5 group-hover:text-teal-600 transition-colors truncate w-full px-2">
                          {name}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium mb-3 truncate w-full px-2">
                          {nameAlt}
                        </p>
                        
                        {company.founded_year && (
                          <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 text-xs font-medium text-slate-500">
                            <Calendar size={12} className="text-teal-500" />
                            <span>{company.founded_year}</span>
                          </div>
                        )}
                      </div>

                      {/* Sub-brands Section - Emphasized */}
                      {subBrands.length > 0 && (
                        <div className="px-6 pb-4 mt-auto">
                          <div className="border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Layers className="w-3.5 h-3.5 text-teal-500" />
                              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                                {language === 'ka' ? 'საერთაშორისო ბრენდები' : 'International Brands'}
                              </span>
                              <span className="ml-auto text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                                {subBrands.length}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-5 gap-2">
                              {subBrands.slice(0, 10).map((sb, idx) => {
                                const sbName = language === 'ka' ? sb.name_ka : sb.name_en;
                                return (
                                  <div key={sb.id || idx} className="flex flex-col items-center gap-1 group/sb">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 p-1.5 flex items-center justify-center hover:scale-110 hover:border-teal-400/50 hover:bg-white hover:shadow-md transition-all duration-200 shadow-sm overflow-hidden shrink-0" title={sbName}>
                                      {sb.logo_url ? (
                                        <img src={sb.logo_url} alt={sbName} className="w-full h-full object-contain" />
                                      ) : (
                                        <span className="text-[8px] font-bold text-slate-300">{sbName?.substring(0,2)}</span>
                                      )}
                                    </div>
                                    <span className="text-[7px] leading-none text-slate-400 font-medium text-center line-clamp-1 w-full overflow-hidden text-ellipsis">
                                      {sbName}
                                    </span>
                                  </div>
                                );
                              })}
                              {subBrands.length > 10 && (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-teal-600">
                                    +{subBrands.length - 10}
                                  </div>
                                  <span className="text-[7px] text-slate-400 font-medium">{language === 'ka' ? 'მეტი' : 'More'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto group-hover:bg-teal-50/50 transition-colors">
                        <span className="text-xs font-bold text-teal-600">
                          {language === 'ka' ? 'ვრცლად' : 'View Details'}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white text-teal-600 transition-all duration-300">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {!loading && companies.length === 0 && (
                <div className="text-center py-12 text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-100">
                   {language === 'ka' ? 'კომპანიები ვერ მოიძებნა.' : 'No companies found.'}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default IndustriesPage;
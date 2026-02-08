import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { Button } from '@/components/ui/button';
import { useCompanies } from '@/hooks/useCompanies';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowRight, Layers } from 'lucide-react';

const PortfolioSnapshot = () => {
  const { t, language } = useLanguage();
  const { getDesign } = useDesign();
  const d = getDesign('portfolio');
  const { companies, loading, error, fetchCompanies } = useCompanies();

  if (loading) {
    return (
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
           <Skeleton className="h-12 w-64 mx-auto mb-16" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                 <Skeleton key={i} className="h-96 w-full rounded-xl" />
              ))}
           </div>
        </div>
      </section>
    );
  }

  if (error) {
     return (
        <section className="py-24 bg-slate-50 flex justify-center">
           <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Error Loading Portfolio</h3>
              <Button onClick={() => fetchCompanies()} variant="outline" className="mt-4">
                 Retry Connection
              </Button>
           </div>
        </section>
     );
  }

  // Display top 8 companies
  const featuredCompanies = companies.slice(0, 8);

  return (
    <section className="py-24 overflow-hidden relative" style={{ backgroundColor: d.bg }}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
           <span className="font-bold tracking-widest uppercase text-xs mb-3 block" style={{ color: d.accent }}>
              {t('Our Portfolio')}
           </span>
           <h2 className="text-4xl md:text-5xl font-bold heading-font" style={{ color: d.heading }}>
              {t({ en: 'Group Companies', ka: 'ჯგუფის კომპანიები' })}
           </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {featuredCompanies.map((company, index) => {
             const companyName = language === 'ka' ? company.name_ka : company.name_en;
             const subBrands = company.sub_brands || [];
             const displayLimit = subBrands.length === 4 ? 4 : 3;
             const displaySubBrands = subBrands.slice(0, displayLimit);
             const remainingCount = subBrands.length - displayLimit;

             return (
               <Link key={company.id} to={`/company/${company.id}`} className="group block h-full">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: index * 0.05 }}
                   whileHover={{ y: -5 }}
                   className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-xl hover:border-teal-200/40 transition-all duration-300 relative overflow-hidden group"
                 >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/10 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                    
                    {/* Header: Logo */}
                    <div className="h-28 flex items-center justify-center mb-5 p-4 relative z-10 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-teal-200/40 transition-all duration-300">
                       {company.logo_url ? (
                          <img 
                             src={company.logo_url} 
                             alt={companyName} 
                             className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-500 ease-out" 
                          />
                       ) : (
                          <span className="text-3xl font-bold text-slate-300 tracking-tighter">{companyName?.substring(0,2)}</span>
                       )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow flex flex-col z-10 relative">
                       <div className="mb-4">
                           <h3 className="text-lg font-bold text-[#0a1628] mb-1.5 group-hover:text-teal-600 transition-colors line-clamp-1 leading-tight">
                              {companyName}
                           </h3>
                           <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-teal-500" />
                              {t('Founded')}: {company.founded_year || 'N/A'}
                           </p>
                       </div>
                       
                       {/* Sub-Brands Grid */}
                       {subBrands.length > 0 && (
                          <div className="mt-auto pt-3 border-t border-slate-100/60">
                             <div className="flex items-center gap-1.5 mb-2.5">
                                <Layers className="w-3 h-3 text-teal-500/50" />
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                   {t({ en: 'Brands', ka: 'ბრენდები' })}
                                </span>
                             </div>
                             
                             <div className="grid grid-cols-4 gap-2">
                                {displaySubBrands.map((sb, idx) => {
                                   const sbName = language === 'ka' ? sb.name_ka : sb.name_en;
                                   return (
                                     <motion.div 
                                       key={sb.id}
                                       initial={{ opacity: 0, scale: 0.9 }}
                                       animate={{ opacity: 1, scale: 1 }}
                                       transition={{ delay: 0.1 + (idx * 0.05) }}
                                       className="flex flex-col items-center gap-1 group/sb"
                                     >
                                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1 relative overflow-hidden group-hover/sb:shadow-md group-hover/sb:border-teal-400/40 group-hover/sb:scale-105 transition-all duration-300">
                                            {sb.logo_url ? (
                                               <img src={sb.logo_url} alt={sbName} className="w-full h-full object-contain relative z-10" />
                                            ) : (
                                               <span className="text-[7px] font-bold text-slate-300 relative z-10">{sbName?.substring(0,2)}</span>
                                            )}
                                        </div>
                                        <span className="text-[8px] leading-none text-slate-500 font-medium text-center line-clamp-1 w-full overflow-hidden text-ellipsis px-0.5 group-hover/sb:text-teal-600 transition-colors">
                                           {sbName}
                                        </span>
                                     </motion.div>
                                   );
                                })}
                                
                                {remainingCount > 0 && (
                                   <div className="flex flex-col items-center gap-1">
                                      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm group-hover:bg-slate-100 group-hover:border-teal-500/30 transition-all">
                                         <span className="text-[10px] font-bold text-teal-600">+{remainingCount}</span>
                                      </div>
                                      <span className="text-[8px] text-slate-400 font-medium">{t('More')}</span>
                                   </div>
                                )}
                             </div>
                          </div>
                       )}
                    </div>

                    {/* Footer Action */}
                    <div className="mt-4 pt-3 flex justify-between items-center z-10 relative">
                       <span className="text-xs font-bold text-teal-600 group-hover:text-teal-500 transition-colors">
                          {language === 'ka' ? 'ვრცლად' : 'View Details'}
                       </span>
                       <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                          <ArrowRight className="w-3 h-3" />
                       </div>
                    </div>
                 </motion.div>
               </Link>
             );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/portfolio">
            <Button
              className="bg-[#0a1628] text-white hover:bg-[#0d1f37] font-bold text-lg px-10 py-6 rounded-full heading-font shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              {t('View Full Portfolio')}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSnapshot;
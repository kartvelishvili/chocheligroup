import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, Award, RefreshCcw, Layers, Globe, Users, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import CompanyLogo from '@/components/CompanyLogo';
import SubProjectCard from '@/components/SubProjectCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/customSupabaseClient';

const CompanyPage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [subBrands, setSubBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedCompanies, setRelatedCompanies] = useState([]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch Company Details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (companyError) throw companyError;
      setCompany(companyData);

      // 2. Fetch Sub-projects / Sub-brands ordered by order_position
      const { data: subData, error: subError } = await supabase
        .from('sub_brands')
        .select('*')
        .eq('company_id', id)
        .order('order_position', { ascending: true });

      if (subError) console.error("Error fetching sub-brands:", subError);
      setSubBrands(subData || []);
      
      // 3. Fetch Related Companies (same industry)
      if (companyData && companyData.industry) {
        const { data: related } = await supabase
          .from('companies')
          .select('*')
          .eq('industry', companyData.industry)
          .neq('id', companyData.id)
          .limit(3);
        setRelatedCompanies(related || []);
      }
    } catch (err) {
      console.error("Error fetching company:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCompanyData();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`public:company:${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies', filter: `id=eq.${id}` }, () => {
        fetchCompanyData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Adapter for CompanyLogo component
  const getAdaptedCompany = (c) => ({
    id: c?.id,
    name: language === 'ka' ? c?.name_ka : c?.name_en,
    founded: c?.founded_year,
    logo: c?.logo_url,
    color: 'bg-corporate-blue'
  });

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
         {/* Skeleton Hero */}
         <div className="bg-corporate-blue pt-20 pb-24 px-6">
            <div className="container mx-auto">
                <Skeleton className="h-6 w-32 bg-white/20 mb-8" />
                <div className="flex flex-col md:flex-row items-center gap-8">
                   <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/20" />
                   <div className="w-full">
                      <Skeleton className="h-6 w-24 bg-corporate-yellow mb-4 rounded-full" />
                      <Skeleton className="h-12 w-3/4 bg-white/20 mb-4" />
                      <Skeleton className="h-6 w-1/4 bg-white/20" />
                   </div>
                </div>
            </div>
         </div>
         {/* Skeleton Content */}
         <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 -mt-24 relative z-10">
               <Skeleton className="h-32 rounded-xl bg-white shadow-lg" />
               <Skeleton className="h-32 rounded-xl bg-white shadow-lg" />
               <Skeleton className="h-32 rounded-xl bg-white shadow-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-8">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  
                  <div className="mt-12">
                     <Skeleton className="h-8 w-64 mb-6" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-64 rounded-xl" />
                        <Skeleton className="h-64 rounded-xl" />
                     </div>
                  </div>
               </div>
               <div className="space-y-6">
                  <Skeleton className="h-64 rounded-xl" />
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-50 max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <RefreshCcw className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800">Company Not Found</h2>
          <p className="text-slate-500 mb-6">Unable to load company details. The company might have been removed or there is a connection issue.</p>
          <div className="flex gap-3 justify-center">
             <Button onClick={() => navigate('/portfolio')} variant="outline">Back to Portfolio</Button>
             <Button onClick={fetchCompanyData} variant="default" className="bg-corporate-blue gap-2">
                Retry Connection
             </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden min-h-screen">
      {/* Hero */}
      <section className="bg-corporate-blue text-white pt-24 pb-32 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-top-right" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-corporate-yellow/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <Link to="/portfolio" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            {t('Back to Portfolio')}
          </Link>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.5 }}
               className="shrink-0"
            >
               <CompanyLogo company={getAdaptedCompany(company)} className="w-32 h-32 md:w-48 md:h-48 text-4xl shadow-2xl bg-white rounded-full p-2" showText={false} />
            </motion.div>
            
            <div className="text-center md:text-left max-w-2xl w-full">
              <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.1 }}
              >
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                     <span className="bg-corporate-yellow text-corporate-blue px-4 py-1.5 rounded-full text-sm font-bold uppercase inline-block tracking-wider">
                     {company.industry}
                     </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold heading-font mb-4 leading-tight">
                    {language === 'ka' ? company.name_ka : company.name_en}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/80 body-font text-lg">
                     {company.website && (
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                           <Globe className="w-5 h-5 mr-2" />
                           <span className="truncate max-w-[200px]">{company.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                     )}
                     
                     {/* View Project Details Button */}
                     {company.project_detail_page_url && (
                        <a href={company.project_detail_page_url} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all text-sm border border-white/20">
                           {language === 'ka' ? 'პროექტის დეტალები' : 'View Project Details'}
                           <ExternalLink size={14} />
                        </a>
                     )}
                  </div>

                  {/* Mobile Button for Project Details */}
                  {company.project_detail_page_url && (
                     <div className="mt-6 md:hidden">
                        <a href={company.project_detail_page_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-corporate-blue rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                           {language === 'ka' ? 'პროექტის დეტალები' : 'View Project Details'}
                           <ExternalLink size={16} />
                        </a>
                     </div>
                  )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative z-20 -mt-16 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                 <Calendar className="w-6 h-6 text-corporate-blue" />
              </div>
              <div>
                 <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{t('Founded')}</p>
                 <p className="text-2xl font-bold text-gray-800">{company.founded_year || 'N/A'}</p>
              </div>
            </motion.div>

            <motion.div 
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                 <Users className="w-6 h-6 text-corporate-blue" />
              </div>
              <div>
                 <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Employees</p>
                 <p className="text-2xl font-bold text-gray-800">{company.employees_count ? `${company.employees_count}+` : 'N/A'}</p>
              </div>
            </motion.div>

            <motion.div 
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                 <Award className="w-6 h-6 text-corporate-blue" />
              </div>
              <div>
                 <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{t('Market Position')}</p>
                 <p className="text-2xl font-bold text-gray-800">Leader</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Description & Projects */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Section */}
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-corporate-blue heading-font mb-6 flex items-center gap-2">
                <div className="w-1 h-8 bg-corporate-yellow rounded-full"></div>
                {t('About Company')}
              </h2>
              <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed whitespace-pre-line">
                  {language === 'ka' ? company.description_ka : company.description_en}
              </div>
            </motion.div>

            {/* Sub-Projects / Sub-Brands Grid */}
            <div className="mt-12 pt-12 border-t border-gray-100">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-corporate-blue heading-font flex items-center gap-2">
                     <Layers className="w-6 h-6 text-corporate-yellow" />
                     {language === 'ka' ? 'პროექტები და მიმართულებები' : 'Projects & Subsidiaries'}
                  </h2>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                     {subBrands.length}
                  </span>
               </div>
               
               {subBrands.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {subBrands.map((sb, index) => (
                        <SubProjectCard key={sb.id} project={sb} index={index} />
                     ))}
                  </div>
               ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                     <p className="text-slate-500">
                        {language === 'ka' 
                           ? 'ამ კომპანიისთვის პროექტები არ არის დამატებული.' 
                           : 'No projects or subsidiaries listed for this company yet.'}
                     </p>
                  </div>
               )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {/* Open Vacancies Card */}
            <div className="bg-corporate-blue p-8 rounded-xl text-white text-center overflow-hidden shadow-lg relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full group-hover:bg-white/10 transition-colors"></div>
              <h3 className="text-xl font-bold mb-4 relative z-10">{t('Open Vacancies')}</h3>
              <p className="text-white/70 mb-6 text-sm relative z-10">
                 Interested in joining our team? Check out current openings at {language === 'ka' ? company.name_ka : company.name_en}.
              </p>
              <Link to="/careers" className="relative z-10">
                <Button className="w-full bg-corporate-yellow text-corporate-blue hover:bg-white hover:text-corporate-blue font-bold transition-all border-2 border-transparent hover:border-corporate-blue">
                  {t('View All')}
                </Button>
              </Link>
            </div>
            
            {/* Related Companies */}
            {relatedCompanies.length > 0 && (
              <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm overflow-hidden">
                 <h3 className="text-lg font-bold text-corporate-blue mb-4 pb-2 border-b border-gray-100">
                    {t('More in Industry')}
                 </h3>
                 <div className="space-y-4">
                    {relatedCompanies.map(rel => (
                       <Link key={rel.id} to={`/company/${rel.id}`} className="flex items-center gap-4 group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                          <CompanyLogo 
                             company={getAdaptedCompany(rel)} 
                             className="w-10 h-10 text-[10px] shrink-0 bg-white border border-slate-100" 
                             showText={false} 
                          />
                          <div className="overflow-hidden">
                             <h4 className="font-bold text-sm text-gray-800 group-hover:text-corporate-blue transition-colors truncate">
                                {language === 'ka' ? rel.name_ka : rel.name_en}
                             </h4>
                             <div className="flex items-center text-xs text-slate-400 mt-0.5">
                                <span className="truncate">{rel.industry}</span>
                             </div>
                          </div>
                          <ArrowLeft className="w-4 h-4 text-slate-300 ml-auto rotate-180 group-hover:text-corporate-blue transition-colors" />
                       </Link>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyPage;
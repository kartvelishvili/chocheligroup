import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanies } from '@/hooks/useCompanies';
import CompanyLogo from '@/components/CompanyLogo';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useDesign } from '@/hooks/useDesign';

const adaptCompany = (company, language) => ({
  id: company.id,
  name: language === 'ka' ? company.name_ka : company.name_en,
  founded: company.founded_year,
  logo: company.logo_url,
  color: 'bg-slate-800'
});

/* ══════════ HERO ══════════ */
const PageHero = ({ d, c, lang, t }) => (
  <section className="py-24 relative overflow-hidden" style={{ backgroundColor: d.heroBg || d.bg }}>
    <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: d.accent, opacity: 0.06 }} />
    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold heading-font mb-6" style={{ color: d.heroText || '#fff' }}>
        {c?.[`title_${lang}`] || t('Portfolio')}
      </motion.h1>
      <p className="text-xl max-w-2xl mx-auto body-font" style={{ color: (d.heroText || '#fff') + 'AA' }}>
        {c?.[`subtitle_${lang}`] || t({ en: 'A diverse ecosystem of market-leading companies built on excellence and innovation.', ka: '\u10d1\u10d0\u10d6\u10e0\u10d8\u10e1 \u10da\u10d8\u10d3\u10d4\u10e0\u10d8 \u10d9\u10dd\u10db\u10de\u10d0\u10dc\u10d8\u10d4\u10d1\u10d8\u10e1 \u10db\u10e0\u10d0\u10d5\u10d0\u10da\u10e4\u10d4\u10e0\u10dd\u10d5\u10d0\u10dc\u10d8 \u10d4\u10d9\u10dd\u10e1\u10d8\u10e1\u10e2\u10d4\u10db\u10d0.' })}
      </p>
    </div>
  </section>
);

/* ══════════ LOADING / ERROR ══════════ */
const LoadingState = () => (
  <div className="space-y-12 max-w-4xl mx-auto py-12"><div className="container mx-auto px-6">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl mb-6" />)}</div></div>
);
const ErrorState = ({ fetchCompanies }) => (
  <div className="max-w-xl mx-auto text-center p-8 bg-white rounded-xl shadow-sm border border-red-100 my-12">
    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
    <p className="text-gray-800 font-medium mb-4">Unable to load portfolio data.</p>
    <Button onClick={fetchCompanies} variant="outline" className="gap-2"><RefreshCw className="w-4 h-4" /> Try Again</Button>
  </div>
);

/* ══════════ TIMELINE LAYOUT ══════════ */
const TimelineLayout = ({ companies, d, language, t }) => (
  <div className="relative py-12">
    {companies.length > 0 && (
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2 hidden md:block rounded-full" style={{ backgroundColor: d.cardBorder }} />
    )}
    <div className="space-y-12 container mx-auto px-6">
      {companies.map((company, index) => (
        <motion.div key={company.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.1 }} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          <div className="absolute left-6 md:left-1/2 w-6 h-6 border-4 border-white rounded-full shadow-md z-10 transform -translate-x-1/2 shrink-0 hidden md:block" style={{ backgroundColor: d.accent }} />
          <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
            <Link to={`/company/${company.id}`} className="group block">
              <div className="p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border overflow-hidden" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder, borderTopWidth: '4px', borderTopColor: 'transparent' }} onMouseOver={e => e.currentTarget.style.borderTopColor = d.accent} onMouseOut={e => e.currentTarget.style.borderTopColor = 'transparent'}>
                <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  <CompanyLogo company={adaptCompany(company, language)} className="w-16 h-16 text-base shadow-md shrink-0 rounded-lg" showText={false} />
                  <div className="overflow-hidden">
                    <h3 className="text-2xl font-bold heading-font truncate" style={{ color: d.heading }}>{language === 'ka' ? company.name_ka : company.name_en}</h3>
                    <span className="font-bold text-lg font-mono" style={{ color: d.accent }}>{company.founded_year}</span>
                  </div>
                </div>
                <p className="body-font mb-4 text-sm md:text-base line-clamp-3" style={{ color: d.textMuted }}>{language === 'ka' ? company.description_ka : company.description_en}</p>
                <div className={`inline-flex items-center font-bold text-sm uppercase tracking-wider transition-colors ${index % 2 === 0 ? 'float-right' : ''}`} style={{ color: d.accent }}>
                  {t('View Company')} <ArrowRight className="ml-2 w-4 h-4 shrink-0" />
                </div>
              </div>
            </Link>
          </div>
          <div className="w-full md:w-1/2" />
        </motion.div>
      ))}
    </div>
  </div>
);

/* ══════════ GRID LAYOUT ══════════ */
const GridLayout = ({ companies, d, language, t }) => (
  <div className="py-12 container mx-auto px-6">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {companies.map((company, idx) => (
        <motion.div key={company.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
          <Link to={`/company/${company.id}`} className="group block h-full">
            <div className="h-full p-6 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
              <div className="flex items-center gap-4 mb-4">
                <CompanyLogo company={adaptCompany(company, language)} className="w-14 h-14 text-sm shadow-sm shrink-0 rounded-xl" showText={false} />
                <div className="min-w-0">
                  <h3 className="text-xl font-bold heading-font truncate" style={{ color: d.heading }}>{language === 'ka' ? company.name_ka : company.name_en}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold" style={{ color: d.accent }}>{company.founded_year}</span>
                  </div>
                </div>
              </div>
              <p className="body-font text-sm line-clamp-3 flex-1" style={{ color: d.textMuted }}>{language === 'ka' ? company.description_ka : company.description_en}</p>
              <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${d.cardBorder}` }}>
                <span className="text-sm font-semibold uppercase tracking-wider transition-colors" style={{ color: d.accent }}>{t('View Company')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: d.accent }} />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ══════════ MASONRY LAYOUT ══════════ */
const MasonryLayout = ({ companies, d, language, t }) => (
  <div className="py-12 container mx-auto px-6">
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {companies.map((company, idx) => {
        const isLarge = idx % 3 === 0;
        return (
          <motion.div key={company.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="break-inside-avoid">
            <Link to={`/company/${company.id}`} className="group block">
              <div className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${isLarge ? 'p-8' : 'p-6'}`} style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
                <div className="flex items-start gap-4 mb-4">
                  <CompanyLogo company={adaptCompany(company, language)} className={`${isLarge ? 'w-16 h-16' : 'w-12 h-12'} text-sm shadow-sm shrink-0 rounded-xl`} showText={false} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: d.accent }}>{company.founded_year}</div>
                    <h3 className={`${isLarge ? 'text-2xl' : 'text-lg'} font-bold heading-font truncate`} style={{ color: d.heading }}>{language === 'ka' ? company.name_ka : company.name_en}</h3>
                  </div>
                </div>
                <p className={`body-font ${isLarge ? 'line-clamp-5 text-base' : 'line-clamp-3 text-sm'}`} style={{ color: d.textMuted }}>{language === 'ka' ? company.description_ka : company.description_en}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold" style={{ color: d.accent }}>
                  <span>{t('View Company')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const BODY_LAYOUTS = { timeline: TimelineLayout, grid: GridLayout, masonry: MasonryLayout };

const PortfolioPage = () => {
  const { t, language } = useLanguage();
  const { companies, loading, error, fetchCompanies } = useCompanies();
  const { content: c } = useSiteContent('portfolio_page');
  const lang = language === 'ka' ? 'ka' : 'en';
  const { getDesign, getLayout } = useDesign();
  const d = getDesign('page_portfolio');
  const layout = getLayout('page_portfolio');

  const sortedCompanies = [...companies].sort((a, b) => (a.founded_year || 0) - (b.founded_year || 0));

  const BodyLayout = BODY_LAYOUTS[layout] || TimelineLayout;

  return (
    <div style={{ backgroundColor: d.bg, minHeight: '100vh' }}>
      <PageHero d={d} c={c} lang={lang} t={t} />
      {loading ? <LoadingState /> : error ? <ErrorState fetchCompanies={fetchCompanies} /> : (
        <BodyLayout companies={sortedCompanies} d={d} language={language} t={t} />
      )}
    </div>
  );
};

export default PortfolioPage;

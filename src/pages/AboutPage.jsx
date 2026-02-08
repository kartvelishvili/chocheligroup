import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, TrendingUp, Globe, Users, ArrowRight } from 'lucide-react';
import Leadership from '@/components/Leadership';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useDesign } from '@/hooks/useDesign';

const ICON_MAP = { Shield, TrendingUp, Globe, Users };

/* ══════════ CLASSIC LAYOUT ══════════ */
const ClassicLayout = ({ d, c, lang, t, advantages }) => (
  <div style={{ backgroundColor: d.bg2 }}>
    {/* Hero */}
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: d.heroBg }}>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: d.accent, opacity: 0.08 }} />
      <div className="container mx-auto px-6 relative z-10">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold heading-font mb-6" style={{ color: d.heroText }}>
          {c?.[`hero_title_${lang}`] || t('About the Group')}
        </motion.h1>
        <p className="text-xl md:text-2xl max-w-3xl body-font font-light" style={{ color: d.heroText + 'CC' }}>
          {c?.[`hero_subtitle_${lang}`] || t({ en: 'Building the future of Georgian business through 30 years of disciplined execution and strategic vision.', ka: 'ქართული ბიზნესის მომავლის შენება 30 წლიანი დისციპლინირებული შესრულებითა და სტრატეგიული ხედვით.' })}
        </p>
      </div>
    </section>
    {/* Overview */}
    <section className="py-20" style={{ backgroundColor: d.bg }}>
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold heading-font mb-6" style={{ color: d.heading }}>{c?.[`overview_title_${lang}`] || t('Who We Are')}</h2>
        <p className="mb-6 text-lg leading-relaxed body-font" style={{ color: d.text }}>{c?.[`overview_p1_${lang}`] || t({ en: 'Chocheli Invest Group is a diversified investment holding company...', ka: 'ჩოჩელი ინვესტ გრუპი არის დივერსიფიცირებული საინვესტიციო ჰოლდინგი...' })}</p>
        <p className="text-lg leading-relaxed body-font" style={{ color: d.textMuted }}>{c?.[`overview_p2_${lang}`] || t({ en: 'Our philosophy is simple yet powerful...', ka: 'ჩვენი ფილოსოფია მარტივია, მაგრამ ძლიერი...' })}</p>
      </div>
    </section>
    <Leadership />
    {/* Advantages Grid */}
    <section className="py-20" style={{ backgroundColor: d.bg2 }}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold heading-font text-center mb-16" style={{ color: d.heading }}>{t('Execution DNA')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, idx) => {
            const AdvIcon = typeof adv.icon === 'string' ? ICON_MAP[adv.icon] : adv.icon;
            return (
              <motion.div key={idx} whileHover={{ y: -5 }} className="p-8 rounded-xl shadow-lg" style={{ backgroundColor: d.cardBg, borderBottom: `4px solid ${d.accent}` }}>
                {AdvIcon && <AdvIcon className="w-12 h-12 mb-6" style={{ color: d.accent }} />}
                <h3 className="text-xl font-bold mb-3 heading-font" style={{ color: d.heading }}>{adv[`title_${lang}`]}</h3>
                <p className="body-font" style={{ color: d.textMuted }}>{adv[`text_${lang}`]}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  </div>
);

/* ══════════ CARDS LAYOUT ══════════ */
const CardsLayout = ({ d, c, lang, t, advantages }) => (
  <div style={{ backgroundColor: d.bg }}>
    {/* Hero — gradient banner */}
    <section className="py-32 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${d.heroBg}, ${d.heroBg}DD)` }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top right, ${d.accent}15, transparent 60%)` }} />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-block px-5 py-2 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: d.accentBg, color: d.heroAccent, border: `1px solid ${d.heroAccent}30` }}>
          {t({ en: 'Est. 1993', ka: 'დაარსდა 1993' })}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold heading-font mb-6" style={{ color: d.heroText }}>
          {c?.[`hero_title_${lang}`] || t('About the Group')}
        </motion.h1>
        <p className="text-xl max-w-2xl mx-auto body-font" style={{ color: d.heroText + 'AA' }}>
          {c?.[`hero_subtitle_${lang}`] || t({ en: 'Building the future of Georgian business through 30 years of disciplined execution and strategic vision.', ka: 'ქართული ბიზნესის მომავლის შენება 30 წლიანი დისციპლინირებული შესრულებითა და სტრატეგიული ხედვით.' })}
        </p>
      </div>
    </section>
    {/* Info Cards */}
    <section className="py-20" style={{ backgroundColor: d.bg2 }}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto -mt-24 relative z-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-8 rounded-2xl shadow-xl backdrop-blur-sm border" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
            <h2 className="text-2xl font-bold heading-font mb-4" style={{ color: d.heading }}>{c?.[`overview_title_${lang}`] || t('Who We Are')}</h2>
            <p className="body-font leading-relaxed" style={{ color: d.text }}>{c?.[`overview_p1_${lang}`] || t({ en: 'Chocheli Invest Group is a diversified investment holding company...', ka: 'ჩოჩელი ინვესტ გრუპი არის დივერსიფიცირებული საინვესტიციო ჰოლდინგი...' })}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="p-8 rounded-2xl shadow-xl backdrop-blur-sm border" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
            <h2 className="text-2xl font-bold heading-font mb-4" style={{ color: d.heading }}>{t({ en: 'Our Philosophy', ka: 'ჩვენი ფილოსოფია' })}</h2>
            <p className="body-font leading-relaxed" style={{ color: d.text }}>{c?.[`overview_p2_${lang}`] || t({ en: 'Our philosophy is simple yet powerful...', ka: 'ჩვენი ფილოსოფია მარტივია, მაგრამ ძლიერი...' })}</p>
          </motion.div>
        </div>
      </div>
    </section>
    <Leadership />
    {/* Horizontal scroll advantages */}
    <section className="py-20" style={{ backgroundColor: d.bg }}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold heading-font text-center mb-4" style={{ color: d.heading }}>{t('Execution DNA')}</h2>
        <p className="text-center mb-12 body-font" style={{ color: d.textMuted }}>{t({ en: 'The pillars that drive our success', ka: 'პრინციპები, რომლებიც წარმატებას განაპირობებს' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {advantages.map((adv, idx) => {
            const AdvIcon = typeof adv.icon === 'string' ? ICON_MAP[adv.icon] : adv.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.02 }} className="flex items-start gap-5 p-6 rounded-2xl border transition-shadow hover:shadow-lg" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
                <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: d.accentBg }}>
                  {AdvIcon && <AdvIcon className="w-7 h-7" style={{ color: d.accent }} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold heading-font mb-1" style={{ color: d.heading }}>{adv[`title_${lang}`]}</h3>
                  <p className="body-font text-sm" style={{ color: d.textMuted }}>{adv[`text_${lang}`]}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  </div>
);

/* ══════════ SPLIT LAYOUT ══════════ */
const SplitLayout = ({ d, c, lang, t, advantages }) => (
  <div style={{ backgroundColor: d.bg }}>
    {/* Hero — full bleed with side accent */}
    <section className="min-h-[70vh] flex items-center relative overflow-hidden" style={{ backgroundColor: d.heroBg }}>
      <div className="absolute right-0 top-0 w-1/3 h-full" style={{ background: `linear-gradient(to left, ${d.accent}10, transparent)` }} />
      <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, ${d.accent}, ${d.accent}00)` }} />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="w-12 h-[2px]" style={{ backgroundColor: d.accent }} />
              <span className="text-sm heading-font tracking-widest uppercase" style={{ color: d.heroAccent }}>{t({ en: 'About Us', ka: 'ჩვენ შესახებ' })}</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold heading-font mb-6 leading-tight" style={{ color: d.heroText }}>
              {c?.[`hero_title_${lang}`] || t('About the Group')}
            </motion.h1>
            <p className="text-xl body-font leading-relaxed" style={{ color: d.heroText + 'BB' }}>
              {c?.[`hero_subtitle_${lang}`] || t({ en: 'Building the future of Georgian business through 30 years of disciplined execution and strategic vision.', ka: 'ქართული ბიზნესის მომავლის შენება 30 წლიანი დისციპლინირებული შესრულებითა და სტრატეგიული ხედვით.' })}
            </p>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {advantages.slice(0, 4).map((adv, idx) => {
              const AdvIcon = typeof adv.icon === 'string' ? ICON_MAP[adv.icon] : adv.icon;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.1 }} className="p-5 rounded-xl border backdrop-blur-sm" style={{ backgroundColor: `${d.heroBg}99`, borderColor: `${d.accent}20` }}>
                  {AdvIcon && <AdvIcon className="w-8 h-8 mb-3" style={{ color: d.heroAccent }} />}
                  <h4 className="font-bold text-sm heading-font" style={{ color: d.heroText }}>{adv[`title_${lang}`]}</h4>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
    {/* Content split */}
    <section className="py-20" style={{ backgroundColor: d.bg }}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <div className="sticky top-32">
              <h2 className="text-3xl font-bold heading-font mb-4" style={{ color: d.heading }}>{c?.[`overview_title_${lang}`] || t('Who We Are')}</h2>
              <div className="w-16 h-1 rounded mb-6" style={{ background: `linear-gradient(to right, ${d.accent}, ${d.accent2 || d.accent})` }} />
              <p className="body-font leading-relaxed" style={{ color: d.textMuted }}>{t({ en: '30+ years of shaping Georgian industry', ka: '30+ წელი ქართული ინდუსტრიის ფორმირებაში' })}</p>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <p className="text-lg body-font leading-relaxed" style={{ color: d.text }}>{c?.[`overview_p1_${lang}`] || t({ en: 'Chocheli Invest Group is a diversified investment holding company...', ka: 'ჩოჩელი ინვესტ გრუპი არის დივერსიფიცირებული საინვესტიციო ჰოლდინგი...' })}</p>
            <p className="text-lg body-font leading-relaxed" style={{ color: d.text }}>{c?.[`overview_p2_${lang}`] || t({ en: 'Our philosophy is simple yet powerful...', ka: 'ჩვენი ფილოსოფია მარტივია, მაგრამ ძლიერი...' })}</p>
          </div>
        </div>
      </div>
    </section>
    <Leadership />
    {/* Advantages */}
    <section className="py-20" style={{ backgroundColor: d.bg2 }}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold heading-font text-center mb-16" style={{ color: d.heading }}>{t('Execution DNA')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, idx) => {
            const AdvIcon = typeof adv.icon === 'string' ? ICON_MAP[adv.icon] : adv.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center p-8 rounded-2xl group hover:shadow-xl transition-all border" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110" style={{ backgroundColor: d.accentBg }}>
                  {AdvIcon && <AdvIcon className="w-8 h-8" style={{ color: d.accent }} />}
                </div>
                <h3 className="text-lg font-bold heading-font mb-2" style={{ color: d.heading }}>{adv[`title_${lang}`]}</h3>
                <p className="body-font text-sm" style={{ color: d.textMuted }}>{adv[`text_${lang}`]}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  </div>
);

const LAYOUTS = { classic: ClassicLayout, cards: CardsLayout, split: SplitLayout };

const AboutPage = () => {
  const { t, language } = useLanguage();
  const { content: c } = useSiteContent('about_page');
  const lang = language === 'ka' ? 'ka' : 'en';
  const { getDesign, getLayout } = useDesign();
  const d = getDesign('page_about');
  const layout = getLayout('page_about');

  const defaultAdvantages = [
    { icon: 'Shield', title_en: 'Operational Excellence', title_ka: 'ოპერაციული ბრწყინვალება', text_en: 'Rigorous discipline in execution and management.', text_ka: 'მკაცრი დისციპლინა შესრულებასა და მართვაში.' },
    { icon: 'TrendingUp', title_en: 'Sustainable Growth', title_ka: 'მდგრადი ზრდა', text_en: 'Focus on long-term value creation over short-term wins.', text_ka: 'ფოკუსირება გრძელვადიანი ღირებულების შექმნაზე.' },
    { icon: 'Globe', title_en: 'Global Standards', title_ka: 'გლობალური სტანდარტები', text_en: 'Bringing international best practices to local markets.', text_ka: 'საერთაშორისო საუკეთესო პრაქტიკის დანერგვა.' },
    { icon: 'Users', title_en: 'Family Values', title_ka: 'საოჯახო ღირებულებები', text_en: 'Strong governance rooted in trust and integrity.', text_ka: 'ნდობასა და კეთილსინდისიერებაზე დამყარებული მართვა.' }
  ];
  const advantages = c?.advantages || defaultAdvantages;
  const LayoutComponent = LAYOUTS[layout] || ClassicLayout;

  return <LayoutComponent d={d} c={c} lang={lang} t={t} advantages={advantages} />;
};

export default AboutPage;
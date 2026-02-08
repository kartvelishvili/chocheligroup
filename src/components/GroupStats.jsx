import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { Map, Globe2 } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

const ICON_MAP = { Map, Globe2 };

const GroupStats = () => {
  const { t, language } = useLanguage();
  const { content: c } = useSiteContent('group_stats');
  const { getDesign } = useDesign();
  const d = getDesign('stats');
  const lang = language === 'ka' ? 'ka' : 'en';

  const defaultStats = [
    { number: '30+', label_en: 'Years of Experience', label_ka: 'წლიანი გამოცდილება' },
    { number: '13', label_en: 'Companies in Portfolio', label_ka: 'კომპანია პორტფოლიოში' },
    { number: '#1', label_en: 'Retail Leader in Georgia', label_ka: 'რითეილის ლიდერი საქართველოში' },
    { icon: 'Map', label_en: 'Diverse Industries', label_ka: 'მრავალფეროვანი ინდუსტრიები' },
    { icon: 'Globe2', label_en: 'Global Partnerships', label_ka: 'გლობალური პარტნიორობა' }
  ];

  const stats = c?.stats || defaultStats;

  return (
    <section className="py-20 relative z-20 -mt-1" style={{ backgroundColor: d.bg }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${d.bg}, ${d.bg2 || d.bg}, #ffffff)` }} />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, index) => {
             const Icon = typeof stat.icon === 'string' ? ICON_MAP[stat.icon] : stat.icon;
             return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="backdrop-blur-md border p-6 md:p-8 rounded-2xl text-center flex flex-col items-center justify-center h-40 md:h-48 group transition-all duration-300"
                  style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}
                >
                  {Icon ? (
                    <div className="mb-4 group-hover:scale-110 transition-transform" style={{ color: d.accent }}>
                      <Icon size={40} strokeWidth={1.5} />
                    </div>
                  ) : (
                    <div className="text-4xl md:text-5xl font-bold text-white heading-font mb-2 group-hover:text-teal-300 transition-colors">
                      {stat.number}
                    </div>
                  )}
                  <div className="text-xs md:text-sm text-slate-400 body-font font-semibold uppercase tracking-wide group-hover:text-slate-300 transition-colors">
                    {stat[`label_${lang}`] || t(stat.label || stat.label_en || '')}
                  </div>
                </motion.div>
             );
          })}
        </div>
      </div>
    </section>
  );
};

export default GroupStats;
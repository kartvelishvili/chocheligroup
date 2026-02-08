import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

const FounderHighlight = () => {
  const { t, language } = useLanguage();
  const { getDesign } = useDesign();
  const d = getDesign('founder');
  const { content: c } = useSiteContent('founder_highlight');
  const lang = language === 'ka' ? 'ka' : 'en';

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: d.bg }}>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-teal-500/[0.04] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-bold tracking-widest uppercase text-xs mb-3 block" style={{ color: d.accent }}>
            {language === 'ka' ? 'ხელმძღვანელობა' : 'Leadership'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white heading-font">
            {t('Founder')}
          </h2>
        </motion.div>

        <div className="backdrop-blur-md border rounded-3xl overflow-hidden max-w-6xl mx-auto" style={{ backgroundColor: d.cardBg, borderColor: d.cardBorder }}>
           <div className="grid grid-cols-1 lg:grid-cols-2">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-80 lg:h-auto"
              >
                <img
                  src={c?.image_url || "https://i.postimg.cc/NjShFTxL/506854830-10013410878742299-1013126184738099367-n.jpg"}
                  alt={c?.[`name_${lang}`] || "Tsezar Chocheli"}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-transparent" style={{ background: `linear-gradient(to top, ${d.bg}, transparent)` }}></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-10 lg:p-14 flex flex-col justify-center"
              >
                <h3 className="text-3xl lg:text-4xl font-bold text-white heading-font mb-6">
                  {c?.[`name_${lang}`] || (language === 'ka' ? 'ცეზარ ჩოჩელი' : 'Tsezar Chocheli')}
                </h3>
                <div className="space-y-5 text-lg text-slate-400 body-font leading-relaxed mb-8">
                  <p>
                    {c?.[`bio_paragraph1_${lang}`] || t({
                      en: 'Tsezar Chocheli is the visionary founder of Chocheli Invest Group, bringing over three decades of entrepreneurial excellence and strategic execution to the Georgian business landscape.',
                      ka: 'ცეზარ ჩოჩელი არის ჩოჩელი ინვესტ გრუპის ხედვადი დამფუძნებელი, რომელიც მოაქვს სამი ათეული წლის მეწარმეობრივი ბრწყინვალება და სტრატეგიული შესრულება ქართულ ბიზნეს ლანდშაფტზე.'
                    })}
                  </p>
                  <p>
                    {c?.[`bio_paragraph2_${lang}`] || t({
                      en: 'Under his leadership, the group has built and scaled thirteen successful companies across manufacturing, retail, and distribution sectors, establishing itself as the #1 retail group in Georgia.',
                      ka: 'მისი ხელმძღვანელობის ქვეშ, ჯგუფმა ააშენა და განავითარა ცამეტი წარმატებული კომპანია წარმოების, საცალო ვაჭრობისა და დისტრიბუციის სექტორებში.'
                    })}
                  </p>
                </div>
                
                <Link to="/founder">
                  <button className="px-8 py-3.5 text-white font-bold rounded-full transition-all shadow-lg flex items-center gap-2 text-sm tracking-wide heading-font" style={{ backgroundImage: `linear-gradient(to right, ${d.gradientFrom}, ${d.gradientTo})`, boxShadow: `0 10px 25px -5px ${d.accent}40` }}>
                    {t("View Founder's Story")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </motion.div>

           </div>
        </div>
      </div>
    </section>
  );
};

export default FounderHighlight;
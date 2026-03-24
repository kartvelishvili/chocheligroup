import React from 'react';
import { motion } from 'framer-motion';
import { Factory, TrendingUp, Award, Shield, HeartHandshake as Handshake, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { useSiteContent } from '@/hooks/useSiteContent';

const ICON_MAP = { Factory, TrendingUp, Award, Shield, Handshake, Zap };

const ExecutionDNA = () => {
  const { t, language } = useLanguage();
  const { getDesign } = useDesign();
  const d = getDesign('principles');
  const { content: c } = useSiteContent('execution_dna');
  const lang = language === 'ka' ? 'ka' : 'en';

  const defaultCapabilities = [
    { icon: 'Factory', title_en: 'Greenfield Build-Outs', title_ka: 'ახალი საწარმოების აშენება', description_en: 'Factory & logistics infrastructure from ground up', description_ka: 'საწარმოო და ლოგისტიკური ინფრასტრუქტურა ნულიდან' },
    { icon: 'TrendingUp', title_en: 'Nationwide Rollout', title_ka: 'ქვეყნის მასშტაბით გაფართოება', description_en: 'Proven capability to scale operations nationally', description_ka: 'დადასტურებული შესაძლებლობა ოპერაციების მასშტაბირებისთვის' },
    { icon: 'Award', title_en: 'Global Competition', title_ka: 'გლობალური კონკურენცია', description_en: 'Successfully competing with international incumbents', description_ka: 'წარმატებული კონკურენცია საერთაშორისო ლიდერებთან' },
    { icon: 'Shield', title_en: 'Brand Control', title_ka: 'ბრენდის კონტროლი', description_en: 'Building and maintaining customer trust & brand equity', description_ka: 'მომხმარებელთა ნდობისა და ბრენდის აშენება' },
    { icon: 'Handshake', title_en: '30+ Years of Partnerships', title_ka: '30+ წლიანი პარტნიორობა', description_en: 'Long-standing relationships with international brands', description_ka: 'ხანგრძლივი ურთიერთობები საერთაშორისო ბრენდებთან' },
    { icon: 'Zap', title_en: 'Operational Excellence', title_ka: 'ოპერაციული ბრწყინვალება', description_en: 'Strong governance & stakeholder alignment', description_ka: 'ძლიერი მართვა და დაინტერესებულ მხარეთა თანხმობა' }
  ];

  const capabilities = c?.capabilities || defaultCapabilities;
  const sectionTitle = c?.[`section_title_${lang}`] || t('Core Execution Principles');

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: d.bg }}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-bold tracking-widest uppercase text-xs mb-3 block" style={{ color: d.accent }}>
            {language === 'ka' ? 'ჩვენი პრინციპები' : 'What Drives Us'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold heading-font" style={{ color: d.heading }}>
            {sectionTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => {
            const Icon = typeof capability.icon === 'string' ? ICON_MAP[capability.icon] : capability.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
              >
                <div className="flex items-start gap-5">
                   <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl text-teal-600 shrink-0 group-hover:from-teal-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300">
                     {Icon && <Icon className="w-7 h-7" />}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-[#0a1628] heading-font leading-tight mb-2">
                       {capability[`title_${lang}`] || t(capability.title)}
                     </h3>
                     <p className="text-slate-500 body-font leading-relaxed text-sm">
                       {capability[`description_${lang}`] || t(capability.description)}
                     </p>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExecutionDNA;
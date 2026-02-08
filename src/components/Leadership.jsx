import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/hooks/useSiteContent';

const Leadership = () => {
  const { t, language } = useLanguage();
  const { content: c } = useSiteContent('leadership');
  const lang = language === 'ka' ? 'ka' : 'en';

  const defaultMembers = [
    {
      name_en: 'Shalva Chocheli', name_ka: 'შალვა ჩოჩელი',
      role_en: 'Founder & Chairman', role_ka: 'დამფუძნებელი და თავმჯდომარე',
      image_url: 'https://i.postimg.cc/26DT3SSz/chocheli-shalva.jpg',
      bio_en: "The visionary founder behind Chocheli Invest Group. With over three decades of business leadership, Shalva has been instrumental in shaping Georgia's manufacturing and retail sectors. His strategic foresight transformed a single brewery into one of the country's largest diversified holding companies.",
      bio_ka: "ჩოჩელი ინვესტ გრუპის ვიზიონერი დამფუძნებელი. 30 წელზე მეტი ბიზნეს ლიდერობის გამოცდილებით, შალვამ გადამწყვეტი როლი ითამაშა საქართველოს წარმოებისა და საცალო ვაჭრობის სექტორების ჩამოყალიბებაში. მისმა სტრატეგიულმა ხედვამ ერთი ლუდსახარში ქვეყნის ერთ-ერთ უდიდეს დივერსიფიცირებულ ჰოლდინგად აქცია.",
      accent: 'bg-corporate-blue'
    },
    {
      name_en: 'Saba Chocheli', name_ka: 'საბა ჩოჩელი',
      role_en: 'Managing Partner', role_ka: 'მმართველი პარტნიორი',
      image_url: 'https://i.postimg.cc/5N6GBNpc/saba-chocheli.jpg',
      bio_en: "As Managing Partner, Saba drives the group's operational strategy and expansion initiatives. Focused on modernizing governance and exploring new market opportunities, he ensures the group maintains its competitive edge while adhering to international standards of excellence and sustainability.",
      bio_ka: "როგორც მმართველი პარტნიორი, საბა ხელმძღვანელობს ჯგუფის ოპერაციულ სტრატეგიასა და გაფართოების ინიციატივებს. მმართველობის მოდერნიზაციასა და ახალი საბაზრო შესაძლებლობების ათვისებაზე ფოკუსირებით, იგი უზრუნველყოფს ჯგუფის კონკურენტულ უპირატესობას და საერთაშორისო სტანდარტებთან შესაბამისობას.",
      accent: 'bg-corporate-yellow'
    }
  ];

  const members = c?.members || defaultMembers;
  const sectionTitle = c?.[`section_title_${lang}`] || t({ en: 'Leadership', ka: 'ხელმძღვანელობა' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-12 opacity-50 z-0" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-slate-900 heading-font mb-4">
            {sectionTitle}
          </h2>
          <div className="w-20 h-1 bg-corporate-blue mx-auto rounded-full" />
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20"
        >
          {members.map((member, idx) => (
          <motion.div key={idx} variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative mb-8 group">
              <div className={`absolute inset-0 ${idx === 0 ? 'bg-corporate-blue' : 'bg-corporate-yellow'} rounded-[2rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
              <div className="w-[200px] h-[200px] relative overflow-hidden rounded-[2rem] shadow-2xl border-4 border-white transform transition-transform duration-500 group-hover:-translate-y-2">
                <img 
                  src={member.image_url} 
                  alt={member[`name_${lang}`]}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 mb-2 heading-font">
              {member[`name_${lang}`]}
            </h3>
            <div className="inline-block bg-slate-100 px-4 py-1 rounded-full mb-6">
              <p className="text-corporate-blue font-bold uppercase tracking-wider text-xs body-font">
                {member[`role_${lang}`]}
              </p>
            </div>
            <p className="text-slate-600 leading-relaxed body-font text-lg font-light">
              {member[`bio_${lang}`]}
            </p>
          </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Leadership;
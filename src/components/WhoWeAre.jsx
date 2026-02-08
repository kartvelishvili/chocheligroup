import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDesign } from '@/hooks/useDesign';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const WhoWeAre = () => {
  const { t, language } = useLanguage();
  const { getDesign } = useDesign();
  const d = getDesign('about');
  const [content, setContent] = useState(null);
  
  const defaultContent = {
    title_en: 'Who We Are',
    title_ka: 'ჩვენს შესახებ',
    description_en: 'Chocheli Invest Group is a Georgian family-owned investment group with over three decades of proven execution in building and scaling businesses across diverse industries.',
    description_ka: 'ჩოჩელი ინვესტ გრუპი არის ქართული საოჯახო საინვესტიციო ჯგუფი, რომელსაც აქვს სამი ათეული წლის დადასტურებული გამოცდილება ბიზნესების აშენებასა და განვითარებაში.',
    content_en: 'Founded on principles of operational excellence and strategic vision, we have established ourselves as a leading force in manufacturing, retail, and distribution. Our portfolio encompasses thirteen successfully built and scaled companies.',
    content_ka: 'დაფუძნებული ოპერაციული ბრწყინვალებისა და სტრატეგიული ხედვის პრინციპებზე, ჩვენ დავმკვიდრდით წამყვან ძალად წარმოებაში, საცალო ვაჭრობასა და დისტრიბუციაში.'
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('who_we_are_content')
          .select('*')
          .single();
          
        if (data && !error) {
          setContent(data);
        }
      } catch (err) {
        console.error('Error loading Who We Are content:', err);
      }
    };
    
    fetchContent();
  }, []);

  const display = content || defaultContent;

  return (
    <section className="py-24 overflow-hidden" style={{ backgroundColor: d.bg }}>
      <div className="container mx-auto px-6">
         <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Text Content */}
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="lg:w-1/2"
            >
               <span className="font-bold tracking-widest uppercase text-xs mb-4 block" style={{ color: d.accent }}>
                  {language === 'ka' ? 'ჩვენს შესახებ' : 'About Us'}
               </span>
               <h2 className="text-4xl md:text-5xl font-bold heading-font mb-8 leading-tight" style={{ color: d.heading }}>
                  {language === 'ka' ? display.title_ka : display.title_en}
                  <span className="block w-16 h-1 rounded-full mt-4" style={{ backgroundImage: `linear-gradient(to right, ${d.gradientFrom}, ${d.gradientTo})` }}></span>
               </h2>
               
               <div className="space-y-6 text-lg text-slate-600 body-font leading-relaxed text-justify">
                  <p>
                    {language === 'ka' ? display.description_ka : display.description_en}
                  </p>
                  <p>
                    {language === 'ka' ? display.content_ka : display.content_en}
                  </p>
               </div>

               <Link to="/about" className="inline-flex items-center mt-8 px-6 py-3 text-white font-bold rounded-full transition-all heading-font text-sm gap-2 shadow-lg" style={{ backgroundColor: d.heading }}>
                  {t('Read More')} <ArrowRight className="w-4 h-4" />
               </Link>
            </motion.div>

            {/* Visual Content */}
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="lg:w-1/2 relative"
            >
               <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/20 to-transparent mix-blend-overlay z-10"></div>
                  <img 
                    src="https://i.postimg.cc/J4LDJGR0/A45CD3DA-B895-4DF5-906E-E09B253D7668.jpg" 
                     alt="Group Operations" 
                     className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  />
               </div>
               <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-500/15 rounded-full z-0 blur-2xl"></div>
               <div className="absolute -top-6 -left-6 w-40 h-40 bg-[#0a1628]/10 rounded-full z-0 blur-2xl"></div>
            </motion.div>

         </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
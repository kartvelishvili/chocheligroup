import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SubProjectCard = ({ project, index = 0 }) => {
  const { language } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full"
    >
      <div className="p-6 flex flex-col h-full">
         <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-lg bg-slate-50 border p-2 flex items-center justify-center shrink-0 overflow-hidden relative group">
               {project.logo_url ? (
                  <img src={project.logo_url} alt="logo" className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
               ) : (
                  <Award className="w-8 h-8 text-slate-300" />
               )}
            </div>
            {project.website_url && (
               <a 
                  href={project.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-corporate-blue transition-colors p-2 hover:bg-slate-50 rounded-full"
                  title="Visit Website"
               >
                  <ExternalLink className="w-5 h-5" />
               </a>
            )}
         </div>
         
         <div className="flex-grow">
             <h3 className="text-lg font-bold text-corporate-blue mb-2 line-clamp-1">
                {language === 'ka' ? project.name_ka : project.name_en}
             </h3>
             <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {language === 'ka' ? project.description_ka : project.description_en}
             </p>
         </div>

         {project.website_url && (
            <a 
               href={project.website_url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-sm font-semibold text-corporate-yellow hover:text-corporate-blue transition-colors flex items-center mt-auto pt-4 border-t border-slate-50"
            >
               <Globe className="w-4 h-4 mr-2" /> 
               {language === 'ka' ? 'ვებ-გვერდი' : 'Visit Website'}
            </a>
         )}
      </div>
    </motion.div>
  );
};

export default SubProjectCard;
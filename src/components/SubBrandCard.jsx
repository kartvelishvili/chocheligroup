import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SubBrandCard = ({ subBrand, index = 0 }) => {
  const { language } = useLanguage();

  const name = language === 'ka' ? subBrand.name_ka : subBrand.name_en;
  const description = language === 'ka' ? subBrand.description_ka : subBrand.description_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group"
    >
      <div className="relative h-48 bg-slate-50 flex items-center justify-center p-8 overflow-hidden">
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-corporate-blue/10 to-corporate-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {subBrand.logo_url ? (
          <img 
            src={subBrand.logo_url} 
            alt={name} 
            className="w-full h-full object-contain relative z-10 filter drop-shadow-md transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="text-2xl font-bold text-slate-300 relative z-10">{name}</div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-corporate-blue mb-3 group-hover:text-corporate-blue-light transition-colors">
          {name}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
          {description}
        </p>

        {subBrand.website_url && (
          <a 
            href={subBrand.website_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-corporate-blue hover:text-corporate-yellow transition-colors mt-auto group/link"
          >
            <Globe className="w-4 h-4 mr-2" />
            <span className="mr-1">{language === 'ka' ? 'ვებგვერდი' : 'Visit Website'}</span>
            <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default SubBrandCard;
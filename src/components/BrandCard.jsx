import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2 } from 'lucide-react';

const BrandCard = ({ brand, index = 0 }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const { 
    id, 
    name_ka, 
    name_en, 
    logo_url, 
    sub_brands, 
    founding_year 
  } = brand;

  const name = language === 'ka' ? name_ka : name_en;
  
  const handleClick = (e) => {
    // Navigate to the Company Detail Page instead of Brand Page
    navigate(`/company/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer border border-slate-100 flex flex-col h-full transition-all duration-300"
    >
      {/* Top Gradient Accent */}
      <div className="h-2 w-full bg-gradient-to-r from-[#1a3a52] to-[#F4C430]" />

      <div className="p-6 flex flex-col flex-grow overflow-hidden">
        {/* Main Brand Info */}
        <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 mb-4 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center p-3 shadow-inner group-hover:shadow-md transition-shadow duration-300 bg-white overflow-hidden shrink-0">
              {logo_url ? (
                  <img 
                      src={logo_url} 
                      alt={`${name} logo`} 
                      className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300 max-w-full max-h-full"
                      onError={(e) => { e.target.style.display='none'; }}
                  />
              ) : (
                  <Building2 className="w-1/2 h-1/2 text-slate-300" />
              )}
            </div>

            <h3 className="text-xl font-bold text-[#1a3a52] heading-font mb-1 group-hover:text-[#F4C430] transition-colors duration-300 truncate w-full px-2">
            {name}
            </h3>
            
            <p className="text-sm text-slate-400 font-medium mb-3 truncate w-full px-2">
            {language === 'ka' ? name_en : name_ka}
            </p>

            {founding_year && (
                <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 text-xs font-medium text-slate-500 whitespace-nowrap">
                <Calendar size={12} className="text-[#F4C430]" />
                <span>{founding_year}</span>
                </div>
            )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 mb-4 group-hover:bg-[#F4C430]/20 transition-colors duration-300" />

        {/* Sub-brands Section */}
        {sub_brands && sub_brands.length > 0 && (
            <div className="mt-auto w-full">
                <p className="text-xs text-center text-slate-400 mb-3 uppercase tracking-wider font-bold opacity-70 truncate">
                    {language === 'ka' ? 'შვილობილი ბრენდები' : 'Sub-brands'}
                </p>
                <div className="grid grid-cols-4 gap-2 justify-items-center">
                    {sub_brands.slice(0, 4).map((sb, idx) => (
                        <div key={idx} className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center hover:scale-110 hover:border-[#F4C430]/50 hover:bg-white transition-all duration-200 shadow-sm overflow-hidden shrink-0" title={language === 'ka' ? sb.name_ka : sb.name_en}>
                            {sb.logo_url ? (
                                <img src={sb.logo_url} alt="sub" className="w-full h-full object-contain opacity-90 hover:opacity-100 max-w-full max-h-full" />
                            ) : (
                                <Building2 className="w-2/3 h-2/3 text-slate-300" />
                            )}
                        </div>
                    ))}
                    {sub_brands.length > 4 && (
                         <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-[#F4C430] transition-colors overflow-hidden shrink-0">
                            +{sub_brands.length - 4}
                         </div>
                    )}
                </div>
            </div>
        )}
      </div>
      
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#F4C430]/10 to-transparent rounded-bl-full pointer-events-none group-hover:from-[#F4C430]/20 transition-all duration-300" />
    </motion.div>
  );
};

export default BrandCard;
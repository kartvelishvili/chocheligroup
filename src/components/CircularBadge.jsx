import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const CircularBadge = ({ logo, nameGE, nameEN }) => {
  const { language } = useLanguage();
  const name = language === 'ka' ? nameGE : nameEN;

  return (
    <div className="relative group flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#F4C430] shadow-lg group-hover:shadow-2xl overflow-hidden cursor-pointer bg-white"
      >
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </motion.div>
      
      {/* Tooltip / Label */}
      <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap">
        <span className="bg-[#1a3a52] text-white text-xs px-2 py-1 rounded shadow-md border border-[#F4C430]/30">
          {name}
        </span>
      </div>
    </div>
  );
};

export default CircularBadge;
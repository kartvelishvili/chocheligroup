import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const NewsCard = ({ news }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all h-full flex flex-col group">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${news.gradient || 'from-corporate-blue to-corporate-blue-light'} opacity-80 group-hover:scale-105 transition-transform duration-500`}></div>
        <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-corporate-blue shadow-sm uppercase">
          {t(news.category)}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{news.date}</span>
        </div>
        <h3 className="text-xl font-bold text-corporate-blue heading-font mb-3 line-clamp-2">
          {t(news.headline)}
        </h3>
        <p className="text-gray-600 body-font text-sm mb-4 line-clamp-3 flex-grow">
          {t(news.excerpt)}
        </p>
        <Link 
          to="#" 
          className="inline-flex items-center text-corporate-blue font-bold hover:text-corporate-yellow transition-colors mt-auto"
        >
          {t('Read More')} <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
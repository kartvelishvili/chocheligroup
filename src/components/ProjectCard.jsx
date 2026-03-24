import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProjectCard = ({ project }) => {
  const { t } = useLanguage();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Main Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.images[0]} 
          alt={t(project.title)} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-corporate-blue/90 via-transparent to-transparent opacity-60"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 bg-corporate-yellow text-corporate-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center">
          <Activity className="w-3 h-3 mr-1" />
          {t(project.status)}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Title & Location */}
        <div className="mb-4">
          <div className="flex items-center text-gray-500 text-xs mb-2 uppercase tracking-wide font-semibold">
            <MapPin className="w-3 h-3 mr-1 text-corporate-yellow" />
            {t(project.location)}
          </div>
          <h3 className="text-xl font-bold text-corporate-blue heading-font leading-tight group-hover:text-corporate-yellow transition-colors">
            {t(project.title)}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 body-font text-sm mb-6 line-clamp-3 flex-grow">
          {t(project.description)}
        </p>

        {/* Mini Gallery Preview */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {project.images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="h-12 rounded-md overflow-hidden bg-gray-100 relative">
               <img src={img} alt="thumbnail" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Action */}
        <Link 
          to={`/project/${project.id}`}
          className="inline-flex items-center justify-center w-full py-3 bg-gray-100 hover:bg-corporate-blue text-corporate-blue hover:text-white rounded-lg transition-all duration-300 font-bold text-sm uppercase tracking-wide"
        >
          {t('View Project')} <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
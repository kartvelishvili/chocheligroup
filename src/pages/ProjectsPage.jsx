
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { projects as staticProjects } from '@/data/projects';
import { MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectDetailModal from '@/components/ProjectDetailModal';
import { useSiteContent } from '@/hooks/useSiteContent';

const ProjectsPage = () => {
  const { t, language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { content: c } = useSiteContent('projects');
  const lang = language === 'ka' ? 'ka' : 'en';

  // Build projects from DB content or fallback to static
  const dbProjects = c?.items?.map(item => ({
    id: item.id,
    title: { en: item.title_en, ka: item.title_ka },
    description: { en: item.description_en, ka: item.description_ka },
    location: { en: item.location_en, ka: item.location_ka },
    status: item.status || 'ongoing',
    images: item.images || []
  }));
  
  const projects = dbProjects || staticProjects;

  // Preload images for smoother experience
  useEffect(() => {
    projects.forEach(project => {
      if (project.images?.[0]) {
        const img = new Image();
        img.src = project.images[0];
      }
    });
  }, []);

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>{t({ en: 'Projects - Chocheli Investment Group', ka: 'პროექტები - ჩოჩელი საინვესტიციო ჯგუფი' })}</title>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-corporate-blue py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-corporate-blue via-corporate-blue/95 to-corporate-blue/80"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white heading-font mb-6 leading-tight">
                {c?.[`hero_title_${lang}`] || t({ en: 'Building the Future', ka: 'მომავლის მშენებლობა' })}
              </h1>
              <p className="text-xl text-blue-100 body-font leading-relaxed max-w-2xl">
                {c?.[`hero_subtitle_${lang}`] || t({
                  en: 'From industrial complexes to modern commercial spaces, our projects reflect our commitment to innovation, quality, and sustainable development across the region.',
                  ka: 'ინდუსტრიული კომპლექსებიდან თანამედროვე კომერციულ სივრცეებამდე, ჩვენი პროექტები ასახავს ჩვენს ერთგულებას ინოვაციის, ხარისხისა და მდგრადი განვითარების მიმართ.'
                })}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                  <img 
                    src={project.images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'} 
                    alt={t(project.title)} 
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-white/95 backdrop-blur-sm text-corporate-blue text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      {t(project.status)}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1.5 text-corporate-yellow" />
                    {t(project.location)}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 heading-font mb-4 group-hover:text-corporate-blue transition-colors">
                    {t(project.title)}
                  </h3>
                  
                  <p className="text-gray-600 body-font line-clamp-3 mb-8 flex-grow">
                    {t(project.description)}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                    <button 
                      onClick={() => openProjectModal(project)}
                      className="text-gray-500 hover:text-corporate-blue font-medium text-sm transition-colors"
                    >
                      {t({ en: 'Quick View', ka: 'სწრაფი ნახვა' })}
                    </button>

                    <Link 
                      to={`/project/${project.id}`}
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 text-corporate-blue group-hover:bg-corporate-blue group-hover:text-white transition-all duration-300"
                      aria-label="View Details"
                    >
                      <ArrowUpRight className="w-5 h-5 transform group-hover:rotate-45 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProjectDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        project={selectedProject} 
      />
    </>
  );
};

export default ProjectsPage;

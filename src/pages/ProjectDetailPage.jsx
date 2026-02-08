
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, MapPin, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { projects } from '@/data/projects';
import ProjectImageGallery from '@/components/ProjectImageGallery';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
          <h2 className="text-2xl font-bold text-corporate-blue mb-4">
            {t({ en: 'Project Not Found', ka: 'პროექტი არ მოიძებნა' })}
          </h2>
          <p className="text-gray-600 mb-6">
            {t({ 
              en: "The project you are looking for doesn't exist or has been removed.", 
              ka: "პროექტი, რომელსაც ეძებთ, არ არსებობს ან წაშლილია." 
            })}
          </p>
          <button 
            onClick={() => navigate('/projects')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-corporate-blue hover:bg-blue-700 transition-colors"
          >
            {t({ en: 'Return to Projects', ka: 'პროექტებზე დაბრუნება' })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t(project.title)} - Chocheli Investment Group</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Breadcrumb / Back Navigation */}
          <nav className="mb-10">
            <Link 
              to="/projects"
              className="inline-flex items-center text-gray-500 hover:text-corporate-blue transition-colors group font-medium"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:bg-corporate-blue group-hover:text-white transition-all duration-300">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span>{t({ en: 'Back to Projects', ka: 'პროექტებზე დაბრუნება' })}</span>
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Header Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="bg-blue-50 text-corporate-blue px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center shadow-sm">
                      <Activity className="w-4 h-4 mr-2" />
                      {t(project.status)}
                    </span>
                    <span className="text-gray-500 text-sm font-medium flex items-center bg-gray-50 px-4 py-1.5 rounded-full">
                      <MapPin className="w-4 h-4 mr-2 text-corporate-yellow" />
                      {t(project.location)}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 heading-font mb-6 leading-tight">
                    {t(project.title)}
                  </h1>
                </div>

                {/* Gallery Section */}
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-10 overflow-hidden">
                  <ProjectImageGallery images={project.images} title={t(project.title)} />
                </div>

                {/* Detailed Description */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 heading-font">
                    {t({ en: 'Project Overview', ka: 'პროექტის მიმოხილვა' })}
                  </h3>
                  <div className="prose prose-lg text-gray-600 body-font max-w-none">
                    <p className="leading-relaxed">{t(project.description)}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar Information */}
            <div className="lg:col-span-4 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:sticky lg:top-32"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 uppercase tracking-wider">
                    {t({ en: 'Key Information', ka: 'ძირითადი ინფორმაცია' })}
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t({ en: 'Location', ka: 'მდებარეობა' })}</p>
                      <p className="font-semibold text-gray-900 text-lg">{t(project.location)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t({ en: 'Status', ka: 'სტატუსი' })}</p>
                      <p className="font-semibold text-corporate-blue text-lg capitalize">{t(project.status)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t({ en: 'Project Type', ka: 'პროექტის ტიპი' })}</p>
                      <p className="font-semibold text-gray-900 text-lg">
                        {t({ en: 'Infrastructure / Construction', ka: 'ინფრასტრუქტურა / მშენებლობა' })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4">
                      {t({ en: 'Interested in this project?', ka: 'დაინტერესებული ხართ ამ პროექტით?' })}
                    </h4>
                    <Link 
                      to="/contact" 
                      className="block w-full py-4 bg-corporate-blue hover:bg-blue-700 text-white text-center rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      {t({ en: 'Contact Us', ka: 'დაგვიკავშირდით' })}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailPage;

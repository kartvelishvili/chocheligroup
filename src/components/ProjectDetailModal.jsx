
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, Activity, Calendar } from 'lucide-react';
import ProjectImageGallery from './ProjectImageGallery';

const ProjectDetailModal = ({ isOpen, onClose, project }) => {
  const { t } = useLanguage();

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto p-0 gap-0 bg-white border-none rounded-xl">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section - Sticky on Desktop */}
          <div className="w-full lg:w-1/2 bg-gray-50 p-6 lg:p-8 lg:sticky lg:top-0 h-auto lg:h-full lg:overflow-y-auto">
            <ProjectImageGallery images={project.images} title={t(project.title)} />
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header Info */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-corporate-blue/5 text-corporate-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
                    <Activity className="w-3 h-3 mr-1" />
                    {t(project.status)}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {t(project.location)}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 heading-font mb-4">
                  {t(project.title)}
                </h2>
              </div>

              {/* Description */}
              <div className="prose prose-blue max-w-none text-gray-600 body-font mb-8 leading-relaxed">
                <p>{t(project.description)}</p>
              </div>

              {/* Project Stats (Mock Data for Visual) */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500 mb-1">Project Phase</p>
                  <p className="font-semibold text-gray-900">Construction</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500 mb-1">Year Started</p>
                  <p className="font-semibold text-gray-900">2023</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import CareerApplicationForm from '@/components/CareerApplicationForm';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Clock } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

const CareersPage = () => {
  const { t, language } = useLanguage();
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const { content: c } = useSiteContent('careers_page');
  const lang = language === 'ka' ? 'ka' : 'en';

  const defaultVacancies = [
    { id: 1, title: 'Senior Financial Analyst', company: 'Group HQ', location: 'Tbilisi', type: 'Full-time' },
    { id: 2, title: 'Sales Manager', company: 'Natakhtari', location: 'Mtskheta', type: 'Full-time' },
    { id: 3, title: 'Logistics Coordinator', company: 'Berta', location: 'Tbilisi', type: 'Shift' },
    { id: 4, title: 'Marketing Specialist', company: 'Barambo', location: 'Natakhtari', type: 'Full-time' },
  ];

  const vacancies = c?.vacancies || defaultVacancies;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-corporate-blue heading-font mb-8 text-center">
          {c?.[`page_title_${lang}`] || t('Careers')}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* List */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 heading-font">{c?.[`vacancies_title_${lang}`] || t('Open Vacancies')}</h2>
            <div className="space-y-4">
              {vacancies.map(vac => (
                <div 
                  key={vac.id} 
                  className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${selectedVacancy?.id === vac.id ? 'border-corporate-yellow bg-yellow-50' : 'border-gray-100 hover:border-gray-200'}`}
                  onClick={() => setSelectedVacancy(vac)}
                >
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-lg text-corporate-blue">{vac.title}</h3>
                     <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">{vac.company}</span>
                   </div>
                   <div className="flex gap-4 text-sm text-gray-500">
                     <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {vac.location}</span>
                     <span className="flex items-center"><Briefcase className="w-3 h-3 mr-1"/> {vac.type}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="sticky top-24 h-fit">
            <CareerApplicationForm 
               vacancy={selectedVacancy?.title} 
               company={selectedVacancy?.company} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
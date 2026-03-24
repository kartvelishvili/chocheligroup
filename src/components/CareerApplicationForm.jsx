import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CareerApplicationForm = ({ vacancy, company }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    position: vacancy || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Application Received",
      description: `Thank you, ${formData.name}. We have received your application for ${formData.position}.`,
    });
    setFormData({ name: '', email: '', phone: '', message: '', position: vacancy || '' });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-corporate-yellow">
      <h3 className="text-2xl font-bold text-corporate-blue heading-font mb-6">
        {t('Apply Now')}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Name')}</label>
          <input 
            type="text" 
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-blue focus:border-transparent outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Email')}</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-blue focus:border-transparent outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Phone')}</label>
            <input 
              type="tel" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-blue focus:border-transparent outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Position')}</label>
          <input 
            type="text" 
            readOnly={!!vacancy}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Cover Letter')}</label>
          <textarea 
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-blue focus:border-transparent outline-none"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Upload CV')}</label>
            <input 
                type="file" 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-corporate-blue/10 file:text-corporate-blue hover:file:bg-corporate-blue/20"
            />
        </div>
        <Button type="submit" className="w-full bg-corporate-blue hover:bg-corporate-blue-light text-white font-bold py-3 mt-4">
          {t('Submit')}
        </Button>
      </form>
    </div>
  );
};

export default CareerApplicationForm;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import CompanyForm from './CompanyForm';
import { supabase } from '@/lib/customSupabaseClient';

const CompanyModal = ({ isOpen, onClose, company = null, onCompanySaved }) => {
  const [subProjects, setSubProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     if (isOpen && company) {
        // Fetch sub-projects when opening in edit mode
        const fetchSubProjects = async () => {
           setLoading(true);
           const { data } = await supabase
              .from('sub_brands')
              .select('*')
              .eq('company_id', company.id)
              .order('order_position', { ascending: true });
           setSubProjects(data || []);
           setLoading(false);
        };
        fetchSubProjects();
     } else {
        setSubProjects([]);
     }
  }, [isOpen, company]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[95vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {company ? `Edit Company: ${company.name_en}` : 'Add New Company'}
          </DialogTitle>
           <DialogDescription>
            {company ? 'Update company details and sub-projects.' : 'Enter details for the new company.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-2">
          {!loading ? (
             <CompanyForm 
               company={company}
               initialSubProjects={subProjects}
               onSuccess={() => {
                 onCompanySaved();
                 onClose();
               }} 
               onCancel={onClose} 
             />
          ) : (
             <div className="py-20 text-center text-slate-400">Loading details...</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyModal;

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import BrandForm from './BrandForm';

const BrandModal = ({ isOpen, onClose, brand = null, onBrandSaved }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[95vh] overflow-y-auto p-0 gap-0 bg-white">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold">
            {brand ? `Edit Brand: ${brand.name_en}` : 'Add New Brand'}
          </DialogTitle>
           <DialogDescription>
            {brand ? 'Update brand details, logos, and sub-brands.' : 'Enter the details for the new brand below.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-2">
          <BrandForm 
            brand={brand} 
            onSuccess={() => {
              onBrandSaved();
              onClose();
            }} 
            onCancel={onClose} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrandModal;
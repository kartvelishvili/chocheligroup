
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, X, Image as ImageIcon, AlertCircle, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const BrandForm = ({ brand = null, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name_ka: '',
    name_en: '',
    founding_year: new Date().getFullYear(),
    logo_url: '',
    logo_path: '',
    description_ka: '',
    description_en: '',
    sub_brands: [] // Array of { name: '', logo_url: '' }
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        name_ka: brand.name_ka || '',
        name_en: brand.name_en || '',
        founding_year: brand.founding_year || new Date().getFullYear(),
        logo_url: brand.logo_url || '',
        logo_path: brand.logo_path || '',
        description_ka: brand.description_ka || '',
        description_en: brand.description_en || '',
        sub_brands: Array.isArray(brand.sub_brands) ? brand.sub_brands : []
      });
      setImagePreview(brand.logo_url);
      setImageError(false);
    } else {
      setImagePreview(null);
    }
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'founding_year' ? parseInt(value) || '' : value
    }));
    
    if (name === 'logo_url') {
      setImagePreview(value);
      setImageError(false);
      setImageFile(null); // Clear file if user manually types URL
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: "Image size must be less than 5MB", variant: "destructive" });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Sub-brand management
  const addSubBrand = () => {
    setFormData(prev => ({
      ...prev,
      sub_brands: [...prev.sub_brands, { name: '', logo_url: '' }]
    }));
  };

  const removeSubBrand = (index) => {
    setFormData(prev => ({
      ...prev,
      sub_brands: prev.sub_brands.filter((_, i) => i !== index)
    }));
  };

  const handleSubBrandChange = (index, field, value) => {
    const updatedSubBrands = [...formData.sub_brands];
    updatedSubBrands[index] = {
      ...updatedSubBrands[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, sub_brands: updatedSubBrands }));
  };

  const validate = () => {
    if (!formData.name_ka || !formData.name_en) {
      toast({ title: "Validation Error", description: "Brand names (KA & EN) are required", variant: "destructive" });
      return false;
    }
    if (!imagePreview && !formData.logo_url) {
      toast({ title: "Validation Error", description: "Logo is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let logoUrl = formData.logo_url;
      let logoPath = formData.logo_path;

      // Handle Image Upload
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = fileName;

        // Upload to 'brand-images' bucket
        const { error: uploadError } = await supabase.storage
          .from('brand-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type // Explicitly set content type
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('brand-images')
          .getPublicUrl(filePath);

        logoUrl = publicUrlData.publicUrl;
        logoPath = filePath;
      }

      const payload = { 
        ...formData,
        logo_url: logoUrl,
        logo_path: logoPath
      };
      
      let error;
      if (brand?.id) {
        // Edit mode
        const { error: updateError } = await supabase
          .from('brands')
          .update(payload)
          .eq('id', brand.id);
        error = updateError;
      } else {
        // Create mode
        const { error: insertError } = await supabase
          .from('brands')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: brand ? "Brand updated successfully" : "Brand created successfully",
        variant: "default",
        className: "bg-green-600 text-white border-none"
      });
      onSuccess();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save brand to database",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Section: Logo Preview & Basic Info */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo Preview Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center space-y-3">
          <div 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-slate-200 bg-white shadow-sm flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-blue-400 transition-colors"
            onClick={triggerFileInput}
          >
            {imagePreview && !imageError ? (
              <img 
                src={imagePreview} 
                alt="Logo Preview" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  setImageError(true);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="text-slate-300 flex flex-col items-center">
                <Upload size={32} />
                <span className="text-xs mt-1">Upload Logo</span>
              </div>
            )}
            
            {imageError && imagePreview && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-red-400">
                <AlertCircle size={24} />
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="text-white" size={24} />
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            onChange={handleImageFileChange}
          />

          <div className="w-full">
             <label className="text-xs font-semibold text-slate-500 mb-1 block">Or enter Logo URL</label>
             <Input 
                name="logo_url" 
                value={formData.logo_url} 
                onChange={handleChange} 
                placeholder="https://..."
                className="text-black text-xs"
              />
              {imageError && <p className="text-red-500 text-[10px] mt-1">Failed to load image</p>}
          </div>
        </div>

        {/* Basic Info Inputs */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name (Georgian)</label>
              <Input 
                name="name_ka" 
                value={formData.name_ka} 
                onChange={handleChange} 
                placeholder="ბრენდის სახელი"
                className="text-black font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name (English)</label>
              <Input 
                name="name_en" 
                value={formData.name_en} 
                onChange={handleChange} 
                placeholder="Brand Name"
                className="text-black font-medium"
              />
            </div>
          </div>
          
           <div className="space-y-2">
            <label className="text-sm font-medium">Founding Year</label>
            <Input 
              type="number"
              name="founding_year" 
              value={formData.founding_year} 
              onChange={handleChange}
              className="text-black"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="space-y-2">
              <label className="text-sm font-medium">Description (KA)</label>
              <textarea 
                name="description_ka"
                value={formData.description_ka}
                onChange={handleChange}
                className="w-full min-h-[60px] p-2 rounded-md border border-input bg-background text-sm text-black resize-y"
                placeholder="მოკლე აღწერა..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (EN)</label>
              <textarea 
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                className="w-full min-h-[60px] p-2 rounded-md border border-input bg-background text-sm text-black resize-y"
                placeholder="Short description..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-brands Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Sub-brands / Products</h3>
          <Button type="button" variant="outline" size="sm" onClick={addSubBrand} className="text-blue-600 border-blue-200 hover:bg-blue-50">
            <Plus className="w-4 h-4 mr-2" /> Add Sub-brand
          </Button>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {formData.sub_brands.map((sb, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded border flex-shrink-0 overflow-hidden">
                 {sb.logo_url ? (
                   <img src={sb.logo_url} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                 ) : (
                   <ImageIcon className="text-slate-200" size={20} />
                 )}
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                <Input 
                  placeholder="Sub-brand Name" 
                  value={sb.name}
                  onChange={(e) => handleSubBrandChange(index, 'name', e.target.value)}
                  className="text-black text-sm h-9"
                />
                <Input 
                  placeholder="Logo URL" 
                  value={sb.logo_url}
                  onChange={(e) => handleSubBrandChange(index, 'logo_url', e.target.value)}
                  className="text-black text-sm h-9"
                />
              </div>
              
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 self-end sm:self-center"
                onClick={() => removeSubBrand(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {formData.sub_brands.length === 0 && (
            <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-sm text-gray-500">No sub-brands added yet.</p>
              <Button type="button" variant="link" size="sm" onClick={addSubBrand} className="mt-1">
                Add your first sub-brand
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-4 sticky bottom-0 bg-white pb-2 z-10">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {brand ? 'Save Changes' : 'Create Brand'}
        </Button>
      </div>
    </form>
  );
};

export default BrandForm;

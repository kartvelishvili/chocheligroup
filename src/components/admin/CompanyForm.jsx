
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Image as ImageIcon, AlertCircle, Plus, Trash2, GripVertical, ExternalLink, Loader2, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Label } from '@/components/ui/label';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) return null;
  return <Droppable {...props}>{children}</Droppable>;
};

const CompanyForm = ({ company = null, initialSubProjects = [], onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  
  // Company Data State
  const [formData, setFormData] = useState({
    name_ka: '',
    name_en: '',
    industry: '',
    founded_year: new Date().getFullYear(),
    logo_url: '',
    website: '',
    project_detail_page_url: '',
    employees_count: '',
    description_ka: '',
    description_en: '',
    status: 'active',
    order_position: 0
  });

  // Sub Projects State
  const [subProjects, setSubProjects] = useState([]);
  const [deletedSubProjectIds, setDeletedSubProjectIds] = useState([]);

  useEffect(() => {
    if (company) {
      setFormData({
        name_ka: company.name_ka || '',
        name_en: company.name_en || '',
        industry: company.industry || '',
        founded_year: company.founded_year || new Date().getFullYear(),
        logo_url: company.logo_url || '',
        website: company.website || '',
        project_detail_page_url: company.project_detail_page_url || '',
        employees_count: company.employees_count || '',
        description_ka: company.description_ka || '',
        description_en: company.description_en || '',
        status: company.status || 'active',
        order_position: company.order_position || 0
      });
      setImageError(false);
    }
    if (initialSubProjects) {
       const sortedProjects = [...initialSubProjects].sort((a, b) => 
          (a.order_position || 0) - (b.order_position || 0)
       );
       setSubProjects(sortedProjects.map(sp => ({...sp, tempId: Math.random().toString(36)})));
    }
  }, [company, initialSubProjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'founded_year' || name === 'employees_count' || name === 'order_position') && value !== '' 
        ? parseInt(value) 
        : value
    }));
    
    if (name === 'logo_url') {
      setImageError(false);
    }
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size must be less than 2MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `company-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, logo_url: data.publicUrl }));
      setImageError(false);
      toast({ title: "Success", description: "Logo uploaded successfully" });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, logo_url: '' }));
  };

  // Sub Projects Management
  const addSubProject = () => {
     setSubProjects(prev => [...prev, {
        tempId: Math.random().toString(36),
        name_ka: '',
        name_en: '',
        description_ka: '',
        description_en: '',
        logo_url: '',
        website_url: '',
        order_position: prev.length
     }]);
  };

  const updateSubProject = (index, field, value) => {
     const updated = [...subProjects];
     updated[index][field] = value;
     setSubProjects(updated);
  };

  const removeSubProject = (index) => {
     const project = subProjects[index];
     if (project.id) {
        setDeletedSubProjectIds(prev => [...prev, project.id]);
     }
     const updated = subProjects.filter((_, i) => i !== index);
     setSubProjects(updated);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(subProjects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSubProjects(items);
  };

  const validate = () => {
    if (!formData.name_ka || !formData.name_en) {
      toast({ title: "Validation Error", description: "Company names (KA & EN) are required", variant: "destructive" });
      return false;
    }
    if (!formData.logo_url) {
      toast({ title: "Validation Error", description: "Logo is required", variant: "destructive" });
      return false;
    }
    if (!formData.industry) {
      toast({ title: "Validation Error", description: "Industry is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { ...formData };
      let companyId = company?.id;

      if (companyId) {
        const { error: updateError } = await supabase
          .from('companies')
          .update(payload)
          .eq('id', companyId);
        if (updateError) throw updateError;
      } else {
        const { data: newCompany, error: insertError } = await supabase
          .from('companies')
          .insert([payload])
          .select()
          .single();
        if (insertError) throw insertError;
        companyId = newCompany.id;
      }

      if (companyId) {
         if (deletedSubProjectIds.length > 0) {
            await supabase.from('sub_brands').delete().in('id', deletedSubProjectIds);
         }
         for (let i = 0; i < subProjects.length; i++) {
            const sp = subProjects[i];
            const spPayload = {
               company_id: companyId,
               name_ka: sp.name_ka,
               name_en: sp.name_en,
               description_ka: sp.description_ka,
               description_en: sp.description_en,
               logo_url: sp.logo_url,
               website_url: sp.website_url,
               order_position: i
            };

            if (sp.id) {
               await supabase.from('sub_brands').update(spPayload).eq('id', sp.id);
            } else {
               await supabase.from('sub_brands').insert([spPayload]);
            }
         }
      }

      toast({
        title: "Success",
        description: company ? "Company updated successfully" : "Company created successfully",
        className: "bg-green-600 text-white"
      });
      onSuccess();
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: "Error",
        description: "Failed to save company to database",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo Upload Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center space-y-3">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group hover:border-blue-500 transition-colors">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            ) : formData.logo_url && !imageError ? (
              <>
                <img 
                  src={formData.logo_url} 
                  alt="Logo Preview" 
                  className="w-full h-full object-contain p-2"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <button type="button" onClick={removeImage} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600">
                     <X size={16} />
                   </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-xs text-slate-500 font-medium">Upload Logo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>
          {imageError && <p className="text-red-500 text-xs">Failed to load image</p>}
        </div>

        {/* Basic Info Inputs */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name (Georgian) *</Label>
              <Input name="name_ka" value={formData.name_ka} onChange={handleChange} placeholder="კომპანიის სახელი" required />
            </div>
            <div className="space-y-2">
              <Label>Name (English) *</Label>
              <Input name="name_en" value={formData.name_en} onChange={handleChange} placeholder="Company Name" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Industry *</Label>
              <Input name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. Technology" required />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
              <Label>Founded Year</Label>
              <Input type="number" name="founded_year" value={formData.founded_year} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Employees</Label>
              <Input type="number" name="employees_count" value={formData.employees_count} onChange={handleChange} placeholder="0" />
            </div>
             <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" name="order_position" value={formData.order_position} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="space-y-2">
             <Label className="flex items-center gap-2">
               Project Detail Page URL <span className="text-xs font-normal text-slate-400">(Optional)</span>
             </Label>
             <div className="relative">
                <ExternalLink className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input name="project_detail_page_url" value={formData.project_detail_page_url} onChange={handleChange} placeholder="https://..." className="pl-9" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-200">
         <div className="space-y-2">
          <Label>Description (KA)</Label>
          <textarea 
            name="description_ka"
            value={formData.description_ka}
            onChange={handleChange}
            className="w-full min-h-[80px] p-2 rounded-md border border-input bg-background text-sm resize-y"
            placeholder="კომპანიის აღწერა..."
          />
        </div>
        <div className="space-y-2">
          <Label>Description (EN)</Label>
          <textarea 
            name="description_en"
            value={formData.description_en}
            onChange={handleChange}
            className="w-full min-h-[80px] p-2 rounded-md border border-input bg-background text-sm resize-y"
            placeholder="Company description..."
          />
        </div>
      </div>

      {/* Sub Projects Section */}
      <div className="pt-6 border-t border-slate-200">
         <div className="flex items-center justify-between mb-4">
            <Label className="text-lg font-bold text-slate-700">Sub-Projects</Label>
            <Button type="button" onClick={addSubProject} variant="outline" size="sm" className="gap-2">
               <Plus className="w-4 h-4" /> Add Project
            </Button>
         </div>
         
         <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="subProjectsList">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                   {subProjects.map((sp, index) => (
                      <Draggable key={sp.tempId || sp.id} draggableId={sp.tempId || String(sp.id)} index={index}>
                        {(provided, snapshot) => (
                            <div 
                               ref={provided.innerRef}
                               {...provided.draggableProps}
                               className={`p-4 bg-slate-50 border rounded-lg relative ${snapshot.isDragging ? "shadow-lg bg-white" : ""}`}
                            >
                               <div className="flex gap-4">
                                  <div {...provided.dragHandleProps} className="flex flex-col justify-center cursor-grab text-slate-400">
                                     <GripVertical size={20} />
                                  </div>
                                  <div className="flex-grow space-y-3">
                                     <div className="absolute top-2 right-2">
                                        <Button type="button" onClick={() => removeSubProject(index)} variant="ghost" size="sm" className="text-red-400 hover:text-red-600">
                                           <Trash2 className="w-4 h-4" />
                                        </Button>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                        <div>
                                           <Label className="text-xs">Name (EN)</Label>
                                           <Input value={sp.name_en} onChange={(e) => updateSubProject(index, 'name_en', e.target.value)} className="h-8 text-sm" />
                                        </div>
                                        <div>
                                           <Label className="text-xs">Name (KA)</Label>
                                           <Input value={sp.name_ka} onChange={(e) => updateSubProject(index, 'name_ka', e.target.value)} className="h-8 text-sm" />
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                        )}
                      </Draggable>
                   ))}
                   {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
         </DragDropContext>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-4 sticky bottom-0 bg-white pb-2 z-10">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {company ? 'Save Changes' : 'Create Company'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;

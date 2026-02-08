
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, X, FileImage as ImageIcon, Save } from 'lucide-react';

const NewsForm = ({ isOpen, onClose, newsItem, onSuccess, categories }) => {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title_ka: '',
    title_en: '',
    excerpt_ka: '',
    excerpt_en: '',
    content_ka: '',
    content_en: '',
    slug: '',
    status: 'draft',
    category_id: '',
    image_url: '',
    image_path: ''
  });

  // Reset or Load Data
  useEffect(() => {
    if (isOpen) {
      if (newsItem) {
        // EDIT MODE
        console.log("NewsForm opened in EDIT mode for ID:", newsItem.id);
        setFormData({
          title_ka: newsItem.title_ka || '',
          title_en: newsItem.title_en || '',
          excerpt_ka: newsItem.excerpt_ka || '',
          excerpt_en: newsItem.excerpt_en || '',
          content_ka: newsItem.content_ka || '',
          content_en: newsItem.content_en || '',
          slug: newsItem.slug || '',
          status: newsItem.published ? 'published' : 'draft',
          category_id: newsItem.category_id || '',
          image_url: newsItem.image_url || '',
          image_path: newsItem.image_path || ''
        });
        setPreviewUrl(newsItem.image_url || '');
      } else {
        // CREATE MODE
        console.log("NewsForm opened in CREATE mode");
        setFormData({
          title_ka: '',
          title_en: '',
          excerpt_ka: '',
          excerpt_en: '',
          content_ka: '',
          content_en: '',
          slug: '',
          status: 'draft',
          category_id: '',
          image_url: '',
          image_path: ''
        });
        setPreviewUrl('');
      }
      setImageFile(null);
      setUploading(false);
      setLoading(false);
    }
  }, [isOpen, newsItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Auto-generate slug from English title if creating new article or slug is empty
      if (name === 'title_en' && !newsItem) {
        newData.slug = value.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove non-word chars
          .replace(/\s+/g, '-')     // Replace spaces with dashes
          .replace(/^-+|-+$/g, ''); // Trim dashes
      }
      return newData;
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      toast({ 
        title: "Invalid File", 
        description: "Please select an image file (JPG, PNG, WebP).", 
        variant: "destructive" 
      });
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: "File Too Large", 
        description: "Image size must be less than 5MB.", 
        variant: "destructive" 
      });
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, image_url: '', image_path: '' }));
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      setUploading(true);
      console.log("Starting image upload...");
      const fileExt = imageFile.name.split('.').pop();
      const cleanFileName = imageFile.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${Date.now()}-${cleanFileName}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      console.log("Image uploaded successfully:", data.publicUrl);
      return {
        image_url: data.publicUrl,
        image_path: filePath
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({
        title: "Upload Failed",
        description: `Image upload failed: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { key: 'title_en', label: 'English Title' },
      { key: 'title_ka', label: 'Georgian Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'category_id', label: 'Category' },
      { key: 'excerpt_en', label: 'English Excerpt' },
      { key: 'excerpt_ka', label: 'Georgian Excerpt' }
    ];

    for (const field of requiredFields) {
      if (!formData[field.key]) {
        toast({
          title: "Validation Error",
          description: `${field.label} is required.`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    console.log("--- STARTING FORM SUBMISSION ---");
    
    try {
      let imageData = {
        image_url: formData.image_url,
        image_path: formData.image_path
      };

      if (imageFile) {
        imageData = await uploadImage();
      }

      const payload = {
        title_ka: formData.title_ka,
        title_en: formData.title_en,
        excerpt_ka: formData.excerpt_ka,
        excerpt_en: formData.excerpt_en,
        content_ka: formData.content_ka,
        content_en: formData.content_en,
        slug: formData.slug,
        category_id: formData.category_id,
        published: formData.status === 'published',
        image_url: imageData.image_url || null,
        image_path: imageData.image_path || null,
        updated_at: new Date().toISOString()
      };

      let result;
      let error;

      if (newsItem?.id) {
        // UPDATE
        console.log("Executing UPDATE for ID:", newsItem.id);
        console.log("Payload:", payload);

        const response = await supabase
          .from('news')
          .update(payload)
          .eq('id', newsItem.id)
          .select();
        
        result = response.data;
        error = response.error;

        console.log("Update Response:", { data: result, error });
      } else {
        // INSERT
        console.log("Executing INSERT");
        console.log("Payload:", payload);

        const response = await supabase
          .from('news')
          .insert([payload])
          .select();
          
        result = response.data;
        error = response.error;

        console.log("Insert Response:", { data: result, error });
      }

      if (error) {
        console.error("Supabase Database Error:", error);
        throw error;
      }

      console.log("Operation Successful!", result);
      
      toast({
        title: "Success",
        description: newsItem ? "Article updated successfully" : "Article created successfully",
        className: "bg-green-600 text-white"
      });

      if (onSuccess) onSuccess();
      onClose();

    } catch (error) {
      console.error('Failed to save news:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save article. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log("--- SUBMISSION END ---");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[95vh] overflow-y-auto bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{newsItem ? 'Edit Article' : 'New Article'}</DialogTitle>
          <DialogDescription>
            {newsItem ? 'Modify existing article details.' : 'Create a new news article or press release.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="title_en">Title (English) *</Label>
                 <Input id="title_en" name="title_en" value={formData.title_en} onChange={handleInputChange} required placeholder="Article Title" />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="title_ka">Title (Georgian) *</Label>
                 <Input id="title_ka" name="title_ka" value={formData.title_ka} onChange={handleInputChange} required placeholder="სტატიის სათაური" />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="slug">Slug *</Label>
                 <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} required placeholder="article-slug" className="font-mono text-sm bg-slate-50" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="category_id">Category *</Label>
                   <Select value={formData.category_id} onValueChange={(v) => setFormData(p => ({...p, category_id: v}))}>
                     <SelectTrigger id="category_id"><SelectValue placeholder="Select" /></SelectTrigger>
                     <SelectContent>
                       {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name_en} / {c.name_ka}</SelectItem>)}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="status">Status</Label>
                   <Select value={formData.status} onValueChange={(v) => setFormData(p => ({...p, status: v}))}>
                     <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="draft">Draft</SelectItem>
                       <SelectItem value="published">Published</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
              <Label>Featured Image</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl min-h-[220px] flex flex-col items-center justify-center p-4 relative group hover:border-blue-400 transition-colors bg-slate-50">
                 {uploading ? (
                   <div className="flex flex-col items-center gap-2">
                     <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                     <span className="text-sm text-slate-500">Uploading image...</span>
                   </div>
                 ) : previewUrl ? (
                   <>
                     <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                     <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm border border-slate-200" title="Remove image">
                       <X size={16} />
                     </button>
                   </>
                 ) : (
                   <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center p-6">
                     <ImageIcon size={32} className="text-slate-300 mb-2 group-hover:text-blue-400 transition-colors" />
                     <span className="text-sm font-medium text-slate-600">Click to upload image</span>
                     <span className="text-xs text-slate-400 mt-1">Max 5MB (JPG, PNG, WebP)</span>
                     <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                   </label>
                 )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <Label htmlFor="excerpt_en">Excerpt (English) *</Label>
               <Textarea id="excerpt_en" name="excerpt_en" value={formData.excerpt_en} onChange={handleInputChange} rows={3} placeholder="Short summary displayed on cards..." />
             </div>
             <div className="space-y-2">
               <Label htmlFor="excerpt_ka">Excerpt (Georgian) *</Label>
               <Textarea id="excerpt_ka" name="excerpt_ka" value={formData.excerpt_ka} onChange={handleInputChange} rows={3} placeholder="მოკლე აღწერა..." />
             </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="content_en">Content (English)</Label>
             <Textarea id="content_en" name="content_en" value={formData.content_en} onChange={handleInputChange} rows={8} className="font-sans" placeholder="Full article content..." />
          </div>

          <div className="space-y-2">
             <Label htmlFor="content_ka">Content (Georgian)</Label>
             <Textarea id="content_ka" name="content_ka" value={formData.content_ka} onChange={handleInputChange} rows={8} className="font-sans" placeholder="სრული სტატია..." />
          </div>

          <DialogFooter className="sticky bottom-0 bg-white py-4 border-t border-slate-100 mt-6 z-10 gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploading ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Article
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsForm;

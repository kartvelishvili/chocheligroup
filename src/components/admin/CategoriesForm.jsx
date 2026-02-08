
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const CategoriesForm = ({ isOpen, onClose, category, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_ka: '',
    name_en: '',
    slug: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name_ka: category.name_ka || '',
        name_en: category.name_en || '',
        slug: category.slug || '',
        is_active: category.is_active ?? true,
        sort_order: category.sort_order || 0
      });
    } else {
      setFormData({
        name_ka: '',
        name_en: '',
        slug: '',
        is_active: true,
        sort_order: 0
      });
    }
  }, [category, isOpen]);

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'name_ka' && !category) {
        // Simple slug generation
        newData.slug = value.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        name_ka: formData.name_ka,
        name_en: formData.name_en,
        slug: formData.slug,
        is_active: formData.is_active,
        sort_order: parseInt(formData.sort_order) || 0 // Ensure fallback to 0 if NaN
      };

      let error;
      if (category?.id) {
        const { error: updateError } = await supabase
          .from('news_categories')
          .update(dataToSave)
          .eq('id', category.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('news_categories')
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Category ${category ? 'updated' : 'created'} successfully.`,
        className: "bg-green-600 text-white"
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving category:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to save category.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category?.id || !confirm('Are you sure you want to delete this category?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('news_categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Category deleted successfully.",
        className: "bg-red-600 text-white"
      });
      onSuccess();
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Create Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_ka">Name (KA) *</Label>
              <Input
                id="name_ka"
                name="name_ka"
                value={formData.name_ka}
                onChange={handleNameChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en">Name (EN) *</Label>
              <Input
                id="name_en"
                name="name_en"
                value={formData.name_en}
                onChange={handleNameChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center sm:justify-between w-full mt-4">
            {category && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesForm;

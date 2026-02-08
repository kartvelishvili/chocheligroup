
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const MenuForm = ({ isOpen, onClose, item, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    label_ka: '',
    label_en: '',
    path: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    if (item) {
      setFormData({
        label_ka: item.label_ka || '',
        label_en: item.label_en || '',
        path: item.path || '',
        is_active: item.is_active ?? true,
        sort_order: item.sort_order || 0
      });
    } else {
      setFormData({
        label_ka: '',
        label_en: '',
        path: '',
        is_active: true,
        sort_order: 0
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        label_ka: formData.label_ka,
        label_en: formData.label_en,
        path: formData.path,
        is_active: formData.is_active,
        sort_order: parseInt(formData.sort_order)
      };

      let error;
      if (item?.id) {
        const { error: updateError } = await supabase
          .from('menu_items')
          .update(dataToSave)
          .eq('id', item.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('menu_items')
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Menu item ${item ? 'updated' : 'created'} successfully.`,
        className: "bg-green-600 text-white"
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving menu item:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to save menu item.",
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
          <DialogTitle>{item ? 'Edit Menu Item' : 'Create Menu Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label_ka">Label (KA) *</Label>
              <Input
                id="label_ka"
                name="label_ka"
                value={formData.label_ka}
                onChange={(e) => setFormData(prev => ({ ...prev, label_ka: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label_en">Label (EN) *</Label>
              <Input
                id="label_en"
                name="label_en"
                value={formData.label_en}
                onChange={(e) => setFormData(prev => ({ ...prev, label_en: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">Path * (e.g., /about)</Label>
            <Input
              id="path"
              name="path"
              value={formData.path}
              onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
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

          <DialogFooter className="flex justify-end gap-2 w-full mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuForm;

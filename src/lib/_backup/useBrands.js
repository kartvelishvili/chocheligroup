import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      // Fetch brands with their sub_brands
      const { data, error } = await supabase
        .from('brands')
        .select('*, sub_brands(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrands(data || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to load brands",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addBrand = async (brandData) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert([brandData])
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Brand created successfully",
        className: "bg-green-600 text-white border-none"
      });
      return data;
    } catch (err) {
      console.error('Error adding brand:', err);
      toast({
        title: "Error",
        description: "Failed to create brand",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateBrand = async (id, brandData) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .update(brandData)
        .eq('id', id)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand updated successfully",
        className: "bg-green-600 text-white border-none"
      });
      return data;
    } catch (err) {
      console.error('Error updating brand:', err);
      toast({
        title: "Error",
        description: "Failed to update brand",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteBrand = async (id) => {
    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand deleted successfully",
        className: "bg-green-600 text-white border-none"
      });
    } catch (err) {
      console.error('Error deleting brand:', err);
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchBrands();

    const channel = supabase
      .channel('public:brands')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, () => {
        fetchBrands();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sub_brands' }, () => {
        // Refresh if sub_brands change too, to keep nested data fresh
        fetchBrands();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    brands,
    loading,
    error,
    fetchBrands,
    addBrand,
    updateBrand,
    deleteBrand
  };
};
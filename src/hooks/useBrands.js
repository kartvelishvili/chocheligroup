import { useState, useEffect } from 'react';
import { brandsApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/use-toast';

export const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await brandsApi.getAll();
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
      const data = await brandsApi.create(brandData);
      fetchBrands();
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
      const data = await brandsApi.update(id, brandData);
      fetchBrands();
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
      await brandsApi.delete(id);
      fetchBrands();
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
    const interval = setInterval(fetchBrands, 30000);
    return () => clearInterval(interval);
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
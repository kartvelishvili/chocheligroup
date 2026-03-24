import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching companies with sub-brands...');
      // Fetch companies and their associated brands AND sub_brands (projects)
      // Sorted by order_position ascending
      const { data, error } = await supabase
        .from('companies')
        .select('*, brands(*), sub_brands(*)') 
        .order('order_position', { ascending: true });

      if (error) throw error;
      
      // Post-process to sort sub_brands by order_position
      const processedData = data ? data.map(company => ({
        ...company,
        sub_brands: company.sub_brands 
          ? [...company.sub_brands].sort((a, b) => (a.order_position || 0) - (b.order_position || 0))
          : []
      })) : [];

      console.log('Fetched companies:', processedData);
      setCompanies(processedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to load companies. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addCompany = async (companyData) => {
    try {
      // Get max order position to append to end
      const { data: maxData } = await supabase
        .from('companies')
        .select('order_position')
        .order('order_position', { ascending: false })
        .limit(1);
        
      const nextPosition = maxData && maxData.length > 0 ? (maxData[0].order_position || 0) + 1 : 0;

      const { data, error } = await supabase
        .from('companies')
        .insert([{ ...companyData, order_position: nextPosition }])
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Company created successfully",
        className: "bg-green-600 text-white border-none"
      });
      fetchCompanies(); // Refresh list
      return data;
    } catch (err) {
      console.error('Error adding company:', err);
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateCompany = async (id, companyData) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', id)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company updated successfully",
        className: "bg-green-600 text-white border-none"
      });
      fetchCompanies(); // Refresh list
      return data;
    } catch (err) {
      console.error('Error updating company:', err);
      toast({
        title: "Error",
        description: "Failed to update company",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateCompanyOrder = async (companyId, newPosition) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ order_position: newPosition })
        .eq('id', companyId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating company order:', err);
      throw err;
    }
  };

  const deleteCompany = async (id) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company deleted successfully",
        className: "bg-green-600 text-white border-none"
      });
      fetchCompanies(); // Refresh list
    } catch (err) {
      console.error('Error deleting company:', err);
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCompanies();

    const channel = supabase
      .channel('public:companies_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, (payload) => {
        console.log('Real-time update received:', payload);
        fetchCompanies();
      })
      .subscribe();

    return () => {
      console.log('Cleaning up companies subscription');
      supabase.removeChannel(channel);
    };
  }, [fetchCompanies]);

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    addCompany,
    updateCompany,
    updateCompanyOrder,
    deleteCompany
  };
};
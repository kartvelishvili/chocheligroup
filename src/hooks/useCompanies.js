import { useState, useEffect, useCallback, useRef } from 'react';
import { companiesApi } from '@/lib/apiClient';
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
      const data = await companiesApi.getAll();
      
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
      const data = await companiesApi.create(companyData);
      
      toast({
        title: "Success",
        description: "Company created successfully",
        className: "bg-green-600 text-white border-none"
      });
      fetchCompanies();
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
      const data = await companiesApi.update(id, companyData);

      toast({
        title: "Success",
        description: "Company updated successfully",
        className: "bg-green-600 text-white border-none"
      });
      fetchCompanies();
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
      await companiesApi.updateOrder(companyId, newPosition);
      return true;
    } catch (err) {
      console.error('Error updating company order:', err);
      throw err;
    }
  };

  const deleteCompany = async (id) => {
    try {
      await companiesApi.delete(id);

      toast({
        title: "Success",
        description: "Company deleted successfully",
        className: "bg-green-600 text-white border-none"
      });
      fetchCompanies();
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

  const intervalRef = useRef(null);

  useEffect(() => {
    fetchCompanies();

    // Poll every 30s instead of Supabase realtime
    intervalRef.current = setInterval(fetchCompanies, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
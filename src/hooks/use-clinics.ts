
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClinicQuery = () => {
  return useQuery({
    queryKey: ['clinics'],
    queryFn: async () => {
      console.log('Fetching clinics list');
      const { data, error } = await supabase
        .from('clinics')
        .select('id, name, status')
        .order('name');
        
      if (error) {
        console.error('Error fetching clinics:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 60000, // 1 minute
  });
};

export const useClinicDetailsQuery = (clinicId?: string) => {
  return useQuery({
    queryKey: ['clinic', clinicId],
    queryFn: async () => {
      if (!clinicId) throw new Error('No clinic ID provided');
      
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', clinicId)
        .single();
        
      if (error) {
        console.error(`Error fetching clinic ${clinicId}:`, error);
        throw error;
      }
      
      return data;
    },
    enabled: !!clinicId,
  });
};

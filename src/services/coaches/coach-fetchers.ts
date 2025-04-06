
import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';

/**
 * Fetches all coaches for administrative purposes
 */
export const getAllCoachesForAdmin = async (): Promise<Coach[]> => {
  console.log("Fetching all coaches for admin");
  
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error("Error fetching coaches:", error);
    throw new Error(`Failed to fetch coaches: ${error.message}`);
  }
  
  return data || [];
};

/**
 * Fetches coaches for a specific clinic
 */
export const getClinicCoaches = async (clinicId: string): Promise<Coach[]> => {
  console.log(`Fetching coaches for clinic: ${clinicId}`);
  
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('status', 'active')
    .order('name', { ascending: true });
  
  if (error) {
    console.error(`Error fetching coaches for clinic ${clinicId}:`, error);
    throw new Error(`Failed to fetch coaches: ${error.message}`);
  }
  
  console.log(`Found ${data?.length || 0} coaches for clinic ${clinicId}`);
  return data || [];
};

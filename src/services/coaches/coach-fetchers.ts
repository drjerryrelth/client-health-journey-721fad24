
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkAuthentication } from '../clinics/auth-helper';
import { Coach } from './types';
import { getMockCoaches } from './mock-data';

/**
 * Fetches coaches for a specific clinic
 */
export async function getClinicCoaches(clinicId: string): Promise<Coach[]> {
  try {
    console.log('Fetching coaches for clinic:', clinicId);
    
    // Check authentication before proceeding
    const session = await checkAuthentication();
    if (!session) {
      console.error('User not authenticated');
      throw new Error('Authentication required to fetch coaches');
    }
    
    // Use RPC call to bypass RLS issues
    const { data, error } = await supabase.rpc(
      'get_clinic_coaches' as any, 
      { clinic_id_param: clinicId }
    );

    if (error) {
      console.error('Error fetching coaches:', error);
      throw error;
    }
    
    console.log('Fetched coaches data from RPC:', data);
    
    if (!Array.isArray(data)) {
      console.error('Invalid data format, expected array:', data);
      throw new Error('Invalid data format returned from server');
    }
    
    // Transform and return the coaches data
    return data.map(coach => ({
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      status: coach.status as 'active' | 'inactive',
      clinicId: coach.clinic_id,
      clients: coach.client_count || 0
    }));
  } catch (error) {
    console.error('Error fetching clinic coaches:', error);
    toast.error('Failed to fetch coaches. Using mock data as fallback.');
    // Return mock data as fallback
    return getMockCoaches().filter(coach => coach.clinicId === clinicId);
  }
}

/**
 * Fetches all coaches across all clinics (admin only)
 */
export async function getAllCoaches(): Promise<Coach[]> {
  try {
    console.log('Fetching all coaches across clinics');
    
    // Check authentication before proceeding
    const session = await checkAuthentication();
    if (!session) {
      console.error('User not authenticated');
      throw new Error('Authentication required to fetch coaches');
    }
    
    // Get the auth token
    const authToken = session.access_token;
    
    console.log('Using auth token for coaches request:', authToken ? 'Token available' : 'Token missing');
    
    // Use Edge Function to fetch all coaches (admin only)
    const { data, error } = await supabase.functions.invoke('get-all-coaches', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    if (error) {
      console.error('Error fetching all coaches:', error);
      throw error;
    }
    
    console.log('Fetched coaches data:', data);
    
    if (!Array.isArray(data)) {
      console.error('Invalid data format, expected array:', data);
      // Fall back to mock data if we can't get data from the server
      return getMockCoaches();
    }
    
    // Transform and return the coaches data
    return data.map(coach => ({
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone || null,
      status: coach.status as 'active' | 'inactive',
      clinicId: coach.clinic_id,
      clients: coach.client_count || 0
    }));
  } catch (error) {
    console.error('Error fetching all coaches:', error);
    toast.error('Failed to fetch coaches. Using mock data as fallback.');
    // Return mock data as fallback
    return getMockCoaches();
  }
}

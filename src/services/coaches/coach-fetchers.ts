
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
    console.log('[CoachService] Fetching coaches for clinic:', clinicId);
    
    // Check authentication before proceeding
    const session = await checkAuthentication();
    if (!session) {
      console.error('[CoachService] User not authenticated');
      throw new Error('Authentication required to fetch coaches');
    }
    
    console.log('[CoachService] Authentication verified, user:', session.user.id);
    
    // Use RPC call to bypass RLS issues
    const { data, error } = await supabase.rpc(
      'get_clinic_coaches' as any, 
      { clinic_id_param: clinicId }
    );

    if (error) {
      console.error('[CoachService] Error fetching coaches:', error);
      throw error;
    }
    
    console.log('[CoachService] Fetched coaches data from RPC:', data);
    
    if (!Array.isArray(data)) {
      console.error('[CoachService] Invalid data format, expected array:', data);
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
    console.error('[CoachService] Error fetching clinic coaches:', error);
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
    console.log('[CoachService] Starting getAllCoaches call');
    
    // Check authentication before proceeding
    const session = await checkAuthentication();
    if (!session) {
      console.error('[CoachService] User not authenticated');
      throw new Error('Authentication required to fetch coaches');
    }
    
    // Get the auth token
    const authToken = session.access_token;
    
    console.log('[CoachService] Using auth token for coaches request:', authToken ? 'Token available' : 'Token missing');
    
    if (!authToken) {
      console.error('[CoachService] Auth token is missing or invalid');
      throw new Error('Valid authentication token required');
    }

    // Use Edge Function to fetch all coaches (admin only)
    console.log('[CoachService] Calling get-all-coaches edge function');
    const { data, error } = await supabase.functions.invoke('get-all-coaches', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    if (error) {
      console.error('[CoachService] Error from edge function:', error);
      throw error;
    }
    
    console.log('[CoachService] Edge function response:', data);
    
    if (!data) {
      console.error('[CoachService] Edge function returned no data');
      throw new Error('No data received from server');
    }

    if (!Array.isArray(data)) {
      console.error('[CoachService] Invalid data format, expected array:', data);
      // Fall back to mock data if we can't get data from the server
      toast.warning('Invalid data format from server. Using mock data.');
      return getMockCoaches();
    }
    
    // Transform and return the coaches data
    const coaches = data.map(coach => ({
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone || null,
      status: coach.status as 'active' | 'inactive',
      clinicId: coach.clinic_id,
      clients: coach.client_count || 0
    }));
    
    console.log('[CoachService] Transformed coaches data:', coaches);
    return coaches;
  } catch (error) {
    console.error('[CoachService] Error fetching all coaches:', error);
    toast.error('Failed to fetch coaches. Using mock data as fallback.');
    // Return mock data as fallback
    return getMockCoaches();
  }
}

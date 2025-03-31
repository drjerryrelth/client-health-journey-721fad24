
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
      status: (coach.status === 'active' || coach.status === 'inactive') ? coach.status as 'active' | 'inactive' : 'inactive' as const,
      clinicId: coach.clinic_id,
      clients: coach.client_count || 0
    }));
  } catch (error) {
    console.error('[CoachService] Error fetching clinic coaches:', error);
    toast.error('Failed to fetch coaches data. Please try again.');
    // Return empty array as fallback instead of mock data to force frontend to show "No coaches found"
    return [];
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
    
    // Direct database query for admin users
    console.log('[CoachService] Attempting to use admin_get_all_coaches RPC');
    
    // Use the RPC function that avoids RLS issues
    const { data, error } = await supabase.rpc('admin_get_all_coaches');
    
    if (error) {
      console.error('[CoachService] Error from RPC function:', error);
      throw error;
    }
    
    if (!Array.isArray(data)) {
      console.error('[CoachService] Invalid data format from RPC, expected array:', data);
      throw new Error('Invalid data format returned from server');
    }
    
    console.log('[CoachService] Successfully retrieved', data.length, 'coaches via RPC');
    
    // Transform and return the coaches data
    const coaches = data.map(coach => ({
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone || null,
      status: (coach.status === 'active' || coach.status === 'inactive') ? coach.status as 'active' | 'inactive' : 'inactive' as const,
      clinicId: coach.clinic_id,
      clients: coach.client_count || 0
    }));
    
    console.log('[CoachService] Transformed coaches data:', coaches);
    return coaches;
  } catch (error) {
    console.error('[CoachService] Error fetching all coaches:', error);
    toast.error('Failed to fetch coaches data. Please try again.');
    // Return empty array as fallback instead of mock data
    return [];
  }
}


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
    
    // Use RPC call to bypass RLS issues, with aggressive cache-busting
    const timestamp = new Date().getTime();
    const { data, error } = await supabase.rpc(
      'get_clinic_coaches' as any, 
      { clinic_id_param: clinicId, _cache_buster: timestamp }
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
    
    // Transform and return the coaches data using type assertions
    return data.map(coach => {
      const coachObj = coach as any;
      return {
        id: String(coachObj.id || ''),
        name: String(coachObj.name || ''),
        email: String(coachObj.email || ''),
        phone: coachObj.phone || null,
        status: ((coachObj.status === 'active' || coachObj.status === 'inactive') 
          ? coachObj.status as 'active' | 'inactive' 
          : 'inactive') as 'active' | 'inactive',
        clinicId: String(coachObj.clinic_id || ''),
        clients: Number(coachObj.client_count || 0)
      };
    });
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
    console.log('[CoachService] Starting getAllCoaches call with edge function');
    
    // Check authentication before proceeding
    const session = await checkAuthentication();
    if (!session) {
      console.error('[CoachService] User not authenticated');
      throw new Error('Authentication required to fetch coaches');
    }
    
    // Direct database query for admin users with aggressive cache-busting
    console.log('[CoachService] Authentication verified, calling get-all-coaches edge function');
    
    // Use the edge function with enhanced no-cache headers
    const timestamp = new Date().getTime(); 
    const { data, error } = await supabase.functions.invoke('get-all-coaches', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Cache-Buster': timestamp.toString()
      }
    });
    
    if (error) {
      console.error('[CoachService] Error from edge function:', error);
      throw error;
    }
    
    if (!Array.isArray(data)) {
      console.error('[CoachService] Invalid data format from edge function, expected array:', data);
      throw new Error('Invalid data format returned from server');
    }
    
    console.log('[CoachService] Successfully retrieved', data.length, 'coaches via edge function');
    
    if (data.length > 0) {
      console.log('[CoachService] Coach sample:', data[0]);
      console.log('[CoachService] Coach emails:', data.map(c => (c as any).email).join(', '));
    }
    
    // Transform and return the coaches data using type assertions
    const coaches = data.map(coach => {
      const coachObj = coach as any;
      return {
        id: String(coachObj.id || ''),
        name: String(coachObj.name || ''),
        email: String(coachObj.email || ''),
        phone: coachObj.phone || null,
        status: ((coachObj.status === 'active' || coachObj.status === 'inactive') 
          ? coachObj.status as 'active' | 'inactive' 
          : 'inactive') as 'active' | 'inactive',
        clinicId: String(coachObj.clinic_id || ''),
        clients: Number(coachObj.client_count || 0)
      };
    });
    
    console.log('[CoachService] Transformed coaches data:', coaches);
    return coaches;
  } catch (error) {
    console.error('[CoachService] Error fetching all coaches:', error);
    
    // Enhanced error handling to clearly identify the issue
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('infinite recursion')) {
      console.error('[CoachService] Database policy recursion error detected. Contact admin.');
      toast.error('Database policy error detected. Please contact admin to fix RLS policies.');
    } else if (errorMessage.includes('non-2xx status code')) {
      console.error('[CoachService] Edge function returned error. Check function logs.');
      toast.error('Server error. Try refreshing or contact admin if problem persists.');
    } else {
      toast.error('Failed to fetch coaches data. Please try again.');
    }
    
    // Return empty array as fallback 
    return [];
  }
}

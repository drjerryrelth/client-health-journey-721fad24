
import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';
import { toast } from 'sonner';

// Special service function to get total coach count for admin dashboard
export async function getCoachCount(): Promise<number> {
  try {
    console.log('[AdminCoachService] Getting total coach count');
    
    const { count, error } = await supabase
      .from('coaches')
      .select('id', { head: true, count: 'exact' });
      
    if (error) {
      console.error('[AdminCoachService] Count query error:', error);
      // Return zero but don't throw - allow the UI to show zero instead of erroring
      return 0;
    }
    
    // Get count from metadata
    console.log(`[AdminCoachService] Found ${count || 0} coaches in database`);
    return count || 0;
  } catch (error) {
    console.error('[AdminCoachService] Failed to get coach count:', error);
    toast.error('Failed to get coach count');
    return 0;
  }
}

// Get all coaches with their client counts for admin purposes
export async function getAllCoachesForAdmin(): Promise<Coach[]> {
  try {
    console.log('[AdminCoachService] Getting all coaches');
    
    // Use the RPC function that avoids RLS issues
    const { data: coachesData, error: coachesError } = await supabase.rpc('admin_get_all_coaches');
    
    if (coachesError) {
      console.error('[AdminCoachService] Error fetching coaches via RPC:', coachesError);
      throw coachesError;
    }
    
    // If no coaches data, return empty array
    if (!coachesData || !Array.isArray(coachesData) || coachesData.length === 0) {
      console.log('[AdminCoachService] No coaches found in database');
      return [];
    }
    
    console.log(`[AdminCoachService] Found ${coachesData.length} coaches in database`);
    
    // Transform the coaches data to match our expected format
    const transformedCoaches = coachesData.map(coach => ({
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone || '',
      status: coach.status === 'active' ? 'active' : 'inactive' as 'active' | 'inactive',
      clinicId: coach.clinic_id,
      clients: coach.client_count || 0
    }));
    
    console.log('[AdminCoachService] Returning real coaches data with client counts');
    return transformedCoaches;
  } catch (error) {
    console.error('[AdminCoachService] Failed to get all coaches:', error);
    toast.error('Failed to load coaches');
    return [];
  }
}

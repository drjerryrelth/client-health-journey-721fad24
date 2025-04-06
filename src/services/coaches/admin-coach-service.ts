
import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';
import { toast } from 'sonner';

/**
 * Associates the demo coach user with a clinic for testing purposes
 */
export const assignDemoCoachToClinic = async (coachId: string, clinicId: string) => {
  try {
    const { data, error } = await supabase
      .from('coaches')
      .update({ clinic_id: clinicId })
      .eq('id', coachId)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error assigning demo coach to clinic:', error);
    throw error;
  }
};

// Special service function to get total coach count for admin dashboard
export async function getCoachCount(): Promise<number> {
  try {
    console.log('[AdminCoachService] Getting total coach count');
    
    // Try using a direct count with RLS bypass first
    const { data, error } = await supabase.rpc('admin_get_all_coaches');
    
    if (error) {
      console.error('[AdminCoachService] RPC function error:', error);
      
      // Fallback to a direct count if RPC fails
      const { count, error: countError } = await supabase
        .from('coaches')
        .select('id', { head: true, count: 'exact' });
        
      if (countError) {
        console.error('[AdminCoachService] Count query error:', countError);
        // Return zero but don't throw - allow the UI to show zero instead of erroring
        return 0;
      }
      
      // Get count from metadata
      console.log(`[AdminCoachService] Found ${count || 0} coaches in database`);
      return count || 0;
    }
    
    // If RPC succeeded, count the returned coaches
    if (Array.isArray(data)) {
      console.log(`[AdminCoachService] Found ${data.length} coaches via RPC`);
      return data.length;
    }
    
    console.log('[AdminCoachService] No coaches found');
    return 0;
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
    // Using type assertion to inform TypeScript about the structure
    const transformedCoaches = coachesData.map(coach => {
      // Use type assertion to access properties safely
      const coachObj = coach as any;
      
      return {
        id: String(coachObj.id || ''),
        name: String(coachObj.name || ''),
        email: String(coachObj.email || ''),
        phone: coachObj.phone || '',
        status: (coachObj.status === 'active' ? 'active' : 'inactive') as 'active' | 'inactive',
        clinicId: String(coachObj.clinic_id || ''),
        clinic_id: String(coachObj.clinic_id || ''), // Add clinic_id to match the Coach type
        clients: Number(coachObj.client_count || 0)
      };
    });
    
    console.log('[AdminCoachService] Returning real coaches data with client counts');
    return transformedCoaches;
  } catch (error) {
    console.error('[AdminCoachService] Failed to get all coaches:', error);
    toast.error('Failed to load coaches');
    return [];
  }
}

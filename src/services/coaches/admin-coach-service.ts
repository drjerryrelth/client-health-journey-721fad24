import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';
import { toast } from 'sonner';
import { getMockCoaches } from './mock-data';

// Special service function to get total coach count for admin dashboard
export async function getCoachCount(): Promise<number> {
  try {
    console.log('[AdminCoachService] Getting total coach count');
    
    // Use a simple direct query with minimal complexity
    const { count, error } = await supabase
      .from('coaches')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('[AdminCoachService] Direct query error:', error);
      // Try a different approach - count rows by fetching IDs only
      const { data, error: fetchError } = await supabase
        .from('coaches')
        .select('id');
        
      if (fetchError) {
        console.error('[AdminCoachService] Fallback query also failed:', fetchError);
        return 0; // Return 0 rather than failing
      }
      
      return data ? data.length : 0;
    }
    
    console.log(`[AdminCoachService] Found ${count} coaches via direct query`);
    return count || 0;
  } catch (error) {
    console.error('[AdminCoachService] Failed to get coach count:', error);
    // Return a placeholder value so the UI doesn't break
    return 0;
  }
}

// Get all coaches with their client counts for admin purposes
export async function getAllCoachesForAdmin(): Promise<Coach[]> {
  try {
    console.log('[AdminCoachService] Getting all coaches');
    
    // First try direct query as it's simpler and more reliable
    try {
      const { data: coachesData, error: coachesError } = await supabase
        .from('coaches')
        .select(`
          id,
          name,
          email,
          phone,
          status,
          clinic_id
        `);
      
      if (coachesError) {
        console.error('[AdminCoachService] Direct query error:', coachesError);
        throw coachesError;
      }
      
      if (!coachesData || coachesData.length === 0) {
        console.log('[AdminCoachService] No coaches found via direct query');
        return [];
      }
      
      console.log(`[AdminCoachService] Found ${coachesData.length} coaches via direct query`);
      
      // Map and add client counts
      const coachesWithClientCounts = await Promise.all(coachesData.map(async (coach) => {
        const { count, error: countError } = await supabase
          .from('clients')
          .select('id', { count: 'exact', head: true })
          .eq('coach_id', coach.id);
        
        // Ensure status is either 'active' or 'inactive'
        const validStatus = (coach.status === 'active' || coach.status === 'inactive') 
          ? coach.status as 'active' | 'inactive' 
          : 'inactive' as const;
          
        return {
          id: coach.id,
          name: coach.name,
          email: coach.email,
          phone: coach.phone || '',
          status: validStatus,
          clinicId: coach.clinic_id,
          clients: countError ? 0 : (count || 0)
        };
      }));
      
      return coachesWithClientCounts;
    } catch (directQueryError) {
      console.error('[AdminCoachService] Direct query failed, trying edge function:', directQueryError);
      
      // If direct query fails, try edge function as fallback
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[AdminCoachService] No session, returning mock data');
        return getMockCoaches();
      }
      
      const { data, error } = await supabase.functions.invoke('get-all-coaches', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) {
        console.error('[AdminCoachService] Edge function error:', error);
        throw error;
      }
      
      if (!Array.isArray(data)) {
        console.error('[AdminCoachService] Unexpected data format from edge function:', data);
        throw new Error('Unexpected data format');
      }
      
      // Map the data to our Coach type, ensuring status is valid
      return data.map(coach => {
        // Validate and convert the status field
        const validStatus = (coach.status === 'active' || coach.status === 'inactive') 
          ? coach.status as 'active' | 'inactive' 
          : 'inactive' as const;
          
        return {
          id: coach.id,
          name: coach.name,
          email: coach.email,
          phone: coach.phone || '',
          status: validStatus,
          clinicId: coach.clinic_id,
          clients: coach.client_count || 0
        };
      });
    }
  } catch (error) {
    console.error('[AdminCoachService] Failed to get all coaches:', error);
    toast.error('Failed to fetch coaches data');
    return getMockCoaches();
  }
}

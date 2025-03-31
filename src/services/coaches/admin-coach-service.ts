
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
    
    // Get coaches data from the database
    const { data: coachesData, error: coachesError } = await supabase
      .from('coaches')
      .select('*')
      .order('name', { ascending: true });
      
    if (coachesError) {
      console.error('[AdminCoachService] Error fetching coaches:', coachesError);
      toast.error('Error fetching coaches: ' + coachesError.message);
      return [];
    }
    
    // If no coaches data, return empty array
    if (!coachesData || coachesData.length === 0) {
      console.log('[AdminCoachService] No coaches found in database');
      return [];
    }
    
    console.log(`[AdminCoachService] Found ${coachesData.length} coaches in database`);
    
    // For each coach, get their client count
    const coachesWithClients = await Promise.all(coachesData.map(async (coach) => {
      try {
        // Get client count for this coach
        const { count: clientCount, error: clientError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('coach_id', coach.id);
          
        if (clientError) {
          console.error(`[AdminCoachService] Error getting client count for coach ${coach.id}:`, clientError);
          return {
            id: coach.id,
            name: coach.name,
            email: coach.email,
            phone: coach.phone || '',
            status: coach.status === 'active' ? 'active' : 'inactive' as 'active' | 'inactive',
            clinicId: coach.clinic_id,
            clients: 0
          };
        }
        
        return {
          id: coach.id,
          name: coach.name,
          email: coach.email,
          phone: coach.phone || '',
          status: coach.status === 'active' ? 'active' : 'inactive' as 'active' | 'inactive',
          clinicId: coach.clinic_id,
          clients: clientCount || 0
        };
      } catch (error) {
        console.error(`[AdminCoachService] Exception getting client count for coach ${coach.id}:`, error);
        return {
          id: coach.id,
          name: coach.name,
          email: coach.email,
          phone: coach.phone || '',
          status: coach.status === 'active' ? 'active' : 'inactive' as 'active' | 'inactive',
          clinicId: coach.clinic_id,
          clients: 0
        };
      }
    }));
    
    console.log('[AdminCoachService] Returning real coaches data with client counts');
    return coachesWithClients;
  } catch (error) {
    console.error('[AdminCoachService] Failed to get all coaches:', error);
    toast.error('Failed to load coaches');
    return [];
  }
}

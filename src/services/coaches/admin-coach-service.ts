
import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';
import { toast } from 'sonner';
import { getMockCoaches } from './mock-data';

// Define interface for the raw RPC response
interface CoachRPCResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  clinic_id: string;
  client_count: number;
}

// Special service function to get total coach count for admin dashboard
export async function getCoachCount(): Promise<number> {
  try {
    console.log('[AdminCoachService] Getting total coach count');
    
    // Try to get real count from database first
    const { count, error } = await supabase
      .from('coaches')
      .select('id', { head: true, count: 'exact' });
      
    if (error) {
      console.error('[AdminCoachService] Count query error:', error);
      // Fall back to mock data if query fails
      const mockCoaches = getMockCoaches();
      return mockCoaches.length;
    }
    
    // Get count from metadata
    console.log(`[AdminCoachService] Found ${count || 0} coaches in database`);
    return count || 0;
  } catch (error) {
    console.error('[AdminCoachService] Failed to get coach count:', error);
    // Return mock data length as fallback
    const mockCoaches = getMockCoaches();
    return mockCoaches.length;
  }
}

// Get all coaches with their client counts for admin purposes
export async function getAllCoachesForAdmin(): Promise<Coach[]> {
  try {
    console.log('[AdminCoachService] Getting all coaches');
    
    // Try to get real coaches from the database first
    const { data: coachesData, error: coachesError } = await supabase
      .from('coaches')
      .select('*');
      
    if (coachesError) {
      console.error('[AdminCoachService] Error fetching coaches:', coachesError);
      throw coachesError;
    }
    
    // If no coaches data or empty array, return mock data
    if (!coachesData || coachesData.length === 0) {
      console.log('[AdminCoachService] No coaches found in database, using mock data');
      return getMockCoaches();
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
    
    // Return mock data as fallback
    console.log('[AdminCoachService] Using mock data as fallback');
    const mockCoaches = getMockCoaches();
    console.log('[AdminCoachService] Mock coaches:', mockCoaches);
    
    return mockCoaches;
  }
}

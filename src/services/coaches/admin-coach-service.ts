
import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';
import { toast } from 'sonner';
import { getMockCoaches } from './mock-data';

// Special service function to get total coach count for admin dashboard
export async function getCoachCount(): Promise<number> {
  try {
    console.log('[AdminCoachService] Getting total coach count');
    
    // First try to get data from the edge function
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[AdminCoachService] No session, returning 0');
        return 0;
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
      
      if (Array.isArray(data)) {
        console.log(`[AdminCoachService] Successfully got ${data.length} coaches from edge function`);
        return data.length;
      } else {
        console.error('[AdminCoachService] Unexpected data format from edge function:', data);
        throw new Error('Unexpected data format');
      }
    } catch (edgeFunctionError) {
      console.error('[AdminCoachService] Failed with edge function, trying direct query:', edgeFunctionError);
      
      // If edge function fails, try direct query
      const { count, error } = await supabase
        .from('coaches')
        .select('id', { count: 'exact', head: true });
        
      if (error) {
        console.error('[AdminCoachService] Direct query error:', error);
        throw error;
      }
      
      return count || 0;
    }
  } catch (error) {
    console.error('[AdminCoachService] Failed to get coach count:', error);
    toast.error('Failed to fetch coach count');
    return 0;
  }
}

// Get all coaches with their client counts for admin purposes
export async function getAllCoachesForAdmin(): Promise<Coach[]> {
  try {
    console.log('[AdminCoachService] Getting all coaches');
    
    // First try to get data from the edge function
    try {
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
      
      // Map the data to our Coach type
      return data.map(coach => ({
        id: coach.id,
        name: coach.name,
        email: coach.email,
        phone: coach.phone || '',
        status: (coach.status === 'active' || coach.status === 'inactive') ? coach.status : 'inactive',
        clinicId: coach.clinic_id,
        clients: coach.client_count || 0
      }));
    } catch (edgeFunctionError) {
      console.error('[AdminCoachService] Failed with edge function, trying direct query:', edgeFunctionError);
      throw edgeFunctionError;
    }
  } catch (error) {
    console.error('[AdminCoachService] Failed to get all coaches:', error);
    toast.error('Failed to fetch coaches data');
    return getMockCoaches();
  }
}

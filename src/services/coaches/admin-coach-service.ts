
import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';
import { toast } from 'sonner';
import { getMockCoaches } from './mock-data';

// Define a type for the RPC function response
interface CoachRPCResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  clinic_id: string;
  client_count?: number;
}

// Special service function to get total coach count for admin dashboard
export async function getCoachCount(): Promise<number> {
  try {
    console.log('[AdminCoachService] Getting total coach count');
    
    // Use a simpler approach with direct count that avoids RLS recursion
    const { data, error, count } = await supabase
      .from('coaches')
      .select('id', { head: true, count: 'exact' });
      
    if (error) {
      console.error('[AdminCoachService] Count query error:', error);
      return 0; // Return 0 rather than failing
    }
    
    // Get count from metadata
    console.log(`[AdminCoachService] Found ${count || 0} coaches`);
    return count || 0;
  } catch (error) {
    console.error('[AdminCoachService] Failed to get coach count:', error);
    return 0;
  }
}

// Get all coaches with their client counts for admin purposes
export async function getAllCoachesForAdmin(): Promise<Coach[]> {
  try {
    console.log('[AdminCoachService] Getting all coaches using RPC function');
    
    // Attempt to use the new RPC function first (from our SQL migration)
    const { data: coachesData, error: rpcError } = await supabase.rpc('admin_get_all_coaches');
    
    if (rpcError) {
      console.error('[AdminCoachService] RPC function error:', rpcError);
      throw rpcError;
    }
    
    if (!coachesData || coachesData.length === 0) {
      console.log('[AdminCoachService] No coaches found via RPC');
      return [];
    }
    
    console.log(`[AdminCoachService] Found ${coachesData.length} coaches via RPC`);
    
    // Process coaches from the RPC function - properly typed now
    return (coachesData as CoachRPCResponse[]).map(coach => ({
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone || '',
      status: (coach.status === 'active' || coach.status === 'inactive') 
        ? coach.status as 'active' | 'inactive' 
        : 'inactive' as const,
      clinicId: coach.clinic_id,
      clients: coach.client_count || 0
    }));
    
  } catch (error) {
    console.error('[AdminCoachService] Failed to get all coaches:', error);
    
    // Fall back to the direct query approach if the RPC fails
    try {
      console.log('[AdminCoachService] Falling back to direct query approach');
      
      // 1. Get coaches without complex joins or nested queries
      const { data: coachesData, error: coachesError } = await supabase
        .from('coaches')
        .select('id, name, email, phone, status, clinic_id, created_at');
      
      if (coachesError) {
        console.error('[AdminCoachService] Coaches query error:', coachesError);
        throw coachesError;
      }
      
      if (!coachesData || coachesData.length === 0) {
        console.log('[AdminCoachService] No coaches found');
        return [];
      }
      
      console.log(`[AdminCoachService] Found ${coachesData.length} coaches`);
      
      // 2. Get client counts separately for each coach to avoid recursion
      const coachesWithClientCounts: Coach[] = [];
      
      for (const coach of coachesData) {
        try {
          const { count, error: countError } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('coach_id', coach.id);
            
          // Ensure status is either 'active' or 'inactive'
          const validStatus = (coach.status === 'active' || coach.status === 'inactive') 
            ? coach.status as 'active' | 'inactive' 
            : 'inactive' as const;
            
          coachesWithClientCounts.push({
            id: coach.id,
            name: coach.name,
            email: coach.email,
            phone: coach.phone || '',
            status: validStatus,
            clinicId: coach.clinic_id,
            clients: countError ? 0 : (count || 0)
          });
        } catch (err) {
          console.error(`[AdminCoachService] Error getting client count for coach ${coach.id}:`, err);
          
          // Still add the coach, just without clients count
          coachesWithClientCounts.push({
            id: coach.id,
            name: coach.name,
            email: coach.email,
            phone: coach.phone || '',
            status: (coach.status === 'active' || coach.status === 'inactive') 
              ? coach.status as 'active' | 'inactive' 
              : 'inactive' as const,
            clinicId: coach.clinic_id,
            clients: 0
          });
        }
      }
      
      return coachesWithClientCounts;
      
    } catch (directQueryError) {
      console.error('[AdminCoachService] Direct query approach failed:', directQueryError);
      
      // Fallback to mock data if everything else fails
      console.log('[AdminCoachService] Using mock data as final fallback');
      toast.error('Could not load coaches data. Using sample data instead.');
      return getMockCoaches();
    }
  }
}

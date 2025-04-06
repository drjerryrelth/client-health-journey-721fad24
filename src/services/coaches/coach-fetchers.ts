
import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';
import { toast } from 'sonner';
import { checkAuthentication } from '../clinics/auth-helper';

/**
 * Gets all coaches for system administrators
 */
export async function getAllCoachesForAdmin(): Promise<Coach[]> {
  try {
    console.log("[Coach Service] Fetching all coaches for admin");
    
    // Verify user is authenticated
    const session = await checkAuthentication();
    if (!session) {
      console.error("[Coach Service] User is not authenticated");
      toast.error('You must be logged in to view coaches');
      return [];
    }
    
    console.log("[Coach Service] Making request to edge function");
    
    // Use the edge function to fetch all coaches
    const { data, error } = await supabase.functions.invoke('get-all-coaches');
    
    if (error) {
      console.error("[Coach Service] Edge function error:", error);
      toast.error(`Failed to fetch coaches: ${error.message}`);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.error("[Coach Service] Invalid response format:", data);
      toast.error('Failed to fetch coaches: Invalid response format');
      return [];
    }
    
    console.log(`[Coach Service] Successfully fetched ${data.length} coaches`);
    
    // Map database fields to frontend model
    return data.map((coach: any) => ({
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      status: coach.status as 'active' | 'inactive',
      clinicId: coach.clinic_id, // Map clinic_id to clinicId
      clients: coach.client_count || 0
    }));
  } catch (error: any) {
    console.error("[Coach Service] Error in getAllCoachesForAdmin:", error);
    toast.error(`Failed to fetch coaches: ${error.message || 'Unknown error'}`);
    return [];
  }
}

/**
 * Gets coaches for a specific clinic
 */
export async function getClinicCoaches(clinicId: string): Promise<Coach[]> {
  try {
    console.log(`[Coach Service] Fetching coaches for clinic: ${clinicId}`);
    
    // Verify user is authenticated
    const session = await checkAuthentication();
    if (!session) {
      console.error("[Coach Service] User is not authenticated");
      toast.error('You must be logged in to view coaches');
      return [];
    }
    
    // Use RPC function to get clinic coaches
    const { data, error } = await supabase.rpc('get_clinic_coaches', {
      clinic_id_param: clinicId
    });
    
    if (error) {
      console.error("[Coach Service] Error fetching clinic coaches:", error);
      
      // Fallback to direct query
      console.log("[Coach Service] Falling back to direct query");
      const fallbackResult = await supabase
        .from('coaches')
        .select('*')
        .eq('clinic_id', clinicId); // Use clinic_id here, not clinicId
        
      if (fallbackResult.error) {
        console.error("[Coach Service] Fallback query failed:", fallbackResult.error);
        throw fallbackResult.error;
      }
      
      // Map direct query results
      return (fallbackResult.data || []).map(coach => ({
        id: coach.id,
        name: coach.name,
        email: coach.email,
        phone: coach.phone,
        status: coach.status as 'active' | 'inactive',
        clinicId: coach.clinic_id, // Map clinic_id to clinicId
        clients: 0 // No client count available in fallback query
      }));
    }
    
    if (!data || !Array.isArray(data)) {
      console.error("[Coach Service] Invalid RPC response format:", data);
      return [];
    }
    
    // Map JSON response to Coach objects
    return data.map((coach: any) => ({
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      status: coach.status as 'active' | 'inactive',
      clinicId: coach.clinic_id, // Map clinic_id to clinicId
      clients: coach.client_count || 0
    }));
  } catch (error: any) {
    console.error(`[Coach Service] Error in getClinicCoaches:`, error);
    throw error;
  }
}

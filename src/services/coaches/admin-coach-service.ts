
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
    
    // First try using mock data to ensure the dashboard can render
    const mockCoaches = getMockCoaches();
    console.log(`[AdminCoachService] Using mock data with ${mockCoaches.length} coaches`);
    return mockCoaches.length;
    
    /* Commenting out the real implementation until database policies are fixed
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
    */
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
    console.log('[AdminCoachService] Getting all coaches - USING MOCK DATA');
    // Return the mock data directly to ensure dashboard works while DB issues are fixed
    const mockCoaches = getMockCoaches();
    console.log('[AdminCoachService] Returning mock coaches:', mockCoaches);
    return mockCoaches;
    
    /* Commenting out the real implementation until database issues are fixed
    console.log('[AdminCoachService] Getting all coaches using RPC function');
    
    // Get response from RPC function
    const { data, error: rpcError } = await supabase.rpc('admin_get_all_coaches');
    
    if (rpcError) {
      console.error('[AdminCoachService] RPC function error:', rpcError);
      throw rpcError;
    }
    
    // Log the raw data to see what we're getting
    console.log('[AdminCoachService] Raw RPC response:', data);
    
    // Handle empty or non-array response
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('[AdminCoachService] No coaches found via RPC or invalid data format');
      return [];
    }
    
    console.log(`[AdminCoachService] Found ${data.length} coaches via RPC`);
    
    // Cast to any array first to safely access properties
    const coachesRaw = data as any[];
    
    // Map with explicit type checking for each property
    const coaches: Coach[] = coachesRaw
      .filter(coach => coach && typeof coach === 'object')
      .map(coach => ({
        id: String(coach.id || ''),
        name: String(coach.name || ''),
        email: String(coach.email || ''),
        phone: coach.phone ? String(coach.phone) : '',
        status: (coach.status === 'active' || coach.status === 'inactive') 
          ? coach.status as 'active' | 'inactive' 
          : 'inactive' as const,
        clinicId: String(coach.clinic_id || ''),
        clients: typeof coach.client_count === 'number' ? coach.client_count : 0
      }));
    
    console.log('[AdminCoachService] Processed coaches:', coaches);
    return coaches;
    */
  } catch (error) {
    console.error('[AdminCoachService] Failed to get all coaches:', error);
    
    // Return mock data as fallback
    console.log('[AdminCoachService] Using mock data as fallback');
    const mockCoaches = getMockCoaches();
    console.log('[AdminCoachService] Mock coaches:', mockCoaches);
    
    return mockCoaches;
  }
}

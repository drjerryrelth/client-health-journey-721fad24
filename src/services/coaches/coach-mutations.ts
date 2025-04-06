
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkAuthentication } from '../clinics/auth-helper';
import { Coach } from './types';

/**
 * Updates the status of a coach (active/inactive)
 */
export async function updateCoachStatus(coachId: string, status: 'active' | 'inactive'): Promise<boolean> {
  try {
    console.log('[Coach Service] Updating coach status:', { coachId, status });
    
    // Check if user is authenticated using the helper
    const session = await checkAuthentication();
    if (!session) {
      console.error('[Coach Service] User is not authenticated');
      toast.error('You must be logged in to update coach status');
      return false;
    }
    
    // Use RPC function to update coach status to bypass any RLS policy issues
    const { data, error } = await supabase.rpc(
      'update_coach_status',
      { 
        coach_id: coachId,
        coach_status: status
      }
    );
    
    if (error) {
      console.error('[Coach Service] Error updating coach status via RPC:', error);
      throw new Error(`Failed to update coach status: ${error.message}`);
    }
    
    console.log('[Coach Service] Coach status updated successfully:', data);
    toast.success(`Coach status updated to ${status}`);
    return true;
  } catch (error) {
    console.error('[Coach Service] Error updating coach status:', error);
    if (error instanceof Error) {
      toast.error(`Failed to update coach status: ${error.message}`);
    } else {
      toast.error('Failed to update coach status due to an unknown error');
    }
    return false;
  }
}

/**
 * Assigns a client to a coach
 */
export async function assignClientToCoach(clientId: string, coachId: string): Promise<boolean> {
  try {
    console.log('[Coach Service] Assigning client to coach:', { clientId, coachId });
    
    // Check if user is authenticated
    const session = await checkAuthentication();
    if (!session) {
      console.error('[Coach Service] User is not authenticated');
      toast.error('You must be logged in to assign clients');
      return false;
    }
    
    // Use RPC function to assign client
    const { data, error } = await supabase.rpc(
      'assign_client_to_coach',
      { 
        client_id: clientId,
        coach_id: coachId
      }
    );
    
    if (error) {
      console.error('[Coach Service] Error assigning client to coach:', error);
      throw new Error(`Failed to assign client: ${error.message}`);
    }
    
    console.log('[Coach Service] Client assigned to coach successfully:', data);
    toast.success('Client assigned to coach successfully');
    return true;
  } catch (error) {
    console.error('[Coach Service] Error assigning client to coach:', error);
    if (error instanceof Error) {
      toast.error(`Failed to assign client: ${error.message}`);
    } else {
      toast.error('Failed to assign client due to an unknown error');
    }
    return false;
  }
}


import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkAuthentication } from '../clinics/auth-helper';

/**
 * Removes a coach and reassigns their clients
 */
export async function removeCoachAndReassignClients(coachId: string, newCoachId: string): Promise<boolean> {
  try {
    // Check authentication before proceeding
    const session = await checkAuthentication();
    if (!session) {
      console.error('User not authenticated');
      toast.error('Authentication required to remove coach');
      return false;
    }
    
    // First reassign all clients
    const { error: reassignError } = await supabase
      .from('clients')
      .update({ coach_id: newCoachId })
      .eq('coach_id', coachId);

    if (reassignError) throw reassignError;

    // Then delete the coach
    const { error: deleteError } = await supabase
      .from('coaches')
      .delete()
      .eq('id', coachId);

    if (deleteError) throw deleteError;

    toast.success('Clients reassigned and coach removed successfully');
    return true;
  } catch (error) {
    console.error('Error removing coach and reassigning clients:', error);
    toast.error('Failed to remove coach and reassign clients.');
    return false;
  }
}

/**
 * Deletes a coach without reassigning clients
 */
export async function deleteCoach(coachId: string): Promise<boolean> {
  try {
    console.log('[Coach Service] Deleting coach with ID:', coachId);
    
    // Check authentication before proceeding
    const session = await checkAuthentication();
    if (!session) {
      console.error('[Coach Service] User not authenticated');
      toast.error('Authentication required to delete coach');
      return false;
    }
    
    // Delete the coach
    const { error } = await supabase
      .from('coaches')
      .delete()
      .eq('id', coachId);
      
    if (error) {
      console.error('[Coach Service] Error deleting coach:', error);
      throw error;
    }
    
    console.log('[Coach Service] Coach deleted successfully');
    return true;
  } catch (error) {
    console.error('[Coach Service] Error in deleteCoach:', error);
    if (error instanceof Error) {
      toast.error(`Failed to delete coach: ${error.message}`);
    } else {
      toast.error('Failed to delete coach due to an unknown error');
    }
    return false;
  }
}

/**
 * Resets a coach's password by sending them a password reset email
 */
export async function resetCoachPassword(coachEmail: string): Promise<boolean> {
  try {
    console.log('[Coach Service] Sending password reset for coach:', coachEmail);
    
    // Check authentication before proceeding
    const session = await checkAuthentication();
    if (!session) {
      console.error('[Coach Service] User not authenticated');
      toast.error('Authentication required to reset coach password');
      return false;
    }
    
    // Send password reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(coachEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('[Coach Service] Error sending password reset:', error);
      throw error;
    }
    
    console.log('[Coach Service] Password reset email sent successfully');
    return true;
  } catch (error) {
    console.error('[Coach Service] Error in resetCoachPassword:', error);
    if (error instanceof Error) {
      toast.error(`Failed to send password reset: ${error.message}`);
    } else {
      toast.error('Failed to send password reset due to an unknown error');
    }
    return false;
  }
}


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

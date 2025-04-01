
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkAuthentication } from '../clinics/auth-helper';
import { Coach } from './types';

/**
 * Adds a new coach to the database
 */
export async function addCoach(coach: Omit<Coach, 'id' | 'clients'>): Promise<Coach | null> {
  try {
    console.log('[Coach Service] Starting coach addition process');
    console.log('[Coach Service] Coach data:', coach);
    
    // Verify authentication
    const session = await checkAuthentication();
    if (!session) {
      console.error('[Coach Service] User is not authenticated');
      toast.error('You must be logged in to add a coach');
      return null;
    }
    
    console.log('[Coach Service] Authentication successful, user ID:', session.user.id);
    
    // Using the add_coach RPC function with explicit type casting
    const { data, error } = await supabase.rpc(
      'add_coach', 
      {
        coach_name: coach.name,
        coach_email: coach.email,
        coach_phone: coach.phone,
        coach_status: coach.status,
        coach_clinic_id: coach.clinicId
      }
    );

    console.log('[Coach Service] RPC response:', { data, error });

    if (error) {
      console.error('[Coach Service] Error adding coach via RPC:', error);
      toast.error(`Failed to add coach: ${error.message}`);
      return null;
    }
    
    if (!data) {
      console.error('[Coach Service] Invalid RPC response:', data);
      toast.error('Failed to add coach: Invalid server response');
      return null;
    }
    
    // Parse the response data properly
    // The data should be a JSON object, so we'll type cast it
    const responseData = data as {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      status: string;
      clinic_id: string;
    };
    
    // Construct the return object from the RPC response
    const newCoach: Coach = {
      id: responseData.id,
      name: responseData.name,
      email: responseData.email,
      phone: responseData.phone,
      status: responseData.status as 'active' | 'inactive',
      clinicId: responseData.clinic_id,
      clients: 0
    };
    
    console.log('[Coach Service] Coach added successfully:', newCoach);
    toast.success('Coach added successfully!');
    return newCoach;
    
  } catch (error) {
    console.error('[Coach Service] Error adding coach:', error);
    if (error instanceof Error) {
      toast.error(`Failed to add coach: ${error.message}`);
    } else {
      toast.error('Failed to add coach due to an unknown error');
    }
    return null;
  }
}

/**
 * Updates an existing coach in the database
 */
export async function updateCoach(id: string, coach: Partial<Omit<Coach, 'id' | 'clients'>>): Promise<Coach | null> {
  try {
    console.log('[Coach Service] Updating coach with ID:', id);
    console.log('[Coach Service] Update data:', coach);

    // Check if user is authenticated using the helper
    const session = await checkAuthentication();
    if (!session) {
      console.error('[Coach Service] User is not authenticated');
      toast.error('You must be logged in to update a coach');
      return null;
    }
    
    // Prepare the update payload - convert to snake_case for database
    const updates: Record<string, any> = {};
    if (coach.name !== undefined) updates.name = coach.name;
    if (coach.email !== undefined) updates.email = coach.email;
    if (coach.phone !== undefined) updates.phone = coach.phone;
    if (coach.status !== undefined) updates.status = coach.status;
    if (coach.clinicId !== undefined) updates.clinic_id = coach.clinicId;
    
    console.log('[Coach Service] Prepared updates:', updates);
    
    // Check if there are any updates to apply
    if (Object.keys(updates).length === 0) {
      console.log('[Coach Service] No updates to apply');
      return null;
    }
    
    // Direct database update
    const { data, error } = await supabase
      .from('coaches')
      .update(updates)
      .eq('id', id)
      .select(`
        id, 
        name, 
        email, 
        phone, 
        status, 
        clinic_id
      `)
      .single();

    if (error) {
      console.error('[Coach Service] Error updating coach via direct update:', error);
      throw new Error(`Failed to update coach: ${error.message}`);
    }
    
    if (!data) {
      console.error('[Coach Service] No data returned from coach update');
      throw new Error('Failed to update coach: No data returned from server');
    }
    
    console.log('[Coach Service] Updated coach successfully:', data);
    
    // Get the client count for this coach
    let clientCount = 0;
    try {
      const { count } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('coach_id', id);
        
      clientCount = count || 0;
    } catch (countError) {
      console.warn('[Coach Service] Error counting clients:', countError);
    }
    
    // Return the updated coach with proper structure
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status as 'active' | 'inactive',
      clinicId: data.clinic_id,
      clients: clientCount
    };
  } catch (error) {
    console.error('[Coach Service] Error updating coach:', error);
    if (error instanceof Error) {
      toast.error(`Failed to update coach: ${error.message}`);
    } else {
      toast.error('Failed to update coach due to an unknown error');
    }
    return null;
  }
}

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

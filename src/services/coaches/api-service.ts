
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkAuthentication } from '../clinics/auth-helper';
import { Coach } from './types';
import { getMockCoaches } from './mock-data';

export async function getClinicCoaches(clinicId: string): Promise<Coach[]> {
  try {
    console.log('Fetching coaches for clinic:', clinicId);
    
    // Check authentication before proceeding
    const session = await checkAuthentication();
    if (!session) {
      console.error('User not authenticated');
      throw new Error('Authentication required to fetch coaches');
    }
    
    // Use RPC call to bypass RLS issues
    const { data, error } = await supabase.rpc(
      'get_clinic_coaches' as any, 
      { clinic_id_param: clinicId }
    );

    if (error) {
      console.error('Error fetching coaches:', error);
      throw error;
    }
    
    console.log('Fetched coaches data from RPC:', data);
    
    if (!Array.isArray(data)) {
      console.error('Invalid data format, expected array:', data);
      throw new Error('Invalid data format returned from server');
    }
    
    // Transform and return the coaches data
    return data.map(coach => ({
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      status: coach.status as 'active' | 'inactive',
      clinicId: coach.clinic_id,
      clients: coach.client_count || 0
    }));
  } catch (error) {
    console.error('Error fetching clinic coaches:', error);
    toast.error('Failed to fetch coaches. Using mock data as fallback.');
    // Return mock data as fallback
    return getMockCoaches().filter(coach => coach.clinicId === clinicId);
  }
}

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
      'add_coach' as any, 
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

export async function updateCoach(id: string, coach: Partial<Omit<Coach, 'id' | 'clients'>>): Promise<Coach | null> {
  try {
    // Check if user is authenticated using the helper
    const session = await checkAuthentication();
    if (!session) {
      console.error('User is not authenticated');
      toast.error('You must be logged in to update a coach');
      return null;
    }
    
    const updates: any = {};
    if (coach.name) updates.name = coach.name;
    if (coach.email) updates.email = coach.email;
    if (coach.phone !== undefined) updates.phone = coach.phone;
    if (coach.status) updates.status = coach.status;
    if (coach.clinicId) updates.clinic_id = coach.clinicId;
    
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
        clinic_id,
        clients:clients(id)
      `)
      .single();

    if (error) {
      console.error('Error updating coach:', error);
      toast.error(`Failed to update coach: ${error.message}`);
      throw error;
    }
    
    if (!data) {
      console.error('No data returned from coach update');
      toast.error('Failed to update coach: No data returned from server');
      return null;
    }
    
    console.log('Updated coach successfully:', data);
    toast.success('Coach updated successfully!');
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status as 'active' | 'inactive',
      clinicId: data.clinic_id,
      clients: Array.isArray(data.clients) ? data.clients.length : 0
    };
  } catch (error) {
    console.error('Error updating coach:', error);
    if (error instanceof Error) {
      toast.error(`Failed to update coach: ${error.message}`);
    } else {
      toast.error('Failed to update coach due to an unknown error');
    }
    return null;
  }
}

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


import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkAuthentication } from '../clinics/auth-helper';
import { Coach } from './types';

/**
 * Adds a new coach to the database
 */
export async function addCoach(coach: Omit<Coach, 'id'>): Promise<Coach | null> {
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
    
    // Convert clinicId to clinic_id for the database
    const dbCoachData = {
      coach_name: coach.name,
      coach_email: coach.email,
      coach_phone: coach.phone,
      coach_status: coach.status,
      coach_clinic_id: coach.clinicId // Will be mapped to clinic_id in the RPC function
    };
    
    console.log('[Coach Service] Prepared data for RPC call:', dbCoachData);
    
    // Add timeout to prevent hanging
    const coachPromise = supabase.rpc(
      'add_coach', 
      dbCoachData
    );
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Coach addition timed out')), 10000);
    });
    
    // Race between actual operation and timeout
    const { data, error } = await Promise.race([
      coachPromise,
      timeoutPromise.then(() => {
        console.warn('[Coach Service] RPC request timed out');
        return { data: null, error: new Error('Request timed out') };
      }),
    ]);

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
      clinicId: responseData.clinic_id, // Map clinic_id back to clinicId for our frontend
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
    
    // Use RPC function to update coach (similar to add_coach)
    // This should bypass any RLS policy issues
    const { data, error } = await supabase.rpc(
      'update_coach',
      {
        coach_id: id,
        coach_name: coach.name,
        coach_email: coach.email,
        coach_phone: coach.phone,
        coach_status: coach.status,
        coach_clinic_id: coach.clinicId // Will be mapped to clinic_id in the RPC function
      }
    );
    
    if (error) {
      console.error('[Coach Service] Error updating coach via RPC:', error);
      throw new Error(`Failed to update coach: ${error.message}`);
    }
    
    if (!data) {
      console.error('[Coach Service] No data returned from coach update');
      throw new Error('Failed to update coach: No data returned from server');
    }
    
    console.log('[Coach Service] Updated coach successfully:', data);
    
    // Parse the response data
    const responseData = data as {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      status: string;
      clinic_id: string;
      client_count: number;
    };
    
    // Return the updated coach with proper structure
    const updatedCoach: Coach = {
      id: responseData.id,
      name: responseData.name,
      email: responseData.email,
      phone: responseData.phone,
      status: responseData.status as 'active' | 'inactive',
      clinicId: responseData.clinic_id, // Map clinic_id back to clinicId for our frontend
      clients: responseData.client_count || 0
    };
    
    toast.success('Coach updated successfully!');
    return updatedCoach;
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

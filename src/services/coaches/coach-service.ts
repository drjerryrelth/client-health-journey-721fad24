
import { supabase } from '@/integrations/supabase/client';
import { Coach } from './types';

/**
 * Get all coaches for a specific clinic
 */
export async function getClinicCoaches(clinicId: string): Promise<Coach[]> {
  try {
    console.log(`Fetching coaches for clinic: ${clinicId}`);
    
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('clinicId', clinicId);
    
    if (error) {
      console.error('Error fetching clinic coaches:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} coaches for clinic ${clinicId}`);
    return data as Coach[];
  } catch (err) {
    console.error('Exception in getClinicCoaches:', err);
    throw err;
  }
}

/**
 * Get all coaches across all clinics (admin only)
 */
export async function getAllCoaches(): Promise<Coach[]> {
  try {
    console.log('Fetching all coaches (admin function)');
    
    const { data, error } = await supabase
      .from('coaches')
      .select('*');
    
    if (error) {
      console.error('Error fetching all coaches:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} total coaches`);
    return data as Coach[];
  } catch (err) {
    console.error('Exception in getAllCoaches:', err);
    throw err;
  }
}

/**
 * Update coach active status
 */
export async function updateCoachStatus(coachId: string, status: 'active' | 'inactive'): Promise<Coach> {
  try {
    const { data, error } = await supabase
      .from('coaches')
      .update({ status })
      .eq('id', coachId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating coach status:', error);
      throw error;
    }
    
    return data as Coach;
  } catch (err) {
    console.error('Exception in updateCoachStatus:', err);
    throw err;
  }
}

/**
 * Create a new coach
 */
export async function createCoach(coach: Omit<Coach, 'id'>): Promise<Coach> {
  try {
    const { data, error } = await supabase
      .from('coaches')
      .insert([coach])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating coach:', error);
      throw error;
    }
    
    return data as Coach;
  } catch (err) {
    console.error('Exception in createCoach:', err);
    throw err;
  }
}

/**
 * Update an existing coach
 */
export async function updateCoach(coachId: string, coach: Partial<Coach>): Promise<Coach> {
  try {
    const { data, error } = await supabase
      .from('coaches')
      .update(coach)
      .eq('id', coachId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating coach:', error);
      throw error;
    }
    
    return data as Coach;
  } catch (err) {
    console.error('Exception in updateCoach:', err);
    throw err;
  }
}

/**
 * Delete a coach
 */
export async function deleteCoach(coachId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('coaches')
      .delete()
      .eq('id', coachId);
    
    if (error) {
      console.error('Error deleting coach:', error);
      throw error;
    }
  } catch (err) {
    console.error('Exception in deleteCoach:', err);
    throw err;
  }
}

/**
 * Reset coach password by sending a password reset email
 */
export async function resetCoachPassword(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Error resetting coach password:', error);
      throw error;
    }
  } catch (err) {
    console.error('Exception in resetCoachPassword:', err);
    throw err;
  }
}


import { Coach } from './types';
import { supabase } from '@/lib/supabase';

// Get coaches for a specific clinic
export const getClinicCoaches = async (clinicId: string): Promise<Coach[]> => {
  try {
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('clinicId', clinicId);
      
    if (error) {
      console.error('Error fetching coaches for clinic:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getClinicCoaches:', err);
    return [];
  }
};

// Get all coaches (for admin use)
export const getAllCoaches = async (): Promise<Coach[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-all-coaches');
    
    if (error) {
      console.error('Error fetching all coaches:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getAllCoaches:', err);
    return [];
  }
};

// Update coach status (active/inactive)
export const updateCoachStatus = async (coachId: string, status: 'active' | 'inactive'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('coaches')
      .update({ status })
      .eq('id', coachId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error updating coach status:', err);
    return false;
  }
};

// Add a new coach - using "addCoach" name for compatibility
export const addCoach = async (coachData: Omit<Coach, 'id'>): Promise<Coach | null> => {
  return createCoach(coachData);
};

// Add a new coach - primary implementation (both functions point to this implementation)
export const createCoach = async (coachData: Omit<Coach, 'id'>): Promise<Coach | null> => {
  try {
    // First create the coach record
    const { data: coach, error: coachError } = await supabase
      .from('coaches')
      .insert(coachData)
      .select()
      .single();
      
    if (coachError) {
      console.error('Error creating coach:', coachError);
      return null;
    }
    
    if (!coach) {
      console.error('No coach data returned after creation');
      return null;
    }
    
    // Update the user's profile with their coach_id if user_id is provided
    if (coachData.user_id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ coach_id: coach.id })
        .eq('id', coachData.user_id);
        
      if (profileError) {
        console.error('Error updating profile with coach_id:', profileError);
        // Don't return null here - the coach was created successfully
      }
    }
    
    return coach;
  } catch (err) {
    console.error('Error in createCoach:', err);
    return null;
  }
};

// Update coach information
export const updateCoach = async (coachId: string, coachData: Partial<Coach>): Promise<Coach | null> => {
  try {
    const { data, error } = await supabase
      .from('coaches')
      .update(coachData)
      .eq('id', coachId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating coach:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in updateCoach:', err);
    return null;
  }
};

// Delete a coach
export const deleteCoach = async (coachId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('coaches')
      .delete()
      .eq('id', coachId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error deleting coach:', err);
    return false;
  }
};

// Reset coach password
export const resetCoachPassword = async (coachEmail: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(coachEmail);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error resetting coach password:', err);
    return false;
  }
};


// This file serves as a compatibility layer for components that use the legacy CoachService API
// It re-exports functions from the more specialized service files

import { Coach } from './types';
import { supabase } from '@/lib/supabase';
import { getClinicCoaches, getAllCoaches } from './coach-fetchers';
import { addCoach, updateCoach, deleteCoach, resetCoachPassword } from './coach-crud';

// Re-export functions to maintain API compatibility
export { 
  getClinicCoaches, 
  getAllCoaches,
  addCoach,
  updateCoach,
  deleteCoach,
  resetCoachPassword
};

// Legacy implementation preserved for backward compatibility
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

// Legacy implementation preserved for backward compatibility
export const createCoach = async (coachData: Omit<Coach, 'id'>): Promise<Coach | null> => {
  try {
    const { data, error } = await supabase
      .from('coaches')
      .insert(coachData)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding coach:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in createCoach:', err);
    return null;
  }
};


// This file serves as a compatibility layer for components that use the legacy CoachService API
// It re-exports functions from the more specialized service files

import { Coach } from './types';
import { supabase } from '@/integrations/supabase/client';
import { getClinicCoaches, getAllCoaches } from './coach-fetchers';
import { addCoach, updateCoach, deleteCoach, resetCoachPassword } from './coach-crud';
import { updateCoachStatus } from './coach-mutations';

// Re-export functions to maintain API compatibility
export { 
  getClinicCoaches, 
  getAllCoaches,
  addCoach,
  updateCoach,
  deleteCoach,
  resetCoachPassword,
  updateCoachStatus
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

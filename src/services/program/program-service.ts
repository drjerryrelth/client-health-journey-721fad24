import { supabase } from '@/integrations/supabase/client';
import { Program } from '@/types/database';
import { UserData } from '@/types/auth';
import { canAccessProgramTemplates } from '@/utils/role-based-access';

export const ProgramService = {
  /**
   * Get all programs accessible to the user
   */
  async getPrograms(user: UserData | null): Promise<Program[]> {
    try {
      let query = supabase
        .from('programs')
        .select('*')
        .eq('status', 'active');

      // If user can access templates, include them
      if (canAccessProgramTemplates(user)) {
        query = query.or('clinic_id.is.null,clinic_id.eq.' + user?.clinicId);
      } else {
        // Only show clinic-specific programs
        query = query.eq('clinic_id', user?.clinicId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching programs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPrograms:', error);
      throw error;
    }
  },

  /**
   * Get a specific program by ID
   */
  async getProgramById(id: string, user: UserData | null): Promise<Program | null> {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching program:', error);
        throw error;
      }

      // Check if user has access to this program
      if (data.clinic_id && data.clinic_id !== user?.clinicId) {
        if (!canAccessProgramTemplates(user)) {
          throw new Error('Access denied to this program');
        }
      }

      return data;
    } catch (error) {
      console.error('Error in getProgramById:', error);
      throw error;
    }
  },

  /**
   * Create a new program
   */
  async createProgram(program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>, user: UserData | null): Promise<Program> {
    try {
      // Validate user can create programs
      if (!user) {
        throw new Error('User must be authenticated');
      }

      // If creating a template, check permissions
      if (!program.clinicId && !canAccessProgramTemplates(user)) {
        throw new Error('Insufficient permissions to create program templates');
      }

      const { data, error } = await supabase
        .from('programs')
        .insert([{
          ...program,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating program:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createProgram:', error);
      throw error;
    }
  },

  /**
   * Update an existing program
   */
  async updateProgram(id: string, updates: Partial<Program>, user: UserData | null): Promise<Program> {
    try {
      // First get the existing program to check permissions
      const existingProgram = await this.getProgramById(id, user);

      if (!existingProgram) {
        throw new Error('Program not found');
      }

      // Check if user can modify this program
      if (existingProgram.clinicId && existingProgram.clinicId !== user?.clinicId) {
        if (!canAccessProgramTemplates(user)) {
          throw new Error('Insufficient permissions to modify this program');
        }
      }

      const { data, error } = await supabase
        .from('programs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating program:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProgram:', error);
      throw error;
    }
  },

  /**
   * Delete a program
   */
  async deleteProgram(id: string, user: UserData | null): Promise<void> {
    try {
      // First get the existing program to check permissions
      const existingProgram = await this.getProgramById(id, user);

      if (!existingProgram) {
        throw new Error('Program not found');
      }

      // Check if user can delete this program
      if (existingProgram.clinicId && existingProgram.clinicId !== user?.clinicId) {
        if (!canAccessProgramTemplates(user)) {
          throw new Error('Insufficient permissions to delete this program');
        }
      }

      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting program:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteProgram:', error);
      throw error;
    }
  }
}; 
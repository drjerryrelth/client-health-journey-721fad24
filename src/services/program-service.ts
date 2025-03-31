
import { supabase } from '@/integrations/supabase/client';
import { Program, Supplement, mapDbProgramToProgram, mapProgramToDbProgram, mapSupplementToDbSupplement } from '@/types';
import { SupplementRow } from '@/types/database';

export const ProgramService = {
  // Fetch all programs for a specific clinic
  async getClinicPrograms(clinicId: string): Promise<Program[]> {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('clinic_id', clinicId)
        .order('name');

      if (error) throw error;
      
      // Fetch supplements for each program
      const programsWithSupplements = await Promise.all(
        (data || []).map(async (program) => {
          const supplements = await this.getProgramSupplements(program.id);
          
          // Get client count for each program
          const { count: clientCount, error: countError } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('program_id', program.id);
            
          if (countError) {
            console.error('Error fetching client count:', countError);
          }
          
          const mappedProgram = mapDbProgramToProgram(program, supplements);
          // Add client count to the program object
          mappedProgram.clientCount = clientCount || 0;
          
          return mappedProgram;
        })
      );
      
      return programsWithSupplements;
    } catch (error) {
      console.error('Error fetching clinic programs:', error);
      throw error;
    }
  },
  
  // Fetch a specific program by ID
  async getProgramById(programId: string): Promise<Program | null> {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', programId)
        .single();

      if (error) throw error;
      if (!data) return null;
      
      // Fetch supplements for the program
      const supplements = await this.getProgramSupplements(programId);
      
      return mapDbProgramToProgram(data, supplements);
    } catch (error) {
      console.error('Error fetching program details:', error);
      throw error;
    }
  },
  
  // Create a new program
  async createProgram(program: Omit<Program, 'id' | 'supplements'>, supplements: Omit<Supplement, 'id'>[]): Promise<Program> {
    try {
      // Convert program to database format
      const dbProgram = mapProgramToDbProgram(program);
      
      // Insert program
      const { data, error } = await supabase
        .from('programs')
        .insert([dbProgram])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create program');
      
      // Create supplements for the program
      if (supplements && supplements.length > 0) {
        const supplementsWithProgramId = supplements.map(supplement => 
          mapSupplementToDbSupplement(supplement, data.id)
        );
        
        const { error: suppError } = await supabase
          .from('supplements')
          .insert(supplementsWithProgramId);
          
        if (suppError) throw suppError;
      }
      
      // Fetch supplements to return complete program
      const createdSupplements = await this.getProgramSupplements(data.id);
      
      return mapDbProgramToProgram(data, createdSupplements);
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },
  
  // Update an existing program
  async updateProgram(programId: string, updates: Partial<Omit<Program, 'supplements'>>, supplements?: Partial<Supplement>[]): Promise<Program> {
    try {
      // Convert program updates to database format
      // Only include fields that are actually present in the updates
      const dbProgramUpdates: any = {};
      if (updates.name) dbProgramUpdates.name = updates.name;
      if (updates.description) dbProgramUpdates.description = updates.description;
      if (updates.duration) dbProgramUpdates.duration = updates.duration;
      if (updates.type) dbProgramUpdates.type = updates.type;
      if (updates.checkInFrequency) dbProgramUpdates.check_in_frequency = updates.checkInFrequency;
      if (updates.clinicId) dbProgramUpdates.clinic_id = updates.clinicId;
      
      // Update program details
      const { data, error } = await supabase
        .from('programs')
        .update(dbProgramUpdates)
        .eq('id', programId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error(`Failed to update program with ID ${programId}`);
      
      // If supplements provided, update them
      if (supplements && supplements.length > 0) {
        // First delete existing supplements
        await supabase
          .from('supplements')
          .delete()
          .eq('program_id', programId);
          
        // Then insert new supplements
        const supplementsWithProgramId = supplements.map(supplement => {
          // Ensure all required fields are present
          if (!supplement.name || !supplement.description || !supplement.dosage || !supplement.frequency) {
            throw new Error('Supplement is missing required fields');
          }
          
          return mapSupplementToDbSupplement({
            name: supplement.name,
            description: supplement.description,
            dosage: supplement.dosage,
            frequency: supplement.frequency,
            timeOfDay: supplement.timeOfDay
          }, programId);
        });
        
        await supabase
          .from('supplements')
          .insert(supplementsWithProgramId);
      }
      
      // Fetch updated supplements
      const updatedSupplements = await this.getProgramSupplements(programId);
      
      return mapDbProgramToProgram(data, updatedSupplements);
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  },
  
  // Get supplements for a specific program
  async getProgramSupplements(programId: string): Promise<SupplementRow[]> {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('program_id', programId);

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching program supplements:', error);
      throw error;
    }
  },
  
  // Delete a program
  async deleteProgram(programId: string): Promise<void> {
    try {
      // Delete program (cascade will handle supplements)
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }
};

export default ProgramService;

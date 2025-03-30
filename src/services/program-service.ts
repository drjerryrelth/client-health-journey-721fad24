
import supabase from '@/lib/supabase';
import { Program, Supplement } from '@/types';

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
        data.map(async (program) => {
          const supplements = await this.getProgramSupplements(program.id);
          return {
            ...program,
            supplements,
          };
        })
      );
      
      return programsWithSupplements as Program[];
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
      
      // Fetch supplements for the program
      const supplements = await this.getProgramSupplements(programId);
      
      return {
        ...data,
        supplements,
      } as Program;
    } catch (error) {
      console.error('Error fetching program details:', error);
      throw error;
    }
  },
  
  // Create a new program
  async createProgram(program: Omit<Program, 'id' | 'supplements'>, supplements: Omit<Supplement, 'id'>[]): Promise<Program> {
    const { supplements: _, ...programData } = program as any;
    
    try {
      // Start a transaction
      const { data, error } = await supabase
        .from('programs')
        .insert([programData])
        .select()
        .single();

      if (error) throw error;
      
      // Create supplements for the program
      if (supplements && supplements.length > 0) {
        const supplementsWithProgramId = supplements.map(supplement => ({
          ...supplement,
          program_id: data.id,
        }));
        
        const { error: suppError } = await supabase
          .from('supplements')
          .insert(supplementsWithProgramId);
          
        if (suppError) throw suppError;
      }
      
      // Fetch supplements to return complete program
      const createdSupplements = await this.getProgramSupplements(data.id);
      
      return {
        ...data,
        supplements: createdSupplements,
      } as Program;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },
  
  // Update an existing program
  async updateProgram(programId: string, updates: Partial<Omit<Program, 'supplements'>>, supplements?: Partial<Supplement>[]): Promise<Program> {
    const { supplements: _, ...programUpdates } = updates as any;
    
    try {
      // Update program details
      const { data, error } = await supabase
        .from('programs')
        .update(programUpdates)
        .eq('id', programId)
        .select()
        .single();

      if (error) throw error;
      
      // If supplements provided, update them
      if (supplements && supplements.length > 0) {
        // First delete existing supplements
        await supabase
          .from('supplements')
          .delete()
          .eq('program_id', programId);
          
        // Then insert new supplements
        const supplementsWithProgramId = supplements.map(supplement => ({
          ...supplement,
          program_id: programId,
        }));
        
        await supabase
          .from('supplements')
          .insert(supplementsWithProgramId);
      }
      
      // Fetch updated supplements
      const updatedSupplements = await this.getProgramSupplements(programId);
      
      return {
        ...data,
        supplements: updatedSupplements,
      } as Program;
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  },
  
  // Get supplements for a specific program
  async getProgramSupplements(programId: string): Promise<Supplement[]> {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('program_id', programId);

      if (error) throw error;
      
      return data as Supplement[];
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

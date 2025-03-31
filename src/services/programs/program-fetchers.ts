
import { supabase } from '@/integrations/supabase/client';
import { Program, mapDbProgramToProgram } from '@/types';
import { getSupplementsByProgramId } from './supplement-service';

/**
 * Fetches all programs for a specific clinic with their supplements and client counts
 */
export async function getClinicPrograms(clinicId: string): Promise<Program[]> {
  try {
    console.log("ProgramService: Fetching programs for clinic ID:", clinicId);
    
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('name');

    if (error) {
      console.error("Error fetching programs:", error);
      throw error;
    }
    
    console.log("Programs data returned:", data?.length || 0, "programs");
    
    // Fetch supplements for each program and add client count
    const programsWithSupplements = await Promise.all(
      (data || []).map(async (program) => {
        const supplements = await getSupplementsByProgramId(program.id);
        
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
        
        console.log(`Program ${program.id} has ${clientCount || 0} clients`);
        
        return mappedProgram;
      })
    );
    
    return programsWithSupplements;
  } catch (error) {
    console.error('Error fetching clinic programs:', error);
    throw error;
  }
}

/**
 * Fetches a specific program by ID with its supplements
 */
export async function getProgramById(programId: string): Promise<Program | null> {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    // Fetch supplements for the program
    const supplements = await getSupplementsByProgramId(programId);
    
    return mapDbProgramToProgram(data, supplements);
  } catch (error) {
    console.error('Error fetching program details:', error);
    throw error;
  }
}

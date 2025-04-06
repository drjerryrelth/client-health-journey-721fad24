
import { supabase } from '@/integrations/supabase/client';
import { Program, mapDbProgramToProgram } from '@/types';
import { SupplementRow } from '@/types/database';
import { getSupplementsByProgramId } from './supplement-service';

/**
 * Fetches all programs for a specific clinic with their supplements and client counts
 * Also includes global programs when global=true
 */
export async function getClinicPrograms(clinicId: string, global: boolean = true): Promise<Program[]> {
  try {
    console.log("ProgramService: Fetching programs for clinic ID:", clinicId, "including global:", global);
    
    if (!clinicId) {
      console.error("Missing clinic ID in getClinicPrograms");
      return [];
    }
    
    // Build the query - using global flag to determine whether to include all programs
    let query = supabase.from('programs').select('*');
    
    if (global) {
      // If global flag is true, fetch both clinic-specific and global programs (null clinic_id)
      query = query.or(`clinic_id.eq.${clinicId},clinic_id.is.null`);
    } else {
      // Otherwise, just fetch clinic-specific programs
      query = query.eq('clinic_id', clinicId);
    }
    
    // Order the results by name
    let { data, error } = await query.order('name'); // Changed from const to let

    if (error) {
      console.error("Error fetching programs:", error);
      throw error;
    }
    
    console.log("Programs data returned:", data?.length || 0, "programs");
    
    if (!data || data.length === 0) {
      console.log("No programs found for clinic:", clinicId, "with global flag:", global);
      
      // If no programs found with clinic ID, try to fetch global programs if we haven't already
      if (!global) {
        console.log("Attempting to fetch global programs as fallback");
        const { data: globalData, error: globalError } = await supabase
          .from('programs')
          .select('*')
          .is('clinic_id', null)
          .order('name');
          
        if (globalError) {
          console.error("Error fetching global programs:", globalError);
          return [];
        }
        
        if (!globalData || globalData.length === 0) {
          console.log("No global programs found either");
          return [];
        }
        
        console.log("Found", globalData.length, "global programs");
        data = globalData; // Now we can reassign data since it's a let variable
      } else {
        return [];
      }
    }
    
    // Fetch supplements for each program and add client count
    const programsWithSupplements = await Promise.all(
      data.map(async (program) => {
        try {
          const supplements = await getSupplementsByProgramId(program.id);
          
          // Get client count for each program
          const { count: clientCount, error: countError } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('program_id', program.id);
            
          if (countError) {
            console.error(`Error fetching client count for program ${program.id}:`, countError);
          }
          
          const mappedProgram = mapDbProgramToProgram(program);
          // Add supplements to the program object
          mappedProgram.supplements = supplements;
          // Add client count to the program object
          mappedProgram.clientCount = clientCount || 0;
          
          // Add isGlobal flag for UI if needed
          mappedProgram.isGlobal = program.clinic_id === null;
          
          console.log(`Program ${program.id} (${program.name}) has ${clientCount || 0} clients, isGlobal: ${mappedProgram.isGlobal}`);
          
          return mappedProgram;
        } catch (error) {
          console.error(`Error processing program ${program.id}:`, error);
          const mappedProgram = mapDbProgramToProgram(program);
          mappedProgram.supplements = [];
          mappedProgram.clientCount = 0;
          mappedProgram.isGlobal = program.clinic_id === null;
          return mappedProgram;
        }
      })
    );
    
    return programsWithSupplements;
  } catch (error) {
    console.error('Error fetching clinic programs:', error);
    throw error;
  }
}

/**
 * Fetches all programs regardless of clinic with their supplements and client counts
 */
export async function getAllPrograms(): Promise<Program[]> {
  try {
    console.log("ProgramService: Fetching all programs");
    
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('name');

    if (error) {
      console.error("Error fetching all programs:", error);
      throw error;
    }
    
    console.log("All programs data returned:", data?.length || 0, "programs");
    
    if (!data || data.length === 0) {
      console.log("No programs found in database");
      return [];
    }
    
    // Fetch supplements for each program and add client count
    const programsWithSupplements = await Promise.all(
      data.map(async (program) => {
        try {
          const supplements = await getSupplementsByProgramId(program.id);
          
          // Get client count for each program
          const { count: clientCount, error: countError } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('program_id', program.id);
            
          if (countError) {
            console.error(`Error fetching client count for program ${program.id}:`, countError);
          }
          
          const mappedProgram = mapDbProgramToProgram(program);
          // Add supplements to the program object
          mappedProgram.supplements = supplements;
          // Add client count to the program object
          mappedProgram.clientCount = clientCount || 0;
          
          console.log(`Program ${program.id} (${program.name}) has ${clientCount || 0} clients`);
          
          return mappedProgram;
        } catch (error) {
          console.error(`Error processing program ${program.id}:`, error);
          // Return a basic program with default values if there's an error
          const mappedProgram = mapDbProgramToProgram(program);
          mappedProgram.supplements = [];
          mappedProgram.clientCount = 0;
          return mappedProgram;
        }
      })
    );
    
    console.log("Final programs data with supplements and client counts:", programsWithSupplements);
    return programsWithSupplements;
  } catch (error) {
    console.error('Error fetching all programs:', error);
    throw error;
  }
}

/**
 * Fetches a specific program by ID with its supplements
 */
export async function getProgramById(programId: string): Promise<Program | null> {
  try {
    console.log(`ProgramService: Fetching program with ID: ${programId}`);
    
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching program ${programId}:`, error);
      throw error;
    }
    
    if (!data) {
      console.log(`No program found with ID: ${programId}`);
      return null;
    }
    
    console.log(`Found program: ${data.name}`);
    
    // Fetch supplements for the program
    const supplements = await getSupplementsByProgramId(programId);
    
    // Map the database program to application Program type
    const program = mapDbProgramToProgram(data);
    // Add supplements to the program
    program.supplements = supplements;
    
    // Get client count for the program
    const { count: clientCount, error: countError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('program_id', programId);
      
    if (countError) {
      console.error(`Error fetching client count for program ${programId}:`, countError);
    }
    
    program.clientCount = clientCount || 0;
    
    console.log(`Program details complete for ${program.name}, client count: ${program.clientCount}`);
    
    return program;
  } catch (error) {
    console.error('Error fetching program details:', error);
    throw error;
  }
}

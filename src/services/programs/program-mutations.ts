
import { supabase } from '@/integrations/supabase/client';
import { Program, mapProgramToDbProgram } from '@/types';
import { createSupplements, updateSupplements } from './supplement-service';
import { getProgramById } from './program-fetchers';

/**
 * Creates a new program with its supplements
 */
export async function createProgram(
  program: Omit<Program, 'id' | 'supplements'>, 
  supplements: Omit<Program['supplements'][0], 'id'>[]
): Promise<Program> {
  try {
    // Ensure we have a clinic ID
    if (!program.clinicId) {
      console.error('Missing clinic ID in createProgram');
      throw new Error('Missing clinic ID. Cannot create program without a clinic ID.');
    }
    
    console.log('Creating program with clinic ID:', program.clinicId);
    
    // Convert program to database format
    const dbProgram = mapProgramToDbProgram(program);
    
    // Insert program
    const { data, error } = await supabase
      .from('programs')
      .insert([dbProgram])
      .select()
      .single();

    if (error) {
      console.error('Error creating program:', error);
      throw error;
    }
    
    if (!data) {
      console.error('Failed to create program - no data returned');
      throw new Error('Failed to create program');
    }
    
    console.log('Program created successfully:', data);
    
    // Create supplements for the program
    await createSupplements(supplements, data.id);
    
    // Get the complete program with supplements
    const createdProgram = await getProgramById(data.id);
    if (!createdProgram) {
      throw new Error(`Failed to fetch newly created program with ID ${data.id}`);
    }
    
    return createdProgram;
  } catch (error) {
    console.error('Error creating program:', error);
    throw error;
  }
}

/**
 * Updates an existing program and its supplements
 */
export async function updateProgram(
  programId: string, 
  updates: Partial<Omit<Program, 'supplements'>>, 
  supplements?: Partial<Program['supplements'][0]>[]
): Promise<Program> {
  try {
    // Convert program updates to database format
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
      await updateSupplements(programId, supplements);
    }
    
    // Get the updated program with supplements
    const updatedProgram = await getProgramById(programId);
    if (!updatedProgram) {
      throw new Error(`Failed to fetch updated program with ID ${programId}`);
    }
    
    return updatedProgram;
  } catch (error) {
    console.error('Error updating program:', error);
    throw error;
  }
}

/**
 * Deletes a program and its supplements
 */
export async function deleteProgram(programId: string): Promise<void> {
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


import { supabase } from '@/integrations/supabase/client';
import { SupplementRow, mapSupplementToDbSupplement } from '@/types';
import { Supplement } from '@/types';

/**
 * Fetches all supplements for a specific program
 */
export async function getSupplementsByProgramId(programId: string): Promise<SupplementRow[]> {
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
}

/**
 * Creates supplements for a program
 */
export async function createSupplements(
  supplements: Omit<Supplement, 'id'>[],
  programId: string
): Promise<void> {
  if (!supplements || supplements.length === 0) return;
  
  try {
    const supplementsWithProgramId = supplements.map(supplement => 
      mapSupplementToDbSupplement(supplement, programId)
    );
    
    const { error } = await supabase
      .from('supplements')
      .insert(supplementsWithProgramId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error creating supplements:', error);
    throw error;
  }
}

/**
 * Updates supplements for a program by deleting existing ones and creating new ones
 */
export async function updateSupplements(
  programId: string, 
  supplements?: Partial<Supplement>[]
): Promise<void> {
  if (!supplements || supplements.length === 0) return;
  
  try {
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
  } catch (error) {
    console.error('Error updating supplements:', error);
    throw error;
  }
}


import { supabase } from '@/integrations/supabase/client';
import { ProgramService } from './programs';
import { toast } from 'sonner';

/**
 * Service to initialize default programs in the system if they don't exist
 */
export const ProgramInitializer = {
  async initializeDefaultPrograms(clinicId: string): Promise<void> {
    try {
      console.log('Checking for default programs...');
      
      // Check if Practice Naturals program exists
      const { data: existingPrograms } = await supabase
        .from('programs')
        .select('name')
        .in('name', ['Practice Naturals', 'ChiroThin']);
      
      const programsToCreate = [];
      
      // Practice Naturals
      if (!existingPrograms?.some(p => p.name === 'Practice Naturals')) {
        programsToCreate.push({
          program: {
            name: 'Practice Naturals',
            description: 'A 30 or 60-day nutrition program with personalized food portions based on client categories (A, B, or C). Focuses on proteins, fruits, and vegetables for breakfast, lunch, and dinner.',
            type: 'practice_naturals',
            duration: 30, // Default to 30-day version
            checkInFrequency: 'daily',
            clinicId
          },
          supplements: [
            {
              name: 'Multivitamin',
              description: 'Daily multivitamin supplement',
              dosage: '1 tablet',
              frequency: 'daily',
              timeOfDay: 'morning'
            },
            {
              name: 'Omega-3',
              description: 'Essential fatty acids',
              dosage: '1 capsule',
              frequency: 'daily',
              timeOfDay: 'evening'
            },
            {
              name: 'Probiotic',
              description: 'Gut health support',
              dosage: '1 capsule',
              frequency: 'daily',
              timeOfDay: 'morning'
            }
          ]
        });
      }
      
      // ChiroThin
      if (!existingPrograms?.some(p => p.name === 'ChiroThin')) {
        programsToCreate.push({
          program: {
            name: 'ChiroThin',
            description: 'A 6-week program with uniform meal plans. Clients fast overnight with no breakfast, consuming 4oz each of protein, fruits, and vegetables for lunch and dinner.',
            type: 'chirothin',
            duration: 42, // 6 weeks
            checkInFrequency: 'daily',
            clinicId
          },
          supplements: [
            {
              name: 'ChiroThin Drops',
              description: 'Proprietary formula to support weight loss',
              dosage: '10 drops',
              frequency: '3x daily',
              timeOfDay: 'before meals'
            },
            {
              name: 'B12 Complex',
              description: 'Energy support',
              dosage: '1 capsule',
              frequency: 'daily',
              timeOfDay: 'morning'
            }
          ]
        });
      }
      
      // Create any missing default programs
      for (const programData of programsToCreate) {
        console.log(`Creating default program: ${programData.program.name}`);
        await ProgramService.createProgram(
          programData.program,
          programData.supplements
        );
      }
      
      if (programsToCreate.length > 0) {
        console.log(`${programsToCreate.length} default programs created`);
        toast(`${programsToCreate.length} default programs have been added to your account.`);
      } else {
        console.log('Default programs already exist');
      }
    } catch (error) {
      console.error('Error initializing default programs:', error);
      toast("Failed to initialize default programs.");
    }
  }
};

export default ProgramInitializer;

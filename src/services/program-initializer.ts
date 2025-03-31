
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProgramService } from './programs';

// Initialize default programs for newly created clinics
export const ProgramInitializer = {
  async initializeDefaultPrograms(clinicId: string): Promise<void> {
    try {
      // First check if the clinic already has any programs
      const { data: existingPrograms } = await supabase
        .from('programs')
        .select('id')
        .eq('clinic_id', clinicId)
        .limit(1);

      // If programs already exist, don't create defaults
      if (existingPrograms && existingPrograms.length > 0) {
        console.log('Default programs not created: Clinic already has programs');
        return;
      }

      // Create Practice Naturals program with supplements
      await ProgramService.createProgram(
        {
          name: 'Practice Naturals',
          description: 'A comprehensive program focusing on natural nutrition and wellness.',
          duration: 84, // 12 weeks
          type: 'practice_naturals',
          checkInFrequency: 'weekly',
          clinicId: clinicId
        },
        [
          {
            name: 'Vitamin D3',
            description: 'Important for immune function and bone health.',
            dosage: '2000 IU',
            frequency: 'daily',
            timeOfDay: 'morning'
          },
          {
            name: 'Omega-3',
            description: 'Supports heart and brain health.',
            dosage: '1000mg',
            frequency: 'daily',
            timeOfDay: 'with meals'
          },
          {
            name: 'Magnesium',
            description: 'Helps with muscle and nerve function.',
            dosage: '400mg',
            frequency: 'daily',
            timeOfDay: 'evening'
          }
        ]
      );

      // Create ChiroThin program
      await ProgramService.createProgram(
        {
          name: 'ChiroThin',
          description: 'A doctor-supervised weight loss program.',
          duration: 42, // 6 weeks
          type: 'chirothin',
          checkInFrequency: 'weekly',
          clinicId: clinicId
        },
        [
          {
            name: 'ChiroThin Drops',
            description: 'Proprietary formula to support the ChiroThin program.',
            dosage: '15 drops',
            frequency: '3x daily',
            timeOfDay: 'before meals'
          }
        ]
      );

      // Create Basic Nutrition program
      await ProgramService.createProgram(
        {
          name: 'Essential Nutrition',
          description: 'Focus on balanced diet and proper nutritional intake.',
          duration: 30, // 30 days
          type: 'nutrition',
          checkInFrequency: 'weekly',
          clinicId: clinicId
        },
        []
      );

      console.log('Default programs created successfully for clinic:', clinicId);

    } catch (error) {
      console.error('Failed to initialize default programs:', error);
      toast({
        description: "Failed to create default programs. Please try again.",
        variant: "destructive"
      });
    }
  }
};

export default ProgramInitializer;

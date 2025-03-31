
import { supabase } from '@/integrations/supabase/client';
import { assignDemoCoachToClinic } from './coaches/admin-coach-service';
import { toast } from 'sonner';

/**
 * Initialize demo data relationships for testing
 */
export const initializeDemoRelationships = async () => {
  try {
    console.log('Initializing demo relationships...');
    
    // Find the demo coach user ID
    const { data: coachUser, error: coachError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'support@practicenaturals.com')
      .single();
    
    if (coachError || !coachUser) {
      console.log('Demo coach user not found:', coachError);
      return;
    }
    
    console.log('Found demo coach user:', coachUser.id);
    
    // Find Genesis Red Light clinic ID
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('id')
      .ilike('name', '%Genesis Red Light%')
      .single();
    
    if (clinicError || !clinic) {
      console.log('Genesis Red Light clinic not found:', clinicError);
      return;
    }
    
    console.log('Found Genesis Red Light clinic:', clinic.id);
    
    // Assign the coach to the clinic
    await assignDemoCoachToClinic(coachUser.id, clinic.id);
    console.log('Demo coach assigned to Genesis Red Light clinic');
    
    // Check if the coach already exists in the coaches table
    const { data: existingCoach, error: existingCoachError } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', coachUser.id)
      .single();
    
    // If coach doesn't exist in coaches table, create a record
    if (existingCoachError || !existingCoach) {
      console.log('Creating coach record for demo user');
      
      const { data: userData } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', coachUser.id)
        .single();
        
      if (userData) {
        await supabase
          .from('coaches')
          .upsert({
            id: coachUser.id,
            name: userData.full_name,
            email: userData.email,
            status: 'active',
            clinic_id: clinic.id
          });
        
        console.log('Coach record created successfully');
      }
    } else {
      // Update existing coach record to ensure clinic association
      await supabase
        .from('coaches')
        .update({ clinic_id: clinic.id, status: 'active' })
        .eq('id', coachUser.id);
      
      console.log('Existing coach record updated with clinic association');
    }
  } catch (error) {
    console.error('Error initializing demo relationships:', error);
  }
};

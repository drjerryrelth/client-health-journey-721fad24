
import { supabase } from '@/integrations/supabase/client';
import { ensureDemoProfileExists } from '../demo';

// Helper to ensure clinic profile exists
export const ensureClinicProfileExists = async (userId: string, email: string) => {
  try {
    // Check if this email is associated with a clinic
    const { data: clinicData, error: clinicError } = await supabase
      .from('clinics')
      .select('id, name, email')
      .eq('email', email)
      .single();
    
    if (clinicError) {
      console.log('Not a clinic user:', clinicError.message);
      return false; // Not a clinic user
    }
    
    console.log('Found clinic for email:', email, clinicData);
    
    // Create or update the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: clinicData.name || 'Clinic User',
        email: email,
        role: 'coach', // Default role for clinic users
        clinic_id: clinicData.id,
      });
    
    if (profileError) {
      console.error('Error creating clinic profile:', profileError);
      return false;
    }
    
    console.log('Successfully created profile for clinic user');
    return true;
  } catch (error) {
    console.error('Error ensuring clinic profile exists:', error);
    return false;
  }
};

// Helper function to handle profile creation after login
export const handleProfileCreation = async (userId: string, email: string, isDemoAccount: boolean) => {
  // For demo accounts, ensure the profile exists
  if (isDemoAccount) {
    await ensureDemoProfileExists(userId, email);
  } else {
    // Check if this might be a clinic user
    const isClinic = await ensureClinicProfileExists(userId, email);
    console.log('Clinic user check result:', isClinic);
  }
};

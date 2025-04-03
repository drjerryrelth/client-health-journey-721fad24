
import { supabase } from '@/integrations/supabase/client';
import { autoConfirmDemoEmail } from './confirmation-handler';

/**
 * Helper function to determine if an email address is for a demo clinic signup
 * Demo clinic emails will follow a specific pattern for easy identification
 * @param email The email to check
 */
export const isDemoClinicEmail = (email: string): boolean => {
  return email.endsWith('.demo@example.com') || 
         email.includes('demo-clinic') || 
         email.includes('democlinic');
};

/**
 * Handle demo clinic signup
 * This function handles the special case of demo clinic signups
 * @param email Clinic email
 * @param clinicName Clinic name
 * @param primaryContact Primary contact name
 */
export const handleDemoClinicSignup = async (
  email: string,
  password: string, 
  clinicName: string, 
  primaryContact: string
): Promise<boolean> => {
  try {
    console.log('Processing demo clinic signup:', email);

    // For demo clinics, create the auth user with a standard password
    const signUpData = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: primaryContact,
          role: 'coach', // Default role for clinic primary contact is coach
        }
      }
    });
    
    if (signUpData.error) {
      // If error is because user already exists, that's fine for demo purposes
      if (signUpData.error.message?.includes('already registered')) {
        console.log('Demo clinic user already exists, will proceed with setup');
      } else if (signUpData.error.message?.includes('rate limit')) {
        console.error('Rate limit hit during demo clinic creation:', signUpData.error.message);
        throw new Error('Demo clinic creation rate limited. Please try again later.');
      } else {
        console.warn('Could not create demo clinic user:', signUpData.error.message);
        return false;
      }
    } else {
      console.log('Demo clinic user created successfully');
      
      // For demo accounts, immediately confirm the email
      try {
        await autoConfirmDemoEmail(email);
      } catch (confirmErr) {
        console.error('Error confirming demo clinic email:', confirmErr);
      }
    }
    
    // Create the clinic record
    const { data: clinicData, error: clinicError } = await supabase
      .from('clinics')
      .insert({
        name: clinicName,
        email: email,
        primary_contact: primaryContact,
        status: 'active'
      })
      .select('id')
      .single();
      
    if (clinicError) {
      console.error('Error creating demo clinic:', clinicError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in handleDemoClinicSignup:', error);
    throw error;
  }
};

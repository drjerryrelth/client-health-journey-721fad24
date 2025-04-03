
import { supabase } from '@/integrations/supabase/client';
import { autoConfirmDemoEmail } from './confirmation-handler';

/**
 * Helper function to determine if an email address is for a demo clinic signup
 * Demo clinic emails will follow a specific pattern for easy identification
 * @param email The email to check
 */
export const isDemoClinicEmail = (email: string): boolean => {
  // Accept ANY @example.com email as a demo email
  return email.toLowerCase().endsWith('@example.com');
};

/**
 * Handle demo clinic signup
 * This function handles the special case of demo clinic signups with consistent error handling
 * @param email Clinic email
 * @param password User password
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
    
    // Use the exact email provided - no modifications or timestamping
    // Create auth user with the provided email exactly as entered
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: primaryContact,
          role: 'clinic_admin', // Set role to clinic_admin for clinic primary contact
        }
      }
    });
    
    // Handle sign-up errors with improved messaging
    if (signUpError) {
      // Handle case where user already exists
      if (signUpError.message?.includes('already registered')) {
        console.log('Demo clinic user already exists, will proceed with setup');
      } else if (signUpError.message?.includes('rate limit')) {
        console.error('Rate limit error:', signUpError.message);
        throw new Error('Demo clinic creation rate limited. Please try again in a few minutes.');
      } else {
        console.error('Demo clinic user creation error:', signUpError.message);
        throw new Error(`Could not create demo clinic user: ${signUpError.message}`);
      }
    } else {
      console.log('Demo clinic user created successfully');
      
      // Auto-confirm the email for demo accounts
      try {
        await autoConfirmDemoEmail(email);
        console.log('Demo clinic email auto-confirmed');
      } catch (confirmErr) {
        console.error('Error confirming demo email:', confirmErr);
        // Continue execution - this is not a critical error
      }
    }
    
    // Create the clinic record with the original email
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
      // If the clinic already exists, handle gracefully
      if (clinicError.code === '23505') { // Unique violation
        console.log('Clinic record already exists, continuing');
        
        // Get the clinic ID
        const { data: existingClinic } = await supabase
          .from('clinics')
          .select('id')
          .eq('email', email)
          .single();
          
        if (existingClinic?.id) {
          // Update the user's profile with the clinic_id and role
          if (signUpData?.user?.id) {
            await supabase
              .from('profiles')
              .upsert({
                id: signUpData.user.id,
                email: email,
                full_name: primaryContact,
                role: 'clinic_admin',
                clinic_id: existingClinic.id
              });
          }
        }
        
        return true;
      } else {
        console.error('Error creating demo clinic record:', clinicError);
        throw new Error(`Failed to create clinic record: ${clinicError.message}`);
      }
    } else if (clinicData?.id && signUpData?.user?.id) {
      // Update the user's profile with the clinic_id and role
      await supabase
        .from('profiles')
        .upsert({
          id: signUpData.user.id,
          email: email,
          full_name: primaryContact,
          role: 'clinic_admin',
          clinic_id: clinicData.id
        });
    }
    
    console.log('Demo clinic setup completed successfully');
    return true;
  } catch (error: any) {
    console.error('Error in demo clinic signup process:', error);
    throw error;
  }
};

/**
 * Check if a demo clinic account already exists
 * @param email The email to check
 */
export const isDemoClinicAccountExists = async (email: string): Promise<boolean> => {
  if (!isDemoClinicEmail(email)) return false;
  
  try {
    // First check if the user exists in auth
    const { data, error } = await supabase
      .from('clinics')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    return !!data?.id;
  } catch (error) {
    console.error('Error checking if demo clinic exists:', error);
    return false;
  }
};

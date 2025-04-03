
import { supabase } from '@/integrations/supabase/client';
import { autoConfirmDemoEmail } from './confirmation-handler';

/**
 * Helper function to determine if an email address is for a demo clinic signup
 * Demo clinic emails will follow a specific pattern for easy identification
 * @param email The email to check
 */
export const isDemoClinicEmail = (email: string): boolean => {
  // Accept any email that ends with .demo@example.com (including those with numbers)
  return email.endsWith('.demo@example.com') || 
         email.includes('demo-clinic') || 
         email.includes('democlinic');
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

    // Create auth user with provided password
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: primaryContact,
          role: 'coach', // Default role for clinic primary contact is coach
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
      } else if (signUpError.message?.includes('Email address') && signUpError.message?.includes('invalid')) {
        // Special case for email validation errors
        console.error('Email validation error:', signUpError.message);
        throw new Error(`The email format "${email}" appears to be invalid. Please use a valid email format like "myclinic.demo@example.com".`);
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
        console.error('Error confirming demo clinic email:', confirmErr);
        // Continue execution - this is not a critical error
      }
    }
    
    // Create the clinic record
    const { data: clinicData, error: clinicError } = await supabase
      .from('clinics')
      .insert({
        name: clinicName,
        email,
        primary_contact: primaryContact,
        status: 'active'
      })
      .select('id')
      .single();
      
    if (clinicError) {
      // If the clinic already exists, handle gracefully
      if (clinicError.code === '23505') { // Unique violation
        console.log('Clinic record already exists, continuing');
        return true;
      } else {
        console.error('Error creating demo clinic record:', clinicError);
        throw new Error(`Failed to create clinic record: ${clinicError.message}`);
      }
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

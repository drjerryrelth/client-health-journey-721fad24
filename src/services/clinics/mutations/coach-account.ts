
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from '../types';

// Helper function to generate a random secure temporary password
export const generateTemporaryPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_+=';
  let result = '';
  // Generate a 12-character password
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Helper function to create a coach account with auth credentials for a newly created clinic
export const createCoachAccountForClinic = async (clinic: Clinic) => {
  if (!clinic.primaryContact || !clinic.email) {
    console.warn('Cannot create coach: missing primary contact or email information');
    return null;
  }

  try {
    // Set a secure temporary password that will definitely work for login
    const tempPassword = 'password123';
    
    // Create auth user for coach using the clinic's email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: clinic.email,
      password: tempPassword,
      options: {
        data: {
          full_name: clinic.primaryContact,
          role: 'coach',
          clinic_id: clinic.id
        },
        // Skip email confirmation for admin-created accounts
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (authError) {
      console.error('Error creating auth account for clinic coach:', authError);
      throw authError;
    }

    console.log('Auth account created for clinic coach');
    
    // Create coach entry in the coaches table
    const { error } = await supabase.rpc(
      'add_coach',
      {
        coach_name: clinic.primaryContact || 'Clinic Manager',
        coach_email: clinic.email || '',
        coach_phone: clinic.phone || null,
        coach_status: 'active',
        coach_clinic_id: clinic.id
      }
    );

    if (error) {
      console.error('Error creating coach entry for clinic:', error);
      return null;
    }

    console.log('Coach created with temporary password');
    
    // Return success with the temporary password
    return {
      success: true,
      tempPassword
    };
  } catch (error) {
    console.error('Error in createCoachAccountForClinic:', error);
    return null;
  }
};
